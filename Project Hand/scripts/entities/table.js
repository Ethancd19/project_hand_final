// Table.js

class Table {
    constructor(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
  
      // Properties for the top and bottom thin rectangles
      this.thickness = 30;
    }
  
    draw() {
      // Drawing the main body (with gradient effect)
      const gradient = this._getGradient(this.y, this.y + this.height);
      rect(this.x, this.y, this.width, this.height, gradient);
  
      // Drawing the top and bottom thin rectangles
      fill(128); // Gray color
      rect(this.x, this.y, this.width, this.thickness);
      rect(this.x, this.y + this.height - this.thickness, this.width, this.thickness);
    }
  
    _getGradient(y1, y2) {
      const gradient = drawingContext.createLinearGradient(0, y1, 0, y2);
      gradient.addColorStop(0, 'grey');
      gradient.addColorStop(0.5, 'darkgrey');
      gradient.addColorStop(1, 'grey');
      return gradient;
    }
  
    checkCollision(player) {
      // Top rectangle collision
      if (player.x + player.width > this.x && 
          player.x < this.x + this.width &&
          player.y + player.height > this.y && 
          player.y < this.y + this.thickness) {
          player.y = this.y - player.height;
          player.velocityY = 0;
      }
  
      // Bottom rectangle collision
      if (player.x + player.width > this.x && 
          player.x < this.x + this.width &&
          player.y + player.height > this.y + this.height - this.thickness && 
          player.y < this.y + this.height) {
          player.y = this.y + this.height - this.thickness - player.height;
          player.velocityY = 0;
      }
  
      // Prevent player from passing through the sides
      if (player.y + player.height > this.y &&
          player.y < this.y + this.height) {
          if (player.x < this.x && player.x + player.width > this.x) {
              player.x = this.x - player.width;
          }
          if (player.x + player.width > this.x + this.width && player.x < this.x + this.width) {
              player.x = this.x + this.width;
          }
      }
    }
  }