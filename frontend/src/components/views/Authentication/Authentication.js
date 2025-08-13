import './Authentication.css';

import { setUserData } from "../../../utils/localStorage.js";

const Authentication = () => {
  const container = document.createElement('div');
  container.classList.add('auth-container');

  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (email && password) {
      setUserData({ email });
      window.location.hash = '#/clients';
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (email && password && password === confirmPassword) {
      setUserData({ email });
      window.location.hash = '#/clients';
    } else {
      alert("Passwords do not match");
    }
  };

  container.innerHTML = `
    <div class="form-container sign-in-container">
      <form id="login-form">
        <h1>Sign in</h1>
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />
        <a href="#">Forgot your password?</a>
        <button type="submit">Sign In</button>
      </form>
    </div>
    <div class="form-container sign-up-container" style="display:none;">
      <form id="register-form">
        <h1>Create Account</h1>
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" required />
        <button type="submit">Sign Up</button>
      </form>
    </div>
    <div class="overlay-container">
      <div class="overlay">
        <div class="overlay-panel">
          <h1>Welcome Back!</h1>
          <p>To keep connected with us please login with your personal info</p>
          <button class="ghost" id="signIn">Sign In</button>
        </div>
        <div class="overlay-panel overlay-right">
          <h1>Hello, Friend!</h1>
          <p>Enter your personal details and start journey with us</p>
          <button class="ghost" id="signUp">Sign Up</button>
        </div>
      </div>
    </div>
  `;

  const signUpButton = container.querySelector('#signUp');
  const signInButton = container.querySelector('#signIn');
  const loginForm = container.querySelector('#login-form');
  const registerForm = container.querySelector('#register-form');
  const signInContainer = container.querySelector('.sign-in-container');
  const signUpContainer = container.querySelector('.sign-up-container');

  signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
    signInContainer.style.display = 'none';
    signUpContainer.style.display = 'block';
  });

  signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
    signInContainer.style.display = 'block';
    signUpContainer.style.display = 'none';
  });

  loginForm.addEventListener('submit', handleLogin);
  registerForm.addEventListener('submit', handleRegister);

  return container;
};

export default Authentication;
