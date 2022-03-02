from flask import Flask, request, jsonify
import barcode_generator
import json
import logging
import uuid
from threading import Thread
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__, static_url_path='', static_folder='/static')

@app.route('/api', methods=['GET', 'POST'])
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
        return jsonify({'result': 'ok'})
        #print(args.get('content'))
        #barcode_generator.makeBarcodesFromJSON(args.get('content'), filename)
        #return jsonify({'result':'ok'})
    except:
        return jsonify({'result': '{}.jpg'.format(filename)})



if __name__ == '__main__':
    app.run(debug=True) 

#