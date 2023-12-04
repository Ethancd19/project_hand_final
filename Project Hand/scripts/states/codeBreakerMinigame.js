class CodeBreakerMinigame {
    constructor() {
      this.code = this.generateCode(4); // 4-digit code
      this.playerGuess = [];
      this.attempts = 0;
      this.maxAttempts = 10;
      this.isComplete = false;
      this.hasPlayerWon = false;
      this.pastGuesses = []; // Array to store past guesses and their feedback
    }
  
    generateCode(length) {
      let code = [];
      for (let i = 0; i < length; i++) {
        code.push(Math.floor(Math.random() * 10)); // Random digit from 0 to 9
      }
      return code;
    }
  
    update() {
      if (this.isComplete) return;
  
      // Handle player input for guessing the code
      for (let i = 0; i <= 9; i++) { // Check number keys 0-9
        if (keyWentDown(String(i))) {
          this.playerGuess.push(i);
          if (this.playerGuess.length === this.code.length) {
            this.checkGuess();
          }
        }
      }
    }
  
    checkGuess() {
      let feedback = []; // Array to store feedback for each number in the guess
  
      // Check for correct numbers in the correct positions
      for (let i = 0; i < this.code.length; i++) {
        if (this.code[i] === this.playerGuess[i]) {
          feedback.push({ number: this.playerGuess[i], status: 'correctPosition' });
        } else if (this.code.includes(this.playerGuess[i])) {
            feedback.push({ number: this.playerGuess[i], status: 'correctNumber' });
          } else {
            feedback.push({ number: this.playerGuess[i], status: 'incorrect' });
          }
        }
    
        this.pastGuesses.push(feedback);
        this.attempts++;
        if (feedback.every(g => g.status === 'correctPosition')) {
          this.isComplete = true;
          this.hasPlayerWon = true;
        } else if (this.attempts >= this.maxAttempts) {
          this.isComplete = true;
        }
        this.playerGuess = []; // Reset guess for next attempt
      }
    
      draw() {
        // Code to draw the minigame interface
        push();
        textSize(20);
        fill(255);
        text(`Guess the code: ${this.playerGuess.join('')}`, 100, 100);
        text(`Attempts left: ${this.maxAttempts - this.attempts}`, 100, 130);
    
        let guessY = 160;
        for (let guess of this.pastGuesses) {
          let guessX = 100;
          for (let g of guess) {
            switch (g.status) {
              case 'correctPosition':
                fill(0, 255, 0); // Green for correct position
                break;
              case 'correctNumber':
                fill(255, 255, 0); // Yellow for correct number
                break;
              default:
                fill(255); // White for incorrect
            }
            text(g.number, guessX, guessY);
            guessX += textWidth(g.number) + 5; // Move to the next number position
        }
        guessY += 25; // Move down for the next guess
      }
  
      if (this.isComplete) {
        let resultText = this.hasPlayerWon ? "You cracked the code!" : "Game Over. Try again!";
        fill(255);
        text(resultText, 100, guessY);
      }
  
      pop();
    }
}