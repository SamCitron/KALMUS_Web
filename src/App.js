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
        Accept: 'application/json',
        'Content-Type': 'applications/json',
      },
    })
      .then((res) => res.text())
      .then((res) => {
        console.log('GET Movie:', res);
        if (res.ok) {
          console.log('Res good');
          setImage({ pic: JSON.parse(res) });
        } else {
          console.log('res bad, restart timer');
          let timer = setTimeout(getImage(movieLink), 1000);
        }
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
