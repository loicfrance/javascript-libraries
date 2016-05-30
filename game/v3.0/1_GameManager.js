if(!Date.now) Date.now = function() { return new Date().getTime(); };
if(!exists(window.Game)) Game = {};
//______________________________________________________________________________
//-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# Constructor
Game.Manager = (function(){
  GameManager = function() {
    this.running = false;
    this.objects = {active:[], toAdd:[], toRemove:[]};
    this.now = 0;
    this.gameMap = null;
  };
//______________________________________________________________________________
//-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# map functions
  GameManager.prototype.setMap = function( gameMap ) {
    this.gameMap = gameMap;
  };
  GameManager.prototype.createMap = function( canvases, gameWidth, gameHeight, bgColor ) {
    this.gameMap = new Game.Map( canvases, gameWidth, gameHeight );
    this.gameMap.setBgColor(exists(bgColor)? bgColor : '#000');
  };
  GameManager.prototype.getMap = function() {
    return this.gameMap;
  };
//______________________________________________________________________________
//-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# objects array functions (getObjects, addObject, removeObject)
  GameManager.prototype.getObjects = function( filter ) {
    if(filter) return this.objects.active.filter(filter);
    else return this.objects.active;
  };
  var instanceFilter = function( objClass, obj ){
    return obj instanceof objClass;
  };
  GameManager.prototype.getInstancesOf = function( objectClass ) {
    return objectClass?
              this.getObjects(instanceFilter.bind(undefined, objectClass)) :
              this.getObjects();
  };
  GameManager.prototype.addObject = function( gameObject ) {
    if(this.objects.toAdd.indexOf(gameObject == -1))
      this.objects.toAdd.push(gameObject);
    else console.log(new Error("the object " + gameObject +
                              " is already being added from the game").stack);
  };
  GameManager.prototype.removeObject = function( gameObject ) {
    if(this.objects.toRemove.indexOf(gameObject === -1))
      this.objects.toRemove.push(gameObject);
    else console.log(new Error("the object " + gameObject +
                              " is already being removed from the game").stack);
  };
  GameManager.prototype.clearObjects = function() {
    for(var i= this.objects.active.length; i>=0; i--)
      this.removeObject(this.objects.active[i]);
  };
//______________________________________________________________________________
//-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# event functions (start, stop, listeners)
  GameManager.prototype.start = function() {
    this.running = true;
    this.now = 0;
    if(!isNull(this.gameEventsListener) && !isNull(this.gameEventsListener.onStart))
      this.gameEventsListener.onStart(this);
    requestAnimationFrame(this.onFrame.bind(this));
  };
  GameManager.prototype.stop = function() {
    this.running = false;
    if(!isNull(this.gameEventsListener) && !isNull(this.gameEventsListener.onStop))
      this.gameEventsListener.onStop(this);
  };
  /**
   * the GameEventListener can contain the following functions :
   * - onFrame( gameManager, dT ) :
   *      called at the end of each running, between the collision step
   *      and the rendering step.
   * - onStart( gameManager ) :
   *      called when the game is started or resumed.
   * - onStop( gameManager ) :
   *      called when the game is paused.
   * - onObjectCreated( gameManager, object ) :
   *      you can call this funcion  - in the constructor of an object,
   *      for exemple -  to tell the game that this object has been created.
   * - onObjectDestroyed( gameManager, object ) :
   *      you can use this function  - in the 'onDeath' function, for example -
   *      to tell the game that this object has been killed.
   * - onRenderStart( gameManager, context ) :
   *      called by the GameMap everytime the render process start.
   *      You can use this function, for example, to render something
   *      behind the game, or to add some visual effects by modifying
   *      the context (shake or tilt the screen, zoom in or out on something, ...)
   *      the context is saved before this function is called.
   * - onRenderEnd( gameManager, context ) :
   *      called by the GameMap everytime the render process is finished.
   *      You can use this function, for example, to render something above
   *      the game, but behind the hud.
   *      the context is restored (from his version before the onRenderStart call)
   *      after this function is called.
   */
  GameManager.prototype.setGameEventsListener = function( gameEventsListener ) {
    this.gameEventsListener = gameEventsListener;
  };
  GameManager.prototype.getGameEventsListener = function() {
    return this.gameEventsListener;
  };
//______________________________________________________________________________
//-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# onFrame
  GameManager.prototype.onFrame = function( timeStamp ) {
    if(this.running) {
      if(this.now === 0) {
        this.now = timeStamp;
        requestAnimationFrame(this.onFrame.bind(this));
        return;
      }
      var obj;
      var index = -1;
      var active   = this.objects.active,
          toAdd    = this.objects.toAdd,
          toRemove = this.objects.toRemove;
      var i=toRemove.length;
      if(i>0)while(i--) {
        obj = toRemove.pop();
        obj.onDeath(this);
        index = active.indexOf(obj);
        if(index > -1) {
          active.splice(index, 1);
        }
      }

      var dT = (timeStamp - this.now)/1000;
      if(dT === 0) {
        console.log('error : dT=0');
        return;
      }
      this.now = timeStamp;
      if(dT !== 0 && dT < 0.5) {
        var j, len;
        var bodies = active.filter(Game.objects.Object.collisionFilter);
        var other = [];
        len = i = bodies.length;
        if(len>0){
          while(i--) bodies[i].prepareCollision();
          i=len;
          while(i--) {
            obj = bodies.pop();
            other = bodies.filter(Game.objects.Object.getCollisionLayerFilter(
                                                obj.getCollisionLayers(), true));
            j = other.length;
            if(j>0)while(j--) {
              if(obj !== other[j] && obj.canCollide(other[j]) && other[j].canCollide(obj)
                  && obj.collides(other[j])) {
                obj.onCollision(this, other[j]);
                other[j].onCollision(this, obj);
            } }
            obj.finishCollision();
          }
        }
        i = toAdd.length;
        if(i>0)while(i--) active.push(toAdd.pop());
        i = active.length;
        if(i>0)while(i--) {
          active[i].onFrame(this, dT);
        }
      }
      if(!isNull(this.gameEventsListener) && !isNull(this.gameEventsListener.onFrame))
          this.gameEventsListener.onFrame(this, dT);
    }
    if(this.gameMap) {
      this.gameMap.render(this, this.objects.active);
    }

    requestAnimationFrame(this.onFrame.bind(this));
  };
  GameManager.prototype.showContextMenu = function( menuDiv ) {

    var innerHtml = ""; //open
    /* main context menu */
    innerHtml += this.gameMap.getContextMenu();
    var obj = this.gameMap.getObjectAt(this.gameMap.gameCoordsFromPixelCoords(position));
    if(!isNull(obj)) {
      innerHtml += obj.getContextMenu();
    }
    innerHtml += ""; //close
    menu.innerHtml = innerHtml;
  };
  return GameManager;
})();
