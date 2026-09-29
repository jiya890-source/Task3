let questions = [];
let currentQuestion = 0;
let userAnswers = [];
let selectedLanguages = [];

const languagePage = document.getElementById("languagePage");
const assessmentPage = document.getElementById("assessmentPage");
const resultPage = document.getElementById("resultPage");

const startBtn = document.getElementById("startBtn");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const submitBtn = document.getElementById("submitBtn");
const retryBtn = document.getElementById("retryBtn");

const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("optionsContainer");
const questionNumber = document.getElementById("questionNumber");
const scoreDisplay = document.getElementById("scoreDisplay");
const progressBar = document.getElementById("progressBar");

const languageError = document.getElementById("languageError");
const answerError = document.getElementById("answerError");

const finalScore = document.getElementById("finalScore");
const resultMessage = document.getElementById("resultMessage");
const resumeSection = document.getElementById("resumeSection");


/* Start Assessment */

startBtn.addEventListener("click", async function () {

    const checkedLanguages =
        document.querySelectorAll(
            '.language-option input[type="checkbox"]:checked'
        );

    if (checkedLanguages.length === 0) {
        languageError.textContent =
            "Please select at least one programming language.";
        return;
    }

    languageError.textContent = "";

    selectedLanguages = Array.from(checkedLanguages).map(
        checkbox => checkbox.value
    );

    startBtn.textContent = "Loading...";
    startBtn.disabled = true;

    try {

        const response = await fetch("questions.json");

        if (!response.ok) {
            throw new Error("Could not load questions.");
        }

        const questionBank = await response.json();

        questions = [];

        selectedLanguages.forEach(language => {

            if (questionBank[language]) {

                questionBank[language].forEach(question => {
                    questions.push({
                        ...question,
                        language: language
                    });
                });

            }
        });

        if (questions.length === 0) {
            throw new Error("No questions available.");
        }

        userAnswers = new Array(questions.length).fill(null);
        currentQuestion = 0;

        languagePage.classList.add("hidden");
        assessmentPage.classList.remove("hidden");

        showQuestion();

    } catch (error) {

        languageError.textContent =
            "Unable to load questions. Please try again.";

    } finally {

        startBtn.textContent = "Start Assessment";
        startBtn.disabled = false;

    }
});


/* Show Question */

function showQuestion() {

    const question = questions[currentQuestion];

    questionNumber.textContent =
        `Question ${currentQuestion + 1} of ${questions.length}`;

    scoreDisplay.textContent =
        `Score: ${calculateCurrentScore()}`;

    questionText.textContent = question.question;

    optionsContainer.innerHTML = "";
    answerError.textContent = "";

    question.options.forEach((option, index) => {

        const label = document.createElement("label");
        label.className = "option";

        const input = document.createElement("input");

        input.type = "radio";
        input.name = "answer";
        input.value = index;

        if (userAnswers[currentQuestion] === index) {
            input.checked = true;
        }

        input.addEventListener("change", function () {
            userAnswers[currentQuestion] = index;
            scoreDisplay.textContent =
                `Score: ${calculateCurrentScore()}`;
        });

        label.appendChild(input);
        label.appendChild(
            document.createTextNode(" " + option)
        );

        optionsContainer.appendChild(label);
    });


    /* Progress */

    const progress =
        ((currentQuestion + 1) / questions.length) * 100;

    progressBar.style.width = progress + "%";


    /* Buttons */

    prevBtn.disabled = currentQuestion === 0;

    if (currentQuestion === questions.length - 1) {

        nextBtn.classList.add("hidden");
        submitBtn.classList.remove("hidden");

    } else {

        nextBtn.classList.remove("hidden");
        submitBtn.classList.add("hidden");

    }
}


/* Next Question */

nextBtn.addEventListener("click", function () {

    if (userAnswers[currentQuestion] === null) {

        answerError.textContent =
            "Please select an answer before continuing.";

        return;
    }

    answerError.textContent = "";

    if (currentQuestion < questions.length - 1) {

        currentQuestion++;
        showQuestion();

    }
});


/* Previous Question */

prevBtn.addEventListener("click", function () {

    if (currentQuestion > 0) {

        currentQuestion--;
        showQuestion();

    }
});


/* Submit Test */

submitBtn.addEventListener("click", function () {

    if (userAnswers[currentQuestion] === null) {

        answerError.textContent =
            "Please select an answer before submitting.";

        return;
    }

    calculateResult();

});


/* Calculate Score */

function calculateCurrentScore() {

    let score = 0;

    questions.forEach((question, index) => {

        if (userAnswers[index] === question.correctAnswer) {
            score++;
        }

    });

    return score;
}


/* Result */

function calculateResult() {

    const score = calculateCurrentScore();

    const percentage =
        Math.round((score / questions.length) * 100);

    assessmentPage.classList.add("hidden");
    resultPage.classList.remove("hidden");

    finalScore.textContent =
        `${score} / ${questions.length} (${percentage}%)`;

    if (percentage >= 70) {

        resultMessage.textContent =
            "Congratulations! You have qualified for the next stage.";

        resultMessage.style.color = "green";

        resumeSection.classList.remove("hidden");

    } else {

        resultMessage.textContent =
            "Your score is below the required threshold. Try again later.";

        resultMessage.style.color = "red";

        resumeSection.classList.add("hidden");

    }
}


/* Retry */

retryBtn.addEventListener("click", function () {

    resultPage.classList.add("hidden");
    languagePage.classList.remove("hidden");

    document.querySelectorAll(
        '.language-option input[type="checkbox"]'
    ).forEach(checkbox => {
        checkbox.checked = false;
    });

    questions = [];
    userAnswers = [];
    currentQuestion = 0;
    selectedLanguages = [];

    progressBar.style.width = "0%";

    languageError.textContent = "";
    answerError.textContent = "";

});


/* Resume File Validation */

const resumeForm = document.getElementById("resumeForm");
const resumeInput = document.getElementById("resume");
const fileError = document.getElementById("fileError");

resumeForm.addEventListener("submit", function (event) {

    const file = resumeInput.files[0];

    fileError.textContent = "";

    if (!file) {

        event.preventDefault();

        fileError.textContent =
            "Please select your resume.";

        return;
    }

    const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {

        event.preventDefault();

        fileError.textContent =
            "Only PDF, DOC and DOCX files are allowed.";

        return;
    }

    if (file.size > maxSize) {

        event.preventDefault();

        fileError.textContent =
            "Resume size must be less than 5 MB.";

        return;
    }

});