import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, unlink } from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request) {
  try {
    // Create temp directory if it doesn't exist
    const tempDir = path.join(process.cwd(), 'cpp-backend', 'uploads', 'keys');
    if (!existsSync(tempDir)) {
      mkdirSync(tempDir, { recursive: true });
    }

    const timestamp = Date.now();
    const publicKeyPath = path.join(tempDir, `public_${timestamp}.pem`);
    const privateKeyPath = path.join(tempDir, `private_${timestamp}.pem`);

    // Execute Python script for key generation
    const pythonScript = path.join(process.cwd(), 'cpp-backend', 'encryptor.py');
    
    try {
      const { stdout, stderr } = await execAsync(
        `python "${pythonScript}" keygen "${publicKeyPath}" "${privateKeyPath}"`,
        { cwd: path.join(process.cwd(), 'cpp-backend') }
      );
      
      console.log('C++ stdout:', stdout);
      if (stderr) console.log('C++ stderr:', stderr);

      // Read the generated keys
      const publicKey = await readFile(publicKeyPath, 'utf8');
      const privateKey = await readFile(privateKeyPath, 'utf8');

      // Clean up temporary key files
      await unlink(publicKeyPath);
      await unlink(privateKeyPath);

      // Return the keys
      return NextResponse.json({
        success: true,
        publicKey: publicKey.trim(),
        privateKey: privateKey.trim()
      });

    } catch (execError) {
      // Clean up files in case of error
      try {
        if (existsSync(publicKeyPath)) await unlink(publicKeyPath);
        if (existsSync(privateKeyPath)) await unlink(privateKeyPath);
      } catch (cleanupError) {
        console.error('Cleanup error:', cleanupError);
      }
      
      console.error('C++ execution error:', execError);
      return NextResponse.json({ error: 'Key generation failed' }, { status: 500 });
    }

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
