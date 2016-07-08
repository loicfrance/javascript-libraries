Game.Map = (function(){
    
  //______________________________________________________________________________
  //-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# Constructor
  var GameMap = function( canvas , width, height) {
    this.context2d = canvas.getContext('2d');
    this.context2d.font="20px Verdana";
    this.gameWidth = width | canvas.width;
    this.gameHeight = height | canvas.height;
    this.visibleRect = new Rect(0, 0, width, height);
  };
  //______________________________________________________________________________
  //-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# background color
  GameMap.prototype.setBgColor = function( color ) {
    this.context2d.canvas.style.background = color;
  };
  GameMap.prototype.getBg = function() {
    return this.context2d.canvas.style.background;
  };
  //______________________________________________________________________________
  //-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# pointer position
  GameMap.prototype.setPointerPosition = function(/*x, y | vec2*/) {
    switch(arguments.length) {
      case 1 : this.pointerPos = Vec2.copy(arguments[0]); break;
      case 2 : this.pointerPos = new Vec2(x, y); break;
    }
    var hud = this.getHud();
    if(!isNull(hud)) {
      hud.mouseMove(this.pointerPos);
    }
  };
  GameMap.prototype.getPointerPosition = function() {
    if(!isNull(this.pointerPos)) return this.pointerPos;
    else return Vec2.ZERO;
  };
  //______________________________________________________________________________
  //-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# fullWindow
  GameMap.prototype.useFullWindow = function(use, borderMargin) {
    if(!exists(use)) use = true;
    else if(!isNaN(use)) borderMargin = use; use = true;
    if(this.onWindowResize) {
      window.removeEventListener('resize',
          this.onWindowResize.bind(this), false);
      document.removeEventListener('fullscreenchange',
          this.onWindowResize.bind(this), false);
    }
    if(use) {
      if(isNaN(borderMargin)) bordermargin = 0;
      document.body.style.margin = 0;
      console.log("register resize listener");
      var ratio = this.getVisibleRect().ratio();
      this.onWindowResize = function(full, event) {
        var w = window.innerWidth-borderMargin;
        var h = Math.min(window.innerHeight-borderMargin, w/ratio);
        w = h*ratio;
        var mLeft = (window.innerWidth-w)/2;
        var mTop = (window.innerHeight-h)/2;
        
        this.context2d.canvas.width = w;
        this.context2d.canvas.height = h;
        this.context2d.canvas.style.marginLeft= mLeft.toString() + "px";
        this.context2d.canvas.style.marginTop = mTop.toString() + "px";
        var scaleX = w/this.visibleRect.width(),
            scaleY = h/this.visibleRect.height();
        this.context2d.transform(scaleX, 0, 0, scaleY, 0, 0);
      };
      window.addEventListener('resize',
          this.onWindowResize.bind(this, false), false);
      document.addEventListener("fullscreenchange",
          this.onWindowResize.bind(this, true), false);
      
      this.onWindowResize();
    }
  };
  //______________________________________________________________________________
  //-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# visibleRect, gameRect
  GameMap.prototype.setVisibleRect = function( rect ) {
    this.visibleRect.setRect(rect);
    var gameWidth = rect.width(), gameHeight = rect.height();
    var scaleX = gameWidth ? this.context2d.canvas.width/gameWidth : 1,
        scaleY = gameHeight ? this.context2d.canvas.height/gameHeight : 1;
    this.context2d.transform(scaleX, 0, 0, scaleY, 0, 0);
  };
  GameMap.prototype.getVisibleRect = function() {
    return this.visibleRect;
  };
  GameMap.prototype.getGameRect = function() {
    return new Rect(0,0, this.gameWidth, this.gameHeight);
  };
  //______________________________________________________________________________
  //-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# coordinates pixel <-> game
  GameMap.prototype.gameCoordsFromPixelCoords = function( pixelCoords, out ) {
    var scaleX = this.getGamePixelScaleX();
    var scaleY = this.getGamePixelScaleY();
    var startX = this.getVisibleRect().left;
    var startY = this.getVisibleRect().top;
    if(isNull(out)) out = {};
    out.x = pixelCoords.x*scaleX+startX; out.y = pixelCoords.y*scaleY+startY;
    return out;
  };
  GameMap.prototype.pixelCoordsFromGameCoords = function( gameCoords, out ) {
    var scaleX = 1/this.getGamePixelScaleX();
    var scaleY = 1/this.getGamePixelScaleY();
    var startX = this.getVisibleRect().left;
    var startY = this.getVisibleRect().top;
    if(isNull(out)) out = {};
    return out.set((gameCoords.x-startX)*scale, (gameCoords.y-startY));
  };
  GameMap.prototype.getGamePixelScaleX = function() {
    return this.getVisibleRect().width()/this.context2d.canvas.width;
  };
  GameMap.prototype.getGamePixelScaleY = function() {
    return this.getVisibleRect().height()/this.context2d.canvas.height;
  };
  //______________________________________________________________________________
  //-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# hud
  GameMap.prototype.addHudView = function( hudView ) {
    if(isNull(this.hud)) this.hud = [];
    this.hud.push(hudView);
  };
  GameMap.prototype.removeHudView = function(hudView) {
    this.hud.remove(hudView);
  };
  GameMap.prototype.getHudViews = function() {
    return this.hud;
  };
  //______________________________________________________________________________
  //-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# debug
  GameMap.prototype.showDebug = function( show ) {
    this.debug = show;
  };
  GameMap.prototype.isDebug = function() { return this.debug; };
  
  //______________________________________________________________________________
  //-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# render
  GameMap.LAYER_NONE = -1;
  GameMap.LAYER_BG1 = 0;
  GameMap.LAYER_BG2 = 1;
  GameMap.LAYER_BG3 = 2;
  GameMap.LAYER_OBJ1 = 3;
  GameMap.LAYER_OBJ2 = 4;
  GameMap.LAYER_OBJ3 = 5;
  GameMap.LAYER_PARTCILES = 6;
  GameMap.prototype.render = function ( gameManager, objects ) {
    var ctx = this.context2d;
    ctx.save();
    var rect = this.getVisibleRect();
    ctx.clearRect(0, 0, rect.width(), rect.height());
    var objs = [];
    /** layers use (example):
     * <0 : not rendered;
     * 0 : background 1 (eg: far background (mountains, sky, ...));
     * 1 : background 2 (eg: mid-distance background (walls, buildings, ...));
     * 2 : background 3 (eg: near background (room stuff, ...));
     * 3 : objects 1 (eg: obstacles, platforms);
     * 4 : objects 2 (eg: enemies, player);
     * 5 : objects 3 (eg: bullets);
     * 6 : particles.
     *    Feel free to add or remove any layer. for example,
     * to disable the particles, don't render the 6th layer.
     * If you want to put things above the 6th layer, modify
     * the code below to enable the 7th layer or use hud views
     * Be aware that too many layers can slow down the game.
     */
    for(var l=0; l<= 6; l++) {
      objs = objects.filter(GameObject.renderLayerFilter.bind(undefined, l));
      for(var i=0; i< objs.length; i++)
        if(!objs[i].isOutOfMap(rect)) {
          objs[i].render(ctx);
          if(this.debug) objs[i].renderDebug(ctx);
      }
    }
    ctx.restore();
    this.showMouseOverInfos(gameManager, objects);
  };
  GameMap.prototype.getObjectAt = function( objects, point ) {
    var nearest = null;
    var minDist = Number.MAX_SAFE_INTEGER;
    var pos, dist;
    var len = objects.length;
    var obj;
    for(var i=0; i<len; i++) { obj = objects[i];
      if(!isNull(obj.renderMouseOver))
      pos = obj.getPosition();
      if(!isNull(pos)) {
        dist = Vec2.distance(pos, this.pointerPos);
        if(dist < minDist && obj.getRenderRect().contains(this.pointerPos)) {
          nearest = obj;
          minDist = dist;
        }
      }
    }
    return nearest;
  };
  GameMap.prototype.getContextMenu = function() {
    return "";
  };
  GameMap.prototype.showMouseOverInfos = function( gameManager, objects ) {
    if(!isNull(this.pointerPos)) {
      var nearest = this.getObjectAt(objects, this.pointerPos);
      if(!isNull(nearest))
        nearest.renderMouseOver(this.context2d, this.pointerPos, gameManager, this.debug);
    }
  };
  return GameMap;
})();



