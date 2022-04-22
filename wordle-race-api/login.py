import datetime
import json

from flask import Flask, request, Blueprint, session
from database import db
from hashlib import sha256


login_blueprint = Blueprint('login_blueprint', __name__)
user_collection = db["users"]
tot_collection = db["scores"]
#game_collection = db["games"]

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
    if user_details["keep_session"] == 'on':
        session.permanent = True
    session["signed_in"] = True
    session["username"] = user_details["username"]
    session["boardsize"] = 5

    user = tot_collection.find_one({
        "username": user_details["username"]
    })
    if user is None:
        tot_obj = {
            "username": user_details["username"],
            "score": 0,
            "role": 0 #role=0 noob 1 veteran
        }
        tot_collection.insert_one(tot_obj)
    return json.dumps({
        "response": "Success",
        "user": user_details["username"],
    })


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

@login_blueprint.route("/check_session", methods=['GET'])
def check_session():
    if "signed_in" in session and session["signed_in"]:
        return json.dumps({
            "response": "Success",
            "username": session["username"]
        })
    else:
        return json.dumps({
            "response": "No session found"
         })


@login_blueprint.route("/logout", methods=['GET'])
def logout():
    session.clear()
    return json.dumps({
        "response": "Logged out"
    })

