from pymongo import MongoClient

client = MongoClient("mongodb://apionservers.com:8096", username="Apion", password="goodyear")
db = client["wordle-race"]
