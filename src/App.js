import React, { useState } from 'react';
import { Test } from './components/Test';
import Dropdown from './components/Dropdown';
const fs = require('fs');

function App(props) {
  const [image, setImage] = useState();

  function validateResponse(response, movieLink) {
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
    fetch('http://localhost:5000/static/' + movieLink, {
      method: 'GET',
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    })
      .then((response) => validateResponse(response, movieLink))
      .then((response) => response.blob())
      .then((blob) => {
        let url = URL.createObjectURL(blob);
        setImage(url);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function generateImage(userSelection) {
    let params = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: userSelection,
      }),
    };

    fetch('http://localhost:5000/api/', params)
      .then((res) => res.json())
      .then((res) => {
        console.log('POST RES:', res.result);
        // Start timer to go off in 2 second
        setTimeout(getImage(res.result), 2000);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function getImageFile(userSelections) {
    console.log(userSelections);

    const dir = '../backend/json_barcodes';
    const files = fs.readdirSync(dir);

    for (const file of files) {
      console.log(file);
    }
  }

  return (
    <div className='App'>
      <Test />
      <Dropdown getImageFile={getImageFile} />
      <img src={image}></img>
    </div>
  );
}

export default App;
