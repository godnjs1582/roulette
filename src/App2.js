import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement } from "chart.js";
import { Pie } from "react-chartjs-2";
import styled, { css, keyframes } from "styled-components";
import centerImg from "./center.png";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement);
ChartJS.register(ChartDataLabels);


const rotation = (ctx) => {
  const valuesBefore = ctx.dataset.data.slice(0, ctx.dataIndex).reduce((a, b) => a + b, 0);
  const sum = ctx.dataset.data.reduce((a, b) => a + b, 0);
  const rotation = ((valuesBefore + ctx.dataset.data[ctx.dataIndex] / 2) / sum) * 360;
  return rotation < 180 ? rotation - 90 : rotation + 90;
}

export const data = {
  labels: [
    "빨강",
    "노랑",
    "안녕하세요 여러분jhgjhgjhgjhgjhgㅁㄴㅇasdasdasdasdasdasdasdasd",
    "초록",
    "파랑",
    "검정",
  ],
  animation:{
    duration:0
  },
  datasets: [
    {
      // label: "# of Votes",
      data: [2, 2, 2, 4, 9, 2], // 72 , 144 , 216, 288, 360
      backgroundColor: [ "#FFFFFF","#5335FF"],
      borderWidth: 0,
      datalabels: {
        rotation: rotation,
        align: "center",
        // maxLength:{5},
        // textOverflow:"ellipsis",
        // textAlign: "center",
        // anchor: "center", 

        font: { size: 20, weight: "bold"},//이거 안먹는듯해여ㅠellipsis 
        formatter: (value,context) => {
          // if (context.chart.data.labels[context.dataIndex].length > 5) {
          //   return (
          //         `${context.chart.data.labels[context.dataIndex].slice(0,5)+"..."+value}`
          //   );
          // } else {
            return `${context.chart.data.labels[context.dataIndex]}${value}`;
          // }
          
        },
        color: (ctx) => {
          return ctx.dataIndex % 2 === 0 ? "#5335FF" : "#FFFFFF";
        },
        
      },
      
    },
    
  ],
  
};

const INIT_DONATION = [{},{}]

export default function App() {
  const [isRotate, setIsRotate] = useState(false);
  const [count, setCount] = useState(0);
  const deg = count % 360;
  const [donation, setDonation] = useState([])

  const [winner, setWinner] = useState("");

  const handleSpinClick = () => {
    setIsRotate((prev) => !prev);
  };

  useEffect(() => {
    if (isRotate) {
      const timer = setInterval(() => {
        setCount((prev) => prev + 10); // 속도조절
      }, 10);
      return () => clearInterval(timer);
    }
  }, [isRotate]);

  useEffect(() => {
    const items = data.datasets[0].data;
    console.log(items,"items")//[2,2,2,4,9,2]
    const sum = items.reduce((a, b) => a + b, 0);
    console.log(sum,"sum")
    //21

    const getWinner = () => {
      let amount = 0;
      for (let i = 0; i < items.length; i++) {
        amount = amount + items[i];
        if (amount / sum > deg / 360) {
          return setWinner(data.labels[i]);
        }
      }
      return setWinner(data.labels[items.length - 1]);
    };

    getWinner();
  }, [deg]);
  
  const onSubmit = (e) => {
    e.perventDefault()
  }

  return (
    <div style={{ width: "1200px", margin: "0 auto", backgroundColor:"#fafafa" }}>
      <h1 style={{ textAlign: "center" }}>여기가 Winner</h1>
      <Arrow isRotate={isRotate} deg={deg}>↓</Arrow>
      <div style={{ position: "relative" }}>
        <Wrapper isStop={count && !isRotate} deg={deg}>
          <Pie data={data} options={{animation:false}}   />
        </Wrapper>
        <Img src={centerImg} alt="center" />
      </div>

      <button onClick={handleSpinClick}>클릭</button>
      <h1>Winner is: {winner}</h1>
      <form onSubmit={onSubmit}>
        <input/>
      </form>
    </div>
  );
}

const rotationEnd = (deg) => keyframes`
  100%{
    transform: rotate(${-deg - 1080}deg);
  }
`;

const arrowPlayAnimation = () => keyframes`
 0%{
    transform:rotate(0deg);
  }
  50%{
    transform:rotate(20deg);
  }
  90%{
    transform:rotate(5deg);
  }
  100%{
    transform:rotate(0deg);
  }
`;


const Arrow = styled.h1`
text-align: center;
transform-origin: 50% 0 0;
animation: ${({isRotate, deg})=> isRotate && css`${arrowPlayAnimation} 0.4s ease-in infinite`};
position: relative;
top:33px;
z-index: 10;
`

const Wrapper = styled.div`
  margin-top: 100px;
  margin: 0 auto;
  width: 30%;
  height: 30%;
  animation: ${({ isStop, deg }) =>
    isStop &&
    css`
      ${rotationEnd(deg)} 2s ease-out
    `};
  transform: ${({ deg }) => `rotate(${-deg}deg)`};
`;

const Img = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;
`;
