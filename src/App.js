import React, { useState, useEffect } from 'react';
import { Router, Link } from 'react-router-dom';
import { Test } from './components/Test';
import Dropdown from './components/Dropdown';

function App(props) {
  const [selection, setSelection] = useState({});
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
      .then((res) => {
        res.json();
        console.log('POST RES:', res);
        setImage(res.result);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div classname='App'>
      <Test />
      <Link to='/download.jpeg'>here</Link>
      <Dropdown apphandleDropDown={apphandleDropDown} />
    </div>
  );
}

export default App;
