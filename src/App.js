import React, { useState, useEffect, useRef } from "react";
// import { reforwardRef } from 'react-chartjs-2/dist/utils';
import { PieChart, Pie, Cell } from "recharts";
import styled, { css, keyframes } from "styled-components";
import centerImg from "./center.png";


const DEFAULT_PIE_OPTIONS = {
  labelLine: false,
  dataKey: "value",
  animationDuration: 0,
  startAngle: 90,
  endAngle: -450,
};

const data = [
  { name: "마이페이지", value: 50 },
  { name: "스튜디오", value: 50 },

];

const COLORS = ["#FFFFFF", "#5335FF"];

export default function App() {
  const [isRotate, setIsRotate] = useState(false);
  const [count, setCount] = useState(0);
  const ref = useRef();
  const deg = count % 360;
  // const rotateCount =parseInt(count%360)
  const [rotateCount, setRotateCount]=useState(parseInt(count/360))
  console.log("rotateCount:",rotateCount)
  const [donationList, setDonationList] = useState([...data]);
  const [inputText, setInputText] = useState("");

  const [winner, setWinner] = useState("");


  const isStop = count && !isRotate;


  const handleSpinClick = () => {
    setIsRotate((prev) => !prev);

  };

  useEffect(() => {
    if (isRotate) {
      setRotateCount(0)
      const timer = setInterval(() => {
        setCount((prev) => prev + 10); // 속도조절
      }, 10);
      return () => clearInterval(timer);
    }

    if(isStop){

      // 3초뒤에 300번실행 3이 0이되게끔 
      // if(rotateCount<3){  
       
        let count = 10;
        const timer = setInterval(() => {
          count -= 1/100
          if(count>3){
            setCount((prev) => Math.ceil(prev + count)); // 속도조절
          }else{
            console.log("endMotion실행")
            setCount((prev) => Math.ceil(prev + count)); // 속도조절
          }

       
          console.log("count:",count)
        }, 10);
     
        setTimeout(() => clearInterval(timer), 10000)
        return () => clearInterval(timer);
      }
      // }
  
  }, [isRotate, isStop ]);




  console.log("count:",count, "winner:",winner, "deg:",deg)

  useEffect(() => {
    const items = data.map((item) => item.name);
    const sum = data.map((item) => item.value).reduce((a, b) => a + b, 0);

    const getWinner = () => {
      let amount = 0;
      for (let i = items.length - 1; i >= 0; i--) {
        amount = amount + data[i].value;
        if (amount / sum > deg / 360) {
          return setWinner(data[i].name);
        }
      }
      return setWinner(data[items.length - 1].name);
    };

    getWinner();
  }, [deg]);

  const onSubmit = (e) => {
    e.preventDefault();
    const hasSameDonation = !!donationList.find((item) => item.name === inputText);
    if (hasSameDonation) {
      const newDonationList = donationList.map((item) =>
        item.name === inputText ? { ...item, value: item.value + 1 } : item
      );
      setDonationList(newDonationList);
    } else {
      const newDonationList = [...donationList, { name: inputText, value: 1 }];
      setDonationList(newDonationList);
    }
    setInputText("");
  };

  const onChange = (e) => {
    setInputText(e.target.value);
  };
  
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180; 

    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    const textAnchor = x > cx ? "start" : "end";
    const fill = index % 2 === 0 ? "#5335FF" : "#FFFFFF";

    return (
      <>
        <text x={x} y={y} fill={fill} textAnchor={textAnchor} dominantBaseline="central">
          {donationList[index].name}
        </text>
        <text x={x} y={y + 20} fill={fill} textAnchor={textAnchor} dominantBaseline="central">
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      </>
    );
  };

  return (
    <div style={{ width: "1200px", height: "1080px", margin: "0 auto", backgroundColor: "grey" }}>
      <h1 style={{ textAlign: "center" }}>여기가 Winner</h1>
      <h1 style={{ textAlign: "center" }}>↓</h1>
      <div style={{ position: "relative" }}>
        <Wrapper isStop={isStop} deg={deg} ref={ref}>
          <PieChart width={600} height={600}>
            <Pie data={donationList} label={renderCustomizedLabel} {...DEFAULT_PIE_OPTIONS}>
              {donationList.map((item, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </Wrapper>
        <Img src={centerImg} alt="center" />
      </div>

      <button onClick={handleSpinClick}>클릭</button>
      <h1>Winner is: {winner}</h1>
      <form onSubmit={onSubmit}>
        <input onChange={onChange} />
      </form>
    </div>
  );
}

const Wrapper = styled.div`
  margin-top: 100px;
  margin: 0 auto;
  width: 600px;
  height: 600px;
  transform: ${({ deg }) => `rotate(${deg}deg)`};
`;

const Img = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;
`;
