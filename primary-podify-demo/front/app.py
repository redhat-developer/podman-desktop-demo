import os
import time
import redis
from flask import Flask, render_template, send_from_directory

app = Flask(__name__)
cache = redis.Redis(host='{APP_SERVER}', port=6379)

def get_hit_count():
    retries = 5
    while True:
        try:
            return cache.incr('hits')
        except redis.exceptions.ConnectionError as exc:
            if retries == 0:
                raise exc
            retries -= 1
            time.sleep(0.5)

@app.route('/')
@app.route('/<count>')
def hello(count=None):
    count = get_hit_count()
    return render_template('index.html', count=count)

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static', 'img'),
                               'favicon.ico', mimetype='image/vnd.microsoft.icon')
