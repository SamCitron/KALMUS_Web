import os


def getImageFile(movieTitle, colorMetric, frameType):
    '''
    This is where we will need to find the specific filename associated with the users inputs.
    Inputs:
        - movieTitle: name of the movie that user entered
        - colorMetric: specific colorMetric the user entered
        - frameType: specific frameType the user entered
    
    TODO: This query should work I believe? I haven't had a chance to test it because running into issues with the multithreading in api.py. 
    '''
    print('IN HERE')
    print(movieTitle.value)
    print(colorMetric)
    print(frameType)

    # Use os package to iterate over /json_barcodes directory
    path = os.getcwd()
    directory = path + '/json_barcodes'
    for file in os.scandir(directory):
        # Check if object is a file 
        if file.is_file():
            # Checking if filename contains substring of our user's queries 
            if (movieTitle in file) and (colorMetric in file) and (frameType in file):
                print(str(file))
                return file
            else: 
                print('file not found')