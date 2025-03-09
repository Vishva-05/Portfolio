document.addEventListener('DOMContentLoaded', () => {
    // Background animation with bubbles and flowers
    const backgroundAnimation = document.querySelector('.background-animation');

    function createBubble() {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.style.left = Math.random() * 100 + '%';
        bubble.style.width = Math.random() * 30 + 20 + 'px';
        bubble.style.height = bubble.style.width;
        backgroundAnimation.appendChild(bubble);

        // Create flower when bubble reaches top
        bubble.addEventListener('animationend', () => {
            const flower = document.createElement('div');
            flower.className = 'flower';
            flower.style.left = bubble.style.left;
            flower.style.top = '20%';
            backgroundAnimation.appendChild(flower);

            // Remove flower after animation
            flower.addEventListener('animationend', () => {
                flower.remove();
            });

            bubble.remove();
        });
    }

    // Create bubbles periodically
    setInterval(createBubble, 300);
    let startTime;
    let timerInterval;
    let matchCount = 0;
    const totalPairs = 4;

    const gadgets = [
        { name: 'anywhere-door', image: 'images/anywhere-door.svg' },
        { name: 'time-machine', image: 'images/time-machine.svg' },
        { name: 'take-copter', image: 'images/take-copter.svg' },
        { name: 'doraemon', image: 'images/doraemon.svg' }
    ];

    const gameContainer = document.querySelector('.memory-game');
    const gameStats = document.createElement('div');
    gameStats.classList.add('game-stats');
    gameStats.innerHTML = `
        <div class="timer">Time: 0s</div>
        <div class="matches">Matches: 0/${totalPairs}</div>
    `;
    gameContainer.parentNode.insertBefore(gameStats, gameContainer);

    let cards = [];
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;

    function startTimer() {
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 1000);
    }

    function updateTimer() {
        const currentTime = Math.floor((Date.now() - startTime) / 1000);
        document.querySelector('.timer').textContent = `Time: ${currentTime}s`;
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    // Create card pairs
    const cardPairs = [...gadgets, ...gadgets];
    shuffleArray(cardPairs);

    // Create cards
    cardPairs.forEach((gadget, index) => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.dataset.gadget = gadget.name;

        const frontFace = document.createElement('img');
        frontFace.src = gadget.image;
        frontFace.alt = gadget.name;
        frontFace.style.display = 'none';

        card.appendChild(frontFace);
        card.addEventListener('click', flipCard);
        gameContainer.appendChild(card);
        cards.push(card);
    });

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;

        if (!startTime) {
            startTimer();
        }

        this.querySelector('img').style.display = 'block';
        this.classList.add('flipped');

        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
            return;
        }

        secondCard = this;
        checkForMatch();
    }

    function checkForMatch() {
        const isMatch = firstCard.dataset.gadget === secondCard.dataset.gadget;
        isMatch ? disableCards() : unflipCards();
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        matchCount++;
        document.querySelector('.matches').textContent = `Matches: ${matchCount}/${totalPairs}`;

        if (matchCount === totalPairs) {
            stopTimer();
            const finalTime = Math.floor((Date.now() - startTime) / 1000);
            setTimeout(() => {
                alert(`Congratulations! You completed the game in ${finalTime} seconds!`);
            }, 500);
        }

        resetBoard();
    }

    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            firstCard.querySelector('img').style.display = 'none';
            secondCard.querySelector('img').style.display = 'none';
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard();
        }, 1500);
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
});

const style = document.createElement('style');
style.textContent = `
    .memory-game {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
        max-width: 600px;
        margin: 20px auto;
        padding: 10px;
    }

    .game-stats {
        text-align: center;
        margin-bottom: 20px;
        font-size: 1.2em;
        color: #333;
    }

    .memory-card {
        width: 120px;
        height: 120px;
        margin: 5px;
        position: relative;
        perspective: 1000px;
        cursor: pointer;
        transform-style: preserve-3d;
        transition: transform 0.5s;
    }

    .front, .back {
        position: absolute;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        border-radius: 10px;
        background-size: cover;
        background-position: center;
        background-color: white;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    .back {
        transform: rotateY(0);
        background-color: #8e44ad;
        border: 3px solid #4834d4;
    }

    .front {
        transform: rotateY(180deg);
        border: 3px solid #ff69b4;
    }

    .memory-card.flipped {
        transform: rotateY(180deg);
    }
`;
document.head.appendChild(style);