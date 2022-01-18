import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';

const Login = (props) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" })
  let history = useHistory();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: credentials.email, password: credentials.password }),
      }
    );
    const json = await response.json();
    console.log(json);
    if (json.success) {
      // redirect
      localStorage.setItem('token', json.authtoken);
      props.showAlert("Logged in successfully", "success");
      history.push("/");
    }
    else {
      props.showAlert("Invalid details", "danger");
    }
  }
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }
  return (
    <>
      <h2 className="my-2 text-center">Login to continue with iNotebook</h2>
    <div className="mt-5 d-flex justify-content-center ">
    <form style={{width: '500px'}} onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" className="form-control" value={credentials.email} id="email" name="email" aria-describedby="emailHelp" onChange={onChange} />
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" value={credentials.password} id="password" name="password" onChange={onChange} />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
    </>
  )
}

export default Login
