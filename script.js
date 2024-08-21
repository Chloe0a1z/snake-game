document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const scoreDisplay = document.getElementById('score');
    const playNowButton = document.getElementById('play-now');
    const boardSize = 20;
    const cellSize = 20;
    const initialSnakeSize = 3;

    let snake = [{ x: 10, y: 10 }];
    let food = createFood();
    let direction = 'right';
    let gameInterval;
    let score = 0;
    let gameInProgress = false; // Flag to track if the game is in progress

    function createFood() {
        const foodX = Math.floor(Math.random() * boardSize);
        const foodY = Math.floor(Math.random() * boardSize);
        return { x: foodX, y: foodY };
    }

    document.addEventListener('keydown', e => {
        // Prevent default behavior of arrow keys
        if ([38, 40, 37, 39].includes(e.keyCode)) {
            e.preventDefault();
        }

        switch (e.key) {
            case 'ArrowUp':
                if (direction !== 'down') direction = 'up';
                break;
            case 'ArrowDown':
                if (direction !== 'up') direction = 'down';
                break;
            case 'ArrowLeft':
                if (direction !== 'right') direction = 'left';
                break;
            case 'ArrowRight':
                if (direction !== 'left') direction = 'right';
                break;
        }
    });

    function draw() {
        gameBoard.innerHTML = '';
        snake.forEach(segment => {
            const snakeSegment = document.createElement('div');
            snakeSegment.style.width = `${cellSize}px`;
            snakeSegment.style.height = `${cellSize}px`;
            snakeSegment.style.backgroundColor = 'green';
            snakeSegment.style.position = 'absolute';
            snakeSegment.style.left = `${segment.x * cellSize}px`;
            snakeSegment.style.top = `${segment.y * cellSize}px`;
            gameBoard.appendChild(snakeSegment);
        });

        const foodElement = document.createElement('div');
        foodElement.style.width = `${cellSize}px`;
        foodElement.style.height = `${cellSize}px`;
        foodElement.style.backgroundColor = 'red';
        foodElement.style.position = 'absolute';
        foodElement.style.left = `${food.x * cellSize}px`;
        foodElement.style.top = `${food.y * cellSize}px`;
        gameBoard.appendChild(foodElement);
    }

    function moveSnake() {
        const head = { x: snake[0].x, y: snake[0].y };

        switch (direction) {
            case 'up':
                head.y -= 1;
                break;
            case 'down':
                head.y += 1;
                break;
            case 'left':
                head.x -= 1;
                break;
            case 'right':
                head.x += 1;
                break;
        }

        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            food = createFood();
            score++;
            scoreDisplay.textContent = `Score: ${score}`;
        } else {
            snake.pop();
        }
    }

    function checkGameOver() {
        const head = snake[0];
        if (head.x < 0 || head.x >= boardSize || head.y < 0 || head.y >= boardSize || checkCollision()) {
            clearInterval(gameInterval);
            // alert(`Game Over! Your score: ${score}`);
            showGameOverModal(score);
            resetGame();
        }
    }

    function checkCollision() {
        const head = snake[0];
        return snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
    }

    function update() {
        moveSnake();
        draw();
        checkGameOver();
    }

    function startGame() {
        if (gameInProgress) return; // Prevent starting a new game if one is already in progress
        gameInProgress = true; // Set game in progress flag
        snake = [{ x: 10, y: 10 }];
        food = createFood();
        direction = 'right';
        score = 0;
        scoreDisplay.textContent = `Score: ${score}`;
        gameInterval = setInterval(update, 100);
    }

    function resetGame() {
        gameInProgress = false; // Reset game in progress flag
        clearInterval(gameInterval);
        snake = [{ x: 10, y: 10 }];
        food = createFood();
        direction = 'right';
        score = 0;
        scoreDisplay.textContent = `Score: ${score}`;
        draw();
        playNowButton.disabled = false;
    }

    playNowButton.addEventListener('click', () => {
        startGame();
        playNowButton.disabled = true;
    });

    document.addEventListener('keydown', e => {
        switch (e.key) {
            case 'ArrowUp':
                if (direction !== 'down') direction = 'up';
                break;
            case 'ArrowDown':
                if (direction !== 'up') direction = 'down';
                break;
            case 'ArrowLeft':
                if (direction !== 'right') direction = 'left';
                break;
            case 'ArrowRight':
                if (direction !== 'left') direction = 'right';
                break;
        }
    });

    const leaderboardButton = document.querySelector('.btn');

    leaderboardButton.addEventListener('click', () => {
        if (gameInProgress) { // Only update leaderboard if the game is over
            updateLeaderboard(score);
        }
    });

    function showGameOverModal(finalScore) {
        const gameOverModal = document.createElement('div');
        gameOverModal.classList.add('game-over-modal');
        gameOverModal.style.position = 'fixed';
        gameOverModal.style.top = '50%';
        gameOverModal.style.left = '50%';
        gameOverModal.style.transform = 'translate(-50%, -50%)';
        gameOverModal.style.backgroundColor = '#fff';
        gameOverModal.style.padding = '20px';
        gameOverModal.style.borderRadius = '5px';
        gameOverModal.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
        gameOverModal.style.zIndex = '9999';

        const scoreDisplay = document.createElement('div');
        scoreDisplay.classList.add('score-display');
        scoreDisplay.textContent = `Your score: ${finalScore}`;
        scoreDisplay.style.fontSize = '24px';
        scoreDisplay.style.fontWeight = '700';
        scoreDisplay.style.marginBottom = '20px';

        const nameInputContainer = document.createElement('div');
        nameInputContainer.style.display = 'flex';
        nameInputContainer.style.justifyContent = 'center';
        nameInputContainer.style.marginBottom = '20px';

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.placeholder = 'Enter your name';
        nameInput.style.width = '200px'; // Adjusted width
        nameInput.style.padding = '10px';

        nameInputContainer.appendChild(nameInput);

        const submitButton = document.createElement('button');
        submitButton.textContent = 'Submit';
        submitButton.style.backgroundColor = '#333';
        submitButton.style.color = '#fff';
        submitButton.style.border = 'none';
        submitButton.style.padding = '10px 20px';
        submitButton.style.fontSize = '16px';
        submitButton.style.fontWeight = '700';
        submitButton.style.borderRadius = '5px';
        submitButton.style.cursor = 'pointer';
        submitButton.addEventListener('click', () => {
            const playerName = nameInput.value.trim();
            if (playerName !== '') {
                updateLeaderboard(playerName, finalScore);
                gameOverModal.remove();
            } else {
                alert('Please enter your name.');
            }
        });

        gameOverModal.appendChild(scoreDisplay);
        gameOverModal.appendChild(nameInputContainer);
        gameOverModal.appendChild(submitButton);
        document.body.appendChild(gameOverModal);
    }

    function updateLeaderboard(playerName, finalScore) {
        // Send an AJAX request to a server-side script (e.g., PHP) to update the leaderboard
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost/update_leaderboard.php');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onload = function () {
            if (xhr.status === 200) {
                // Leaderboard updated successfully
                alert('Leaderboard updated successfully.');
                // Redirect to the leaderboard page
                // window.location.href = 'leaderboard.html';
            } else {
                // Error updating leaderboard
                alert('Error updating leaderboard: ' + xhr.statusText);
            }
        };

        const data = `playerName=${playerName}&score=${finalScore}`;
        console.log('Sending data:', data);
        xhr.send(data);
    }

});

