/**
 * author : Loic France
 * created 05/31/2016
 */
Game.hud = {};
Game.hud.Hud = (function(){
  var Hud = function(canvas) {
    this.views = [];
    this.currentView = null;
    if(canvas) {
      this.context2d = canvas.getContext('2d');
      canvas.style.background = '#00000000';
    }
    this.alpha = 0.5;
    this.active = true; // set to false if you don't want to test mouse events on hud elements.
  };
  Hud.prototype.addView = function( view ) {
    this.views.push(view);
  };
  Hud.prototype.removeView = function( view ) {
    var index = this.views.indexOf(view);
    if(index >= 0) this.views.splice(index, 1);
  };
  Hud.prototype.setAlpha = function( alpha ) {
    this.alpha = alpha;
  };
  Hud.prototype.getAlpha = function() {
    return this.alpha;
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
    context2d.globalAlpha = this.getAlpha();
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
    if(this.active) {
      var rect, view, done=false,
          evt= {description: Game.hud.views.EVENT_DESC.MOVE, position: Vec2.zero};
      if(this.currentView) {
        if(this.currentView.hasFocus()){
          evt.position.set(position).addXY(-rect.left, -rect.top);
          if(evt.onTouchEvent(evt)) return;
          else this.currentView = null;
        }
        else this.currentView = null;
      }
      var i=this.views.length;
      var topView;
      if(i>0) while(i--) {
        view = this.views[i];
        if(view.state & Game.hud.views.STATE.INACTIVE) continue;
        rect = view.getRect();
        if(view == this.currentView || rect.contains(position)) {
          evt.position.set(position).addXY(-rect.left, -rect.top);
          if(!topView && (view != this.currentView || rect.contains(position)))
            topView = view;
          if(view.onTouchEvent(evt)) {
            evt.description = Game.hud.views.EVENT_DESC.EXIT;
            if(this.currentView) this.currentView.onTouchEvent(evt);
            this.currentView = view;
            break;
      } } }
      if(!this.currentView && topView) this.currentView = topView;
    }
  };
  Hud.prototype.click = function( position, btn ) {
    return !isNull(this.currentView) && this.currentView.onTouchEvent({
        position : position,
        description : Game.hud.views.EVENT_DESC.CLICK,
        button : btn
      });
  };
  return Hud;
})();