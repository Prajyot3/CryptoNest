const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'cpp-backend', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `${timestamp}_${file.originalname}`);
  }
});

const upload = multer({ storage });

// Path to Python script
const encryptorPath = path.join(__dirname, '..', 'cpp-backend', 'encryptor.py');

// OpenSSL path - add to PATH for command execution
const opensslPath = path.join(__dirname, 'openssl_mock');
const execEnv = {
  ...process.env,
  PATH: opensslPath + ';' + process.env.PATH
};

// Helper to execute commands with OpenSSL in PATH
const execWithOpenSSL = (command, options = {}) => {
  return execAsync(command, {
    ...options,
    env: execEnv
  });
};

// Helper function to clean up files
const cleanupFiles = async (...files) => {
  for (const file of files) {
    try {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    } catch (e) {
      console.error('Cleanup error:', e);
    }
  }
};

// Helper function to clean up directory
const cleanupDir = async (dir) => {
  try {
    if (fs.existsSync(dir)) {
      fs.rmdirSync(dir, { recursive: true });
    }
  } catch (e) {
    console.error('Cleanup dir error:', e);
  }
};

// ========================= API Endpoints =========================

// Generate RSA Key Pair
app.post('/api/keygen', async (req, res) => {
  const timestamp = Date.now();
  const uploadDir = path.join(__dirname, '..', 'cpp-backend', 'uploads');

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const publicKeyPath = path.join(uploadDir, `pubkey_${timestamp}.pem`);
  const privateKeyPath = path.join(uploadDir, `privkey_${timestamp}.pem`);

  try {
    const command = `python "${encryptorPath}" keygen "${publicKeyPath}" "${privateKeyPath}"`;
    await execWithOpenSSL(command, { cwd: path.join(__dirname, '..', 'cpp-backend') });

    // Read the generated keys
    const publicKey = fs.readFileSync(publicKeyPath, 'utf8');
    const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

    // Clean up
    await cleanupFiles(publicKeyPath, privateKeyPath);

    res.json({
      success: true,
      publicKey,
      privateKey
    });
  } catch (error) {
    await cleanupFiles(publicKeyPath, privateKeyPath);
    console.error('Keygen error:', error);
    res.status(500).json({
      success: false,
      error: 'Key generation failed'
    });
  }
});

// Encrypt File
app.post('/api/encrypt', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'File is required' });
  }

  const method = req.body.method || 'hybrid';
  const key = req.body.key;  // Password
  const publicKey = req.body.publicKey;  // For hybrid

  const timestamp = Date.now();
  const uploadDir = path.join(__dirname, '..', 'cpp-backend', 'uploads');
  const inputFilePath = req.file.path;
  const outputFilePath = path.join(uploadDir, `output_${timestamp}.enc`);

  let publicKeyPath = null;

  try {
    let command;

    if (method === 'password') {
      if (!key) {
        await cleanupFiles(inputFilePath);
        return res.status(400).json({ error: 'Password is required' });
      }
      command = `python "${encryptorPath}" encrypt-pwd "${inputFilePath}" "${outputFilePath}" "${key}"`;
    } else {
      // hybrid (default)
      if (!publicKey) {
        await cleanupFiles(inputFilePath);
        return res.status(400).json({ error: 'Public key is required' });
      }

      // Save public key to temp file
      publicKeyPath = path.join(uploadDir, `pubkey_${timestamp}.pem`);
      fs.writeFileSync(publicKeyPath, publicKey);

      command = `python "${encryptorPath}" encrypt "${inputFilePath}" "${outputFilePath}" "${publicKeyPath}"`;
    }

    const { stdout, stderr } = await execWithOpenSSL(command, {
      cwd: path.join(__dirname, '..', 'cpp-backend')
    });

    console.log('Encrypt stdout:', stdout);
    if (stderr) console.log('Encrypt stderr:', stderr);

    // Read encrypted file
    const encryptedData = fs.readFileSync(outputFilePath);

    // Clean up
    await cleanupFiles(inputFilePath, outputFilePath);
    if (publicKeyPath) await cleanupFiles(publicKeyPath);

    // Send encrypted file
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${req.file.originalname}.enc"`
    });
    res.send(encryptedData);

  } catch (error) {
    await cleanupFiles(inputFilePath, outputFilePath);
    if (publicKeyPath) await cleanupFiles(publicKeyPath);

    console.error('Encrypt error:', error);
    res.status(500).json({
      error: 'Encryption failed',
      details: error.stderr || error.message
    });
  }
});

// Decrypt File
app.post('/api/decrypt', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'File is required' });
  }

  const method = req.body.method || 'hybrid';
  const key = req.body.key;  // Password
  const privateKey = req.body.privateKey;  // For hybrid

  const timestamp = Date.now();
  const uploadDir = path.join(__dirname, '..', 'cpp-backend', 'uploads');
  const inputFilePath = req.file.path;
  const outputDir = path.join(uploadDir, `output_${timestamp}`);

  let privateKeyPath = null;

  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    let command;

    if (method === 'password') {
      if (!key) {
        await cleanupFiles(inputFilePath);
        await cleanupDir(outputDir);
        return res.status(400).json({ error: 'Password is required' });
      }
      command = `python "${encryptorPath}" decrypt-pwd "${inputFilePath}" "${outputDir}" "${key}"`;
    } else {
      // hybrid (default)
      if (!privateKey) {
        await cleanupFiles(inputFilePath);
        await cleanupDir(outputDir);
        return res.status(400).json({ error: 'Private key is required' });
      }

      // Save private key to temp file
      privateKeyPath = path.join(uploadDir, `privkey_${timestamp}.pem`);
      fs.writeFileSync(privateKeyPath, privateKey);

      command = `python "${encryptorPath}" decrypt "${inputFilePath}" "${outputDir}" "${privateKeyPath}"`;
    }

    const { stdout, stderr } = await execWithOpenSSL(command, {
      cwd: path.join(__dirname, '..', 'cpp-backend')
    });

    console.log('Decrypt stdout:', stdout);
    if (stderr) console.log('Decrypt stderr:', stderr);

    // Find the decrypted file
    const files = fs.readdirSync(outputDir);
    if (files.length === 0) {
      throw new Error('No decrypted file found');
    }

    const decryptedFileName = files[0];
    const decryptedFilePath = path.join(outputDir, decryptedFileName);
    const decryptedData = fs.readFileSync(decryptedFilePath);

    // Clean up
    await cleanupFiles(inputFilePath, decryptedFilePath);
    if (privateKeyPath) await cleanupFiles(privateKeyPath);
    await cleanupDir(outputDir);

    // Send decrypted file
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${decryptedFileName}"`
    });
    res.send(decryptedData);

  } catch (error) {
    await cleanupFiles(inputFilePath);
    if (privateKeyPath) await cleanupFiles(privateKeyPath);
    await cleanupDir(outputDir);

    console.error('Decrypt error:', error);

    // Check for specific errors
    const errorMessage = error.stderr || error.message || '';

    if (errorMessage.includes('Wrong password')) {
      return res.status(400).json({
        error: 'Wrong password! The password you entered is incorrect.'
      });
    }

    if (errorMessage.includes('Wrong private key') || errorMessage.includes('CryptDecrypt RSA')) {
      return res.status(400).json({
        error: 'Wrong private key! The key does not match.'
      });
    }

    if (errorMessage.includes('Checksum verification failed')) {
      return res.status(400).json({
        error: 'Verification failed! Wrong key or corrupted file.'
      });
    }

    if (errorMessage.includes('Invalid file format')) {
      return res.status(400).json({
        error: 'Invalid file format. The file may be encrypted with a different version.'
      });
    }

    res.status(500).json({
      error: 'Decryption failed',
      details: errorMessage
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    version: 'v3',
    features: ['RSA+AES Hybrid', 'Password Encryption', 'Checksum Verification']
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n===========================================`);
  console.log(`CryptoNest Backend Server v4`);
  console.log(`===========================================`);
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`\nEndpoints:`);
  console.log(`  POST /api/keygen  - Generate RSA key pair`);
  console.log(`  POST /api/encrypt - Encrypt file`);
  console.log(`  POST /api/decrypt - Decrypt file`);
  console.log(`  GET  /api/health  - Health check`);
  console.log(`===========================================\n`);
});