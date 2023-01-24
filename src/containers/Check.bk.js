import React from "react";
import {useState, useEffect } from 'react';
import "./Checkin.css"
import Button from "react-bootstrap/Button";

export default function Checkin() {
    const date = new Date();
    const week = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
    let day = week[date.getDay()];
    const showNow = date.getFullYear()
        + "." + date.getMonth()+1
        + "." + date.getDate()
        + " " + day
        + " " + String(date.getHours()).padStart(2,"0")
        + ':' + String(date.getMinutes()).padStart(2,"0")
    
    const checklog = () => {
        console.log(showNow)
        // console.log(String(date.getHours()).padStart(2,"0"));
        // console.log(String(date.getMinutes()).padStart(2,"0"));
    }

    checklog();
  
    return (
        <div className="Checkin">
            <div className="lander">
            <h1 align="center">You are checking in</h1>
            <h3 align="center"> {showNow}</h3>
            <Button variant="primary" type="submit">
            Confirm
            </Button>
            </div>
        </div>
    );
}


// export default function Checkin() {

    

//     const [timer, setTimer] = useState();

//     const currentTimer = () => {
//         // console.log()
//         const now = new Date();
//         const year =  String(now.getFullYear()).padStart(2,"0");
//         const month =  String(now.getMonth()+1);
//         const date =  String(now.getDate()).padStart(2,"0");
//         const week = ['SUM','MON','TUE','WED','THU','FRI','SAT'];
//         let dayOfWeek = week[now.getDay()];
//         const hours = String(now.getHours()).padStart(2,"0");
//         const minutes = String(now.getMinutes()).padStart(2,"0");
//         const seconds = String(now.getSeconds()).padStart(2,"0");
//         setTimer(`${year}.${month}.${date} ${dayOfWeek} ${hours}:${minutes}:${seconds}`)
//     }

//     const startTimer = () => {
//         setInterval(currentTimer, 1000)
//         console.log(timer)
//     }
    

//     startTimer()

//     const checklog = () => {
//         console.log(timer)
//     }

//     return (
//         <div className="Checkin">
//             <p>{timer}</p>
//             <Button as="input" type="submit" value="Take attendance" />{' '}
//         </div>
//     )
// }

// export default function Checkin() {
//     const [time, setTime] = useState(new Date());

//     useEffect(() => {
//       const id = setInterval(() => {
//         setTime(new Date());
//       }, 1000);
//       return (() => clearInterval(id))
//     }, []);


//     return (
//       <div>
//         <h2>Today you're checking in</h2>
//         <p>{`${time.getFullYear()}.${time.getMonth()+1}.${time.getDate()} ${time.toLocaleTimeString()} `}</p>
//         <p><Button as="input" type="submit" value="Take attendance" />{' '}</p>
        
//       </div>
//     );
//     }