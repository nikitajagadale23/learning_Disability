document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
  
      // Check if credentials match a sample user (you can replace this with real authentication logic)
      if (email === "student@example.com" && password === "password123") {
        const user = { name: "Student", email: "student@example.com" };
        localStorage.setItem('currentUser', JSON.stringify(user));  // Store user info
        window.location.href = 'quiz.html';  // Redirect to quiz page
      } else {
        alert('Invalid credentials');
      }
    });
  });
  
