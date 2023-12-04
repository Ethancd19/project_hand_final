let pauseMenuOptions = [
    { text: "Resume", action: "resume" },
    { text: "Restart", action: "restart" },
    { text: "Restart From Checkpoint", action: "restart_checkpoint" },
    { text: "Settings", action: "settings" },
    { text: "Quit", action: "quit" }
];

function drawPauseMenu(state) {
    // Draw translucent overlay
    fill(0, 100);  // semi-transparent black
    rect(0, 0, width, height);

    // Draw pause text
    textSize(48);
    fill(255);
    textAlign(CENTER, CENTER);
    text("Paused", width / 2, height / 4);

    // Draw the pause menu options
    textSize(32);  // Assuming this is the size for the options
    for (let i = 0; i < pauseMenuOptions.length; i++) {
        let yPosition = height / 2 + i * 40;
        text(pauseMenuOptions[i].text, width / 2, yPosition);
        pauseMenuOptions[i].bounds = {  // Update each option with its bounds for click detection
            x: width / 2 - textWidth(pauseMenuOptions[i].text) / 2,
            y: yPosition - 16,
            width: textWidth(pauseMenuOptions[i].text),
            height: 32
        };
    }
}

function handlePauseMenuClick(x, y, state) {
    for (let option of pauseMenuOptions) {
        if (x > option.bounds.x && x < option.bounds.x + option.bounds.width &&
            y > option.bounds.y && y < option.bounds.y + option.bounds.height) {
            switch (option.action) {
                case "resume":
                    state.togglePause();
                    break;
                case "restart":
                    // Add logic to restart the level
                    break;
                case "restart_checkpoint":
                    // Add logic to restart from last checkpoint
                    break;
                case "settings":
                    // Add logic to go to settings screen
                    break;
                case "quit":
                    currentState = new MenuState();  // Assuming this is how you switch states
                    break;
            }
            return;  // Exit the loop once an action is taken
        }
    }
}