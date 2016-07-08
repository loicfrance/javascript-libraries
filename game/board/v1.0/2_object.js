Game.board.Object = (function(){
  class Object extends Game.objects.Object {
    constructor(map,  caseX, caseY ) {
      super(map.getCasePosition(map.getBoardRect(), caseX, caseY));
      this.caseX = caseX;
      this.caseY = caseY;
    }
    moveOnFrame( gameManager, dT ) {
      super.moveOnFrame(gameManager, dT);
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
    }
    getCaseX() { return this.caseX; }
    getCaseY() { return this.caseY; }
    setCaseX( caseX ) { this.caseX = caseX; return this; }
    setCaseY( caseY ) { this.caseY = caseY; return this; }
    
    setBoardMoveSpeed( spd ) { this.boardMoveSpeed = spd; return this; }
    getBoardMoveSpeed() {
      return this.boardMoveSpeed;
    }
    moveToCase( map, caseX, caseY ) {
      this.target = map.getCasePosition(map.getBoardRect(), caseX, caseY);
      return this;
    }
    skipMovement() {
      if(this.target) this.move(Vec2.translation(this.getPosition(), this.target));
      return this;
    }
    isMovementFinished() {
      return !(this.target);
    }
    addOccupationToMap( map ) {
      var mapH = map.length, mapW, mat = this.boardOccupationMatrix,
          matH = mat.length, matW, y = this.getCaseY()-Math.floor(matH/2), x;
      for(var i=0; i< matH && i+y < mapH; i++) {
        mapW = map[i].length;
        matW = mat[i].length;
        x = this.getCaseX()-Math.floor(matW/2);
        for(var j=0; j< matW && j+x < mapW; j++) map[i+y][j+x] |= parseInt(mat[i][j]);
          
      }
    }
    getInformations() {
      var res = super.getInformations();
      res.push(['x: ',this.getCaseX().toString(),', y: ', this.getCaseY().toString()].join(''));
      return res;
    }
  }
  Object.prototype.boardOccupationMatrix = ["1"];
  Object.prototype.collisionLayers = [Game.objects.Object.NO_COLLISION_LAYER];
  Object.prototype.boardMoveSpeed = 100;
  return Object;
})();