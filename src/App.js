import React, { useRef, useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import styled, { css, keyframes } from "styled-components";

ChartJS.register(ArcElement);

export const data = {
  labels: ['빨강', '주황', '노랑', '초록', '파랑'],
  datasets: [
    {
      label: '# of Votes',
      data: [1,1,1,1,1],
      backgroundColor: [
        'red',
        'orange',
        'yellow',
        'green',
        'blue',
      ],
      borderColor: [
        'white',
        'white',
        'white',
        'white',
        'white',
      ],
      borderWidth: 0,
    },
  ],
};


export default function App() {
  const initialAmount =data.datasets[0].data[0] 
  const [isRotating, setIsRotating] = useState("unstarted")
  const [count, setCount] = useState(0)
  const deg = count%360
  const items = data.datasets[0].data
  const sum = items.reduce((a, b) => a + b, 0)
  const [winner, setWinner] = useState("")

  const handleSpinClick = () => {
    if(isRotating==="unstarted"||isRotating==="stopped"){
      setIsRotating("started")
    }else if(isRotating==="started"){
      setIsRotating("stopped")
    }
    // setIsRotating((prev) => !prev)
    if(isRotating==="stopped"){
      getWinner(deg,initialAmount);
    }
    // else{
    //   setWinner("")
    // } 
  }

  const getWinner = (deg,initialAmount) => {
    let amount=initialAmount
    for (let i = 1; i < items.length+1; i++) {
      if (amount / sum < deg / 360) {
        amount = amount + items[i]
      } else {
        setWinner(data.labels[i-1])
        return
      }
    }
  }
  console.log(isRotating)

  console.log("deg:",deg, "winner",winner)

  useEffect(() => {
    if(isRotating==="unstarted") return
    if (isRotating==="started") {
      const timer = setInterval(() => {
        setCount((prev) => prev + 1);
      }, 10);
      return () => clearInterval(timer);
    } else if(isRotating==="stopped"){
      console.log("실행되나요")
      while (count<100) {
        console.log("실행되나요22");
        const timer2 = setInterval(() => {
         
          setCount((prev) => prev - 1);
        }, 10);
        return () => clearInterval(timer2);
      }
    }
  }, [isRotating]);

  console.log(count,"count",deg,"deg",winner,"winner")

  // useEffect(() => {
  //   if (deg > 360) {
  //     setDeg(prev => prev - 360)
  //   } else {
  //     setDeg(prev => prev + 1)
  //   }
  // }, [count])

  console.log(isRotating)
  const renderWinner = (winner)=>{

  }

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
    transform: rotate(${360-deg}deg);
  }
`

const Wrapper = styled.div`
  margin-top:100px;
  margin:0 auto;
  width:50%;
  height:50%;
  animation:${(props) => props.isRotating==="started" ? css`${rotationStart(props.deg)} 0.2s linear infinite` : deg && css`${rotationEnd(props.deg)} 2s ease-out`};
  transform:${(props) => props.deg !== 0 ? `rotate(${360-props.deg}deg)` : ""}
`

