Game.objects.colliders = (function(){
  var colliders = {};
  var Collider = (function(){
    var Collider = function() { };
    Collider.prototype.rotate = function( radians )      { };
    Collider.prototype.grow   = function( factor )       { };
    Collider.prototype.getRadius = function() { return 0; };
    Collider.prototype.getRect = function( position ) {
      return Rect.createFromPoint(position);
    };
    Collider.prototype.collidesWhenInside = function( collider ) {
      return false;
    };
    Collider.prototype.prepareCollision = function(collisionObject) {
      if(collisionObject.rect) collisionObject.rect.setRect(this.getRect(collisionObject.position));
      else collisionObject.rect = this.getRect(collisionObject.position);
    };
    Collider.prototype.finishCollision = function() {
      //delete this.collision;
    };
    Collider.prototype.collides = function( collisionObject, otherCollisionObject ) {
      return false;
    };
    return Collider;
  })();
  colliders.Collider = Collider;
  colliders.Collider.prototype = Collider.prototype;
  
  var Shaped = (function(){
    parent = colliders.Collider;
    var ShapedCollider = function( shape ) {
      this.shape = shape.clone();
    };
    classExtend(parent, ShapedCollider);
    ShapedCollider.prototype.rotate = function( radians ) {
      this.shape.rotate(radians);
      };
    ShapedCollider.prototype.grow = function( factor ) {
      this.shape.grow(factor);
    };
    ShapedCollider.prototype.getShape = function() {
      return this.shape;
    };
    ShapedCollider.prototype.setShape = function( shape ) {
      this.shape = shape.clone();
    };
    ShapedCollider.prototype.collides = function( colObj, otherColObj ) {
      
      var col = otherColObj.collider;
      
      return (otherColObj.collider.shape &&
          otherColObj.rect.overlap(colObj.rect) &&
          this.shape.intersect(col.shape) ||
         (this.collidesWhenInside(col) && col.shape.contains(colObj.position))||
         (col.collidesWhenInside(this) && this.shape.contains(otherColObj.position)));
    };
    ShapedCollider.prototype.getRect = function( position ) {
      if(position) this.shape.moveTo(position);
      return this.shape.getRect();
    };
    ShapedCollider.prototype.getRadius = function() {
      return this.shape.getRadius();
    };
    ShapedCollider.prototype.render = function( pos, context2d ) {
      context2d.strokeStyle = '#ff0000';
      this.getRect(pos).draw(context2d, false, true);
      //(new Circle(pos, this.getRadius())).draw(context2d, false, true);
      this.shape.draw(context2d, false, true);
    };
    return ShapedCollider;
  })();
  colliders.Shaped = Shaped;
  colliders.Shaped.prototype = Shaped.prototype;
  return colliders;
})();