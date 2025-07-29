const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');
const startPauseBtn = document.getElementById('startPauseBtn');
const playerScoreElem = document.getElementById('playerScore');
const aiScoreElem = document.getElementById('aiScore');

// Game constants
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const BALL_RADIUS = 12;
const PLAYER_X = 20;
const AI_X = canvas.width - PADDLE_WIDTH - 20;
const PADDLE_SPEED = 6;
const AI_SPEED = 4;

// Game objects
let player = {
    x: PLAYER_X,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT
};

let ai = {
    x: AI_X,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT
};

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    vx: 6 * (Math.random() > 0.5 ? 1 : -1),
    vy: 4 * (Math.random() > 0.5 ? 1 : -1),
    radius: BALL_RADIUS
};

let playerScore = 0;
let aiScore = 0;
let gamePaused = false;

// Mouse tracking for player paddle
canvas.addEventListener('mousemove', function(evt) {
    let rect = canvas.getBoundingClientRect();
    let mouseY = evt.clientY - rect.top;
    player.y = mouseY - player.height / 2;
    // Boundaries
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
});

// Start/Pause button
startPauseBtn.addEventListener('click', function() {
    gamePaused = !gamePaused;
});

// Draw everything
function draw() {
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Middle line
    ctx.strokeStyle = '#555';
    ctx.beginPath();
    ctx.setLineDash([10, 12]);
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Paddles
    ctx.fillStyle = '#fff';
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.fillRect(ai.x, ai.y, ai.width, ai.height);

    // Ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    // Scoreboard
    playerScoreElem.textContent = playerScore;
    aiScoreElem.textContent = aiScore;
}

// Update ball and AI
function update() {
    if (gamePaused) return;

    // Ball movement
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Top and bottom collision
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.vy = -ball.vy;
    }

    // Paddle collision (player)
    if (
        ball.x - ball.radius < player.x + player.width &&
        ball.y > player.y &&
        ball.y < player.y + player.height &&
        ball.x > player.x
    ) {
        ball.vx = -ball.vx;
        // Add a bit of randomness
        ball.vy += (Math.random() - 0.5) * 2;
        ball.x = player.x + player.width + ball.radius;
    }

    // Paddle collision (AI)
    if (
        ball.x + ball.radius > ai.x &&
        ball.y > ai.y &&
        ball.y < ai.y + ai.height &&
        ball.x < ai.x + ai.width
    ) {
        ball.vx = -ball.vx;
        ball.vy += (Math.random() - 0.5) * 2;
        ball.x = ai.x - ball.radius;
    }

    // Out of bounds left or right (reset ball)
    if (ball.x - ball.radius < 0) {
        aiScore++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        playerScore++;
        resetBall();
    }

    // AI movement (simple tracking)
    let aiCenter = ai.y + ai.height / 2;
    if (aiCenter < ball.y - 15) {
        ai.y += AI_SPEED;
    } else if (aiCenter > ball.y + 15) {
        ai.y -= AI_SPEED;
    }
    // Boundaries for AI paddle
    if (ai.y < 0) ai.y = 0;
    if (ai.y + ai.height > canvas.height) ai.y = canvas.height - ai.height;
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.vx = 6 * (Math.random() > 0.5 ? 1 : -1);
    ball.vy = 4 * (Math.random() > 0.5 ? 1 : -1);
}

// Main loop
function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

// Start
loop();