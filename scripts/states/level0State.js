class level0State {
    constructor() {
        this.isPaused = false;
        platforms = []; // Reset platforms array

        const platformWidth = 350;
        const platformHeight = 40;

        // Create platforms at different x positions
        this.createPlatforms(platformWidth, platformHeight);

        // Create the box sprite and position it on top of the rightmost platform
        this.box = createSprite(width - 100, platforms[platforms.length - 1].position.y - 30);
        console.log('Box sprite in level0State:', this.box);
        this.box.addImage(box_image);
        this.box.scale = 2;
        this.box.setCollider('rectangle', 0, 0, 10, 10); // Set the collider for the box
        // Create the player and pass the box sprite to it
        this.player = new Player(
          platforms[0].position.x, 
          platforms[0].position.y - platforms[0].height / 2 - 100,
          walk_animation, 
          idle_animation, 
          jump_animation,
          push_animation,
          interact_animation,
          death_animation,
          this.box // Pass the box sprite here
        );
        // Use the globally loaded box animation and artifact images
        this.artifactOneImage = artifactOneImage; // Assuming artifactImage is loaded in main.js

        // Additional control variables for animation and artifact display
        this.minigameActive = false;
        this.artifactDisplayed = false; // To track if the artifact is displayed
        this.animationPlaying = false; // Control flag for playing the box animation

        this.collectButton = null;
        this.artifactText = '';

      }

    createPlatforms(platformWidth, platformHeight) {
        const spacing = 70; // Space between platforms
        const offsetX = 100; // Amount to move platforms to the left
        platformWidth = 350; // Updated width for the platforms, if needed
        platformHeight = 40; // Updated height for the platforms, if needed
    
        for (let i = 0; i < 3; i++) {
            let x = (width / 4) + (i * (platformWidth + spacing)) - offsetX; // Move each platform to the left
            let y = height / 2; // Position platforms halfway up the screen
            let platform = createSprite(x, y);
    
            // Add the platform image
            platform.addImage(platform_sheet); 
    
            // Scale the sprite to the desired platform width if the image needs scaling
            const imgScale = platformWidth / platform_sheet.width; // Use the actual image width here
            platform.scale = imgScale; 
    
            // Set the collider for the platform
            platform.setCollider('rectangle', 0, 0, platformWidth, platformHeight);
    
            platforms.push(platform);
        }
    }
    
 
  
    // Toggle the paused state
    togglePause() {
        this.isPaused = !this.isPaused;
    }
  
    // Update game state
    update() {
        if (this.isPaused) {
          return;
        }
      
        if (this.player && this.box) {
          this.player.update();
          this.player.interact(); // Ensure this is being called every frame
        }
      
        this.checkBoundaries();

        // Debugging: Log player's y position and canvas height
        console.log("Player Y:", this.player.sprite.position.y, "Canvas Height:", height);

        // Check if the player touches the bottom of the screen
        // Adjusting for player's sprite height if necessary
        if (this.player.sprite.position.y + this.player.sprite.height / 2 >= height) {
            // Reset player position to the first platform
            this.player.sprite.position.x = platforms[0].position.x;
            this.player.sprite.position.y = platforms[0].position.y - platforms[0].height / 2 - 100;
            globalDeathCount++; // Increment death counter
            console.log("Respawning... Deaths:", globalDeathCount);
        }
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

    displayInteractionPrompt() {
        push();
        textSize(20);
        fill(255);
        noStroke();
        textAlign(CENTER, CENTER);
        text("Press 'E' to interact", 920, 470); // Position the text above 'Laser Controls'
        pop();
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
        this.collectButton.hide();
        currentState = new level1State(); // Transition to Level 1
    }

    draw() {
        background(128); // Background color
        // Draw each platform
        for (let platform of platforms) {
            drawSprite(platform); // Draw the platform sprite
    
            // // Draw the red boundary according to the scaled size
            // noFill();
            // stroke(255, 0, 0);
            // rect(
            //     platform.position.x - platform.width * platform.scale / 2, 
            //     platform.position.y - platform.height * platform.scale / 2, 
            //     platform.width * platform.scale, 
            //     platform.height * platform.scale
            // );
        }
        // Draw the player
        this.player.display();

        drawSprite(this.box); // Draw the box sprite

        // Display death counter
        textSize(24);
        fill(255);
        textFont(icelandFont);
        textAlign(LEFT, TOP);
        text(`Deaths: ${globalDeathCount}`, 10, 10); // Positioned in 

        //display controls
        textAlign(100, 600)
        text('right arrow: move right\nleft arrow: move left\nup arrow: jump\nshift + up arrow: super jump\ne: interact', 100, 600)

        if (minigameActive) {
            console.log('Drawing minigame...');
            drawMinigame();
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
            image(this.artifactOneImage, width / 2 - this.artifactOneImage.width / 2, height / 2 - this.artifactOneImage.height / 2);
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

    minigameCompleted() {
        this.boxOpened = true; // This can trigger the artifact to start displaying
        this.displayArtifactAnimation(); // Call this method to start displaying the artifact
    }

    displayArtifactAnimation() {
        this.artifactDisplayed = true;
        this.artifactOpacity = 255; // Set full opacity to display the artifact immediately
    }
}
