// simonSaysMinigame.js

let minigameActive = false;
let minigameGrid = [];
let minigameSequence = [];
let minigamePlayerSequence = [];
let minigameIndex = 0; // The current index in the sequence the player has to press
let currentDisplayIndex = 0;
let displayTimer;
let displayInterval = 500; // 500 milliseconds between displays
let betweenStepsInterval = 250; // Time between steps
let minigameRoundsCompleted = 0;
let maxRounds = 4; // The minigame ends after 4 rounds
let artifactFadingIn = false;
let artifactOpacity = 0;

// Initialize the minigame grid
function setupMinigameGrid() {
  minigameGrid = [];
  // Setup the 9x9 grid with default (grey) state
  for (let i = 0; i < 9; i++) {
    minigameGrid.push({ color: color(128), isTeal: false }); // Color(128) is grey, change as needed
  }
}

// Start the minigame
function startMinigame() {
  minigameActive = true;
  setupMinigameGrid();
  minigameSequence = [];
  addNewStepToSequence();
  displayPatternStep(); // Begin displaying the pattern
}



function displayPatternStep(stepIndex) {
  if (stepIndex < minigameSequence.length) {
    let step = minigameSequence[stepIndex];
    minigameGrid.forEach((cell, index) => {
      cell.color = index === step ? color(0, 128, 128) : color(128);
    });

    displayTimer = setTimeout(() => {
      resetGridColors();
      if (stepIndex < minigameSequence.length - 1) {
        displayTimer = setTimeout(() => displayPatternStep(stepIndex + 1), betweenStepsInterval);
      }
    }, displayInterval);
  }
}

function resetGridColors() {
  for (let i = 0; i < minigameGrid.length; i++) {
    minigameGrid[i].color = color(128); // Reset to grey
  }
}

// Add a new step to the minigame sequence
function addNewStepToSequence() {
  if (minigameRoundsCompleted < maxRounds) {
    let nextStep = floor(random(minigameGrid.length));
    minigameSequence.push(nextStep);
    minigameRoundsCompleted++;
    minigamePlayerSequence = []; // Reset player sequence for the new round
    displayPatternStep(0); // Start displaying the pattern from the beginning
  } else {
    // Successful completion of all rounds
    completePattern();
  }
}

// Render the minigame
function drawMinigame() {
  if (minigameActive) {
    // Apply a translucent overlay to the background
    fill(0, 0, 0, 150);
    rect(0, 0, width, height);

    // Draw the grid
    let gridSize = sqrt(minigameGrid.length); // For a 9x9 grid, gridSize is 3
    let cellSize = (width / gridSize) / 2; // Half the previous size (adjust as needed)

    // Calculate starting position for the grid (centered on the screen)
    let gridStartX = (width - cellSize * gridSize) / 2;
    let gridStartY = (height - cellSize * gridSize) / 2;

    for (let i = 0; i < minigameGrid.length; i++) {
      let x = gridStartX + (i % gridSize) * cellSize;
      let y = gridStartY + floor(i / gridSize) * cellSize;
      fill(minigameGrid[i].color);
      rect(x, y, cellSize, cellSize);
      stroke(0); // Black outline
      noFill();
      rect(x, y, cellSize, cellSize); // Draw outline
    }
  }
}

// Check if the user clicked the correct square
function checkMinigameInput(mouseX, mouseY, level0StateInstance) {
  if (minigameActive && currentDisplayIndex === 0) {
      let gridSize = sqrt(minigameGrid.length);
      let cellSize = (width / gridSize) / 2;
      let gridStartX = (width - cellSize * gridSize) / 2;
      let gridStartY = (height - cellSize * gridSize) / 2;

      let xIndex = floor((mouseX - gridStartX) / cellSize);
      let yIndex = floor((mouseY - gridStartY) / cellSize);
      let index = xIndex + yIndex * gridSize;

      // Check if the clicked square matches the current sequence step
      if (minigameSequence[minigamePlayerSequence.length] === index) {
          minigamePlayerSequence.push(index);
          if (minigamePlayerSequence.length === minigameSequence.length) {
              if (minigameRoundsCompleted < maxRounds) {
                  // If the sequence is correct and rounds are not yet complete, add new step
                  addNewStepToSequence();
              } else {
                  // If all rounds are completed successfully
                  completePattern(level0StateInstance);
              }
          }
      } else {
          // Incorrect square clicked
          resetMinigame();
      }
  }
}

function flashGridColor(flashColor) {
  for (let i = 0; i < minigameGrid.length; i++) {
    minigameGrid[i].color = flashColor;
  }
}

// Complete the pattern
function completePattern(level0StateInstance) {
  flashGridColor(color(0, 255, 0)); // Flash green
  setTimeout(() => {
      minigameActive = false;
      minigameRoundsCompleted = 0;
      setupMinigameGrid();
      level0StateInstance.minigameCompleted();
  }, 1500); // Wait before transitioning to artifact animation
}

// Call this function from level0State's draw method when needed
function playArtifactAnimation(level0StateInstance) {
  if (artifactFadingIn) {
      tint(255, artifactOpacity);
      image(artifactOneImage, width / 2 - artifactOneImage.width / 2, height / 2 - artifactOneImage.height / 2);
      artifactOpacity += 4;
      if (artifactOpacity >= 255) {
          artifactFadingIn = false; // Artifact has fully appeared
          level0StateInstance.artifactDisplayed = true; // Mark artifact as displayed
          level0StateInstance.showCollectArtifactButton(); // Show the "Collect Artifact" button
      }
  }
  noTint(); // Reset the tint for other drawings
}

function resetMinigame() {
  flashGridColor(color(255, 0, 0)); // Flash red
  setTimeout(() => {
    minigameActive = false;
    minigameRoundsCompleted = 0;
    setupMinigameGrid();
  }, 3000); // Wait before restarting the minigame
}

// End the minigame
function endMinigame(successful = false) {
  if (successful) {
    // Flash green for successful completion
    flashGridColor(color(0, 255, 0)); // Flash green
    setTimeout(() => {
      resetMinigame(); // Reset for a new game
    }, 1500); // Wait 1.5 seconds before resetting
  } else {
    // Flash red for incorrect input
    flashGridColor(color(255, 0, 0)); // Flash red
    setTimeout(() => {
      resetMinigame(); // Reset for a new game
    }, 1500); // Wait 1.5 seconds before resetting
  }
}