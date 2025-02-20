import os

# # Database Configuration XMAPP
# DB_CONFIG = {
#     'host': 'localhost',
#     'user': 'root',
#     'password': '',
#     'database': 'indiangenealogy'
# }

# Database Configuration MYSQL
DB_CONFIG = {
    'host': '127.0.0.1',
    'port': 3307,
    'user': 'root',
    'password': 'mindlinks@2024',
    'database': 'indiangenealogy'
}

# File Upload Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'xlsx', 'xls'}

# Email Configuration
EMAIL_CONFIG = {
    'sender_email': 'jaiprakash@mindlinksinc.com',
    'sender_password': 'qlhb pqcl uome kncg',
    'smtp_server': 'smtp.gmail.com',
    'smtp_port': 587
}

# Create uploads folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

BASE_URL = 'http://localhost:5173'

# for deployment
# BASE_URL = 'http://34.203.168.60' #PORT 80

PORT = 5000


