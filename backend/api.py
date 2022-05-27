from flask import Flask, request, jsonify
from flask_cors import CORS
from src import barcode_generator, getImageFile
import json
import logging
import uuid
from threading import Thread
logging.basicConfig(level=logging.DEBUG)


# Flask backend instantiated.
# Specify that our static_folder is titled 'static'. Allows us to serve static images to front end by declaring this.
app = Flask(__name__, static_folder='static')
# CORS is a HTTP header mechanism that allows a server to indicate other origins. Basically, let's our front and backend talk to each other without the browser flagging it.
CORS(app)       

# Specify app's endpoint per Flask's requirements. 
# Declares we can send GET and POST requests from this endpoint.
@app.route('/api/', methods=['GET', 'POST'])
def index():
    '''
    This is the primary area that needs work. With a single thread, the image generates as it should. More than two threads is where it breaks.
    TODO: Finalize the multi threading. I think you will need four threads:
        1.) To search through the json_barcodes folder to find proper .json file. This is line 36 where we run /src/getImageFile.py
        2.) To search through the json_barcodes folder to find the second proper .json file.
        3.) To generate the first barcode from the user's input. Seen in line 45 when we call /src/barcode_generator.py 
        4.) To generate the second barcode from the user's input. 

    If needed, I strongly reccomend reaching out to Professor Alan Marchiori for assistance with multithreading. 
    '''
    try:
        # Create empty list where we will place threads
        threads_list = list()

        # Generate unique uuid that will be the name of the saved .jpg image in our /static/ folder
        # This filename gets passed immediately back to the frontend 
        filename = uuid.uuid4() 

        # Get our movie selection, translate it to json, and retrieve the content. 
        # This userSelection should contain the movieTitle, the colorMetric, and the frameType in one object
        movieSelection = request.data
        args = json.loads(movieSelection)
        userSelection = args.get('content')

        # Begin first thread where we search for correct .json file in getImageFile.py
        thread1 = Thread(target=(getImageFile.getImageFile), args=(userSelection.movieTitle, userSelection.colorMetric, userSelection.frameType))

        # Start the thread, append it to the list, and join it to hopefully retrieve the correct file
        # TODO: this section most likely is incorrect. Need to figure out how to use the result of one thread in your next thread
        thread1.daemon = True
        thread1.start()
        threads_list.append(thread1)
        file = thread1.join()

        # Begin second thread where we generate the correct .jpg image
        # This second thread relies on the output of the first thread as we need the proper .json file 
        thread2 = Thread(target=barcode_generator.makeBarcodesFromJSON, args=(file, filename))

        # Start the thread, unsure if we should join it or not
        thread2.daemon = True
        thread2.start()


        # TODO: Create functionality for second movie (two more threads?)

        # Return the unique .jpg filename to frontend immediately. Frontend should not be held up by backend.
        return jsonify({'result': '{}.jpg'.format(filename)})

    except:

        # If there is an issue (right now there is) than you will see {'result': 'exception'} on your frontend console.
        return jsonify({'result': 'exception'})



if __name__ == '__main__':
    app.run(debug=True) 
