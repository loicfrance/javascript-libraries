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
      class Obstacle extends Game.objects.Object {
        constructor( position ) {
          super(position);
        }
        onCollision( gameManager, object ) {
        //TODO
        }
        repulse( object, delta ) {
          object.move(delta);
          var spd = object.copySpeed();
          var theta = delta.angle;
          spd.rotate(-theta);
          spd.x = 0;
          spd.rotate(theta);
          object.setSpeed(spd);
        }
      }
      Obstacle.COLLISION_LAYER = 0;
      Obstacle.prototype.collisionLayers = [Obstacle.COLLISION_LAYER/*, Game.objects.Object.COLLISION_LAYER*/];
      Obstacle.prototype.renderLayer = Game.Map.OBJ1;
      return Obstacle;
    })();
//______________________________________________________________________________
// - - - - - - - - - - - - - - -RectangularObstacle- - - - - - - - - - - - - - -
//******************************************************************************
    obstacles.Rectangular = (function(){
      class Rectangular extends obstacles.Obstacle {
        constructor( position ) {
          parent.call(this, position);
        }
        disableBelow( disable ) {
          this.enableBelowCross = disable;
        }
        disableAbove( disable ) {
          this.enableAboveCross = disable;
        }
        disableLeft( disable ) {
          this.enableLeftCross = disable;
        }
        disableRight( disable ) {
          this.enableRightCross = disable;
        }
        onCollision( gameManager, object ) {
          let theta = this.getRadians(), objRect, rect,
              objPos = object.getPosition(), pos = this.getPosition(),
              objSpeed = object.getSpeed(), delta=Vec2.zero;
          if(theta) {
            this.getCollider().rotate(-theta);
            object.getCollider().rotate(-theta);
            objPos = Vec2.translation(pos, objPos).rotate(-theta).add(pos);
            objSpeed = objSpeed.clone().rotate(-theta);
          }
          objRect = object.getCollider().getRect(objPos);
          rect = this.getCollider().getRect();
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
          if(theta) {
            this.getCollider().rotate(theta);
            object.getCollider().rotate(theta);
            delta.rotate(theta);
          }
          if(!delta.isZero()) this.repulse(object, delta);
        }
      }
      return Rectangular;
    })();
//______________________________________________________________________________
// - - - - - - - - - - - - - - - -CircularObstacle - - - - - - - - - - - - - - -
//******************************************************************************
    obstacles.Circular = (function(){
      class Circular extends obstacles.Obstacle {
        constructor( position ) {
          super(position);
        }
        onCollision( gameManager, object ) {
          let pos = this.getPosition(), objPos = object.getPosition(),
              d = Vec2.translation(pos, objPos), theta = d.angle,
              right = pos.x + this.getCollider().getRadius(),
              objSpeed = object.getSpeed();
          if(theta) {
            object.getCollider().rotate(-theta);
            objPos = d.rotate(-theta).add(pos);
            objSpeed = objSpeed.clone().rotate(-theta);
          }
          if(objSpeed.x <= 0) {
            let objRect = object.getCollider().getRect(objPos),
                delta = new Vec2(right - objRect.left, 0);
            if(theta) {
              object.getCollider().rotate(theta);
              delta.rotate(theta);
            }
            if(!delta.isZero()) this.repulse(object, delta);
          }
          else if(theta) object.getCollider().rotate(theta);
        }
      }
      return Circular;
    })();
//______________________________________________________________________________
// - - - - - - - - - - - - - - -Obstacle properties- - - - - - - - - - - - - - -
//******************************************************************************
    obstacles.properties = {
      Bumper: {
        applyOnObstacle: ( obstacle, strength )=> {
          var repulse = obstacle.repulse;
          obstacle.repulse = function( object, delta ) {
            let spd = object.copySpeed(), theta = delta.angle;
            repulse.call(this, object, delta);
            spd.angle-=theta;
            spd.x = (-spd.x)*this.getBumperStrength();
            if(Math.abs(spd.x) > 40) {
              spd.angle+=theta;
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
          var repulse = obstacleClass.override('repulse', function(object, delta) {
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
