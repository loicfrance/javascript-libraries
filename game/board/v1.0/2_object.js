Game.board.Object = (function(){
  var parent = Game.objects.Object.Static;
  var BoardObject = function(map,  caseX, caseY ) {
    parent.call(this, map.getCasePosition(map.getBoardRect(), caseX, caseY));
    this.caseX = caseX;
    this.caseY = caseY;
  };
  classExtend(parent, BoardObject);
  BoardObject.prototype.boardMoveSpeed = 100;
  var mOF = override(BoardObject, 'moveOnFrame', function( gameManager, dT ) {
    mOF.call(this, gameManager, dT);
    if(this.target) {
      var t = Vec2.translation(this.getPosition(), this.target);
      if(t.isZero()) {
        this.target = null;
      }
      else {
        t.clampMagnitude(0,this.boardMoveSpeed*dT);
        this.move(t);
        var map = gameManager.getMap();
        var caseXY = map.getCaseXY(map.getBoardRect(), this.getPosition());
        if(caseXY.x != this.getCaseX() || caseXY.y != this.getCaseY()) {
          this.setCaseX(caseXY.x);
          this.setCaseY(caseXY.y);
        }
      }
    }
  });
  BoardObject.prototype.getCaseX = function() { return this.caseX; };
  BoardObject.prototype.setCaseX = function( caseX ) { this.caseX = caseX; };
  BoardObject.prototype.getCaseY = function() { return this.caseY; };
  BoardObject.prototype.setCaseY = function( caseY ) { this.caseY = caseY; };
  
  BoardObject.prototype.setBoardMoveSpeed = function( spd ) {
    this.boardMoveSpeed = spd;
  };
  BoardObject.prototype.getBoardMoveSpeed = function() {
    return this.boardMoveSpeed;
  };
  BoardObject.prototype.moveToCase = function( map, caseX, caseY ) {
    this.target = map.getCasePosition(map.getBoardRect(), caseX, caseY);
  };
  BoardObject.prototype.skipMovement = function() {
    this.move(Vec2.translation(this.getPosition(), this.target));
  };
  BoardObject.prototype.isMovementFinished = function() {
    return !(this.target);
  };
  BoardObject.prototype.boardOccupationMatrix = [[1]];
  BoardObject.prototype.collisionLayers = [Game.objects.Object.NO_COLLISION_LAYER];
  return BoardObject;
})();