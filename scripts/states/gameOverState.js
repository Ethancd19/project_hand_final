class GameOverState {
    constructor(outcome) {
        this.outcome = outcome; // 'win' or 'lose'
        this.timer = 0; // Timer for the delay
        this.waitDuration = 300; // 5 seconds at 60 fps
    }

    update() {
        // Increment the timer each frame
        this.timer++;

        // Check if 5 seconds have passed
        if (this.timer >= this.waitDuration) {
            currentState = new MenuState(); // Transition to the menu state
        }
    }

    draw() {
        background(0); // Black background
        fill(this.outcome === 'win' ? 'teal' : 'red');
        textSize(64);
        textAlign(CENTER, CENTER);
        textFont(icelandFont);
        text(this.outcome === 'win' ? 'CONGRATULATIONS' : 'GAME OVER', width / 2, height / 2);

        // If the player wins, display the artifacts
        if (this.outcome === 'win') {
            image(artifactOneImage, width / 4 - artifactOneImage.width / 2, height / 2 + 100);
            image(artifactTwoImage, width / 2 - artifactTwoImage.width / 2, height / 2 + 100);
            image(artifactThreeImage, 3 * width / 4 - artifactThreeImage.width / 2, height / 2 + 100);
        }
    }

    // ... any additional methods for GameOverState ...
}