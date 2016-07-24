from flask import Flask, jsonify, request
from flask.ext.pymongo import PyMongo
import uuid

app = Flask(__name__)


app.config['MONGO3_HOST'] = 'localhost'
app.config['MONGO3_PORT'] = 27017
app.config['MONGO3_DBNAME'] = 'preregis'
mongo = PyMongo(app, config_prefix='MONGO3')
app.config['JSON_AS_ASCII'] = False


@app.route('/')
def root():
    return app.send_static_file('index.html')


@app.route('/<path:path>')
def static_proxy(path):
    # send_static_file will guess the correct MIME type
    return app.send_static_file(path)


@app.route('/section/<code>/<int:sec>/<type>')
def section_detail(code, sec, type):

    type = type.lower()
    exclude = dict(_id=0)

    section = mongo.db.section.find_one_or_404(
        {
            'code': code,
            'sec': sec,
            'type': type.upper(),
        },
        exclude)

    return jsonify(**section)


@app.route('/subject/<code>')
def subject_detail(code):

    subject = mongo.db.subject.find_one_or_404(dict(code=code), dict(_id=0))

    if "full" in request.args:
        pass
    else:
        sections = dict(LEC=[], LAB=[])
        for section in subject['section']:
            sections[section['type']].append(section['sec'])
        #subject['section'] = [ dict(sec=section['sec'],type=section['type'])  for section in subject['section'] ]
        subject['section'] = sections

    return jsonify(**subject)


@app.route('/load/<token>')
def load_table(token):

    table = mongo.db.table.find_one_or_404(dict(token=token), dict(_id=0))

    return jsonify(**table)


@app.route('/save', methods=['POST'])
def save_table():

    if not request.json:
        return jsonify({})

    if "token" not in request.json:
        token = uuid.uuid4().hex
    else:
        token = request.json["token"]

    subject_list = request.json["subject_list"]

    table = dict(token=token, subject_list=subject_list)
    mongo.db.table.update(dict(token=token), table, upsert=True)

    return jsonify(dict(token=token))


@app.route('/subjects')
def list_subject():

    exclude = dict(_id=0, section=0)

    if "full" in request.args:
        pass
    else:
        exclude['lec'] = 0
        exclude['lab'] = 0

    subjects = mongo.db.subject.find({}, exclude)

    return jsonify(*subjects)


@app.route("/test")
def test():
    return jsonify(request.args)


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=9000)

