from flask import Flask, request, jsonify
import mysql.connector

# Creates Backend server
app = Flask(__name__)

# DATABASE CONNECTION
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Omkar1234567890",
    database="music_theory"
)

# To run Queries in JSON format
cursor = db.cursor(dictionary=True)

# Home Route
@app.route('/')
def home():
    return "Flask Backend Running"

# Test Route
@app.route('/test')
def test():
    return "Test Working"



# USER CRUD #

# CREATE USER
@app.route('/add_user', methods=['POST'])
def add_user():
    data = request.json

    # Insert new user into database
    query = "INSERT INTO USER (F_NAME, L_NAME, EMAIL_ID, USER_PASS) VALUES (%s, %s, %s, %s)"
    values = (data['f_name'], data['l_name'], data['email'], data['password'])

    cursor.execute(query, values)
    db.commit()

    return jsonify({"message": "User added successfully"})


# READ ALL USERS
@app.route('/users', methods=['GET'])
def get_users():
    # Fetch all users
    cursor.execute("SELECT * FROM USER")
    users = cursor.fetchall()

    return jsonify(users)


# READ SINGLE USER BY ID
@app.route('/user/<int:id>', methods=['GET'])
def get_user(id):
    query = "SELECT * FROM USER WHERE USER_ID = %s"
    cursor.execute(query, (id,))
    
    user = cursor.fetchone()

    if user:
        return jsonify(user)
    else:
        return jsonify({"message": "User not found"})


# READ USER BY EMAIL
@app.route('/user/email/<email>', methods=['GET'])
def get_user_by_email(email):
    query = "SELECT * FROM USER WHERE EMAIL_ID = %s"
    cursor.execute(query, (email,))
    
    user = cursor.fetchone()

    if user:
        return jsonify(user)
    else:
        return jsonify({"message": "User not found"})


# UPDATE USER
@app.route('/update_user/<int:id>', methods=['PUT'])
def update_user(id):
    data = request.json

    # Update user details
    query = "UPDATE USER SET F_NAME=%s, L_NAME=%s WHERE USER_ID=%s"
    values = (data['f_name'], data['l_name'], id)

    cursor.execute(query, values)
    db.commit()

    return jsonify({"message": "User updated"})


# DELETE USER
@app.route('/delete_user/<int:id>', methods=['DELETE'])
def delete_user(id):
    # Delete user by ID
    query = "DELETE FROM USER WHERE USER_ID=%s"

    cursor.execute(query, (id,))
    db.commit()

    return jsonify({"message": "User deleted"})


# START SERVER
if __name__ == '__main__':
    app.run(debug=True)
