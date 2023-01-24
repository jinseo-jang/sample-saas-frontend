import React, { useState } from "react";
import "./Checkin.css";
import Button from "react-bootstrap/Button";
import axios from "axios";
import wait from "waait";
import Spinner from "react-bootstrap/Spinner";

export default function Checkin() {
  const [msg, setMsg] = useState("You're about to punch in at");
  const [loading, setLoading] = useState(false);

  const date = new Date();
  const checkin_time =
    date.getFullYear() +
    "." +
    date.getMonth() +
    1 +
    "." +
    date.getDate() +
    " " +
    String(date.getHours()).padStart(2, "0") +
    ":" +
    String(date.getMinutes()).padStart(2, "0");

  const postAttendance = async (checkInTime, e) => {
    try {

      console.log("Param:", checkInTime)
      setLoading(true);
    
      //<<EOF>Temp code to intentionally make time delay to test.Ok to delete
      await wait(3000);
      console.log("3sec later");
      //EOF
    
      //<<EOF>Temp API call to test. Need to change POST API
      const data = await axios.get(
        "https://random-data-api.com/api/v2/addresses"
      );
      //EOF
      if (data.status === 200) {
        console.log("okay");
        console.log(data);
        setLoading(false);
        setMsg("You've successfully punched in at");
      }
    } catch (error) {
      setLoading(false);
      if (error.response.status === 404) {
        console.log("404 error");
      }
    }
  };

  return (
    <div className="Checkin">
      <div className="lander">
        <h1 align="center">{msg}</h1>
        <h3 align="center"> {checkin_time}</h3>
        {/* <Button variant="primary" onClick={postAttendance()}> */}
        <Button variant="primary" onClick={(e)=>{postAttendance(checkin_time, e)}}>
          {loading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              <span className="visually-hidden"></span>
            </>
          ) : (
            <>Confirm</>
          )}
        </Button>
      </div>
    </div>
  );
}
