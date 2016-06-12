Game.turn = {};
Game.turn.TurnManager = (function(){
  
  /** ========== HOW TO USE TurnManager (TM) ==========
   *  # create the TM with a list of objects : theese objects must have
   *    the method 'onTurn( gameManager, turnManager )', which is called
   *    at the beginning of its turn to notify it that its turn has began.
   *    At the end of its turn, the object must call the method 'onObjectTurnEnd()'
   *    of the TM instance given as a parameter of the 'onTurn' method
   *    mentionned above.
   *  # you can provide an event listener by calling the
   *    'setTurnListener( listener )' method. the given listener wust implement,
   *    ALL the following methods :
   *      - void onTurnBegin( gameManager, turnManager ) :
   *        called before the turn of the first object at the beginning of every turn.
   *      - void onObjectTurnBegin( gamemanager, turnManager, object, index ) :
   *        called before the turn of every object.
   *      - void onObjectTurnEnd( gameManager, turnManager, object, index ) :
   *        called after the turn of every object.
   *      - void onTurnEnd( gameManager, turnManager ) : 
   *        called after the turn of the last object, 1 frame after the method
   *        onObjectTurnEnd.
   *  # start and stop the TM by calling 'start()' and 'stop()'.
   *  # you must call the method 'onFrame( gameManager, dT )' in the
   *    'onFrame( gameManager, dT )' method of the GameEventsListener
   *    you provided to the Game.Manager.
   *  # you can add or remove objects from the turn by calling addObject( object ),
   *    addObjectAt( object, index ), removeObject( object ),
   *    removeObjectAt( object, index ). Use those methods instead of directly
   *    modifying the 'objects' array to avoid problems.
   */
  var TurnManager = function( objects ) {
    this.objects = objects||[];
    this.lastIndex = -1;
    this.inObjectTurn = false;
    this.running = false;
    this.turnListener = null;
  };
  TurnManager.prototype.setTurnListener = function( listener ) {
    this.turnListener = listener;
  };
  TurnManager.prototype.getTurnListener = function() {
    return this.turnListener;
  };
  TurnManager.prototype.setObjects = function( objects ) {
    if(this.lastIndex !=-1 ) {
      var obj = this.getObjectAt(this.lastIndex);
      this.objects = objects;
      this.lastIndex = this.getObjectIndex(obj);
    }
    else this.objects = objects;
  };
  TurnManager.prototype.getObjects = function() {
    return this.objects;
  };
  TurnManager.prototype.getObjectAt = function( index ) {
    return this.objects[index];
  };
  TurnManager.prototype.getObjectIndex = function( object ) {
    return this.objects.indexOf(object);
  };
  TurnManager.prototype.addObject = function( object ) {
    this.addObjectAt(this.objects.length);
  };
  TurnManager.prototype.addObjectAt = function( object, index ) {
    if(index <= this.lastIndex) this.lastIndex++;
    this.objects.splice(index, 0, object);
  };
  TurnManager.prototype.removeObject = function( object ) {
    this.removeObjectAt(this.getObjectIndex(object));
  };
  TurnManager.prototype.removeObjectAt = function( index ) {
    if(index <= this.lastIndex) this.lastIndex--;
    this.objects.splice(index, 1);
  };
  TurnManager.prototype.onFrame = function( gameManager, dT ) {
    if(this.running && !this.inObjectTurn) {
      if(this.lastIndex == -2) {
        if(this.turnListener) this.turnListener.onTurnBegin(gameManager, this);
        this.lastIndex = 0;
      } else this.lastIndex++;
      
      if(this.lastIndex < this.objects.length) {
        var obj = this.getObjectAt(this.lastIndex);
        if(obj) {
          if(this.turnListener) this.turnListener.onObjectTurnBegin(
                                        gameManager, this, obj, this.lastIndex);
          obj.onTurn(gameManager, this);
          this.inObjectTurn = true;
        }
      } else {
        if(this.turnListener) this.turnListener.onTurnEnd(gameManager, this);
        this.lastIndex = -2;
      }
    }
  };

  TurnManager.prototype.onObjectTurnEnd = function() {
    this.inObjectTurn = false;
    if(this.turnListener) this.turnListener.onObjectTurnEnd(gameManager, this,
                              this.getObjectAt(this.lastIndex), this.lastIndex);
  };
  TurnManager.prototype.stop = function() {
    this.running = false;
  };
  TurnManager.prototype.start = function() {
    this.running = true;
  };
  TurnManager.prototype.isRunning = function() {
    return this.running;
  };
  TurnManager.prototype.isInObjectTurn = function() {
    return this.inObjectTurn;
  };
  return TurnManager;
})();

