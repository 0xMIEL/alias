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
    logoutButton.addEventListener('click', function () {
        fetch('/api/v1/users/logout', {
            method: 'DELETE',
            credentials: 'include' 
        })
        .then(response => {
            if (response.ok) {
                window.location.href = '/'; 
            } else {
                alert('Logout failed. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        });
    });
}
});

