/* eslint-disable */
import AuthFormValidator from '../helpers/AuthFormValidator.js';

const authForm = document.querySelector('.auth-form');
authForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  AuthFormValidator.resetErrorMessages(authForm);

  let isValid = true;
  window.history.replaceState(null, null, '/');
  const email = authForm.querySelector('#email');
  const password = authForm.querySelector('#password');

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

  if (isValid) {
    const formData = {
      email: email.value.trim(),
      password: password.value.trim(),
    };

    try {
      const response = await axios.post('/api/v1/users/login', formData);
      console.log(response.data);
      authForm.reset();
      window.history.replaceState(null, null, '/');
      window.location.href = '/';
    } catch (error) {
      console.log(error);
    }
  }
});
