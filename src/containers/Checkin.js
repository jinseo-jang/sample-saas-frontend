import React, { useState, useEffect } from "react";
import "./Checkin.css";
import Button from "react-bootstrap/Button";
import axios from "axios";
import wait from "waait";
import Spinner from "react-bootstrap/Spinner";
import { onError } from "../lib/errorLib";
import { Auth } from "aws-amplify";
import { fetchUserInformation } from "../authUtils";

export default function Checkin() {
  const [msg, setMsg] = useState("You're about to punch in at");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tenantId, setTenantId] = useState(null);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    async function fetchUserInfo() {
      const userInfo = await fetchUserInformation();
      if (userInfo) {
        const { loggedInTenantId, loggedInUserName } = userInfo;
        setTenantId(loggedInTenantId);
        setUserName(loggedInUserName);
      }
    }
    fetchUserInfo();
  }, []);


  // const date = new Date();
  // const checkin_time =
  //   date.getFullYear() +
  //   "." +
  //   date.getMonth()+1 +
  //   "." +
  //   date.getDate() +
  //   " " +
  //   String(date.getHours()).padStart(2, "0") +
  //   ":" +
  //   String(date.getMinutes()).padStart(2, "0");
  
  const date = new Date();
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  };
  const checkin_time = date.toLocaleString('en-US', options);
  console.log(checkin_time);
    

  const postAttendance = async (checkInTime, e) => {
    const apiUrl = "http://127.0.0.1:5000/api/records"

    try {
      const session = await Auth.currentSession();
      const idToken = session.getIdToken().getJwtToken();
      console.log("ID Token:", idToken);
      console.log("Param:", checkInTime);
      console.log("Tenand ID:",tenantId);
      console.log("Username:",userName);
      setLoading(true);
    
      const date = new Date();
      const isoTimestamp = date.toISOString();
      const data = { timestamp: isoTimestamp, user_name: userName, action: 'clock_in' };
  
      const response = await axios.post(apiUrl, data, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        }
      });
    
      if (response.status === 201) {
        console.log("okay");
        console.log(response);
        setLoading(false);
        setSuccess(true);
        setMsg("You've successfully punched in at");
      }
    } catch (error) {
      onError(error)
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div className="Checkin">
      <div className="lander">
        <h1 align="center">{msg}</h1>
        <h3 align="center"> {checkin_time}</h3>
        {/* <Button variant="primary" onClick={postAttendance()}> */}
        <Button variant="primary" onClick={(e)=>{postAttendance(checkin_time, e)}} disabled={success}>
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
