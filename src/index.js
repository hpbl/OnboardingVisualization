import 'babel-polyfill';

import { isValidRepo } from './providers/dataProvider';

// Get the input field
const repoInput = document.getElementById('repo');
const usernameInput = document.getElementById('username');


async function checkValidRepo(username, repo) {
  const validRepo = await isValidRepo(username, repo);
  if (validRepo) {
    window.location.href = `visualizations.html?user=${username}&repo=${repo}`;
  } else {
    document.getElementById('errorMessage').style.display = 'block';
  }
}

// Execute a function when the user releases a key on the keyboard
repoInput.addEventListener('keyup', (event) => {
  // Cancel the default action, if needed
  event.preventDefault();
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Trigger the button element with a click
    const repo = repoInput.value;
    const username = usernameInput.value;

    checkValidRepo(username, repo);
  }
});
