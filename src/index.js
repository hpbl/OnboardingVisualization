// Get the input field
const repoInput = document.getElementById('repo');
const usernameInput = document.getElementById('username');

// Execute a function when the user releases a key on the keyboard
repoInput.addEventListener('keyup', (event) => {
  // Cancel the default action, if needed
  event.preventDefault();
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Trigger the button element with a click
    const repo = repoInput.value;
    const username = usernameInput.value;


    window.location.href = `visualizations.html?user=${username}&repo=${repo}`;
  }
});
