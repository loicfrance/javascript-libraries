/**
 * author : Loic France
 * created 05/31/2016
 */
Game.Map = (function(){
    
  //______________________________________________________________________________
  //-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# Constructor
  var GameMap = function( canvas, width, height ) {
    this.context = canvas.getContext('2d');
    this.context.font = "20px Verdana";
    this.gameWidth  = width  || canvas.width ;
    this.gameHeight = height || canvas.height;
    this.visibleRect = new Rect(0, 0, this.gameWidth, this.gameHeight);
  };
  //______________________________________________________________________________
  //-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# background color
  GameMap.prototype.setBgColor = function( color ) {
    this.context.canvas.style.background = color;
    
  };
  GameMap.prototype.getBg = function() {
    return this.context.canvas.style.background;
  };
  //______________________________________________________________________________
  //-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# pointer position
  GameMap.prototype.setPointerPosition = function( position ) {
    if(this.pointerPos)this.pointerPos.set(position);
    else this.pointerPos = position.clone();
    var hud = this.getHud();
    if(!isNull(hud)) {
      hud.mouseMove(this.pointerPos);
    }
  };
  GameMap.prototype.getPointerPosition = function() {
    if(this.pointerPos) return this.pointerPos;
    else return Vec2.ZERO;
  };
  //______________________________________________________________________________
  //-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# fullWindow
  GameMap.prototype.autoResize = function(use, borderMargin) {
    if(!exists(use)) { use = true; borderMargin = 0; }
    else if(typeof use == TYPE_NUMBER) { 
      borderMargin = use; use = true;
    }
    if(this.onWindowResize) {
      window.removeEventListener('resize',
          this.onWindowNormalSize, false);
      document.removeEventListener('fullscreenchange',
          this.onWindowFullSize, false);
    }
    if(use) {
      var container = this.context.canvas.parentNode;
      if(typeof borderMargin != TYPE_NUMBER) borderMargin = 0;
      document.body.style.margin = 0;
      console.log("register resize listener");
      var ratio = this.getVisibleRect().ratio();
      this.onWindowResize = function(full, event) {
        var parentW = container.offsetWidth,
            parentH = container.offsetHeight;
        var w = parentW-borderMargin,
            h = Math.min(parentH-borderMargin, w/ratio);
        w = h*ratio;
        var left = (parentW-w)/2,
            top = (parentH-h)/2;
        this.setSize(w, h, left, top);
      };
      this.onWindowFullSize = this.onWindowResize.bind(this, true);
      this.onWindowNormalSize = this.onWindowResize.bind(this, false);
      window.addEventListener('resize',
          this.onWindowNormalSize, false);
      document.addEventListener("fullscreenchange",
          this.onWindowFullSize, false);
      
      this.onWindowResize();
    }
  };
  /**
   * listener: function(Game.Map, width, height) : void
   */
  GameMap.prototype.setOnResize = function( listener ) {
    this.resizeListener = listener;
  };
  GameMap.prototype.setSize = function(width, height, marginH, marginV) {
    var scaleX = width/this.visibleRect.width(),
        scaleY = height/this.visibleRect.height();
    this.context.canvas.width = width;
    this.context.canvas.height = height;
    this.context.canvas.style.marginLeft= marginH.toString() + "px";
    this.context.canvas.style.marginTop = marginV.toString() + "px";
    this.context.transform(scaleX, 0, 0, scaleY, 0, 0);
    if(!isNull(hud=this.getHud()) && !isNull(c=hud.getContext())) {
      c.width = width;
      c.height = height;
      c.canvas.style.marginLeft= marginH.toString() + "px";
      c.canvas.style.marginTop = marginV.toString() + "px";
      c.transform(scaleX, 0, 0, scaleY, 0, 0);
    }
    if(this.resizeListener) this.resizeListener(this, width, height);
  };
//______________________________________________________________________________
//-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# visibleRect, gameRect
  GameMap.prototype.setVisibleRect = function( rect ) {
    this.visibleRect.set(rect);
    var gameWidth = rect.width(), gameHeight = rect.height();
    var scaleX = gameWidth ? this.contexts[0].canvas.width/gameWidth : 1,
        scaleY = gameHeight ? this.contexts[0].canvas.height/gameHeight : 1;
    this.context.transform(scaleX, 0, 0, scaleY, 0, 0);
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
    return this.getVisibleRect().width()/this.context.canvas.width;
  };
  GameMap.prototype.getGamePixelScaleY = function() {
    return this.getVisibleRect().height()/this.context.canvas.height;
  };
//______________________________________________________________________________
//-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# hud
  GameMap.prototype.setHud = function( hud ) {
    this.hud = hud;
  };
  GameMap.prototype.createHud = function() {
    this.hud = new Game.hud.Hud();
  };
  GameMap.prototype.getHud = function() {
    return this.hud;
  };
//______________________________________________________________________________
//-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# debug
  GameMap.prototype.showDebug = function( show ) {
    this.debug = show;
  };
  GameMap.prototype.isDebug = function() { return this.debug; };
  GameMap.prototype.renderDebug = function( context ) { };

//______________________________________________________________________________
//-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# render
  /** layers use (example):
   * <0 : not rendered;
   * 0 : background 1 (eg: far background (mountains, sky, ...));
   * 1 : background 2 (eg : mid-distance background (walls, buildings, ...));
   * 2 : background 3 (eg: near background (room stuff, ...));
   * 3 : objects 1 (eg: obstacles, platforms);
   * 4 : objects 2 (eg: enemies, player);
   * 5 : objects 3 (eg: bullets);
   * 6 : particles.
   *  
   * Feel free to add or remove any layer by modifying the lines below.
   * For example, to disable the particles, put LAYER_NUMBER to 5.
   * 
   */
  GameMap.LAYER_NONE = -1;
  GameMap.LAYER_BG1 = 0;
  GameMap.LAYER_BG2 = 1;
  GameMap.LAYER_BG3 = 2;
  GameMap.LAYER_OBJ1 = 3;
  GameMap.LAYER_OBJ2 = 4;
  GameMap.LAYER_OBJ3 = 5;
  GameMap.LAYER_PARTCILES = 6;
  GameMap.LAYER_MAX = 6;
  GameMap.LAYER_MIN = 0;
  GameMap.prototype.getContext = function() {
    return this.context;
  };
  GameMap.prototype.render = function ( gameManager, objects ) {
    var rect = this.getVisibleRect();
    var objs = [];
    var ctx = this.context;
    ctx.clearRect(0, 0, rect.width(), rect.height());
    var gameEvtsListener = gameManager.getGameEventsListener();
    if(gameEvtsListener && gameEvtsListener.onRenderStart) {
      ctx.save();
      gameEvtsListener.onRenderStart(gameManager, ctx);
    }
    var l=GameMap.LAYER_MIN-1;
    ctx.save();
    while(l++<GameMap.LAYER_MAX) {
      objs = objects.filter(GameObject.renderLayerFilter.bind(undefined, l));
      var i=objs.length;
      while(i--) if(!objs[i].isOutOfMap(rect)) objs[i].render(ctx);
      if(this.debug) {
        i=objs.length;
        while(i--) if(!objs[i].isOutOfMap(rect)) objs[i].renderDebug(ctx);
        if(l==GameMap.LAYER_BG3) this.renderDebug(ctx);
      }
    }
    ctx.restore();
    var hud = this.getHud();
    if(hud && !hud.getContext()) {
      ctx.save();
      this.getHud().render(ctx, rect);
      ctx.restore();
    }
    this.showMouseOverInfos(gameManager, objects, ctx);
    if(gameEvtsListener && gameEvtsListener.onRenderEnd) {
      gameEvtsListener.onRenderEnd(gameManager, ctx);
      ctx.restore();
    }
  };
  GameMap.prototype.getObjectAt = function( objects, point ) {
    var nearest = null;
    var minDist = -1;
    var pos, dist;
    var i = objects.length;
    var obj;
    while(i--) {
      obj = objects[i];
      if(!isNull(obj.renderMouseOver))
      pos = obj.getPosition();
      if(!isNull(pos)) {
        dist = Vec2.distance(pos, point);
        if((minDist==-1||dist < minDist) && obj.getRenderRect().contains(point)) {
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
  GameMap.prototype.showMouseOverInfos = function( gameManager, objects, ctx ) {
    if(!ctx) ctx = this.context;
    if(!isNull(this.pointerPos)) {
      var nearest = this.getObjectAt(objects, this.pointerPos);
      if(!isNull(nearest))
        nearest.renderMouseOver(ctx, this.pointerPos, gameManager, this.debug);
    }
  };
  return GameMap;
})();



