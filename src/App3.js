
import React, { useState, useEffect, useRef } from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import styled, { css, keyframes } from "styled-components";
import centerImg from "./center.png";

/**데이터*/
const data = [
  { name: '딸기', value: 40 },
  { name: '당근', value: 30 },
  { name: '수박', value: 20 },
  { name: '참외', value: 10 },
  { name: '메론', value: 40 },
  { name: '게임', value: 40 },
];

/**반복될 컬러 패턴(2개 이상 필요)*/
const COLORS = ["#ffffff", '#5335FF'];
const RADIAN = Math.PI / 180;
/**라베 커스터마이징(FIXME:text rotation 문제) */
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <>
      <text
        x={x}
        y={y}
        fill={index % 2 === 0 ? "#5335FF" : "white"}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={24}
        fontWeight={"bold"}
        // style={{ WebkitTransform: `rotate(${-y+90}deg)`, transformOrigin: `rotate(${y}deg)` }}
      >
        {data[index].name}
      </text>
    </>
  );
};


export default function App() {
  /**재생상태 stop(멈춤),play(재생),waiting(기다림) */
  const [playState, setPlayState] = useState("waiting");
  /**밀리세컨즈, 계속 실행 됨(FIXME:계속 실행하지 않고 해결하는 방법?)*/
  const [count, setCount]=useState(0)
  /**clicked 시의 answer이 가질 최종 deg */
  const [deg,setDeg]=useState(0)
  /**최종 결과값 */
  const [winner, setWinner] = useState("");
  /**data=>항목들 추출(ex:["딸기","당근","수박","참외"]) */
  const items = data.map((item)=>item.name);
  /** data=>value값들의 합(ex:30,20,10,40 일 경우 sum은 100)*/
  const sum = data.map((item)=>item.value).reduce((a,b)=>a+b,0);
  /** wrapper rotate degree를 감지하기 위한*/
  const ref=useRef()
  /**real dom degree */
  const [answer,setAnswer]=useState(null);


  /**버튼 클릭 이벤트(waiting, play, stop)(FIXME:상태값을 두개(boolean값)로 줄여볼 것! */
  const handleSpinClick = () => {
    if(playState==="waiting"){
      setPlayState("play")
    }else if(playState==="play"){
      setPlayState("stop")
    }else if(playState==="stop"){
      setPlayState("play")
    }
  };
/**playState가 재생중일 때만 deg값을 일정하게 더해 줌 */
  useEffect(() => {
    if (playState==="play") {
      const timer = setInterval(() => {
        setDeg((prev) => prev + 10); 
      }, 10);
      return () => clearInterval(timer);
    }
  }, [playState]);

/**0<deg<360으로 유지*/
  useEffect(()=>{
    if(deg>=360){
      setDeg(deg-360)
    }
  },[deg])

  /**카운트는 재생 상태 관련없이 항상 특정 시간마다 증가=>real dom을 확인하기 위함*/ 
  useEffect(()=>{
    const timer = setInterval(() => {
      setCount((prev) => prev + 10); 
    }, 10);
    return () => clearInterval(timer);
  },[])

  
const getRotationDegrees=(element)=> {
  const style = window.getComputedStyle(element.current);
  const transformString = style['-webkit-transform'] || style['-moz-transform'] || style['transform'] ;
  if (!transformString || transformString === 'none')
      setAnswer(0);
  const splits = transformString.split(',');
  const parenLoc = splits[0].indexOf('(');
  const a = parseFloat(splits[0].substr(parenLoc+1));
  const b = parseFloat(splits[1]);
  const rad = Math.atan2(b, a);
  let deg = 180 * rad / Math.PI;
  if (deg < 0) deg += 360;
  return setAnswer(deg);
}


useEffect(()=>{
  getRotationDegrees(ref)
},[count])




  useEffect(() => {
    const getWinner = () => {
      let degree1=360-answer;
      let amount = 0;
      for (let i = 0; i < items.length; i++) {
        amount = amount + data[i].value; 
        if (amount / sum > degree1 / 360) {
          setWinner(data[i].name);
          return
        }
      }
      setWinner(data[items.length-1].name);
    };
    getWinner();
  }, [answer]);
  
  const onSubmit = (e) => {
    e.preventDefault()
  }
  
  return (
    <div
      style={{
        width: "1200px",
        height: "1080px",
        margin: "0 auto",
        background:"#dddddd"
      }}
 
    >
      <h1 style={{ textAlign: "center" }}>여기가 Winner</h1>
      <Arrow playState={playState} deg={deg}>
        ↓
      </Arrow>
      <div style={{ position: "relative" }} >
        <Wrapper isStop={count && playState==="stop"} deg={deg} ref={ref} >
          <PieChart
            width={600}
            height={600}
          >
            <Pie
              data={data}
              label={renderCustomizedLabel}
              {...PIE_OPTIONS} 
            >
              {data.map((entry, index) => 
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
              )}
            </Pie>
          </PieChart>
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
  margin-top: 100px;
  margin: 0 auto;
  width: 600px;
  height: 600px;
  animation: ${({ isStop, deg }) =>
  isStop &&
  css`
    ${rotationEnd(deg)} 5s ease-out
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

const PIE_OPTIONS = {
  labelLine:false,
  fill:"#8884d8",
  dataKey:"value",
  cx:"50%",
  cy:"50%",
  outerRadius:300,
  startAngle:90,
  endAngle:-450,
  stroke:false,
  isAnimationActive:false 
}