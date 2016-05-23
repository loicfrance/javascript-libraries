Game.objects = {};
Game.objects.Object = (function(){
  GameObject = function() {};
//______________________________________________________________________________
//-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# onFrame
  GameObject.prototype.onFrame = function( gameManager, dT) {
    if(this.moveOnFrame)       this.moveOnFrame       (gameManager, dT);
    if(this.accelerateOnFrame) this.accelerateOnFrame (gameManager, dT);
    if(this.rotateOnFrame)     this.rotateOnFrame     (gameManager, dT);
    if(this.mustKeepInRect())
        this.maintainInRect(gameManager.gameMap.getVisibleRect());
  };
  GameObject.prototype.moveOnFrame = function( gameManager, dT ) {
    var speed = this.getSpeed();
    if(exists(speed) && !speed.isZero()) this.move(new Vec2(speed).mul(dT));
  };
  GameObject.prototype.accelerateOnFrame = function( gameManager, dT ) {
    var accel = this.getAcceleration();
    if(exists(accel) && !accel.isZero()) this.accelerate(new Vec2(accel).mul(dT));
  };
  GameObject.prototype.rotateOnFrame = function( gameManager, dT ) {
    var rotSpeed = this.getRotationSpeed();
    if(exists(rotSpeed) && rotSpeed !== 0) this.rotate(rotSpeed*dT);
  };
//______________________________________________________________________________
//-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# rotation
  GameObject.prototype.setRotationFieldEnabled = function( enable ) {
    if(enable && !this.radians) this.radians = 0;
    else if(!enable && this.radians) delete this.radians;
    return this;
  };
  GameObject.prototype.rotate = function( radians ) {
    if(exists(this.radians)) this.radians += radians;
    if(this.renderer) this.renderer.rotate(radians);
    if(this.collider) this.collider.rotate(radians);
    return this;
  };
  GameObject.prototype.setRadians = function( radians ) {
    if(typeof radians != TYPE_NUMBER) console.log('cannot set radians to ' + radians);
    else {
      if(!exists(this.radians))
        this.setRotationFieldEnabled(true);
      this.rotate(radians - this.radians);
    }
  };
  GameObject.prototype.getRadians = function() {
    return this.radians || 0;
  };
  GameObject.prototype.getDirection = function() {
    return Vec2.createFromRadians(this.getRadians());
  };
  GameObject.prototype.lookAt = function( position ) {
    if(!this.radians) this.setRotationFieldEnabled(true);
    var trans = Vec2.translation(this.getPosition(), position);
    this.setRadians(trans.getAngle());
    return this;
  };
  GameObject.prototype.setRotationSpeed = function( rotationSpeed ) {
    if(rotationSpeed ===0) { if(this.rotationSpeed) delete this.rotationSpeed; }
    else this.rotationSpeed = rotationSpeed;
    return this;
  };
  GameObject.prototype.getRotationSpeed = function() {
    return this.rotationSpeed || 0;
  };
  GameObject.prototype.grow = function( factor ) {
    if(this.renderer) this.renderer.grow(factor);
    if(this.collider) this.collider.grow(factor);
    return this;
  };
//______________________________________________________________________________
//-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# render
  GameObject.prototype.setRenderer = function( renderer ) {
    this.renderer = renderer; return this;
  };
  GameObject.prototype.getRenderer = function() {
    return this.renderer;
  };
  GameObject.prototype.render = function( context2d ) {
    if(this.renderer)
      this.renderer.render(this.getPosition(), context2d);
  };
  GameObject.prototype.renderDebug = function( context2d ) {
    if(this.collider) this.collider.render(this.getPosition(), context2d);
  };
  GameObject.prototype.renderMouseOver = function( context2d, pointerPos, gameManager, debug ) {
    if(!gameManager.running && debug) {
      var rect = this.getRect();
      context2d.fillStyle = '#fff';
      context2d.font ="15px Verdana";
      var infos = this.getInformations();
      context2d.wrapText(infos.join('\n'), rect.right, rect.top, 200, 12);
    }
    context2d.strokeStyle = "#fff";
    (new Circle(this.getPosition(), this.getRenderRadius()*1.1))
                                                  .draw(context2d, false, true);
  };
  GameObject.prototype.getInformations = function() {
    var pos=this.getPosition(),speed=this.getSpeed(),
        accel=this.getAcceleration();
    var result = [];
    if(!isNull(pos)) result.push(["p :", pos.roundedVec(4)].join(" "));
    if(!isNull(speed)) result.push(["s :", speed.roundedVec(4)].join(" "));
    if(!isNull(accel)) result.push(["a :", accel.roundedVec(4)].join(" "));
    return result;
  };
  GameObject.prototype.getContextMenu = function() {
    return ""; //dom elements
  };
  GameObject.prototype.getRenderLayer = function(){return Game.Map.LAYER_OBJ1;};
  GameObject.renderLayerFilter = function( layer, obj ) {
    return obj.getRenderLayer() == layer;
  };
//______________________________________________________________________________
//-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# collision
  GameObject.prototype.setCollider = function( collider ) {
    this.collider = collider; return this;
  };
  GameObject.prototype.getCollider = function() {
    return this.collider;
  };
  GameObject.prototype.canCollide = function(/*nothing | gameObject */) {
    return !isNull(this.getCollider());
  };
  GameObject.prototype.prepareCollision = function() {
    this.collision = {position:this.getPosition(), collider:this.getCollider()};
    this.collision.collider.prepareCollision(this.collision.position);
  };
  GameObject.prototype.finishCollision = function() {
    this.collision.collider.finishCollision();
    delete this.collision;
  };
  GameObject.prototype.collides = function( object ) {
    return this.collision.position && object.collision.position &&
          this.collision.collider.collides(
              this.collision.position,
              object.collision.position,
              object.collision.collider);
  };
  GameObject.prototype.onCollision = function( gameManager, otherObject ) { };
  GameObject.COLLISION_LAYER = 0;
  var colLayers = [GameObject.COLLISION_LAYER];
  GameObject.prototype.getCollisionLayers = function() { return colLayers; };
  GameObject.prototype.isInLayer = function( layer ) {
    return this.getCollisionLayers().indexOf(layer) >= 0;
  };
  GameObject.getCollisionLayerFilter = (layers, use) =>{
    var layersLength = layers.length;
    if(exists(layersLength)) {
      if(layersLength > 0) {
        return obj=>{var i=layersLength;
          while(i--)if(obj.getCollisionLayers().indexOf(layers[i])>= 0)return use;
          return !use;
        };
      } else return obj=>!use;
    } else {
      return use? obj=> obj.getCollisionLayers().indexOf(layers) >= 0 :
                  obj=> obj.getCollisionLayers().indexOf(layers) == -1;
    }
  };
  GameObject.collisionFilter = GameObject.getCollisionLayerFilter(-1, false);

//______________________________________________________________________________
//-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# rect, radius, circle
  GameObject.prototype.getRect = function() {
    return Rect.getUnion(this.getRenderRect(), this.getColliderRect());
  };
  GameObject.prototype.getColliderRect = function() {
    var c = this.getCollider();
    if(c) return c.getRect(this.getPosition());
    else return Rect.createFromPoint(this.getPosition());
  };
  GameObject.prototype.getRenderRect = function() {
    var r = this.getRenderer();
    if(r) return r.getRect(this.getPosition());
    else return Rect.createFromPoint(this.getPosition());
  };
  GameObject.prototype.getRadius = function() {
    return Math.max(this.getRenderRadius(), this.getColliderRadius());
  };
  GameObject.prototype.getRenderRadius = function() {
    var r = this.getRenderer();
    if(r) return r.getRadius();
    else return 0;
  };
  GameObject.prototype.getColliderRadius = function() {
    var c = this.getCollider();
    if(c) return c.getRadius();
    else return 0;
  };
  GameObject.prototype.getCircle = function() {
    return new Circle(this.getPosition(), this.getRadius());
  };
  GameObject.prototype.getRenderCircle = function() {
    return new Circle(this.getPosition(), this.getRenderRadius());
  };
  GameObject.prototype.getColliderCircle = function() {
    return new Circle(this.getPosition(), this.getColliderRadius());
  };
//______________________________________________________________________________
//-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# position, speed, acceleration getters
  GameObject.prototype.getPosition = function() { return this.position; };
  GameObject.prototype.getSpeed = function() { return this.speed; };
  GameObject.prototype.getAcceleration = function() { return this.accel; };
  GameObject.prototype.copyPosition = function() {
    return new Vec2(this.getPosition());
  };
  GameObject.prototype.copySpeed = function() {
    return new Vec2(this.getSpeed());
  };
  GameObject.prototype.copyAcceleration = function() {
    return new Vec2(this.getAcceleration());
  };
//______________________________________________________________________________
//-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# position, speed, acceleration setters
  GameObject.prototype.setPosition = function(/* x, y | vec2 */) {
    var pos = this.getPosition();
    if(pos) pos.set.apply(pos, arguments);
    else this.position = arguments.length==1? new Vec2(arguments[0]) :
                      new Vec2(arguments[0], arguments[1]);
    return this;
  };
  GameObject.prototype.setSpeed = function(/* x, y | vec2 */) {
    var spd = this.getSpeed();
    if(spd) spd.set.apply(spd, arguments);
    else this.speed = arguments.length==1? new Vec2(arguments[0]) :
                      new Vec2(arguments[0], arguments[1]);
    return this;
  };
  GameObject.prototype.setAcceleration = function(/* x, y | vec2 */) {
    var acc = this.getAcceleration();
    if(acc) acc.set.apply(acc, arguments);
    else this.accel = arguments.length==1? new Vec2(arguments[0]) :
                      new Vec2(arguments[0], arguments[1]);
    return this;
  };
  GameObject.prototype.move = function( /* dX, dY | delta */ ) {
    var p = this.getPosition();
    if(p) this.setPosition(p.add.apply(p, arguments));
    return this;
  };
  GameObject.prototype.accelerate = function( /* dX, dY | deltaSpeed */ ) {
    var spd = this.getSpeed();
    if(spd) this.setSpeed(spd.add.apply(spd, arguments));
    return this;
  };
//______________________________________________________________________________
//-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# death
  GameObject.prototype.kill = function( gameManager ) {
    gameManager.removeObject(this);
  };
  GameObject.prototype.onDeath = function( gameManager ) {
    delete this.position; delete this.speed; delete this.accel;
    if(this.renderer) { delete this.renderer; }
    if(this.collider) { delete this.collider; }
  };
//______________________________________________________________________________
//-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# position checkers
  GameObject.prototype.isOutOfMap = function( mapRect, margin
                                                  /* | marginX*/, marginY ) {
    var rect = mapRect.clone();
    if(!isNull(margin)) rect.addMargin(-margin, exists(marginY)?
                                                            -marginY : -margin);
    var pos = this.getPosition();
    if(pos) {
      if(rect.contains(pos)) return 0;
      rect.addMargin(this.getRadius());
      var result = 0;
      if(pos.x < rect.left) result |= 1;
      else if(pos.x > rect.right) result |= 4;
      if(pos.y < rect.top) result |= 2;
      else if(pos.y > rect.bottom) result |= 8;
      return result;
    }
    return 0;
  };
  GameObject.prototype.maintainInRect = function ( rect, margin
                                                    /* | marginX*/, marginY ) {
    if(margin) rect = rect.clone().addMargin(-margin, exists(marginY)? -marginY :
                                                                       -margin);
    var objRect = this.getRect(); var pos = this.getPosition();
    var speed = this.getSpeed();
    var dX = objRect.left<rect.left ? rect.left-objRect.left :
            (objRect.right>rect.right ? rect.right-objRect.right : 0);
    var dY = objRect.top<rect.top ? rect.top-objRect.top :
            (objRect.bottom>rect.bottom ? rect.bottom-objRect.bottom : 0);
    if(dX!==0){ pos.x+=dX; if((speed.x>0&&dX<0)||(speed.x<0&&dX>0)) speed.x=0; }
    if(dY!==0){ pos.y+=dY; if((speed.y>0&&dY<0)||(speed.y<0&&dY>0)) speed.y=0; }
  };
  GameObject.prototype.mustKeepInRect = function() { return false; };
//______________________________________________________________________________
//-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# toString
  GameObject.prototype.toString = function() {
    return ['object at', this.getPosition()].join(" ");
  };

//______________________________________________________________________________
//-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# alternative constructors
  GameObject.Static = function( position ) {
    GameObject.call(this);
    this.setPosition(position? position : Vec2.ZERO);
  };
  classExtend(GameObject, GameObject.Static);

  GameObject.Cinetic = function( position ) {
    GameObject.Static.call(this, position);
    this.setSpeed(Vec2.ZERO);
  };
  classExtend(GameObject.Static, GameObject.Cinetic);

  GameObject.Dynamic = function( position ) {
    GameObject.Cinetic.call(this, position);
    this.setAcceleration(Vec2.ZERO);
  };
  classExtend(GameObject.Cinetic, GameObject.Dynamic);
  return GameObject;
})();