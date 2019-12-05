from flask import Flask, request, render_template, send_from_directory, url_for, redirect
from pathlib import Path
from werkzeug.utils import secure_filename
import os

# basic Flask setup
app = Flask(__name__, template_folder="public")
app.config['MAX_CONTENT_LENGTH'] = 1024 * 1024 * 1024 # one gig max file size


# functions
@app.route('/', methods=["GET", "POST"])
def root():
    if request.method == 'POST':
        if 'file' not in request.files:
            return redirect(request.url)

        file = request.files['file']
        if file.filename == '':
            return redirect(request.url)

        filename = secure_filename(file.filename)
        file.save(os.path.join('uploads', filename))
        return redirect(url_for('uploaded_file', filename=filename))

    return render_template('index.html')


@app.route('/public/<path:filename>')
def asset(filename):
	return send_from_directory('public', filename, as_attachment=True)