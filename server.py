from flask import Flask, jsonify, render_template, redirect, request
import sqlite3
from flask_sqlalchemy import SQLAlchemy


# init flask api
app = Flask(__name__)

# flask routes
@app.route('/')
def default():
    return redirect('/login')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/home')
def home():
    return render_template('home.html')

def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db_connection()
    conn.execute('''CREATE TABLE IF NOT EXISTS accounts (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT,
                        email TEXT,
                        username TEXT NOT NULL,
                        password TEXT NOT NULL)''')

    conn.execute('''INSERT INTO accounts(name, email, username, password)
                    VALUES(?, ?, ?, ?)''',
                 ("Alan Jith", "jith@gmail.com", "ajith", "1234"))
    conn.commit()
    conn.close()


def drop_table():
    conn = get_db_connection()
    conn.execute('''DROP TABLE IF EXISTS accounts;''')
    conn.commit()
    conn.close()

@app.route('/accounts_testbank', methods=['GET'])
def get_users():
    conn = get_db_connection()
    users = conn.execute('SELECT * FROM accounts').fetchall()
    conn.close()

    user_list = [dict(user) for user in users]

    return jsonify(user_list)



app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///forum.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Database Models
class Thread(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    comments = db.relationship('Comment', backref='thread', lazy=True)

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    thread_id = db.Column(db.Integer, db.ForeignKey('thread.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    helpful_count = db.Column(db.Integer, default=0)  # Helpful count
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    role = db.Column(db.String(20), nullable=False)  # e.g., tutor, student, past student

# Initialize Database
with app.app_context():
    db.create_all()

with app.app_context():
    try:
        user1 = User(name='Mrs. Behar', email='marisa.behar@ahschool.com', role='Tutor')
        user2 = User(name='Alan Jith', email='Jith@gmail.com', role='Student')
        user3 = User(name='Junsouh Hong', email='pl256461@ahschool.com', role='Past Student')

        db.session.add_all([user1, user2, user3])
        db.session.commit()
    except:
        pass


# Home Route - Shows Threads
@app.route('/period1')
def index():
    return render_template('period1.html')
# API Route to Get Users
@app.route('/api/users')
def get_users_list():
    users = User.query.all()
    return jsonify([{"name": u.name, "email": u.email, "role": u.role} for u in users])

# API Route to Get Threads
@app.route('/api/threads')
def get_threads():
    threads = Thread.query.all()
    return jsonify([{"id": t.id, "title": t.title, "content": t.content} for t in threads])

# API Route to Add a Thread
@app.route('/api/add_thread', methods=['POST'])
def add_thread():
    data = request.json
    new_thread = Thread(title=data['title'], content=data['content'])
    db.session.add(new_thread)
    db.session.commit()
    return jsonify({"message": "Thread added!"})

# API Route to Get Comments for a Thread
@app.route('/api/comments/<int:thread_id>')
def get_comment (thread_id):
    comments = Comment.query.filter_by(thread_id=thread_id).all()
    return jsonify([
        {"id": c.id, "content": c.content, "helpful_count": c.helpful_count}
        for c in comments
    ])

# API Route to Add a Comment
@app.route('/api/add_comment/<int:thread_id>', methods=['POST'])
def add_comment(thread_id):
    data = request.json
    new_comment = Comment(thread_id=thread_id, content=data['content'])
    db.session.add(new_comment)
    db.session.commit()
    return jsonify({"message": "Comment added!"})

# API Route to Mark a Comment as Helpful
@app.route('/api/helpful/<int:comment_id>', methods=['POST'])
def mark_helpful(comment_id):
    comment = Comment.query.get(comment_id)
    if comment:
        comment.helpful_count += 1
        db.session.commit()
        return jsonify({"message": "Marked as helpful!"})
    return jsonify({"error": "Comment not found"}), 404



drop_table()
init_db()

# run server
if __name__ == '__main__':
    print("running")
    app.run(debug=True, port=4200)