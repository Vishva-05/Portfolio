document.addEventListener('DOMContentLoaded', () => {
    const gadgets = [
        { name: 'Anywhere Door', image: 'anywhere-door.png' },
        { name: 'Time Machine', image: 'time-machine.png' },
        { name: 'Bamboo Copter', image: 'bamboo-copter.png' },
        { name: 'Memory Bread', image: 'memory-bread.png' },
        { name: 'Small Light', image: 'small-light.png' },
        { name: 'Translation Konjac', image: 'translation-konjac.png' },
        { name: 'Take-copter', image: 'take-copter.png' },
        { name: 'Air Cannon', image: 'air-cannon.png' }
    ];

    const gameContainer = document.querySelector('.memory-game');
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let matchedPairs = 0;

    // Create the game board
    function createBoard() {
        const allGadgets = [...gadgets, ...gadgets];
        shuffleArray(allGadgets);

        allGadgets.forEach((gadget, index) => {
            const card = document.createElement('div');
            card.classList.add('memory-card');
            card.dataset.name = gadget.name;

            const front = document.createElement('div');
            front.classList.add('front');
            front.style.backgroundImage = `url(${gadget.image})`;

            const back = document.createElement('div');
            back.classList.add('back');

            card.appendChild(front);
            card.appendChild(back);
            card.addEventListener('click', flipCard);
            gameContainer.appendChild(card);
        });
    }

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;

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
        const isMatch = firstCard.dataset.name === secondCard.dataset.name;
        isMatch ? disableCards() : unflipCards();
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        matchedPairs++;

        if (matchedPairs === gadgets.length) {
            setTimeout(() => {
                alert('Congratulations! You found all the Doraemon gadgets!');
                resetGame();
            }, 500);
        }

        resetBoard();
    }

    function unflipCards() {
        lockBoard = true;

        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    function resetGame() {
        gameContainer.innerHTML = '';
        matchedPairs = 0;
        createBoard();
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Initialize the game
    createBoard();
}));

// Add memory card styles
const style = document.createElement('style');
style.textContent = `
    .memory-card {
        width: 100%;
        padding-bottom: 100%;
        position: relative;
        perspective: 1000px;
        cursor: pointer;
    }

    .front, .back {
        position: absolute;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        transition: transform 0.5s;
        border-radius: 10px;
        background-size: cover;
        background-position: center;
    }

    .back {
        background: #3498db;
        transform: rotateY(0);
    }

    .front {
        background-color: white;
        transform: rotateY(180deg);
    }

    .memory-card.flipped .front {
        transform: rotateY(0);
    }

    .memory-card.flipped .back {
        transform: rotateY(-180deg);
    }
`;
document.head.appendChild(style);