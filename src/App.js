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

  useEffect(() => {
    onLoad();
  }, []);
  
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
                className="d-inline-block align-top"
              />ClockIO         
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

// function App() {
//   return (
//     <div className="App container py-3">
//       <Navbar collapseOnSelect bg="light" expand="md" className="mb-3">
//         <Navbar.Brand href="/" className="font-weight-bold text-muted">
//         <img
//               alt=""
//               src="/logo.png"
//               width="30"
//               height="30"
//               className="d-inline-block align-top"
//             />{' '}
//           ClockIO
//         </Navbar.Brand>
//         <Navbar.Toggle />
//         <Navbar.Collapse id="basic-navbar-nav">
//     </Navbar.Collapse>
//         <Navbar.Collapse className="justify-content-end">
//           <Nav>
//             <Nav.Link href="/">Home</Nav.Link>
//             <Nav.Link href="/checkin">Check-in</Nav.Link>
//             <Nav.Link href="/records">Records</Nav.Link>
//             <Nav.Link href="/signup">Signup</Nav.Link>
//             <Nav.Link href="/login">Login</Nav.Link>
//           </Nav>
//           </Navbar.Collapse>

//       </Navbar>
//       <Routes>
//         <Route path="/" element={<Home />} />
//       </Routes>
//     </div>
//   );
// }

export default App;
