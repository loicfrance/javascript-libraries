Game.objects.bullets = (function(){
  var bullets = {};
//______________________________________________________________________________
// - - - - - - - - - - - - - - - -bullets.Simple - - - - - - - - - - - - - - - -
//******************************************************************************
  var Bullet = (function(){
    var parent = Game.objects.Object.Static;
// = = = = = = = = = = = = = = = = =constructor= = = = = = = = = = = = = = = = =
    var Bullet = function( damages, initialPosition, speed, lifeTime ) {
      parent.call(this, initialPosition);
      if(exists(speed)) this.speed = new Vec2(speed);
      this.damages = damages;
      if(!isNull(lifeTime)) this.lifeTime = lifeTime;
    };
    classExtend(parent, Bullet);
    Game.objects.particles.TraceDrawer.applyOnClass(Bullet);
    Game.objects.properties.LifeTime.applyOnClass(Bullet);
// = = = = = = = = = = = = = = = = = =public = = = = = = = = = = = = = = = = = =
// - - - - - - - - - - - - - - - - - -fields - - - - - - - - - - - - - - - - - -
    Bullet.defaultTraceDrawer = new TraceDrawer(0.05, "#FF0000");
    Bullet.defaultShape = new Polygon([
      {x:-10 , y:2 }, {x:5 , y:2 }, {x:7 , y:1 }, {x:8 , y:0 }, 
      {x:7 , y:-1 }, {x:5 , y:-2 }, {x:-10 , y:-2 }
    ]);
// - - - - - - - - - - - - - - - - - -methods- - - - - - - - - - - - - - - - - -
    Bullet.prototype.setLauncher = function( object ) {
      this.launcher = object;
    };
    Bullet.prototype.getLauncher = function() { return this.launcher; };
    Bullet.prototype.getDamages = function() { return this.damages; };
    Bullet.prototype.setDamages = function(damages) { this.damages = damages;};
    Bullet.prototype.onDeath = function( gameManager ) {
      if(this.explosion) {
        this.explosion.position.set(this.position);
        gameManager.addObject(this.explosion);
      }
    };
    var moveOnFrame = override(Bullet, 'moveOnFrame', function( gameManager, dT ) {
      moveOnFrame.call(this, gameManager, dT);
      if(this.isOutOfMap(gameManager.gameMap.getVisibleRect())) {
        delete this.explosion;
        this.kill(gameManager);
      }
    });
    Bullet.COLLISION_LAYER = 2;
    var colLayers = [Bullet.COLLISION_LAYER, Game.objects.Object.COLLISION_LAYER];
    Bullet.prototype.getCollisionLayers = function() { return colLayers; };
    Bullet.prototype.onCollision = function( gameManager, object ) {
      if(this.launcher == object) return;
      else if(this.damages !== 0) {
        if(object.receiveDamages && object.receiveDamages(gameManager, this,
                                                                  this.damages)) {
          this.damages = 0;
        }
        this.kill(gameManager);
      }
    };
    Bullet.createBullet = (damages, position, speed, shapeModel, color)=> {
        var b = new Bullet(damages, position, speed);
        var bShape = shapeModel.clone();
        bShape.rotate(speed.getAngle());
        b.renderer = new GameObjectRenderer.Shaped(bShape.clone(), color);
        b.collider = new Bullet.Collider(bShape);
        b.explosion = new ParticleEmitor.Explosion(20);
        b.traceDrawer = Bullet.defaultTraceDrawer;
        return b;
    };
    Bullet.prototype.getRenderLayer = function() { return Game.Map.LAYER_OBJ3; };
    getInfo = override(Bullet, 'getInformations', function() {
      var info = getInfo.call(this);
      if(exists(this.lifeTime)) info.push(["lifeTime : ", this.lifeTime].join(""));
      info.push(["damages : ", this.damages.toString()].join(""));
      return info;
    });
    var renderMouseOver = override(Bullet, 'renderMouseOver', function( context2d, pointerPos, gameManager, debug ) {
      if(!gameManager.running && debug) {
        renderMouseOver.call(this, context2d, pointerPos, gameManager, debug);
      }
    });
    return Bullet;
  })();
  bullets.Bullet = Bullet;
  bullets.Bullet.prototype = Bullet.prototype;
//______________________________________________________________________________
// - - - - - - - - - - - - - - - -bullets.Collider - - - - - - - - - - - - - - -
//******************************************************************************
  var Collider = (function(){
    var parent = Game.objects.colliders.Shaped;
    var BulletCollider = function( shape ) {
      parent.call(this, shape);
    };
    classExtend(parent, BulletCollider);
    BulletCollider.prototype.collidesWhenInside = function( collider ) {
      return true;
    };
    return BulletCollider;
  })();
  bullets.Collider = Collider;
  bullets.Collider.prototype = Collider.prototype;
//______________________________________________________________________________
// - - - - - - - - - - - - - - - - bullets.Laser - - - - - - - - - - - - - - - -
//******************************************************************************
  var Laser = (function(){
    var parent = bullets.Bullet;
    var Laser = function( damages, fromPosition, lifeTime, color, radians) {
      parent.call(this, damages, fromPosition, Vec2.ZERO, lifeTime);
      var shape = new Ray(fromPosition, radians);
      this.renderer = new Game.objects.renderers.Shaped(shape, color);
      this.collider = new bullets.Collider(shape);
    };
    classExtend(parent, Laser);
    return Laser;
  })();
  bullets.Laser = Laser;
  bullets.Laser.prototype = Laser.prototype;
//______________________________________________________________________________
// - - - - - - - - - - - - - - - -bullets.Homing - - - - - - - - - - - - - - - -
//******************************************************************************
  var HomingBullet = (function(){
    var parent = bullets.Bullet;
    var properties = Game.objects.properties;
    var HomingBullet = function( damages, initialPosition, speed, steerForce, maxAngle, lifeTime ) {
      parent.call(this, damages, initialPosition, speed, lifeTime);
      this.maxSpeed = speed.magnitude();
      this.steerForce = steerForce;
      this.maxAngle = maxAngle;
      this.setRotationFieldEnabled(true);
    };
    classExtend(parent, HomingBullet);
    properties.Homing.applyOnClass(HomingBullet);
    HomingBullet.prototype.getMaxSpeed = function( distance ) {
      return this.maxSpeed*(1-Math.sqrt(this.maxSpeed/(150*distance)));
    };
    HomingBullet.prototype.getSteerForce = function( maxSpeed, distance ) {
      return this.steerForce*(maxSpeed/Math.pow(distance, 1.2));
    };
    var isDamageable = Game.objects.properties.Health.isDamageable;
    var filter = (layers, obj)=> {
      if(obj.isInLayer(-1)) return false;
      if(!isDamageable(obj)) return false;
      var len = layers.length;
      for(var i=0; i<len; i++) {
        if(obj.isInLayer(layers[i])) return true;
      }
      return false;
    };
    HomingBullet.prototype.getTarget = function( gameManager ) {
      var res,
          maxAngle = this.maxAngle,
          pos = this.getPosition(),
          dist = 0,
          targets = gameManager.getObjects(filter.bind(undefined, this.getCollisionLayers())),
          i = targets.length;
      if(i>0)while(i--) {
        if(targets[i] !== this.launcher) {
          angle = (Vec2.translation(pos, targets[i].getPosition()).getAngle()-this.radians) % (Math.PI*2);
          if(angle > Math.PI) angle = 2*Math.PI-angle;
          if(angle < maxAngle) {
            maxAngle = angle;
            res = targets[i];
      } } }
      
      if(!isNull(res)) {
        return res.getPosition();
      }
      else return null;
    };
    var onFrame = override(HomingBullet, 'onFrame', function( gameManager, dT ) {
      onFrame.call(this, gameManager, dT);
      this.setRadians(this.getSpeed().getAngle());
    });
    return HomingBullet;
  })();
  bullets.Homing = HomingBullet;
  bullets.Homing.prototype = HomingBullet.prototype;
  return bullets;
})();