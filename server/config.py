# ---------------- IMPORTS ---------------- #

from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData


# ---------------- DATABASE NAMING CONVENTION ---------------- #

# Helps prevent migration conflicts when using foreign keys
metadata = MetaData(
    naming_convention={
        "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s"
    }
)


# ---------------- EXTENSIONS ---------------- #

db = SQLAlchemy(metadata=metadata)


# ---------------- APP SETUP ---------------- #

app = Flask(__name__)

# Security key (required for sessions and future auth)
app.config["SECRET_KEY"] = "athletelink-secret-key"

# Database configuration
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///app.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Makes JSON output easier to read
app.config["JSON_SORT_KEYS"] = False

# Pretty JSON in development
app.json.compact = False


# ---------------- INITIALIZE DATABASE ---------------- #

db.init_app(app)

# Enable migrations
migrate = Migrate(app, db)


# ---------------- API SETUP ---------------- #

api = Api(app)


# ---------------- CORS CONFIGURATION ---------------- #

# Allows React frontend to communicate with Flask backend
CORS(
    app,
    resources={r"/*": {"origins": "*"}}
)