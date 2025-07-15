from flask import Flask, render_template, request, redirect, url_for, flash, session, send_file, jsonify, make_response
from flask_mysqldb import MySQL
from werkzeug.security import generate_password_hash, check_password_hash
import random
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from pymongo import MongoClient
from bson.objectid import ObjectId
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import padding
from flask_socketio import SocketIO, emit, join_room
from werkzeug.utils import secure_filename
import mysql.connector
import os
import base64
import io
import threading
import json
import requests
from flask_session import Session
from functools import wraps
import string
from flask_mail import Mail, Message
import MySQLdb.cursors


app = Flask(__name__, static_folder='assets', static_url_path='/assets')
# socketio = SocketIO(app, cors_allowed_origins="*")  # Initialize WebSockets

# Flask session settings
app.config['SESSION_PERMANENT'] = False  # Session expires when the browser is closed
app.config['SESSION_TYPE'] = 'filesystem'  # Store session on the server
app.config['SESSION_FILE_DIR'] = './flask_session'  # Store session files in local directory
app.config['SESSION_USE_SIGNER'] = True  # Prevents session tampering
app.config['SECRET_KEY'] = 'a1b2c3d4e5f6g7h8i9j0'  # Ensure you have a strong secret key

Session(app)  # Initialize session management


# MySQL Configuration
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'unnati11'
app.config['MYSQL_DB'] = 'secure_storage'
app.config["MYSQL_CURSORCLASS"] = "DictCursor"


# Initialize MySQL
mysql = MySQL(app)

# MongoDB Configuration
client = MongoClient("mongodb://localhost:27017/")

# Select database and collection
db = client['secure_search']
collection = db['files']

# Secret key for session
app.secret_key = 'a1b2c3d4e5f6g7h8i9j0'  # Replace with a strong random key

# Email configuration (Use Gmail App Password)
# SMTP_SERVER = 'smtp.gmail.com'
# SMTP_PORT = 587
# SMTP_USERNAME = 'serviceprovidercloud@gmail.com'
# SMTP_PASSWORD = 'wvpq zcjb eenf vdcp'  # Replace with your Gmail App Password

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'serviceprovidercloud@gmail.com'
app.config['MAIL_PASSWORD'] = 'wvpq zcjb eenf vdcp'
app.config['MAIL_DEFAULT_SENDER'] = app.config['MAIL_USERNAME']
mail = Mail(app)


# File Upload Configuration
UPLOAD_FOLDER = 'uploads'  # Folder where uploaded files will be stored
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg', 'txt', 'docx', 'doc', 'ppt'}  # Allowed file types

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure upload directory exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    """Check if the uploaded file has a valid extension."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS



def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            if request.is_json:
                return jsonify({"error": "Unauthorized access. Please login."}), 401
            flash('Please log in to access this feature.', 'error')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

def send_email(to_email, subject, body):
    """Send an email using SMTP."""
    msg = MIMEMultipart()
    msg['From'] = app.config['MAIL_USERNAME']
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP(app.config['MAIL_SERVER'], app.config['MAIL_PORT'])
        server.starttls()
        server.login(app.config['MAIL_USERNAME'], app.config['MAIL_PASSWORD'])
        server.sendmail(app.config['MAIL_USERNAME'], to_email, msg.as_string())
        server.quit()
        print("✅ Email sent successfully to", to_email)
    except Exception as e:
        print(f"❌ Failed to send email: {e}")


@app.route('/')
def index():
    """Show index.html and pass the logged-in username"""
    session.modified = True
    username = session.get("username", "Guest")  # Default to "Guest" if not logged in
    response = make_response(render_template('index.html', username=username))
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    return response


@app.route('/packages')
def packages():
    return render_template('packages.html')

@app.route('/help')
def help_page():
    return render_template('help.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')


# @app.before_request
# def clear_session_on_refresh():
#     """Only clear session when a user explicitly logs out, NOT on refresh."""
#     if request.endpoint == 'logout':
#         session.clear()
#     else:
#         session.modified = True  # Preserve session data
# @app.before_request
# def clear_session_on_refresh():
#     """Clear session when user refreshes the site"""
#     if request.endpoint in ['index', 'upload_file', 'logout']:
#         return  # Allow session to persist for these routes
#     if request.method == 'GET' and 'user_id' in session:
#         session.modified = True  # Preserve session data


# @app.before_request
# def clear_session_on_refresh():
#     """Automatically log out user on refresh but allow static files."""
#
#     # Allow session persistence for these important routes
#     if request.endpoint in ['index', 'upload_file', 'logout', 'static', 'login']:
#         return
#
#     # Exclude static assets (CSS, JS, Images) from session clearing
#     if request.path.startswith('/static/'):
#         return
#
#     if request.method == 'GET' and 'user_id' in session:
#         # Detect page refresh using a short-lived cookie
#         if request.cookies.get('refresh_detected') == 'true':
#             session.clear()  # Clears session on refresh
#             response = make_response(redirect(url_for('login')))  # Redirect to login page
#             response.delete_cookie('refresh_detected')  # Clear the refresh detection cookie
#             return response
#
#     # Set a short-lived cookie to detect refresh
#     response = make_response()
#     response.set_cookie('refresh_detected', 'true', max_age=5)  # Cookie expires in 5 seconds
#     return response

@app.before_request
def clear_session_on_refresh():
    """Clear session when user refreshes the site, but allow session persistence for important routes."""

    # Allow session persistence for these important routes
    if request.endpoint in ['index', 'upload_file', 'logout', 'static', 'login']:
        return None

    # Exclude static assets (CSS, JS, Images) from session clearing
    if request.path.startswith('/static/'):
        return None

    if 'user_id' in session:
        session['refresh'] = session.get('refresh', 0) + 1
        if session['refresh'] > 1:
            session.clear()  # Clears session on refresh
            return redirect(url_for('login'))


@app.after_request
def reset_refresh_counter(response):
    """Reset the refresh counter for the session after each request."""
    if 'user_id' in session:
        session['refresh'] = 0
    return response


def check_and_fix_users_table():
    try:
        cur = mysql.connection.cursor()
        cur.execute("DESCRIBE users")
        columns = [row["Field"] for row in cur.fetchall()]

        if "username" not in columns:
            cur.execute("ALTER TABLE users ADD COLUMN username VARCHAR(100) NOT NULL AFTER email")
            mysql.connection.commit()
            print("✅ Added 'username' column to users table.")

        cur.close()
    except Exception as e:
        print(f"❌ Error checking/updating users table: {e}")


# ✅ Fix: Use `before_request` instead of `before_first_request`
@app.before_request
def setup_database():
    check_and_fix_users_table()


def generate_username():
    return "User" + ''.join(random.choices(string.digits, k=5))


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        username = request.form.get('username', generate_username())

        cur = mysql.connection.cursor()
        cur.execute("SELECT id FROM users WHERE email = %s", (email,))
        existing_user = cur.fetchone()

        if existing_user:
            flash('Email already registered. Please log in.', 'error')
            return redirect(url_for('login'))

        hashed_password = generate_password_hash(password)
        cur.execute("INSERT INTO users (email, password, username) VALUES (%s, %s, %s)", (email, hashed_password, username))
        mysql.connection.commit()
        cur.close()

        flash('Registration successful! Please log in.', 'success')
        return redirect(url_for('login'))

    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        cur = mysql.connection.cursor()  # ✅ Use MySQL connection
        cur.execute("SELECT id, email, password, username FROM users WHERE email = %s", (email,))
        user = cur.fetchone()
        cur.close()

        if user and check_password_hash(user['password'], password):
            session['user_id'] = user['id']
            session['email'] = user['email']
            session['username'] = user['username']  # ✅ Store username in session
            session.modified = True
            flash(f"Welcome {session['username']}!", 'success')
            return redirect(url_for('index'))
        else:
            flash('Invalid email or password', 'error')
            return redirect(url_for('login'))

    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))


@app.route('/forget_password', methods=['GET', 'POST'])
def forget_password():
    """Forgot password flow: Send OTP via email."""
    if request.method == 'POST':
        email = request.form['email']

        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cur.fetchone()
        cur.close()

        if user:
            otp = str(random.randint(100000, 999999))
            session['reset_email'] = email
            session['reset_otp'] = otp

            send_email(email, "Password Reset OTP", f"Your OTP for password reset is: {otp}")

            flash('OTP sent to your email. Please check and enter below.', 'success')
            return redirect(url_for('verify_otp'))
        else:
            flash('Email not found. Please check and try again.', 'error')

    return render_template('forget_password.html')

@app.route('/verify_otp', methods=['GET', 'POST'])
def verify_otp():
    """OTP verification for password reset."""
    if request.method == 'POST':
        user_otp = request.form['otp']

        if 'reset_otp' in session and user_otp == session['reset_otp']:
            return redirect(url_for('reset_password'))
        else:
            flash('Invalid OTP. Please try again.', 'error')

    return render_template('verify_otp.html')

@app.route('/reset_password', methods=['GET', 'POST'])
def reset_password():
    """Reset password after OTP verification."""
    if 'reset_email' not in session:
        return redirect(url_for('login'))

    if request.method == 'POST':
        new_password = request.form['new_password']
        confirm_password = request.form['confirm_password']

        if new_password != confirm_password:
            flash('Passwords do not match', 'error')
        else:
            hashed_password = generate_password_hash(new_password)

            cur = mysql.connection.cursor()
            cur.execute("UPDATE users SET password = %s WHERE email = %s",
                        (hashed_password, session['reset_email']))
            mysql.connection.commit()
            cur.close()

            session.pop('reset_email', None)
            session.pop('reset_otp', None)
            flash('Password reset successful. Please login with your new password.', 'success')
            return redirect(url_for('login'))

    return render_template('reset_password.html')

def encrypt_data(data):
    key = os.urandom(32)
    iv = os.urandom(16)
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    encryptor = cipher.encryptor()
    padder = padding.PKCS7(algorithms.AES.block_size).padder()
    padded_data = padder.update(data) + padder.finalize()
    encrypted_data = encryptor.update(padded_data) + encryptor.finalize()
    return base64.b64encode(iv).decode('utf-8'), base64.b64encode(encrypted_data).decode('utf-8'), base64.b64encode(key).decode('utf-8')

def decrypt_data(iv, encrypted_data, key):
    iv = base64.b64decode(iv)
    encrypted_data = base64.b64decode(encrypted_data)
    key = base64.b64decode(key)
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    decryptor = cipher.decryptor()
    decrypted_padded_data = decryptor.update(encrypted_data) + decryptor.finalize()
    unpadder = padding.PKCS7(algorithms.AES.block_size).unpadder()
    decrypted_data = unpadder.update(decrypted_padded_data) + unpadder.finalize()
    return decrypted_data

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


# Function to generate search key
def generate_search_key():
    return ''.join(random.choices(string.ascii_letters + string.digits, k=10))


# @app.route('/upload_file', methods=['POST'])
# @login_required
# def upload_file():
#     """Fix logout issue and store uploaded file in MongoDB"""
#
#     if 'user_id' not in session:
#         flash("Session expired! Please log in again.", "error")
#         return redirect(url_for('login'))
#
#     file = request.files.get('file')
#     if not file or file.filename == '':
#         flash("No file selected.", "error")
#         return redirect(url_for('index'))
#
#     if allowed_file(file.filename):
#         filename = secure_filename(file.filename)
#         file_data = file.read()
#         user_email = session.get('email')
#
#         if not user_email:
#             flash("Session expired, please log in again.", "error")
#             return redirect(url_for('login'))
#
#         iv, encrypted_data, key = encrypt_data(file_data)
#
#         file_document = {
#             "filename": filename,
#             "iv": iv,
#             "encrypted_data": encrypted_data,
#             "key": key,
#             "user_email": user_email
#         }
#         result = collection.insert_one(file_document)
#
#         if result.inserted_id:
#             flash("File uploaded successfully!", "success")
#         else:
#             flash("File upload failed. Try again.", "error")
#
#         return redirect(url_for('index'))  # ✅ Stay on main page after upload
#
#     flash("Invalid file type.", "error")
#     return redirect(url_for('index'))
#
#
# @app.route('/retrieve_file', methods=['POST'])
# @login_required
# def retrieve_file():
#     filename = request.form.get('filename')
#
#     if not filename:
#         return jsonify({"error": "Please provide a filename."}), 400  # Bad request
#
#     file = collection.find_one({"filename": filename, "user_email": session.get('email')})
#
#     if not file:
#         return jsonify({"error": "File not found or you don't have access."}), 404  # Not found
#
#     decrypted_data = decrypt_data(file['iv'], file['encrypted_data'], file['key'])
#     file_stream = io.BytesIO(decrypted_data)
#
#     return send_file(file_stream, as_attachment=True,
#                      download_name=file['filename'],
#                      mimetype='application/octet-stream')

@app.after_request
def add_header(response):
    response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response


# Upload file endpoint
@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files['file']
        user_email = request.form.get('email')

        if not user_email:
            return jsonify({"error": "Email is required"}), 400

        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400

        filename = secure_filename(file.filename)
        search_key = generate_search_key()
        file_data = file.read()

        # Encrypt the file
        iv, encrypted_data, encryption_key = encrypt_data(file_data)

        # Insert into MongoDB and print the result
        result = collection.insert_one({
            "filename": filename,
            "search_key": search_key,
            "iv": iv,
            "encrypted_data": encrypted_data,
            "encryption_key": encryption_key,
            "email": user_email
        })

        print(f"✅ MongoDB Inserted ID: {result.inserted_id}")  # Debugging log

        msg = Message("Your File Search Key", recipients=[user_email])
        msg.body = f"Hello,\n\nYour file '{filename}' has been uploaded successfully.\nYour search key is: {search_key}\n\nUse this key to retrieve your file.\n\nThank you!"
        mail.send(msg)

        flash("File uploaded successfully! Search key sent to email.", "success")
        return redirect(url_for('index'))

    except Exception as e:
        print(f"❌ MongoDB Insert Error: {str(e)}")  # Debugging log
        return jsonify({"error": str(e)}), 500


@app.route('/retrieve', methods=['POST'])
def retrieve_file():
    filename = request.form['filename']
    search_key = request.form['search_key']

    file_record = collection.find_one({"filename": filename, "search_key": search_key})

    if file_record:
        decrypted_data = decrypt_data(file_record['iv'], file_record['encrypted_data'], file_record['encryption_key'])
        file_stream = io.BytesIO(decrypted_data)
        return send_file(file_stream, as_attachment=True, download_name=filename, mimetype="application/octet-stream")
    else:
        return jsonify({"error": "Invalid filename or search key!"}), 404


def test_retrieve_file(filename):
    test_url = "http://127.0.0.1:5001/retrieve_file"
    response = requests.post(test_url, data={"filename": filename})

    if response.status_code == 200:
        return {"status": "success", "message": "File retrieval API working"}
    else:
        return {"status": "failure", "message": "File retrieval API failed"}

# API endpoint for a user to request a file
@app.route("/request-file", methods=["POST"])
@login_required
def request_file():
    data = request.json
    filename = data.get("filename")
    username = data.get("username")
    if not filename or not username:
        return jsonify({"message": "Filename and username are required!"}), 400
    db["requests"].insert_one({"filename": filename, "username": username, "status": "pending"})
    return jsonify({"message": "File request submitted successfully."}), 201
#

# def watch_requests():
#     """Listen for changes in MongoDB and send real-time updates via WebSocket."""
#     pipeline = [{'$match': {'operationType': 'insert'}}]  # Only watch new insertions
#     change_stream = db["requests"].watch(pipeline)
#
#     for change in change_stream:
#         new_request = change["fullDocument"]
#         receiver_email = new_request["receiver_email"]
#
#         socketio.emit(f"update_requests_{receiver_email}", {
#             "id": str(new_request["_id"]),
#             "username": new_request["sender_email"],
#             "filename": new_request["filename"]
#         })
#
#
# # Run MongoDB Change Stream in a separate thread
# threading.Thread(target=watch_requests, daemon=True).start()
#
#
# def notify_new_request(receiver_email):
#     """Notify the logged-in user when a new request is made."""
#     requests = list(db.requests.find({"receiver_email": receiver_email, "status": "pending"}))
#
#     request_list = []
#     for req in requests:
#         request_list.append({
#             "id": str(req["_id"]),
#             "username": req["sender_email"],
#             "filename": req["filename"]
#         })
#
#
#     socketio.emit(f"update_requests_{receiver_email}", {"requests": request_list})

# socketio = SocketIO(app, cors_allowed_origins="*", async_mode="threading")
#
# @socketio.on("join")
# def on_join(data):
#     user_email = data.get("email")
#     if user_email:
#         join_room(user_email)
#         print(f" User joined roon : {user_email}")
#     else:
#         print("email not provided for join room")
# socketio = SocketIO(app, cors_allowed_origins="*")

# def notify_new_request(receiver_email):
#     """Notify the logged-in user when a new request is made."""
#     requests = list(db.requests.find({"receiver_email": receiver_email, "status": "pending"}))
#
#     request_list = [{
#         "id": str(req["_id"]),
#         "sender_email": req.get("sender_email", "Unknown"),
#         "file_name": req["file_name"]
#     } for req in requests]
#
#     socketio.emit("update_requests", {"requests": request_list}, room=receiver_email)
#     print(f" Emitted update to room: {receiver_email}")


# # API endpoint to fetch pending requests for the logged-in owner
# @app.route("/get_pending_requests", methods=["GET"])
# @login_required
# def get_pending_requests():
#     """Fetch pending file requests for the logged-in user."""
#     user_email = session.get("email")  # Get logged-in user
#     if not user_email:
#         return jsonify({"error": "User not logged in"}), 401
#
#     pending_requests = db["requests"].find({
#         "receiver_email": user_email,
#         "status": "pending"
#     })
#
#     request_list = [{
#         "_id": str(req["_id"]),
#         "sender_email": req.get("sender_email", "Unknown"),
#         "file_name": req["file_name"]
#     } for req in pending_requests]

    # @app.route("/get_pending_requests", methods=["GET"])
    # @login_required
    # def get_pending_requests():
    #     user_email = session.get("email")
    #     if not user_email:
    #         return jsonify({"error": "User not logged in"}), 401
    #
    #     pending_requests = db.requests.find({
    #         "receiver_email": user_email,
    #         "status": "pending"
    #     })
    #
    #     request_list = []
    #     for req in pending_requests:
    #         request_list.append({
    #             "_id": str(req["_id"]),
    #             "sender_email": req.get("sender_email", "Unknown"),
    #             "file_name": req.get("file_name", "No File Name")
    #         })
    #
    #     # print("✅ Returning requests:", request_list)
    #     return jsonify(request_list)
    #
    # print("✅ API Sending Data:", request_list)  # Debugging
    # return jsonify(request_list)


@app.route("/get_pending_requests", methods=["GET"])
@login_required
def get_pending_requests():
    user_email = session.get("email")
    print("🔍 Logged-in user email:", user_email)
    if not user_email:
        return jsonify({"error": "User not logged in"}), 401

    pending_requests = db.requests.find({
        "receiver_email": user_email,
        "status": "pending"
    })

    request_list = []
    for req in pending_requests:
        request_list.append({
            "_id": str(req["_id"]),
            "sender_email": req.get("sender_email", "Unknown"),
            "file_name": req.get("file_name", "No File Name")
        })

    print("✅ Returning request list:", request_list)
    return jsonify(request_list)



# API endpoint to approve a request
@app.route("/approve-request", methods=["POST"])
@login_required
def approve_request():
    """Approve a file request and send the download link to the requester."""
    data = request.json
    request_id = data.get("id")

    request_entry = db["requests"].find_one({"_id": ObjectId(request_id)})
    if not request_entry:
        return jsonify({"error": "Request not found"}), 404

    file_entry = collection.find_one({"filename": request_entry["filename"]})
    if not file_entry:
        return jsonify({"error": "File not found"}), 404

    # Generate a unique secure token for download
    secure_token = base64.urlsafe_b64encode(os.urandom(24)).decode("utf-8")
    secure_link = f"http://127.0.0.1:5001/download/{secure_token}"

    # Store secure link in the database
    db["shared_files"].insert_one({
        "token": secure_token,
        "filename": file_entry["filename"],
        "iv": file_entry.get("iv"),
        "encrypted_data": file_entry.get("encrypted_data"),
        "key": file_entry.get("key"),
    })

    # Send email with the correct download link
    email_body = f"Your requested file '{file_entry['filename']}' has been approved.\nDownload it here: {secure_link}"
    send_email(request_entry["username"], "Your File Request is Approved", email_body)

    # Return confirmation with the generated link
    return jsonify({"message": "Request approved. Download link sent to requester.", "link": secure_link})


@app.route("/test-approve-request", methods=["GET"])
def test_approve_request():
    """API for testing approve request functionality"""
    sample_request_id = "replace_with_valid_request_id"

    response = app.test_client().post(
        "/approve-request",
        json={"id": sample_request_id},
        headers={"Content-Type": "application/json"}
    )

    return response.data, response.status_code


# API endpoint to reject a request
@app.route("/reject-request", methods=["POST"])
@login_required
def reject_request():
    data = request.json
    request_id = data.get("id")
    db["requests"].update_one({"_id": ObjectId(request_id)}, {"$set": {"status": "rejected"}})
    return jsonify({"message": "Request rejected"})

# API endpoint to download file via secure token
@app.route("/download/<token>")
def download_file(token):
    """Handle file download using a secure token."""
    file_entry = db["shared_files"].find_one({"token": token})

    if not file_entry:
        return jsonify({"error": "Invalid or expired link"}), 404

    # Ensure necessary fields are present
    if "iv" not in file_entry or "encrypted_data" not in file_entry or "key" not in file_entry:
        return jsonify({"error": "File data missing"}), 500

    try:
        # Decrypt the file before sending
        decrypted_data = decrypt_data(file_entry["iv"], file_entry["encrypted_data"], file_entry["key"])
        file_stream = io.BytesIO(decrypted_data)

        return send_file(file_stream, as_attachment=True, download_name=file_entry["filename"],
                         mimetype="application/octet-stream")

    except Exception as e:
        print(f"❌ Error decrypting file: {e}")
        return jsonify({"error": "File decryption failed"}), 500


if __name__ == '__main__':
    if not os.path.exists("uploads"):
        os.makedirs("uploads")
    app.run(debug=True, port=5001)