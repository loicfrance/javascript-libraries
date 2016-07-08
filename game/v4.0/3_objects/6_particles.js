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
    class Particle extends Game.objects.Object {
      constructor( lifeTime, shape, color ) {
        super(); //TODO try to remove this line
        this.lifeTime = lifeTime;
        this.shape = shape;
        this.color = color;
      }
      onFrame( gameManager, dT ) {
        super.onFrame(gameManager, dT);
        if(this.isOutOfMap(gameManager.getMap().visibleRect))//TODO try to remove '0, 0'
          this.lifeTime = 0;
      }
      render( context2d ) {
        context2d.fillStyle = this.color;
        this.shape.draw(context2d, true, false);//TODO try to remove 'true, false'
      }
      getPosition() { return this.shape.center; }
      copyPosition() { return this.shape.center.clone(); }
      rotate( radians ) { this.shape.rotate(radians); }
      grow( factor ) { this.shape.grow(factor); }
      canCollide( obj ) { return false; }
      collides( obj ) { return false; }
      prepareCollision() {
        console.stack('error : the method \'prepareCollision()\' should not be called for a particle.');
      }
    }
    Game.objects.properties.LifeTime.applyOnClass(Particle);
    Particle.prototype.renderLayer= Game.Map.LAYER_PARTCILES;
    Particle.prototype.collisionLayers = [Game.objects.Object.NO_COLLISION_LAYER];
    Particle.prototype.renderMouseOver = null;
    return Particle;
  })();
//______________________________________________________________________________
// - - - - - - - - - - - - - - - StrokedParticle - - - - - - - - - - - - - - - -
//******************************************************************************
  particles.Stroked = (function(){
    class Stroked extends particles.Particle {
      render( context2d ) {
        context2d.strokeStyle = this.color;
        this.shape.draw(context2d, false, true);
      }
    }
    return Stroked;
  })();
//______________________________________________________________________________
// - - - - - - - - - - - - - - - -ParticleEmitor - - - - - - - - - - - - - - - -
//******************************************************************************
  particles.Emitor = (function(){
    class Emitor extends Game.objects.Object {
      constructor( rate, max=0 ) { //max=0 : no maximum
        super(Vec2.ZERO); //init position
        this.rate = rate;
        this.emited = 0;
        if(max) this.max = max;
        this.emitedParticles = [];
      }
      restart() { this.emited = 0; }
      stop() { this.emited = -1; }
      isRunning() { return this.emited >= 0; }
      setAngles( min, max ) {
        this.setMinAngle(min);
        this.setMaxAngle(!isNull(max)? max : min);
      }
      setMinAngle( min ) { this.minAngle = min; }
      setMaxAngle( max ) { this.maxAngle = max; }
      getMinAngle() { return this.minAngle; }
      getMaxAngle() { return this.maxAngle; }
      setEmitDistance( emitDistance ) { this.emitDistance = emitDistance; }
      getEmitDistance() { return this.emitDistance; }
      setEmitRate( rate ) { this.rate = rate; }
      getEmitRate() { return this.rate; }
      setLifeTime( min, max=0 ) { // max=0||max<min : max = min
        this.setMinLifeTime(min);
        this.setMaxLifeTime(max<min ? min : max);
      }
      setMinLifeTime( mlt ) { this.minLifeTime = mlt; }
      setMaxLifeTime( mlt ) { this.maxLifeTime = mlt; }
      getMinLifeTime() { return this.minLifeTime; }
      getMaxLifeTime() { return this.maxLifeTime; }
      setSpeedDampFactor( factor ) { this.speedDampFactor = factor; }
      getSpeedDampFactor() { return this.speedDampFactor; }
      setSizeReduceFactor( factor ) { this.reduceSizeFactor = factor; }
      getSizeReduceFactor() { return this.reduceSizeFactor ; }
      rotate( radians ) {
        super.rotate(radians);
        this.minAngle += radians;
        this.maxAngle += radians;
      }
      getParticleGenerator() { return this.particleGenerator; }
      setParticleGenerator( generator ) { this.particleGenerator = generator; }
      canCollide( object ) { return false; }
      createParticle( lifeTime, position, angle, speed ) {
        let p = this.particleGenerator(lifeTime, position, angle, speed);
        if(p) {
          if(speed) {
            var unit = Vec2.createFromRadians(angle);
            if(this.emitDistance)
              p.move(unit.clone().mul(this.emitDistance));
            p.speed = unit.mul(speed);
          } else if(this.emitDistance) {
            p.move(Vec2.createFromRadians(angle).mul(this.emitDistance));
          }
        }
        return p;
      }
      createParticles( number ) {
        let lt/*lifeTime*/, spd/*speed*/, a/*angle*/, pos=this.getPosition(),
            res = new Array(number), p;
        while(number--) {
          lt = this.maxLifeTime==this.minLifeTime ? this.minLifeTime :
              Math.random()*(this.maxLifeTime-this.minLifeTime)+this.minLifeTime;
          spd = this.maxSpeed==this.minSpeed ? this.minSpeed :
              Math.random()*(this.maxSpeed-this.minSpeed)+this.minSpeed;
          a = this.maxAngle==this.minAngle ? this.minAngle :
              Math.random()*(this.maxAngle-this.minAngle)+this.minAngle;
          p = this.createParticle(lt, pos, a, spd);
          if(p) res[number] = p;
          else res.splice(number, 1);
        }
        return res;
      }
      onFinished( gameManager ) {
        this.kill(gameManager);
      }
      onFrame( gameManager, dT ) {
        super.onFrame(gameManager, dT);
        let len=this.emitedParticles.length,
            speedFactor = Math.max(0, 1-this.speedDampFactor*dT),
            sizeFactor = Math.max(0, 1-this.reduceSizeFactor*dT);
        if(len) {
          let i=len;
          while(i--) {
            if(this.emitedParticles[i].lifeTime <= 0) this.emitedParticles.splice(i, 1);
            //kill() is automatically called for the particle by the lifeTime property.
            else {
              if(this.emitedParticles[i].speed && speedFactor !== 1)
                this.emitedParticles[i].speed.mul(speedFactor);
              if(sizeFactor !== 1) this.emitedParticles[i].grow(sizeFactor);
            }
          }
          if(this.particlePositionRelative && this.speed && !this.speed.isZero()) {
            let d = this.speed.clone().mul(dT);
            i=len;
            while(i--) this.emitedParticles[i].shape.move(d);
          }
        } else if(this.max && this.emited >= this.max) this.onFinished(gameManager);
        
        if(this.emited > -1 && (!this.max || this.emited < this.max)) {
          let next = this.emited + dT*this.rate;
          if(this.max && next> this.max) next = this.max;
          let p = this.createParticles(Math.floor(next - Math.floor(this.emited)));
          this.emited = next;
          Array.prototype.push.apply(this.emitedParticles, p);
          gameManager.addObjects_noCheck(p);
        }
      }
      static standardGenerator( lifeTime, initialPosition, angle, speed ){
        return new particles.Particle(lifeTime,
            new Circle(initialPosition, 5),
            "#"+Math.round(Math.random()*16777215).toString(16)); // = OxFFFFFF
      }
    }
    //default attributes :
    Emitor.prototype.minLifeTime = 0.75;
    Emitor.prototype.maxLifeTime = 1.5;
    Emitor.prototype.minAngle = 0;
    Emitor.prototype.maxAngle = Math.PI*2;
    Emitor.prototype.minSpeed = 300;
    Emitor.prototype.maxSpeed = 400;
    Emitor.prototype.speedDampFactor = 2.5;
    Emitor.prototype.reduceSizeFactor = 1.2;
    Emitor.prototype.emitDistance = 0;
    Emitor.prototype.particleGenerator = Emitor.standardGenerator;
    // particlesEmitors are not rendered ...
    Emitor.prototype.collisionLayers = [Game.objects.Object.NO_COLLISION_LAYER];
    // ... and do not collide.
    Emitor.prototype.renderLayer = Game.Map.LAYER_NONE;
    return Emitor;
  })();
//______________________________________________________________________________
// - - - - - - - - - - - - - - - - - Explosion - - - - - - - - - - - - - - - - -
//******************************************************************************
  particles.Explosion = (function(){
    class Explosion extends particles.Emitor {
      //rate = number*1000 particles/second :
      //to make sure that all particles are created in one frame
      constructor( number ) {
        super(number*1000, number);
      }
    }
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
    class TraceDrawer {
      constructor( particleLifeTime, color ) {
        this.lifeTime = particleLifeTime;
        this.color = color;
      }
      onMove( gameManager, fromPos, toPos ) {
        let particles = this.getParticlesForTranslation(fromPos, toPos);
        gameManager.addObjects_noCheck(particles);
      }
      getParticlesForTranslation( from, to ) {
        return [new particles.Stroked(this.lifeTime,
            new Line(from, to), this.color)];
      }
      applyOnObject( gameManager, object ) {
        var setPositionXY = object.setPositionXY;
        var drawer = this;
        object.setPositionXY = function( x, y ) {
          let pos = object.copyPosition();
          setPositionXY.call(this, x, y);
          let newPos = object.getPosition();
          if(!pos.equals(newPos))
            drawer.onMove(gameManager, pos, newPos);
        };
      }
      static applyOnClass( objectClass ) {
        var moveOnFrame = objectClass.prototype.moveOnFrame;
        objectClass.prototype.moveOnFrame = function( gameManager, dT ) {
          if(this.traceDrawer) {
            let pos = this.copyPosition();
            moveOnFrame.call(this, gameManager, dT);
            let newPos = this.getPosition();
            if(!pos.equals(newPos))
              this.traceDrawer.onMove(gameManager, pos, newPos);
          }
          else moveOnFrame.call(this, gameManager, dT);
        };
      }
    }
    return TraceDrawer;
  })();
  return particles;
})();

