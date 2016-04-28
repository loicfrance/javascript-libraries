Game.objects.renderers = (function(){
  var result = {};
  result.Renderer = (function(){
    var Renderer = function() { };
    Renderer.prototype.rotate = function( radians )      { };
    Renderer.prototype.grow   = function( factor )       { };
    Renderer.prototype.render = function( position, context2d ) { };
    Renderer.prototype.getRadius = function() { return 0; };
    Renderer.prototype.getRect = function( position ) {
      return Rect.createFromPoint(position);
    };
    return Renderer;
  })();
  
  result.Shaped = (function(){
    parent = result.Renderer;
    ShapedRenderer = function( shape, color ) {
      this.shape = shape.clone();
      this.color = color;
      this.fill = true;
    };
    classExtend(parent, ShapedRenderer);
    ShapedRenderer.prototype.rotate = function( radians ) {
      this.shape.rotate(radians);
    };
    ShapedRenderer.prototype.grow = function( factor ) {
      this.shape.grow(factor);
    };
    ShapedRenderer.prototype.getColor = function() { return this.color; };
    ShapedRenderer.prototype.setColor = function( color ) {this.color = color;};
    ShapedRenderer.prototype.setShape = function( shape ) {
      this.shape = shape.clone();
    };
    ShapedRenderer.prototype.getShape = function() { return this.shape; };
    ShapedRenderer.prototype.render = function( position, context2d ) {
      if(this.fill) context2d.fillStyle = this.color;
      if(this.stroke) context2d.strokeStyle = this.color;
      this.shape.moveTo(position);
      this.shape.draw(context2d, this.fill, this.stroke);
    };
    ShapedRenderer.prototype.getRect = function( position ) {
      this.shape.moveTo(position); return this.shape.getRect();
    };
    ShapedRenderer.prototype.getRadius = function() {
      return this.shape.getRadius();
    };
    return ShapedRenderer;
  })();
  return result;
})();