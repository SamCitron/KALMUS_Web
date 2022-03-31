import React, { useState, useEffect } from 'react';
import { Router, Link } from 'react-router-dom';
import { Test } from './components/Test';
import Dropdown from './components/Dropdown';

function App(props) {
  const [selection, setSelection] = useState({});
  const [imageFile, setImageFile] = useState('');
  const [image, setImage] = useState({});

  useEffect(() => {
    fetch('./api', {
      method: 'GET',
      headers: {
        'Content-Type': 'applications/json',
      },
    })
      .then((res) => res.json())
      .then((res) => console.log('GET RES:', res));
  });

  function getImage(movieLink) {
    fetch('http://localhost:5000/static/' + movieLink, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'arraybuffer',
      },
    })
      //.then((res) => res.body)
      .then((res) => {
        console.log('GET Movie:', res);
        if (!res.ok) {
          console.log('res bad, restart timer');
          setTimeout(getImage(movieLink), 1000);
        } else {
          console.log('Res good');
          const reader = res.body.getReader();
          return new ReadableStream({
            start(controller) {
              return pump();
              function pump() {
                return reader.read().then(({ done, value }) => {
                  // When no more data needs to be consumed, close the stream
                  if (done) {
                    controller.close();
                    return;
                  }
                  // Enqueue the next data chunk into our target stream
                  controller.enqueue(value);
                  return pump();
                });
              }
            },
          });
          // const base64 = btoa(
          //   new Uint8Array(res.data).reduce(
          //     (data, byte) => data + String.fromCharCode(byte),
          //     ''
          //   )
          //);
          //const imageObjectUrl = URL.createObjectURL(res);
          //console.log(base64);
          //setImage({ pic: 'data:;base64,' + base64 });
          //console.log(image.pic);
        }
      })
      .then((stream) => new Response(stream))
      .then((response) => response.blob())
      .then((blob) => URL.createObjectURL(blob))
      .then((url) => {
        console.log((image.src = url));
        setImage({ pic: url });
      });
  }

  function apphandleDropDown(userSelection) {
    console.log(userSelection);
    let params = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: userSelection,
      }),
    };

    fetch('./api', params)
      .then((res) => res.json())
      .then((res) => {
        console.log('POST RES:', res.result);
        setImageFile(res.result);
        // Start timer to go off in 500 seconds
        let timer = setTimeout(getImage(res.result), 1000);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div classname='App'>
      <Test />
      <a href='http://localhost:5000/static/download.jpeg'> here2 </a>
      <Dropdown apphandleDropDown={apphandleDropDown} />
      <img src={image.pic}></img>
    </div>
  );
}

export default App;
