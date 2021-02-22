const maxQuestions = 10
const questionTime = 1000

let questions
let currentQuestion = 0
let timerID
let time
let correctChoice

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
    const container = document.getElementById('container')
    container.innerHTML = `
        <div id="quiz">
            <div id="questionDiv">
                <h1>Loading!</h1>
            </div>
        </div
    `
}

function initListeners(){
    const choices = document.getElementById("choices")
    
    for(let choice of choices.children){
        if(choice.innerHTML === questions[currentQuestion].correct_answer){
            correctChoice = choice
        }
        choice.addEventListener('click', (e) =>{
            if(e.target.innerHTML === questions[currentQuestion].correct_answer){
                choice.classList.add('correct')
            }
            else{
                for(let schoice of choices.children){
                    if(schoice.innerHTML === questions[currentQuestion].correct_answer){
                        schoice.classList.add('correct')
                    }
                }
                console.log(questions[currentQuestion].correct_answer)
                choice.classList.add('wrong')
            }

            if(currentQuestion !== maxQuestions){
                nextQuestion()
            }
            
        })
    }
}

function nextQuestion(){
    clearInterval(timerID)
    setTimeout(()=>{
        startTimer()
        currentQuestion++
        showQuestion()
    },1000)
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

function showQuestion(){
    const choices = document.getElementById("choices")

    for(let choice of choices.children){
        choice.classList.remove('correct')
        choice.classList.remove('wrong')
    }
    
    if(currentQuestion === maxQuestions){
        clearInterval(timerID)
        console.log("finished")
        showEnding()
        return
    }
    const questionH1 = document.getElementById("question") 
    console.log(questions[currentQuestion].correct_answer)
    questionH1.innerHTML = questions[currentQuestion].question
    for(let choice of choices.children){
        choice.innerHTML = questions[currentQuestion].choices[[...choices.children].indexOf(choice)]
    }
}

function showEnding(){
    const container = document.getElementById('container')
    container.innerHTML = `
        <div id="quiz">
            <div id="questionDiv">
                <h1>Finished!</h1>
            </div>
            <div id="choicesDiv">
                <ul id="choices">
                    
                </ul>
            </div>
        </div
    `
}

function startGame(){
    const container = document.getElementById('container')
    container.innerHTML = `
        <div id="quiz">
            <div id="questionDiv">
                <h1 id="question">Question</h1>
            </div>
            <div id="choicesDiv">
                <ul id="choices">
                    <li>choice 1</li>
                    <li>choice 2</li>
                    <li>choice 3</li>
                    <li>choice 3</li>
                </ul>
            </div>
        </div>
    `
    
    initListeners()
    startTimer()
    showQuestion()
}

function startTimer(){
    time = questionTime
    timerID = setInterval(()=>{
        if(time!==0){
            time--
        }
        else{
            if(currentQuestion !== maxQuestions){
                nextQuestion()
            }
        }
    },1000)
}


    

