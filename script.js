// Define the HTML elements
const gameBoard = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logoImg = document.getElementById('logo');
const score = document.getElementById("score");
const highScoreText = document.getElementById("highScore");

// Define game variables
const gridSize = 20;
let snake = [{x:10,y:10}];
let food = generateFood();
let direction = 'right';
let gameInterval ;
let gameSpeedDelay = 200;
let gameStarted = false;
let highScore=0;

//Draw game map and the food
function drawMap(){
gameBoard.innerHTML = '';
drawSnake();
drawFood();
updateScore(); 
}

function drawSnake(){
snake.forEach((segment) =>{
    const snakeElement = createGameElement('div','snake');
    setPosition(snakeElement,segment);
    gameBoard.appendChild(snakeElement)
})
}

// Create snake or food cube div
function createGameElement(tag,className){
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

// Set the postion of snake or food
function setPosition(element,position){
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

//Testing
//drawMap();

// draw food element 
function drawFood(){
    
    if(gameStarted){
    const foodElement = createGameElement("div","food");
    setPosition(foodElement,food);
    gameBoard.appendChild(foodElement);
    }
    
}

// generate food function
function generateFood(){
    const x = 1 + Math.floor(Math.random() * gridSize);
    const y = 1 + Math.floor(Math.random() * gridSize);
    return {x,y};
}

function move(){
    const head = {...snake[0]};
    switch (direction) {
        case 'right':
            head.x++;
            break;
        case 'left':
            head.x--;
            break;
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;        
    }
    snake.unshift(head);
    //snake.pop();
    if(head.x === food.x && head.y === food.y){
        food = generateFood();
        increaseSpeed();
        clearInterval(gameInterval);
        gameInterval = setInterval(() => {
            move();
            checkCollision();
            drawMap()
        },gameSpeedDelay);
    }else{
        snake.pop();
    }
}

// setInterval(() => {
//     move(); //move first
//     drawMap();

// },200);

//start game
function startGame(){
    gameStarted = true;
    instructionText.style.display = 'none';
    logoImg.style.display = 'none';
    gameInterval = setInterval(() => {
        move();
       checkCollision ();
        drawMap();
    },gameSpeedDelay);  
}

// Keypress listener
function handleKeyPress(event){
    if((!gameStarted && event.code === 'Space')|| 
    (!gameStarted && event.code === ' ') ){
        startGame();
    }else if(event.key){
        switch (event.key) {
            case 'ArrowUp':
                direction='up';
                break;
            case 'ArrowDown':
                direction='down';
                break;
            case 'ArrowLeft':
                direction='left';
                break;
            case 'ArrowRight':
                direction='right';
                break;
        }
    }}

    document.addEventListener('keydown',handleKeyPress);

    function increaseSpeed(){
            console.log(gameSpeedDelay);
            if(gameSpeedDelay > 150){
                gameSpeedDelay -= 5;
            }else if(gameSpeedDelay > 100){
                gameSpeedDelay -=3;
            }else if(gameSpeedDelay > 50){
                gameSpeedDelay -=2;
            }else if(gameSpeedDelay > 25){
                gameSpeedDelay -=1;
            }
    }

    function checkCollision(){
        const head = snake[0];
        if(head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize){
            resetGame();
        }
        for(let i =1;i<snake.length;i++){
            if(head.x === snake[i].x && head.y === snake[i].y){
                resetGame();
            } 
        }
    }

    function resetGame(){
        updateHighScore();
        stopGame();
        snake = [{x:10, y:10}];
        food = generateFood();
        direction = 'right';
        gameSpeedDelay = 200;
        updateScore();
    }

//update the score
function updateScore(){
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3,'0');
}

// stop the game
function stopGame(){
 clearInterval(gameInterval);
 gameStarted = false;
 instructionText.style.display='block';
 logoImg.style.display='block';
}

function updateHighScore(){
    const currentScore = snake.length - 1;
    if(currentScore > highScore) {highScore = currentScore;
    highScoreText.textContent = highScore.toString().padStart(3,'0');}
    highScoreText.style.display = 'block';
    
}