/**
 * author : Loic France
 * created 05/31/2016
 */
//______________________________________________________________________________
// - - - - - - - - - - - - - - - - - -Follower - - - - - - - - - - - - - - - - -
//******************************************************************************
Game.objects.Follower = (function(){
  var parent = Game.objects.Object.Dynamic;
// = = = = = = = = = = = = = = = = =constructor= = = = = = = = = = = = = = = = =
  var Follower = function( position, target, maxSpeed, steerForce ) {
    parent.call(this, position);
    this.maxSpeed = exists(maxSpeed)? maxSpeed : 100;
    this.steerForce = exists(steerForce)? steerForce : maxSpeed;
    this.setTarget(target);
  };
  classExtend(parent, Follower);
  Game.objects.properties.Homing.applyOnClass(Follower);
// = = = = = = = = = = = = = = = = = =public = = = = = = = = = = = = = = = = = =
// - - - - - - - - - - - - - - - - - -methods- - - - - - - - - - - - - - - - - -
  
  Follower.prototype.onDeath = function( gameManager ) {
    var s = gameManager.getGameEventsListener();
    if(s) s.onObjectDestroyed(gameManager, this);
  };
  Follower.prototype.getMaxSpeed = function()   { return this.maxSpeed; };
  Follower.prototype.getSteerForce = function() { return this.steerForce; };
  Follower.prototype.getTarget = function()     { return this.target; };
  Follower.prototype.setTarget = function( target ) {
    this.target = target;
  };
  return Follower;
})();
Game.objects.Vehicle = (function() {
  var parent = Game.objects.Object.Static;
  var Vehicle = function( position ) {
    parent.call(this, position);
    this.setRotationFieldEnabled(true);
    this.speed = 0;
  };
  classExtend(parent, Vehicle);
  Vehicle.prototype.moveOnFrame = function( gameManager, dT ) {
    if(this.speed) this.move(this.copySpeed().mul(dT));
  };
  Vehicle.prototype.accelerateOnFrame = function( gameManager, dT ) {
    if(this.accel) this.speed += this.accel*dT;
  };
  Vehicle.prototype.getSpeed = function() {
    if(this.speed === 0) return Vec2.ZERO;
    else return new Vec2(Math.cos(this.radians)*this.speed,
                    Math.sin(this.radians)*this.speed);
  };
  Vehicle.prototype.copySpeed = function() {
    if(this.speed === 0) return new Vec2();
    else return this.getSpeed();
  };
  Vehicle.prototype.getAcceleration = function() {
    if(this.accel === 0) return Vec2.ZERO;
    return new Vec2(Math.cos(this.radians)*this.accel,
                    Math.sin(this.radians)*this.accel);
  };
  Vehicle.prototype.copyAcceleration = function() {
    if(this.accel === 0) return new Vec2();
    return new Vec2(Math.cos(this.radians)*this.accel,
                    Math.sin(this.radians)*this.accel);
  };
  Vehicle.prototype.accelerate = function( deltaSpeed ) {
    this.speed += deltaSpeed;
  };
  Vehicle.prototype.setSpeed = function( speedValue ) {
    this.speed = speedValue;
  };
  Vehicle.prototype.setAcceleration = function( accelValue ) {
    this.accel = accelValue;
  };
  return Vehicle;
})();