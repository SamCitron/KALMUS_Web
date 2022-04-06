from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import barcode_generator
import json
import logging
import uuid
from threading import Thread
logging.basicConfig(level=logging.DEBUG)
logging.getLogger('flask_cors').level = logging.DEBUG


app = Flask(__name__, static_folder='static')
CORS(app, resources=r'/api/*', origins=['http://localhost:5000', 'http://localhost:3000', '*'])
#app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/api', methods=['GET', 'POST'])
@cross_origin(allow_headers=['Content-Type'])
def index():
    try:
        filename = uuid.uuid4() 
        movieSelection = request.data
        args = json.loads(movieSelection)
        print(args.get('content'))
        thread = Thread(target=barcode_generator.makeBarcodesFromJSON, args=(args.get('content'), filename,))
        thread.daemon = True
        thread.start()
        print('HERE')
        return jsonify({'result': '{}.jpg'.format(filename)})

    except:
        return jsonify({'result': 'exception'})



if __name__ == '__main__':
    app.run(debug=True) 

#