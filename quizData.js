// This script should be added to a script tag or JS file in your project
// It builds the quiz dynamically based on the selected age group and includes 10 math and 10 writing questions

document.addEventListener('DOMContentLoaded', () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  if (!currentUser) {
    window.location.href = 'quiz.html';
    return;
  }

  const quizData = {
    "7-9": {
      math: [
        { question: "What is 5 + 2?", options: ["6", "7", "8"], correctAnswer: "7" },
        { question: "What is 8 - 3?", options: ["4", "5", "6"], correctAnswer: "5" },
        { question: "What is 4 × 2?", options: ["6", "8", "10"], correctAnswer: "8" },
        { question: "What is 9 ÷ 3?", options: ["2", "3", "4"], correctAnswer: "3" },
        { question: "What is 10 + 4?", options: ["14", "13", "15"], correctAnswer: "14" },
        { question: "What is 6 - 2?", options: ["4", "5", "3"], correctAnswer: "4" },
        { question: "What is 3 × 3?", options: ["6", "9", "12"], correctAnswer: "9" },
        { question: "What is 12 ÷ 4?", options: ["2", "3", "4"], correctAnswer: "3" },
        { question: "What is 7 + 5?", options: ["12", "11", "13"], correctAnswer: "12" },
        { question: "What is 15 - 5?", options: ["10", "11", "9"], correctAnswer: "10" }
      ],
      writing: [
        { question: "Write a sentence using the word 'fun'." },
        { question: "Describe your favorite toy." },
        { question: "What do you like to do on weekends?" },
        { question: "Write about your favorite food." },
        { question: "Who is your best friend and why?" },
        { question: "What is your favorite cartoon?" },
        { question: "Describe your school." },
        { question: "What do you want to be when you grow up?" },
        { question: "Write about your family." },
        { question: "What makes you happy?" }
      ]
    },
    "10-11": {
      math: [
        { question: "What is 12 + 13?", options: ["24", "25", "26"], correctAnswer: "25" },
        { question: "What is 20 - 9?", options: ["10", "11", "12"], correctAnswer: "11" },
        { question: "What is 7 × 5?", options: ["30", "35", "40"], correctAnswer: "35" },
        { question: "What is 36 ÷ 6?", options: ["6", "5", "7"], correctAnswer: "6" },
        { question: "What is 11 × 2?", options: ["22", "24", "26"], correctAnswer: "22" },
        { question: "What is 45 ÷ 5?", options: ["8", "9", "10"], correctAnswer: "9" },
        { question: "What is 18 + 7?", options: ["24", "25", "26"], correctAnswer: "25" },
        { question: "What is 16 - 6?", options: ["9", "10", "11"], correctAnswer: "10" },
        { question: "What is 8 × 4?", options: ["32", "34", "36"], correctAnswer: "32" },
        { question: "What is 40 ÷ 8?", options: ["4", "5", "6"], correctAnswer: "5" }
      ],
      writing: [
        { question: "Write a paragraph about your dream job." },
        { question: "Why is exercise important?" },
        { question: "What would you do if you were invisible for a day?" },
        { question: "Describe your favorite book or story." },
        { question: "What makes a good friend?" },
        { question: "What’s something you’ve learned this year?" },
        { question: "Describe your pet or a pet you want." },
        { question: "What would you do with a million dollars?" },
        { question: "What is your favorite holiday and why?" },
        { question: "Write a letter to your future self." }
      ]
    },
    "12-13": {
      math: [
        { question: "What is 25 + 17?", options: ["42", "43", "44"], correctAnswer: "42" },
        { question: "What is 81 ÷ 9?", options: ["8", "9", "10"], correctAnswer: "9" },
        { question: "What is 7 × 8?", options: ["54", "56", "58"], correctAnswer: "56" },
        { question: "What is 100 - 45?", options: ["54", "55", "56"], correctAnswer: "55" },
        { question: "What is 14 × 2?", options: ["28", "30", "32"], correctAnswer: "28" },
        { question: "What is 90 ÷ 10?", options: ["8", "9", "10"], correctAnswer: "9" },
        { question: "What is 33 + 29?", options: ["60", "61", "62"], correctAnswer: "62" },
        { question: "What is 64 ÷ 8?", options: ["7", "8", "9"], correctAnswer: "8" },
        { question: "What is 11 × 6?", options: ["66", "68", "70"], correctAnswer: "66" },
        { question: "What is 72 - 36?", options: ["34", "35", "36"], correctAnswer: "36" }
      ],
      writing: [
        { question: "Write an essay on the benefits of teamwork." },
        { question: "Describe a time you helped someone." },
        { question: "What would you invent to make life easier?" },
        { question: "What are the pros and cons of technology?" },
        { question: "What do you do when you're feeling stressed?" },
        { question: "Describe a place you want to visit." },
        { question: "What makes someone a hero?" },
        { question: "What is the most important lesson you’ve learned?" },
        { question: "If you could change one rule at school, what would it be?" },
        { question: "Write a review of your favorite movie or game." }
      ]
    },
    "14-15": {
      math: [
        { question: "Solve for x: 2x = 18", options: ["9", "10", "11"], correctAnswer: "9" },
        { question: "What is the square root of 81?", options: ["8", "9", "10"], correctAnswer: "9" },
        { question: "What is 13 × 4?", options: ["51", "52", "53"], correctAnswer: "52" },
        { question: "Solve: 3x + 5 = 20", options: ["4", "5", "6"], correctAnswer: "5" },
        { question: "What is 144 ÷ 12?", options: ["12", "13", "14"], correctAnswer: "12" },
        { question: "What is (5 + 3) × 2?", options: ["14", "16", "18"], correctAnswer: "16" },
        { question: "What is 100 - 33?", options: ["66", "67", "68"], correctAnswer: "67" },
        { question: "What is 2³ (2 to the power of 3)?", options: ["6", "8", "10"], correctAnswer: "8" },
        { question: "What is 49 ÷ 7?", options: ["6", "7", "8"], correctAnswer: "7" },
        { question: "What is 10²?", options: ["90", "100", "110"], correctAnswer: "100" }
      ],
      writing: [
        { question: "Write an article on the effects of social media." },
        { question: "Describe your career aspirations and why." },
        { question: "Discuss the role of youth in environmental protection." },
        { question: "Write about a time you overcame a challenge." },
        { question: "Is failure important for success? Why?" },
        { question: "What is the value of honesty in friendships?" },
        { question: "How can students manage stress effectively?" },
        { question: "Should mobile phones be allowed in school? Explain." },
        { question: "Describe a person who inspires you." },
        { question: "What does success mean to you?" }
      ]
    }
  };

  // Attach quizData to the window for use elsewhere if needed
  window.quizData = quizData;
});
