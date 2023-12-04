class LaserGate {
  constructor(x, y, frames, scaleWidth, scaleHeight) {
      this.x = x;
      this.y = y;
      this.frames = frames; // Array to hold each frame of the animation
      this.currentFrame = 0;
      this.animationSpeed = 0.1;
      this.scaleWidth = scaleWidth;
      this.scaleHeight = scaleHeight;
      this.disabled = false; // Initially the laser gate is active
      this.sprite = createSprite(this.x + scaleWidth / 2, this.y + scaleHeight / 2, scaleWidth, scaleHeight);
      this.sprite.visible = false; // Make the sprite invisible since we only use it for collisions
  }

  display() {
      if (!this.disabled && this.frames && this.frames.length > 0) {
          let index = Math.floor(this.currentFrame) % this.frames.length;
          image(this.frames[index], this.x, this.y, this.scaleWidth, this.scaleHeight);
          this.currentFrame += this.animationSpeed;
          if (this.currentFrame >= this.frames.length) {
              this.currentFrame = 0;
          }
      }
  }

  // Call this method to disable the laser gate
  disable() {
    this.disabled = true;
    this.sprite.remove(); // This will remove the sprite from the game, making it no longer check for collisions
  }

  // Call this method to check if the laser gate is currently active
  isActive() {
      return !this.disabled;
  }
}