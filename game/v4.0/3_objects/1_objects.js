/**
 * author : Loic France
 * created 05/31/2016
 */
Game.objects = {};
Game.objects.Object = (function(){
  class GameObject {
    constructor(position=null, speed=null, acceleration=null) {
      if(position) { this.setPosition(position);
        if(speed) { this.setSpeed(speed);
          if(acceleration) this.setAcceleration(acceleration);
    } } }
//______________________________________________________________________________
//-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# onFrame
    onFrame( gameManager, dT ) {
      this.moveOnFrame(gameManager, dT);
      this.accelerateOnFrame(gameManager, dT);
      this.rotateOnFrame(gameManager, dT);
      if(this.mustKeepInRect())
        this.maintainInRect(gameManager.gameMap.visibleRect);
    }
    moveOnFrame( gameManager, dT ) {
      let spd = this.getSpeed();
      if(spd && !spd.isZero()) this.move(spd.clone().mul(dT));
    }
    accelerateOnFrame( gameManager, dT ) {
      let acc = this.getAcceleration();
      if(acc && !acc.isZero()) this.accelerate(acc.clone().mul(dT));
    }
    rotateOnFrame( gameManager, dT ) {
      let rotSpd = this.getRotationSpeed();
      if(rotSpd) this.rotate(rotSpd*dT);
    }
//______________________________________________________________________________
//-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# rotation
    setRotationFieldEnabled( enable ) {
      if(enable && !this.radians) this.radians = 0;
      else if(!enable && exists(this.radians)) delete this.radians;
      return this;
    }
    rotate( radians ) {
      if(exists(this.radians)) this.radians = (this.radians + radians)%(2*Math.PI);
      if(this.renderer) this.renderer.rotate(radians);
      if(this.collider) this.collider.rotate(radians);
      return this;
    }
    setRadians( radians ) {
      if(!exists(this.radians)) this.setRotationFieldEnabled(true);
      this.rotate(radians - this.radians);
    }
    getRadians() {
      return this.radians || 0;
    }
    getDirection() {
      return this.createFromRadians(this.getRadians());
    }
    lookAt( point ) {
      if(!exists(this.radians)) this.setRotationFieldEnabled(true);
      this.setRadians(Vec2.translation(this.getPosition(), point).getAngle());
      return this;
    }
    setRotationSpeed( rotSpeed ) {
      this.rotationSpeed = rotSpeed;
      return this;
    }
    getRotationSpeed() {
      return this.rotationSpeed || 0;
    }
    fixRotation() {
      delete this.rotationSpeed;
      return this;
    }
    grow( factor ) {
      if(this.renderer) this.renderer.grow(factor);
      if(this.collider) this.collider.grow(factor);
      return this;
    }
//______________________________________________________________________________
//-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# render
    setRenderer( renderer ) { this.renderer = renderer; return this; }
    getRenderer() { return this.renderer; }
    render( context2d ) {
      let r = this.getRenderer();
      if(r) r.render(this.getPosition(), context2d);
    }
    renderDebug( context2d ) {
      let c = this.getCollider();
      if(c) c.render(this.getPosition(), context2d);
    }
    renderMouseOver( context2d, pointerPos, gameManager, debug ) {
      if(!gameManager.running && debug) {
        var rect = this.getRect();
        context2d.fillStyle = '#fff';
        context2d.font ="15px Verdana";
        var infos = this.getInformations();
        var bigRect = gameManager.getMap().visibleRect;
        var g;
        if(bigRect.right - rect.right < rect.left - bigRect.left) {
          rect.right = rect.left;
          rect.left = bigRect.left;
          g = Gravity.RIGHT;
        } else {
          rect.left = rect.right;
          rect.right = bigRect.right;
          g = Gravity.LEFT;
        }
        context2d.wrapText(infos.join('\n'), rect, 15, g, true, false);
      }
      context2d.strokeStyle = "#fff";
      (new Circle(this.getPosition(), this.getRenderRadius()*1.1))
                                                    .draw(context2d, false, true);
    }
    getInformations() {
      let pos=this.getPosition(),spd=this.getSpeed(),
          acc=this.getAcceleration();
      var result = [];
      if(pos) result.push(["p :", pos.roundedVec(4)].join(" "));
      if(spd) result.push(["s :", spd.roundedVec(4)].join(" "));
      if(acc) result.push(["a :", acc.roundedVec(4)].join(" "));
      return result;
    }
    getContextMenu() {
      return ""; //dom elements
    }
    static renderLayerFilter( layer, obj ) {
      return obj.renderLayer == layer;
    }
//______________________________________________________________________________
//-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# collision
    setCollider( collider ) {
      this.collider = collider; return this;
    }
    getCollider() {
      return this.collider;
    }
    canCollide( object=null ) {
      return 1&&this.getCollider();
    }
    prepareCollision() {
      if(!this.collision) this.collision = {};
      this.collision.position = this.getPosition();
      this.collision.collider = this.getCollider();
      this.collision.collider.prepareCollision( this.collision );
    }
    finishCollision() {
      this.collision.collider.finishCollision();
    }
    collides( obj ) {
      return this.collision.position && obj.collision.position &&
                this.collision.collider.collides(this.collision, obj.collision);
    }
    onCollision( gameManager, otherObject ) { }
    isInLayer( layer ) {
      return this.collisionLayers.indexOf(layer) >= 0;
    }
//______________________________________________________________________________
//-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# rect, radius, circle
    getRect() {
      return Rect.getUnion([this.getRenderRect(), this.getColliderRect()]);
    }
    getColliderRect() {
      let c = this.getCollider();
      return c? c.getRect(this.getPosition()): Rect.createFromPoint(this.getPosition());
    }
    getRenderRect() {
      let r = this.getRenderer();
      return r? r.getRect(this.getPosition()): Rect.createFromPoint(this.getPosition());
    }
    getRadius() {
      return Math.max(this.getRenderRadius(), this.getColliderRadius());
    }
    getRenderRadius() {
      let r = this.getRenderer();
      return r? r.getRadius() : 0;
    }
    getColliderRadius() {
      var c = this.getCollider();
      return c? c.getRadius() : 0;
    }
    getCircle() {
      return new Circle(this.getPosition(), this.getRadius());
    }
    getRenderCircle() {
      return new Circle(this.getPosition(), this.getRenderRadius());
    }
    getColliderCircle() {
      return new Circle(this.getPosition(), this.getColliderRadius());
    }
//______________________________________________________________________________
//-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# position, speed, acceleration getters
    getPosition() { return this.position; }
    getSpeed() { return this.speed; }
    getAcceleration() { return this.accel; }
    copyPosition() { return this.getPosition().clone(); }
    copySpeed() { return this.getSpeed().clone();}
    copyAcceleration() { return this.getAcceleration().clone(); }
//______________________________________________________________________________
//-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# position, speed, acceleration setters
    setPosition( p ) { return this.setPositionXY(p.x, p.y); }
    setPositionXY( x, y ) {
      let pos = this.getPosition();
      if(pos) pos.setXY(x, y);
      else this.position = new Vec2(x, y);
      return this;
    }
    setSpeed( s ) { return this.setSpeedXY(s.x, s.y); }
    setSpeedXY( x, y ) {
      let spd = this.getSpeed();
      if(spd) spd.setXY(x, y);
      else this.speed = new Vec2(x, y);
      return this;
    }
    setAcceleration( a ) { return this.setAccelerationXY(a.x, a.y); }
    setAccelerationXY( x, y ) {
      let acc = this.getAcceleration();
      if(acc) acc.setXY(x, y);
      else this.accel = new Vec2(x, y);
      return this;
    }
    move( delta ) { return this.moveXY(delta.x, delta.y); }
    moveXY( dX, dY ) {
      let p = this.getPosition();
      if(p) this.setPosition(p.addXY(dX, dY));
      return this;
    }
    accelerate( deltaSpeed ) { return this.accelerateXY(deltaSpeed.x, deltaSpeed.y); }
    accelerateXY( dX, dY ) {
      let spd = this.getSpeed();
      if(spd) this.setSpeed(spd.addXY(dX, dY));
      return this;
    }
//______________________________________________________________________________
//-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# death
    kill( gameManager ) {
      gameManager.removeObject(this);
    }
    onDeath( gameManager ) {
    }
//______________________________________________________________________________
//-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# position checkers
/**
 * return 0 if the object is in the rect. otherwise :
 *  result & 1 == 1 if object is on left.
 *  result & 2 == 2 if object is above.
 *  result & 4 == 4 if object is on right.
 *  result & 8 == 8 if object is below.
 */
    isOutOfMap( mapRect, marginX=0, marginY=marginX ) {
      let rect = mapRect.clone(), pos = this.getPosition();
      if(pos) {
        if(marginX||marginY) rect.addMarginsXY(-marginX, -marginY);
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
    }
    maintainInRect( rect, marginX=0, marginY=marginX ) {
      if(marginX||marginY) rect = rect.clone().addMarginsXY(-marginX, -marginY);
      let objRect= this.getRect(), pos= this.getPosition(), spd= this.getSpeed(),
          dX = objRect.left<rect.left ? rect.left-objRect.left :
               objRect.right>rect.right ? rect.right-objRect.right : 0,
          dY = objRect.top<rect.top ? rect.top-objRect.top :
               objRect.bottom>rect.bottom ? rect.bottom-objRect.bottom : 0;
      if(dX) { pos.x+=dX; if( (spd.x>0 && dX<0) || (spd.x<0 && dX>0) ) spd.x=0; }
      if(dY) { pos.y+=dY; if( (spd.y>0 && dY<0) || (spd.y<0 && dY>0) ) spd.y=0; }
      if(dX || dY) { this.setPosition(pos); this.setSpeed(spd); }
    }
    mustKeepInRect() { return false; }
//______________________________________________________________________________
//-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# toString
    toString() {
      return ['object at', this.getPosition()].join(" ");
    }
  }
//______________________________________________________________________________
//-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# static members & default values
  GameObject.prototype.renderLayer = Game.Map.LAYER_OBJ1;
  GameObject.COLLISION_LAYER = 1;
  GameObject.prototype.collisionLayers = [GameObject.COLLISION_LAYER];
  const colFilter1=(layers,len,obj)=>{let i=len,l=obj.collisionLayers;while(i--&&l.indexOf(layers[i])==-1){}return i>=0;},
        colFilter2=(layers,len,obj)=>{let i=len,l=obj.collisionLayers;while(i--&&l.indexOf(layers[i])==-1){}return i==-1;},
        colFilter3=(l,obj)=>obj.collisionLayers.indexOf(l)>=0,
        colFilter4=(l,obj)=>obj.collisionLayers.indexOf(l)==-1;
  GameObject.getCollisionLayerFilter = (layers, use) =>{
    var len = layers.length;
    if(len>1)
      return use ? colFilter1.bind(null, layers, len):
                   colFilter2.bind(null, layers, len);
    else if(len)
      return use ? colFilter3.bind(null, layers[0]) : colFilter4.bind(null, layers[0]);
    else return obj=>!use;
  };
  GameObject.NO_COLLISION_LAYER = -1;
  GameObject.collisionFilter = 
    //*
    GameObject.getCollisionLayerFilter([-1], false);
    /*/
    obj=>obj.collisionLayers[0]!=-1;
    //*/
  return GameObject;
})();