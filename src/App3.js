
import React, { PureComponent, useState, useEffect, useRef, createRef} from 'react';
// import { reforwardRef } from 'react-chartjs-2/dist/utils';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
import styled, { css, keyframes } from "styled-components";
import centerImg from "./center.png";

const data = [
  { name: '빨강', value: 40 },
  { name: '노랑', value: 30 },
  { name: '파랑', value: 20 },
  { name: '초록', value: 10 },
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

  const [isRotate, setIsRotate] = useState(false);
  const [count, setCount]=useState(0)
  const [deg,setDeg]=useState(Math.ceil(count%360))
  const items = data.map((item)=>item.name);
  const sum = data.map((item)=>item.value).reduce((a,b)=>a+b,0);
  const sections=data.map((item)=>item.value*360/sum)
  const [winnerPriority,setWinnerPriority]=useState(0)

 
  // let deg =Math.ceil(count % 360);

  const [winner, setWinner] = useState("");

  const handleSpinClick = () => {
    setIsRotate((prev) => !prev);
  };

  useEffect(() => {
    if (isRotate) {
      const timer = setInterval(() => {
        setCount((prev) => prev + 10); // 속도조절
        // setDeg(count%360)
      }, 10);
      return () => clearInterval(timer);
    }
    else{
      const timer = setInterval(() => {
      setDeg(prev=>Math.sin((prev*Math.PI)/2)*100/360)
      }, 10);
      return () => clearInterval(timer);
    }
  }, [isRotate,deg]);
console.log(deg)

function easeInOutQuad(x, t, b, c, d) {
  if ((t /= d / 2) < 1) {
      return c / 2 * t * t + b;
  } else {
      return -c / 2 * ((--t) * (t - 2) - 1) + b;
  }
}

useEffect(()=>{

  setDeg(Math.ceil(count%360))

},[count])



  

  // console.log(winner)


  useEffect(() => {
    

    const getWinner = () => {
      let amount = 0;
      for (let i = 0; i < items.length; i++) {
        amount = amount + data[i].value; 
        if (amount / sum > deg / 360) {
          setWinner(data[i].name);
          setWinnerPriority(data[i].value)
          return
        }
      }
      setWinner(data[items.length-1].name);
      setWinnerPriority(data[items.length-1].value);
    
    };

    getWinner();
  }, [deg]);
  
  const onSubmit = (e) => {
    e.preventDefault()
  }
  
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
        <Wrapper isStop={count && !isRotate} deg={deg} sections={sections} >
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

                <div key={`cell-${index}`} >
                  <Cell

                    fill={COLORS[index % COLORS.length]}
                  />
                </div>
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

  transform: ${({ deg }) => `rotate(${-deg}deg)`};
`;

const Img = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;
`;

// animation: ${({ isStop, deg , sections}) =>
// isStop &&
// css`
//   ${rotationEnd(deg, sections)} 5s ease-out
// `};