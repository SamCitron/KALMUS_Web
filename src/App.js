import React, { useState } from 'react';
import { HelloKalmus } from './components/HelloKalmus';
import Dropdown from './components/Dropdown';

function App(props) {
  /**
   * The primary frontend file.
   * App.js handles all of the requests to and from the backend. It also recieves and passes props from it's childcomponents Dropdown.js and HelloKalmus.js
   */
  const [image, setImage] = useState();

  function validateResponse(response, movieLink) {
    /**
     * Validates if response is valid. If not, begins timer again. The promise will not resolve until we get a valid response from the backend.
     * The valid response means that the barcode image has been generated and exists in our static folder.
     * Inputs:
     *    response: the res code from our GET request
     *    movieLink: unique uuid .jpg name that we are searching for in our backend's static folder
     */
    if (!response.ok | (response.type == 'opaque')) {
      console.log('res bad, restart timer');
      return new Promise(function (resolve) {
        setTimeout(() => {
          resolve(getImage(movieLink));
        }, 1000);
      });
    } else {
      console.log('res is good, returning response');
      return response;
    }
  }

  function getImage(movieLink) {
    /**
     * Submits GET request to backend. Here, we are checking to see if the .jpg barcode image has been generated yet
     * Inputs:
     *      movieLink: unique uuid .jpg name that we are searching for in our backend's static folder
     */

    // Make fetch request to proper endpoint. We expect the responseType to be a blob()
    fetch('http://localhost:5000/static/' + movieLink, {
      method: 'GET',
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    })
      .then((response) => validateResponse(response, movieLink)) // Before continuing, we validate our response. (Funciton in Line 12)
      .then((response) => response.blob()) // Once validateResponse resolves, we turn our response into a blob()
      .then((blob) => {
        // We take that blob, use the URL package to convert the blob to an Object URL
        let url = URL.createObjectURL(blob);
        setImage(url); // We set our react hook to be that new image url
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function generateImage(userSelection) {
    /**
     * Submits a POST request to the backend. Here, we are sending the user's input (movie title, color metric, and frame type) to the backend
     * Inputs:
     *      userSelection: Object containing all of the necessary information to find proper .json file.
     */
    let params = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: userSelection,
      }),
    };

    // POST request to proper endpoint
    fetch('http://localhost:5000/api/', params)
      .then((res) => res.json())
      .then((res) => {
        console.log('POST RES:', res.result);
        // Start timer to go off in 2 second
        // After the POST request resolves, this line begins our timer and calls getImage.
        //setTimeout(getImage(res.result), 2000);              //This is currently commented out because it will run in an infinite loop until you get the multithreading on the backend working. Uncomment when done, you need this line.
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className='App'>
      <HelloKalmus />
      <Dropdown generateImage={generateImage} />
      {/* This image tag displays our image url, created in GetImage*/}
      <img src={image}></img>
    </div>
  );
}

export default App;
