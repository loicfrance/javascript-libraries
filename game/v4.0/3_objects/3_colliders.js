/**
 * author : Loic France
 * created 05/31/2016
 */
Game.objects.colliders = (function(){
  var colliders = {};
  var Collider = (function(){
    class Collider {
      constructor() { }
      rotate( radians ) { }
      grow( factor ) { }
      getRadius() { return 0; }
      getRect( position ) { return Rect.createFromPoint(position); }
      collidesWhenInside( collider ) { return false; }
      prepareCollision( collisionObject ) {
        if(collisionObject.rect) collisionObject.rect.setRect(this.getRect(collisionObject.position));
        else collisionObject.rect = this.getRect(collisionObject.position);
      }
      finishCollision() { }
      collides( collisionObject, otherCollisionObject ) {
        return false;
      }
    }
    return Collider;
  })();
  colliders.Collider = Collider;
  var Shaped = (function(){
    class Shaped extends colliders.Collider {
      constructor( shape ) {
        super();
        this.shape = shape.clone();
      }
      rotate( radians ) { this.shape.rotate(radians); }
      grow( factor ) { this.shape.grow(factor); }
      getShape() { return this.shape; }
      setShape( shape ) { this.shape = shape.clone(); }
      collides( colObj, otherColObj ) {
        let col = otherColObj.collider;
        return (otherColObj.collider.shape && otherColObj.rect.overlap(colObj.rect) &&
            this.shape.intersect(col.shape) ||
           (this.collidesWhenInside(col) && col.shape.contains(colObj.position))||
           (col.collidesWhenInside(this) && this.shape.contains(otherColObj.position)));
      }
      getRect( position ) {
        if(position) this.shape.moveTo(position);
        return this.shape.getRect();
      }
      getRadius() {
        return this.shape.getRadius();
      }
      render( pos, context2d ) {
        context2d.strokeStyle = '#ff0000';
        this.getRect(pos).draw(context2d, false, true);
        //(new Circle(pos, this.getRadius())).draw(context2d, false, true);
        this.shape.draw(context2d, false, true);
      }
    }
    return Shaped;
  })();
  colliders.Shaped = Shaped;
  colliders.Shaped.prototype = Shaped.prototype;
  return colliders;
})();