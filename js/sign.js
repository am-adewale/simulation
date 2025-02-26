// Select the login form and elements
const loginForm = document.getElementById('login-form');
const loginBtn = document.getElementById('login-btn');

// Handle login form submission
loginForm.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent the form from submitting normally

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  // Simple validation for empty fields (you can add more logic for actual validation)
  if (email && password) {
    // You can add logic here for real credential checking if needed (like API calls)

    // For now, we'll just simulate a successful login if both fields are filled
    console.log("Login successful");

    // Redirect to index.html page after successful login
    window.location.href = "index.html"; // This will take the user to 'index.html'
  } else {
    alert("Please enter valid credentials.");
  }
});
