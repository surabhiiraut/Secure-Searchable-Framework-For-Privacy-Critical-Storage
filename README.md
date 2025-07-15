# 🔐 Secure Searchable Encryption Framework for Privacy-Critical Cloud Storage

A secure file storage and retrieval system designed for privacy-focused cloud environments. This project enables users to safely upload, search, and retrieve encrypted files using AES encryption and a secure access flow.

---

## 🚀 Features

- User registration and login with secure authentication (MySQL)
- AES encryption for all uploaded files
- Encrypted file storage in MongoDB Atlas
- Keyword-based searchable encryption
- Email-based pass key system for secure retrieval
- OTP-based password recovery via registered email

---

## 🧩 Tech Stack

| Component  | Technology       |
|------------|------------------|
| Frontend   | HTML/CSS/JavaScript (or your framework) |
| Backend    | Python (Flask or Django) |
| Database   | MongoDB Atlas (for files), MySQL (for users) |
| Encryption | AES (Advanced Encryption Standard) |
| Security   | Email OTP for password recovery, pass key for file retrieval |

---

## ⚙️ Setup Instructions

### Prerequisites

- Python 3.8+
- VS Code or PyCharm
- MongoDB Atlas
- MySQL
- Git

### Steps

1. **Clone the Repository**
   ```bash
   git clone <your-repo-url>
   cd <project-folder>
Set Up MongoDB Atlas

Create a cluster

Whitelist your IP

Create a user and get the connection URI

Add URI to config.py or .env

Set Up MySQL

Create a database (e.g., user_data)

Add DB credentials to config file

Install Dependencies
pip install -r requirements.txt
Run the Application

For Flask:
python app.py

For Django:
python manage.py runserver
Visit http://localhost:5000 or http://127.0.0.1:8000

📖 How to Use
1. Register or Log In
Sign up with your email and password

Log in to access your dashboard

2. Upload Your File
Go to the Upload section

Select a file

It is encrypted using AES and stored in MongoDB Atlas

3. Request Your File
Enter the file name and your registered username

A pass key is sent to your email

4. Retrieve Your File
Enter the pass key in the Retrieve section

The file is decrypted and downloaded

5. Forgot Password
Use the “Forgot Password” option

An OTP is sent to your email

Use the OTP to reset your password

📬 Contact
Maintained by Surabhi Raut
Feel free to connect or raise issues via GitHub

📄 License
This project is for educational and academic purposes. Add a license if needed.

