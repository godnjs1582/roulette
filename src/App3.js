
import React, { PureComponent, useState, useEffect, useRef, createRef} from 'react';
// import { reforwardRef } from 'react-chartjs-2/dist/utils';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
import styled, { css, keyframes } from "styled-components";
import centerImg from "./center.png";

const data = [
  { name: '빨강', value: 400 },
  { name: '노랑', value: 300 },
  { name: '파랑', value: 300 },
  { name: '초록', value: 200 },
];


const COLORS = ["black", 'blue'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <>
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {data[index].name}
    </text>
    <text x={x} y={y+20} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
    </>
     );
};


export default function App() {
  const refs =useRef([]);
  const ref = useRef()
  const [isRotate, setIsRotate] = useState(false);
  const [count, setCount] = useState(0);
  const deg = count % 360;
  // const [donation, setDonation] = useState([])

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
    const items = data.map((item)=>item.name);
    const sum = data.map((item)=>item.value).reduce((a,b)=>a+b,0);

    const getWinner = () => {
      let amount = 0;
      for (let i = 0; i < items.length; i++) {
        amount = amount + data[i].value; 
        if (amount / sum > deg / 360) {
          return setWinner(data[i].name);
        }
      }
      return setWinner(data[items.length-1].name);
    };

    getWinner();
  }, [deg]);
  
  const onSubmit = (e) => {
    e.preventDefault()
  }
  
  // useEffect(() => {
  //   console.log(re);


  // }, [refs])
  // if(ref && ref.current){
  //   console.log(ref)
  // }
console.log("ref:",ref.current)

  return (
    <div
      style={{
        width: "1200px",
        height: "1080px",
        margin: "0 auto",
        backgroundColor: "grey",
      }}
 
    >
      <h1 style={{ textAlign: "center" }}>여기가 Winner</h1>
      <Arrow isRotate={isRotate} deg={deg}>
        ↓
      </Arrow>
      <div style={{ position: "relative" }} >
        <Wrapper isStop={count && !isRotate} deg={deg}  >
          {/* <ResponsiveContainer width="100%" height="100%"> */}
          <PieChart
            width={600}
            height={600}
          
            // style={{ border: "1px solid red" }}
          >
            <Pie
        
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={300}
              fill="#8884d8"
              dataKey="value"
              startAngle={90}
              endAngle={-450}
              
            >
     
              {data.map((entry, index) => {
                <div>{'헤헤헤헤헤'}</div>
                       //     <div  key={`cell-${index}`} >
            //       <Cell
               
            //         fill={COLORS[index % COLORS.length]}
            //       />
            //  </div>
              }
    
              )}
            </Pie>
          </PieChart>
          {/* </ResponsiveContainer> */}
        </Wrapper>
        <Img src={centerImg} alt="center" />
      </div>

      <button onClick={handleSpinClick}>클릭</button>
      <h1 >Winner is: {winner}</h1 >
      <form onSubmit={onSubmit} >
        <input     />
      </form>
    </div>
  );
}



const rotationEnd = (deg) => keyframes`
  100%{
    transform: rotate(${-1080-deg}deg);
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
  border:1px solid blue;
  margin-top: 100px;
  margin: 0 auto;
  width: 600px;
  height: 600px;
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