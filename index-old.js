// Configuration
const defaultConfig = {
    game_title: 'Trivia Wheel',
    spin_button_text: '🎯 Spin the Wheel!'
};

let config = { ...defaultConfig };
const { allQuestions } = window;

// Categories with colors
const categories = [
    { name: 'Geography', color: '#3b82f6', startAngle: 0 },
    { name: 'Entertainment', color: '#ec4899', startAngle: 60 },
    { name: 'History', color: '#eab308', startAngle: 120 },
    { name: 'Art & Literature', color: '#8b5cf6', startAngle: 180 },
    { name: 'Science & Nature', color: '#22c55e', startAngle: 240 },
    { name: 'Sports & Leisure', color: '#f97316', startAngle: 300 }
];


// Game state
let gameState = {
    players: [],
    currentPlayerIndex: 0,
    questionsBank: {},
    isSpinning: false,
    currentQuestion: null,
    currentCategory: null,
    wheelRotation: 0,
    gamePhase: 'setup', // setup, playing, final-question, ended
    finalQuestionPlayer: null
};

// Initialize questions bank (deep copy)
function initQuestionsBank() {
    gameState.questionsBank = {};
    for (const cat in allQuestions) {
        gameState.questionsBank[cat] = [...allQuestions[cat]];
    }
}

// Player management
function addPlayerInput() {
    const container = document.getElementById('player-inputs');
    const count = container.children.length + 1;
    if (count > 6) return;

    const div = document.createElement('div');
    div.className = 'flex gap-2';
    div.innerHTML = `
        <input type="text" class="player-name-input flex-1 px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-400" placeholder="Player ${count} name" maxlength="15">
        <button onclick="removePlayerInput(this)" class="px-3 py-2 rounded-xl bg-red-500/50 text-white hover:bg-red-500/70 transition">✕</button>
      `;
    container.appendChild(div);
    updateRemoveButtons();
}

function removePlayerInput(btn) {
    const container = document.getElementById('player-inputs');
    if (container.children.length > 2) {
        btn.parentElement.remove();
        updatePlaceholders();
        updateRemoveButtons();
    }
}

function updatePlaceholders() {
    const inputs = document.querySelectorAll('.player-name-input');
    inputs.forEach((input, i) => {
        input.placeholder = `Player ${i + 1} name`;
    });
}

function updateRemoveButtons() {
    const container = document.getElementById('player-inputs');
    const buttons = container.querySelectorAll('button');
    buttons.forEach(btn => {
        btn.classList.toggle('hidden', container.children.length <= 2);
    });
}

// Start game
function startGame() {
    const inputs = document.querySelectorAll('.player-name-input');
    const names = [];
    inputs.forEach((input, i) => {
        const name = input.value.trim() || `Player ${i + 1}`;
        names.push(name);
    });

    if (names.length < 2) return;

    gameState.players = names.map(name => ({
        name,
        colors: [],
        score: 0
    }));

    initQuestionsBank();
    gameState.currentPlayerIndex = 0;
    gameState.gamePhase = 'playing';

    document.getElementById('setup-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');

    updateScoreboard();
    updateCurrentPlayer();
}

// Update scoreboard
function updateScoreboard() {
    const scoreboard = document.getElementById('scoreboard');
    scoreboard.innerHTML = gameState.players.map((player, i) => {
        const isCurrentPlayer = i === gameState.currentPlayerIndex;
        const colorDots = categories.map(cat => {
            const hasColor = player.colors.includes(cat.name);
            return `<span class="color-dot" style="background-color: ${hasColor ? cat.color : 'transparent'}; opacity: ${hasColor ? 1 : 0.3}"></span>`;
        }).join('');

        return `
          <div class="flex-1 min-w-[140px] p-3 rounded-xl ${isCurrentPlayer ? 'bg-white/30 ring-2 ring-yellow-400' : 'bg-white/10'}">
            <div class="font-bold text-white text-sm mb-1">${player.name}</div>
            <div class="flex flex-wrap">${colorDots}</div>
          </div>
        `;
    }).join('');
}

// Update current player display
function updateCurrentPlayer() {
    const display = document.getElementById('current-player-display');
    const player = gameState.players[gameState.currentPlayerIndex];
    display.textContent = `${player.name}'s Turn`;
    display.style.background = 'rgba(255,255,255,0.2)';
}

// Spin wheel
function spinWheel() {
    if (gameState.isSpinning) return;

    const player = gameState.players[gameState.currentPlayerIndex];

    // Check if player has all colors
    if (player.colors.length === 6) {
        startFinalQuestion();
        return;
    }

    gameState.isSpinning = true;
    const spinBtn = document.getElementById('spin-btn');
    spinBtn.disabled = true;

    const wheel = document.getElementById('wheel');
    wheel.classList.remove('wheel-idle');

    playWheelSpinSound();

    // Calculate spin
    const spins = 5 + Math.random() * 3;
    const extraDegrees = Math.random() * 360;
    const totalDegrees = spins * 360 + extraDegrees;

    gameState.wheelRotation += totalDegrees;

    wheel.style.setProperty('--spin-degrees', `${gameState.wheelRotation}deg`);
    wheel.style.setProperty('--spin-duration', '4s');
    wheel.classList.add('wheel-spinning');

    setTimeout(() => {
        wheel.classList.remove('wheel-spinning');
        wheel.style.transform = `rotate(${gameState.wheelRotation}deg)`;

        // Determine category - pointer at top (12 o'clock)
        const normalizedRotation = gameState.wheelRotation % 360;
        const pointerPosition = (360 - normalizedRotation + 360) % 360;

        // Find which category is under the pointer
        let selectedCategory;
        for (const cat of categories) {
            const endAngle = (cat.startAngle + 60) % 360;
            if (cat.startAngle <= pointerPosition && pointerPosition < cat.startAngle + 60) {
                selectedCategory = cat;
                break;
            }
        }
        if (!selectedCategory) selectedCategory = categories[0];

        gameState.currentCategory = selectedCategory.name;
        gameState.isSpinning = false;

        showQuestion();
    }, 4000);
}

// Show question
function showQuestion() {
    const categoryQuestions = gameState.questionsBank[gameState.currentCategory];

    if (!categoryQuestions || categoryQuestions.length === 0) {
        // No questions left in this category, spin again
        document.getElementById('spin-btn').disabled = false;
        return;
    }

    const questionIndex = Math.floor(Math.random() * categoryQuestions.length);
    gameState.currentQuestion = {
        ...categoryQuestions[questionIndex],
        index: questionIndex
    };

    const panel = document.getElementById('question-panel');
    const content = document.getElementById('panel-content');

    content.classList.remove('panel-flip-in');
    content.classList.add('panel-flip-out');

    setTimeout(() => {
        const category = categories.find(c => c.name === gameState.currentCategory);
        document.getElementById('category-badge').textContent = gameState.currentCategory;
        document.getElementById('category-badge').style.backgroundColor = category.color;
        document.getElementById('question-text').textContent = gameState.currentQuestion.q;

        const answersContainer = document.getElementById('answers-container');
        answersContainer.innerHTML = gameState.currentQuestion.options.map((opt, i) => `
          <button onclick="checkAnswer(${i})" class="answer-btn w-full text-left px-4 py-3 rounded-xl bg-white/20 text-white font-semibold hover:bg-white/30 transition border border-white/10">
            ${String.fromCharCode(65 + i)}. ${opt}
          </button>
        `).join('');

        document.getElementById('feedback-container').classList.add('hidden');

        panel.classList.remove('hidden');
        content.classList.remove('panel-flip-out');
        content.classList.add('panel-flip-in');
    }, 300);
}

// Check answer
function checkAnswer(selectedIndex) {
    const buttons = document.querySelectorAll('.answer-btn');
    buttons.forEach(btn => btn.disabled = true);

    const correct = selectedIndex === gameState.currentQuestion.correct;

    // Highlight answers
    buttons.forEach((btn, i) => {
        if (i === gameState.currentQuestion.correct) {
            btn.classList.remove('bg-white/20');
            btn.classList.add('bg-green-500');
        } else if (i === selectedIndex && !correct) {
            btn.classList.remove('bg-white/20');
            btn.classList.add('bg-red-500');
        }
    });

    const feedbackContainer = document.getElementById('feedback-container');
    const feedbackText = document.getElementById('feedback-text');

    if (correct) {
        feedbackText.textContent = '🎉 Correct!';
        feedbackContainer.className = 'mt-6 p-4 rounded-xl text-center bg-green-500/30';

        // Add color to player
        const player = gameState.players[gameState.currentPlayerIndex];
        if (!player.colors.includes(gameState.currentCategory)) {
            player.colors.push(gameState.currentCategory);
        }
        player.score++;

        // Remove question from bank
        gameState.questionsBank[gameState.currentCategory].splice(gameState.currentQuestion.index, 1);

        // Show confetti
        createConfetti();

        updateScoreboard();
    } else {
        playWrongAnswerSound();
        feedbackText.textContent = '❌ Wrong answer!';
        feedbackContainer.className = 'mt-6 p-4 rounded-xl text-center bg-red-500/30';
    }

    feedbackContainer.classList.remove('hidden');

    // Store if answer was correct for continue logic
    gameState.lastAnswerCorrect = correct;
}

// Continue game after answer
function continueGame() {
    const panel = document.getElementById('question-panel');
    const content = document.getElementById('panel-content');

    content.classList.remove('panel-flip-in');
    content.classList.add('panel-flip-out');

    setTimeout(() => {
        panel.classList.add('hidden');
        content.classList.remove('panel-flip-out');

        if (gameState.gamePhase === 'final-question') {
            handleFinalQuestionResult();
        } else {
            if (!gameState.lastAnswerCorrect) {
                // Move to next player
                gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
            }

            // Check if current player has all colors
            const currentPlayer = gameState.players[gameState.currentPlayerIndex];
            if (currentPlayer.colors.length === 6) {
                startFinalQuestion();
            } else {
                updateScoreboard();
                updateCurrentPlayer();
                document.getElementById('spin-btn').disabled = false;
            }
        }
    }, 300);
}

// Start final question
function startFinalQuestion() {
    gameState.gamePhase = 'final-question';
    gameState.finalQuestionPlayer = gameState.currentPlayerIndex;

    // Get random category and question
    const availableCategories = Object.keys(gameState.questionsBank).filter(
        cat => gameState.questionsBank[cat].length > 0
    );

    if (availableCategories.length === 0) {
        // No questions left - player wins by default
        declareWinner(gameState.currentPlayerIndex);
        return;
    }

    const randomCat = availableCategories[Math.floor(Math.random() * availableCategories.length)];
    gameState.currentCategory = randomCat;

    const categoryQuestions = gameState.questionsBank[randomCat];
    const questionIndex = Math.floor(Math.random() * categoryQuestions.length);
    gameState.currentQuestion = {
        ...categoryQuestions[questionIndex],
        index: questionIndex
    };

    // Show question panel with special styling
    const panel = document.getElementById('question-panel');
    const content = document.getElementById('panel-content');

    content.classList.remove('panel-flip-in');
    content.classList.add('panel-flip-out');

    setTimeout(() => {
        const category = categories.find(c => c.name === gameState.currentCategory);
        document.getElementById('category-badge').textContent = `🏆 FINAL QUESTION: ${gameState.currentCategory}`;
        document.getElementById('category-badge').style.backgroundColor = category.color;
        document.getElementById('question-text').textContent = gameState.currentQuestion.q;

        const answersContainer = document.getElementById('answers-container');
        answersContainer.innerHTML = gameState.currentQuestion.options.map((opt, i) => `
          <button onclick="checkAnswer(${i})" class="answer-btn w-full text-left px-4 py-3 rounded-xl bg-white/20 text-white font-semibold hover:bg-white/30 transition border border-white/10">
            ${String.fromCharCode(65 + i)}. ${opt}
          </button>
        `).join('');

        document.getElementById('feedback-container').classList.add('hidden');

        panel.classList.remove('hidden');
        content.classList.remove('panel-flip-out');
        content.classList.add('panel-flip-in');
    }, 300);

    document.getElementById('spin-btn').disabled = true;
}

// Handle final question result
function handleFinalQuestionResult() {
    if (gameState.lastAnswerCorrect) {
        declareWinner(gameState.finalQuestionPlayer);
    } else {
        // Remove one color from player
        const player = gameState.players[gameState.finalQuestionPlayer];
        if (player.colors.length > 0) {
            player.colors.pop();
        }

        // Move to next player
        gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
        gameState.gamePhase = 'playing';
        gameState.finalQuestionPlayer = null;

        updateScoreboard();
        updateCurrentPlayer();
        document.getElementById('spin-btn').disabled = false;
    }
}

// Declare winner
function declareWinner(playerIndex) {
    gameState.gamePhase = 'ended';
    const winner = gameState.players[playerIndex];

    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('winner-screen').classList.remove('hidden');
    document.getElementById('winner-name').textContent = `${winner.name} wins!`;

    // Celebration confetti
    for (let i = 0; i < 5; i++) {
        setTimeout(() => createConfetti(), i * 500);
    }
}

// Sound effects
const soundContext = new (window.AudioContext || window.webkitAudioContext)();

function playWheelSpinSound() {
    // Whoosh sound effect for spinning
    const now = soundContext.currentTime;
    const osc = soundContext.createOscillator();
    const gainNode = soundContext.createGain();

    osc.connect(gainNode);
    gainNode.connect(soundContext.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 1.6);

    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 1.6);

    osc.start(now);
    osc.stop(now + 1.6);
}

function playConfettiSound() {
    // Pop/cheer sound effect
    const now = soundContext.currentTime;
    const osc = soundContext.createOscillator();
    const gainNode = soundContext.createGain();

    osc.connect(gainNode);
    gainNode.connect(soundContext.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);

    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    osc.start(now);
    osc.stop(now + 0.1);
}

function playWrongAnswerSound() {
    // Buzzer sound for wrong answer
    const now = soundContext.currentTime;
    const osc = soundContext.createOscillator();
    const gainNode = soundContext.createGain();

    osc.connect(gainNode);
    gainNode.connect(soundContext.destination);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.setValueAtTime(100, now + 0.15);

    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.setValueAtTime(0.2, now + 0.15);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    osc.start(now);
    osc.stop(now + 0.3);
}

// Create confetti
function createConfetti() {
    playConfettiSound();

    const container = document.getElementById('confetti-container');
    const colors = ['#3b82f6', '#ec4899', '#eab308', '#8b5cf6', '#22c55e', '#f97316', '#ef4444', '#ffffff'];

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        container.appendChild(confetti);

        setTimeout(() => confetti.remove(), 3500);
    }
}

// Reset game
function resetGame() {
    gameState = {
        players: [],
        currentPlayerIndex: 0,
        questionsBank: {},
        isSpinning: false,
        currentQuestion: null,
        currentCategory: null,
        wheelRotation: 0,
        gamePhase: 'setup',
        finalQuestionPlayer: null
    };

    const wheel = document.getElementById('wheel');
    wheel.style.transform = 'rotate(0deg)';
    wheel.classList.remove('wheel-spinning');
    wheel.classList.add('wheel-idle');

    document.getElementById('spin-btn').disabled = false;
    document.getElementById('winner-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('setup-screen').classList.remove('hidden');
    document.getElementById('question-panel').classList.add('hidden');

    // Reset player inputs
    const container = document.getElementById('player-inputs');
    container.innerHTML = `
        <div class="flex gap-2">
          <input type="text" class="player-name-input flex-1 px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-400" placeholder="Player 1 name" maxlength="15">
          <button onclick="removePlayerInput(this)" class="px-3 py-2 rounded-xl bg-red-500/50 text-white hover:bg-red-500/70 transition hidden">✕</button>
        </div>
        <div class="flex gap-2">
          <input type="text" class="player-name-input flex-1 px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-400" placeholder="Player 2 name" maxlength="15">
          <button onclick="removePlayerInput(this)" class="px-3 py-2 rounded-xl bg-red-500/50 text-white hover:bg-red-500/70 transition hidden">✕</button>
        </div>
      `;
}

// Element SDK integration
async function onConfigChange(newConfig) {
    config = { ...defaultConfig, ...newConfig };

    document.getElementById('main-title').textContent = config.game_title;
    document.getElementById('game-title-display').textContent = config.game_title;
    document.getElementById('spin-btn').innerHTML = config.spin_button_text;
}

function mapToCapabilities(config) {
    return {
        recolorables: [],
        borderables: [],
        fontEditable: undefined,
        fontSizeable: undefined
    };
}

function mapToEditPanelValues(config) {
    return new Map([
        ['game_title', config.game_title || defaultConfig.game_title],
        ['spin_button_text', config.spin_button_text || defaultConfig.spin_button_text]
    ]);
}

window.addPlayerInput = addPlayerInput;
window.removePlayerInput = removePlayerInput;
window.startGame = startGame;
window.spinWheel = spinWheel;
window.checkAnswer = checkAnswer;
window.continueGame = continueGame;
window.resetGame = resetGame;

// Initialize
if (window.elementSdk) {
    window.elementSdk.init({
        defaultConfig,
        onConfigChange,
        mapToCapabilities,
        mapToEditPanelValues
    });
}
