# ---------------- IMPORTS ---------------- #

from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
import os


# ---------------- DATABASE NAMING CONVENTION ---------------- #

metadata = MetaData(
    naming_convention={
        "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s"
    }
)


# ---------------- EXTENSIONS ---------------- #

db = SQLAlchemy(metadata=metadata)


# ---------------- APP SETUP ---------------- #

app = Flask(__name__)

# Security key
app.config["SECRET_KEY"] = "athletelink-secret-key"


# ---------------- DATABASE CONFIGURATION ---------------- #

# Use PostgreSQL on Render, SQLite locally
database_url = os.environ.get("DATABASE_URL")

if database_url:
    # Fix Render postgres URL format if needed
    database_url = database_url.replace("postgres://", "postgresql://", 1)
    app.config["SQLALCHEMY_DATABASE_URI"] = database_url
else:
    # Local development database
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///app.db"

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False


# Makes JSON output easier to read
app.config["JSON_SORT_KEYS"] = False
app.json.compact = False


# ---------------- INITIALIZE DATABASE ---------------- #

db.init_app(app)

migrate = Migrate(app, db)


# ---------------- API SETUP ---------------- #

api = Api(app)


# ---------------- CORS CONFIGURATION ---------------- #

CORS(
    app,
    resources={r"/*": {"origins": "*"}}
)