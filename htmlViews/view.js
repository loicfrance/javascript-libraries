var HTMLExtendedViews = {};
{
  class View extends HTMLCanvasElement {
    constructor() {
      super();
      this.context2d = this.getContext('2d');
      this.updateRequested = false;
    }
    update() {
      if(!this.updateRequested) {
        requestAnimationFrame(this.onFrame.bind(this));
        this.updateRequested = true;
      }
    }
    onUpdate( timeStamp ) {
      this.updateRequested = false;
      this.draw();
    }
    draw() {
      
    }
  }
}