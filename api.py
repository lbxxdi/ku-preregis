from flask import Flask,jsonify,request
from flask.ext.pymongo import PyMongo

from flask import make_response
from functools import wraps, update_wrapper
from datetime import datetime

app = Flask(__name__)


app.config['MONGO3_HOST'] = 'localhost'
app.config['MONGO3_PORT'] = 27017
app.config['MONGO3_DBNAME'] = 'preregis'
mongo = PyMongo(app, config_prefix='MONGO3')
app.config['JSON_AS_ASCII'] = False



def nocache(view):
    @wraps(view)
    def no_cache(*args, **kwargs):
        response = make_response(view(*args, **kwargs))
        response.headers['Last-Modified'] = datetime.now()
        response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0, max-age=0'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '-1'
        return response
        
    return update_wrapper(no_cache, view)


@app.route('/')
def root():
    return app.send_static_file('index.html')

@app.route('/<path:path>')
#@nocache
def static_proxy(path):
    # send_static_file will guess the correct MIME type
    return app.send_static_file(path)


@app.route('/section/<code>/<int:sec>/<type>')
def section_detail(code,sec,type):

    type = type.lower()
    exclude = dict(_id=0)

    section = mongo.db.section.find_one_or_404(
        {
         'code': code,
         'sec': sec,
         'type': type.upper(),
        }
        ,exclude)
    

    return jsonify(**section)


@app.route('/subject/<code>')
def subject_detail(code):

    subject = mongo.db.subject.find_one_or_404(dict(code=code),dict(_id=0))
    
    if "full" in request.args:
        pass
    else:
        sections = dict(LEC=[],LAB=[])
        for section in subject['section']:
            sections[section['type']].append(section['sec'])
        #subject['section'] = [ dict(sec=section['sec'],type=section['type'])  for section in subject['section'] ]
        subject['section'] = sections

    return jsonify(**subject)


@app.route('/subjects')
def list_subject():

    exclude = dict(_id=0,section=0)

    if "full" in request.args:
        pass
    else:
        exclude['lec'] = 0
        exclude['lab'] = 0

    subjects = mongo.db.subject.find({},exclude)

    return jsonify(*subjects)


@app.route("/test")
def test():
    return jsonify(request.args)


if __name__ == "__main__":
    app.run(host='0.0.0.0',port=9000)

