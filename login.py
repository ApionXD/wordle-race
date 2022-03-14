import json

from flask import Flask, request, Blueprint
import pymongo
from database import db

login_blueprint = Blueprint('login_blueprint', __name__)


@login_blueprint.route("/login", methods = ['POST'])
def login():
    None


@login_blueprint.route("/register", methods = ['GET'])
def register():
    new_user = request.json
    if "username" not in new_user:
        return json.dumps({"response": "No username"})
    if "hashed_pw" not in new_user:
        return json.dumps({"response": "No password"})
    if "email" not in new_user:
        return json.dumps({"response": "No email"})
    user_collection = db["users"]
    if user_collection.find({"username": new_user["username"]}) is not None:
        return json.dumps({"response": "Username exists"})
    if user_collection.find({"email": new_user["email"]}):
        return json.dumps({"response": "Email exists"})
    user_obj = {
        "username": new_user["username"],
        "password_hash": new_user["hashed_pw"],
        "email": new_user["email"]
    }
    user_collection.insert_one(user_obj)
    return json.dumps({"response": "Success"})


