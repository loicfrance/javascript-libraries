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
  BoardObject.prototype.getCaseY = function() { return this.caseY; };
  BoardObject.prototype.setCaseX=function(caseX){this.caseX=caseX;return this;};
  BoardObject.prototype.setCaseY=function(caseY){this.caseY=caseY;return this;};
  
  BoardObject.prototype.setBoardMoveSpeed = function( spd ) {
    this.boardMoveSpeed = spd;
    return this;
  };
  BoardObject.prototype.getBoardMoveSpeed = function() {
    return this.boardMoveSpeed;
  };
  BoardObject.prototype.moveToCase = function( map, caseX, caseY ) {
    this.target = map.getCasePosition(map.getBoardRect(), caseX, caseY);
    return this;
  };
  BoardObject.prototype.skipMovement = function() {
    if(this.target) this.move(Vec2.translation(this.getPosition(), this.target));
    return this;
  };
  BoardObject.prototype.isMovementFinished = function() {
    return !(this.target);
  };
  BoardObject.prototype.boardOccupationMatrix = ["1"];
  BoardObject.prototype.addOccupationToMap = function(map) {
    var mapH = map.length, mapW, mat = this.boardOccupationMatrix,
        matH = mat.length, matW, y = this.getCaseY()-Math.floor(matH/2), x;
    for(var i=0; i< matH && i+y < mapH; i++) {
      mapW = map[i].length;
      matW = mat[i].length;
      x = this.getCaseX()-Math.floor(matW/2);
      for(var j=0; j< matW && j+x < mapW; j++) map[i+y][j+x] |= parseInt(mat[i][j]);
        
    }
  };
  BoardObject.prototype.collisionLayers = [Game.objects.Object.NO_COLLISION_LAYER];
  var getInfos = override(BoardObject, 'getInformations', function() {
    var res = getInfos.call(this);
    res.push(['x: ',this.getCaseX().toString(),', y: ', this.getCaseY().toString()].join(''));
    return res;
  });
  return BoardObject;
})();