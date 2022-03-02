import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import Select from 'react-select';

const options = [
  {
    value: '1996_03_mission_impossible.mp4_Average_Background_Color.json',
    label: 'Mission Impossible Average Background Color',
  },
  {
    value: '1996_03_mission_impossible.mp4_Average_Foreground_Color.json',
    label: 'Mission Impossible Average Foreground Color',
  },
  {
    value:
      '1996_03_mission_impossible.mp4_Average_High_contrast_region_Color.json',
    label: 'Mission Impossible High Contrast Region Color',
  },
  {
    value:
      '1996_03_mission_impossible.mp4_Average_Low_contrast_region_Color.json',
    label: 'Mission Impossible Low Contrast Region Color',
  },
  {
    value: '1996_03_mission_impossible.mp4_Average_Whole_frame_Color.json',
    label: 'Mission Impossible Average Whole Frame Color',
  },
];

export default function Dropdown(props) {
  const [choice, setChoice] = useState({});

  function handleDropDown(choice) {
    setChoice(choice.value);
    console.log('choice selected: ', choice);
  }

  return (
    <div>
      <Select options={options} onChange={handleDropDown} />
      <Button
        variant='contained'
        onClick={() => props.apphandleDropDown(choice)}
      >
        Submit
      </Button>
    </div>
  );
}
