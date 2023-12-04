//level1State.js

class level1State {
    constructor() {
        this.ispaused = false;
        platforms = []; // Reset platforms array
        this.createPlatforms();
        
        this.laserGate = new LaserGate(785, 32, laserGateFrames, 64, 195); // Create a new laser gate object
        this.laserSourceX = 800; // Set the laser source's x position
        this.laserSourceY = 0; // Set the laser source's y position
        // Create the box sprite and position it on top of the rightmost platform
        this.box = createSprite(width - 100, 100);
        this.box.addImage(box_image);
        this.box.scale = 2;
        this.box.setCollider('rectangle', 0, 0, 10, 10); // Set the collider for the box
        this.player = new Player(
            100, height - 100, walk_animation, idle_animation, 
            jump_animation, push_animation, interact_animation, death_animation, this.box
        );
        this.showColliders = true; // Add this line to toggle colliders visibility

        // Minigame related variables
        this.minigameActive = false;
        this.minigame = null; // This will hold the current minigame instance
        this.artifactTwoImage = artifactTwoImage; // Assuming artifactImage is loaded in main.js
        this.artifactDisplayed = false; // To track if the artifact is displayed
        this.animationPlaying = false; // Control flag for playing the box animation
        this.collectButton = null;
        this.artifactText = '';
    }

    createPlatforms() {
        const platformWidth = 350;
        const platformHeight = 40;
        const spacing = 70; // Space between platforms
        const offsetX = 100; // Amount to move platforms to the left
        
        // Example positions for platforms, adjust as per your level design
        this.createPlatformSprite(0, height - (height / 4) + 100, 1000, platformHeight);
        this.createPlatformSprite(300, height - 250, 500, platformHeight);
        this.createPlatformSprite(660, height - 500, 620, platformHeight);
        this.createPlatformSprite(0, height - 400, 500, platformHeight);
    }


    createPlatformSprite(x, y, w, h) {
        let platform = createSprite(x + w / 2, y + h / 2);
        platform.addImage(platform_sheet);
        platform.scale = w / platform_sheet.width; // Assuming platform_sheet.width is the unscaled image width
        platform.setCollider('rectangle', 0, 0, w, h); // The collider should match the scaled size
        platforms.push(platform);
    }
    
    // The drawCollider function needs to consider the scale of the sprite.
    drawCollider(platform) {
        push();
        noFill();
        stroke(255, 0, 0);
        strokeWeight(2); // Makes the collider more visible
        rectMode(CENTER);
        rect(
            platform.position.x, 
            platform.position.y, 
            platform.width * platform.scale, // Use the scaled width
            platform.height * platform.scale // Use the scaled height
        );
        pop();
    }

    togglePause() {
        this.isPaused = !this.isPaused;
    }

    update() {
        if (this.isPaused) {
            return;
        }
    
        if (this.player) {
            this.player.update();
            this.player.interact(); // Ensure this is being called every frame
        }
    
        this.checkBoundaries();
        // Debugging: Log player's y position and canvas height
        console.log("Player Y:", this.player.sprite.position.y, "Canvas Height:", height);
        console.log("Player X:", this.player.sprite.position.x, "Canvas width:", width);

        if (this.player.sprite.position.y + this.player.sprite.height / 2 >= height) {
            // Reset player position to the first platform
            this.player.sprite.position.x = 100
            this.player.sprite.position.y = 100
            globalDeathCount++; // Increment death counter
            console.log("Respawning... Deaths:", globalDeathCount);
        }
        // Check for collision with the laser gate
        if (this.laserGate.isActive() && this.player.sprite.overlap(this.laserGate.sprite)) {
            // Reset player position to the start platform
            this.player.sprite.position.x = 100;
            this.player.sprite.position.y = 100;
            globalDeathCount++; // Increment death counter
            console.log("Respawning... Deaths:", globalDeathCount);
        }

        // Check if player is within 100 pixels of the laser control
        this.showInteractionPrompt = dist(this.player.sprite.position.x, this.player.sprite.position.y, 940, 577 ) < 100;
        if (this.showInteractionPrompt && keyWentDown('E')) {
            this.startMinigame();
        }
        if (this.minigameActive && this.minigame) {
            this.minigame.update();
            if (this.minigame.isComplete) {
                this.handleMinigameCompletion();
            }
        }

        // Check if the player reaches the right side of the canvas to transition to FinalBattle
        if (this.player.sprite.position.x >= width - this.player.sprite.width) {
            this.transitionToFinalBattle();
        }
    }
    startMinigame() {
        // Randomly select a minigame

        this.minigame = new CodeBreakerMinigame();

        this.minigameActive = true;
    }
    transitionToFinalBattle() {
        currentState = new FinalBattle(); // Transition to final battle
    }

    handleMinigameCompletion() {
        // Perform actions upon minigame completion
        this.displayArtifactAnimation(); // If you want to display an artifact
        this.minigameActive = false;
    }

    displayArtifactAnimation() {
        this.artifactDisplayed = true;
        this.artifactOpacity = 255; // Set full opacity to display the artifact immediately
    }

    showCollectArtifactButton() {
        this.collectButton = createButton('Collect Artifact');
        this.collectButton.position(width / 2 - this.collectButton.width / 2, height / 2 + 100);
        this.collectButton.mousePressed(this.onCollectArtifact.bind(this));
        this.artifactText = 'Artifact Found';
    
        // Set the font for the button
        this.collectButton.style('font-family', 'Iceland');
    }

    // Handler for when the "Collect Artifact" button is pressed
    onCollectArtifact() {
        console.log('Artifact collected!'); // Placeholder for future functionality
        // Hide the button and clear the text
        this.deactivateLaserGate();
    }

    deactivateLaserGate(){
        this.laserGate.disable();
        this.artifactDisplayed = false;
        if (this.collectButton) {
            this.collectButton.hide();
            this.collectButton = null;
        }
    }
    displayInteractionPrompt() {
        push();
        textSize(20);
        fill(255);
        noStroke();
        textAlign(CENTER, CENTER);
        text("Press 'E' to interact", 920, 470); // Position the text above 'Laser Controls'
        pop();
    }
    checkBoundaries() {
        // Prevent the player from going off-screen
        if (this.player.sprite.position.x < 0) {
            this.player.sprite.position.x = 0;
        }
        if (this.player.sprite.position.x > width) {
            this.player.sprite.position.x = width;
        }
    }

    draw(){
        background(bgImage);
        for (let platform of platforms) {
            drawSprite(platform);
            if (this.showColliders) {
                this.drawCollider(platform);
            }
        }
        image(laserSourceImg, this.laserSourceX, this.laserSourceY, 32, 32);
        this.laserGate.display();
        textSize(30);
        text(' Laser \nControls', 870, 520)
        
        this.player.display();

        // Display death counter
        textSize(24);
        fill(255);
        textFont(icelandFont);
        textAlign(LEFT, TOP);
        text(`Deaths: ${globalDeathCount}`, 10, 10);
        // Display interaction prompt if the flag is true
        if (this.showInteractionPrompt) {
            this.displayInteractionPrompt();
        }

        if (this.minigameActive && this.minigame) {
            console.log('Drawing minigame...');
            this.minigame.draw();
        } else {
            //playArtifactAnimation(this); // This will handle the artifact animation
            // Display the title "Artifact Collected" when the artifact is being displayed
            if (this.artifactDisplayed) {
                textSize(32); // Set the size of the text
                textAlign(CENTER, CENTER); // Align the text to the center
                fill(255); // Set the text color
                textFont(icelandFont); // Set the font to Iceland
                text('Artifact Collected', width / 2, height / 2 - 150); // Position the text above the artifact
            }
        }

        // Check to keep displaying the artifact
        if (this.artifactDisplayed) {
            tint(255, this.artifactOpacity);
            image(this.artifactTwoImage, width / 2 - this.artifactTwoImage.width / 2, height / 2 - this.artifactTwoImage.height / 2);
            noTint();

            // Check if the collect button is not created yet
            if (!this.collectButton) {
                this.showCollectArtifactButton(); // Show the "Collect Artifact" button
            }

        }

        // If the game is paused, overlay the pause menu
        if (this.isPaused) {
            drawPauseMenu(this);
        }
    }
}