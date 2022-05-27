from kalmus.barcodes.BarcodeGenerator import BarcodeGenerator
from kalmus.barcodes.Barcode import ColorBarcode, BrightnessBarcode
import matplotlib.pyplot as plt


def makeBarcodesFromJSON(filename,saveAs):
    '''
    This function is imported from the Kalmus backend code. 
    Inputs: 
        - filename: name of .json file ofund in the json_barcodes folder
        - saveAs: unique (uuid) name of image to be saved in static folder

    This works as expected and shouldn't need to be edited. 
    You can find tons of documentation about Kalmus on the documentation pages: https://kalmus-color-toolkit.github.io/KALMUS/
    All credit to Edward Chen, Bucknell '22 for writing Kalmus itself.
    '''
    generator = BarcodeGenerator()
    generator.generate_barcode_from_json('json_barcodes/{}'.format(filename), barcode_type="Color")
    barcode = generator.get_barcode()           # Get the Barcode object
    barcode_image = barcode.get_barcode()       # Get the Barcode image (a numpy array)
   
    # Check to make sure size is proper for image saving
    if barcode_image.max() >= 1:
        barcode_image = barcode_image.astype("uint8")
    
    # Save image to our static folder
    plt.imsave('./static/{}.jpg'.format(saveAs), barcode_image) 

def main():
    '''
    Acts as a test to make sure this isolated function works. Generates the Mission Impossible Average Background Color barcode and saves it as 1234.jpg
    '''
    makeBarcodesFromJSON('json_barcodes/1996_03_mission_impossible.mp4_Average_Background_Color.json', '1234')
    print('Main run')

if __name__ == "__main__":
    main()