Game.hud.views = {
  STATE: { INACTIVE: 1, NONE: 2, OVERED: 4, PRESSED: 8 },
  EVENT_DESC: { MOVE: 0, ENTER: 1, EXIT: 2, SCROLL: 3, DOWN: 4, UP: 5, CLICK: 6 },
  TouchEvent: function(position, description/*, (scroll) | (btn, pressed)*/) {
    this.position = position;
    this.description = description;
    if(description==Game.hud.views.EVENT_DESC.SCROLL) {
      this.scroll = arguments[2];
    }
    if(description >= Game.hud.views.EVENT_DESC.DOWN) {
      this.btn = arguments[2];
      this.pressed = arguments[3];
    }
  }
};

Game.hud.views.View = (function(){
  var View = function(parentView) {
    this.parentView = parentView;
    this.state = Game.hud.views.STATE.INACTIVE;
  };
  View.prototype.render = function( context2d, canvasRect ) {};
  View.prototype.getState = function() { return this.state; };
  View.prototype.setState = function( state ) { this.state = state; };
  View.prototype.getParentView = function() { return this.parentView; };
  View.prototype.setParentView=function(parentView){this.parentView=parentView;};
  View.prototype.onRectUpdate = function( rect ) {};
  View.prototype.getPosition = function() { return new Vec2(Vec2.ZERO); };
  View.prototype.containsPoint = function( point ) { return false; };
  View.prototype.getRect = function() {
    return Rect.createFromPoint(this.getPosition());
  };
  View.prototype.onClick = function( position, btn ) {return false;};
  /**
   * @param event : {
   *    position : Vec2 in this view ref ( (0,0): left top of this view),
   *    description : attribute of Game.hud.views.EVENT_DESC,
   *    button : the button of the mouse the event went from (only for DOWN, UP or CLICK events)
   * }
   * @return true if this view has to handle the next touch event, false otherwise
   */
  var EVENTS = Game.hud.views.EVENT_DESC;
  View.prototype.onTouchEvent = function(event) {
    switch(event.description) {
      case EVENTS.DOWN :
        this.state |= views.STATE.PRESSED;
        return true;
      case EVENTS.UP :
        this.state &= views.STATE.OVERED;
        return false;
      case EVENTS.CLICK : return this.onClick(event.position, event.btn);
      case EVENTS.MOVE : return isPressed();
      case EVENTS.ENTER :
        this.state = views.STATE.OVERED; return false;
      case EVENTS.EXIT :
        this.state = views.STATE.NONE; return isPressed();
      default: break;
    }
  };
  View.update = function() {
    var parent = this.getParentView();
    if(!isNull(parent)) parent.updateRect(parent.getChildRect(this));
  };
  View.prototype.isOvered = function() {
    return (this.state & Game.hud.views.STATE.OVERED) !== 0;
  };
  View.prototype.isPressed = function() {
    return (this.state & Game.hud.views.STATE.PRESSED) !== 0;
  };
  View.prototype.hasFocus = function() {
    return this.isHovered() || this.isPressed();
  };
  View.prototype.toString = function() { return 'hud.views.View'; };
  return View;
})();
Game.hud.views.TextView = (function(){
  var parent = Game.hud.views.View;
  var TextView = function(parentView, text, rect, color ) {
    parent.call(this, parentView);
    this.setText(text);
    if(!isNull(rect))this.setRect(rect);
    this.setFontSize(12);
    this.setFont('Verdana');
    if(!isNull(color)) this.setTextColor(color);
  };
  classExtend(parent, TextView);
  TextView.prototype.setText = function( text ) { this.text = text; };
  TextView.prototype.getText = function() { return this.text; };
  TextView.prototype.setFontSize = function( px ) { this.fontSize = px; };
  TextView.prototype.getFontSize = function() { return this.fontSize; };
  TextView.prototype.setFont = function( font ) { this.font = font; };
  TextView.prototype.getFont = function() { return this.font; };
  TextView.prototype.setTextColor = function( color ) { this.textColor = color; };
  TextView.prototype.getTextColor = function() { return this.textColor; };
  TextView.prototype.setRect = function() { this.rect = rect; };
  TextView.prototype.getRect = function() { return this.rect; };
  
  TextView.prototype.getPosition = function() { return getRect().center(); };
  TextView.prototype.containsPoint = function( point ) {
    return this.getRect().contains(point);
  };
  TextView.prototype.render = function( context2d, canvasRect ) {
    var rect = this.getRect();
    if(isNull(rect)) rect = canvasRect;
    if(this.getState() & Game.hud.views.STATE.OVERED) {
      context2d.lineWidth *= 2;
      context2d.strokeStyle = '#fff';
      rect.draw(context2d, this.fill, true);
      context2d.lineWidth /= 2;
    }
    context2d.strokeStyle = this.getTextColor();
    var textSize = this.getFontSize();
    context2d.font = [textSize , 'px ', this.getFont()].concat(); 
    context2d.wrapText(this.getText(), rect, this.getFontSize()*1.25, Gravity.CENTER);
  };
  return TextView;
})();
Game.hud.views.Button = (function(){
  var parent = Game.hud.views.TextView;
  var Button = function(parentView, shape, shapeColor, text, textColor ) {
    if(isNull(textColor)) textColor = 'black';
    parent.call(this, parentView, text, undefined, textColor);
    this.setShape(shape);
    this.setShapeColor(shapeColor);
    this.stroke = true;
    this.fill = false;
    this.setGravity(Gravity.LEFT | Gravity.TOP);
  };
  classExtend(parent, Button);
  Button.prototype.setShape = function( shape ) { this.shape = shape.clone(); };
  Button.prototype.getShape = function() { return this.shape; };
  Button.prototype.getPosition = function() { return this.getShape().center; };
  Button.prototype.getRect = function() {
    return this.getShape().getRect();
  };
  Button.prototype.setGravity = function( gravity ) {
    this.gravity = gravity;
  };
  Button.prototype.getGravity = function() {
    if(isNull(this.gravity)) return Gravity.LEFT | Gravity.TOP;
    else return gravity;
  };
  Button.prototype.onClick = function() { return true; };
  Button.prototype.getShapeColor = function() { return this.shapeColor; };
  Button.prototype.setShapeColor = function( color ) { this.shapeColor = color; };
  Button.prototype.setStroke = function( stroke ) { this.stroke = stroke; };
  Button.prototype.setFill = function( fill ) { this.fill = fill; };
  Button.prototype.containsPoint = function( point ) {
    return this.getShape().contains(point);
  };
  var render = override(Button, 'render', function( context2d, canvasRect ) {
    context2d.fillStyle = context2d.strokeStyle = this.getShapeColor();
    if(this.getState() & Game.hud.views.STATE.OVERED) {
      context2d.lineWidth *= 2;
      context2d.strokeStyle = '#fff';
      this.getShape().draw(context2d, this.fill, true);
      context2d.lineWidth /= 2;
    }
    else this.getShape().draw(context2d, this.fill, this.stroke);
    render.call(this, context2d);
  });
  return Button;
})();
Game.hud.views.ProgressBar = (function(){
  var parent = Game.hud.views.View;
  var ProgressBar = function(parentView, width, height, max, value ) {
    parent.call(this, parentView);
    this.needStrokeUpdate = true;
    this.needFillUpdate = true;
    this.setWidth(width);
    this.setHeight(height);
    this.setMax(max);
    this.setValue(value);
    this.setMargins(0, 0);
    this.setGravity(Gravity.LEFT | Gravity.TOP);
    this.setColor("#f00");
  };
  classExtend(parent, ProgressBar);
  ProgressBar.prototype.createShape = function( isForStroke, canvasRect ) {
    var w = isForStroke? this.getWidth() :
            this.getWidth()/this.getMax()*this.getValue();
    var h = this.getHeight();
    var g = this.getGravity();
    var left = NaN, top = NaN, bottom = NaN, right = NaN;
    if((g & Gravity.RIGHT) === Gravity.RIGHT)
      right = canvasRect.right - this.getMarginX();
    else if((g & Gravity.LEFT) === Gravity.LEFT ||
          ((g & Gravity.CENTER) !== Gravity.CENTER)) {
      left = canvasRect.left + this.getMarginX();
    }
    else left = canvasRect.left + (canvasrect.width() - w)/2;
    
    if((g & Gravity.BOTTTOM) === Gravity.BOTTOM)
      bottom = canvasRect.bottom - this.getMarginY();
    else if((g & Gravity.TOP) === Gravity.TOP ||
          ((g & Gravity.CENTER) !== Gravity.CENTER)) {
      top = canvasRect.top + this.getMarginY();
    }
    else top = canvasRect.top + (canvasRect.height() - h)/2;
    if(isNaN(left)) left = right-w;
    else if(isNaN(right)) right = left+w;
    if(isNaN(top)) top = bottom-h;
    else if(isNaN(bottom)) bottom = top+h;
    
    return (new Rect(left, top, right, bottom)).getShape();
  };
  ProgressBar.prototype.setGravity = function( gravity ) {
    this.gravity = gravity;
    this.needStrokeUpdate = this.needFillUpdate = true;
  };
  ProgressBar.prototype.getGravity = function() { return this.gravity; };
  ProgressBar.prototype.getStrokeShape = function( canvasRect ) {
    if(this.needStrokeUpdate && !isNull(canvasRect)) {
      this.strokeShape = this.createShape(true, canvasRect);
      this.needStrokeUpdate = false;
    }
    return this.strokeShape;
  };
  ProgressBar.prototype.getFillShape = function( canvasRect ) {
    if(this.needFillUpdate && !isNull(canvasRect)) {
      this.fillShape = this.createShape(false, canvasRect);
      this.needFillUpdate = false;
    }
    return this.fillShape;
  };
  ProgressBar.prototype.setWidth = function( width ) {
    this.width = width;
    this.needStrokeUpdate = this.needFillUpdate = true;
  };
  ProgressBar.prototype.getWidth = function() { return this.width; };
  ProgressBar.prototype.setHeight = function( height ) {
    this.height = height;
    this.needStrokeUpdate = this.needFillUpdate = true;
  };
  ProgressBar.prototype.getHeight = function() { return this.height; };
  ProgressBar.prototype.setMax = function( max ) {
    this.max = max;
    this.needFillUpdate = this.needStrokeUpdate = true;
  };
  ProgressBar.prototype.getMax = function() { return this.max; };
  ProgressBar.prototype.setValue = function( value ) {
    this.value = value;
    this.needFillUpdate = true;
  };
  ProgressBar.prototype.getValue = function() { return this.value; };
  ProgressBar.prototype.setMargins = function( x, y ) {
    if(!isNaN(x)) this.marginX = x;
    if(!isNaN(y)) this.marginY = y;
    this.needStrokeUpdate = this.needFillUpdate = true;
  };
  ProgressBar.prototype.getMarginX = function() { return this.marginX; };
  ProgressBar.prototype.getMarginY = function() { return this.marginY; };
  ProgressBar.prototype.setColor = function( color ) { this.color= color; };
  ProgressBar.prototype.getColor = function() { return this.color; };
  ProgressBar.prototype.onRectUpdate = function( rect ) {
    this.needStrokeUpdate = this.needFillUpdate = true;
  };
  ProgressBar.prototype.getPosition = function() {
    return this.getStrokeShape().center;
  };
  ProgressBar.prototype.getRect = function() {
    return this.getStrokeShape().getRect();
  };
  ProgressBar.prototype.containsPoint = function( point ) {
    var shape = this.getStrokeShape();
    return !isNull(shape) && shape.contains(point);
  };
  ProgressBar.prototype.render = function( context2d, canvasRect ) {
    var stroke = this.getStrokeShape( canvasRect );
    var fill = this.getFillShape( canvasRect );
    var color = this.getColor();
    context2d.fillStyle = color;
    fill.draw(context2d, true, false);
    if(this.getState() & Game.hud.views.STATE.OVERED) {
      context2d.lineWidth *= 2;
      context2d.strokeStyle = '#fff';
      stroke.draw(context2d, false, true);
      context2d.lineWidth /= 2;
    }
    else {
      context2d.strokeStyle = color;
      stroke.draw(context2d, false, true);
    }
  };
  return ProgressBar;
})();
Game.hud.views.SegmentedProgressBar = (function(){
  var parent = Game.hud.views.ProgressBar;
  var SPB = function(parentView, width, height, max, value, segments, inclination ) {
    parent.call(this, parentView, width, height, max, value);
    this.setSegments(segments);
    this.setInclination(inclination);
  };
  classExtend(parent, SPB);
  SPB.prototype.setSegments = function( segmentsNumber ) {
    this.segments = segmentsNumber;
    this.needStrokeUpdate = this.needFillUpdate = true;
  };
  SPB.prototype.getSegments = function() { return this.segments; };
  SPB.prototype.setInclination = function( inclination ) {
    this.inclination = inclination;
    this.needStrokeUpdate = this.needFillUpdate = true;
  };
  SPB.prototype.getInclination = function() { return this.inclination; };
  SPB.prototype.createShape = function( isForStroke, canvasRect ) {
    var h      = this.getHeight(), inclin = this.getInclination(),
        segs = this.getSegments(), w = this.getWidth()-inclin*h,
        segWdth = w/segs, dH = h/segs, dW = dH*inclin;
    var p = [new Vec2(inclin*h,0), new Vec2(0,h)];
    var i=0;
    var i2 = 0;
    if(isForStroke) {
      for(i=1; i< segs+1; i++) {
        i2 = 2*i;
        p.push(new Vec2(p[i2-1].x+segWdth, p[i2-1].y));
        p.push(new Vec2(p[i2].x+dW, p[i2].y-dH));
    } }
    else {
      var val = this.getValue(), max = this.getMax();
      for(i=1; i< segs+1; i++) {
        i2 = 2*i;
        if(val > max*i/segs) {
          p.push(new Vec2(p[i2-1].x+segWdth, p[i2-1].y));
          p.push(new Vec2(p[i2].x+dW, p[i2].y-dH));
        }
        else {
          var segVal = max/segs;
          dW = (val - max*(i-1)/segs)*w/max;
          p.push(new Vec2(p[i2-1].x+dW, p[i2-1].y));
          p.push(new Vec2(p[0].x+val/max*w, 0));
    } } }
    var result = new Polygon(p);
    result.move(canvasRect.left + this.getMarginX(),
                canvasRect.top + this.getMarginY());
    var g = this.getGravity();
    if(g & Gravity.BOTTOM)
      result.mirrorVertically((canvasRect.top + canvasRect.bottom)/2);
    if(g & Gravity.RIGHT)
      result.mirrorHorizontally((canvasRect.left + canvasRect.right)/2);
    return result;
  };
  return SPB;
})();