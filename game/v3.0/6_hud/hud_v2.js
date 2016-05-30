Game.hud = {};
game.hud.Manager = (function(){
  var HudManager = function() {
    this.views = [];
  };
})();
Game.hud.views = (function(){
  var views = {};
  views.View = (function(){
    var View = function( canvasDOM ) {
    this.context2d = canvasDOM.canvasDOM.getContext('2d');
    this.canvas = canvasDOM;
    this.update();
    };
    View.prototype.getWidth  = function() { return this.canvas.width;  };
    View.prototype.getHeight = function() { return this.canvas.height; };
    View.prototype.setScale = function(scaleX, scaleY) {
      this.context2d.transform(scaleX, 0, 0, scaleY, 0, 0);
    };
    View.prototype.update = function() {
      if(this.updateRequested) return;
      requestAnimationFrame(this.render.bind(this));
      this.updateRequested = true;
    };
    View.prototype.render = function() {
      this.context2d.clearRect(0, 0, this.canvas.width, this.height);
      delete this.updateRequested;
    };
    return View;
  })();
  views.TextView = (function(){
    var parent = views.View;
    var TextView = function( canvasDOM, text ) {
      this.text = text;
      parent.call(this, canvasDOM);
    };
    var render = override(TextView, 'render', function() {
      render.call(this);
      this.context2d.wrapText(this.text,
                          new Rect(0, 0, this.getWidth(), this.getHeight()),
                          12, Gravity.CENTER);
    });
    return TextView;
  })();
  views.ProgressBar = (function() {
    var parent = views.View;
    var ProgressBar = function( canvasDOM, max, value ) {
      this.max = max;
      this.value = isNaN(value)? max : value;
      this.gravity = Gravity.LEFT | Gravity.TOP;
      parent.call(this, canvasDOM);
    };
    ProgressBar.prototype.setMax = function( max )
      { this.max = max; this.update(true,true); };
    ProgressBar.prototype.getMax = function() { return this.max; };
    ProgressBar.prototype.setValue = function( value )
      { this.value = value; this.update(true, false); };
    ProgressBar.prototype.getValue = function() { return this.value; };
    ProgressBar.prototype.setGravity = function( gravity )
      { this.gravity |= gravity; this.update(false, true); };
    ProgressBar.prototype.getGravity = function() { return this.gravity; };
    ProgressBar.prototype.createShape = function( toFill ) {
      return new Rect(0, 0, toFill ? (this.value/this.max)*this.getWidth() :
                      this.getWidth(), this.getHeight()).getShape();
    };
    var update = override(ProgressBar, 'update', function(fill, stroke) {
      if(!exists(fill)) fill = stroke = true;
      if(stroke)this.strokeShape = this.createShape(false);
      if(fill)this.fillShape = this.createShape(true);
      var g = this.getGravity();
      switch(Gravity.getVerticalGravity(g)) {
        case Gravity.BOTTOM :
          var axisY = this.getHeight()/2;
          this.strokeShape.mirrorVertically(axisY);
          this.fillShape.mirrorVertically(axisY);
          break;
        default : break;
      }
      switch(Gravity.getHorizontalGravity(g)) {
        case Gravity.RIGHT :
          var axisX = this.getHeight()/2;
          this.strokeShape.mirrorHorizontally(axisY);
          this.fillShape.mirrorHorizontally(axisY);
          break;
        default : break;
      }
      update.call(this);
    });
    var render = override(ProgressBar, 'render', function() {
      render.call(this);
      this.strokeShape.draw(this.context2d, false, true);
      this.fillShape.draw(this.context2d, true, false);
    });
    return ProgressBar;
  })();
  views.ProgressBar2 = (function(){
    var parent = views.ProgressBar;
    var ProgressBar2 = function( canvasDOM, max, value, inclination, segments ) {
      this.inclination = isNaN(inclination)? 0 : inclination;
      this.segments = isNaN(segments)? 1 : segments>0 ? segments : 1;
      parent.call(this, canvasDOM, max, value);
    };
    ProgressBar2.prototype.getInclination = function() { return this.inclin; };
    ProgressBar2.prototype.setInclination = function( inclin ) {
      this.inclination = inclin; this.update();
    };
    ProgressBar2.prototype.getSegments = function() { return this.segments; };
    ProgressBar2.prototype.setSegments = function() {
      this.segments = segments; this.update();
    };
    ProgressBar2.prototype.createShape = function(toFill) {
      var g = this.getGravity();
      var segments = this.getSegments();
      var x=0, y=0; //arrays
      var i= 0, i2= 0;
      var height = this.getHeight(), width = this.getWidth();
      var dH = height/segments, dW = this.getinclination()*dH,
          segW = width/segments;
      var vertCenter = (Gravity.getVerticalGravity(g)===Gravity.CENTER);
      if(vertCenter) {
        dH /= 2; dW /= 2;
        y += height/2;
      }
      if(dW > 0) segW -= dW;
      var  p;
      var last;
      var valueWidth = segW*(toFill? this.getMax() : this.getValue());
      if(Gravity.getHorizontalGravity(g) == Gravity.CENTER) {
        p = [new Vec2(x, y), new Vec2(x+dW, y+dH)];
        last = p[1];
        segW /= 2;
        for(i=segments-1; i> 0; i--) {
          last = new Vec2(last).add(segW, 0);
          if(valueWidth > segW*i) {
            if(valueWidth < segW*(i+1)) last.add(-(valueWidth%segW), 0);
            p.push(last);
            last = new Vec2(last).add(valueWidth%segW, 0);
            p.push(last);
          }
          last = new Vec2(last).add(dW, dH);
          if(valueWidth > segW*i) p.push(last);
        }
        last = new Vec2(last).add(segW*2, 0); p.push(last);
        last = new Vec2(last).add(dW,-dH); p.push(last);
        for(i=segments-1; i> 0; i--) {
          last = new Vec2(last).add(segW, 0); p.push(last);
          last = new Vec2(last).add(dW,-dH); p.push(last);
        }
        if(vertCenter) {
          for(i=segments-1; i> 0; i--) {
            last = new Vec2(last).add(-dW,-dH); p.push(last);
            last = new Vec2(last).add(-segW, 0); p.push(last);
          }
          last = new Vec2(last).add(-dW,-dH); p.push(last);
          last = new Vec2(last).add(-segW*2, 0); p.push(last);
          for(i=segments-1; i>0; i--) {
            last = new Vec2(last).add(-dW, dH); p.push(last);
            last = new Vec2(last).add(-segW, 0); p.push(last);
          }
        }
      }
      p = [new Vec2(inclin*h,0), new Vec2(0,h)];
      var len = this.segments*2+2;
      if(toFill) {
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
      else {
        for(i=1; i< segs+1; i++) {
          i2 = 2*i;
          p.push(new Vec2(p[i2-1].x+segWdth, p[i2-1].y));
          p.push(new Vec2(p[i2].x+dW, p[i2].y-dH));
      } }
      return new Polygon(p);
    };
    return ProgressBar2;
  })();
})();