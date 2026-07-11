import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, unlink } from 'fs/promises';
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
    const publicKey = formData.get('publicKey'); // For hybrid encryption

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    // Validate based on method
    if (method === 'password' && !key) {
      return NextResponse.json({ error: 'Password is required for password-based encryption' }, { status: 400 });
    }
    if (method === 'hybrid' && !publicKey) {
      return NextResponse.json({ error: 'Public key is required for hybrid encryption' }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'cpp-backend', 'uploads');
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir, { recursive: true });
    }

    // Save uploaded file temporarily
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const timestamp = Date.now();
    const inputFilePath = path.join(uploadsDir, `input_${timestamp}_${file.name}`);
    const outputFilePath = path.join(uploadsDir, `output_${timestamp}_${file.name}.enc`);

    await writeFile(inputFilePath, buffer);

    // For hybrid encryption, save the public key to a temp file
    let publicKeyPath = null;
    if (method === 'hybrid') {
      publicKeyPath = path.join(uploadsDir, `pubkey_${timestamp}.pem`);
      await writeFile(publicKeyPath, publicKey);
    }

    // Execute Python script for encryption
    const pythonScript = path.join(process.cwd(), 'cpp-backend', 'encryptor.py');

    try {
      let command;
      if (method === 'password') {
        command = `python "${pythonScript}" encrypt-pwd "${inputFilePath}" "${outputFilePath}" "${key}"`;
      } else {
        // hybrid (default)
        command = `python "${pythonScript}" encrypt "${inputFilePath}" "${outputFilePath}" "${publicKeyPath}"`;
      }

      const { stdout, stderr } = await execAsync(command, {
        cwd: path.join(process.cwd(), 'cpp-backend')
      });

      console.log('C++ stdout:', stdout);
      if (stderr) console.log('C++ stderr:', stderr);

      // Read the encrypted file
      const encryptedData = await readFile(outputFilePath);

      // Clean up temporary files
      await unlink(inputFilePath);
      await unlink(outputFilePath);
      if (publicKeyPath && existsSync(publicKeyPath)) {
        await unlink(publicKeyPath);
      }

      // Return the encrypted file
      return new NextResponse(encryptedData, {
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': `attachment; filename="${file.name}.enc"`,
        },
      });

    } catch (execError) {
      // Clean up files in case of error  
      try {
        await unlink(inputFilePath);
        if (existsSync(outputFilePath)) {
          await unlink(outputFilePath);
        }
        if (publicKeyPath && existsSync(publicKeyPath)) {
          await unlink(publicKeyPath);
        }
      } catch (cleanupError) {
        console.error('Cleanup error:', cleanupError);
      }

      console.error('C++ execution error:', execError);
      return NextResponse.json({ error: 'Encryption failed' }, { status: 500 });
    }

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}