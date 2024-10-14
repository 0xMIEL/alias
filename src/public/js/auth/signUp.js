/* eslint-disable */
import AuthFormValidator from '../helpers/AuthFormValidator.js';

const authForm = document.querySelector('.auth-form');
authForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  AuthFormValidator.resetErrorMessages(authForm);

  let isValid = true;

  const username = authForm.querySelector('#username');
  const email = authForm.querySelector('#email');
  const password = authForm.querySelector('#password');
  const repeatPassword = authForm.querySelector('#repeatPassword');

  isValid &= AuthFormValidator.validateField(
    username,
    AuthFormValidator.regexPatterns.username,
    {
      invalid: AuthFormValidator.errorMessages.usernameFormat,
      required: AuthFormValidator.errorMessages.usernameRequired,
    },
  );
  isValid &= AuthFormValidator.validateField(
    email,
    AuthFormValidator.regexPatterns.email,
    {
      invalid: AuthFormValidator.errorMessages.emailFormat,
      required: AuthFormValidator.errorMessages.emailRequired,
    },
  );
  isValid &= AuthFormValidator.validateField(
    password,
    AuthFormValidator.regexPatterns.password,
    {
      invalid: AuthFormValidator.errorMessages.passwordFormat,
      required: AuthFormValidator.errorMessages.passwordRequired,
    },
  );

  isValid &= AuthFormValidator.validateRepeatPassword(password, repeatPassword);

  if (isValid) {
    const formData = {
      email: email.value.trim(),
      password: password.value.trim(),
      username: username.value.trim(),
    };

    try {
      await axios.post('/api/v1/users/register', formData);
      authForm.reset();
      window.history.replaceState(null, null, '/');
      window.location.href = '/';
    } catch (error) {
      console.log(error);
    }
  }
});
