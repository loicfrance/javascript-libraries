console.log('include : weapons');
Game.weapons = (function(){
  var weapons= {};
//______________________________________________________________________________
// - - - - - - - - - - - - - - - - - -Weapon - - - - - - - - - - - - - - - - - -
//******************************************************************************
  weapons.Weapon = (function(){
    var Weapon = function( damages, owner ) {
      this.damages = damages;
      if(!isNull(owner)) this.setOwner(owner);
    };
    Weapon.prototype.use = function( gameManager, position, direction ) { };
    Weapon.prototype.setOwner = function( owner ) { this.owner = owner; };
    Weapon.prototype.getOwner = function() { return this.owner; };
    Weapon.prototype.getDamages = function() { return this.damages; };
    Weapon.prototype.setDamages = function( damages ) { this.damages = damages; };
    Weapon.prototype.onDeath = function() {
      delete this.damages; if(this.owner) delete this.owner;
    };
    
    Weapon.applyOnClass = function( objectClass ) {
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
      var onDeath = override(objectClass, 'onDeath', function( gameManager ) {
        if(exists(this.weapon)) {
          this.weapon.onDeath();
          delete this.weapon;
        }
        onDeath.call(this, gameManager);
      });
    };
    Weapon.applyOnObject = function( object ) {
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
      var onDeath = object.onDeath;
      object.onDeath = function( gameManager ) {
        if(exists(this.weapon)) {
          this.weapon.onDeath();
          delete this.weapon;
        }
        onDeath.call(this, gameManager);
      };
    };
    return Weapon;
  })();
//______________________________________________________________________________
// - - - - - - - - - - - - - - - - - - -Gun- - - - - - - - - - - - - - - - - - -
//******************************************************************************
  weapons.Gun = (function(){
    var parent = weapons.Weapon;
    var Gun = function( damages, bulletGenerator, owner ) {
      parent.call(this, damages, owner);
      this.bulletGenerator = bulletGenerator;
    };
    classExtend(parent, Gun);
    Gun.prototype.createBullet = function( position, radians ) {
      var b = this.bulletGenerator(this.getDamages(), position, radians);
      var launcher = this.getOwner();
      if(launcher) b.setLauncher(launcher);
      return b;
    };
    Gun.prototype.use = function( gameManager, position, radians ) {
      gameManager.addObject(this.createBullet(position, radians));
    };
    Gun.defaultBulletValues = {
      renderShape: Game.objects.bullets.Bullet.defaultShape,
      colliderShape: Game.objects.bullets.Bullet.defaultShape,
      color : '#0F0', speed : 300, spawnDistance : 5,// trace : undefined,
      explosionSize : 0//, lifeTime : undefined
    };
    Gun.createBulletGenerator = values =>{
      var v = createProperties(Gun.defaultBulletValues, values);
      return function( damages, position, radians ) {
        var s = Vec2.createFromRadians(radians).mul(v.speed);
        var b = new Game.objects.bullets.Bullet(damages, position, s, v.lifeTime);
        b.renderer = new Game.objects.renderers.Shaped(v.renderShape, v.color);
        b.collider = new Game.objects.colliders.Shaped(v.colliderShape);
        if(radians) b.rotate(radians);
        if(!isNull(v.trace)) b.traceDrawer = v.trace;
        if(!isNull(v.explosionSize))
          b.explosion = new Game.objects.particles.Explosion(v.explosionSize);
        return b;
      };
    };
    Gun.defaultHomingBulletValues = createProperties(Gun.defaultBulletValues);
    //  you can add the steerForce property.
    //  If you don't, it will be computed from the speed.
    Gun.defaultHomingBulletValues.maxAngle = Math.PI/8;
    
    Gun.createHomingBulletGenerator = values => {
      var v = createProperties(Gun.defaultHomingBulletValues, values);
      if(!exists(v.steerForce))
        v.steerForce = Math.pow(v.speed, 1.6)/(10/Math.log(1+v.maxAngle));
      
      return function( damages, position, radians ) {
        var s = Vec2.createFromRadians(radians).mul(v.speed);
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
    };
    Gun.createLaserBulletGenerator = ( color, width, range ) =>{
      var shape;
      if(exists(range)) {
        shape = new Line(Vec2.ZERO, {x:range, y:0});
      }
      else shape = new Ray(Vec2.ZERO, 0);
      return function( damages, position, radians ) {
        if(!isNull(range)) {
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
    };
    var onDeath = override(Gun, 'onDeath', function() {
      onDeath.call(this);
      delete this.bulletGenerator;
    });
    return Gun;
  })();
  return weapons;
})();
