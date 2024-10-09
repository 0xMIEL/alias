import { apiRequestErrorCatch } from './api/apiUtils.js';
import { logoutUser } from './api/userProfileApi.js';

document.addEventListener('DOMContentLoaded', function () {
  const optionsModal = document.getElementById('optionsModal');
  const openOptionsButton = document.getElementById('openOptionsBtn');
  const closeButton = optionsModal.querySelector('.close');
  const logoutButton = document.getElementById('logoutButton');

  openOptionsButton.addEventListener('click', function () {
    optionsModal.style.display = 'block';
  });

  closeButton.addEventListener('click', function () {
    optionsModal.style.display = 'none';
  });

    window.addEventListener('click', function (event) {
        if (event.target === optionsModal) {
            optionsModal.style.display = 'none';
        }
    });
  
    if (logoutButton) {
        logoutButton.addEventListener('click', apiRequestErrorCatch(async function () {
            try {
                await logoutUser();
                window.location.href = '/';
            } catch {
                alert('Logout failed. Please try again.');
            }
        }));
    }
});
