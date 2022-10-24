import React, { useRef, useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import styled, { css, keyframes } from "styled-components";

ChartJS.register(ArcElement);

export const data = {
  labels: ['딸기', '당근', '수박', '참외', '메론'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 19, 3, 5, 2],
      backgroundColor: [
        'red',
        'orange',
        'green',
        'yellow',
        '#bfff00',
      ],
      borderColor: [
        'red',
        'orange',
        'green',
        'yellow',
        '#bfff00',

      ],
      borderWidth: 1,
    },
  ],
};





export default function App() {




  const [isRotating, setIsRotating] = useState(false)
  const ref = useRef();
  const [count, setCount] = useState(0)
  const [deg, setDeg] = useState(0);



  const items = data.datasets[0].data
  const sum = items.reduce((a, b) => a + b, 0)


  const [winner, setWinner] = useState("")

  const handleSpinClick = () => {
    setIsRotating((prev) => !prev)
    if(isRotating){
      getWinner(deg);
    }else{
      setWinner("")
    }
   
  }
  const getWinner = (deg) => {
    console.log(deg,"deg")
    for (let i = 1; i < items.length; i++) {
      let amount = items[i];
      if (amount / sum < deg / 360) {
        amount = amount + items[i]

        console.log("실행2222")
        return
      } else {
        console.log("실행")
        setWinner(data.labels[i])
        return
      }
    }
  }
 console.log(winner,"winner")

  useEffect(() => {
    if (isRotating) {
      const timer = setInterval(() => {
        setCount(prev => prev + 1);

      }, 10);
      return () => clearInterval(timer);
    } else {
      setCount(0)
    }

  }, [isRotating]);

  useEffect(() => {
    if (deg > 360) {
      setDeg(prev => prev - 360)
    } else {
      setDeg(prev => prev + 1)
    }
  }, [count])





  return (
    <>
      <Wrapper isRotating={isRotating} deg={deg}>
        <Pie data={data} legend={false} />
      </Wrapper>

      <button onClick={handleSpinClick}>클릭</button>
      <div>{winner}</div>
    </>






  );
}
const rotationStart = (deg) => keyframes`
0%{
  transform: rotate(0deg);
}
100%{
  transform: rotate(360deg);
}
`
const rotationEnd = (deg) => keyframes`
0%{
  transform: rotate(0deg);
}
100%{
  transform: rotate(${deg % 360}deg);
}
`

const Wrapper = styled.div`
// border:1px solid red;
animation:${(props) => props.isRotating ? css`${rotationStart(props.deg)} 0.2s linear infinite` : css`${rotationEnd(props.deg)} 1s linear`};
transform:${(props) => props.deg !== 0 ? `rotate(${props.deg}deg)` : ""}
`

