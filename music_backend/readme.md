🎵 Music Theory Learning System
📌 Project Overview

The Music Theory Learning System is a backend-driven educational platform designed to help beginners and instrument players understand music theory in a structured and practical way.

The system connects:

🎸 Instruments
🎼 Music types
📘 Course modules
🧠 Theory concepts
📝 Exercises
📊 User progress tracking

It is built using:

MySQL (Database)
Flask (Backend API)
Future Frontend Integration (React / HTML / CSS)
🎯 Objective

Traditional music learning often separates theory from practical instrument use.
This project solves that problem by building a database-driven structured learning system that:

Organizes music theory content
Personalizes learning based on instrument
Tracks user enrollment and performance
Maintains scalable and normalized database design (3NF)
🗄️ Database Design Approach (DB-First)

We followed a structured database-first methodology:

Identify Problem Statement
Identify Entities & Relationships
Design EER Diagram
Convert EER → Relational Schema
Normalize up to 3NF
Implement in MySQL
Connect Backend (Flask)
Test APIs using Postman
🧱 System Architecture
Frontend (Future)
        ↓
Flask Backend (API Layer)
        ↓
MySQL Database
📚 Entities and Tables
✅ Strong Entities
1️⃣ USER

Stores learner information.

user_id (PK)
first_name
middle_name (optional)
last_name
email (UNIQUE)
password
level (BEGINNER / INTERMEDIATE / ADVANCED)
created_at
2️⃣ INSTRUMENT

Stores available instruments.

instrument_id (PK)
instrument_name
instrument_type
3️⃣ COURSE_MODULE (Core Table)

Represents structured lessons.

module_id (PK)
title
description
level
instrument_id (FK)
music_id (FK)
4️⃣ THEORY_CONCEPT

Stores music theory topics.

concept_id (PK)
name (UNIQUE)
difficulty (EASY / MEDIUM / HARD)
description
5️⃣ EXERCISE

Stores practice questions.

exercise_id (PK)
question
correct_answer
module_id (FK)
6️⃣ MUSIC

Stores music categories.

music_id (PK)
music_type
music_language
⚠️ Weak Entity
PROGRESS

Tracks user performance per module.

progress_id (Partial Key)
user_id (FK)
module_id (FK)
completion_status
score (0–100)
progress_percentage (0–100)

Composite Primary Key:

(progress_id, user_id, module_id)
🔗 Relationship / Junction Tables
USER_INSTRUMENT

Resolves many-to-many between USER and INSTRUMENT.

Composite PK:

(user_id, instrument_id)
ENROLLMENT

Tracks which user enrolled in which module.

Composite PK:

(user_id, module_id)
MODULE_CONCEPT

Connects modules and theory concepts.

Composite PK:

(module_id, concept_id)
🔗 Relationships Summary
USER ---< USER_INSTRUMENT >--- INSTRUMENT        (M:N)

USER ---< ENROLLMENT >--- COURSE_MODULE          (M:N)

COURSE_MODULE ---< EXERCISE                     (1:N)

COURSE_MODULE ---< MODULE_CONCEPT >--- THEORY_CONCEPT (M:N)

USER ---< PROGRESS                              (1:N)

COURSE_MODULE --- USES --- MUSIC                (N:1)
🛠 MySQL Features Used
PRIMARY KEY
FOREIGN KEY
ON DELETE CASCADE
ON DELETE SET NULL
ENUM
CHECK constraints
AUTO_INCREMENT
DEFAULT values
Composite Primary Keys
Normalization up to 3NF
🧪 Query Testing

The following operations were tested:

✅ INSERT (Create)
✅ SELECT (Read)
✅ UPDATE
✅ DELETE
✅ JOINS
✅ GROUP BY + HAVING
✅ Aggregate Functions (AVG Score)
✅ String functions

All CRUD operations were validated successfully.

🚀 Flask Backend Implementation
📁 Project Structure
music_flask_backend/
│
├── app.py
📦 Required Libraries
pip install flask flask-cors mysql-connector-python
🔌 Database Connection (Example)
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="your_password",
    database="music_theory"
)
🌐 Basic Route
@app.route('/')
def home():
    return "Flask Backend Running"

Server runs at:

http://127.0.0.1:5000/
🧠 Design Concepts Applied
🔹 Composite Primary Keys

Used in:

USER_INSTRUMENT
MODULE_CONCEPT
ENROLLMENT
PROGRESS

Prevents duplicate relationship entries.

🔹 Referential Integrity

Maintained using FOREIGN KEYS.

🔹 ON DELETE CASCADE

Prevents orphan records.

🔹 ENUM

Restricts values (Level, Difficulty, Status).

🔹 CHECK Constraint

Validates score (0–100).

🔹 Normalization (3NF)

Removes redundancy and ensures scalability.

📊 System Capabilities

✔ Instrument-based learning
✔ Structured modules
✔ Theory breakdown into concepts
✔ Practice exercises
✔ Enrollment tracking
✔ Real-time progress monitoring
✔ Scalable database design
✔ Backend-ready architecture

🔮 Future Improvements
🔐 JWT Authentication
👨‍🎓 Role-based access (Admin / User)
📈 Analytics dashboard
🎵 Audio integration
📱 Frontend (React)
🧠 Recommendation system
🗂 Module ordering & prerequisites
📌 Final Outcome

The project successfully delivers:

A fully normalized MySQL database
Connected relational schema
Backend CRUD APIs
Proper constraint implementation
Scalable architecture ready for frontend integration


👨‍💻 Author

DBMS Mini Project
Music Theory Learning System