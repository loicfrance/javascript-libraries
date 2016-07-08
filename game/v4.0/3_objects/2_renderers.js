/**
 * author : Loic France
 * created 05/31/2016
 */
Game.objects.renderers = (function(){
  var result = {};
  result.Renderer = (function(){
    class Renderer {
      constructor() { }
      rotate( radians ) { }
      grow( factor ) { }
      render( position, context2d ) { }
      getRadius() { return 0; }
      getRect( position ) { return Rect.createFromPoint(position); }
    }
    return Renderer;
  })();
  result.Shaped = (function(){
    class Shaped extends result.Renderer {
      constructor( shape, color='#0F0' )  {
        super();
        this.shape = shape.clone();
        this.color = color;
      }
      rotate( radians ) { this.shape.rotate(radians); }
      grow( factor ) { this.shape.grow(factor); }
      getColor() { return this.color; }
      setColor( color ) { this.color = color; }
      getShape() { return this.shape; }
      setShape( shape ) { this.shape = shape.clone(); }
      render( position, context2d ) {
        if(this.fill) context2d.fillStyle = this.color;
        else if(this.stroke) context2d.strokeStyle = this.color;
        this.shape.moveTo(position);
        this.shape.draw(context2d, this.fill, this.stroke);
      }
      getRect( position=null ) {
        if(position) this.shape.moveTo(position);
        return this.shape.getRect();
      }
      getRadius() {
         return this.shape.getRadius();
      }
    }
    Shaped.prototype.fill = true;
    Shaped.prototype.stroke = false;
    return Shaped;
  })();
  return result;
})();