from pymongo import MongoClient

client = MongoClient("mongodb://apionservers.com:27017", username="Apion", password="goodyear")
db = client["wordle-race"]
