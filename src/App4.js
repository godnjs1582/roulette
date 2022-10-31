import React ,{ useState, useEffect } from 'react';
import { PieChart } from 'react-minimal-pie-chart';
import styled, { css, keyframes } from "styled-components";

const App4 = () => {
  const [playState, setPlayState]=useState("waiting")
  const [linearCount, setLinearCount] = useState(0); // linearCount
  const [easeOutCount, setEaseOutCount] = useState(0); // easeOutCount
  const [winner, setWinner] = useState("");
  const linearDegree=linearCount%360
  const easeOutDegree=Math.floor(easeOutCount%360)
  const degree=playState==="play"?linearDegree:easeOutDegree
  useEffect(() => {
    if(playState!=="waiting"){
      const timer = setInterval(() => {
        setLinearCount((prev) => prev + 10);
      }, 10);
      return () => clearInterval(timer);
    }
  }, [playState]);

  // useEffect(() => {
  //   setEaseOutCount(linearCount)
  //   let count = 10;
  //   if(playState==="stop"){
  //       const timer = setInterval(() => {
  //         count -= 1/100
  //         setEaseOutCount((prev) => prev+count);
          
  //       }, 10);
  //       setTimeout(() => clearInterval(timer), 10000)
  //       return () => clearInterval(timer);
  //   }
  // }, [playState]);

  console.log("degree:",degree, "linearDegree:",linearDegree, "easeOutDegree:",easeOutDegree, "playState:",playState)



  






  const data = [
    { title: "빨강", value: 10, color: "red" },
    { title: "노랑", value: 20, color: "yellow" },
    { title: "파랑", value: 30, color: "blue" },
    { title: "초록", value: 40, color: "green" },
  ];

  useEffect(() => {
    const items = data.map((item) => item.title);
    const sum = data.map((item) => item.value).reduce((a, b) => a + b, 0);
    const getWinner = () => {
      let amount = 0;
      for (let i = items.length - 1; i >= 0; i--) {
        amount = amount + data[i].value;
        if (amount / sum > degree / 360) {
          return setWinner(data[i].title);
        }
      }
      return setWinner(data[items.length - 1].title);
    };

    getWinner();
  }, [degree]);







  useEffect(() => {
    if(playState==="play"){
      setEaseOutCount(linearCount)
    }
  }, [playState]);

  const handlePlayState =()=>{
    if(playState==="waiting"){
      setPlayState("play")
    }else if(playState==="play"){
      setPlayState("stop")
    }else if(playState==="stop"){
      setPlayState("play")
    }
  }





  return (
    <>
      <div>linearCount:{linearCount}</div>
      <div>linearDegree:{linearDegree}</div>
      <div>EaseOutCount:{easeOutCount}</div>
      <div>EaseOutDegree:{easeOutDegree}</div>
      <button onClick={handlePlayState}>클릭</button>
      <div>playState:{playState}</div>
      <div>winner:{winner}</div>
      <Wrapper degree={degree} playState={playState} linearDegree={linearDegree} easeOutDegree={easeOutDegree} >
        <PieChart data={data} startAngle={-90} endAngle={470}/>
      </Wrapper>
    </>
  );
};

export default App4;


const rotationEnd = (degree) => keyframes`
50%{
  transform: rotate(${1060-degree}deg);
}
80%{
  transform: rotate(${1100-degree}deg);
}
  100%{
    transform: rotate(${1080-degree}deg);
  }
`;

const Wrapper = styled.div`
  margin-top: 100px;
  margin: 0 auto;
  width: 600px;
  height: 600px;
  animation: ${({ playState, degree }) =>
(playState==="stop") &&
css`
  ${rotationEnd(degree)} 3s ease-out
`};

  transform: ${({ playState,linearDegree, easeOutDegree }) => playState==="play"?`rotate(${linearDegree}deg)`:`rotate(${-easeOutDegree}deg)`};
`;


