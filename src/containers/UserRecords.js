import React, { useEffect, useState } from "react";
import axios from "axios";
import wait from "waait";
import Badge from "react-bootstrap/Badge";
import ListGroup from "react-bootstrap/ListGroup";
import "./Records.css";
import Spinner from 'react-bootstrap/Spinner';
import { useParams } from "react-router-dom";

export default function UserRecords() {
  // const [value, setValue] = useState({
  //     loading: true,
  //     items: {}
  // });

  let {userid} = useParams();

  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  const listRecords = async () => {
    try {
      await wait(2000);
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      let items = response.data;
      // console.log(items)
      setContent(items);
      setLoading(false);
      //   setValue({loading:false, items: response.data})
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    listRecords();
  }, []);

  return (
    <div className="Records">
        <div className="lander">
      <h1 align="center">UserID: {userid} </h1>
      <h3 align="center">Records of clock-in/out</h3>
      </div>
      <div>
        {loading ? (
            <>
                <Spinner animation="border" variant="primary" />
            </>
        ): ""}
        {console.log(userid)}
        
        {content.map((user) => {
          return (
            <ListGroup as="ol" key={user.id} horizontal={user.id}>
              <ListGroup.Item
                as="li"
                className="d-flex justify-content-between align-items-start"
              >
                <div className="ms-2 me-auto">
                  <div className="fw-bold">{user.name}</div>
                  {user.company.name}, {user.email} 
                </div>
                <Badge bg="primary" pill>
                  clock-in
                </Badge>
              </ListGroup.Item>              
            </ListGroup>
          );
        })}
      </div>
    </div>
  );
}
