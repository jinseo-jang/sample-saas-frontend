import React, { useState } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
import { useAppContext } from "../lib/contextLib";
import { useFormFields } from "../lib/hooksLib";
import { onError } from "../lib/errorLib";
import "./Signup.css";
import { Auth } from "aws-amplify";
import config from '../config';

export default function Signup() {
  const [fields, handleFieldChange] = useFormFields({
    company: "",
    role: "",
    email: "",
    password: "",
    confirmPassword: "",
    confirmationCode: "",
  });
  const nav = useNavigate();
  const [newUser, setNewUser] = useState(null);
  const { userHasAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  // const tenantIdentifier = config.cognito.USER_POOL_ID;
  const tenantIdentifier = 'TENANT'+config.cognito.USER_POOL_ID.split('_')[1];

  

  function validateForm() {
    return (
      fields.company.length > 0 &&
      fields.role.length > 0 &&
      fields.email.length > 0 &&
      fields.password.length > 0 &&
      fields.password === fields.confirmPassword
    );
  }

  function validateConfirmationForm() {
    return fields.confirmationCode.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    try {
      console.log("Submitting tenant id",tenantIdentifier)
      const newUser = await Auth.signUp({
        username: fields.email,
        password: fields.password,
        attributes: {
          'custom:company_name': fields.company,
          'custom:tenant_id': tenantIdentifier,
          'custom:user_role': fields.role
        }
      });
      setIsLoading(false);
      setNewUser(newUser);
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }
  
  async function createUserInDatabase(user, idToken) {
    const apiUrl = "https://localhost:5000/api/users"

    const data = {
      company: user.company,
      role: user.role,
      user_name: user.user_name,
      tenant_id: user.tenant_id,
    };

    console.log("Passed data:", data)

    try {
      // temporal logic to test
      const response="good"
      // The below is intended code for the future when /users api is created
      // const response = await axios.post(apiUrl, data, {
      //   headers: {
      //     Authorization: `Bearer ${idToken}`,
      //   }
      // });
      console.log("User data created successfully:", response);
    }catch (error) {
      console.log("Error creating user data:", error);
    }

  }

  async function handleConfirmationSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    try {
      await Auth.confirmSignUp(fields.email, fields.confirmationCode);
      await Auth.signIn(fields.email, fields.password);

      const session = await Auth.currentSession();
      const idToken = session.getIdToken().getJwtToken();
      console.log("ID Token:", idToken);

      //create a new user data in database
      const user = {
        company: fields.company,
        role: fields.role,
        user_name: fields.email,
        tenant_id: tenantIdentifier,
      };

      await createUserInDatabase(user, idToken);

      userHasAuthenticated(true);
      nav("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function renderConfirmationForm() {
    return (
      <Form onSubmit={handleConfirmationSubmit}>
        <Form.Group controlId="confirmationCode" size="lg">
          <Form.Label>Confirmation Code</Form.Label>
          <Form.Control
            autoFocus
            type="tel"
            onChange={handleFieldChange}
            value={fields.confirmationCode}
          />
          <Form.Text muted>Please check your email for the code.</Form.Text>
        </Form.Group>
        <LoaderButton
          block="true"
          size="lg"
          type="submit"
          variant="success"
          isLoading={isLoading}
          disabled={!validateConfirmationForm()}
        >
          Verify
        </LoaderButton>
      </Form>
    );
  }

  function renderForm() {
    return (
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="company" size="lg">
          <Form.Label>Company</Form.Label>
          <Form.Control
            autoFocus
            type="company"
            value={fields.company}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="role" size="lg">
        <Form.Label>Role</Form.Label>
        <Form.Select
          autoFocus
          value={fields.role}
          onChange={handleFieldChange}
        >
          <option value="">Select a role</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="staff">Staff</option>
        </Form.Select>
      </Form.Group>
        <Form.Group controlId="email" size="lg">
          <Form.Label>Email</Form.Label>
          <Form.Control
            autoFocus
            type="email"
            value={fields.email}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="password" size="lg">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={fields.password}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="confirmPassword" size="lg">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            onChange={handleFieldChange}
            value={fields.confirmPassword}
          />
        </Form.Group>
        <LoaderButton
          block="true"
          size="lg"
          type="submit"
          variant="success"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Signup
        </LoaderButton>
      </Form>
    );
  }

  return (
    <div className="Signup">
      {newUser === null ? renderForm() : renderConfirmationForm()}
    </div>
  );
}