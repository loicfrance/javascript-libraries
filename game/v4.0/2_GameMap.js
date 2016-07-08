/**
 * author : Loic France
 * created 05/31/2016
 */
Game.Map = (function(){
  class Map {
    constructor( canvas, width, height ) {
      this.context = canvas.getContext('2d');
      this.context.font = "20px Verdana";
      this.gameWidth  = width  || canvas.width ;
      this.gameHeight = height || canvas.height;
      this.visibleRect = new Rect(0, 0, this.gameWidth, this.gameHeight);
    }
//______________________________________________________________________________
//-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# background color
    setBgColor( color ) { this.context.canvas.style.background = color; }
    getBg() { return this.context.canvas.style.background; }
//______________________________________________________________________________
//-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# pointer position
    setPointerPosition( position ) {
      if(this.pointerPos)this.pointerPos.set(position);
      else this.pointerPos = position.clone();
      let hud = this.getHud();
      if(!isNull(hud)) {
        hud.mouseMove(this.pointerPos);
      }
    }
    getPointerPosition() {
      if(this.pointerPos) return this.pointerPos;
      else return Vec2.ZERO;
    }
    handleMouseMove( coords, enter, exit, border=0 ) {
      if(exit) {
        let rect = this.getGameRect();
        this.setPointerPosition(new Vec2(rect.left-border, rect.top-border));
      } else if(!enter) {
        let c = coords.clone();
        c.addXY(-border, -border);
        this.gameCoordsFromPixelCoords(c, c);
        this.setPointerPosition(c);
      }
    }
    handleMouseClick( coords, btn ) {
      let hud = this.getHud();
      return hud && hud.click(this.gameCoordsFromPixelCoords(coords));
    }
//______________________________________________________________________________
//-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# autoResize
    autoResize( use=true, borderMargin=1 ) {
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
        var ratio = this.getVisibleRect().ratio;
        this.onWindowResize = function(full, event) {
          let parentW = container.offsetWidth,
              parentH = container.offsetHeight,
              w = parentW-borderMargin,
              h = Math.min(parentH-borderMargin, w/ratio);
          w = h*ratio;
          let left = (parentW-w)/2,
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
    }
    /**
     * listener: function(Game.Map, width, height) : void
     */
    setOnResize( listener ) {
      this.resizeListener = listener;
    }
    setSize( width, height, marginH, marginV ) {
      let scaleX = width/this.visibleRect.width,
          scaleY = height/this.visibleRect.height,
          hud = this.getHud(), c;
      this.context.canvas.width = width;
      this.context.canvas.height = height;
      this.context.canvas.style.marginLeft= marginH.toString() + "px";
      this.context.canvas.style.marginTop = marginV.toString() + "px";
      this.context.transform(scaleX, 0, 0, scaleY, 0, 0);
      if(hud && (c=hud.getContext())) {
        c.width = width;
        c.height = height;
        c.canvas.style.marginLeft= marginH.toString() + "px";
        c.canvas.style.marginTop = marginV.toString() + "px";
        c.transform(scaleX, 0, 0, scaleY, 0, 0);
      }
      if(this.resizeListener) this.resizeListener(this, width, height);
    }
//______________________________________________________________________________
//-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# visibleRect, gameRect
    setVisibleRect( rect ) {
      this.visibleRect.set(rect);
      var gameWidth = rect.width, gameHeight = rect.height;
      var scaleX = gameWidth ? this.contexts[0].canvas.width/gameWidth : 1,
          scaleY = gameHeight ? this.contexts[0].canvas.height/gameHeight : 1;
      this.context.transform(scaleX, 0, 0, scaleY, 0, 0);
    }
    getVisibleRect() {
      return this.visibleRect;
    }
    getGameRect() {
      return new Rect(0,0, this.gameWidth, this.gameHeight);
    }
    setGameWidth( width ) {
      this.setGameSize(width, this.gameHeight);
    }
    setGameHeight( height ) {
      this.setGameSize(this.gameWidth, height);
    }
    setGameSize( width, height ) {
      this.gameWidth = width;
      this.gameHeight = height;
      this.setVisibleRect(this.getVisibleRect());
    }
//______________________________________________________________________________
//-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# coordinates pixel <-> game
    gameCoordsFromPixelCoords( pixelCoords, out ) {
      let scaleX = this.getGamePixelScaleX(),
          scaleY = this.getGamePixelScaleY(),
          vRect = this.getVisibleRect(), startX = vRect.left, startY = vRect.top;
      if(!out) return new Vec2(pixelCoords.x*scaleX+startX, pixelCoords.y*scaleY+startY);
      else return out.setXY(pixelCoords.x*scaleX+startX, pixelCoords.y*scaleY+startY);
    }
    pixelCoordsFromGameCoords( gameCoords, out=null ) {
      let scaleX = 1/this.getGamePixelScaleX(),
          scaleY = 1/this.getGamePixelScaleY(),
          vRect = this.getVisibleRect(), startX = vRect.left, startY = vRect.top;
      if(!out) return new Vec2((gameCoords.x-startX)*scaleX, (gameCoords.y-startY)*scaleY);
      else return out.setXY((gameCoords.x-startX)*scaleX, (gameCoords.y-startY)*scaleY);
    }
    getGamePixelScaleX() {
      return this.getVisibleRect().width/this.context.canvas.width;
    }
    getGamePixelScaleY() {
      return this.getVisibleRect().height/this.context.canvas.height;
    }
//______________________________________________________________________________
//-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# hud
    setHud( hud ) { this.hud = hud; }
    createHud() { this.hud = new Game.hud.Hud(); }
    getHud() { return this.hud; }
//______________________________________________________________________________
//-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# debug
    showDebug( show ) { this.debug = show; }
    toggleDebug() { this.showDebug(!this.isDebug()); }
    isDebug() { return this.debug; }
    renderDebug( context ) { }

//______________________________________________________________________________
//-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# render
  
    getContext() {
      return this.context;
    }
    render( gameManager, objects ) {
      let rect = this.getVisibleRect(), objs = [], ctx = this.context,
          gameEvtsListener = gameManager.getGameEventsListener();
      ctx.clearRect(0, 0, rect.width, rect.height);
      if(gameEvtsListener && gameEvtsListener.onRenderStart) {
        ctx.save();
        gameEvtsListener.onRenderStart(gameManager, ctx);
      }
      var l=Map.LAYER_MIN-1;
      ctx.save();
      while(l++<Map.LAYER_MAX) {
        objs = objects.filter(Game.objects.Object.renderLayerFilter.bind(undefined, l));
        var i=objs.length;
        while(i--) if(!objs[i].isOutOfMap(rect)) objs[i].render(ctx);
        if(this.debug) {
          i=objs.length;
          while(i--) if(!objs[i].isOutOfMap(rect)) objs[i].renderDebug(ctx);
          if(l==Map.LAYER_BG3) this.renderDebug(ctx);
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
      if(gameEvtsListener){
        if(gameEvtsListener.onRenderEnd) {
          if(!gameEvtsListener.onRenderStart) ctx.save();
          gameEvtsListener.onRenderEnd(gameManager, ctx);
          ctx.restore();
        } else if(gameEvtsListener.onRenderStart) {
          ctx.restore();
        }
      }
    }
    getObjectAt( objects, point ) {
      let nearest = null, minDist = -1, pos, dist, i = objects.length, obj;
      while(i--) {
        obj = objects[i];
        if(obj.renderMouseOver) {
          pos = obj.getPosition();
          if(pos) {
            dist = Vec2.distance(pos, point);
            if((minDist==-1||dist < minDist) && obj.getRenderRect().contains(point)) {
              nearest = obj;
              minDist = dist;
            }
          }
        }
      }
      return nearest;
    }
    getContextMenu() {
      return ""; //dom elements
    }
    showMouseOverInfos( gameManager, objects, ctx ) {
      if(!ctx) ctx = this.context;
      if(!isNull(this.pointerPos)) {
        var nearest = this.getObjectAt(objects, this.pointerPos);
        if(!isNull(nearest))
          nearest.renderMouseOver(ctx, this.pointerPos, gameManager, this.debug);
      }
    }
  }
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
   * For example, to disable the particles, put LAYER_MAX to 5.
   * 
   */
  Map.LAYER_NONE = -1;
  Map.LAYER_BG1 = 0;
  Map.LAYER_BG2 = 1;
  Map.LAYER_BG3 = 2;
  Map.LAYER_OBJ1 = 3;
  Map.LAYER_OBJ2 = 4;
  Map.LAYER_OBJ3 = 5;
  Map.LAYER_PARTCILES = 6;
  Map.LAYER_MAX = 6;
  Map.LAYER_MIN = 0;
  return Map;
})();



