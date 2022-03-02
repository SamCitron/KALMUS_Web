from flask import Flask, request, jsonify
import barcode_generator
import json
import logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__, static_url_path='', static_folder='/static')

@app.route('/api', methods=['GET', 'POST'])
def index():
    try: 
        movieSelection = request.data
        args = json.loads(movieSelection)
        print(args.get('content'))
        barcode_generator.makeBarcodesFromJSON(args.get('content'))
        print('now here')
        return jsonify({'result':'ok'})
    except:
        return jsonify({'result': 'no data'})



if __name__ == '__main__':
    app.run(debug=True) 

#