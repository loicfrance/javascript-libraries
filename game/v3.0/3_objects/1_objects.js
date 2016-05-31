/**
 * author : Loic France
 * created 05/31/2016
 */

Game.objects = {};
Game.objects.Object = (function(){
  GameObject = function() {};
//______________________________________________________________________________
//-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# onFrame
  GameObject.prototype.onFrame = function( gameManager, dT) {
    //TODO remove conditions
    this.moveOnFrame       (gameManager, dT);
    this.accelerateOnFrame (gameManager, dT);
    this.rotateOnFrame     (gameManager, dT);
    if(this.mustKeepInRect())
        this.maintainInRect(gameManager.gameMap.getVisibleRect());
  };
  GameObject.prototype.moveOnFrame = function( gameManager, dT ) {
    var speed = this.getSpeed();
    if(speed && !speed.isZero()) this.move(speed.clone().mul(dT));
  };
  GameObject.prototype.accelerateOnFrame = function( gameManager, dT ) {
    var accel = this.getAcceleration();
    if(accel && !accel.isZero()) this.accelerate(accel.clone().mul(dT));
  };
  GameObject.prototype.rotateOnFrame = function( gameManager, dT ) {
    var rotSpeed = this.getRotationSpeed();
    if(rotSpeed) this.rotate(rotSpeed*dT);
  };
//______________________________________________________________________________
//-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# rotation
  GameObject.prototype.setRotationFieldEnabled = function( enable ) {
    if(enable && !this.radians) this.radians = 0;
    else if(!enable && exists(this.radians)) delete this.radians;
    return this;
  };
  GameObject.prototype.rotate = function( radians ) {
    if(exists(this.radians)) this.radians = (this.radians + radians)%(2*Math.PI);
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
    if(!exists(this.radians)) this.setRotationFieldEnabled(true);
    var trans = Vec2.translation(this.getPosition(), position);
    this.setRadians(trans.getAngle());
    return this;
  };
  GameObject.prototype.setRotationSpeed = function( rotationSpeed ) {
    if(rotationSpeed) this.rotationSpeed = rotationSpeed;
    else if(this.rotationSpeed) delete this.rotationSpeed;
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
    if(this.renderer) this.renderer.render(this.getPosition(), context2d);
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
      rect.left = rect.right;
      rect.right = gameManager.getMap().getVisibleRect().right;
      context2d.wrapText(infos.join('\n'), rect, 15, Gravity.LEFT, true, false);
    }
    context2d.strokeStyle = "#fff";
    (new Circle(this.getPosition(), this.getRenderRadius()*1.1))
                                                  .draw(context2d, false, true);
  };
  GameObject.prototype.getInformations = function() {
    var pos=this.getPosition(),spd=this.getSpeed(),
        acc=this.getAcceleration();
    var result = [];
    if(pos) result.push(["p :", pos.roundedVec(4)].join(" "));
    if(spd) result.push(["s :", spd.roundedVec(4)].join(" "));
    if(acc) result.push(["a :", acc.roundedVec(4)].join(" "));
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
    if(!this.collision) this.collision = {};
    this.collision.position = this.getPosition();
    this.collision.collider = this.getCollider();
    this.collision.collider.prepareCollision(this.collision);
  };
  GameObject.prototype.finishCollision = function() {
    this.collision.collider.finishCollision();
    //delete this.collision;
  };
  GameObject.prototype.collides = function( obj ) {
    return this.collision.position && obj.collision.position &&
            this.collision.collider.collides(
                this.collision, obj.collision);
  };
  GameObject.prototype.onCollision = function( gameManager, otherObject ) { };
  GameObject.COLLISION_LAYER = 0;
  var colLayers = [GameObject.COLLISION_LAYER];
  GameObject.prototype.getCollisionLayers = function() { return colLayers; };
  GameObject.prototype.isInLayer = function( layer ) {
    return this.getCollisionLayers().indexOf(layer) >= 0;
  };
  GameObject.getCollisionLayerFilter = (layers, use) =>{
    var len = layers.length;
    return exists(len)?
        len > 0 ?
          use ?
            obj =>{
              var i=len, l = obj.getCollisionLayers();
              while(i-- && l.indexOf(layers[i])==-1) {}
              return i >= 0;
            } :
            obj =>{
              var i=len, l = obj.getCollisionLayers();
              while(i-- && l.indexOf(layers[i])==-1) {}
              return i == -1;
            } :
          obj=>!use :
        use?
          obj=>obj.getCollisionLayers().indexOf(layers) >= 0 :
          obj=>obj.getCollisionLayers().indexOf(layers) == -1;
  };
  GameObject.collisionFilter = GameObject.getCollisionLayerFilter(-1, false);

//______________________________________________________________________________
//-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# rect, radius, circle
  GameObject.prototype.getRect = function() {
    return Rect.getUnion([this.getRenderRect(), this.getColliderRect()]);
  };
  GameObject.prototype.getColliderRect = function() {
    var c = this.getCollider();
    return c? c.getRect(this.getPosition()) : Rect.createFromPoint(this.getPosition());
  };
  GameObject.prototype.getRenderRect = function() {
    var r = this.getRenderer();
    return r? r.getRect(this.getPosition()) : Rect.createFromPoint(this.getPosition());
  };
  GameObject.prototype.getRadius = function() {
    return Math.max(this.getRenderRadius(), this.getColliderRadius());
  };
  GameObject.prototype.getRenderRadius = function() {
    var r = this.getRenderer();
    return r? r.getRadius() : 0;
  };
  GameObject.prototype.getColliderRadius = function() {
    var c = this.getCollider();
    return c? c.getRadius() : 0;
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
    return this.getPosition().clone();
  };
  GameObject.prototype.copySpeed = function() {
    return this.getSpeed().clone();
  };
  GameObject.prototype.copyAcceleration = function() {
    return this.getAcceleration().clone();
  };
//______________________________________________________________________________
//-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# position, speed, acceleration setters
  GameObject.prototype.setPositionXY = function( x, y ) {
    var pos = this.getPosition();
    if(pos) pos.setXY(x, y);
    else this.position = new Vec2(x, y);
    return this;
  };
  GameObject.prototype.setPosition = function( p ) {
    return this.setPositionXY(p.x, p.y);
  };
  GameObject.prototype.setSpeedXY = function( x, y ) {
    var spd = this.getSpeed();
    if(spd) spd.setXY(x, y);
    else this.speed = new Vec2(x, y);
    return this;
  };
  GameObject.prototype.setSpeed = function( s ) {
    return this.setSpeedXY(s.x, s.y);
  };
  GameObject.prototype.setAccelerationXY = function( x, y ) {
    var acc = this.getAcceleration();
    if(acc) acc.setXY(x, y);
    else this.accel = new Vec2(x, y);
    return this;
  };
  GameObject.prototype.setAcceleration = function( a ) {
    return this.setAccelerationXY(a.x, a.y);
  };
  GameObject.prototype.moveXY = function( dX, dY ) {
    var p = this.getPosition();
    if(p) this.setPosition(p.addXY(dX, dY));
    return this;
  };
  GameObject.prototype.move = function( delta ) {
    return this.moveXY(delta.x, delta.y);
  };
  GameObject.prototype.accelerateXY = function( dX, dY ) {
    var spd = this.getSpeed();
    if(spd) this.setSpeed(spd.addXY(dX, dY));
    return this;
  };
  GameObject.prototype.accelerate = function( deltaSpeed ) {
    return this.accelerateXY(deltaSpeed.x, deltaSpeed.y);
  };
//______________________________________________________________________________
//-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# death
  GameObject.prototype.kill = function( gameManager ) {
    gameManager.removeObject(this);
  };
  GameObject.prototype.onDeath = function( gameManager ) {
    /*
    delete this.position; delete this.speed; delete this.accel;
    if(this.renderer) { delete this.renderer; }
    if(this.collider) { delete this.collider; }
    */
  };
//______________________________________________________________________________
//-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# position checkers
/**
 * return 0 if the object is in the rect. otherwise :
 *  result & 1 == 1 if object is on left.
 *  result & 2 == 2 if object is above.
 *  result & 4 == 4 if object is on right.
 *  result & 8 == 8 if object is below.
 */
  GameObject.prototype.isOutOfMap = function( mapRect, marginX, marginY ) {
    var rect = mapRect.clone();
    if(exists(marginX)) rect.addMarginsXY(-marginX, exists(marginY)? -marginY : -marginX);
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
  GameObject.prototype.maintainInRect = function ( rect, marginX, marginY ) {
    if(exists(marginX))
      rect = rect.clone().addMarginsXY(-marginX, exists(marginY)? -marginY :
                                                                       -marginX);
    var objRect = this.getRect(); var pos = this.getPosition();
    var speed = this.getSpeed();
    var dX = objRect.left<rect.left ? rect.left-objRect.left :
             objRect.right>rect.right ? rect.right-objRect.right : 0;
    var dY = objRect.top<rect.top ? rect.top-objRect.top :
             objRect.bottom>rect.bottom ? rect.bottom-objRect.bottom : 0;
    if(dX){ pos.x+=dX; if((speed.x>0&&dX<0)||(speed.x<0&&dX>0)) speed.x=0; }
    if(dY){ pos.y+=dY; if((speed.y>0&&dY<0)||(speed.y<0&&dY>0)) speed.y=0; }
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