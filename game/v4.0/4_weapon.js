/**
 * author : Loic France
 * created 05/31/2016
 */
Game.weapons = (function(){
  var weapons= {};
//______________________________________________________________________________
// - - - - - - - - - - - - - - - - - -Weapon - - - - - - - - - - - - - - - - - -
//******************************************************************************
  weapons.Weapon = (function() {
    class Weapon {
      constructor( damages, owner ) {
        this.damages = damages;
        if(!isNull(owner)) this.setOwner(owner);
      }
      use( gameManager, position, direction ) { }
      setOwner( owner ) { this.owner = owner; }
      getOwner() { return this.owner; }
      getDamages() { return this.damages; }
      setDamages( damages ) { this.damages = damages; }
      clone() { return new Weapon(this.damages, null); }
    
      static applyOnClass( objectClass ) {
        objectClass.prototype.setWeapon = function( weapon ) {
          if(isNull(weapon)) {
            if(exists(this.weapon)) delete this.weapon;
          }
          else this.weapon = weapon;
        };
        objectClass.prototype.getWeapon = function() { return this.weapon; };
        objectClass.prototype.useWeapon = function( gameManager ) {
          if(!isNull(this.weapon))
            this.weapon.use(gameManager, this.getPosition(), this.getRadians());
        };
      }
      static applyOnObject( object ) {
        object.setWeapon = function( weapon ) {
          if(isNull(weapon)) {
            if(exists(this.weapon)) delete this.weapon;
          }
          else this.weapon = weapon;
        };
        object.getWeapon = function() { return this.weapon; };
        object.useWeapon = function( gameManager ) {
          if(exists(this.weapon))
            this.weapon.use(gameManager, this.getPosition(), this.gertRadians());
        };
      }
    }
    return Weapon;
  })();
//______________________________________________________________________________
// - - - - - - - - - - - - - - - - - - -Gun- - - - - - - - - - - - - - - - - - -
//******************************************************************************
  weapons.Gun = (function(){
    class Gun extends weapons.Weapon {
    /**
     * bulletGenerator : function(damages: Number, position: Vec2, radians: Number).
     */
      constructor( damages, bulletGenerator, owner ) {
        super(damages, owner);
        this.bulletGenerator = bulletGenerator;
      }
      createBullet( position, radians ) {
        var b = this.bulletGenerator(this.getDamages(), position, radians);
        let launcher = this.getOwner();
        if(launcher) b.setLauncher(launcher);
        return b;
      }
      use( gameManager, position, radians ) {
        gameManager.addObject(this.createBullet(position, radians));
      }
      clone() { return new Gun(this.damages, this.bulletGenerator); }
      static createBulletGenerator( values ) {
        var v = createProperties(Gun.defaultBulletValues, values);
        return function( damages, position, radians ) {
          var s = Vec2.createFromRadians(radians, v.speed);
          position = Vec2.createFromRadians(radians).mul(v.spawnDistance).add(position);
          var b = new Game.objects.bullets.Bullet(damages, position, s, v.lifeTime);
          b.renderer = new Game.objects.renderers.Shaped(v.renderShape, v.color);
          b.collider = new Game.objects.colliders.Shaped(v.colliderShape);
          if(radians) b.rotate(radians);
          if(v.trace) b.traceDrawer = v.trace;
          if(v.explosionSize) {
            b.explosion = new Game.objects.particles.Explosion(v.explosionSize);
            if(v.particleGenerator)
              b.explosion.setParticleGenerator(v.particleGenerator);
          }
          return b;
        };
      }
      static createHomingBulletGenerator( values ) {
        var v = createProperties(Gun.defaultHomingBulletValues, values);
        if(!exists(v.steerForce))
          v.steerForce = Math.pow(v.speed, 1.6)/(10/Math.log(1+v.maxAngle));
        return function( damages, position, radians ) {
          var s = Vec2.createFromRadians(radians, v.speed);
          var b = new Game.objects.bullets.Homing(damages, position, s,
                                            v.steerForce, v.maxAngle, v.lifeTime);
          b.renderer = new Game.objects.renderers.Shaped(v.renderShape, v.color);
          b.collider = new Game.objects.colliders.Shaped(v.colliderShape);
          if(radians) b.rotate(radians);
          if(!isNull(v.trace)) b.traceDrawer = v.trace;
          if(!isNull(v.explosionSize))
            b.explosion = new Game.objects.particles.Explosion(v.explosionSize);
          return b;
        };
      }
      static createLaserBulletGenerator( color, width, range ) {
        var shape;
        if(exists(range)) {
          shape = new Line(Vec2.ZERO, new Vec2(range, 0));
        }
        else shape = new Ray(Vec2.ZERO, 0);
        return function( damages, position, radians ) {
          if(range) {
            var temp = Vec2.createFromRadians(radians).mul(range/2).add(position);
            position = temp;
          }
          var b = new Game.objects.bullets.Bullet(damages, position, Vec2.ZERO, 0.01);
          b.renderer = new Game.objects.renderers.Shaped(shape, color);
          b.renderer.fill = false;
          b.renderer.stroke = true;
          b.collider = new Game.objects.colliders.Shaped(shape);
          b.rotate(radians);
          return b;
        };
      }
    }
    Gun.defaultBulletValues = {
      renderShape: Game.objects.bullets.Bullet.defaultShape,
      colliderShape: Game.objects.bullets.Bullet.defaultShape,
      color : '#0F0', speed : 300, spawnDistance : 5,// trace : undefined,
      explosionSize : 0//, lifeTime : undefined,
    };
    Gun.defaultHomingBulletValues = createProperties(Gun.defaultBulletValues);
    //  you can add the steerForce property.
    //  If you don't, it will be computed from the speed.
    Gun.defaultHomingBulletValues.maxAngle = Math.PI/8;
    
    return Gun;
  })();
  return weapons;
})();
