// Quiz state variables
let currentQuestion = 0;
let score = 0;
let questions = [];
let userName = ''; // Variable to hold the user's name

// DOM elements
const questionElement = document.getElementById('question');
const choicesElement = document.getElementById('choices');
const submitButton = document.getElementById('submit');
const resultElement = document.getElementById('result');
const progressBarElement = document.getElementById('progress-bar');
const currentQuestionElement = document.getElementById('current-question');
const totalQuestionsElement = document.getElementById('total-questions');
const scoreElement = document.getElementById('score-value');

// Fetch questions from the API
async function fetchQuestions() {
    try {
        const response = await fetch('https://opentdb.com/api.php?amount=10&type=multiple');
        const data = await response.json();
        questions = data.results.map(q => ({
            question: q.question,
            choices: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5),
            correctAnswer: q.correct_answer
        }));
        totalQuestionsElement.textContent = questions.length;
        loadQuestion();
    } catch (error) {
        console.error('Error fetching questions:', error);
        questionElement.textContent = 'Error loading questions. Please try again later.';
    }
}

// Load a question
function loadQuestion() {
    const question = questions[currentQuestion];
    questionElement.innerHTML = question.question;
    choicesElement.innerHTML = '';
    question.choices.forEach((choice, index) => {
        const button = document.createElement('button');
        button.innerHTML = choice;
        button.addEventListener('click', () => selectChoice(button));
        choicesElement.appendChild(button);
    });
    submitButton.style.display = 'none';
    resultElement.textContent = '';
    currentQuestionElement.textContent = currentQuestion + 1;
    updateProgressBar();
}

// Handle choice selection
function selectChoice(selectedButton) {
    choicesElement.querySelectorAll('button').forEach(button => {
        button.classList.remove('selected');
    });
    selectedButton.classList.add('selected');
    submitButton.style.display = 'block';
}

// Check answer and move to next question
function submitAnswer() {
    const selectedButton = choicesElement.querySelector('.selected');
    if (!selectedButton) return;

    const selectedAnswer = selectedButton.textContent.trim();
    const question = questions[currentQuestion];
    
    if (selectedAnswer === question.correctAnswer) {
        score++;
        resultElement.textContent = 'Correct!';
        resultElement.style.color = 'green';
    } else {
        resultElement.textContent = `Incorrect. The correct answer was: ${question.correctAnswer}`;
        resultElement.style.color = 'red';
    }

    scoreElement.textContent = score;
    submitButton.style.display = 'none';
    
    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < questions.length) {
            loadQuestion();
        } else {
            finishQuiz();
        }
    }, 2000);
}

// Update progress bar
function updateProgressBar() {
    const progress = (currentQuestion / questions.length) * 100;
    progressBarElement.style.width = `${progress}%`;
}

// Finish the quiz
function finishQuiz() {
    questionElement.textContent = 'Quiz Completed!';
    choicesElement.innerHTML = '';
    resultElement.textContent = `${userName}, your final score is: ${score} out of ${questions.length}`;
    submitButton.style.display = 'none';
}

// Get user's name at the start of the quiz
function getUserName() {
    userName = prompt("Please enter your name:");
    if (!userName) {
        userName = "Guest"; // Default name if no input is given
    }
}

// Event listeners
submitButton.addEventListener('click', submitAnswer);

// Start the quiz
getUserName(); // Prompt for user name before fetching questions
fetchQuestions();
