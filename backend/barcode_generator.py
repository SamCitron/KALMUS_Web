from kalmus.barcodes.BarcodeGenerator import BarcodeGenerator
from kalmus.barcodes.Barcode import ColorBarcode, BrightnessBarcode
import matplotlib.pyplot as plt


def makeBarcodesFromJSON(filename,saveAs):
    print('HERE')
    generator = BarcodeGenerator()
    generator.generate_barcode_from_json(filename, barcode_type="Color")
    barcode = generator.get_barcode()           # Get the Barcode object
    barcode_image = barcode.get_barcode()       # Get the Barcode image (a numpy array)
   
    # Check to make sure size is proper for image saving
    if barcode_image.max() >= 1:
        barcode_image = barcode_image.astype("uint8")
    plt.imsave('./static/{}.jpg'.format(saveAs), barcode_image) 

def main():
    makeBarcodesFromJSON('../json_barcodes/1996_03_mission_impossible.mp4_Average_Background_Color.json')
    print('Main run')

if __name__ == "__main__":
    main()