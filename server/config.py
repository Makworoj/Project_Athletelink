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

# If running on Render use persistent disk
if os.environ.get("RENDER"):
    database_path = "sqlite:////data/app.db"
else:
    database_path = "sqlite:///app.db"

app.config["SQLALCHEMY_DATABASE_URI"] = database_path
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