//level2State.js
class FinalBattle {
    constructor() {
        // Define the player position before creating the player
        this.playerPosition = { x: width / 2, y: height - 150 }; // Adjust y-position to be above the ground

        // Battle specifics
        this.bossHealth = 3;
        this.playerHealth = 3;
        this.bossPosition = { x: width / 2, y: 100 }; // Starting position for the boss
        this.bossMovingDirection = 1; // 1 for right, -1 for left
        this.isBossVulnerable = false;
        
        // Create the player with the correct position
        this.player = new Player(this.playerPosition.x, this.playerPosition.y - 50, walk_animation, idle_animation, jump_animation, push_animation, interact_animation, death_animation, this.box);
        
        this.playerAttackActive = false;
        this.playerAttackRadius = 0;
        this.attackPromptActive = false;
        
        // Create the boss sprite and add animations
        this.bossSprite = createSprite(this.bossPosition.x, this.bossPosition.y);
        this.bossSprite.addAnimation('move', droneMove);
        this.bossSprite.addAnimation('drop', droneDrop);
        this.bossSprite.scale = 3; // This will double the size of the sprite
        this.bossSprite.setDefaultCollider();

        // Set the boss to start moving immediately
        this.bossSprite.changeAnimation('move'); 
        this.capsules = []; // Array to keep track of dropped capsules
        this.state = 'intro'; // States: 'intro', 'battle', 'end'
        this.introDuration = 300; // Duration for intro in frames (e.g., 5 seconds at 60 fps)
        this.timer = 0;
        this.onGround = true;
        platforms = [];
        this.vulnerabilityTimer = 0;
        this.postVulnerabilityPauseTimer = 0;
        this.bossMoving = true;
        this.vulnerabilityCooldownTimer = 0;
    }

    update() {
        switch (this.state) {
            case 'intro':
                this.timer++;
                if (this.timer > this.introDuration) {
                    this.startBattle();
                }
                break;
            case 'battle':
                this.updateBattle();
                break;
            case 'end':
                // Handle end state if necessary
                break;
        }
    }

    updateBattle() {
        // Boss logic
        this.moveBoss();
        this.bossSprite.position.x = this.bossPosition.x; // Sync sprite position with boss logic
    
        // Player logic
        this.player.update();
        this.onGround = this.player.sprite.position.y >= height - 150; // Check ground collision
        this.player.onGround = this.onGround; // Update player's onGround state
    
        // Collision with platforms
        platforms.forEach(platform => this.player.sprite.collide(platform));
    
        // Manage vulnerability timer
        if (this.isBossVulnerable) {
            this.vulnerabilityTimer--;
            if (this.vulnerabilityTimer <= 0) {
                // Reset boss state after vulnerability period
                this.isBossVulnerable = false;
                this.bossSprite.changeAnimation('move');
                this.postVulnerabilityPauseTimer = 60; // Keep boss stationary for 1 second after drop animation
                
                this.spawnCapsule(); // Spawn a capsule
            }
        }
        // Post-vulnerability pause
        if (this.postVulnerabilityPauseTimer > 0) {
            this.postVulnerabilityPauseTimer--;
            if (this.postVulnerabilityPauseTimer === 0) {
                // Boss starts moving again
                this.bossMoving = true;
            }
        }
        // Decrease the vulnerability cooldown timer
        if (this.vulnerabilityCooldownTimer > 0) {
            this.vulnerabilityCooldownTimer--;
        }
    
        // Capsules logic
        this.updateCapsules();
    
        // Player attack logic
        this.checkPlayerAttack();
    
        // Boss vulnerability logic
        this.checkBossVulnerability();
    
        // Health checks
        this.checkPlayerHealth();

        // Check for boss defeat
        if (this.bossHealth <= 0) {
            this.handleBossDefeat();
        }

        // Check for player defeat
        if (this.playerHealth <= 0) {
            this.handlePlayerDefeat();
        }
    }

    handleBossDefeat() {
        // Rotate and move the boss sprite off-screen
        this.bossSprite.rotation += 5; // Rotate by 5 degrees each frame
        this.bossSprite.position.y += 5; // Move downwards

        // Check if the boss is off-screen
        if (this.bossSprite.position.y > height) {
            currentState = new GameOverState('win'); // Transition to victory screen
        }
    }

    handlePlayerDefeat() {
        // Trigger player's death animation
        this.player.sprite.changeAnimation('death');
        this.player.isDead = true; // Add an isDead flag in the Player class

        // Transition to game over state after the animation ends
        if (this.player.sprite.animation.getFrame() === this.player.sprite.animation.getLastFrame()) {
            currentState = new GameOverState('lose'); // Transition to game over screen
        }
    }

    moveBoss() {
        const bossSpeed = 3;
        const changeDirectionChance = 0.01;
        const vulnerabilityChance = 0.01 ; // Adjusted for higher vulnerability occurrence
    
        // Boss moves left or right if not in the post-vulnerability pause
        if (this.bossMoving) {
            this.bossPosition.x += this.bossMovingDirection * bossSpeed;
            if (this.bossPosition.x < 0 || this.bossPosition.x > width) {
                this.bossPosition.x = constrain(this.bossPosition.x, 0, width);
                this.bossMovingDirection *= -1;
            }
    
            // Change direction randomly
            if (random() < changeDirectionChance) {
                this.bossMovingDirection *= -1;
            }
        }
    
        // Update sprite position
        this.bossSprite.position.x = this.bossPosition.x;
    
        // Trigger vulnerability only if cooldown timer is 0 and boss is not already vulnerable
        if (!this.isBossVulnerable && this.vulnerabilityCooldownTimer === 0 && random() < vulnerabilityChance) {
            this.bossSprite.changeAnimation('drop');
            this.isBossVulnerable = true;
            this.attackPromptActive = true;
            this.vulnerabilityTimer = 60; // 1 second at 60 fps
            this.bossMoving = false; // Stop boss movement during vulnerability
            this.vulnerabilityCooldownTimer = 300; // 5 seconds cooldown
        }
    }
    
    // checkBossVulnerability() {
    //     // Logic to determine when the boss is vulnerable
    //     if (!this.isBossVulnerable && random() < changeDirectionChance) {
    //         // Boss becomes vulnerable - switch to the drop animation and trigger the attack prompt
    //         this.bossSprite.changeAnimation('drop');
    //         this.bossSprite.animation.rewind(); // Start the drop animation from the beginning
    //         this.isBossVulnerable = true;
    //         this.attackPromptActive = true;
    //     }
    // }

    checkPlayerAttack() {
        // Check if the space bar is pressed to initiate an attack
        if (this.attackPromptActive && keyWentDown('SPACE')) {
            this.playerAttackActive = true;
            this.attackPromptActive = false; // Prompt should disappear after the attack
        }

        // If the attack is active, expand the circle
        if (this.playerAttackActive) {
            this.playerAttackRadius += 20 ; // Example expansion rate
            if (dist(this.playerPosition.x, this.playerPosition.y, this.bossPosition.x, this.bossPosition.y) <= this.playerAttackRadius) {
                this.playerAttackActive = false;
                this.playerAttackRadius = 0;
                if (this.isBossVulnerable) {
                    this.bossHealth--;
                    this.isBossVulnerable = false; // Boss is no longer vulnerable after being hit
                }
            }
        }
    }

    checkBossVulnerability() {
        // Logic to determine when the boss is vulnerable
    }

    checkPlayerHealth() {
        // Logic to check for player's health and handle game over condition
    }

    startBattle() {
        this.state = 'battle';
        // Initialize or reset battle specifics
        // Define the ground platform
        let groundPlatform = createSprite(width / 2, height - 10, width, 20); // Adjust height as needed
        groundPlatform.immovable = true; // Make sure the platform doesn't move when the player collides with it

        // Optionally, you can add a visual representation to the platform if you have an image for it
        // groundPlatform.addImage(somePlatformImage);

        platforms.push(groundPlatform); // Add the ground platform to the platforms array
    }

    draw() {
        switch (this.state) {
            case 'intro':
                this.drawIntro();
                break;
            case 'battle':
                this.drawBattle();
                break;
            case 'end':
                // Handle end drawing if necessary
                break;
        }
    }

    drawIntro() {
        background(0); // Black screen

        // Fade in text and images based on timer
        let alpha = map(this.timer, 0, this.introDuration / 2, 0, 255);
        fill(255, 255, 255, alpha);
        textSize(32);
        textAlign(CENTER, CENTER);
        text("You have found 2 artifacts", width / 2, height / 4);

        // Fade in artifact images
        let artifactY = height / 2;
        let artifactX = width / 4;
        let artifactSpacing = width / 2;
        tint(255, alpha);
        image(artifactOneImage, artifactX - artifactOneImage.width / 2, artifactY);
        image(artifactTwoImage, artifactX + artifactSpacing - artifactTwoImage.width / 2, artifactY);
        noTint();
    }

    drawBattle() {
        // Draw the player, boss, and any other battle elements here
        background(spaceBackground); // Example battle background
    
        // Draw boss based on its current state
        drawSprite(this.bossSprite);

        if (this.isBossVulnerable) {
            noFill();
            stroke(255, 0, 0); // Red outline
            strokeWeight(3);
            ellipse(this.bossSprite.position.x, this.bossSprite.position.y, this.bossSprite.width + 20);
        }
    
        // Draw the player's sprite
        this.player.display();
    
        // Draw the expanding circle if the player attack is active
        if (this.playerAttackActive) {
            noFill();
            stroke(0, 255, 0);
            ellipse(this.player.sprite.position.x, this.player.sprite.position.y, this.playerAttackRadius * 2);
        }
    
        // Draw capsules
        this.capsules.forEach(capsule => {
            // Assuming capsule is a sprite with its own draw method or use drawSprite(capsule)
            drawSprite(capsule);
        });
    
        // Draw boss health
        this.drawBossHealth();
    
        // Draw player health
        this.drawPlayerHealth();
    
        // If the boss is vulnerable, show the attack prompt
        if (this.isBossVulnerable) {
            this.drawAttackPrompt();
        }
    }

    spawnCapsule() {
        // Spawn a capsule at the boss's position
        let newCapsule = createSprite(this.bossPosition.x, this.bossPosition.y);
        newCapsule.scale = 3; // triple the size of the capsule
        newCapsule.addAnimation('falling', capsule);
    
        // Set the animation to not loop
        newCapsule.animation.looping = false;
    
        // Start playing the animation
        newCapsule.animation.play();
    
        this.capsules.push(newCapsule);
    }

    updateCapsules() {
        for (let i = this.capsules.length - 1; i >= 0; i--) {
            let capsule = this.capsules[i];
    
            // If the animation has finished, stop updating the capsule
            if (capsule.animation.getFrame() === capsule.animation.getLastFrame()) {
                capsule.animation.stop();
            }
    
            // Capsule falling logic
            capsule.position.y += 3; // Capsule falling speed
    
            // Check if capsule hits the ground
            if (capsule.position.y >= height - 10) {
                capsule.remove(); // Remove the capsule
                this.capsules.splice(i, 1);
                this.playerHealth--; // Decrease player health
            }
        }
    }

    drawBossHealth() {
        fill(255);
        textSize(20);
        text(`Boss Health: ${this.bossHealth}`, 10, 20);
    }

    drawPlayerHealth() {
        fill(255);
        textSize(20);
        text(`Player Health: ${this.playerHealth}`, width - 150, 20);
    }

    drawAttackPrompt() {
        fill(255);
        textSize(32);
        textAlign(CENTER, CENTER);
        // Make sure to draw the prompt at a visible position on the canvas
        text('Hit SPACE!', width / 2, height / 2);
    }
}