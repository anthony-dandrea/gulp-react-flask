from flask import Flask, render_template, jsonify, request

app = Flask(__name__, static_folder="dist/static", template_folder="dist/templates")

mock_data = {"data": "I am mock data"}

@app.route("/")
def index():
    return render_template("index.html", test_text="I am rendered with Jinja", language="en", data=mock_data)

@app.route("/spanish")
def spanish():
    return render_template("index.html", test_text="I am rendered with Jinja", language="es", data=mock_data)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8999, debug=True)