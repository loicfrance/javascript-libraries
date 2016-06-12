/**
 * author : Loic France
 * created 05/31/2016
 */
Game.objects.particles = (function(){
  var particles = {};
//______________________________________________________________________________
// - - - - - - - - - - - - - - - - - -Particle - - - - - - - - - - - - - - - - -
//******************************************************************************
  particles.Particle = (function(){
    var parent = Game.objects.Object;
    var Particle = function( lifeTime, shape, color ) {
      parent.call(this);
      this.lifeTime = lifeTime;
      this.shape = shape;
      this.color = color;
    };
    classExtend(parent, Particle);
    Game.objects.properties.LifeTime.applyOnClass(Particle);
    var onFrame = override(Particle, 'onFrame', function( gameManager, dT ) {
      onFrame.call(this, gameManager, dT);
      if(this.isOutOfMap(gameManager.getMap().getVisibleRect(), 0, 0))
        this.lifeTime = 0;
    });
    Particle.prototype.render = function( context2d ) {
      context2d.fillStyle = this.color;
      this.shape.draw(context2d, true, false);
    };
    Particle.prototype.getPosition = function() { return this.shape.center; };
    Particle.prototype.copyPosition = function() { return this.shape.center.clone(); };
    Particle.prototype.rotate = function( radians ) { this.shape.rotate(radians); };
    Particle.prototype.grow = function( factor) { this.shape.grow(factor); };
    Particle.prototype.canCollide = function(obj) { return false; };
    Particle.prototype.collides = function(obj) { return false; };
    Particle.prototype.renderLayer= Game.Map.LAYER_PARTCILES;
    Particle.prototype.collisionLayers = [Game.objects.Object.NO_COLLISION_LAYER];
    Particle.prototype.prepareCollision = function() {
      console.stack('error : the method \'prepareCollision()\' should not be called for a particle.');
    };
    delete Particle.prototype.renderMouseOver;
    return Particle;
  })();
//______________________________________________________________________________
// - - - - - - - - - - - - - - - StrokedParticle - - - - - - - - - - - - - - - -
//******************************************************************************
  particles.Stroked = (function(){
    var parent = particles.Particle;
    StrokedParticle = function( lifeTime, shape, color ) {
      parent.call(this, lifeTime, shape, color);
    };
    classExtend(parent, StrokedParticle);
    StrokedParticle.prototype.constructor = parent.prototype.constructor;
    StrokedParticle.prototype.render = function( context2d ) {
      context2d.strokeStyle = this.color;
      this.shape.draw(context2d, false, true);
    };
    return StrokedParticle;
  })();
//______________________________________________________________________________
// - - - - - - - - - - - - - - - -ParticleEmitor - - - - - - - - - - - - - - - -
//******************************************************************************
  particles.Emitor = (function(){
    var parent = Game.objects.Object.Static;
    var ParticleEmitor = function( rate, max ) {
      parent.call(this);
      //TODO put all these attributes in prototype
      this.rate = rate;
      this.emited = 0;
      if(max) this.max = max;
      this.particleGenerator = function(lifeTime, initialPosition, angle, speed){
        return new particles.Particle(lifeTime,
            new Circle(initialPosition, 5),
            "#"+Math.round(Math.random()*16777215).toString(16)); // = OxFFFFFF
      };
      this.emitedParticles = [];
    };
    classExtend(parent, ParticleEmitor);
    //default attributes :
    ParticleEmitor.prototype.minLifeTime = 0.75;
    ParticleEmitor.prototype.maxLifeTime = 1.5;
    ParticleEmitor.prototype.minAngle = 0;
    ParticleEmitor.prototype.maxAngle = Math.PI*2;
    ParticleEmitor.prototype.minSpeed = 300;
    ParticleEmitor.prototype.maxSpeed = 400;
    ParticleEmitor.prototype.speedDampFactor = 2.5;
    ParticleEmitor.prototype.reduceSizeFactor = 1.2;
    ParticleEmitor.prototype.emitDistance = 0;
    ParticleEmitor.prototype.particleGenerator = function(lifeTime, initialPosition, angle, speed){
      return new particles.Particle(lifeTime,
          new Circle(initialPosition, 5),
          "#"+Math.round(Math.random()*16777215).toString(16)); // = OxFFFFFF
    };
    //functions :
    ParticleEmitor.prototype.restart = function() { this.emited = 0; };
    ParticleEmitor.prototype.stop = function() { this.emited = -1; };
    ParticleEmitor.prototype.isRunning = function() { return this.emited >= 0; };
    ParticleEmitor.prototype.setAngles = function( min, max ) {
      this.setMinAngle(min);
      this.setMaxAngle(!isNull(max)? max : min);
    };
    ParticleEmitor.prototype.setMinAngle=function( min ) {this.minAngle = min;};
    ParticleEmitor.prototype.setMaxAngle=function( max ) {this.maxAngle = max;};
    ParticleEmitor.prototype.getMinAngle=function() { return this.minAngle; };
    ParticleEmitor.prototype.getMaxAngle=function() { return this.maxAngle; };
    ParticleEmitor.prototype.setEmitDistance = function(emitDistance)
      { this.emitDistance = emitDistance; };
    ParticleEmitor.prototype.getEmitDistance = function()
      { return this.emitDistance; };
    ParticleEmitor.prototype.setEmitRate=function(rate) { this.rate = rate; };
    ParticleEmitor.prototype.getEmitRate=function() { return this.rate; };
    ParticleEmitor.prototype.setLifeTime=function(min, max) {
      this.setMinLifeTime(min);
      this.setMaxLifeTime(max ? ((max>min)? max : min) : min);
    };
    ParticleEmitor.prototype.setMinLifeTime=function(mlt){this.minLifeTime=mlt;};
    ParticleEmitor.prototype.setMaxLifeTime=function(mlt){this.maxLifeTime=mlt;};
    ParticleEmitor.prototype.getMinLifeTime=function(){return this.minLifeTime;};
    ParticleEmitor.prototype.getMaxLifeTime=function(){return this.maxLifeTime;};
    ParticleEmitor.prototype.setSpeedDampFactor = function ( factor )
      { this.speedDampFactor = factor; };
    ParticleEmitor.prototype.getSpeedDampFactor = function()
      { return this.speedDampFactor; };
    ParticleEmitor.prototype.setSizeReduceFactor = function( factor )
      { this.reduceSizeFactor = factor; };
    ParticleEmitor.prototype.getSizeReduceFactor = function()
      { return this.reduceSizeFactor ; };
    var rotate = override(ParticleEmitor, 'rotate', function( radians ) {
      rotate.call(this, radians);
      this.minAngle += radians;
      this.maxAngle += radians;
    });
    ParticleEmitor.prototype.getParticleGenerator = function()
      { return this.particleGenerator; };
    ParticleEmitor.prototype.setParticleGenerator = function( generator )
      { this.particleGenerator = generator; };
    ParticleEmitor.prototype.collisionLayers = [Game.objects.Object.NO_COLLISION_LAYER];
    // particlesEmitors are not rendered ...
    ParticleEmitor.prototype.renderLayer = Game.Map.LAYER_NONE;
    // ... and do not collide.
    ParticleEmitor.prototype.canCollide = function(object) { return false; };
    var onFrame = override(ParticleEmitor, 'onFrame', function( gameManager, dT ) {
      onFrame.call(this, gameManager, dT);
      var i=this.emitedParticles.length;
      var speedFactor = Math.max(0, 1-this.speedDampFactor*dT);
      var sizeFactor = Math.max(0, 1-this.reduceSizeFactor*dT);
      if(i>0)while(i--) {
        if(this.emitedParticles[i].lifeTime <= 0) this.emitedParticles.splice(i, 1);
        else {
          if(this.emitedParticles[i].speed && speedFactor !== 1)
            this.emitedParticles[i].speed.mul(speedFactor);
          if(sizeFactor !== 1) this.emitedParticles[i].grow(sizeFactor);
        }
      }
      if(this.max && this.emitedParticles.length === 0 && this.emited >= this.max)
          this.kill(gameManager);
      if(this.emited > -1 && (!this.max || this.emited < this.max)) {
        var next = this.emited + dT*this.rate;
        if(this.max)
          if(next> this.max) next = this.max;
        i = Math.floor(next - Math.floor(this.emited));
        this.emited = next;
        if(i>0)while(i--) {
          var lifeTime = Math.random()*(this.maxLifeTime-this.minLifeTime)
                                                              + this.minLifeTime;
          var speed = Math.round(Math.random()*(this.maxSpeed-this.minSpeed)
                                                               + this.minSpeed);
          var p;
          if(speed > 0) {
            var angle=Math.random()*(this.maxAngle-this.minAngle)+this.minAngle;
            p = this.particleGenerator(lifeTime, this.position, angle, speed);
            if(this.emitDistance)
              p.move(Vec2.createFromRadians(angle).mul(this.emitDistance));
            p.speed = new Vec2(Math.cos(angle)*speed, Math.sin(angle)*speed);
          } else p = this.particleGenerator(lifeTime, this.position, 0, 0);
          this.emitedParticles.push(p);
          gameManager.addObject(p);
        }
      }
      if(this.particlePositionRelative && this.speed && !this.speed.isZero()) {
        var d = this.speed.clone().mul(dT);
        i=this.emitedParticles.length;
        if(i>0)while(i--) this.emitedParticles[i].shape.move(d);
      }
    });
    return ParticleEmitor;
  })();
//______________________________________________________________________________
// - - - - - - - - - - - - - - - - - Explosion - - - - - - - - - - - - - - - - -
//******************************************************************************
  particles.Explosion = (function(){
    var parent = particles.Emitor;
    var Explosion = function( number ) {
      //rate = number*1000 particles/second :
      //to make sure that all particles are created in one frame
      parent.call(this, number*1000, number);
    };
    classExtend(parent, Explosion);
    //default attributes :
    Explosion.prototype.minLifeTime = 0.1;
    Explosion.prototype.maxLifeTime = 0.5;
    Explosion.prototype.minSpeed = 500;
    Explosion.prototype.maxSpeed = 1500;
    Explosion.prototype.speedDampFactor = 2;
    Explosion.prototype.reduceSizeFactor = 3;
    return Explosion;
  })();
//______________________________________________________________________________
// - - - - - - - - - - - - - - - - -TraceDrawer- - - - - - - - - - - - - - - - -
//******************************************************************************
  particles.TraceDrawer = (function(){
    TraceDrawer = function( particleLifeTime, color ) {
      this.lifeTime = particleLifeTime;
      this.color = color;
    };
    TraceDrawer.prototype.applyOnObject = function( gameManager, object ) {
      var setPositionXY = object.setPositionXY;
      var drawer = this;
      object.setPositionXY = function( x, y ) {
        var pos = object.copyPosition();
        setPositionXY.call(this, x, y);
        var newPos = object.getPosition();
        if(!pos.equals(newPos))
          drawer.onMove(gameManager, pos, newPos);
      };
    };
    TraceDrawer.applyOnClass = function( objectClass ) {
      var moveOnFrame = objectClass.prototype.moveOnFrame;
      objectClass.prototype.moveOnFrame = function( gameManager, dT ) {
        if(this.traceDrawer) {
          var pos = this.copyPosition();
          moveOnFrame.call(this, gameManager, dT);
          var newPos = this.getPosition();
          if(!pos.equals(newPos))
            this.traceDrawer.onMove(gameManager, pos, newPos);
        }
        else moveOnFrame.call(this, gameManager, dT);
      };
    };
    TraceDrawer.prototype.onMove = function( gameManager, fromPos, toPos ) {
      var particles = this.getParticlesForTranslation(fromPos, toPos);
      if(particles.length) for(var i= 0; i< particles.length; i++) {
        gameManager.addObject(particles[i]);
      }
      else gameManager.addObject(particles);
    };
    TraceDrawer.prototype.getParticlesForTranslation = function( from, to ) {
      return new particles.Stroked(this.lifeTime,
          new Line(from, to), this.color);
    };
    return TraceDrawer;
  })();
  return particles;
})();

