from flask import Flask, render_template, jsonify, request

app = Flask(__name__, static_folder="dist/static", template_folder="dist/templates")

@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8999, debug=True)