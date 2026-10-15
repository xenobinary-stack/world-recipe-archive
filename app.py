from flask import (
    Flask, jsonify, request, send_from_directory,
    session, redirect
)
import sqlite3
import os

from werkzeug.security import check_password_hash

# Create Flask app serving files directly from the current directory
app = Flask(__name__, static_folder='.', static_url_path='')

# Secret key for Flask sessions
# For local development, a new key is generated each time Flask starts.
app.secret_key = os.urandom(32)

# SQLite database file path，absolute path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_FILE = os.path.join(BASE_DIR, 'recipes.db')

def get_db():
    conn = sqlite3.connect(DATABASE_FILE)
    conn.row_factory = sqlite3.Row  # Access columns by name
    return conn

# -------------------------------------------------------------
# 1. HTML Page Routes
# -------------------------------------------------------------

# Homepage: http://127.0.0.1:5000/
@app.route('/')
# -------------------------------------------------------------
# Login and Logout
# -------------------------------------------------------------

@app.route('/login.html')
def login_page():
    # Already logged in? Go to the import page.
    if session.get('admin_id'):
        return redirect('/import.html')

    return send_from_directory('.', 'login.html')


@app.route('/login', methods=['POST'])
def login():
    username = request.form.get('username', '').strip()
    password = request.form.get('password', '')

    db = get_db()

    admin = db.execute('''
        SELECT admin_id, username, password_hash
        FROM admin_users
        WHERE username = ?
    ''', (username,)).fetchone()

    db.close()

    # Check the submitted password against the stored hash.
    if admin and check_password_hash(
        admin['password_hash'], password
    ):
        session.clear()
        session['admin_id'] = admin['admin_id']
        session['admin_username'] = admin['username']

        return redirect('/import.html')

    # Do not reveal whether the username or password was incorrect.
    return redirect('/login.html?error=1')


@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return redirect('/login.html')

def index_page():
    return send_from_directory('.', 'index.html')

# Recipe detail page: http://127.0.0.1:5000/recipe.html
@app.route('/recipe.html')
def recipe_page():
    return send_from_directory('.', 'recipe.html')

# Recipe list page: http://127.0.0.1:5000/recipes.html
@app.route('/recipes.html')
def recipes_page():
    return send_from_directory('.', 'recipes.html')

#Import page : http://127.0.0.1:5000/import.html
@app.route('/import.html')
def import_page():
    if not session.get('admin_id'):
        return redirect('/login.html')

    return send_from_directory('.', 'import.html')



# -------------------------------------------------------------
# 2. API Routes (Data from SQLite)
# -------------------------------------------------------------

# API to get all recipes for index.html table
@app.route('/api/recipes')
def get_recipes():
    lang = request.args.get('lang', 'en')
    if lang not in ['en', 'fr', 'zh']:
        lang = 'en'

    db = get_db()
    query = '''
        SELECT
            r.recipe_id,
            rt.name AS recipe_name,
            r.prep_time,
            r.cook_time,
            r.difficulty,
            ct.name AS category_name,
            cot.name AS country_name,
            rp.file_path AS photo_path
        FROM recipes r

        JOIN recipe_translations rt
            ON r.recipe_id = rt.recipe_id
            AND rt.language_code = ?

        LEFT JOIN categories c
            ON r.category_id = c.category_id

        LEFT JOIN category_translations ct
            ON c.category_id = ct.category_id
            AND ct.language_code = ?

        LEFT JOIN countries co
            ON r.country_id = co.country_id

        LEFT JOIN country_translations cot
            ON co.country_id = cot.country_id
            AND cot.language_code = ?

        LEFT JOIN recipe_photos rp
            ON r.recipe_id = rp.recipe_id
            AND rp.photo_type = 'main'
            AND rp.display_order = 1
    '''
    rows = db.execute(query, (lang, lang, lang)).fetchall()
    db.close()

    return jsonify([dict(row) for row in rows])


# API to get full recipe details for recipe.html
@app.route('/api/recipe/<int:recipe_id>')
def get_recipe_detail(recipe_id):
    lang = request.args.get('lang', 'en')
    if lang not in ['en', 'fr', 'zh']:
        lang = 'en'

    db = get_db()

    # 1. Core recipe details
    recipe = db.execute('''
        SELECT 
            r.recipe_id,
            rt.name,
            rt.description,
            r.prep_time,
            r.cook_time,
            r.servings,
            r.difficulty,
            cnt.name AS country,
            ct.name AS category
        FROM recipes r
        LEFT JOIN recipe_translations rt 
            ON r.recipe_id = rt.recipe_id AND rt.language_code = ?
        LEFT JOIN country_translations cnt 
            ON r.country_id = cnt.country_id AND cnt.language_code = ?
        LEFT JOIN category_translations ct 
        ON r.category_id = ct.category_id
        AND ct.language_code = ?
        WHERE r.recipe_id = ?;
    ''', (lang, lang, lang, recipe_id)).fetchone()

    if not recipe:
        db.close()
        return jsonify({"error": "Recipe not found"}), 404

    data = dict(recipe)

    # 2. Numbered Steps
    steps = db.execute('''
        SELECT rs.step_number, rst.instruction
        FROM recipe_steps rs
        JOIN recipe_step_translations rst 
            ON rs.recipe_step_id = rst.recipe_step_id
        WHERE rs.recipe_id = ? AND rst.language_code = ?
        ORDER BY rs.step_number ASC;
    ''', (recipe_id, lang)).fetchall()
    data['steps'] = [dict(s) for s in steps]

    # 3. Ingredients
    ingredients = db.execute('''
        SELECT it.name, ri.quantity, ri.unit, ri.section
        FROM recipe_ingredients ri
        JOIN ingredient_translations it 
            ON ri.ingredient_id = it.ingredient_id
        WHERE ri.recipe_id = ? AND it.language_code = ?
        ORDER BY ri.section, ri.recipe_ingredient_id ASC;
    ''', (recipe_id, lang)).fetchall()
    data['ingredients'] = [dict(i) for i in ingredients]


    # 4. Notes
    note = db.execute('''
        SELECT note FROM recipe_notes
        WHERE recipe_id = ? AND language_code = ?;
    ''', (recipe_id, lang)).fetchone()
    data['note'] = note['note'] if note else None

    # 4. Photo from recipe_photos & photo_translations
    photo = db.execute('''
        SELECT rp.file_path, rp.photo_type, pt.caption
        FROM recipe_photos rp
        LEFT JOIN photo_translations pt 
            ON rp.photo_id = pt.photo_id AND pt.language_code = ?
        WHERE rp.recipe_id = ?
        ORDER BY rp.display_order ASC, rp.photo_id ASC
        LIMIT 1;
    ''', (lang, recipe_id)).fetchone()
    data['photo'] = dict(photo) if photo else None
    db.close()
    return jsonify(data)



# -------------------------------------------------------------
# 3. Start Server
# -------------------------------------------------------------
if __name__ == '__main__':
    print("Serving Recipe Archive on http://127.0.0.1:5000 ...")
    app.run(debug=True, port=5000, use_reloader=False)