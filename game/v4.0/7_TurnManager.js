Game.turn = {};
Game.turn.Manager = (function(){
  
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
  class TurnManager {
    constructor( objects ) {
      this.objects = objects||[];
      this.lastIndex = -2;
      this.inObjectTurn = false;
      this.running = false;
      this.turnListener = null;
    }
    setTurnListener( listener ) {
      this.turnListener = listener;
    }
    getTurnListener() {
      return this.turnListener;
    }
    setObjects( objects ) {
      if(this.lastIndex !=-1 ) {
        var obj = this.getObjectAt(this.lastIndex);
        this.objects = objects;
        this.lastIndex = this.getObjectIndex(obj);
      }
      else this.objects = objects;
    }
    getObjects() {
      return this.objects;
    }
    getObjectAt( index ) { return this.objects[index]; }
    getObjectIndex( object ) { return this.objects.indexOf(object); }
    getCurrentObject() { return this.objects[this.lastIndex]; }
    addObject( object ) { this.addObjectAt(this.objects.length); }
    addObjectAt( object, index ) {
      if(index <= this.lastIndex) this.lastIndex++;
      this.objects.splice(index, 0, object);
    }
    removeObject( object ) { this.removeObjectAt(this.getObjectIndex(object)); }
    removeObjectAt( index ) {
      if(index <= this.lastIndex) this.lastIndex--;
      this.objects.splice(index, 1);
    }
    onFrame( gameManager, dT ) {
      if(this.running && !this.inObjectTurn) {
        if(this.lastIndex == -2) {
          if(this.turnListener) this.turnListener.onTurnBegin(gameManager, this);
          this.lastIndex = 0;
        } else this.lastIndex++;
        
        if(this.lastIndex < this.objects.length) {
          let obj = this.getObjectAt(this.lastIndex);
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
    }
    onObjectTurnEnd(gameManager) {
      this.inObjectTurn = false;
      if(this.turnListener) this.turnListener.onObjectTurnEnd(gameManager, this,
                                this.getObjectAt(this.lastIndex), this.lastIndex);
    }
    stop() { this.running = false; }
    start() { this.running = true; }
    isRunning() { return this.running; }
    isInObjectTurn() { return this.inObjectTurn; }
    static turnObjectFilter( obj ) { return obj.onTurn; }
    static getTurnObjects( gameManager ) {
      return gameManager.getObjects(TurnManager.turnObjectFilter);
    }
  }
  return TurnManager;
})();

