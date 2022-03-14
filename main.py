from flask import Flask, request, redirect
from login import login_blueprint
from api_draft import api_blueprint

app = Flask(__name__)
app.register_blueprint(login_blueprint)
app.register_blueprint(api_blueprint)

if __name__ == "__main__":
    app.run()