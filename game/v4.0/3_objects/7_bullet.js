/**
 * author : Loic France
 * created 05/31/2016
 */
Game.objects.bullets = (function(){
  var bullets = {};
//______________________________________________________________________________
// - - - - - - - - - - - - - - - -bullets.Simple - - - - - - - - - - - - - - - -
//******************************************************************************
  var Bullet = (function(){
    class Bullet extends Game.objects.Object {
      constructor( damages, initialPosition, speed=null, lifeTime=0 ) {
        super(initialPosition, speed);
        this.damages = damages;
        if(lifeTime) this.lifeTime = lifeTime;
        this.launcher = null;
      }
      setLauncher( object ) { this.launcher = object; }
      getLauncher() { return this.launcher; }
      setDamages( damages ) { this.damages = damages; }
      getDamages() { return this.damages; }
      onDeath( gameManager ) {
        if(this.explosion) {
          this.explosion.setPosition(this.position);
          gameManager.addObject(this.explosion);
        }
      }
      moveOnFrame( gameManager, dT ) {
        super.moveOnFrame(gameManager, dT);
        if(this.isOutOfMap(gameManager.getMap().getGameRect())) {
          this.explosion = null;
          this.kill(gameManager);
        }
      }
      onCollision( gameManager, object ) {
        if(this.launcher == object) return;
        else if(this.damages !== 0) {
          if(object.receiveDamages && object.receiveDamages(gameManager, this,
                                                                    this.damages)) {
            this.damages = 0;
          }
          this.kill(gameManager);
        }
      }
      getInformations() {
        var infos = super.getInformations();
        infos.push(["damages : ", this.damages.toString()].join(""));
        return infos;
      }
      renderMouseOver( context2d, pointerPos, gameManager, debug ) {
        if(!gameManager.running && debug) {
          super.renderMouseOver(context2d, pointerPos, gameManager, debug);
        }
      }
      static createBullet( damages, position, speed, shapeModel, color ) {
        var b = new Bullet(damages, position, speed);
        let bShape = shapeModel.clone();
        bShape.rotate(speed.getAngle());
        b.renderer = new GameObjectRenderer.Shaped(bShape.clone(), color);
        b.collider = new Bullet.Collider(bShape);
        b.explosion = new ParticleEmitor.Explosion(20);
        b.traceDrawer = Bullet.defaultTraceDrawer;
        return b;
      }
    }
    Game.objects.particles.TraceDrawer.applyOnClass(Bullet);
    Game.objects.properties.LifeTime.applyOnClass(Bullet);
    Bullet.defaultTraceDrawer = new Game.objects.particles.TraceDrawer(0.05, "#FF0000");
    Bullet.defaultShape = new Polygon(Vec2.createVec2Array(
      [-10,2,   5,2,   7,1,   8,0,   7,1,   5,-2,   -10,-2]));
    Bullet.COLLISION_LAYER = 2;
    Bullet.prototype.collisionLayers = [Bullet.COLLISION_LAYER];
    Bullet.prototype.renderLayer = Game.Map.LAYER_OBJ3;
    return Bullet;
  })();
  bullets.Bullet = Bullet;
  bullets.Bullet.prototype = Bullet.prototype;
//______________________________________________________________________________
// - - - - - - - - - - - - - - - -bullets.Collider - - - - - - - - - - - - - - -
//******************************************************************************
  var Collider = (function(){
    class Collider extends Game.objects.colliders.Shaped {
      collidesWhenInside( collider ) {
        return true;
      }
    }
    return Collider;
  })();
  bullets.Collider = Collider;
  bullets.Collider.prototype = Collider.prototype;
//______________________________________________________________________________
// - - - - - - - - - - - - - - - - bullets.Laser - - - - - - - - - - - - - - - -
//******************************************************************************
  var Laser = (function(){
    class Laser extends bullets.Bullet {
      constructor( damages, fromPosition, lifeTime, color, radians) {
        super(damages, fromPosition, Vec2.ZERO, lifeTime);
        var shape = new Ray(fromPosition, radians);
        this.renderer = new Game.objects.renderers.Shaped(shape.clone(), color);
        this.collider = new bullets.Collider(shape);
      }
    }
    return Laser;
  })();
  bullets.Laser = Laser;
  bullets.Laser.prototype = Laser.prototype;
//______________________________________________________________________________
// - - - - - - - - - - - - - - - -bullets.Homing - - - - - - - - - - - - - - - -
//******************************************************************************
  var HomingBullet = (function(){
    var isDamageable = Game.objects.properties.Health.isDamageable;
    var filter = (layers, obj)=> {
      if(obj.isInLayer(-1)) return false;
      if(!isDamageable(obj)) return false;
      let i = layers.length;
      while(i--) {
        if(obj.isInLayer(layers[i])) return true;
      }
      return false;
    };
    class HomingBullet extends bullets.Bullet {
      constructor( damages, initialPosition, speed, steerForce, maxAngle, lifeTime ) {
        super(damages, initialPosition, speed, lifeTime);
        this.maxSpeed = speed.magnitude();
        this.steerForce = steerForce;
        this.maxAngle = maxAngle;
        this.setRotationFieldEnabled(true);
      }
      getMaxSpeed( distance ) {
        return this.maxSpeed*(1-Math.sqrt(this.maxSpeed/(150*distance)));
      }
      getSteerForce( maxSpeed, distance ) {
        return this.steerForce*(maxSpeed/Math.pow(distance, 1.2));
      }
      getTarget( gameManager ) {
        let res,
            maxAngle = this.maxAngle,
            pos = this.getPosition(),
            dist = 0,
            targets = gameManager.getObjects(filter.bind(undefined, this.collisionLayers)),
            i = targets.length;
        while(i--) {
          if(targets[i] !== this.launcher) {
            angle = (Vec2.translation(pos, targets[i].getPosition()).angle-this.radians) % (Math.PI*2);
            if(angle > Math.PI) angle = 2*Math.PI-angle;
            if(angle < maxAngle) {
              maxAngle = angle;
              res = targets[i];
        } } }
        return res? res.getPosition() : null;
      }
      onFrame( gameManager, dT ) {
        super.onFrame(gameManager, dT);
        this.setRadians(this.getSpeed().angle);
      }
    }
    Game.objects.properties.Homing.applyOnClass(HomingBullet);
    return HomingBullet;
  })();
  bullets.Homing = HomingBullet;
  bullets.Homing.prototype = HomingBullet.prototype;
  return bullets;
})();