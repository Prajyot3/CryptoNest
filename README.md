# CryptoNest 🛡️

CryptoNest is a modern, web-based cryptographic utility designed for secure file encryption, decryption, and local key management. Running fully on a secure Python backend with a premium React/Next.js frontend, CryptoNest ensures that your private data stays private.

---

## 🚀 Key Features

*   **Hybrid Encryption (RSA-2048 + AES/Stream)**: Packages files securely using RSA asymmetric keys. The file is encrypted using a fast session-based stream cipher, and the session key is wrapped in the recipient's RSA public key.
*   **Password-Based Symmetric Encryption**: Quickly secure files with a personal passphrase or security password.
*   **Local Key Generator**: One-click generation of standard 2048-bit RSA key pairs (public and private keys) in standard PEM format.
*   **PEM Key Validator & Analyzer**: Inspect key types, structure, and check formatting validity directly in the Key Manager panel.
*   **Seamless Theme Toggling**: Premium user experience with full dark mode and light mode responsiveness.
*   **Zero External Server Cloud Dependency**: All cryptographic operations execute locally on the backend server for maximum privacy.

---

## 🛠️ Architecture & Technology Stack

*   **Frontend**: Next.js 14, React 18, Tailwind CSS, Lucide icons.
*   **Backend Server**: Express.js, Node.js.
*   **Cryptographic Engine**: Python 3 (`hashlib`, `os.urandom`, custom RC4/Arcfour cipher).

---

## 📦 Installation & Setup

### Prerequisites
*   Node.js (v18.x or later)
*   Python 3.x

### 1. Clone and Navigate
```bash
git clone <your-repo-url>
cd cryptonest
```

### 2. Install Dependencies
Install packages for both the Next.js frontend and Express backend:

**Frontend Setup:**
```bash
npm install
```

**Backend Server Setup:**
```bash
cd server
npm install
cd ..
```

### 3. Running the Application

**Start the Backend Server (Port 3001):**
```bash
cd server
npm run dev
```

**Start the Frontend Next.js Dev Server (Port 3000):**
```bash
# In a new terminal window
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to start securing files.

---

## 🔒 Security Specifications

*   **Asymmetric Keys**: RSA 2048-bit keys generated in standard PEM format.
*   **Checksum Verification**: A 32-byte custom double-SHA1 checksum is embedded in every encrypted file to verify data integrity and key correctness during decryption, preventing decryption with incorrect keys.
*   **Data Encryption**: Custom Arcfour stream cipher run locally using a derived key (1000 rounds KDF for passwords) or a cryptographically secure random session key (for hybrid RSA).
