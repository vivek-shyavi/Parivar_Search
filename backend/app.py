# Backend Integration for Account Creation and Login
import random
import string
from flask import Flask, request, jsonify  
import pandas as pd 
import mysql.connector
import smtplib
from email.mime.text import MIMEText
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
from indic_transliteration import sanscript
from indic_transliteration.sanscript import transliterate
import jellyfish
import re
from datetime import datetime
import time
# Add these imports to the existing imports section
from typing import Dict, Tuple
from datetime import timedelta
import bcrypt
import secrets
from email.mime.multipart import MIMEMultipart
from config import DB_CONFIG, UPLOAD_FOLDER, ALLOWED_EXTENSIONS, EMAIL_CONFIG, BASE_URL, PORT
from flask_socketio import SocketIO
from waitress import serve

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app)

# Database configuration
db_config = DB_CONFIG

# Add these configurations after your db_config
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'xlsx', 'xls'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Create uploads folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


import threading
import logging
from concurrent.futures import ThreadPoolExecutor, as_completed
from queue import Queue
import time
import math

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(threadName)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def print_tree(node, level=0):
    prefix = "  " * level
    spouse_info = f" (Spouse: {node.spouse_name})" if node.spouse_name else ""
    mother_info = f" (Mother: {node.mother_name})" if node.mother_name else ""
    print(f"{prefix}|-- {node.name} ({node.relationship}){spouse_info}{mother_info}")
    for child in sorted(node.children, key=lambda x: x.name):
        print_tree(child, level + 1)

def print_lineage(member):
    lineage = []
    current = member
    while current:
        spouse_info = f", Spouse: {current.spouse_name}" if current.spouse_name else ""
        mother_info = f", Mother: {current.mother_name}" if current.mother_name else ""
        lineage.append(f"{current.name} ({current.relationship}{spouse_info}{mother_info})")
        current = current.parent
    print(" -> ".join(reversed(lineage)))

def get_person_details(metadata_id):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        
        query = """
            SELECT metadata_id, image_number, record, given_name, surname, 
                   father_name, father_surname, mother_name, mother_surname,
                   spouse_name, spouse_father_name, spouse_mother_name,
                   city, relationship
            FROM metadata 
            WHERE metadata_id = %s
            LIMIT 1
        """
        cursor.execute(query, (metadata_id,))
        return cursor.fetchone()
        
    finally:
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()

def validate_password(password):
    """Validate password according to the rules"""
    # Check length
    # print(len(password))
    if not (8 <= len(password) <= 13):
        return False, "Password must be between 8 and 13 characters long"
    
    # Check for letters and numbers only
    if not re.match("^[a-zA-Z0-9]+$", password):
        return False, "Password can only contain letters and numbers"
    
    return True, None

def get_user_id_by_email(email, cursor):
    cursor.execute("SELECT user_id FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()
    return user[0] if user else None

def send_email(to_email, subject, body):
    sender_email = EMAIL_CONFIG['sender_email']
    sender_password = EMAIL_CONFIG['sender_password']

    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = sender_email
    msg['To'] = to_email

    with smtplib.SMTP(EMAIL_CONFIG['smtp_server'], EMAIL_CONFIG['smtp_port']) as server:
        server.starttls()
        server.login(sender_email, sender_password)
        server.send_message(msg)

def verify_user_otp(email, otp):
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()

    try:
        # Check if the OTP exists in the database and is valid
        cursor.execute("""
            SELECT id, expires_at, status 
            FROM otp_verification 
            WHERE user_id = (SELECT user_id FROM users WHERE email = %s) 
            AND otp = %s 
            AND expires_at > NOW() 
            AND status = 'open'
        """, (email, otp))
        otp_record = cursor.fetchone()

        if otp_record:
            otp_id, expires_at, status = otp_record
            return expires_at > datetime.now() and status == 'open'
        return False

    finally:
        cursor.close()
        connection.close()

class FamilyMember:
    def __init__(self, name: str, father_name: str = None, mother_name: str = None, 
                 spouse_name: str = None, relationship: str = None):
        self.name = name
        self.father_name = father_name
        self.mother_name = mother_name
        self.spouse_name = spouse_name
        self.relationship = relationship
        self.children = []
        self.parent = None

    def add_child(self, child):
        self.children.append(child)
        child.parent = self
        
    def to_dict(self):
        return {
            'name': self.name,
            'father_name': self.father_name,
            'relationship': self.relationship,
            'children': [child.to_dict() for child in self.children]
        }

class FamilyTreeBuilder:
    def __init__(self):
        self.db_config = db_config  # Using the existing db_config


    def fetch_family_data(self, image_number: str, record: str) -> list:
        try:
            conn = mysql.connector.connect(**self.db_config)
            cursor = conn.cursor()
            
            query = """
                SELECT given_name, father_name, mother_name, spouse_name, relationship 
                FROM metadata 
                WHERE image_number = %s AND record = %s
            """
            cursor.execute(query, (image_number, record))
            return cursor.fetchall()
            
        except mysql.connector.Error as err:
            print(f"Database Error: {err}")
            return []
            
        finally:
            if 'conn' in locals() and conn.is_connected():
                cursor.close()
                conn.close()


    def build_family_tree(self, image_number: str, record: str) -> Tuple[FamilyMember, Dict[str, FamilyMember]]:
        family_data = self.fetch_family_data(image_number, record)
        members = {}
        for name, father, mother, spouse, relation in family_data:
            members[name] = FamilyMember(name, father, mother, spouse, relation)
        
        root = None
        for name, member in members.items():
            if member.father_name and member.father_name in members:
                members[member.father_name].add_child(member)
            elif member.relationship == "Head":
                root = member
        
        return root, members
    
    def fetch_person_details(self, image_number: str, record: str) -> dict:
        try:
            conn = mysql.connector.connect(**self.db_config)
            cursor = conn.cursor(dictionary=True)
            
            query = """
                SELECT given_name, surname, father_name, father_surname,
                    mother_name, mother_surname, spouse_name, 
                    spouse_father_name, spouse_mother_name, city
                FROM metadata 
                WHERE image_number = %s AND record = %s
                LIMIT 1
            """
            cursor.execute(query, (image_number, record))
            return cursor.fetchone()
            
        finally:
            if 'conn' in locals() and conn.is_connected():
                cursor.close()
                conn.close()

class HindiNameSearch:
    def __init__(self):
        self.db = None
        self.cursor = None
        self.variation_cache = {}
        self.similarity_cache = {}
        self.thread_local = threading.local()
        self.results_queue = Queue()

    def connect_to_db(self):
        try:
            self.db = mysql.connector.connect(**db_config)
            self.cursor = self.db.cursor(dictionary=True, buffered=True)
            return True
        except mysql.connector.Error as e:
            print(f"Error connecting to database: {e}")
            return False

    def close_connection(self):
        if self.cursor:
            self.cursor.close()
        if self.db:
            self.db.close()

    def normalize_text(self, text):
        if not text:
            return ""
        return ' '.join(text.strip().split()).lower()

    def get_name_variations(self, name):
        if not name:
            return set()
            
        cache_key = name
        if cache_key in self.variation_cache:
            return self.variation_cache[cache_key]
            
        variations = set()
        name = self.normalize_text(name)
        variations.add(name)
        
        try:
            # Handle English to Hindi
            if re.match(r'^[A-Za-z\s]+$', name):
                hindi_name = transliterate(name, sanscript.ITRANS, sanscript.DEVANAGARI)
                variations.add(hindi_name)
                
                # Common variations
                name_parts = name.split()
                for part in name_parts:
                    if part.endswith('a'):
                        variations.add(name.replace(part, part[:-1]))
                    
                variations.add(name.replace('sh', 's'))
                variations.add(name.replace('s', 'sh'))
                variations.add(name.replace('v', 'w'))
                variations.add(name.replace('w', 'v'))
                variations.add(name.replace('f', 'ph'))
                variations.add(name.replace('ph', 'f'))
                
            # Handle Hindi to English    
            elif any('\u0900' <= c <= '\u097F' for c in name):
                eng_name = transliterate(name, sanscript.DEVANAGARI, sanscript.ITRANS)
                variations.add(eng_name)
                
                if eng_name.endswith('a'):
                    variations.add(eng_name[:-1])
                    
        except Exception:
            pass
            
        self.variation_cache[cache_key] = variations
        # print ("variations",variations)
        return variations

    def calculate_similarity(self, str1, str2):
        
        if not str1 or not str2:
            return 0
            
        cache_key = (str1, str2)
        if cache_key in self.similarity_cache:
            return self.similarity_cache[cache_key]

        str1 = self.normalize_text(str1)
        str2 = self.normalize_text(str2)

        if str1 == str2:
            return 1.0

        # # Check transliterated matches
        # try:
        #     if any('\u0900' <= c <= '\u097F' for c in str1):
        #         eng_str1 = transliterate(str1, sanscript.DEVANAGARI, sanscript.ITRANS)
        #         if eng_str1.lower() == str2.lower():
        #             return 1.0
        #     elif any('\u0900' <= c <= '\u097F' for c in str2):
        #         eng_str2 = transliterate(str2, sanscript.DEVANAGARI, sanscript.ITRANS)
        #         if eng_str2.lower() == str1.lower():
        #             return 1.0
        # except Exception:
        #     pass

        # Calculate similarity scores
        jaro_sim = jellyfish.jaro_winkler_similarity(str1, str2)
        
        # Calculate Levenshtein for better accuracy
        lev_dist = jellyfish.levenshtein_distance(str1, str2)
        max_len = max(len(str1), len(str2))
        lev_sim = 1 - (lev_dist / max_len) if max_len > 0 else 0
        
        # Include Soundex for phonetic similarity
        # sound_sim = 1.0 if jellyfish.soundex(str1) == jellyfish.soundex(str2) else 0.0
        
        # Weighted combination of similarities
        # total_sim = (jaro_sim * 0.5) + (lev_sim * 0.3) + (sound_sim * 0.2)
        total_sim = (jaro_sim * 0.6) + (lev_sim * 0.4)
        
        # Boost high similarity matches
        if total_sim > 0.8:
            total_sim = min(1.0, total_sim * 1.2)
            
        self.similarity_cache[cache_key] = total_sim
        
        return total_sim
        
    def get_db_cursor(self):
        """Get thread-local database cursor"""
        if not hasattr(self.thread_local, "db"):
            logger.info(f"Creating new database connection for thread {threading.current_thread().name}")
            self.thread_local.db = mysql.connector.connect(**db_config)
            self.thread_local.cursor = self.thread_local.db.cursor(dictionary=True)
        return self.thread_local.cursor

    def close_thread_connection(self):
        """Close thread-local database connection"""
        if hasattr(self.thread_local, "cursor"):
            self.thread_local.cursor.close()
        if hasattr(self.thread_local, "db"):
            self.thread_local.db.close()
            logger.info(f"Closed database connection for thread {threading.current_thread().name}")

    def process_record_batch(self, records, given_name_vars, surname_vars, father_name_vars, min_similarity):
        """Process a batch of records in a thread"""
        thread_name = threading.current_thread().name
        logger.info(f"{thread_name} starting to process {len(records)} records")
        start_time = time.time()
        
        local_matches = []
        for record in records:
            match_scores = {'given_name': 0, 'surname': 0, 'father_name': 0}
            fields_searched = 0
            total_score = 0
            c = time.time()
            # Calculate similarity for each field if provided
            if given_name_vars and record['given_name']:
                max_sim = max(
                    self.calculate_similarity(var, record['given_name'])
                    for var in given_name_vars
                )
                match_scores['given_name'] = max_sim
                total_score += max_sim
                fields_searched += 1
            
            if surname_vars and record['surname']:
                max_sim = max(
                    self.calculate_similarity(var, record['surname'])
                    for var in surname_vars
                )
                match_scores['surname'] = max_sim
                total_score += max_sim
                fields_searched += 1
            
            if father_name_vars and record['father_name']:
                max_sim = max(
                    self.calculate_similarity(var, record['father_name'])
                    for var in father_name_vars
                )
                match_scores['father_name'] = max_sim
                total_score += max_sim
                fields_searched += 1
            
            if fields_searched > 0:
                average_similarity = total_score / fields_searched
                if average_similarity >= min_similarity:
                    local_matches.append({
                        'record': record,
                        'overall_similarity': average_similarity,
                        'field_scores': match_scores
                    })
        
        processing_time = time.time() - start_time
        logger.info(f"{thread_name} completed processing in {processing_time:.2f} seconds. Found {len(local_matches)} matches")
        self.results_queue.put(local_matches)

    def search_specific_fields(self, given_name="", surname="", father_name="", min_similarity=0.5):
        if not any([given_name, surname, father_name]):
            return []
        
        start_time = time.time()
        logger.info("Starting search operation")
        
        try:
            # Get initial cursor for main thread
            a = time.time()
            cursor = self.get_db_cursor()
            
            query = """
                SELECT metadata_id, Image_Number, Record,
                    given_name, surname, father_name, father_surname,
                    mother_name, mother_surname, gender,
                    city,
                    spouse_name, spouse_surname, spouse_father_name,
                    spouse_father_surname, spouse_mother_name, spouse_mother_surname
                FROM metadata
                WHERE given_name IS NOT NULL 
                   OR surname IS NOT NULL 
                   OR father_name IS NOT NULL
            """
            
            logger.info("Fetching records from database")
            cursor.execute(query)
            all_records = cursor.fetchall()
            # print(time.time()-a)
            # Pre-compute variations
            logger.info("Computing name variations")
            b=time.time()
            given_name_vars = self.get_name_variations(given_name) if given_name else set()
            surname_vars = self.get_name_variations(surname) if surname else set()
            father_name_vars = self.get_name_variations(father_name) if father_name else set()
            # print(time.time()-b)
            # Calculate optimal batch size and number of threads
            total_records = len(all_records)
            num_threads = min(1, math.ceil(total_records / 1000))  # Max 8 threads, min 1000 records per thread
            batch_size = math.ceil(total_records / num_threads)
            # print(time.time()-b)
            logger.info(f"Using {num_threads} threads to process {total_records} records")
            
            # Split records into batches
            record_batches = [
                all_records[i:i + batch_size]
                for i in range(0, total_records, batch_size)
            ]
            d = time.time()
            # Process batches using thread pool
            with ThreadPoolExecutor(max_workers=num_threads) as executor:
                futures = [
                    executor.submit(
                        self.process_record_batch,
                        batch,
                        given_name_vars,
                        surname_vars,
                        father_name_vars,
                        min_similarity
                    )
                    for batch in record_batches
                ]
                
                # Wait for all threads to complete
                for future in as_completed(futures):
                    if future.exception():
                        logger.error(f"Thread error: {future.exception()}")
            # print(time.time()- d)
            # Collect results from queue
            all_matches = []
            while not self.results_queue.empty():
                # Only add matches with overall similarity > 0.65
                matches = self.results_queue.get()
                filtered_matches = [
                    match for match in matches 
                    if match.get('overall_similarity', 0) > 0.65
                ]
                all_matches.extend(filtered_matches)

            # Sort combined results
            all_matches.sort(key=lambda x: x['overall_similarity'], reverse=True)
            
            execution_time = time.time() - start_time
            logger.info(f"Search completed in {execution_time:.2f} seconds. Found {len(all_matches)} total matches")
            
            return all_matches
            
        except Exception as e:
            logger.error(f"Error in search operation: {str(e)}")
            return []
        finally:
            self.close_thread_connection()

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def upload_excel_to_database(file_path):
    connection = None
    cursor = None
    try:
        # Read specific columns from Excel file
        df = pd.read_excel(
            file_path,
            usecols=[
                'Image_Number',
                'Record',
                'District',
                'City/Place',
                'Village',
                'Address',
                'Registered By',
                'Given Name',
                'Surname',
                'Father Name',
                'Father Surname',
                'Mother Name',
                'Mother Surname',
                'Spouse Name',
                'Spouse Surname',
                'Spouse Father Name',
                'Spouse Father Surname',
                'Spouse Mother Name',
                'Spouse Mother Surname',
                'Relationship',
                'Gender',
                'Date',
                'Months',
                'Year',
                'Vikram Samvat',
                'Caste'
            ]
        )
        
        # Clean the data
        df = df.fillna('')
        
        # Connect to database 
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()
        
        # Insert data into database
        insert_query = """
        INSERT INTO metadata 
        (pandit_id, image_number, record, district, `city`, village, address, 
        registered_by, given_name, surname, father_name, father_surname,
        mother_name, mother_surname, spouse_name, spouse_surname,
        spouse_father_name, spouse_father_surname, spouse_mother_name,
        spouse_mother_surname, relationship, gender, date, months,
        year, vikram_samvat, caste)
        VALUES (2, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                %s, %s, %s, %s, %s, %s, NULLIF(%s, ''), %s, NULLIF(%s, ''),NULLIF(%s, ''), %s)
        """
        
        records = df.values.tolist()
        cursor.executemany(insert_query, records)
        connection.commit()
        
        return len(records)
        
    except Exception as e:
        if connection and connection.is_connected():
            connection.rollback()
        raise e
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

# Default route
@app.route('/')
def index():
    return jsonify({'message': 'Welcome to the API backend'}), 200

# Handle favicon.ico
@app.route('/favicon.ico')
def favicon():
    return '', 204

# Route for user signup
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    username = data.get('username')
    email = data.get('email')

    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        # Check if the email already exists
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        if cursor.fetchone():
            return jsonify({'message': 'Email already exists!'}), 400

        # Insert user into the database
        token = ''.join(random.choices(string.ascii_letters + string.digits, k=32))
        cursor.execute(
            "INSERT INTO users (first_name, last_name, username, email, token, status,user_type) VALUES (%s, %s, %s, %s, %s, 'pending','USER')",
            (first_name, last_name, username, email, token)
        )
        connection.commit()

        # Send verification email
        verification_link = f"{BASE_URL}/set-password/{token}"
        email_body = f"Hello {first_name},\n\nPlease click the link below to set your password:\n{verification_link}\n\nThank you!"
        send_email(email, "Set Your Password", email_body)

        return jsonify({'message': 'Account created successfully! Please check your email to set your password.'}), 201

    except mysql.connector.Error as err:
        return jsonify({'message': f'Database error: {err}'}), 500
    finally:
        if connection:
            cursor.close()
            connection.close()


@app.route('/api/set-password/<token>', methods=['POST'])
def set_password(token):
    data = request.get_json()
    password = data.get('password')
    
    # Validate password length and content
    if not password:
        return jsonify({'message': 'Password is required!'}), 400
        
    if not 8 <= len(password) <= 13:
        return jsonify({
            'message': 'Password must be between 8 and 13 characters long!'
        }), 400
        
    # Check if password contains only letters and numbers
    if not password.isalnum():
        return jsonify({
            'message': 'Password can only contain letters and numbers!'
        }), 400

    # Initialize connection and cursor as None
    connection = None
    cursor = None

    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        # Verify the token
        cursor.execute("SELECT * FROM users WHERE token = %s AND status = 'pending'", (token,))
        user = cursor.fetchone()
        
        if user:
            # Hash the password before storing
            # Convert the password to bytes
            password_bytes = password.encode('utf-8')
            # Generate salt and hash
            salt = bcrypt.gensalt()
            hashed_password = bcrypt.hashpw(password_bytes, salt)
            
            # Update the password and set the status to confirmed
            cursor.execute(
                "UPDATE users SET password = %s, token = NULL, status = 'confirmed' WHERE token = %s",
                (hashed_password, token)
            )
            connection.commit()
            return jsonify({'message': 'Password set successfully! You can now log in.'}), 200
        else:
            return jsonify({'message': 'Invalid or expired token!'}), 400

    except mysql.connector.Error as err:
        return jsonify({'message': f'Database error: {err}'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'message': 'Email and password are required!'}), 400

    # Initialize connection and cursor as None
    connection = None
    cursor = None

    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)  # Return results as dictionary

        # First get the user record to access the hashed password
        cursor.execute("SELECT user_id, email, password, user_type, username FROM users WHERE email = %s AND status = 'confirmed'", 
                      (email,))
        user = cursor.fetchone()
        
        if user and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            # Create session data (excluding sensitive information)
            user_data = {
                'user_id': user['user_id'],
                'email': user['email'],
                'user_type': user['user_type'],
                'username': user['username'],
            }
            
            # Determine redirect based on user type
            redirect_url = '/admin-dashboard' if user['user_type'] == 'ADMIN' else '/user-dashboard'
            
            return jsonify({
                'message': 'Login successful!',
                'user': user_data,
                'redirect': redirect_url
            }), 200
        else:
            return jsonify({'message': 'Invalid email or password!'}), 401

    except mysql.connector.Error as err:
        return jsonify({'message': f'Database error: {err}'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

@app.route('/api/upload-excel', methods=['POST'])
def upload_excel():
    if 'file' not in request.files:
        return jsonify({'message': 'No file part'}), 400
        
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400
        
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        try:
            file.save(file_path)
            records_count = upload_excel_to_database(file_path)
            
            # Clean up - remove the file after processing
            os.remove(file_path)
            
            return jsonify({
                'message': f'Successfully uploaded {records_count} records to database',
                'success': True
            }), 200
            
        except Exception as e:
            return jsonify({
                'message': f'Error processing file: {str(e)}',
                'success': False
            }), 500
            
    return jsonify({'message': 'Invalid file type'}), 400

# New route to get user profile
@app.route('/api/user-profile', methods=['GET'])
def get_user_profile():
    user_id = request.args.get('user_id')
    
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)
        
        cursor.execute("SELECT user_id, email, username, first_name, last_name, user_type FROM users WHERE user_id = %s", 
                      (user_id,))
        user = cursor.fetchone()
        
        if user:
            return jsonify({'user': user}), 200
        else:
            return jsonify({'message': 'User not found'}), 404
            
    except mysql.connector.Error as err:
        return jsonify({'message': f'Database error: {err}'}), 500
    finally:
        if connection:
            cursor.close()
            connection.close()

# Modified Flask route with logging
@app.route('/api/search', methods=['POST'])
def search_names():
    try:
        start_time = time.time()
        logger.info("Received search request")
        
        data = request.get_json()
        logger.info(f"Search parameters: {data}")
        
        # Validate input
        if not any(data.get(field) for field in ['given_name', 'surname', 'father_name']):
            logger.warning("No search fields provided")
            return jsonify({
                'success': False,
                'message': 'At least one search field is required'
            }), 400
            
        min_similarity = float(data.get('min_similarity', 0.5))
        
        # Perform search
        search_tool = HindiNameSearch()
        s = time.time()
        matches = search_tool.search_specific_fields(
            given_name=data.get('given_name', ''),
            surname=data.get('surname', ''),
            father_name=data.get('father_name', ''),
            min_similarity=min_similarity
        )
        # print(time.time()-s)
        # Format matches
        formatted_matches = [{
            'metadata_id': match['record']['metadata_id'],
            'image_number': match['record']['Image_Number'],
            'record_number': match['record']['Record'],
            'given_name': match['record']['given_name'],
            'surname': match['record']['surname'],
            'father_name': match['record']['father_name'],
            'father_surname': match['record']['father_surname'],
            'mother_name': match['record']['mother_name'],
            'mother_surname': match['record']['mother_surname'],
            'spouse_name': match['record']['spouse_name'],
            'spouse_surname': match['record']['spouse_surname'],
            'spouse_father_name': match['record']['spouse_father_name'],
            'spouse_father_surname': match['record']['spouse_father_surname'],
            'spouse_mother_name': match['record']['spouse_mother_name'],
            'spouse_mother_surname': match['record']['spouse_mother_surname'],
            'city': match['record']['city'],
            'overall_similarity': round(match['overall_similarity'] * 100, 2),
            'field_scores': {
                k: round(v * 100, 2) for k, v in match['field_scores'].items()
            },
            'match_quality': get_match_quality(match['overall_similarity'])
        } for match in matches]
        
        execution_time = time.time() - start_time
        # print(execution_time)
        logger.info(f"Request completed in {execution_time:.2f} seconds. Returning {len(formatted_matches)} matches")
        
        return jsonify({
            'success': True,
            'matches': formatted_matches,
            'total_matches': len(formatted_matches),
            'execution_time': execution_time
        }), 200
        
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'Error during search: {str(e)}'
        }), 500
    
def get_match_quality(similarity):
    if similarity >= 0.9: return "Excellent Match"
    if similarity >= 0.8: return "Very Good Match"
    if similarity >= 0.7: return "Good Match"
    if similarity >= 0.6: return "Fair Match"
    return "Partial Match"
    
@app.route('/api/family-tree/<int:metadata_id>', methods=['GET'])
def get_family_tree(metadata_id):
    try:
        # First get the image_number and record for the selected person
        person_details = get_person_details(metadata_id)
        
        if not person_details:
            return jsonify({
                'success': False,
                'message': 'Person not found'
            }), 404
            
        image_number = person_details['image_number']
        record = person_details['record']

        builder = FamilyTreeBuilder()
        root, members = builder.build_family_tree(image_number, record)
        
        # print(root)
        # print("\nComplete Family Tree:")
        # print_tree(root)

        if root:
            return jsonify({
                'success': True,
                'tree_data': root.to_dict(),
                'person_details': person_details
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': 'No family tree data found'
            }), 404
            
    except Exception as e:
        logger.error(f"Error in get_family_tree: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'Error building family tree: {str(e)}'
        }), 500

@app.route('/api/send-otp', methods=['POST'])
def send_otp():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({'message': 'Email is required'}), 400

    try:
        # Generate a random OTP
        otp = ''.join(random.choices(string.digits, k=6))

        # Save the OTP to the database
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        # Get user_id
        user_id = get_user_id_by_email(email, cursor)
        
        # Close all existing open OTPs for this user
        cursor.execute("""
            UPDATE otp_verification 
            SET status = 'closed' 
            WHERE user_id = %s AND status = 'open'
        """, (user_id,))

        # Insert a new OTP
        expires_at = datetime.now() + timedelta(minutes=30)
        cursor.execute("""
            INSERT INTO otp_verification 
            (user_id, otp, expires_at, status) 
            VALUES (%s, %s, %s, 'open')
        """, (user_id, otp, expires_at))

        connection.commit()

        # Send the OTP to the user's email
        subject = "Your OTP for Identity Verification"
        body = f"Your OTP is: {otp}"
        send_email(email, subject, body)

        return jsonify({'message': 'OTP sent to your email'}), 200

    except Exception as e:
        return jsonify({'message': f'Error sending OTP: {str(e)}'}), 500
    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()
    
@app.route('/api/verify-otp', methods=['POST'])
def verify_otp():
    data = request.get_json()
    email = data.get('email')
    otp = data.get('otp')

    if not email or not otp:
        return jsonify({'message': 'Email and OTP are required'}), 400

    try:
        # Verify the OTP
        is_valid_otp = verify_user_otp(email, otp)

        if is_valid_otp:
            # OTP is valid, update the status to 'used'
            connection = mysql.connector.connect(**db_config)
            cursor = connection.cursor()
            cursor.execute("""
                UPDATE otp_verification 
                SET status = 'used' 
                WHERE user_id = (SELECT user_id FROM users WHERE email = %s) 
                AND otp = %s 
                AND expires_at > NOW() 
                AND status = 'open'
            """, (email, otp))
            connection.commit()
            print('OTP verified successfully')
            return jsonify({'message': 'OTP verified successfully'}), 200
        else:
            print('Invalid OTP')
            return jsonify({'message': 'Invalid OTP'}), 401

    except Exception as e:
        return jsonify({'message': f'Error verifying OTP: {str(e)}'}), 500
    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/api/pandit-details/<int:metadata_id>', methods=['GET'])
def get_pandit_details(metadata_id):
    # Check for authorization header
    print("get_pandit_details")
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'message': 'Missing or invalid authorization token'}), 401
        
    user_id = auth_header.split(' ')[1]
    # print(user_id)
    
    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)
        
        # Check if user exists and is confirmed
        cursor.execute("""
            SELECT user_id 
            FROM users 
            WHERE status = 'confirmed' 
            AND user_id = %s
        """, (user_id,))
        
        user = cursor.fetchone()
        if not user:
            return jsonify({'message': 'Invalid token'}), 401

        # Get pandit details from metadata table
        cursor.execute("SELECT pandit_id FROM metadata WHERE metadata_id = %s", (metadata_id,))
        metadata_result = cursor.fetchone()
        
        if not metadata_result or not metadata_result['pandit_id']:
            return jsonify({'message': 'No pandit associated with this record'}), 404

        # Get pandit details using the pandit_id
        cursor.execute("""
            SELECT name, location, contact_info 
            FROM pandit 
            WHERE pandit_id = %s
        """, (metadata_result['pandit_id'],))
        
        pandit = cursor.fetchone()
        # print("pandit :",pandit)
        if not pandit:
            return jsonify({'message': 'Pandit details not found'}), 404

        return jsonify({
            'name': pandit['name'],
            'location': pandit['location'],
            'contact_info': pandit['contact_info']
        }), 200

    except mysql.connector.Error as err:
        return jsonify({'message': f'Database error: {str(err)}'}), 500
    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/api/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')
    
    if not email:
        return jsonify({'message': 'Email is required!'}), 400

    connection = None
    cursor = None

    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)

        # Check if user exists and is confirmed
        cursor.execute(
            "SELECT user_id FROM users WHERE email = %s AND status = 'confirmed'", 
            (email,)
        )
        user = cursor.fetchone()

        if not user:
            # Return success even if email doesn't exist (security best practice)
            return jsonify({
                'message': 'If your email is registered, you will receive password reset instructions.'
            }), 200

        # Generate recovery token
        token = secrets.token_urlsafe(32)
        expires_at = datetime.utcnow() + timedelta(hours=1)

        # Clear any existing recovery entries for this user
        cursor.execute(
            "UPDATE password_recovery SET is_used = 1 WHERE user_id = %s AND is_used = 0",
            (user['user_id'],)
        )

        # Create new recovery entry
        cursor.execute("""
            INSERT INTO password_recovery 
            (user_id, recovery_token, created_at, expires_at) 
            VALUES (%s, %s, %s, %s)
        """, (user['user_id'], token, datetime.utcnow(), expires_at))

        connection.commit()

        # Prepare email content
        reset_link = f"{BASE_URL}/reset-password?token={token}"
        subject = "Password Reset Request"
        body = f"""
        Hello,

        You have requested to reset your password. Please click the link below to reset your password:

        {reset_link}

        This link will expire in 1 hour.

        If you did not request this reset, please ignore this email.

        Best regards,
        Your Application Team
        """

        # Send email using existing function
        try:
            send_email(email, subject, body)
            return jsonify({
                'message': 'If your email is registered, you will receive password reset instructions.'
            }), 200
        except Exception as e:
            print(f"Error sending email: {e}")
            return jsonify({'message': 'Error sending email. Please try again later.'}), 500

    except mysql.connector.Error as err:
        return jsonify({'message': f'Database error: {err}'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

@app.route('/api/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    token = data.get('token')
    new_password = data.get('password')
    # print(new_password)
    
    if not token or not new_password:
        return jsonify({'message': 'Token and new password are required!'}), 400

    # Validate password
    is_valid, error_message = validate_password(new_password)
    if not is_valid:
        return jsonify({'message': error_message}), 400

    connection = None
    cursor = None

    try:
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor(dictionary=True)

        # Get recovery entry
        cursor.execute("""
            SELECT pr.user_id, pr.expires_at, pr.is_used
            FROM password_recovery pr
            WHERE pr.recovery_token = %s
        """, (token,))
        
        recovery = cursor.fetchone()

        if not recovery or recovery['is_used'] or recovery['expires_at'] < datetime.utcnow():
            return jsonify({'message': 'Invalid or expired reset token!'}), 400

        # Hash the new password
        hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())

        # Update password and mark recovery token as used
        cursor.execute(
            "UPDATE users SET password = %s WHERE user_id = %s",
            (hashed_password.decode('utf-8'), recovery['user_id'])
        )
        
        cursor.execute(
            "UPDATE password_recovery SET is_used = 1 WHERE recovery_token = %s",
            (token,)
        )

        connection.commit()

        # Send confirmation email
        try:
            cursor.execute("SELECT email, first_name FROM users WHERE user_id = %s", (recovery['user_id'],))
            user = cursor.fetchone()
            if user:
                subject = "Password Reset Successful"
                body = f"""
                Hello {user['first_name']},

                Your password has been successfully reset.

                If you did not make this change, please contact our support team immediately.

                Best regards,
                Your Application Team
                """
                send_email(user['email'], subject, body)
        except Exception as e:
            print(f"Error sending confirmation email: {e}")
            # Don't return an error since the password was reset successfully

        return jsonify({'message': 'Password has been reset successfully!'}), 200

    except mysql.connector.Error as err:
        return jsonify({'message': f'Database error: {err}'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

# Run the app
if __name__ == '__main__':
    # app.run(host='0.0.0.0', port=PORT, debug=True)
    # socketio.run(app,host='0.0.0.0',  # This makes it listen on all interfaces
    #         port=PORT,
    #         debug=True,
    #         allow_unsafe_werkzeug=True)
    serve(app, host='0.0.0.0', port=PORT)
