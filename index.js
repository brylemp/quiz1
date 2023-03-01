function shuffleArray(array) {
  const newArray = [];
  const arrayLength = array.length;
  for (let i = 0; i < arrayLength; i += 1) {
    const rand = Math.floor(Math.random() * array.length);
    const temp = array.splice(rand, 1);
    newArray.push(temp[0]);
  }
  return newArray;
}

// Difficulty: easy, medium, hard

class Quiz {
  constructor({ maxQuestions = 10, difficulty = 'easy', seconds = 10 }) {
    this.difficulty = difficulty;
    this.maxQuestions = maxQuestions;
    this.timePerQuestion = seconds * 1000; // In milliseconds
    this.progress = 0;
    this.questionNumber = 0;
    this.score = 0;
    this.container = document.getElementById('container');
  }

  async startGame() {
    this.renderLoading();
    this.questions = await this.getQuestions();
    this.container.innerHTML = `
            <div id="quiz">
                <div id="progressBar"></div>
                <div id="scoreDiv">
                    <h2 id="score">${this.score}/${this.questionNumber}</h2>
                </div>
                <div id="questionDiv">
                    <h1 id="question">Question</h1>
                </div>
                <div id="choicesDiv">
                    <button class="btn">choice1</button>
                    <button class="btn">choice2</button>
                    <button class="btn">choice3</button>
                    <button class="btn">choice4</button>
                </div>
            </div>
        `;

    this.progressElement = document.getElementById('progressBar');
    this.choicesElement = document.getElementById('choicesDiv');
    this.scoreElement = document.getElementById('score');
    this.currentQuestion = this.questions[this.questionNumber];

    this.initChoiceListeners();
    this.startTimer();
    this.renderQuestion();
  }

  async getQuestions() {
    const url = `https://opentdb.com/api.php?amount=${this.maxQuestions}&category=9&difficulty=${this.difficulty}&type=multiple`;
    const response = await fetch(url);
    const res = await response.json();
    for (const question of res.results) {
      question.choices = shuffleArray(question.incorrect_answers.concat(question.correct_answer));
    }

    return res.results;
  }

  clickChoice(choice) {
    return (e) => {
      this.stopTimer();

      const correctAnswer = this.currentQuestion.correct_answer;
      const chosenAnswer = e.target.innerHTML;

      choice.classList.add('selected');

      if (chosenAnswer === correctAnswer) {
        this.score += 1;
        this.scoreElement.innerHTML = `${this.score}/${this.questionNumber}`;
        choice.classList.add('correct');
      } else {
        for (const schoice of this.choicesElement.children) {
          if (schoice.innerHTML === correctAnswer) {
            schoice.classList.add('correct');
          }
        }
        choice.classList.add('wrong');
      }

      if (this.questionNumber !== this.maxQuestions) {
        this.nextQuestion();
      }
    };
  }

  initChoiceListeners() {
    for (const choice of this.choicesElement.children) {
      choice.addEventListener('click', this.clickChoice(choice));
    }
  }

  disableChoices(disable) {
    for (const choice of this.choicesElement.children) {
      choice.disabled = disable;
    }
  }

  resetChoices() {
    for (const choice of this.choicesElement.children) {
      choice.classList.remove('correct');
      choice.classList.remove('wrong');
      choice.classList.remove('selected');
    }
  }

  nextQuestion() {
    this.stopTimer();
    setTimeout(() => {
      this.resetChoices();
      this.progressElement.style.width = '0%';
      this.progress = 0;
      this.disableChoices(false);
      this.startTimer();
      this.questionNumber += 1;
      this.currentQuestion = this.questions[this.questionNumber];
      this.scoreElement.innerHTML = `${this.score}/${this.questionNumber}`;
      this.renderQuestion();
    }, 1000);
  }

  renderQuestion() {
    if (this.questionNumber === this.maxQuestions) {
      this.stopTimer();
      this.renderEnding();
      return;
    }

    const questionElement = document.getElementById('question');
    questionElement.innerHTML = this.currentQuestion.question;

    for (const [i, choice] of [...this.choicesElement.children].entries()) {
      choice.innerHTML = this.currentQuestion.choices[i];
    }
  }

  renderLoading() {
    this.container.innerHTML = `
            <div id="quiz">
                <div id="loadingDiv">
                    <h1>Loading!</h1>
                </div>
            </div
        `;
  }

  renderEnding() {
    this.container.innerHTML = `
            <div id="quiz">
                <div id="endingDiv">
                    <h1>Finished! You scored: ${this.score}/${this.questionNumber}</h1>
                </div>
            </div
        `;
  }

  startTimer() {
    const increment = (10000 / this.timePerQuestion);
    let time = this.timePerQuestion;

    this.timerID = setInterval(() => {
      if (time === 0) {
        for (const choice of this.choicesElement.children) {
          if (choice.innerHTML === this.currentQuestion.correct_answer) {
            choice.classList.add('correct');
          }
        }

        this.nextQuestion();
        return;
      }

      this.progressElement.style.transitionDuration = '100ms';
      this.progress += increment;
      this.progressElement.style.width = `${this.progress}%`;
      time -= 100;
    }, 100);
  }

  stopTimer() {
    clearInterval(this.timerID);
    this.progressElement.style.transitionDuration = '0s';
    this.disableChoices(true);
  }
}

const options = {
  maxQuestions: 5,
  difficulty: 'medium',
  seconds: 5,
};

const q = new Quiz(options);
q.startGame();
