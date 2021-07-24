import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';

export const RegisterForm = ({onClickSubmit}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const submit = e => {
    e.preventDefault();

    Meteor.call('createuser', username, password);
    Meteor.loginWithPassword(username, password);
    onClickSubmit();
  };

  return (
    <>
    <form onSubmit={submit} className="login-form">
    <h1>Register Form</h1>
      <label htmlFor="username">Username</label>
      <input
        type="text"
        placeholder="Username"
        name="username"
        required
        onChange={e => setUsername(e.target.value)}
      />

      <label htmlFor="password">Password</label>

      <input
        type="password"
        placeholder="Password"
        name="password"
        required
        onChange={e => setPassword(e.target.value)}
      />

      <button type="submit">Log In</button>
    </form>
    <div>
    </div>
    </>
  );
};