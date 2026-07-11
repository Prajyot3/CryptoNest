#!/usr/bin/env python3
import os
import sys
import hashlib
import subprocess

# Constants
MAGIC_HEADER_V4 = b"SFPRO_SSL_V4"

# Set up environment PATH to include openssl_mock dynamically
script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(script_dir)
openssl_mock_dir = os.path.join(project_root, 'server', 'openssl_mock')
if os.path.isdir(openssl_mock_dir):
    os.environ['PATH'] = openssl_mock_dir + os.pathsep + os.environ.get('PATH', '')

# ========================= Utility Functions =========================

def compute_checksum(data: bytes) -> bytes:
    """
    Computes a 32-byte custom checksum:
    - First 20 bytes: SHA1(data)
    - Next 12 bytes: First 12 bytes of SHA1(data + salt \x5a)
    """
    h1 = hashlib.sha1(data).digest()
    h2 = hashlib.sha1(data + b'\x5a').digest()
    return h1 + h2[:12]


class StreamCipher:
    """Custom RC4 (Arcfour) Stream Cipher"""
    def __init__(self):
        self.S = list(range(256))
        self.i = 0
        self.j = 0

    def init(self, key: bytes):
        self.S = list(range(256))
        j = 0
        key_len = len(key)
        for n in range(256):
            j = (j + self.S[n] + key[n % key_len]) & 255
            self.S[n], self.S[j] = self.S[j], self.S[n]
        self.i = 0
        self.j = 0

    def process_data(self, data: bytes) -> bytes:
        out = bytearray(data)
        for n in range(len(out)):
            self.i = (self.i + 1) & 255
            self.j = (self.j + self.S[self.i]) & 255
            self.S[self.i], self.S[self.j] = self.S[self.j], self.S[self.i]
            out[n] ^= self.S[(self.S[self.i] + self.S[self.j]) & 255]
        return bytes(out)


def derive_key(password: bytes) -> bytes:
    """
    KDF replicating C++ deriveKey:
    1000 rounds of compute_checksum updating temp.
    """
    pass_len = len(password)
    temp = bytearray(64)
    for i in range(min(pass_len, 64)):
        temp[i] = password[i]
        
    key32 = b'\x00' * 32
    for _ in range(1000):
        key32 = compute_checksum(bytes(temp))
        temp[0:32] = key32
        pwd_to_copy = password[:32]
        temp[32:32+len(pwd_to_copy)] = pwd_to_copy
    return key32


# ========================= OpenSSL CLI Wrappers =========================

def generate_rsa_keypair(public_key_file: str, private_key_file: str) -> bool:
    try:
        # Generate private key
        subprocess.run(
            ["openssl", "genrsa", "-out", private_key_file, "2048"],
            shell=True, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE
        )
        # Extract public key
        subprocess.run(
            ["openssl", "rsa", "-in", private_key_file, "-pubout", "-out", public_key_file],
            shell=True, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE
        )
        print("RSA key pair generated successfully (OpenSSL format)!")
        print(f"Public key: {public_key_file}")
        print(f"Private key: {private_key_file}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"OpenSSL error: {e.stderr.decode('utf-8', errors='replace')}", file=sys.stderr)
        return False
    except Exception as e:
        print(f"Error generating keys: {e}", file=sys.stderr)
        return False


def rsa_encrypt(data_file: str, output_file: str, public_key_file: str) -> bool:
    try:
        subprocess.run([
            "openssl", "pkeyutl", "-encrypt", "-pubin",
            "-inkey", public_key_file,
            "-in", data_file,
            "-out", output_file
        ], shell=True, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        return True
    except subprocess.CalledProcessError as e:
        print(f"OpenSSL encrypt error: {e.stderr.decode('utf-8', errors='replace')}", file=sys.stderr)
        return False
    except Exception as e:
        print(f"RSA encrypt error: {e}", file=sys.stderr)
        return False


def rsa_decrypt(enc_file: str, output_file: str, private_key_file: str) -> bool:
    try:
        subprocess.run([
            "openssl", "pkeyutl", "-decrypt",
            "-inkey", private_key_file,
            "-in", enc_file,
            "-out", output_file
        ], shell=True, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        return True
    except subprocess.CalledProcessError as e:
        print(f"OpenSSL decrypt error: {e.stderr.decode('utf-8', errors='replace')}", file=sys.stderr)
        return False
    except Exception as e:
        print(f"RSA decrypt error: {e}", file=sys.stderr)
        return False


# ========================= Hybrid Encryption =========================

def encrypt_file_hybrid(input_file: str, output_file: str, public_key_file: str) -> bool:
    try:
        if not os.path.exists(input_file):
            print(f"Error: Input file {input_file} does not exist", file=sys.stderr)
            return False
            
        with open(input_file, 'rb') as f:
            file_data = f.read()
            
        checksum = compute_checksum(file_data)
        
        # Generate random 32-byte session key
        session_key = os.urandom(32)
        
        # Temp files for session key encryption
        temp_key_file = output_file + ".tmpkey"
        temp_enc_key_file = output_file + ".tmpenckey"
        
        with open(temp_key_file, 'wb') as f:
            f.write(session_key)
            
        if not rsa_encrypt(temp_key_file, temp_enc_key_file, public_key_file):
            print("Error: Failed to encrypt session key with public key", file=sys.stderr)
            if os.path.exists(temp_key_file):
                os.remove(temp_key_file)
            return False
            
        if os.path.exists(temp_key_file):
            os.remove(temp_key_file)
            
        with open(temp_enc_key_file, 'rb') as f:
            enc_key = f.read()
            
        if os.path.exists(temp_enc_key_file):
            os.remove(temp_enc_key_file)
            
        enc_key_len = len(enc_key)
        
        # Encrypt the file data with the session key
        cipher = StreamCipher()
        cipher.init(session_key)
        encrypted_data = cipher.process_data(file_data)
        
        # Format output file
        filename = os.path.basename(input_file)
        filename_bytes = filename.encode('utf-8', errors='replace')
        filename_len = len(filename_bytes)
        
        with open(output_file, 'wb') as f:
            f.write(MAGIC_HEADER_V4) # 12 bytes
            f.write(checksum) # 32 bytes
            f.write(enc_key_len.to_bytes(4, byteorder='little')) # 4 bytes
            f.write(enc_key) # enc_key_len bytes
            f.write(filename_len.to_bytes(4, byteorder='little')) # 4 bytes
            f.write(filename_bytes) # filename_len bytes
            f.write(encrypted_data)
            
        print("Hybrid encryption successful!")
        return True
    except Exception as e:
        print(f"Encryption error: {e}", file=sys.stderr)
        return False


def decrypt_file_hybrid(input_file: str, output_dir: str, private_key_file: str) -> bool:
    try:
        if not os.path.exists(input_file):
            print(f"Error: Input file {input_file} does not exist", file=sys.stderr)
            return False
            
        with open(input_file, 'rb') as f:
            magic = f.read(12)
            if magic != MAGIC_HEADER_V4:
                print("Error: Invalid file format", file=sys.stderr)
                return False
                
            stored_checksum = f.read(32)
            
            enc_key_len_bytes = f.read(4)
            if len(enc_key_len_bytes) < 4:
                print("Error: Invalid file format", file=sys.stderr)
                return False
            enc_key_len = int.from_bytes(enc_key_len_bytes, byteorder='little')
            
            if enc_key_len == 0:
                print("Error: This file uses password encryption", file=sys.stderr)
                return False
                
            enc_key = f.read(enc_key_len)
            if len(enc_key) < enc_key_len:
                print("Error: Invalid file format", file=sys.stderr)
                return False
                
            fn_len_bytes = f.read(4)
            if len(fn_len_bytes) < 4:
                print("Error: Invalid file format", file=sys.stderr)
                return False
            fn_len = int.from_bytes(fn_len_bytes, byteorder='little')
            
            filename_bytes = f.read(fn_len)
            if len(filename_bytes) < fn_len:
                print("Error: Invalid file format", file=sys.stderr)
                return False
            filename = filename_bytes.decode('utf-8', errors='replace')
            
            enc_data = f.read()
            
        # Temp files for session key decryption
        temp_enc_key_file = input_file + ".tmpenckey"
        temp_key_file = input_file + ".tmpkey"
        
        with open(temp_enc_key_file, 'wb') as f:
            f.write(enc_key)
            
        if not rsa_decrypt(temp_enc_key_file, temp_key_file, private_key_file):
            print("Error: Wrong private key!", file=sys.stderr)
            if os.path.exists(temp_enc_key_file):
                os.remove(temp_enc_key_file)
            return False
            
        if os.path.exists(temp_enc_key_file):
            os.remove(temp_enc_key_file)
            
        with open(temp_key_file, 'rb') as f:
            session_key = f.read(32)
            
        if os.path.exists(temp_key_file):
            os.remove(temp_key_file)
            
        if len(session_key) < 32:
            print("Error: Wrong private key!", file=sys.stderr)
            return False
            
        # Decrypt data
        cipher = StreamCipher()
        cipher.init(session_key)
        decrypted_data = cipher.process_data(enc_data)
        
        # Verify checksum
        computed_checksum = compute_checksum(decrypted_data)
        if computed_checksum != stored_checksum:
            print("Error: Checksum verification failed!", file=sys.stderr)
            return False
            
        # Write output
        out_path = os.path.join(output_dir, filename)
        with open(out_path, 'wb') as f:
            f.write(decrypted_data)
            
        print("Hybrid decryption successful!")
        print(f"Output: {out_path}")
        return True
    except Exception as e:
        print(f"Decryption error: {e}", file=sys.stderr)
        return False


# ========================= Password Encryption =========================

def encrypt_file_password(input_file: str, output_file: str, password: str) -> bool:
    try:
        if not password:
            print("Error: Password cannot be empty", file=sys.stderr)
            return False
            
        pwd_bytes = password.encode('utf-8', errors='replace')
        key = derive_key(pwd_bytes)
        
        if not os.path.exists(input_file):
            print(f"Error: Input file {input_file} does not exist", file=sys.stderr)
            return False
            
        with open(input_file, 'rb') as f:
            file_data = f.read()
            
        checksum = compute_checksum(file_data)
        
        cipher = StreamCipher()
        cipher.init(key)
        encrypted_data = cipher.process_data(file_data)
        
        filename = os.path.basename(input_file)
        filename_bytes = filename.encode('utf-8', errors='replace')
        filename_len = len(filename_bytes)
        
        with open(output_file, 'wb') as f:
            f.write(MAGIC_HEADER_V4) # 12 bytes
            f.write(checksum) # 32 bytes
            f.write((0).to_bytes(4, byteorder='little')) # 4 bytes of 0 key len
            f.write(filename_len.to_bytes(4, byteorder='little')) # 4 bytes
            f.write(filename_bytes) # filename_bytes
            f.write(encrypted_data)
            
        print("Password encryption successful!")
        return True
    except Exception as e:
        print(f"Encryption error: {e}", file=sys.stderr)
        return False


def decrypt_file_password(input_file: str, output_dir: str, password: str) -> bool:
    try:
        if not password:
            print("Error: Password cannot be empty", file=sys.stderr)
            return False
            
        pwd_bytes = password.encode('utf-8', errors='replace')
        key = derive_key(pwd_bytes)
        
        if not os.path.exists(input_file):
            print(f"Error: Input file {input_file} does not exist", file=sys.stderr)
            return False
            
        with open(input_file, 'rb') as f:
            magic = f.read(12)
            if magic != MAGIC_HEADER_V4:
                print("Error: Invalid file format", file=sys.stderr)
                return False
                
            stored_checksum = f.read(32)
            
            enc_key_len_bytes = f.read(4)
            if len(enc_key_len_bytes) < 4:
                print("Error: Invalid file format", file=sys.stderr)
                return False
            enc_key_len = int.from_bytes(enc_key_len_bytes, byteorder='little')
            
            if enc_key_len != 0:
                print("Error: This file uses RSA encryption", file=sys.stderr)
                return False
                
            fn_len_bytes = f.read(4)
            if len(fn_len_bytes) < 4:
                print("Error: Invalid file format", file=sys.stderr)
                return False
            fn_len = int.from_bytes(fn_len_bytes, byteorder='little')
            
            filename_bytes = f.read(fn_len)
            if len(filename_bytes) < fn_len:
                print("Error: Invalid file format", file=sys.stderr)
                return False
            filename = filename_bytes.decode('utf-8', errors='replace')
            
            enc_data = f.read()
            
        cipher = StreamCipher()
        cipher.init(key)
        decrypted_data = cipher.process_data(enc_data)
        
        computed_checksum = compute_checksum(decrypted_data)
        if computed_checksum != stored_checksum:
            print("Error: Wrong password!", file=sys.stderr)
            return False
            
        out_path = os.path.join(output_dir, filename)
        with open(out_path, 'wb') as f:
            f.write(decrypted_data)
            
        print("Password decryption successful!")
        print(f"Output: {out_path}")
        return True
    except Exception as e:
        print(f"Decryption error: {e}", file=sys.stderr)
        return False


# ========================= Main =========================

def print_usage():
    prog = os.path.basename(sys.argv[0])
    print("CryptoNest v4 - Python Edition", file=sys.stderr)
    print("Supports STANDARD PEM keys (OpenSSL format)!\n", file=sys.stderr)
    print("Usage:", file=sys.stderr)
    print(f"  python {prog} keygen <public.pem> <private.pem>", file=sys.stderr)
    print(f"  python {prog} encrypt <input> <output.enc> <public.pem>", file=sys.stderr)
    print(f"  python {prog} decrypt <input.enc> <output_dir> <private.pem>", file=sys.stderr)
    print(f"  python {prog} encrypt-pwd <input> <output.enc> <password>", file=sys.stderr)
    print(f"  python {prog} decrypt-pwd <input.enc> <output_dir> <password>", file=sys.stderr)


def main():
    if len(sys.argv) < 2:
        print_usage()
        sys.exit(1)
        
    op = sys.argv[1]
    
    if op == "keygen" and len(sys.argv) == 4:
        success = generate_rsa_keypair(sys.argv[2], sys.argv[3])
        sys.exit(0 if success else 1)
    elif op == "encrypt" and len(sys.argv) == 5:
        success = encrypt_file_hybrid(sys.argv[2], sys.argv[3], sys.argv[4])
        sys.exit(0 if success else 1)
    elif op == "decrypt" and len(sys.argv) == 5:
        success = decrypt_file_hybrid(sys.argv[2], sys.argv[3], sys.argv[4])
        sys.exit(0 if success else 1)
    elif op == "encrypt-pwd" and len(sys.argv) == 5:
        success = encrypt_file_password(sys.argv[2], sys.argv[3], sys.argv[4])
        sys.exit(0 if success else 1)
    elif op == "decrypt-pwd" and len(sys.argv) == 5:
        success = decrypt_file_password(sys.argv[2], sys.argv[3], sys.argv[4])
        sys.exit(0 if success else 1)
    else:
        print_usage()
        sys.exit(1)


if __name__ == "__main__":
    main()
