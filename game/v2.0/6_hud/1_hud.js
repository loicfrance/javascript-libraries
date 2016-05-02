Game.hud = {};
Game.hud.Hud = (function(){
  var Hud = function(canvas) {
    this.views = [];
    this.currentView = null;
    if(canvas) {
      this.context2d = canvas.getContext('2d');
      canvas.style.background = '#00000000';
    }
  };
  Hud.prototype.addView = function( view ) {
    this.views.push(view);
  };
  Hud.prototype.removeView = function( view ) {
    var index = this.views.indexOf(view);
    if(index >= 0) this.views.splice(index, 1);
  };
  Hud.prototype.onRectUpdate = function( rect ) {
    for(var i=0; i<view.length; i++) {
      v.onRectUpdate( rect );
    }
  };
  Hud.prototype.updateRect = function(rect) {
    requestAnimationFrame(this.render.bind(this, this.context2d,
        rect ? rect :
               new Rect(0, 0, this.context2d.canvas.width,
                              this.context2d.canvas.height)));
  };
  Hud.prototype.getChildRect = function(view) {
    return view.getRect();
  };
  Hud.prototype.getContext = function() {
    return this.context2d;
  };
  Hud.prototype.render = function( context2d, canvasRect ) {
    var len=this.views.length, i=0;
    while(i<len)this.views[i++].render(context2d, canvasRect);
  };
  Hud.prototype.mouseButton = function( btn, pressed ) {
    return !isNull(this.currentView) && this.currentView.onTouchEvent({
        position : position,
        description : pressed? Game.hud.views.EVENT_DESC.DOWN : Game.hud.views.EVENT_DESC.UP,
        button : btn
      });
  };
  Hud.prototype.mouseMove = function( position ) {
    var rect, view, done=false,
        evt= {description: Game.hud.views.EVENT_DESC.MOVE, position: new Vec2()};
    
    for(var i=this.views.length-1; i>=0; i--) {
      view = this.views[i];
      if(done && view != this.currentView) continue;
      if(view.state & Game.hud.views.STATE.INACTIVE) continue;
      rect = view.getRect();
      evt.position.set(position).add(-rect.left, -rect.top);
      if(done && view == this.currentView) { this.currentView.onTouchEvent(evt); break; }
      if(view.onTouchEvent(evt)) {
        if(isNull(this.currentView)) { this.currentView = view; break; }
        done = true; evt.description = Game.hud.views.EVENT_DESC.EXIT;
      }
    }
  };
  Hud.prototype.click = function( position, btn ) {
    console.log('onClick');
    return !isNull(this.currentView) && this.currentView.onTouchEvent({
        position : position,
        description : Game.hud.views.EVENT_DESC.CLICK,
        button : btn
      });
  };
  return Hud;
})();