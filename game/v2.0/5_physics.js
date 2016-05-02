Game.Physics = (function(){
  var Physics = {
    G:6.67384E-11,
    friction: 2,
    Mass: {
      applyOnClass: ( objectClass, defaultMass )=> {
        objectClass.prototype.mass = exists(defaultMass)? defaultMass : 0;
        objectClass.prototype.setMass = function( mass ) { this.mass = mass; };
        objectClass.prototype.getMass = function() { return this.mass; };
        objectClass.prototype.applyForce = function( force ) {
          var da = new Vec2(force).mul(this.getMass());
          da.add(this.copyAcceleration());
          this.setAcceleration(da);
        };
      },
      applyOnObject: ( object, mass )=> {
        object.setMass = function( mass ) { this.mass = mass; };
        object.getMass = function() { return this.mass; };
        object.applyForce = function( force ) {
          var da = new Vec2(force).mul(this.getMass());
          da.add(this.copyAcceleration());
          this.setAcceleration(da);
        };
      },
      hasMass: ( obj )=> exists(obj.getMass),
      elasticCollision: function( obj1, obj2 ) { // not perfect at all.
        var m1 = this.hasMass(obj1)? obj1.getMass() : 1,
            m2 = this.hasMass(obj2)? obj2.getMass() : 1,
            pos1 = obj1.getPosition(), spd1 = obj1.getSpeed(),
            pos2 = obj2.getPosition(), spd2 = obj2.getSpeed();
        var k = Vec2.translation(pos1, pos2)
                                        .mul(Vec2.distance(spd1, spd2)/(m1+m2));
        obj1.setSpeed(new Vec2(k).mul(m2));
        obj2.setSpeed(k.mul(m1));
        console.log(k);
      }
    },
    applyForce: ( object, force )=> {
      object.setAcceleration(object.getAcceleration().add(force));
    },
    applyGravity: ( object , direction )=> {
      Physics.applyForce(object, new Vec2(direction).mul(9.81));
    },
    applyFriction: ( object )=> {
      if(object.speed)
        Physics.applyForce(object, new Vec2(object.speed).mul(friction));
    },
    applySpaceGravity: ( receiver, emitor )=> {
      var M = emitor.mass | 1, m = receiver.mass | 1;
      var d = Vec2.translation(receiver, emitor);
      var f = (Physics.G*M*m)/d.squareMagnitude();
      Physics.applyForce(receiver, d.normalize().mul(f));
    }
  };
  return Physics;
})();
