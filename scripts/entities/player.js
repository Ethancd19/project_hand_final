// player.js

class Player {
  constructor(x, y, walkAnim, idleAnim, jumpAnim, pushanim, interactanim, deathanim, boxSprite) {
    console.log('Box sprite in Player constructor:', boxSprite);
    this.sprite = createSprite(x, y, 120, 120);
    this.sprite.addAnimation('walk', walkAnim);
    this.sprite.addAnimation('idle', idleAnim);
    this.sprite.addAnimation('jump', jumpAnim);
    this.sprite.addAnimation('interact', interactanim);
    this.sprite.addAnimation('push', pushanim);
    this.sprite.addAnimation('death', deathanim);
    //this.sprite.addAnimation('wall_jump', wallJumpAnim);
    this.sprite.changeAnimation('idle'); // Start with the idle animation
    this.sprite.setCollider('rectangle', 0, 0, 100, 100);
    this.walkSpeed = 3;
    this.jumpForce = -10;
    this.isJumping = false;
    this.box = boxSprite;
    // Flag to indicate if the interaction is in progress
    this.isInteracting = false;
    this.interactComplete = false; // Flag to check if interaction animation is complete
    // Flag to toggle hitbox visibility
    this.showHitbox = false;
    this.onWall = false;
  }

  moveRight() {
    this.sprite.velocity.x = this.walkSpeed;
    this.sprite.changeAnimation('walk');
    this.sprite.mirrorX(1); // Face right
  }

  moveLeft() {
    this.sprite.velocity.x = -this.walkSpeed;
    this.sprite.changeAnimation('walk');
    this.sprite.mirrorX(-1); // Face left
  }

  jump() {
    if (!this.isJumping) {
        this.isJumping = true;
        // Check if SHIFT is held down for jump boost
        if (keyIsDown(SHIFT)) {
            this.sprite.velocity.y = this.jumpForce * 1.5; // Increase the jump force by 50%
        } else {
            this.sprite.velocity.y = this.jumpForce;
        }
        this.sprite.changeAnimation('jump');
    }
  }

  stop() {
    this.sprite.velocity.x = 0;
    this.sprite.changeAnimation('idle');
  }

  interact() {
    if (currentState instanceof level0State) {
      this.interactWithBox();
    } else if (currentState instanceof level1State) {
      this.interactWithLaserGate();
    }
  }

  interactWithBox() {
    console.log('Checking for interaction...'); // Log to indicate interaction check
    if (!this.box) {
      console.error('Box sprite is not defined in Player');
      return;
    }
    if (keyWentDown('E')) {
      console.log('E key pressed');
      const interactionThreshold = 100;
      let distance = dist(this.sprite.position.x, this.sprite.position.y, this.box.position.x, this.box.position.y);
      console.log(`Distance to box: ${distance}`);
      if (distance < interactionThreshold) {
        console.log('Within interaction range. Starting interaction animation.');
        this.isInteracting = true;
        this.sprite.changeAnimation('interact');
        this.sprite.animation.rewind(); 
      }
    }
  }

  interactWithLaserGate() {
    if (this.isNearLaserControl()){
      if (keyWentDown('E')) {
        currentState.deactivateLaserGate();
      }
    }
  }

  isNearLaserControl(){

  }
  update() {
    // Apply gravity
    this.sprite.velocity.y += GRAVITY;
    if (this.isDead) return; // Stop updating if the player is dead
    let onGround; // Define onGround locally within the update method

    if (currentState instanceof FinalBattle) {
        // In FinalBattle, check if the player is on the ground
        onGround = this.sprite.position.y >= height - 150; // Adjust as needed
        if (onGround) {
            this.isJumping = false;
            if (this.sprite.velocity.x === 0) {
                this.sprite.changeAnimation('idle');
            }
        } else {
            this.isJumping = true;
        }
    } else {
        // For other states, use existing ground collision logic
        onGround = this.handleCollisionsAndGravity();
    }

    // Walking, pushing, idle, and jump animations
    this.handleMovementAnimations(onGround);
    // ... rest of the update method ...

    // If the player is interacting, check if the animation is done
    if (this.isInteracting) {
      console.log('Interaction animation playing...');
      if (this.sprite.animation.getFrame() === this.sprite.animation.getLastFrame()) {
        console.log('Interaction animation completed.');
        this.isInteracting = false;
        startMinigame(); // Start the minigame
      }
    }

    // If interaction has just finished, trigger the minigame
    if (this.isInteracting && this.sprite.animation.getFrame() === this.sprite.animation.getLastFrame()) {
      this.isInteracting = false;
      startMinigame(); // Start the minigame after interaction is complete
    }

    // Walking, pushing, idle, and jump animations
    this.handleMovementAnimations(onGround);
    if (currentState instanceof FinalBattle) {
      // Constrain the player's horizontal movement
      this.sprite.position.x = constrain(this.sprite.position.x, 0, width);

      // Constrain the player's vertical movement to the battle area
      this.sprite.position.y = constrain(this.sprite.position.y, height - 150, height);
    }
    let collidedWithWall = false;
    for (let platform of platforms) {
      if (platform.isWall && this.sprite.collide(platform)) {
        collidedWithWall = true;
        this.onWall = true;
        break;
      }
    }

    if (!collidedWithWall) {
      this.onWall = false;
    }

    // Handle wall jump logic
    if (this.onWall && this.isJumping) {
      // Set animation to wall jump and apply a force
      this.sprite.changeAnimation('wallJump');
      // Apply a force to jump off the wall
      // Adjust the force direction and magnitude as needed
      this.sprite.velocity.x = -this.walkSpeed;
      this.sprite.velocity.y = this.jumpForce;
    }
  }
  
  handleCollisionsAndGravity() {
    let onGround = false;

    // Handle collisions and gravity differently based on the current game state
    if (currentState instanceof FinalBattle) {
        // In FinalBattle, the player should not fall below a certain level
        if (this.sprite.position.y >= height - 150) { // 150 pixels above the bottom
            this.sprite.position.y = height - 150;
            this.sprite.velocity.y = 0;
            onGround = true;
            this.isJumping = false;
        } else {
            this.sprite.velocity.y += GRAVITY;
        }
    } else {
        // For other game states, use existing logic
        for (let platform of platforms) {
            if (this.sprite.collide(platform)) {
                onGround = true;
                this.isJumping = false;
                this.sprite.velocity.y = 0;
            }
        }
  
        if (!onGround && this.sprite.position.y < height - this.sprite.height / 2) {
            this.isJumping = true;
        }
  
        if (this.sprite.position.y >= height - this.sprite.height / 2) {
            this.sprite.position.y = height - this.sprite.height / 2;
            this.sprite.velocity.y = 0;
            this.isJumping = false;
        }
    }

    return onGround;
}
  
  handleMovementAnimations(onGround) {
    // If colliding with the box and moving, change to 'push' animation
    if (this.box && this.sprite.collide(this.box) && this.sprite.velocity.x !== 0) {
      this.sprite.changeAnimation('push');
    } 
    // If on the ground and not moving, change to 'idle' animation
    else if (onGround && this.sprite.velocity.x === 0) {
      this.sprite.changeAnimation('idle');
    } 
    // If jumping, change to 'jump' animation
    else if (this.isJumping) {
      this.sprite.changeAnimation('jump');
    } 
    // If moving, change to 'walk' animation
    else if (this.sprite.velocity.x !== 0) {
      this.sprite.changeAnimation('walk');
    }
  }
  
  // interact() {
  //   // Called from the main game loop, not shown here
  //   if (keyWentDown('E')) {
  //     this.isInteracting = true;
  //     this.sprite.changeAnimation('interact');
  //     this.sprite.animation.rewind(); // Rewind to play the animation from start
  //     this.interactComplete = false;
  //   }
  // }

  display() {
    drawSprite(this.sprite);

    // Draw the hitbox if the flag is true
    if (this.showHitbox) {
      push();
      stroke(255, 0, 0); // Red color for the hitbox
      noFill();
      rectMode(CENTER);
      rect(this.sprite.position.x, this.sprite.position.y, this.sprite.width, this.sprite.height);
      pop();
    }
  }

  // Method to toggle the hitbox visibility
  toggleHitbox() {
    this.showHitbox = !this.showHitbox;
  }
}