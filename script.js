let highestZ = 1;

class Paper {
  holdingPaper = false;
  
  // Mouse variables
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  
  // Touch variables
  touchStartX = 0;
  touchStartY = 0;
  touchMoveX = 0;
  touchMoveY = 0;
  prevTouchX = 0;
  prevTouchY = 0;
  
  // Movement velocities and rotation
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;
  
  // Click vs Drag detection
  startX = 0;
  startY = 0;
  hasMoved = false;

  init(paper) {
    // --- MOUSE LISTENERS ---
    document.addEventListener('mousemove', (e) => {
      if(!this.rotating) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        
        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }
        
      const dirX = e.clientX - this.mouseTouchX;
      const dirY = e.clientY - this.mouseTouchY;
      const dirLength = Math.sqrt(dirX*dirX+dirY*dirY);
      const dirNormalizedX = dirX / (dirLength || 1);
      const dirNormalizedY = dirY / (dirLength || 1);

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = 180 * angle / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;
      if(this.rotating) {
        this.rotation = degrees;
      }

      if(this.holdingPaper) {
        // Calculate total movement distance from mouse start
        const dx = e.clientX - this.startX;
        const dy = e.clientY - this.startY;
        if(Math.sqrt(dx*dx + dy*dy) > 6) {
          this.hasMoved = true;
        }

        if(!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    });

    paper.addEventListener('mousedown', (e) => {
      if(this.holdingPaper) return; 
      this.holdingPaper = true;
      
      paper.style.zIndex = highestZ;
      highestZ += 1;
      
      this.startX = e.clientX;
      this.startY = e.clientY;
      this.hasMoved = false;

      if(e.button === 0) {
        this.mouseTouchX = this.startX;
        this.mouseTouchY = this.startY;
        this.prevMouseX = this.startX;
        this.prevMouseY = this.startY;
      }
      if(e.button === 2) {
        this.rotating = true;
      }
    });

    window.addEventListener('mouseup', (e) => {
      if (this.holdingPaper) {
        this.holdingPaper = false;
        this.rotating = false;
        
        // If it was a click and not a drag, fire click handler
        if (!this.hasMoved && e.button === 0) {
          this.onPaperClick(paper);
        }
      }
    });

    // --- TOUCH LISTENERS (Mobile support) ---
    paper.addEventListener('touchmove', (e) => {
      // Prevent screen scrolling when dragging elements
      e.preventDefault();
      
      if(!this.rotating) {
        this.touchMoveX = e.touches[0].clientX;
        this.touchMoveY = e.touches[0].clientY;
        
        this.velX = this.touchMoveX - this.prevTouchX;
        this.velY = this.touchMoveY - this.prevTouchY;
      }
        
      const dirX = e.touches[0].clientX - this.touchStartX;
      const dirY = e.touches[0].clientY - this.touchStartY;
      const dirLength = Math.sqrt(dirX*dirX+dirY*dirY);
      const dirNormalizedX = dirX / (dirLength || 1);
      const dirNormalizedY = dirY / (dirLength || 1);

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = 180 * angle / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;
      if(this.rotating) {
        this.rotation = degrees;
      }

      if(this.holdingPaper) {
        // Calculate touch distance from start
        const dx = e.touches[0].clientX - this.startX;
        const dy = e.touches[0].clientY - this.startY;
        if(Math.sqrt(dx*dx + dy*dy) > 6) {
          this.hasMoved = true;
        }

        if(!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevTouchX = this.touchMoveX;
        this.prevTouchY = this.touchMoveY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    }, { passive: false });

    paper.addEventListener('touchstart', (e) => {
      if(this.holdingPaper) return; 
      this.holdingPaper = true;
      
      paper.style.zIndex = highestZ;
      highestZ += 1;
      
      this.startX = e.touches[0].clientX;
      this.startY = e.touches[0].clientY;
      this.hasMoved = false;
      
      this.touchStartX = this.startX;
      this.touchStartY = this.startY;
      this.prevTouchX = this.startX;
      this.prevTouchY = this.startY;
    });

    paper.addEventListener('touchend', () => {
      if (this.holdingPaper) {
        this.holdingPaper = false;
        this.rotating = false;
        
        if (!this.hasMoved) {
          this.onPaperClick(paper);
        }
      }
    });

    // Multi-touch gestures (pinching/rotating)
    paper.addEventListener('gesturestart', (e) => {
      e.preventDefault();
      this.rotating = true;
    });
    
    paper.addEventListener('gestureend', () => {
      this.rotating = false;
    });
  }

  onPaperClick(paper) {
    if (paper.classList.contains('envelope')) {
      openBirthdayCard();
    }
  }
}

// Instantiate papers
const papers = Array.from(document.querySelectorAll('.paper'));
papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
function openBirthdayCard() {
  window.location.href = 'question.html';
}