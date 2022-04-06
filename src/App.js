import React, { useState, useEffect } from 'react';
import { Test } from './components/Test';
import Dropdown from './components/Dropdown';

function App(props) {
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
      .then((res) => {
        console.log('GET Movie:', res);
        if (!res.ok) {
          console.log('res bad, restart timer');
          setTimeout(getImage(movieLink), 1000);
        } else {
          console.log('Res good');

          // https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Using_readable_streams

          const reader = res.body.getReader();
          return new ReadableStream({
            start(controller) {
              return pump();
              async function pump() {
                const { done, value } = await reader.read();
                // When no more data needs to be consumed, close the stream
                if (done) {
                  controller.close();
                  console.log('Stream Complete');
                  return;
                }
                // Enqueue the next data chunk into our target stream
                controller.enqueue(value);
                return pump();
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
      //mode: 'cors',
      crossDomain: true,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: userSelection,
      }),
    };

    fetch('http://localhost:5000/api/', params)
      .then((res) => res.json())
      .then((res) => {
        console.log('POST RES:', res.result);
        setImageFile(res.result);
        // Start timer to go off in 500 seconds
        setTimeout(getImage(res.result), 1000);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div classname='App'>
      <Test />
      <Dropdown apphandleDropDown={apphandleDropDown} />
      <img src={image.pic}></img>
    </div>
  );
}

export default App;
