const maxQuestions = 10
const questionTime = 5
const constantStep = 1/questionTime

let progress = 0
let questions
let currentQuestion = 1
let timerID
let debounceID
let time
let score = 0

let container = document.getElementById('container')
let quizStyle
let choices
let scoreH2

loadGame()

fetch('https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple')
.then(response => response.json())
.then(response => {
    questions = response.results
    for(let question of questions){
        question.choices = shuffleArray(questions[questions.indexOf(question)].incorrect_answers.concat(questions[questions.indexOf(question)].correct_answer))
    }
    startGame()
})

function loadGame(){
    container.innerHTML = `
        <div id="quiz">
            <div id="questionDiv">
                <h1>Loading!</h1>
            </div>
        </div
    `
}

function clickChoice(choice){
    return (e) =>{
        const correctAnswer = questions[currentQuestion].correct_answer
        const chosenAnswer = e.target.innerHTML

        choice.classList.add('selected')

        if(chosenAnswer === correctAnswer){
            score++;
            scoreH2.innerHTML = `${score}/${currentQuestion}`
            choice.classList.add('correct')
        }
        else{
            for(let schoice of choices.children){
                if(schoice.innerHTML === correctAnswer){
                    schoice.classList.add('correct')
                }
            }
            choice.classList.add('wrong')
        }
    
        if(currentQuestion !== maxQuestions){
            nextQuestion()
        }
    }
}

function initChoiceListeners(){
    for(let choice of choices.children){
        choice.addEventListener('click',clickChoice(choice))
    }
}

function shuffleArray(array){
    let newArray = []
    const arrayLength = array.length
    for(let i=0; i<arrayLength; i++){
        const rand = Math.floor(Math.random()*array.length)
        const temp = array.splice(rand,1)
        newArray.push(temp[0])
    }
    return newArray
}

function disableButtons(disable){
    for(let choice of choices.children){
        choice.disabled = disable
    }
}

function nextQuestion(){
    clearInterval(timerID)
    quizStyle.setProperty('--transitionTime','0ms')
    disableButtons(true)
    setTimeout(()=>{
        quizStyle.setProperty('--progress', 0)
        progress = 0
        disableButtons(false)
        startTimer()
        currentQuestion++
        scoreH2.innerHTML = `${score}/${currentQuestion}`
        showQuestion()
    },1000)
}

function showQuestion(){
    const questionH1 = document.getElementById("question") 

    for(let choice of choices.children){
        choice.classList.remove('correct')
        choice.classList.remove('wrong')
        choice.classList.remove('selected')
    }
    
    if(currentQuestion === maxQuestions){
        clearInterval(timerID)
        console.log("finished")
        showEnding()
        return
    }
    
    console.log(questions[currentQuestion].correct_answer)
    questionH1.innerHTML = questions[currentQuestion].question
    
    for(let choice of choices.children){
        choice.innerHTML = questions[currentQuestion].choices[[...choices.children].indexOf(choice)]
    }
}

function showEnding(){
    container.innerHTML = `
        <div id="quiz">
            <div id="questionDiv">
                <h1>Finished!</h1>
            </div>
        </div
    `
}

function startGame(){
    container.innerHTML = `
        <div id="quiz">
            <div id="scoreDiv">
                <h2 id="score">${score}/${currentQuestion}</h2>
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
    `

    quizStyle = document.getElementById('quiz').style
    choices = document.getElementById("choicesDiv")
    scoreH2 = document.getElementById("score")

    initChoiceListeners()
    startTimer()
    showQuestion()
}

function startTimer(){
    time = questionTime
    timerID = setInterval(()=>{
        if(time!==0){
            progress = progress + constantStep
            quizStyle.setProperty('--transitionTime','1000ms')
            quizStyle.setProperty('--progress', progress )
            time--
        }
        else{
            if(currentQuestion !== maxQuestions){
                const choices = document.getElementById("choicesDiv")
                for(let schoice of choices.children){
                    if(schoice.innerHTML === questions[currentQuestion].correct_answer){
                        schoice.classList.add('correct')
                    }
                }
                nextQuestion()
            }
        }
    },1000)
}