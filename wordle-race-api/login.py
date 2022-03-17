import datetime
import json

from flask import Flask, request, Blueprint, session
from database import db
from hashlib import sha256

login_blueprint = Blueprint('login_blueprint', __name__)
user_collection = db["users"]
hasher = sha256()

@login_blueprint.route("/login", methods = ['POST'])
def login():
    user_details = request.json
    password = str(user_details["password"])
    hasher = sha256(password.encode(encoding='UTF-8', errors='strict'))
    password_hash = hasher.hexdigest()
    # Queries db for matching user
    user = user_collection.find_one({
        "username": user_details["username"]
    })
    # Errors
    if user is None:
        return json.dumps({"response": "No such user"})
    if user["password_hash"] != password_hash:
        return json.dumps({"response": "Incorrect password"})
    if "remember_me" in user_details:
        session.permanent = True
    session["signed_in"] = True
    session["username"] = user_details["username"]

    return json.dumps({"response": "Success", "name": user_details["username"]})


@login_blueprint.route("/register", methods=['POST'])
def register():
    new_user = request.json
    password = str(new_user["password"])
    hasher = sha256(password.encode(encoding='UTF-8', errors='strict'))
    password_hash = hasher.hexdigest()
    if "username" not in new_user:
        return json.dumps({"response": "No username"})
    if "password" not in new_user:
        return json.dumps({"response": "No password"})
    if "email" not in new_user:
        return json.dumps({"response": "No email"})
    if user_collection.find_one({"username": new_user["username"]}) is not None:
        return json.dumps({"response": "Username exists"})
    if user_collection.find_one({"email": new_user["email"]}):
        return json.dumps({"response": "Email exists"})
    user_obj = {
        "username": new_user["username"],
        "password_hash": password_hash,
        "email": new_user["email"]
    }
    user_collection.insert_one(user_obj)
    return json.dumps({"response": "Success"})

@login_blueprint.route("/logout")
def logout():
    session.pop('username', default=None)
    return json.dumps({"response": "Success"})