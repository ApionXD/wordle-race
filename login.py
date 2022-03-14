import datetime
import json

from flask import Flask, request, Blueprint
import pymongo
from cachetools import TTLCache
from database import db
from datetime import timedelta
import uuid

login_blueprint = Blueprint('login_blueprint', __name__)
session_cache = TTLCache(maxsize=50, ttl=timedelta(hours=24), timer=datetime.datetime.now())
user_collection = db["users"]

@login_blueprint.route("/login", methods = ['POST'])
def login():
    user_details = request.json
    user = user_collection.find_one({
        "username": user_details["username"]
    })
    if user is None:
        return json.dumps({"response": "No such user"})
    if user["password_hash"] != user_details["hashed_pw"]:
        return json.dumps({"response": "Incorrect password"})
    session_id = str(uuid.uuid4())
    response = {
        "response": "Success",
        "session_id": session_id
    }
    session_cache[session_id] = user_details["username"]
    return json.dumps(response)


@login_blueprint.route("/register", methods=['POST'])
def register():
    new_user = request.json
    if "username" not in new_user:
        return json.dumps({"response": "No username"})
    if "hashed_pw" not in new_user:
        return json.dumps({"response": "No password"})
    if "email" not in new_user:
        return json.dumps({"response": "No email"})
    if user_collection.find_one({"username": new_user["username"]}) is not None:
        print({type(user_collection.find_one({"username": new_user["username"]}))})
        return json.dumps({"response": "Username exists"})
    if user_collection.find_one({"email": new_user["email"]}):
        return json.dumps({"response": "Email exists"})
    user_obj = {
        "username": new_user["username"],
        "password_hash": new_user["hashed_pw"],
        "email": new_user["email"]
    }
    user_collection.insert_one(user_obj)
    return json.dumps({"response": "Success"})


