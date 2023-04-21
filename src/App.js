import React, { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import { Route } from "react-router-dom";
import "./App.css";
import Routes from "./Routes";
import Home from "./containers/Home";
import Nav from "react-bootstrap/Nav";
import { LinkContainer } from "react-router-bootstrap";
import { AppContext } from "./lib/contextLib";
import { Auth } from "aws-amplify";
import { useNavigate } from "react-router-dom";
import { onError } from "./lib/errorLib";

function App() {
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const nav = useNavigate();
  const [tenantId, setTenantId] = useState(null);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    onLoad();
  }, []);

  // async function onLoad() {
  //   try {
  //     //await Auth.currentSession();
  //     const session = await Auth.currentSession();
  //     const userAttributes = session.getIdToken().payload;
  //     const loggedInTenantId = userAttributes["custom:tenant_id"];
  //     const loggedInUserName = userAttributes["email"];

  //     // console.log('Tenant ID:', loggedInTenantId, 'User Name:', loggedInUserName);


  //     setTenantId(loggedInTenantId);
  //     setUserName(loggedInUserName);

  //     userHasAuthenticated(true);
  //   } catch (e) {
  //     if (e !== "No current user") {
  //       onError(e);
  //     }
  //   }

  //   setIsAuthenticating(false);
  // }

  useEffect(() => {
    if (isAuthenticated) {
      fetchTenantInformation();
    }
  }, [isAuthenticated]);

  async function fetchTenantInformation() {
    try {
      const session = await Auth.currentSession();
      const userAttributes = session.getIdToken().payload;
      const loggedInTenantId = userAttributes["custom:tenant_id"];
      const loggedInUserName = userAttributes["email"];

      setTenantId(loggedInTenantId);
      setUserName(loggedInUserName);
    } catch (e) {
      if (e !== "No current user") {
        onError(e);
      }
    }
  }

  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    } catch (e) {
      if (e !== "No current user") {
        onError(e);
      }
    }

    setIsAuthenticating(false);
  }

  async function handleLogout() {
    await Auth.signOut();

    userHasAuthenticated(false);
    setTenantId(null);
    setUserName(null);
  

    nav("/login");
  }
  return (
    !isAuthenticating && (
      <div className="App container py-3">
        <Navbar collapseOnSelect bg="light" expand="md" className="mb-3">
          <LinkContainer to="/">
            <Navbar.Brand className="font-weight-bold text-muted">
              <img
                alt=""
                src="/logo.png"
                width="30"
                height="30"
                className="d-inline-block align-top mr-2"
              />
              ClockIO
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav activeKey={window.location.pathname}>
              {isAuthenticated ? (
                <>
                  <LinkContainer to="/checkin">
                    <Nav.Link>ClockIn</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/records">
                    <Nav.Link>Records</Nav.Link>
                  </LinkContainer>
                  <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                  <Nav.Item className="navbar-text-container">
                    <Navbar.Text className="text-primary">
                      Tenant ID: {tenantId} | Tenant Name: {userName}
                    </Navbar.Text>
                  </Nav.Item>
                </>
              ) : (
                <>
                  <LinkContainer to="/signup">
                    <Nav.Link>Signup</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <Nav.Link>Login</Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
          <Routes />
        </AppContext.Provider>
      </div>
    )
  );
}

// return (
//   !isAuthenticating && (
//     <div className="App container py-3">
//       <Navbar collapseOnSelect bg="light" expand="md" className="mb-3">
//         <LinkContainer to="/">
//           <Navbar.Brand className="font-weight-bold text-muted">
//             <img
//               alt=""
//               src="/logo.png"
//               width="30"
//               height="30"
//               className="d-inline-block align-top"
//             />ClockIO
//           </Navbar.Brand>
//         </LinkContainer>
//         <Navbar.Toggle />
//         <Navbar.Collapse className="justify-content-end">
//           <Nav activeKey={window.location.pathname}>
//             {isAuthenticated ? (
//               <>
//                 <LinkContainer to="/checkin">
//                   <Nav.Link>ClockIn</Nav.Link>
//                 </LinkContainer>
//                 <LinkContainer to="/records">
//                   <Nav.Link>Records</Nav.Link>
//                 </LinkContainer>
//                 <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
//                 <Navbar.Text>
//                   Tenant ID: {tenantId} | Tenant Name: {userName}
//                 </Navbar.Text>
//               </>
//             ) : (
//               <>
//                 <LinkContainer to="/signup">
//                   <Nav.Link>Signup</Nav.Link>
//                 </LinkContainer>
//                 <LinkContainer to="/login">
//                   <Nav.Link>Login</Nav.Link>
//                 </LinkContainer>
//               </>
//             )}
//           </Nav>
//         </Navbar.Collapse>
//       </Navbar>
//       <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
//         <Routes />
//       </AppContext.Provider>
//     </div>
//   )
// );
// }

export default App;
