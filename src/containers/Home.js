import React from "react";
import "./Home.css";
import Button from "react-bootstrap/Button";

export default function Home() {
  return (
    <div className="Home">
      <div className="lander">
        <h1 align="center">Don't forget to check in </h1>
        <p align="center" className="text-muted">Attendace SaaS application</p>
        <div className="btn">
        <Button href="/checkin" variant="primary" type="submit">
        Move to check in
        </Button>
        </div>
      </div>
      
    </div>
  );
}