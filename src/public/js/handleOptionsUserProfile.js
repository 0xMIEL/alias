document.addEventListener('DOMContentLoaded', function () {
    const optionsModal = document.getElementById('optionsModal');
    const openOptionsButton = document.getElementById('openOptionsBtn');
    const closeButton = optionsModal.querySelector('.close');

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
});
