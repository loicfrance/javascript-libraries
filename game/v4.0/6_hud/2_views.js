/**
 * author : Loic France
 * created 05/31/2016
 */
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
  var EVENTS = Game.hud.views.EVENT_DESC;
  class View {
    constructor(parentView) {
      this.parentView = parentView;
    }
    render( context2d, canvasRect ) {}
    getState() { return this.state; }
    setState( state ) { this.state = state; }
    getParentView() { return this.parentView; }
    setParentView(parentView){this.parentView=parentView;}
    onRectUpdate( rect ) {}
    getPosition() { return new Vec2(Vec2.ZERO); }
    containsPoint( point ) { return false; }
    getRect() { return Rect.createFromPoint(this.getPosition()); }
    onClick( position, btn ) { return false; }
  /**
   * @param event : {
   *    position : Vec2 in this view ref ( (0,0): left top of this view),
   *    description : attribute of Game.hud.views.EVENT_DESC,
   *    button : the button of the mouse the event went from (only for DOWN, UP or CLICK events)
   * }
   * @return true if this view has to handle the next touch event, false otherwise
   */
    onTouchEvent(event) {
      switch(event.description) {
        case EVENTS.DOWN :
          this.state |= views.STATE.PRESSED;
          return true;
        case EVENTS.UP :
          this.state &= views.STATE.OVERED;
          return false;
        case EVENTS.CLICK : return this.onClick(event.position, event.btn);
        case EVENTS.MOVE : return this.hasFocus();
        case EVENTS.ENTER :
          this.state = views.STATE.OVERED; return this.hasFocus();
        case EVENTS.EXIT :
          this.state = views.STATE.NONE; return this.hasFocus();
        default: break;
      }
    }
    update() {
      var parent = this.getParentView();
      if(!isNull(parent)) parent.updateRect(parent.getChildRect(this));
    }
    isOvered() { return (this.state & Game.hud.views.STATE.OVERED) !== 0; }
    isPressed() { return (this.state & Game.hud.views.STATE.PRESSED) !== 0; }
    hasFocus() { return this.isPressed(); }
    toString() { return 'hud.views.View'; }
  }
  View.prototype.state = Game.hud.views.STATE.INACTIVE;
  return View;
})();
Game.hud.views.TextView = (function(){
  class TextView extends Game.hud.views.View {
    constructor(parentView, text, rect, color ) {
      super(parentView);
      this.setText(text);
      if(!isNull(rect))this.setRect(rect);
      this.setFontSize(12);
      this.setFont('Verdana');
      if(!isNull(color)) this.setTextColor(color);
    }
    setText( text ) { this.text = text; }
    getText() { return this.text; }
    setFontSize( px ) { this.fontSize = px; }
    getFontSize() { return this.fontSize; }
    setFont( font ) { this.font = font; }
    getFont() { return this.font; }
    setTextColor( color ) { this.textColor = color; }
    getTextColor() { return this.textColor; }
    setRect() { this.rect = rect; }
    getRect() { return this.rect; }
    getPosition() { return getRect().center(); }
    containsPoint( point ) { return this.getRect().contains(point); }
    render( context2d, canvasRect ) {
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
      context2d.wrapText(this.getText(), rect, textSize*1.25, Gravity.CENTER, false, true);
    }
  }
  return TextView;
})();
Game.hud.views.Button = (function(){
  class Button extends Game.hud.views.TextView {
    constructor( parentView, shape, shapeColor, text, textColor ) {
      if(isNull(textColor)) textColor = 'black';
      super(parentView, text, undefined, textColor);
      this.setShape(shape);
      this.setShapeColor(shapeColor);
      this.stroke = true;
      this.fill = false;
      this.setGravity(Gravity.LEFT | Gravity.TOP);
    }
    setShape( shape ) { this.shape = shape.clone(); }
    getShape() { return this.shape; }
    getPosition() { return this.getShape().center; }
    getRect() { return this.getShape().getRect(); }
    setGravity( gravity ) { this.gravity = gravity; }
    getGravity() { return this.gravity || Gravity.LEFT|Gravity.TOP; }
    onClick() { return true; }
    getShapeColor() { return this.shapeColor; }
    setShapeColor( color ) { this.shapeColor = color; }
    setStroke( stroke ) { this.stroke = stroke; }
    setFill( fill ) { this.fill = fill; }
    containsPoint( point ) { return this.getShape().contains(point); }
    render( context2d, canvasRect ) {
      context2d.fillStyle = context2d.strokeStyle = this.getShapeColor();
      if(this.getState() & Game.hud.views.STATE.OVERED) {
        context2d.lineWidth *= 2;
        context2d.strokeStyle = '#fff';
        this.getShape().draw(context2d, this.fill, true);
        context2d.lineWidth /= 2;
      }
      else this.getShape().draw(context2d, this.fill, this.stroke);
      super.render(context2d, canvasRect);
    }
  }
  Button.prototype.state = Game.hud.views.STATE.ACTIVE;
  return Button;
})();
Game.hud.views.ProgressBar = (function(){
  class ProgressBar extends Game.hud.views.View {
    constructor(parentView, width, height, max, value ) {
      super(parentView);
      this.needStrokeUpdate = true;
      this.needFillUpdate = true;
      this.setWidth(width);
      this.setHeight(height);
      this.setMax(max);
      this.setValue(value);
      this.setMargins(0, 0);
      this.setGravity(Gravity.LEFT | Gravity.TOP);
      this.setColor("#f00");
    }
    createShape( isForStroke, canvasRect ) {
      let w = isForStroke? this.getWidth() :
              this.getWidth()/this.getMax()*this.getValue(),
          h = this.getHeight(),
          g = this.getGravity(),
          left = NaN, top = NaN, bottom = NaN, right = NaN;
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
           if(isNaN(left  )) left = right-w;
      else if(isNaN(right )) right = left+w;
           if(isNaN(top   )) top = bottom-h;
      else if(isNaN(bottom)) bottom = top+h;
      return (new Rect(left, top, right, bottom)).getShape();
    }
    setGravity( gravity ) {
      this.gravity = gravity;
      this.needStrokeUpdate = this.needFillUpdate = true;
    }
    getGravity() { return this.gravity; }
    getStrokeShape( canvasRect ) {
      if(this.needStrokeUpdate && !isNull(canvasRect)) {
        this.strokeShape = this.createShape(true, canvasRect);
        this.needStrokeUpdate = false;
      }
      return this.strokeShape;
    }
    getFillShape( canvasRect ) {
      if(this.needFillUpdate && !isNull(canvasRect)) {
        this.fillShape = this.createShape(false, canvasRect);
        this.needFillUpdate = false;
      }
      return this.fillShape;
    }
    setWidth( width ) {
      this.width = width;
      this.needStrokeUpdate = this.needFillUpdate = true;
    }
    getWidth() { return this.width; }
    setHeight( height ) {
      this.height = height;
      this.needStrokeUpdate = this.needFillUpdate = true;
    }
    getHeight() { return this.height; }
    setMax( max ) {
      this.max = max;
      this.needFillUpdate = this.needStrokeUpdate = true;
    }
    getMax() { return this.max; }
    setValue( value ) {
      this.value = value;
      this.needFillUpdate = true;
    }
    getValue() { return this.value; }
    setMargins( x, y ) {
      if(typeof x == TYPE_NUMBER) this.marginX = x;
      if(typeof y == TYPE_NUMBER) this.marginY = y;
      this.needStrokeUpdate = this.needFillUpdate = true;
    }
    getMarginX() { return this.marginX; }
    getMarginY() { return this.marginY; }
    setColor( color ) { this.color= color; }
    getColor() { return this.color; }
    onRectUpdate( rect ) { this.needStrokeUpdate = this.needFillUpdate = true; }
    getPosition() { return this.getStrokeShape().center; }
    getRect() { return this.getStrokeShape().getRect(); }
    containsPoint( point ) {
      var shape = this.getStrokeShape();
      return !isNull(shape) && shape.contains(point);
    }
    render( context2d, canvasRect ) {
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
    }
  }
  return ProgressBar;
})();
Game.hud.views.SegmentedProgressBar = (function(){
  class SegmentedProgressBar extends Game.hud.views.ProgressBar {
    constructor( parentView, width, height, max, value, segments, inclination ) {
      super(parentView, width, height, max, value);
      this.setSegments(segments);
      this.setInclination(inclination);
    }
    setSegments( segmentsNumber ) {
      this.segments = segmentsNumber;
      this.needStrokeUpdate = this.needFillUpdate = true;
    }
    getSegments() { return this.segments; }
    setInclination( inclination ) {
      this.inclination = inclination;
      this.needStrokeUpdate = this.needFillUpdate = true;
    }
    getInclination() { return this.inclination; }
      createShape( isForStroke, canvasRect ) {
      let h = this.getHeight(), inclin = this.getInclination(),
          segs = this.getSegments(), w = this.getWidth()-inclin*h,
          segWdth = w/segs, dH = h/segs, dW = dH*inclin,
          p = [new Vec2(inclin*h,0), new Vec2(0,h)],
          i=0,
          i2 = 0;
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
      result.moveXY(canvasRect.left + this.getMarginX(),
                  canvasRect.top + this.getMarginY());
      var g = this.getGravity();
      if(g & Gravity.BOTTOM)
        result.mirrorVertically((canvasRect.top + canvasRect.bottom)/2);
      if(g & Gravity.RIGHT)
        result.mirrorHorizontally((canvasRect.left + canvasRect.right)/2);
      return result;
    }
  }
  return SegmentedProgressBar;
})();