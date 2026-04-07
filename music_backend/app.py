from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

# Creates Backend server
app = Flask(__name__)
CORS(app)  # Allow requests from the HTML/JS frontend

# DATABASE CONNECTION
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Omkar1234567890",
    database="music_theory"
)

# Cursor for JSON output
cursor = db.cursor(dictionary=True)

# ========================= BASIC ROUTES ========================= #

@app.route('/')
def home():
    return "Flask Backend Running"

@app.route('/test')
def test():
    return "Test Working"


# ========================= USER CRUD ========================= #

# CREATE USER
@app.route('/add_user', methods=['POST'])
def add_user():
    data = request.json

    query = "INSERT INTO USER (F_NAME, L_NAME, EMAIL_ID, USER_PASS) VALUES (%s, %s, %s, %s)"
    values = (data['f_name'], data['l_name'], data['email'], data['password'])

    cursor.execute(query, values)
    db.commit()

    return jsonify({"message": "User added successfully"})


# READ ALL USERS
@app.route('/users', methods=['GET'])
def get_users():
    cursor.execute("SELECT * FROM USER")
    return jsonify(cursor.fetchall())


# READ SINGLE USER
@app.route('/user/<int:id>', methods=['GET'])
def get_user(id):
    cursor.execute("SELECT * FROM USER WHERE USER_ID=%s", (id,))
    user = cursor.fetchone()

    if user:
        return jsonify(user)
    return jsonify({"message": "User not found"})


# UPDATE USER
@app.route('/update_user/<int:id>', methods=['PUT'])
def update_user(id):
    data = request.json

    query = "UPDATE USER SET F_NAME=%s, L_NAME=%s WHERE USER_ID=%s"
    values = (data['f_name'], data['l_name'], id)

    cursor.execute(query, values)
    db.commit()

    return jsonify({"message": "User updated"})


# DELETE USER
@app.route('/delete_user/<int:id>', methods=['DELETE'])
def delete_user(id):
    cursor.execute("DELETE FROM USER WHERE USER_ID=%s", (id,))
    db.commit()

    return jsonify({"message": "User deleted"})


# ========================= INSTRUMENT ========================= #

@app.route('/add_instrument', methods=['POST'])
def add_instrument():
    data = request.json

    query = "INSERT INTO INSTRUMENT (INSTRUMENT_NAME, INSTRUMENT_TYPE) VALUES (%s, %s)"
    cursor.execute(query, (data['name'], data['type']))
    db.commit()

    return jsonify({"message": "Instrument added"})


@app.route('/instruments', methods=['GET'])
def get_instruments():
    cursor.execute("SELECT * FROM INSTRUMENT")
    return jsonify(cursor.fetchall())


# ========================= USER-INSTRUMENT ========================= #

@app.route('/assign_instrument', methods=['POST'])
def assign_instrument():
    data = request.json

    query = "INSERT INTO USER_INSTRUMENT (USER_ID, INSTRUMENT_ID) VALUES (%s, %s)"
    cursor.execute(query, (data['user_id'], data['instrument_id']))
    db.commit()

    return jsonify({"message": "Instrument assigned"})


@app.route('/user/<int:id>/instruments', methods=['GET'])
def get_user_instruments(id):
    query = """
    SELECT I.* FROM INSTRUMENT I
    JOIN USER_INSTRUMENT UI ON I.INSTRUMENT_ID = UI.INSTRUMENT_ID
    WHERE UI.USER_ID = %s
    """

    cursor.execute(query, (id,))
    return jsonify(cursor.fetchall())


# ========================= COURSE MODULE ========================= #

@app.route('/add_module', methods=['POST'])
def add_module():
    data = request.json

    query = "INSERT INTO COURSE_MODULE (TITLE, LEVEL, INSTRUMENT_ID) VALUES (%s, %s, %s)"
    values = (data['title'], data['level'], data['instrument_id'])

    cursor.execute(query, values)
    db.commit()

    return jsonify({"message": "Module added"})


@app.route('/modules', methods=['GET'])
def get_modules():
    cursor.execute("SELECT * FROM COURSE_MODULE")
    return jsonify(cursor.fetchall())


# ========================= THEORY CONCEPT ========================= #

@app.route('/add_concept', methods=['POST'])
def add_concept():
    data = request.json

    query = "INSERT INTO THEORY_CONCEPT (T_NAME, DIFFICULTY, DESCRIPTION) VALUES (%s, %s, %s)"
    values = (data['name'], data['difficulty'], data['description'])

    cursor.execute(query, values)
    db.commit()

    return jsonify({"message": "Concept added"})


@app.route('/concepts', methods=['GET'])
def get_concepts():
    cursor.execute("SELECT * FROM THEORY_CONCEPT")
    return jsonify(cursor.fetchall())


# ========================= MODULE-CONCEPT LINK ========================= #

@app.route('/link_module_concept', methods=['POST'])
def link_module_concept():
    data = request.json

    query = "INSERT INTO MODULE_CONCEPT (MODULE_ID, CONCEPT_ID) VALUES (%s, %s)"
    values = (data['module_id'], data['concept_id'])

    cursor.execute(query, values)
    db.commit()

    return jsonify({"message": "Linked successfully"})


@app.route('/module/<int:id>/concepts', methods=['GET'])
def get_module_concepts(id):
    query = """
    SELECT TC.* FROM THEORY_CONCEPT TC
    JOIN MODULE_CONCEPT MC ON TC.CONCEPT_ID = MC.CONCEPT_ID
    WHERE MC.MODULE_ID = %s
    """

    cursor.execute(query, (id,))
    return jsonify(cursor.fetchall())


# ========================= EXERCISE ========================= #

# ADD EXERCISE (UPDATED WITH CONCEPT_ID)
@app.route('/add_exercise', methods=['POST'])
def add_exercise():
    data = request.json

    query = "INSERT INTO EXERCISE (QUESTION, CORRECT_ANSWER, CONCEPT_ID) VALUES (%s, %s, %s)"
    values = (data['question'], data['answer'], data['concept_id'])

    cursor.execute(query, values)
    db.commit()

    return jsonify({"message": "Exercise added"})


# GET ALL EXERCISES
@app.route('/exercises', methods=['GET'])
def get_exercises():
    cursor.execute("SELECT * FROM EXERCISE")
    return jsonify(cursor.fetchall())


# GET EXERCISES BY CONCEPT (IMPORTANT)
@app.route('/exercises/<int:concept_id>', methods=['GET'])
def get_exercises_by_concept(concept_id):
    query = "SELECT * FROM EXERCISE WHERE CONCEPT_ID=%s"
    cursor.execute(query, (concept_id,))
    return jsonify(cursor.fetchall())


# ========================= PROGRESS ========================= #

@app.route('/add_progress', methods=['POST'])
def add_progress():
    data = request.json

    query = "INSERT INTO PROGRESS (USER_ID, SCORE, STATUS) VALUES (%s, %s, %s)"
    values = (data['user_id'], data['score'], data['status'])

    cursor.execute(query, values)
    db.commit()

    return jsonify({"message": "Progress added"})


@app.route('/progress/<int:user_id>', methods=['GET'])
def get_progress(user_id):
    cursor.execute("SELECT * FROM PROGRESS WHERE USER_ID=%s", (user_id,))
    return jsonify(cursor.fetchall())


# ========================= START SERVER ========================= #

if __name__ == '__main__':
    app.run(debug=True)