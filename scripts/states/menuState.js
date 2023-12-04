let isOverStartButton = false; // Flag to check if the mouse is over the start button
let isOverOptionsButton = false; // Flag to check if the mouse is over the options button
let startButtonColor;
let optionsButtonColor;
let petrolColor = [0, 95, 106];
let orangeColor = [255, 165, 0];
let labels = ["Master Volume", "Music Volume", "SFX Volume", "Narration Volume"];
let percentages = [100, 100, 100, 100]; // default percentages for each slider
let angle = 0;
let handImg;


class MenuState {
  constructor() {
    // Any initialization for the menu state
    this.menuText="";
    this.nameText="";
    this.startButtonText = "Start Game";
    this.optionsButtonText = "Options";
    this.lines = []; // Array to store the lines
    for (let i = 0; i < 20; i++) { // Create 10 lines to start with
      this.lines.push(new AnimatedLine());
    }
    this.mode = "main";
    this.optionButtons = ["Audio", "Graphics", "Gameplay", "Controls", "Accessibility", "Back to Menu"];
    this.audioSliders = [];
    this.backToOptionsButton = "Back to Options";
    this.handImg = loadImage('assets/sprites/hand.png', img => img.resize(200, 0));
    this.handX = this.handImg.width / 2;
    this.handY = height - this.handImg.height / 2;
    this.handSpeed = 2;
    this.handDirection = 'right';
    this.handAngle = 0;
    this.handOffsetX = 0;
    this.handOffsetY = 0;
    this.handVelocity = createVector(2, 0); // Initial velocity (x, y)
    this.gravity = 0.1; // Gravity affecting the jump
    this.direction = 1; // 1 for right, -1 for left
    this.isJumping = false;       // To track the jumping state
    this.jumpHeight = 50;         // The height of the jump
    this.jumpSpeed = 3;           // The speed of the jump
    this.jumpDirection = 1;       // 1 for jumping up, -1 for falling down
  }

  update() {
    angle += 0.01 ;
    // Handle any updates like checking for button presses etc.
    for (let line of this.lines) {
      line.update();
      if (line.offScreen()) {
        // Replace the line with a new one when it goes off screen
        this.lines[this.lines.indexOf(line)] = new AnimatedLine();
      }
    }

    if (mouseIsPressed) {
      if (this.mode === "main") {
        if (isOverStartButton) {
          currentState = new level0State();
        } else if (isOverOptionsButton) {
          this.mode = "options";
        }
      } else if (this.mode === "options") {
        let buttonX = width / 2 - 100; // Adjusted to center based on 200 width
        let buttonWidth = 200;
        let buttonHeight = 30;
        for (let i = 0; i < this.optionButtons.length; i++) {
          let buttonY = height / 3 + i * 50;  // Adjusted starting height and reduced distance between buttons to 50px
    
          if (isHovering(buttonX, buttonY, buttonWidth, buttonHeight)) {
            switch (this.optionButtons[i]) {
                case "Audio":
                    this.mode = "audio";  // Change the mode to "audio"
                    break;
                case "Graphics":
                    this.mode = "graphics";  // Change the mode to "graphics"
                    break;
                case "Gameplay":
                    this.mode = "gameplay";  // Change the mode to "gameplay"
                    break;
                case "Controls":
                    this.mode = "controls";  // Change the mode to "controls"
                    break;
                case "Accessibility":
                    this.mode = "accessibility";  // Change the mode to "accessibility"
                    break;
                case "Back to Menu":
                    this.mode = "main";  // Change the mode to "main"
                    break;
                default:
                    break;
            }
          }
        }
      } else if (this.mode === "audio") {
        // Handle audio options
        for (let i = 0; i < this.audioSliders.length; i++) {
          percentages[i] = this.audioSliders[i].value();
        }
        let buttonY = height - 200;
        if (isHovering(width / 2 - 85, buttonY, 200, 30)) {
            this.mode = "options";
            
            // Hide the sliders
            for (let slider of this.audioSliders) {
                slider.hide();
            }
        }
      } else if (this.mode === "graphics") {
        // Handle graphics options

      } else if (this.mode === "gameplay") {
        // Handle gameplay options
      } else if (this.mode === "controls") {
        // Handle controls options
      } else if (this.mode === "accessibility") {
        // Handle accessibility options
      }
    }
    this.updateHandPosition();     
  }

  draw() {
    if (this.mode === "main") {
      background(0); // Black background
      let alpha = map(sin(angle), -1, 1, 50, 150);  // Mapping the sin value between 50 and 150. You can adjust these values for stronger/weaker effect
      fill(70, 130, 180, alpha); // Translucent blue
      rect(0, 0, width, height);  // Covering the entire screen

  
      // Draw animated lines
      for (let line of this.lines) {
        line.draw();
      }
      // Draw main menu
      this.menuText = "Project Hand"
      this.nameText = "By: Ethan Duval"
      this.checkStartButtonHover();
      this.checkOptionsButtonHover();
      // Draw rhombus for the Start button
      drawParallelogram(width / 2 - 85, height / 2 - 12.5, 180, 30, startButtonColor);
      // Draw the start button text inside the rhombus
      textFont(icelandFont);
      textSize(35);
      fill(255);  // White text color for the button text
      text(this.startButtonText, width - 710, height / 2 + 10);
    
      // Draw rhombus for the Options button
      drawParallelogram(width / 2 - 85, height / 2 + 52.5, 180, 30, optionsButtonColor);
      // Draw the options button text inside the rhombus
      textFont(icelandFont);
      textSize(35);
      fill(255);
      text(this.optionsButtonText, width - 690, height / 2 + 74);

      // Draw the menu title
      textFont(icelandFont);
      textSize(60);
      fill(255); // White text color
      textAlign(CENTER, CENTER);
      text(this.menuText, width / 2, height / 4); // Place it in the top center part of the screen
      textSize(32);
      text(this.nameText, width / 2, height / 4 + 70); // Place it in the top center part of the screen
      this.drawHandImage();    
    } else if (this.mode === "options") {

      background(0); // Black background
      let alpha = map(sin(angle), -1, 1, 50, 150);  // Mapping the sin value between 50 and 150. You can adjust these values for stronger/weaker effect
      fill(70, 130, 180, alpha); // Translucent blue
      rect(0, 0, width, height);  // Covering the entire screen
      // Draw animated lines
      for (let line of this.lines) {
          line.draw();
      }
  
      // Draw options menu
      this.menuText = "Options";
  
      // Move buttons down slightly and bring them closer together
      for (let i = 0; i < this.optionButtons.length; i++) {
          let buttonY = height / 3 + i * 50;  // Adjusted starting height and reduced distance between buttons to 50px
          let buttonColor = isHovering(width / 2 - 85, buttonY, 190, 30) ? color(orangeColor) : color(petrolColor);
                  
          drawParallelogram(width / 2 - 100, buttonY, 200, 30, buttonColor);
          textFont(icelandFont);
          textSize(32);
          fill(255); // White text color
          textAlign(CENTER, CENTER);
          text(this.optionButtons[i], width / 2, buttonY + 10);  // The +15 centers the text in the button
      }
      // Move the title up slightly
      textFont(icelandFont);
      textSize(60);
      fill(255); // White text color
      textAlign(CENTER, CENTER);
      text(this.menuText, width / 2, height / 6);  // Adjusted height for the title
      this.drawHandImage();
    } else if (this.mode === "audio") {
      background(0); // Black background
      let alpha = map(sin(angle), -1, 1, 50, 150);  // Mapping the sin value between 50 and 150. You can adjust these values for stronger/weaker effect
      fill(70, 130, 180, alpha); // Translucent blue
      rect(0, 0, width, height);  // Covering the entire screen
      // Draw animated lines
      for (let line of this.lines) {
        line.draw();
      }
      this.menuText = "Audio";
      // Move the title up slightly
      textFont(icelandFont);
      textSize(60);
      fill(255); // White text color
      textAlign(CENTER, CENTER);
      text(this.menuText, width / 2, height / 6);  // Adjusted height for the title     


      textSize(32);
      fill(255); // White text color
      textAlign(LEFT, CENTER);
  
      if (this.audioSliders.length === 0) {
        for (let i = 0; i < labels.length; i++) {
            let slider = createSlider(0, 100, percentages[i]);
            slider.position(width / 2 + 150, height / 4 + i * 50); // Adjusted to be on the right side of the label
            this.audioSliders.push(slider);
        }
      } else {
        // If sliders already exist, just show them
        for (let slider of this.audioSliders) {
            slider.show();
        }
      }
      
      // Display the labels
      for (let i = 0; i < labels.length; i++) {
          text(labels[i] + ": " + this.audioSliders[i].value() + "%", width / 2 - 250, height / 4 + i * 50); // Adjusted the label's position
      }
      let buttonY = height - 200; // For example, 100px from the bottom. Adjust as necessary.
      let buttonColor = isHovering(width / 2 - 85, buttonY, 200, 30) ? color(orangeColor) : color(petrolColor);
              
      drawParallelogram(width / 2 - 110, buttonY, 220, 30, buttonColor);
      textSize(32);
      fill(255); // White text color
      textAlign(CENTER, CENTER);
      text(this.backToOptionsButton, width / 2, buttonY + 11);
    }
  }

  checkStartButtonHover() {
    let buttonX = width / 2 - 85;
    let buttonY = height / 2 - 12.5;
    let buttonWidth = 180;
    let buttonHeight = 30;
  
    if (isHovering(buttonX, buttonY, buttonWidth, buttonHeight)) {
        startButtonColor = color(orangeColor);
        isOverStartButton = true;
    } else {
        startButtonColor = color(petrolColor);
        isOverStartButton = false;
    }
  }
  
  checkOptionsButtonHover() {
    let buttonX = width / 2 - 85;
    let buttonY = height / 2 + 52.5;
    let buttonWidth = 180;
    let buttonHeight = 30;
  
    if (isHovering(buttonX, buttonY, buttonWidth, buttonHeight)) {
        optionsButtonColor = color(orangeColor);
        isOverOptionsButton = true;
    } else {
        optionsButtonColor = color(petrolColor);
        isOverOptionsButton = false;
    }
  }
  updateHandPosition() {
    const halfHandWidth = this.handImg.width / 2;
    const halfHandHeight = this.handImg.height / 2;
    if (this.mode === "main") {
      if (this.handDirection === 'right') {
        this.handX += this.handSpeed;
        if (this.handX > width - this.handImg.width) {
          this.handX = width - 30;
          this.handDirection = 'up';
          this.handAngle -= 90;
        }
      } else if (this.handDirection === 'up') {
        this.handY -= this.handSpeed;
        if (this.handY < halfHandHeight) {
          this.handY = 25;
          this.handDirection = 'left';
          this.handAngle -= 90;
        }
      } else if (this.handDirection === 'left') {
        this.handX -= this.handSpeed;
        if (this.handX < halfHandWidth) {
          this.handX = 25;
          this.handDirection = 'down';
          this.handAngle -= 90;
        }
      } else if (this.handDirection === 'down') {
        this.handY += this.handSpeed;
        if (this.handY > height - halfHandHeight) {
          this.handY = height-30;
          this.handDirection = 'right';
          this.handAngle -= 90;
        }
      }
    } else if (this.mode === "Options") {
      if (this.handDirection === 'right') {
        this.handX += this.handSpeed;
        if (this.handX > width - halfHandWidth) {
          this.handX = width - halfHandWidth;
          this.handDirection = 'down';
          this.handAngle += 90;
        }
      } else if (this.handDirection === 'down') {
        this.handY += this.handSpeed;
        if (this.handY > height - halfHandHeight) {
          this.handY = height - halfHandHeight;
          this.handDirection = 'left';
          this.handAngle += 90;
        }
      } else if (this.handDirection === 'left') {
        this.handX -= this.handSpeed;
        if (this.handX < halfHandWidth) {
          this.handX = halfHandWidth;
          this.handDirection = 'up';
          this.handAngle += 90;
        }
      } else if (this.handDirection === 'up') {
        this.handY -= this.handSpeed;
        if (this.handY < halfHandHeight) {
          this.handY = halfHandHeight;
          this.handDirection = 'right';
          this.handAngle += 90;
        }
      }
    }
  }

  drawHandImage() {
    push();
    translate(this.handX, this.handY);
    rotate(radians(this.handAngle));
    imageMode(CENTER);
    image(this.handImg, 0, 0);
    pop();
  }
}


// class OptionsState {
//   constructor() {
//     this.title = "Options";
//   }

//   draw() {
//     background(0);
//     textSize(60);
//     fill(255); 
//     text(this.title, width / 2, height / 4 - 70);
//   }
// }

function drawParallelogram(x, y, w, h, color) {
  fill(color);
  beginShape();
  vertex(x + h/2, y);          // Top left
  vertex(x + w + h/2, y);      // Top right
  vertex(x + w - h/2, y + h);  // Bottom right
  vertex(x - h/2, y + h);      // Bottom left
  endShape(CLOSE);
}


// Helper class for animated lines
class AnimatedLine {
  constructor() {
    this.x = random(width); 
    this.y = 0; 
    this.speed = random(2, 5); 
    this.angle = 0;
    this.changeDirProb = 0.98; 
    this.hasChangedDir = false;
    this.points = []; // Store the points the line moves through
    this.maxTrail = 150; // Maximum length of the trail
  }

  update() {
    if (!this.hasChangedDir && random(1) > this.changeDirProb) {
      this.angle = random([-PI / 4, PI / 4]);
      this.hasChangedDir = true;
    }

    this.y += this.speed * cos(this.angle); 
    this.x += this.speed * sin(this.angle); 

    this.points.push(createVector(this.x, this.y));

    if (this.points.length > this.maxTrail) {
      this.points.shift(); // Remove the oldest point to keep the trail length consistent
    }

    if (this.hasChangedDir && this.y > height / 2) {
      this.angle = 0;
      this.hasChangedDir = false; 
    }
  }

  draw() {
    stroke(0, 150, 255);
    
    // Draw the fading trail
    for (let i = 1; i < this.points.length; i++) {
      let alpha = map(i, 0, this.points.length, 0, 255);
      stroke(0, 150, 255, alpha);
      strokeWeight(2);
      line(this.points[i - 1].x, this.points[i - 1].y, this.points[i].x, this.points[i].y);
    }
  }

  offScreen() {
    return this.y > height + this.maxTrail;
  }
}