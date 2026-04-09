from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
import os

# Serve the frontend from the sibling music_frontend folder
FRONTEND_DIR = os.path.join(os.path.dirname(__file__), '..', 'music_frontend')

app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path='')
CORS(app)

@app.route('/')
def serve_index():
    return send_from_directory(FRONTEND_DIR, 'index.html')

# ── DB config ─────────────────────────────────────────────────────────────────
DB_CONFIG = {
    "host":     "localhost",
    "user":     "root",
    "password": "soham260206",
    "database": "music_theory"
}

def get_db():
    """Return a fresh connection (handles reconnect if connection dropped)."""
    conn = mysql.connector.connect(**DB_CONFIG)
    return conn

# ── Helper: run a query and return results ────────────────────────────────────
def query(sql, params=(), fetchone=False, commit=False):
    conn = get_db()
    cur  = conn.cursor(dictionary=True)
    try:
        cur.execute(sql, params)
        if commit:
            conn.commit()
            return {"affected": cur.rowcount}
        return cur.fetchone() if fetchone else cur.fetchall()
    except Error as e:
        conn.rollback()
        raise e
    finally:
        cur.close()
        conn.close()

# ── Health check ──────────────────────────────────────────────────────────────
@app.route('/')
def home():
    return jsonify({"status": "Flask Backend Running ✅", "version": "1.0"})

@app.route('/test')
def test():
    return jsonify({"status": "ok"})


# ══════════════════════════ USER CRUD ═════════════════════════════════════════

@app.route('/users', methods=['GET'])
def get_users():
    return jsonify(query("SELECT * FROM user"))

@app.route('/user/<int:id>', methods=['GET'])
def get_user(id):
    row = query("SELECT * FROM user WHERE USER_ID=%s", (id,), fetchone=True)
    return jsonify(row) if row else (jsonify({"error": "User not found"}), 404)

@app.route('/add_user', methods=['POST'])
def add_user():
    d = request.json
    query(
        "INSERT INTO user (F_NAME, L_NAME, EMAIL_ID, USER_PASS) VALUES (%s,%s,%s,%s)",
        (d['f_name'], d['l_name'], d['email'], d['password']),
        commit=True
    )
    return jsonify({"message": "User added successfully"}), 201

@app.route('/update_user/<int:id>', methods=['PUT'])
def update_user(id):
    d = request.json
    query(
        "UPDATE user SET F_NAME=%s, L_NAME=%s WHERE USER_ID=%s",
        (d['f_name'], d['l_name'], id),
        commit=True
    )
    return jsonify({"message": "User updated"})

@app.route('/delete_user/<int:id>', methods=['DELETE'])
def delete_user(id):
    query("DELETE FROM user WHERE USER_ID=%s", (id,), commit=True)
    return jsonify({"message": "User deleted"})


# ══════════════════════════ INSTRUMENT ════════════════════════════════════════

@app.route('/instruments', methods=['GET'])
def get_instruments():
    return jsonify(query("SELECT * FROM instrument"))

@app.route('/add_instrument', methods=['POST'])
def add_instrument():
    d = request.json
    query(
        "INSERT INTO instrument (INSTRUMENT_NAME, INSTRUMENT_TYPE) VALUES (%s,%s)",
        (d['name'], d['type']),
        commit=True
    )
    return jsonify({"message": "Instrument added"}), 201


# ══════════════════════════ USER-INSTRUMENT ════════════════════════════════════

@app.route('/assign_instrument', methods=['POST'])
def assign_instrument():
    d = request.json
    query(
        "INSERT INTO user_instrument (USER_ID, INSTRUMENT_ID) VALUES (%s,%s)",
        (d['user_id'], d['instrument_id']),
        commit=True
    )
    return jsonify({"message": "Instrument assigned"}), 201

@app.route('/user/<int:id>/instruments', methods=['GET'])
def get_user_instruments(id):
    sql = """
        SELECT i.* FROM instrument i
        JOIN user_instrument ui ON i.INSTRUMENT_ID = ui.INSTRUMENT_ID
        WHERE ui.USER_ID = %s
    """
    return jsonify(query(sql, (id,)))


# ══════════════════════════ MUSIC ═════════════════════════════════════════════

@app.route('/music', methods=['GET'])
def get_music():
    return jsonify(query("SELECT * FROM music"))

@app.route('/add_music', methods=['POST'])
def add_music():
    d = request.json
    query(
        "INSERT INTO music (MUSIC_TYPE, MUSIC_LANGUAGE) VALUES (%s,%s)",
        (d['type'], d['language']),
        commit=True
    )
    return jsonify({"message": "Music added"}), 201


# ══════════════════════════ COURSE MODULE ═════════════════════════════════════

@app.route('/modules', methods=['GET'])
def get_modules():
    sql = """
        SELECT cm.*, i.INSTRUMENT_NAME, m.MUSIC_TYPE
        FROM course_module cm
        JOIN instrument i ON cm.INSTRUMENT_ID = i.INSTRUMENT_ID
        LEFT JOIN music m ON cm.MUSIC_ID = m.MUSIC_ID
    """
    return jsonify(query(sql))

@app.route('/module/<int:id>', methods=['GET'])
def get_module(id):
    sql = """
        SELECT cm.*, i.INSTRUMENT_NAME, m.MUSIC_TYPE
        FROM course_module cm
        JOIN instrument i ON cm.INSTRUMENT_ID = i.INSTRUMENT_ID
        LEFT JOIN music m ON cm.MUSIC_ID = m.MUSIC_ID
        WHERE cm.MODULE_ID = %s
    """
    row = query(sql, (id,), fetchone=True)
    return jsonify(row) if row else (jsonify({"error": "Module not found"}), 404)

@app.route('/add_module', methods=['POST'])
def add_module():
    d = request.json
    query(
        "INSERT INTO course_module (TITLE, DESCRIPTION, LEVEL, INSTRUMENT_ID, MUSIC_ID) VALUES (%s,%s,%s,%s,%s)",
        (d['title'], d.get('description',''), d['level'], d['instrument_id'], d.get('music_id')),
        commit=True
    )
    return jsonify({"message": "Module added"}), 201


# ══════════════════════════ THEORY CONCEPT ════════════════════════════════════

@app.route('/concepts', methods=['GET'])
def get_concepts():
    return jsonify(query("SELECT * FROM theory_concept"))

@app.route('/add_concept', methods=['POST'])
def add_concept():
    d = request.json
    query(
        "INSERT INTO theory_concept (NAME, DIFFICULTY, DESCRIPTION) VALUES (%s,%s,%s)",
        (d['name'], d['difficulty'], d.get('description','')),
        commit=True
    )
    return jsonify({"message": "Concept added"}), 201


# ══════════════════════════ MODULE-CONCEPT ════════════════════════════════════

@app.route('/link_module_concept', methods=['POST'])
def link_module_concept():
    d = request.json
    query(
        "INSERT INTO module_concept (MODULE_ID, CONCEPT_ID) VALUES (%s,%s)",
        (d['module_id'], d['concept_id']),
        commit=True
    )
    return jsonify({"message": "Linked successfully"}), 201

@app.route('/module/<int:id>/concepts', methods=['GET'])
def get_module_concepts(id):
    sql = """
        SELECT tc.* FROM theory_concept tc
        JOIN module_concept mc ON tc.CONCEPT_ID = mc.CONCEPT_ID
        WHERE mc.MODULE_ID = %s
    """
    return jsonify(query(sql, (id,)))


# ══════════════════════════ EXERCISE ══════════════════════════════════════════

@app.route('/exercises', methods=['GET'])
def get_exercises():
    sql = """
        SELECT e.*, cm.TITLE AS MODULE_TITLE
        FROM exercise e
        JOIN course_module cm ON e.MODULE_ID = cm.MODULE_ID
    """
    return jsonify(query(sql))

@app.route('/exercises/module/<int:module_id>', methods=['GET'])
def get_exercises_by_module(module_id):
    return jsonify(query("SELECT * FROM exercise WHERE MODULE_ID=%s", (module_id,)))

@app.route('/add_exercise', methods=['POST'])
def add_exercise():
    d = request.json
    query(
        "INSERT INTO exercise (QUESTION, CORRECT_ANSWER, MODULE_ID) VALUES (%s,%s,%s)",
        (d['question'], d['answer'], d['module_id']),
        commit=True
    )
    return jsonify({"message": "Exercise added"}), 201


# ══════════════════════════ ENROLLMENT ════════════════════════════════════════

@app.route('/enroll', methods=['POST'])
def enroll():
    d = request.json
    query(
        "INSERT INTO enrollment (USER_ID, MODULE_ID) VALUES (%s,%s)",
        (d['user_id'], d['module_id']),
        commit=True
    )
    return jsonify({"message": "Enrolled successfully"}), 201

@app.route('/enrollments', methods=['GET'])
def get_enrollments():
    sql = """
        SELECT e.*, u.F_NAME, u.L_NAME, cm.TITLE AS MODULE_TITLE
        FROM enrollment e
        JOIN user u ON e.USER_ID = u.USER_ID
        JOIN course_module cm ON e.MODULE_ID = cm.MODULE_ID
    """
    return jsonify(query(sql))

@app.route('/user/<int:id>/enrollments', methods=['GET'])
def get_user_enrollments(id):
    sql = """
        SELECT cm.* FROM course_module cm
        JOIN enrollment e ON cm.MODULE_ID = e.MODULE_ID
        WHERE e.USER_ID = %s
    """
    return jsonify(query(sql, (id,)))


# ══════════════════════════ PROGRESS ══════════════════════════════════════════

@app.route('/progress', methods=['GET'])
def get_all_progress():
    sql = """
        SELECT p.*, u.F_NAME, u.L_NAME, cm.TITLE AS MODULE_TITLE
        FROM progress p
        JOIN user u ON p.USER_ID = u.USER_ID
        JOIN course_module cm ON p.MODULE_ID = cm.MODULE_ID
    """
    return jsonify(query(sql))

@app.route('/progress/<int:user_id>', methods=['GET'])
def get_progress(user_id):
    sql = """
        SELECT p.*, cm.TITLE AS MODULE_TITLE
        FROM progress p
        JOIN course_module cm ON p.MODULE_ID = cm.MODULE_ID
        WHERE p.USER_ID = %s
    """
    return jsonify(query(sql, (user_id,)))

@app.route('/add_progress', methods=['POST'])
def add_progress():
    d = request.json
    query(
        """INSERT INTO progress (USER_ID, MODULE_ID, COMPLETION_STATUS, SCORE, PROGRESS_PERCENTAGE)
           VALUES (%s,%s,%s,%s,%s)""",
        (d['user_id'], d['module_id'],
         d.get('status', 'NOT STARTED'),
         d.get('score', 0),
         d.get('progress_percentage', 0)),
        commit=True
    )
    return jsonify({"message": "Progress added"}), 201

@app.route('/update_progress/<int:progress_id>', methods=['PUT'])
def update_progress(progress_id):
    d = request.json
    query(
        """UPDATE progress SET COMPLETION_STATUS=%s, SCORE=%s, PROGRESS_PERCENTAGE=%s
           WHERE PROGRESS_ID=%s""",
        (d['status'], d['score'], d['progress_percentage'], progress_id),
        commit=True
    )
    return jsonify({"message": "Progress updated"})


# ══════════════════════════ NOTES ═════════════════════════════════════════════

@app.route('/notes', methods=['GET'])
def get_notes():
    return jsonify(query("SELECT * FROM notes ORDER BY created_at DESC"))

@app.route('/notes/<int:id>', methods=['GET'])
def get_note(id):
    row = query("SELECT * FROM notes WHERE note_id=%s", (id,), fetchone=True)
    return jsonify(row) if row else (jsonify({"error": "Note not found"}), 404)

@app.route('/add_note', methods=['POST'])
def add_note():
    d = request.json
    query(
        "INSERT INTO notes (title, category, description) VALUES (%s, %s, %s)",
        (d.get('title'), d.get('category'), d.get('description')),
        commit=True
    )
    return jsonify({"message": "Note added"}), 201

@app.route('/update_note/<int:id>', methods=['PUT'])
def update_note(id):
    d = request.json
    query(
        "UPDATE notes SET title=%s, category=%s, description=%s WHERE note_id=%s",
        (d.get('title'), d.get('category'), d.get('description'), id),
        commit=True
    )
    return jsonify({"message": "Note updated"})

@app.route('/delete_note/<int:id>', methods=['DELETE'])
def delete_note(id):
    query("DELETE FROM notes WHERE note_id=%s", (id,), commit=True)
    return jsonify({"message": "Note deleted"})


# ══════════════════════════ ERROR HANDLERS ════════════════════════════════════

@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Route not found"}), 404

@app.errorhandler(500)
def server_error(e):
    return jsonify({"error": str(e)}), 500


# ════════════════════════════ START ══════════════════════════════════════════

if __name__ == '__main__':
    app.run(debug=True, port=5000)