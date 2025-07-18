import React from 'react';
<<<<<<< HEAD
=======
import '../style/login.css'; // Assuming you have a CSS file for styling
>>>>>>> b7124f64cb0ba1e71f7c2472a0e719b93945a522
export default function Login() {
    
  return (
    <div className="login-container">
      <h1>Login</h1>
      <form>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button className='button-login' type="submit">Login</button>
      </form>
    </div>
  );
}