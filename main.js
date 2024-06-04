// Add JS here
document.addEventListener("DOMContentLoaded", () => {
    const gameBoard = document.getElementById("game-board");
    const scoreDisplay = document.getElementById("score");
    const colors = ['red', 'blue', 'green', 'yellow'];
    const gridSize = 8;
    let score = 0;
    let selectedGem = null;
    let selectedGemColor = '';

    // Create a gem element
    function createGem(color) {
        const gem = document.createElement("div");
        gem.classList.add("gem", color);
        gem.addEventListener("click", () => selectGem(gem, color));
        return gem;
    }

    // Populate the game board
    function populateBoard() {
        for (let i = 0; i < gridSize * gridSize; i++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            const gem = createGem(color);
            gameBoard.appendChild(gem);
        }
    }

    // Select a gem
    function selectGem(gem, color) {
        if (selectedGem) {
            if (selectedGem === gem) {
                selectedGem.classList.remove("selected");
                selectedGem = null;
                selectedGemColor = '';
            } else if (areAdjacent(selectedGem, gem)) {
                swapGems(selectedGem, gem);
                selectedGem.classList.remove("selected");
                selectedGem = null;
                selectedGemColor = '';
                // Check for matches
                checkMatches();
            } else {
                selectedGem.classList.remove("selected");
                gem.classList.add("selected");
                selectedGem = gem;
                selectedGemColor = color;
            }
        } else {
            gem.classList.add("selected");
            selectedGem = gem;
            selectedGemColor = color;
        }
    }

    // Check if two gems are adjacent
    function areAdjacent(gem1, gem2) {
        const gem1Index = Array.from(gameBoard.children).indexOf(gem1);
        const gem2Index = Array.from(gameBoard.children).indexOf(gem2);

        const gem1Row = Math.floor(gem1Index / gridSize);
        const gem1Col = gem1Index % gridSize;
        const gem2Row = Math.floor(gem2Index / gridSize);
        const gem2Col = gem2Index % gridSize;

        return (gem1Row === gem2Row && Math.abs(gem1Col - gem2Col) === 1) ||
               (gem1Col === gem2Col && Math.abs(gem1Row - gem2Row) === 1);
    }

    // Swap two gems
    function swapGems(gem1, gem2) {
        const tempClass = gem1.className;
        gem1.className = gem2.className;
        gem2.className = tempClass;
    }

    // Check for matches
    function checkMatches() {
        const gems = Array.from(gameBoard.children);
        let matched = false;

        // Check rows
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize - 2; col++) {
                const index = row * gridSize + col;
                const gem1 = gems[index];
                const gem2 = gems[index + 1];
                const gem3 = gems[index + 2];
                if (gem1.className === gem2.className && gem1.className === gem3.className) {
                    matched = true;
                    // Increment score
                    score += 3;
                    scoreDisplay.textContent = `Score: ${score}`;
                    // Remove gems
                    removeGems(gem1, gem2, gem3);
                }
            }
        }

        // Check columns
        for (let col = 0; col < gridSize; col++) {
            for (let row = 0; row < gridSize - 2; row++) {
                const index = row * gridSize + col;
                const gem1 = gems[index];
                const gem2 = gems[index + gridSize];
                const gem3 = gems[index + 2 * gridSize];
                if (gem1.className === gem2.className && gem1.className === gem3.className) {
                    matched = true;
                    // Increment score
                    score += 3;
                    scoreDisplay.textContent = `Score: ${score}`;
                    // Remove gems
                    removeGems(gem1, gem2, gem3);
                }
            }
        }

        // If there were matches, refill the board
        if (matched) {
            setTimeout(refillBoard, 500);
        }
    }

    // Remove gems
    function removeGems(...gems) {
        gems.forEach(gem => {
            gem.className = '';
        });
    }

    // Refill the board after matches
    function refillBoard() {
        const gems = Array.from(gameBoard.children);

        // Drop gems down
        for (let col = 0; col < gridSize; col++) {
            for (let row = gridSize - 1; row >= 0; row--) {
                const index = row * gridSize + col;
                if (gems[index].className === '') {
                    let newIndex = index;
                    while (newIndex >= gridSize) {
                        newIndex -= gridSize;
                        if (gems[newIndex].className !== '') {
                            gems[index].className = gems[newIndex].className;
                            gems[newIndex].className = '';
                            break;
                        }
                    }
                }
            }
        }

        // Fill empty spaces with new gems
        gems.forEach((gem, index) => {
            if (gem.className === '') {
                const color = colors[Math.floor(Math.random() * colors.length)];
                gem.classList.add('gem', color);
            }
        });

        // Check for new matches
        checkMatches();
    }

    // Initialize the game
    populateBoard();
});
