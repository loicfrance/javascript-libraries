/**
 * author : Loic France
 * created 05/31/2016
 */
Game.objects.interactives = (function(){
  var interactives = {};
  interactives.obstacles = (function(){
    var obstacles = {};
//______________________________________________________________________________
// - - - - - - - - - - - - - - - - - -Obstacle - - - - - - - - - - - - - - - - -
//******************************************************************************
    obstacles.Obstacle = (function(){
      var parent = Game.objects.Object.Static;
      var Obstacle = function( position ) {
        parent.call(this, position);
      };
      classExtend(parent, Obstacle);
      Obstacle.prototype.onCollision = function( gameManager, object ) {
        //TODO
      };
      Obstacle.prototype.repulse = function( object, delta ) {
        object.move(delta);
        var spd = object.copySpeed();
        var theta = delta.getAngle();
        spd.rotate(-theta);
        spd.x = 0;
        spd.rotate(theta);
        object.setSpeed(spd);
      };
      Obstacle.COLLISION_LAYER = 0;
      Obstacle.prototype.collisionLayers = [Obstacle.COLLISION_LAYER/*, Game.objects.Object.COLLISION_LAYER*/];
      Obstacle.prototype.renderLayer = Game.Map.OBJ1;
      return Obstacle;
    })();
//______________________________________________________________________________
// - - - - - - - - - - - - - - -RectangularObstacle- - - - - - - - - - - - - - -
//******************************************************************************
    obstacles.Rectangular = (function(){
      var parent = obstacles.Obstacle;
      var RectangularObstacle = function( position ) {
        parent.call(this, position);
      };
      classExtend(parent, RectangularObstacle);
      RectangularObstacle.prototype.disableBelow = function( disable ) {
        this.enableBelowCross = disable;
      };
      RectangularObstacle.prototype.disableAbove = function( disable ) {
        this.enableAboveCross = disable;
      };
      RectangularObstacle.prototype.disableLeft  = function( disable ) {
        this.enableLeftCross = disable;
      };
      RectangularObstacle.prototype.disableRight = function( disable ) {
        this.enableRightCross = disable;
      };
      RectangularObstacle.prototype.onCollision = function( gameManager, object ){
        var theta = this.getRadians();
        var objRect, rect,
        objPos = object.getPosition(), pos = this.getPosition();
        var objSpeed = object.getSpeed();
        if(theta !== 0) {
          this.getCollider().rotate(-theta);
          object.getCollider().rotate(-theta);
          objPos = Vec2.translation(pos, objPos).rotate(-theta).add(pos);
          objSpeed = objSpeed.clone().rotate(-theta);
        }
        objRect = object.getCollider().getRect(objPos);
        rect = this.getCollider().getRect();
        var delta = Vec2.zero();
        // TODO modifier le 0.01 pour éviter que les objets lents puissent traverser
        if(!this.enableAboveCross && rect.below(objPos) && objSpeed.y >=-0.01){
          delta.y = rect.top - objRect.bottom;
        }
        else if(!this.enableBelowCross && rect.above(objPos) && objSpeed.y <=0.01) {
          delta.y = rect.bottom - objRect.top;
        }
        if(!this.enableRightCross && rect.onLeftOf(objPos) && objSpeed.x <=0.01) {
          delta.x = rect.right - objRect.left;
        }
        else if(!this.enableLeftCross && rect.onRightOf(objPos) && objSpeed.x >=-0.01) {
          delta.x = rect.left - objRect.right;
        }
        if(theta !== 0) {
          this.getCollider().rotate(theta);
          object.getCollider().rotate(theta);
          delta.rotate(theta);
        }
        if(!delta.isZero()) this.repulse(object, delta);
      };
      return RectangularObstacle;
    })();
//______________________________________________________________________________
// - - - - - - - - - - - - - - - -CircularObstacle - - - - - - - - - - - - - - -
//******************************************************************************
    obstacles.Circular = (function(){
      var parent = obstacles.Obstacle;
      var CircularObstacle = function( position ) {
        parent.call(this, position);
      };
      classExtend(parent, CircularObstacle);
      CircularObstacle.prototype.onCollision = function( gameManager, object ) {
        var pos = this.getPosition(), objPos = object.getPosition();
        var d = Vec2.translation(pos, objPos), theta = d.getAngle();
        var right = pos.x + this.getCollider().getRadius();
        var objSpeed = object.getSpeed();
        if(theta !== 0) {
          object.getCollider().rotate(-theta);
          objPos = d.rotate(-theta).add(pos);
          objSpeed = objSpeed.clone().rotate(-theta);
        }
        if(objSpeed.x <= 0) {
          var objRect = object.getCollider().getRect(objPos);
          var delta = new Vec2(right - objRect.left, 0);
          if(theta !== 0) {
            object.getCollider().rotate(theta);
            delta.rotate(theta);
          }
          if(!delta.isZero()) this.repulse(object, delta);
        }
        else if(theta !== 0) object.getCollider().rotate(theta);
      };
      return CircularObstacle;
    })();
//______________________________________________________________________________
// - - - - - - - - - - - - - - -Obstacle properties- - - - - - - - - - - - - - -
//******************************************************************************
    obstacles.properties = {
      Bumper: {
        applyOnObstacle: ( obstacle, strength )=> {
          var repulse = obstacle.repulse;
          obstacle.repulse = function( object, delta ) {
            var spd = object.copySpeed();
            repulse.call(this, object, delta);
            var theta = delta.getAngle();
            spd.rotate(-theta);
            spd.x = (-spd.x)*this.getBumperStrength();
            if(Math.abs(spd.x) > 40) {
              spd.rotate(theta);
              object.setSpeed(spd);
            }
          };
          obstacle.setBumperStrength = function( strength ) {
            this.bumperStrength = strength;
          };
          obstacle.getBumperStrength = function() {
            return this.bumperStrength;
          };
          if(exists(strength))
            obstacle.setBumperStrength(strength);
        },
        applyOnObstacleClass: ( obstacleClass, defaultStrength )=> {
          var repulse = override(obstacleClass,'repulse', function(object, delta) {
            var spd = object.copySpeed();
            repulse.call(this, object, delta);
            var theta = delta.getAngle();
            spd.rotate(-theta);
            spd.x = -spd.x*this.getBumperStrength();
            if(Math.abs(spd.x) > 40) {
              spd.rotate(theta);
              object.setSpeed(spd);
            }
          });
          obstacleClass.prototype.setBumperStrength = function( strength ) {
            this.bumperStrength = strength;
          };
          obstacleClass.prototype.getBumperStrength = function() {
            return this.bumperStrength;
          };
          if(exists(defaultStrength))
            obstacleClass.prototype.bumperStrength = defaultStrength;
        }
      }
    };
    return obstacles;
  })();
  return interactives;
})();
