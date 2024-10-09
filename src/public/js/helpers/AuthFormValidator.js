class AuthFormValidator {
  static regexPatterns = {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    password:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
    username: /^[a-zA-Z0-9_.-]{6,15}$/,
  };

  static errorMessages = {
    emailFormat: 'Invalid email format!',
    emailRequired: 'Email is required!',
    passwordFormat:
      'Password must be 8 to 20 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character (e.g., @, $, !, %, *, ?).',
    passwordMismatch: 'Passwords do not match!',
    passwordRequired: 'Password is required!',
    repeatPasswordRequired: 'Please repeat your password!',
    usernameFormat:
      'Username must be 6 to 15 characters long and can include letters, numbers, dots, dashes, or underscores!',
    usernameRequired: 'Username is required!',
  };

  static resetErrorMessages(form) {
    const infoElements = form.querySelectorAll('.auth-input__info');
    infoElements.forEach((info) => {
      info.style.display = 'none';
      info.textContent = '';
      info.previousElementSibling.classList.remove('auth-input__input--error'); 
    });
  }

  static validateField(field, regex, errorMsg) {
    if (!field.value) {
      field.nextElementSibling.textContent = errorMsg.required;
      field.nextElementSibling.style.display = 'block';
      field.classList.add('auth-input__input--error');
      return false;
    } else if (!regex.test(field.value.trim())) {
      field.nextElementSibling.textContent = errorMsg.invalid;
      field.nextElementSibling.style.display = 'block';
      field.classList.add('auth-input__input--error');
      return false;
    }
    field.classList.remove('auth-input__input--error');
    return true;
  }

  static validateRepeatPassword(password, repeatPassword) {
    if (!repeatPassword.value) {
      repeatPassword.nextElementSibling.textContent =
        AuthFormValidator.errorMessages.repeatPasswordRequired;
      repeatPassword.nextElementSibling.style.display = 'block';
      repeatPassword.classList.add('auth-input__input--error');
      return false;
    } else if (password.value.trim() !== repeatPassword.value.trim()) {
      repeatPassword.nextElementSibling.textContent =
        AuthFormValidator.errorMessages.passwordMismatch;
      repeatPassword.nextElementSibling.style.display = 'block';
      repeatPassword.classList.add('auth-input__input--error');
      return false;
    }
    repeatPassword.classList.remove('auth-input__input--error');
    return true;
  }
}

export default AuthFormValidator;
