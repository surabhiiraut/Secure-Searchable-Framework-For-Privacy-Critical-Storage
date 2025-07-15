# Secure-Searchable-Framework-For-Privacy-Critical-Storage
This project is a secure file storage and retrieval system designed for privacy-focused cloud environments. It enables users to safely upload, search, and retrieve encrypted files using a combination of AES encryption, MongoDB Atlas, and secure access control mechanisms.
✨ Key Features:
User Authentication using email and password (stored securely in MySQL)

AES Encryption to protect file contents before cloud upload

Secure Cloud Storage via MongoDB Atlas

Searchable Encryption for retrieving files using encrypted keywords

Email-Based Pass Key System for secure file access

OTP-Based Password Recovery via registered email

🧩 Tech Stack:
Frontend: HTML/CSS/JavaScript (or your frontend stack if different)

Backend: Python with Flask/Django

Database:

MongoDB Atlas for storing encrypted files

MySQL for managing user data

Encryption: AES (Advanced Encryption Standard)

Authentication & Security: OTP for password reset, email-based access keys

📌 How It Works
Users register or log in with their email and password.

Uploaded files are encrypted locally using AES and then stored securely in MongoDB Atlas.

To retrieve a file, users must enter the file name and their email to receive a pass key.

The pass key grants temporary permission to access and decrypt the file.

If a user forgets their password, an OTP is sent to their email to reset it securely.
