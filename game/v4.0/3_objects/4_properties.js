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
    var getInformations = objectClass.override('getInformations', function() {
      var result = getInformations.call(this);
      result.push(['health :', this.health.toPrecision(4)].join(" "));
      return result;
    });
    objectClass.prototype.setMaxHealth = function( max ) { this.maxHealth = max; };
    objectClass.prototype.getMaxHealth = function() { return this.maxHealth; };
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
    var onFrame = objectClass.override('onFrame', function( gameManager, dT ) {
      onFrame.call(this, gameManager, dT);
      let ers = this.getEnergyRecoverSpeed();
      if(ers && !this.isEnergyFull()) {
        this.recoverEnergy(ers*dT);
      }
    });
    var getInformations = objectClass.override('getInformations', function() {
      var result = getInformations.call(this);
      result.push(['energy :', this.energy.toPrecision(4)].join(" "));
      return result;
    });
  }
};
//______________________________________________________________________________
// - - - - - - - - - - - - - - - - - -Homing - - - - - - - - - - - - - - - - - -
//******************************************************************************
Game.objects.properties.Homing = {
  getSteeringForce:
    (objectLocation,maxSpeed,maxForce,currentSpeed,targetLocation )=>
      Vec2.translation(objectLocation, targetLocation).setMagnitude(maxSpeed)
                              .remove(currentSpeed).clampMagnitude(0, maxForce),
  applyOnClass: function( objectClass, maxSpeed=0, steerForce=0, getTarget=0 ) {
    var onFrame = objectClass.override('onFrame', function( gameManager, dT ) {
      if(this.getTarget) {
        var target = this.getTarget(gameManager);
        if(target) {
          if(target instanceof Game.objects.Object) target = target.getPosition();
          let pos = this.getPosition(), accel = Vec2.translation(pos, target),
              dist = trans.magnitude, maxSpeed = this.getMaxSpeed(dist),
              steer = this.getSteerForce(maxSpeed, dist);
          accel.magnitude = steer;
          accel.add(Game.objects.properties.Homing.getSteeringForce(
              pos, maxSpeed, steer,
              this.getSpeed(), target)).magnitude = steer;
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
    if(getTarget)objectClass.prototype.getTarget = getTarget;
    if(maxSpeed)
         objectClass.prototype.getMaxSpeed = distance => maxSpeed;
    else objectClass.prototype.getMaxSpeed = distance => 200;
    if(steerForce)
         objectClass.prototype.getSteerForce = (maxSpeed,distance)=> steerForce;
    else objectClass.prototype.getSteerForce = (maxSpeed,distance)=> 100;
  },
  applyOnObject: ( object, maxSpeed, steerForce, getTarget ) =>{
    var onFrame = object.onFrame;
    object.onFrame = function( gameManager, dT ) {
      let target = getTarget(gameManager);
      if(target) {
        console.log(target);
        if(target instanceof Game.objects.Object) target = target.getPosition();
        let pos = this.getPosition();
        this.setAcceleration(Vec2.translation(pos, target).setMagnitude(steer)
            .add(Homing.getSteerForce(pos, this.getSpeed(), maxSpeed, steerForce, this.getSpeed(), target)));
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
    var getInformations = objectClass.override('getInformations', function() {
      if(!isNull(this.lifeTime)){
        var result = getInformations.call(this);
        result.push(['lifeTime :', this.lifeTime.toPrecision(4)].join(" "));
        return result;
      }      
      else return getInformations.call(this);
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
    getAllObjectsWithTag: ( gameManager, tag=null ) =>{
      if(tag) return gameManager.getObjects(hasTag.bind(undefined, tag));
      else return gameManager.getObjects(canHaveTag);
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
      var getInformations = objectClass.override('getInformations', function() {
        let tags = this.getTags();
        if(!isNull(tags) && tags.length > 0) {
          var result = getInformations.call(this);
          result.push(['tags :', this.tags.join(', ')].join(" "));
          return result;
        }
        else return getInformations.call(this);
      });
    }
  };
})();