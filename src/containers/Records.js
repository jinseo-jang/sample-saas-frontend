import React, { useEffect, useState } from "react";
import axios from "axios";
import wait from "waait";
import Badge from "react-bootstrap/Badge";
import ListGroup from "react-bootstrap/ListGroup";
import "./Records.css";
import Spinner from 'react-bootstrap/Spinner';
import { useParams } from "react-router-dom";
import { Auth } from "aws-amplify";
import { fetchUserInformation } from "../authUtils";

export default function Records() {
  // const [value, setValue] = useState({
  //     loading: true,
  //     items: {}
  // });

  let {userid} = useParams();

  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const listRecords = async () => {
    const apiUrl = "http://127.0.0.1:5000/api/records"
    // const data = { user_name: userName };
    const session = await Auth.currentSession();
    const idToken = session.getIdToken().getJwtToken();
    console.log("ID Token:", idToken);

    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      let items = response.data;
      console.log(items);
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
        <h1 align="center">UserID: {userid}</h1>
        <h3 align="center">Records of clock-in/out</h3>
      </div>
      <div>
        {loading ? (
          <Spinner animation="border" variant="primary" />
        ) : (
          content.map((record) => (
            <ListGroup as="ol" key={record.record_id} horizontal={record.record_id}>
              <ListGroup.Item
                as="li"
                className="d-flex justify-content-between align-items-start"
              >
                <div className="ms-2 me-auto">
                  <div className="fw-bold">Record ID: {record.record_id}</div>
                  <div>Tenant ID: {record.tenant_id}</div>
                  <div>User Name: {record.user_name}</div>
                  <div>Clock In: {record.clock_in}</div>
                  <div>Clock Out: {record.clock_out || 'Not available'}</div>
                </div>
                <Badge bg="primary" pill>
                  clock-in
                </Badge>
              </ListGroup.Item>
            </ListGroup>
          ))
        )}
      </div>
    </div>
  );
}

//   return (
//     <div className="Records">
//         <div className="lander">
//       <h1 align="center">UserID: {userid}</h1>
//       <h3 align="center">Records of clock-in/out</h3>
//       </div>
//       <div>
//         {loading ? (
//             <>
//                 <Spinner animation="border" variant="primary" />
//             </>
//         ): ""}
        
//         {content.map((user) => {
//           return (
//             <ListGroup as="ol" key={user.id} horizontal={user.id}>
//               <ListGroup.Item
//                 as="li"
//                 className="d-flex justify-content-between align-items-start"
//               >
//                 <div className="ms-2 me-auto">
//                   <div className="fw-bold">{user.name}</div>
//                   {user.company.name}, {user.email} 
//                 </div>
//                 <Badge bg="primary" pill>
//                   clock-in
//                 </Badge>
//               </ListGroup.Item>              
//             </ListGroup>
//           );
//         })}
//       </div>
//     </div>
//   );
// }
