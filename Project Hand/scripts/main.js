//main.js

let currentState;
var icelandFont;
let walk_sheet;
let idle_sheet;
let jump_sheet;
let push_sheet;
let interact_sheet;
let wall_jump_sheet;
let death_sheet;
let walk_animation;
let idle_animation;
let jump_animation;
let push_animation;
let interact_animation;
let wall_jump_animation;
let death_animation;

let platformSprite;
let platform_sheet;
let box_image;
let bgImage;

let playerObj;
let GRAVITY = 0.5;

let boxAnimation;  // This will hold the box opening animation
let artifactOneImage; // This will hold the image of the artifact
let artifactTwoImage; // This will hold the image of the artifact
let artifactThreeImage; // This will hold the image of the artifact
let boxAnimationPlaying = false;
let globalDeathCount = 0; // Global death counter
let laserGateFrames = []; // Array to hold the frames of the laser gate animation
let laserGate;
let laserSourceImg;
let platforms = [];
let wallSprite;
let currentMinigame;

let moveSheet;
let dropSheet;
let capsuleSheet;
let droneMove;
let droneDrop;
let capsule;
let spaceBackground;


function preload() {
  icelandFont = loadFont('./assets/fonts/IcelandRegular.ttf');

  walk_sheet = loadSpriteSheet('./assets/sprites/walk/walk.png', 120, 120, 12);
  idle_sheet = loadSpriteSheet('./assets/sprites/idle/idle.png', 120, 120, 30);
  jump_sheet = loadSpriteSheet('./assets/sprites/jump/jump.png', 120, 120, 25);
  push_sheet = loadSpriteSheet('./assets/sprites/push/push.png', 120, 120, 21); 
  interact_sheet = loadSpriteSheet('./assets/sprites/interact/interact.png', 120, 120, 15);
  wall_jump_sheet = loadSpriteSheet('./assets/sprites/wall_jump/wall_jump.png', 120, 120, 8);
  death_sheet = loadSpriteSheet('./assets/sprites/death/death.png', 120, 120, 25);

  walk_animation = loadAnimation(walk_sheet);
  idle_animation = loadAnimation(idle_sheet);
  jump_animation = loadAnimation(jump_sheet);
  push_animation = loadAnimation(push_sheet);
  interact_animation = loadAnimation(interact_sheet);
  wall_jump_animation = loadAnimation(wall_jump_sheet);
  death_animation = loadAnimation(death_sheet);

  platform_sheet = loadImage('./assets/sprites/platform/platform.png');
  box_image = loadImage('./assets/sprites/box/box.png');
  let boxFrames = loadSpriteSheet('./assets/sprites/box/box_anim.png', 32, 54, 20);
  boxAnimation = loadAnimation(boxFrames);
  artifactOneImage = loadImage('./assets/sprites/artifacts/artifact1.png');
  artifactTwoImage = loadImage('./assets/sprites/artifacts/artifact2.png');
  bgImage = loadImage('./assets/images/backgrounds/Lab.png');
  for (let i = 1; i <= 8; i++) {
    laserGateFrames.push(loadImage(`./assets/sprites/laser_gate/laser_A_${i}.png`));
  }
  laserSourceImg = loadImage('./assets/sprites/laser_gate/laser_source.png');
  wallSprite = loadImage('./assets/sprites/wall/wall.png');

  moveSheet = loadSpriteSheet('./assets/sprites/drone/Walk.png', 48, 48, 4);
  dropSheet = loadSpriteSheet('./assets/sprites/drone/Drop.png', 48, 48, 6);
  capsuleSheet = loadSpriteSheet('./assets/sprites/drone/Capsule.png', 48, 48, 6);
  droneMove = loadAnimation(moveSheet);
  droneDrop = loadAnimation(dropSheet);
  capsule = loadAnimation(capsuleSheet);
  spaceBackground = loadImage('./assets/images/backgrounds/space.jpg');
}

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  bgImage.resize(CANVAS_WIDTH, CANVAS_HEIGHT);
  spaceBackground.resize(CANVAS_WIDTH, CANVAS_HEIGHT);
  currentState = new MenuState(); // We start with the menu state
}

function draw() {
  currentState.update(); // Update the current state
  currentState.draw(); // Draw the current state
}

function mousePressed() {
    // Check for minigame input first if the minigame is active
    if (minigameActive) {
      console.log('Mouse input for minigame...');
      if (currentState instanceof level0State) {
          checkMinigameInput(mouseX, mouseY, currentState);
      }
      return; // Return to avoid executing further code if minigame is active
  }

  // Check if the pause menu needs to be handled
  if (currentState instanceof level0State && currentState.isPaused) {
    handlePauseMenuClick(mouseX, mouseY, currentState);
  }

  // Any other global mousePressed events below...
}


// To handle key presses
function keyPressed() {
  if (currentState instanceof level0State || currentState instanceof level1State || currentState instanceof FinalBattle) {
    if (keyCode === RIGHT_ARROW) {
        currentState.player.moveRight();
    } else if (keyCode === LEFT_ARROW) {
        currentState.player.moveLeft();
    } else if (keyCode === UP_ARROW) {
        currentState.player.jump();
    } else if (keyCode === ESCAPE) {
        currentState.togglePause();
    }
    if (keyCode === 72) { // 'H' key
      if (currentState && currentState.player) {
        currentState.player.toggleHitbox();
      }
    }
    if (key === 'C') {
      this.showColliders = !this.showColliders;
    }
  }

}

function keyReleased() {
  if (currentState instanceof level0State || currentState instanceof level1State || currentState instanceof FinalBattle) {
      // Stop the player when the movement keys are released
      if (keyCode === RIGHT_ARROW || keyCode === LEFT_ARROW) {
          currentState.player.stop();
      }
  }
}