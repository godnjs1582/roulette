import React, { useRef, useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import styled, { css, keyframes } from "styled-components";

ChartJS.register(ArcElement);

export const data = {
  labels: ['빨강', '주황', '초록', '노랑', "파랑"],
  datasets: [
    {
      label: '# of Votes',
      data: [20,20,20,20,20],
      backgroundColor: [
        'red',
        'orange',
        'green',
        'yellow',
        'blue',
      ],
      borderColor: [
        'red',
        'orange',
        'green',
        'yellow',
        'blue',
      ],
      borderWidth: 1,
    },
  ],
};


export default function App() {
  const initialAmount =data.datasets[0].data[0] 
  const [isRotating, setIsRotating] = useState(false)
  const [count, setCount] = useState(0)
  const [deg, setDeg] = useState(0);
  const items = data.datasets[0].data
  const sum = items.reduce((a, b) => a + b, 0)
  const [winner, setWinner] = useState("")

  const handleSpinClick = () => {
    setIsRotating((prev) => !prev)
    if(isRotating){
      getWinner(deg,initialAmount);
    }else{
      setWinner("")
    }
   
  }
  const getWinner = (deg,initialAmount) => {
    // console.log("deg:",deg)
    let amount=initialAmount
    for (let i = 1; i < items.length+1; i++) {
      const length=items.length
      if (amount / sum < deg / 360) {
        amount = amount + items[i]
      } else {
        console.log(amount, i)
        
        setWinner(data.labels[length-i])
        return
      }
    }
  }

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
    <div style={{width:"1200px", margin:"0 auto"}}>
    <h1 style={{textAlign:"center"}}>여기가 Winner</h1>
    <h1 style={{textAlign:"center"}}>↓</h1>
      <Wrapper isRotating={isRotating} deg={deg}>
        <Pie data={data} legend={false} />
      </Wrapper>
      <button onClick={handleSpinClick}>클릭</button>
      <h1>Winner is: {winner}</h1>
    </div>

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
margin-top:100px;
margin:0 auto;
width:50%;
height:50%;
animation:${(props) => props.isRotating ? css`${rotationStart(props.deg)} 0.2s linear infinite` : css`${rotationEnd(props.deg)} 1s linear`};
transform:${(props) => props.deg !== 0 ? `rotate(${props.deg}deg)` : ""}
`

