import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, unlink, readdir, rmdir } from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const method = formData.get('method') || 'hybrid'; // 'hybrid' or 'password'
    const key = formData.get('key'); // For password
    const privateKey = formData.get('privateKey'); // For hybrid decryption

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    // Validate based on method
    if (method === 'password' && !key) {
      return NextResponse.json({ error: 'Password is required for password-based decryption' }, { status: 400 });
    }
    if (method === 'hybrid' && !privateKey) {
      return NextResponse.json({ error: 'Private key is required for hybrid decryption' }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'cpp-backend', 'uploads');
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir, { recursive: true });
    }

    // Save uploaded encrypted file temporarily
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const timestamp = Date.now();
    const inputFilePath = path.join(uploadsDir, `encrypted_${timestamp}_${file.name}`);
    const outputDir = path.join(uploadsDir, `output_${timestamp}`);

    // Create output directory
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    await writeFile(inputFilePath, buffer);

    // For hybrid decryption, save the private key to a temp file
    let privateKeyPath = null;
    if (method === 'hybrid') {
      privateKeyPath = path.join(uploadsDir, `privkey_${timestamp}.pem`);
      await writeFile(privateKeyPath, privateKey);
    }

    // Execute Python script for decryption
    const pythonScript = path.join(process.cwd(), 'cpp-backend', 'encryptor.py');

    try {
      let command;
      if (method === 'password') {
        command = `python "${pythonScript}" decrypt-pwd "${inputFilePath}" "${outputDir}" "${key}"`;
      } else {
        // hybrid (default)
        command = `python "${pythonScript}" decrypt "${inputFilePath}" "${outputDir}" "${privateKeyPath}"`;
      }

      const { stdout, stderr } = await execAsync(command, {
        cwd: path.join(process.cwd(), 'cpp-backend')
      });

      console.log('C++ stdout:', stdout);
      if (stderr) console.log('C++ stderr:', stderr);

      // Find the decrypted file in the output directory
      const files = await readdir(outputDir);
      if (files.length === 0) {
        throw new Error('No decrypted file found');
      }

      const decryptedFileName = files[0];
      const decryptedFilePath = path.join(outputDir, decryptedFileName);
      const decryptedData = await readFile(decryptedFilePath);

      // Clean up temporary files
      await unlink(inputFilePath);
      await unlink(decryptedFilePath);
      if (privateKeyPath && existsSync(privateKeyPath)) {
        await unlink(privateKeyPath);
      }

      // Try to remove the output directory
      try {
        await rmdir(outputDir);
      } catch (rmdirError) {
        // Ignore
      }

      // Return the decrypted file
      return new NextResponse(decryptedData, {
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': `attachment; filename="${decryptedFileName}"`,
        },
      });

    } catch (execError) {
      // Clean up files in case of error
      try {
        await unlink(inputFilePath);
        if (privateKeyPath && existsSync(privateKeyPath)) {
          await unlink(privateKeyPath);
        }
        try {
          const files = await readdir(outputDir);
          for (const f of files) {
            await unlink(path.join(outputDir, f));
          }
          await rmdir(outputDir);
        } catch (cleanupError) {
          console.error('Output directory cleanup error:', cleanupError);
        }
      } catch (cleanupError) {
        console.error('Cleanup error:', cleanupError);
      }

      console.error('C++ execution error:', execError);
      return NextResponse.json({
        error: 'Decryption failed - check your key/password and file format'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}