====================================================================
PROJECT: World Recipe Archive
TECH STACK: Python 3 (Flask), SQLite3, HTML5, CSS3, Vanilla JavaScript
LANGUAGES: English / French / Chinese (Trilingual i18n support)
====================================================================

1. QUICK START (RECOMMENDED FOR WINDOWS)
--------------------------------------------------------------------
1. Ensure Python 3.x is installed on your computer.
2. Simply double-click "run_website.bat".
3. The script will automatically:
   - Verify/install required packages (Flask, etc.).
   - Launch the local Flask server on port 5000.
   - Automatically open your default browser to: http://127.0.0.1:5000


2. MANUAL START (CROSS-PLATFORM: macOS / Linux / Windows)
--------------------------------------------------------------------
If you prefer running via the command line or terminal:

1. Open Terminal or PowerShell in this project folder.
2. Install dependencies:
      pip install -r requirements.txt
3. Start the application:
      python app.py
4. Open your browser and navigate to:
      http://127.0.0.1:5000


3. CLOUD BACKUP LINK (LIVE DEMO)
--------------------------------------------------------------------
In case the local Python environment has network or execution restrictions,
this full project has also been continuously deployed to the cloud with
automated CI/CD:

   Live URL: https://world-recipe-archive.onrender.com/index.html


4. ADMIN / CMS CREDENTIALS
--------------------------------------------------------------------
An administrative portal with batch import features is available:

   Admin Login URL: http://127.0.0.1:5000/import.html
   Username:        admin
   Password:        12345678

* Note on Security: Admin passwords are stored in the database using 
  industry-standard salted cryptographic hashing (Werkzeug/OWASP compliant).


5. KEY FEATURES HIGHLIGHT
--------------------------------------------------------------------
- Full Trilingual Localization: Instant toggle between EN, FR, and ZH.
- Relational Database (SQLite): 17+ normalized tables adhering to 3NF.
- RESTful JSON API: Flask backend serving dynamic endpoints.
- Lazy-Loaded Video Facade: High-performance on-demand embedded player.
- Dynamic Filtering: Filter recipes in real-time by category chips.
- Persistent Visitor Feedback: Stored directly into the SQLite database.

====================================================================