document.addEventListener('DOMContentLoaded', () => {
    // Retrieve the currentUser from localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  
    // If no currentUser is found, redirect to login page (index.html)
    if (!currentUser) {
      window.location.href = 'index.html';
      return;
    }
  
    const ageGroup = currentUser.ageGroup; // Get the age group of the current user
    if (!quizData[ageGroup]) {
      console.error('Quiz data for this age group is not available.');
      return;
    }
  
    const quiz = quizData[ageGroup]; // Retrieve the quiz data based on the age group
  
    // Function to build and render the quiz
    function renderQuiz(quizData) {
      const quizContainer = document.getElementById('quiz');
      let quizHTML = '';
  
      // Render math questions
      quizHTML += '<h3>Math Questions</h3>';
      quizData.math.forEach((question, index) => {
        quizHTML += `
          <div class="question-block">
            <p>${index + 1}. ${question.question}</p>
            ${question.options.map((option, i) => `
              <label>
                <input type="radio" name="math${index}" value="${option}"> ${option}
              </label><br>
            `).join('')}
          </div>
        `;
      });
  
      // Render writing questions
      quizHTML += '<h3>Writing Questions</h3>';
      quizData.writing.forEach((question, index) => {
        quizHTML += `
          <div class="question-block">
            <p>${index + 1}. ${question.question}</p>
            <textarea name="writing${index}" rows="4" placeholder="Write your answer here..."></textarea>
          </div>
        `;
      });
  
      quizContainer.innerHTML = quizHTML;
    }
  
    // Call the renderQuiz function to build and display the quiz
    renderQuiz(quiz);
  
    // Handle submit button click
    document.getElementById('submit-quiz').addEventListener('click', () => {
      let score = 0;
      let totalQuestions = quiz.math.length + quiz.writing.length;
  
      // Check Math Answers
      quiz.math.forEach((question, index) => {
        const selectedOption = document.querySelector(`input[name="math${index}"]:checked`);
        if (selectedOption && selectedOption.value === question.correctAnswer) {
          score++;
        }
      });
  
      // Check Writing Answers (optional: here we just check for non-empty answers)
      quiz.writing.forEach((question, index) => {
        const answer = document.querySelector(`textarea[name="writing${index}"]`).value.trim();
        if (answer.length > 0) {
          score++; // Consider this a correct answer for simplicity (you can adjust scoring logic)
        }
      });
  
      // Display the score
      alert(`Your score is: ${score} out of ${totalQuestions}`);
    });
  });
  
