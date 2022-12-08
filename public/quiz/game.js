const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const questionCounterText = document.getElementById('questionCounter');
const scoreText = document.getElementById('score');

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];


let questions = [];

fetch('questions.json')
    .then((res) => {
        return res.json();
    })
    .then((loadedQuestions) => {
        questions = loadedQuestions;
        startGame();
    })
    .catch((err) => {
        console.error(err);
    });

//CONSTANTS
const TIME_BONUS = 15;
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 10;
var WRONG = 0;

//TIMER
const startingMinutes  = 0.3;
var TIME = startingMinutes * 60;

const countdownEl = document.getElementById('countdown');

setInterval(updateCountdown, 1000);

function updateCountdown() {
  const minutes = Math.floor(TIME / 60);
  let seconds = TIME % 60;

  seconds = seconds < 10 ? '0' + seconds : seconds;

  countdownEl.innerHTML = `${minutes}:${seconds}`;
  TIME --;
}

function timeded() {
  if(TIME <= -1){
	localStorage.setItem('mostRecentScore', score);
    return window.location.assign("end.html");
  }
}

//NEEDEDTIMEFORQUESTION
var NEEDEDTIME = 0;
setInterval(updateNeededTime, 1000);

function updateNeededTime() {
  NEEDEDTIME ++;
}

function pls() {
  console.log(NEEDEDTIME);
}

setInterval(pls, 1000);

startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions];
  setInterval(timeded, 1000);
  getNewQuestion();
};

getNewQuestion = () => {

    if(availableQuestions.length == 0 || WRONG >= 3){
      localStorage.setItem('mostRecentScore', score);
      //go to end pages
      return window.location.assign("end.html");
    }

  questionCounter++;
  questionCounterText.innerText = questionCounter;

  const questionIndex = Math.floor(Math.random() *availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  question.innerText = currentQuestion.question;

  choices.forEach( choice => {
    const number = choice.dataset['number'];
    choice.innerText = currentQuestion['choice' + number];
  });

  availableQuestions.splice(questionIndex, 1);

  acceptingAnswers = true;
};

choices.forEach(choice => {
  choice.addEventListener('click', e => {
    if(!acceptingAnswers) return;

    acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedName = e.target.className;
    const str1 = "divs";
    const selectedAnswer = selectedChoice.dataset["number"];


    const classToApply =
      selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

      if(classToApply == "correct" && NEEDEDTIME < 5) {
        incrementScore(TIME_BONUS);
      }
      else if(classToApply == "correct") {
        incrementScore(CORRECT_BONUS);
      }

    var element = document.getElementsByClassName("choice-text")[currentQuestion.answer-1];
    var divs0 = document.getElementById("pink");
    var divs1 = document.getElementById("blue");
    var divs2 = document.getElementById("purple");
    var divs3 = document.getElementById("green");
    var divstwo = document.getElementsByClassName("choice-prefix");
    var two = document.getElementsByClassName("choice-prefix")[currentQuestion.answer-1];


    if(selectedAnswer != currentQuestion.answer) {
      WRONG ++;
      element.classList.add("correct");
      divs0.classList.add('newclass');
      divs1.classList.add('newclass');
      divs2.classList.add('newclass');
      divs3.classList.add('newclass');
      for (var i = 0; i < 4; i++){
        divstwo[i].classList.add('newclass');
      }
      element.parentElement.classList.remove('newclass');
      two.classList.remove('newclass');
    }

    selectedChoice.classList.add(classToApply);

    setTimeout( () => {
      selectedChoice.classList.remove(classToApply);
      element.classList.remove("correct");
      divs0.classList.remove('newclass');
      divs1.classList.remove('newclass');
      divs2.classList.remove('newclass');
      divs3.classList.remove('newclass');
      for (var i = 0; i < 4; i++){
        divstwo[i].classList.remove('newclass');
      }
      getNewQuestion();
      NEEDEDTIME = 0;
    }, 500);
  });
});

incrementScore = num => {
  score += num;
  scoreText.innerText = score;
}
