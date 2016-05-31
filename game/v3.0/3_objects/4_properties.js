/**
 * author : Loic France
 * created 05/31/2016
 */
//______________________________________________________________________________
// - - - - - - - - - - - - - - - - - -Health - - - - - - - - - - - - - - - - - -
//******************************************************************************
Game.objects.properties = {};
Game.objects.properties.Health = {
  isDamageable: obj => exists(obj.receiveDamages),
  applyOnClass: function( objectClass ) {
    objectClass.prototype.receiveDamages = function( gameManager, from, amount ) {
      if(this.health <= 0) return false;
      this.health -= amount;
      if(this.health <= 0) this.kill(gameManager);
      return true;
    };
    objectClass.prototype.heal = function( amount ) {
      this.health += amount;
      if(!isNull(this.maxHealth) && this.health > this.maxHealth)
        this.health = this.maxHealth;
    };
    objectClass.prototype.setHealth = function(health) {
      this.health = health;
    };
    objectClass.prototype.getHealth = function() { return this.health; };
    var getInformations = override(objectClass, 'getInformations', function() {
      var result = getInformations.call(this);
      result.push(['health :', this.health.toPrecision(4)].join(" "));
      return result;
    });
    objectClass.prototype.setMaxHealth = function( max ) { this.maxHealth = max; };
    objectClass.prototype.getMaxHealth = function() { return this.maxHealth; };
    var onDeath = override(objectClass, 'onDeath', function( gameManager ) {
      onDeath.call(gameManager);
      if(!isNull(this.maxHealth)) delete this.maxHealth;
      delete this.health;
    });
  }
};
//______________________________________________________________________________
// - - - - - - - - - - - - - - - - - -Energy - - - - - - - - - - - - - - - - - -
//******************************************************************************
Game.objects.properties.Energy = {
  applyOnClass: function( objectClass ) {
    objectClass.prototype.useEnergy = function( amount ) {
      if( this.getEnergy() < amount) return false;
      else {
        this.setEnergy(this.getEnergy() - amount);
        return true;
      }
    };
    objectClass.prototype.setMaxEnergy = function( max ) {
      this.maxEnergy = max;
    };
    objectClass.prototype.setEnergy = function( energy ) {
      this.energy = energy;
    };
    objectClass.prototype.recoverEnergy = function( amount ) {
      if(this.isEnergyFull()) return false;
      else {
        this.setEnergy(this.getEnergy() + amount);
        if(this.isEnergyFull()) this.setEnergy(this.getMaxEnergy());
        return true;
      }
    };
    objectClass.prototype.isEnergyFull = function() {
       return this.getEnergy() >= this.getMaxEnergy();
    };
    objectClass.prototype.setEnergyRecoverSpeed = function( recoverSpeed ) {
      this.energyRecoverSpeed = recoverSpeed;
    };
    objectClass.prototype.getMaxEnergy = function() { return this.maxEnergy; };
    objectClass.prototype.getEnergy = function() { return this.energy; };
    objectClass.prototype.getEnergyRecoverSpeed = function() {
      return this.energyRecoverSpeed;
    };
    var onFrame = override(objectClass, 'onFrame', function( gameManager, dT ) {
      onFrame.call(this, gameManager, dT);
      var ers = this.getEnergyRecoverSpeed();
      if(ers && !this.isEnergyFull()) {
        this.recoverEnergy(ers*dT);
      }
    });
    var getInformations = override(objectClass, 'getInformations', function() {
      var result = getInformations.call(this);
      result.push(['energy :', this.energy.toPrecision(4)].join(" "));
      return result;
    });
    var onDeath = override(objectClass, 'onDeath', function( gameManager ) {
      onDeath.call(gameManager);
      delete this.energy;
      delete this.energyRecoverSpeed;
      delete this.maxEnergy;
    });
  }
};
//______________________________________________________________________________
// - - - - - - - - - - - - - - - - - -Homing - - - - - - - - - - - - - - - - - -
//******************************************************************************
Game.objects.properties.Homing = {
  getSteeringForce:
    (objectLocation,maxSpeed,maxForce,currentSpeed,targetLocation )=>
      Vec2.translation(objectLocation, targetLocation).normalize().mul(maxSpeed)
                              .remove(currentSpeed).clampMagnitude(0, maxForce),
  applyOnClass: function( objectClass, maxSpeed, steerForce, getTarget ) {
    var onFrame = override(objectClass, 'onFrame', function( gameManager, dT ) {
      if(this.getTarget) {
        var target = this.getTarget(gameManager);
        if(target) {
          if(target instanceof Game.objects.Object) target = target.getPosition();
          var pos = this.getPosition();
          var trans = Vec2.translation(pos, target);
          var dist = trans.magnitude();
          var maxSpeed = this.getMaxSpeed(dist);
          var steer = this.getSteerForce(maxSpeed, dist);
          var accel = trans.mul(steer/dist);
          accel.add(Game.objects.properties.Homing.getSteeringForce(
              pos, maxSpeed, steer,
              this.getSpeed(), target)).normalize().mul(steer);
          this.setAcceleration(accel);
          onFrame.call(this, gameManager, dT);
          this.setSpeed(this.getSpeed().clampMagnitude(0, maxSpeed));
        }
        else {
          this.setAcceleration(Vec2.ZERO);
          onFrame.call(this, gameManager, dT);
        }
      } else onFrame.call(this, gameManager, dT);
    });
    if(!isNull(getTarget))objectClass.prototype.getTarget = getTarget;
    if(!isNull(maxSpeed))
         objectClass.prototype.getMaxSpeed = distance => maxSpeed;
    else objectClass.prototype.getMaxSpeed = distance => 200;
    if(!isNull(steerForce))
         objectClass.prototype.getSteerForce = (maxSpeed,distance)=> steerForce;
    else objectClass.prototype.getSteerForce = (maxSpeed,distance)=> 100;
  },
  applyOnObject: ( object, maxSpeed, steerForce, getTarget ) =>{
    var onFrame = object.onFrame;
    object.onFrame = function( gameManager, dT ) {
      var target = getTarget(gameManager);
      if(!isNull(target)) {
        console.log(target);
        if(target instanceof Game.objects.Object) target = target.getPosition();
        var pos = this.getPosition();
        var accel = Vec2.translation(pos, target)
              .normalize().mul(steer);
        accel.add(Homing.getSteeringForce(
            pos, this.getSpeed(), maxSpeed,
            steerForce, this.getSpeed(), target));//.normalize().mul(steerForce);
        this.setAcceleration(accel);
      }
      else {
        this.setAcceleration(Vec2.ZERO);
      }
      onFrame.call(this, gameManager, dT);
      //this.setSpeed(this.getSpeed().clampMagnitude(maxSpeed));
    };
  }
};
//______________________________________________________________________________
// - - - - - - - - - - - - - - - - - -LifeTime - - - - - - - - - - - - - - - - -
//******************************************************************************
Game.objects.properties.LifeTime = {
  applyOnClass: function( objectClass ) {
    var onFrame = objectClass.prototype.onFrame;
    objectClass.prototype.onFrame = function( gameManager, dT ) {
      if(this.lifeTime <= 0){
        this.kill(gameManager);
      }
      onFrame.call(this, gameManager, dT);
      if(this.lifeTime) this.lifeTime -= dT;
    };
    var getInformations = override(objectClass, 'getInformations', function() {
      if(!isNull(this.lifeTime)){
        var result = getInformations.call(this);
        result.push(['lifeTime :', this.lifeTime.toPrecision(4)].join(" "));
        return result;
      }      
      else return getInformations.call(this);
    });
    var onDeath = override(objectClass, 'onDeath', function( gameManager ) {
      onDeath.call(gameManager);
      delete this.lifeTime;
    });
  },
  applyOnObject: object => {
    var onFrame = object.onFrame;
    object.onFrame = function( gameManager, dT ) {
      if(this.lifeTime <= 0){
        this.kill(gameManager);
      }
      onFrame.apply(this, arguments);
      if(exists(this.lifeTime)) this.lifeTime -= dT;
    };
    var onDeath = object.onDeath;
    object.onDeath = function( gameManager ) {
      if(exists(this.lifeTime)) delete this.LifeTime;
    };
  }
};
//______________________________________________________________________________
// - - - - - - - - - - - - - - - - - - -Tag- - - - - - - - - - - - - - - - - - -
//******************************************************************************
Game.objects.properties.Tag = (function(){
  var hasTag_noCheck = ( tag, obj )=> obj.hasTag(tag);
  var hasTag = ( tag, obj )=> obj.hasTag && obj.hasTag(tag);
  return {
    canHaveTag: obj=> obj.hasTag,
    hasTag: ( obj, tag )=>obj.hasTag && obj.hasTag(tag),
    getAllObjectsWithTag: ( gameManager, tag ) =>{
      if(isNull(tag)) return gameManager.getObjects(canHaveTag);
      else return gameManager.getObjects(hasTag.bind(undefined, tag));
    },
    applyOnClass: function( objectClass ) {
      objectClass.prototype.addTag = function( tag ) {
        if(!this.tags) this.tags = [];
        this.tags.push(tag);
      };
      objectClass.prototype.hasTag = function( tag ) {
        return !isNull(this.tags) && this.tags.indexOf(tag) !== -1;
        
      };
      objectClass.prototype.getTags = function() {
        return this.tags;
      };
      objectClass.prototype.isTagged = function() {
        if(this.tags) return true;
        return false;
      };
      var getInformations = override(objectClass, 'getInformations', function() {
        var tags = this.getTags();
        if(!isNull(tags) && tags.length > 0) {
          var result = getInformations.call(this);
          result.push(['tags :', this.tags.join(', ')].join(" "));
          return result;
        }
        else return getInformations.call(this);
      });
      var onDeath = override(objectClass, 'onDeath', function( gameManager ) {
        onDeath.call(gameManager);
        if(exists(this.tags)) delete this.tags;
      });
    }
  };
})();