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
    Collider.prototype.prepareCollision = function(position) {
      this.collision = {
        rect: this.getRect(position),
      };
    };
    Collider.prototype.finishCollision = function() {
      delete this.collision;
    };
    Collider.prototype.collides = function( objPos, otherPos, collider ) {
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
    ShapedCollider.prototype.collides = function( objPos, otherPos, collider ) {
      return (!isNull(collider.shape) &&
          collider.collision.rect.overlap(this.collision.rect) &&
          this.shape.intersect(collider.shape) ||
         (this.collidesWhenInside(collider) && collider.shape.contains(objPos))||
         (collider.collidesWhenInside(this) && this.shape.contains(otherPos)));
    };
    ShapedCollider.prototype.getRect = function( position ) {
      if(position) this.shape.moveTo(position); return this.shape.getRect();
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