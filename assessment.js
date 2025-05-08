document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('currentUser')) {
        showNotification('Please log in first', true);
        setTimeout(() => window.location.href = 'index.html', 1000);
        return;
    }

    const assessmentQuestions = {
        reading: [
            "Has difficulty recognizing letters and their corresponding sounds",
            "Struggles to sound out unfamiliar words",
            "Reading is slow and laborious compared to peers",
            "Often skips or adds words when reading aloud",
            "Has trouble understanding what was just read",
            "Avoids reading activities whenever possible",
            "Has difficulty remembering common sight words",
            "Confuses similar-looking letters (e.g., b/d, p/q)",
            "Loses place when reading or needs finger to track",
            "Reading skills are significantly below grade level expectations"
        ],
        writing: [
            "Has irregular or poor handwriting",
            "Struggles with proper spacing between letters and words",
            "Has difficulty organizing thoughts in writing",
            "Makes frequent spelling errors, even with common words",
            "Holds pencil awkwardly or applies too much/little pressure",
            "Written work has inconsistent grammar or punctuation",
            "Avoids writing tasks or becomes frustrated when writing",
            "Written expression is significantly below oral expression abilities",
            "Has trouble copying from the board or another paper",
            "Takes unusually long time to complete written assignments"
        ],
        math: [
            "Has difficulty learning to count or recognize number patterns",
            "Struggles to memorize basic math facts (e.g., multiplication tables)",
            "Has trouble understanding math symbols (+, -, ×, ÷)",
            "Finds it hard to align numbers when solving multi-digit problems",
            "Has difficulty understanding math concepts (e.g., place value)",
            "Makes calculation errors, even with a calculator",
            "Has trouble with word problems or math reasoning",
            "Has difficulty telling time or understanding time concepts",
            "Struggles with spatial concepts and geometry",
            "Math skills are significantly below grade level expectations"
        ]
    };

    let currentCategory = 'reading';
    let currentQuestionIndex = 0;
    const totalQuestions = 30;
    // Reset responses when starting a new quiz session
    let responses = { reading: Array(10).fill(null), writing: Array(10).fill(null), math: Array(10).fill(null) };
    localStorage.setItem('assessmentResponses', JSON.stringify(responses));

    const questionsContainer = document.getElementById('questions-container');
    const categoryTitle = document.getElementById('category-title');
    const progressText = document.getElementById('progress-text');
    const progressBar = document.getElementById('progress-bar');
    const prevButton = document.getElementById('prev-question');
    const nextButton = document.getElementById('next-question');

    prevButton.addEventListener('click', handlePrevQuestion);
    nextButton.addEventListener('click', handleNextQuestion);

    function displayCurrentQuestion() {
        categoryTitle.textContent = getCategoryTitle(currentCategory);
        const overallQuestionNumber = getOverallQuestionNumber();
        progressText.textContent = `Question ${overallQuestionNumber} of ${totalQuestions}`;
        progressBar.style.width = `${((overallQuestionNumber - 1) / totalQuestions) * 100}%`;

        const currentQuestion = assessmentQuestions[currentCategory][currentQuestionIndex];
        questionsContainer.innerHTML = `
            <div class="question-item">
                <p>${currentQuestion}</p>
                <div class="likert-scale">
                    <div class="likert-option">
                        <input type="radio" id="option1" name="q${overallQuestionNumber}" value="1" ${getSelectedValue() === 1 ? 'checked' : ''}>
                        <label for="option1">Never</label>
                    </div>
                    <div class="likert-option">
                        <input type="radio" id="option2" name="q${overallQuestionNumber}" value="2" ${getSelectedValue() === 2 ? 'checked' : ''}>
                        <label for="option2">Rarely</label>
                    </div>
                    <div class="likert-option">
                        <input type="radio" id="option3" name="q${overallQuestionNumber}" value="3" ${getSelectedValue() === 3 ? 'checked' : ''}>
                        <label for="option3">Sometimes</label>
                    </div>
                    <div class="likert-option">
                        <input type="radio" id="option4" name="q${overallQuestionNumber}" value="4" ${getSelectedValue() === 4 ? 'checked' : ''}>
                        <label for="option4">Often</label>
                    </div>
                    <div class="likert-option">
                        <input type="radio" id="option5" name="q${overallQuestionNumber}" value="5" ${getSelectedValue() === 5 ? 'checked' : ''}>
                        <label for="option5">Always</label>
                    </div>
                </div>
            </div>
        `;

        const radios = document.querySelectorAll(`input[name="q${overallQuestionNumber}"]`);
        radios.forEach(radio => {
            radio.addEventListener('change', () => {
                responses[currentCategory][currentQuestionIndex] = parseInt(radio.value);
                localStorage.setItem('assessmentResponses', JSON.stringify(responses));
            });
        });

        prevButton.style.display = currentCategory === 'reading' && currentQuestionIndex === 0 ? 'none' : 'inline-block';
        nextButton.textContent = currentCategory === 'math' && currentQuestionIndex === assessmentQuestions.math.length - 1 ? 'View Results' : 'Next';
    }

    function getCategoryTitle(category) {
        return { reading: 'Reading Skills', writing: 'Writing Skills', math: 'Math Skills' }[category];
    }

    function getOverallQuestionNumber() {
        let questionNumber = currentQuestionIndex + 1;
        if (currentCategory === 'writing') questionNumber += assessmentQuestions.reading.length;
        else if (currentCategory === 'math') questionNumber += assessmentQuestions.reading.length + assessmentQuestions.writing.length;
        return questionNumber;
    }

    function getSelectedValue() {
        return responses[currentCategory][currentQuestionIndex] || null;
    }

    function handleNextQuestion() {
        const selectedOption = document.querySelector('input[name^="q"]:checked');
        if (!selectedOption && currentQuestionIndex < assessmentQuestions[currentCategory].length - 1) {
            showNotification('Please select an option', true);
            return;
        }
        if (selectedOption) {
            responses[currentCategory][currentQuestionIndex] = parseInt(selectedOption.value);
        }

        if (currentQuestionIndex < assessmentQuestions[currentCategory].length - 1) {
            currentQuestionIndex++;
        } else if (currentCategory === 'reading') {
            currentCategory = 'writing';
            currentQuestionIndex = 0;
        } else if (currentCategory === 'writing') {
            currentCategory = 'math';
            currentQuestionIndex = 0;
        } else {
            localStorage.setItem('assessmentResponses', JSON.stringify(responses));
            window.location.href = 'results.html';
            return;
        }
        displayCurrentQuestion();
    }

    function handlePrevQuestion() {
        const selectedOption = document.querySelector('input[name^="q"]:checked');
        if (selectedOption) responses[currentCategory][currentQuestionIndex] = parseInt(selectedOption.value);

        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
        } else if (currentCategory === 'writing') {
            currentCategory = 'reading';
            currentQuestionIndex = assessmentQuestions.reading.length - 1;
        } else if (currentCategory === 'math') {
            currentCategory = 'writing';
            currentQuestionIndex = assessmentQuestions.writing.length - 1;
        }
        displayCurrentQuestion();
    }

    displayCurrentQuestion();
});
