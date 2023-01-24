import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./containers/Home";
import Checkin from "./containers/Checkin";
import Records from "./containers/Records";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";

export default function Links() {
  return (
    <Routes>
      {/* <Route path="/" element={<Home />} />
      <Route path="/checkin" element={<Checkin />} />
      <Route path="/records" element={<Records />} />
      <Route path="/records/:userid" element={<UserRecords />} />
      <Route path="*" element={<NotFound />} />;
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} /> */}

      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />;
      <Route
        path="/login"
        element={
          <UnauthenticatedRoute>
            <Login />
          </UnauthenticatedRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <UnauthenticatedRoute>
            <Signup />
          </UnauthenticatedRoute>
        }
      />
      <Route
        path="/checkin"
        element={
          <AuthenticatedRoute>
            <Checkin />
          </AuthenticatedRoute>
        }
      />      
      <Route
        path="/records"
        element={
          <AuthenticatedRoute>
            <Records />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/records/:userid"
        element={
          <AuthenticatedRoute>
            <Records />
          </AuthenticatedRoute>
        }
      />
    </Routes>
  );
}
