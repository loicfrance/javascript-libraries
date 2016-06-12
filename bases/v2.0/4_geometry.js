/**
 * author : Loic France
 * created 05/31/2016
 */
//______________________________________________________________________________
// - - - - - - - - - - - - - - - - - - -Vec2 - - - - - - - - - - - - - - - - - -
//******************************************************************************
/**
 * @constructor
 */
var Vec2 = function(x, y /* | vec2 | nothing */) {
  this.x = x;
  this.y = y;
};
Vec2.prototype.clone = function() { return new Vec2(this.x, this.y); };
Vec2.prototype.setXY = function( x, y ) {
  this.x = x;
  this.y = y;
  return this;
};
Vec2.prototype.raz = function() {
  this.x = this.y = 0;
  return this;
};
Vec2.prototype.set = function( vec ) {
  this.x = vec.x;
  this.y = vec.y;
  return this;
};
Vec2.prototype.addXY = function( x, y ) {
  this.x += x;
  this.y += y;
  return this;
};
Vec2.prototype.add = function( vec ) {
  this.x += vec.x;
  this.y += vec.y;
  return this;
};
Vec2.prototype.remove = function( vec ) {
  this.x -= vec.x;
  this.y -= vec.y;
  return this;
};
Vec2.prototype.mul = function( factor ) {
  this.x *= factor;
  this.y *= factor;
  return this;
};
Vec2.prototype.squareMagnitude=function(){return this.x*this.x + this.y*this.y;};
Vec2.prototype.magnitude= function() {return Math.sqrt(this.squareMagnitude());};
Vec2.prototype.getAngle = function() { return Math.atan2(this.y, this.x); };
Vec2.prototype.rotate = function( radians ) {
  var angle = this.getAngle() + radians;
  var mag = this.magnitude();
  this.setXY(mag*Math.cos(angle), mag*Math.sin(angle));
  return this;
};
Vec2.prototype.rotateAround = function( center, radians) {
  var delta = Vec2.translation(center, this);
  delta.rotate(radians);
  this.set(delta.add(center));
  return this;
};
Vec2.prototype.toString = function() {
  return '(' + this.x + ', ' + this.y + ')';
};
Vec2.prototype.equalsXY = function( x, y ) {
  return this.x == x && this.y == y;
};
Vec2.prototype.equals = function( vec ) {
  return this.x === vec.x && this.y === vec.y;
};
Vec2.prototype.isZero = function() { return !(this.x||this.y); };
Vec2.prototype.getUnit = function() { return this.clone().normalize(); };
Vec2.prototype.getMirror = function( center ) {
  return Vec2.translation(this, center).add(center);
};
Vec2.prototype.getHorizontalMirror = function ( axisX ) {
  var v = this.clone();
  if(axisX) v.x = 2*axisX - v.x;
  else v.x = -v.x;
  return v;
};
Vec2.prototype.getVerticalMirror = function( axisY ) {
  var v = this.clone();
  if(axisY) v.y = 2*axisY - v.y;
  else v.y = -v.y;
  return v;
};
Vec2.prototype.normalize = function() { return this.mul(1/this.magnitude()); };
Vec2.prototype.roundedX = function( digits ) {
  if(digits) return this.x.toPrecision(digits);
  else return Math.round(this.x);
};
Vec2.prototype.roundedY = function( digits ) {
  if(digits) return this.y.toPrecision(digits);
  else return Math.round(this.y);
};
Vec2.prototype.roundedVec = function( digits ) {
  return new Vec2(this.roundedX(digits), this.roundedY(digits));
};
Vec2.prototype.clampMagnitude = function( min,  max ) {
  var mag = this.magnitude();
  if(mag < min) this.mul(min/mag);
  else if(mag > max) this.mul(max/mag);
  return this;
};
Vec2.dotProd = ( u, v )=> u.x*v.x + u.y*v.y;
Vec2.vectProd = ( u, v )=> u.x*v.y - u.y*v.u;
Vec2.translation= ( from, to )=> new Vec2(to.x-from.x,to.y-from.y);
Vec2.squareDistance = ( p1, p2 )=> {
  var dX = p2.x-p1.x, dY = p2.y - p1.y;
  return dX*dX+dY*dY;
};
Vec2.distance = ( p1,p2 ) => Math.sqrt(Vec2.squareDistance(p1,p2));
Vec2.ccw = ( A, B, C ) => (C.y-A.y)*(B.x-A.x)>(B.y-A.y)*(C.x-A.x);
Vec2.ccw2 = ( AB, AC ) => AC.y*AB.x>AB.y*AC.x;
Vec2.getRadiansBetween = (from, to) => to.getAngle()-from.getAngle();
Vec2.createFromRadians = radians=>new Vec2(Math.cos(radians),Math.sin(radians));
Vec2.copy = v =>new Vec2(v.x, v.y);
Vec2.zero = function() { return new Vec2(0,0); };
Vec2.createVec2Array = function( xyxyArray ) {
  var len = Math.floor(xyxyArray.length/2);
  var result = new Array(len);
  var i=len, i2;
  while(i--) { i2 = 2*i; 
    result[i] = new Vec2(xyxyArray[i2], xyxyArray[i2+1]);
  }
  return result;
};
/** @const */
Vec2.ZERO = Vec2.zero();
//______________________________________________________________________________
// - - - - - - - - - - - - - - -Rect (not a shape) - - - - - - - - - - - - - - -
//******************************************************************************
var Rect = function(left, top, right, bottom) {
    this.left = left; this.right = right;
    this.top = top; this.bottom = bottom;
};
Rect.prototype.clone = function() {
  return new Rect(this.left, this.top, this.right, this.bottom);
};
Rect.prototype.center = function() {
  return new Vec2(this.left+this.right, this.top+this.bottom).mul(0.5);
};
Rect.prototype.overlap = function( rect ) {
  return rect.left <= this.right && rect.top <= this.bottom
      && rect.right >= this.left && rect.bottom >= this.top;
};
Rect.prototype.containsXY = function( x, y ) {
  return x >= this.left && x <= this.right
      && y >= this.top && y <= this.bottom;
};
Rect.prototype.containsRect = function( rect ) {
  return rect.left >= this.left && rect.right <= this.right
      && rect.top >= this.top && rect.bottom <= this.bottom;
};
Rect.prototype.contains = function( vec ) {
  return vec.x >= this.left && vec.x <= this.right
      && vec.y >= this.top && vec.y <= this.bottom;
};
Rect.prototype.onLeftOfXY = function( x, y ) { return this.right < x; };
Rect.prototype.onLeftOfRect = function( r ) { return this.right < r.left; };
Rect.prototype.onLeftOf = function( vec ) { return this.right < vec.x; };
Rect.prototype.onRightOfXY = function( x, y ) { return this.left > x; };
Rect.prototype.onRightOfRect = function( r ) { return this.left > r.right; };
Rect.prototype.onRightOf = function( vec ) { return this.left > vec.x; };
Rect.prototype.aboveXY = function( x, y ) { return this.bottom < y; };
Rect.prototype.aboveRect = function( r ) { return this.bottom < r.top; };
Rect.prototype.above = function( vec ) { return this.bottom < vec.y; };
Rect.prototype.belowXY = function( x, y ) { return this.top > y; };
Rect.prototype.belowRect = function( r ) { return this.top > r.bottom; };
Rect.prototype.below = function( vec ) { return this.top > vec.y; };
Rect.prototype.addMargin = function( margin ) {
  this.left -= margin; this.right += margin;
  this.top -= margin; this.bottom += margin;
  return this;
};
Rect.prototype.addMarginsXY = function( marginX, marginY ) {
  this.left -= marginX; this.right += marginX;
  this.top -= marginY; this.bottom += marginY;
  return this;
};
Rect.prototype.addMargins = function( marginLeft, marginTop,
                                      marginRight, marginBottom ) {
  this.left -= marginLeft; this.right += marginRight;
  this.top -= marginTop; this.bottom += marginBottom;
  return this;
};
Rect.prototype.pushPath = function( context ) {
  context.rect(this.left, this.top, this.width(), this.height());
};
Rect.prototype.draw = function( context, fill, stroke ) {
  context.beginPath();
  this.pushPath(context);
  context.closePath();
  if(fill) context.fill();
  if(stroke) context.stroke();
};
Rect.prototype.setRect = function( rect ) {
  this.left = rect.left; this.right = rect.right;
  this.top = rect.top; this.bottom = rect.bottom;
  return this;
};
Rect.prototype.set = function(left, top, right, bottom /* | rect */) {
  this.top = top;
  this.left = left;
  this.right = right;
  this.bottom = bottom;
  return this;
};
Rect.prototype.moveXY = function( x, y ) {
  this.left += x; this.right += x;
  this.top += y; this.bottom += y;
};
Rect.prototype.move = function( delta) {
  this.left += delta.x; this.right += delta.x;
  this.top += delta.y; this.bottom += delta.y;
  return this;
};
Rect.prototype.width  = function() { return this.right - this.left; };
Rect.prototype.height = function() { return this.bottom - this.top; };
Rect.prototype.ratio  = function() { return this.width() / this.height(); };
Rect.prototype.perimeter = function(){return 2*this.width() + 2*this.height();};
Rect.prototype.area = function() { return this.width()*this.height(); };
Rect.prototype.getShape = function() {
  return new Polygon(Vec2.createVec2Array(
    [this.left,this.top,  this.right,this.top,
    this.right,this.bottom,  this.left,this.bottom]));
};
Rect.prototype.toString = function() { return '[' + this.left + ', ' +
    this.top + ', ' + this.right + ', ' + this.bottom + ']';
};
Rect.getUnion = function( rects ) {
  var i=rects.length;
  if(i) {
    var res = rects[--i].clone();
    while(i--) {
      res.left = Math.min(res.left, rects[i].left);
      res.top = Math.min(res.top, rects[i].top);
      res.right = Math.max(res.right, rects[i].right);
      res.bottom = Math.max(res.bottom, rects[i].bottom);
    }
    return res;
  }else return Rect.createEmpty();
};
Rect.getIntersection = function( rects ) {
  var maxLeft, maxTop, minRight, minBottom;
  var i=rects.length, r;
  if(i) {
    while(i--) { r=rects[i];
      if(r.top > maxTop) maxTop = r.top;
      if(r.left > maxLeft) maxLeft = r.left;
      if(r.right < minRight) minRight = r.right;
      if(r.bottom < minBottom) minBottom = r.bottom;
    }
    if(maxLeft < minRight && maxTop < minBottom)
      return new Rect(maxLeft, maxTop, minRight, minBottom);
  }
  return null;
};
Rect.createEmpty=_=>new Rect(0,0,0,0);
Rect.copy=r=>new Rect(r.left, r.top, r.right, r.bottom);
Rect.createFromPoint=(vec)=>new Rect(vec.x, vec.y, vec.x, vec.y);
Rect.createFromXY=( x, y )=>new Rect(x,y,x,y);

//______________________________________________________________________________
// - - - - - - - - - - - - - - - - - - Shape - - - - - - - - - - - - - - - - - -
//******************************************************************************
var Shape = function( center ) { this.center = center.clone(); };
Shape.prototype.mirrorVertically = function( axisY )   {
  this.center.set(this.center.getVerticalMirror(axisY));
  return this;
};
Shape.prototype.mirrorHorizontally = function( axisX ) {
  this.center.set(this.center.getHorizontalMirror(axisX));
  return this;
};
Shape.prototype.grow      = function( factor )  { return this; };
Shape.prototype.growDistance=function( delta )  { return this; };
Shape.prototype.rotate    = function( radians ) { return this; };
Shape.prototype.pushPath  = function( context ) { };
Shape.prototype.getCenter = function() { return this.center; };
Shape.prototype.copyCenter= function() { return this.center.clone(); };
Shape.prototype.intersect = function( shape ) { return false; };
Shape.prototype.contains  = function( point ) { return false; };
Shape.prototype.getRect   = function() { return Rect.createFromPoint(this.center); };
Shape.prototype.getRadius = function() { return 0; };
Shape.prototype.perimeter = function() { return 0; };
Shape.prototype.area      = function() { return 0; };
Shape.prototype.clone     = function() { return new Shape(this.center); };
Shape.prototype.getCircle = function() {
  return new Circle(this.center, this.getRadius());
};
Shape.prototype.moveXY = function( dX, dY ) {
  this.center.addXY(dX, dY);
  return this;
};
Shape.prototype.move = function( delta ) {
  this.center.add(delta);
  return this;
};
Shape.prototype.moveToXY = function( x, y ) {
  this.center.setXY(x, y);
  return this;
};
Shape.prototype.moveTo = function( pos ) {
  this.center.set(pos);
  return this;
};
Shape.prototype.draw = function( context, fill, stroke ) {
  context.beginPath();
  this.pushPath(context);
  if(fill) context.fill();
  if(stroke) context.stroke();
};

//______________________________________________________________________________
// - - - - - - - - - - - - - - - - - -Circle - - - - - - - - - - - - - - - - - -
//******************************************************************************
var Circle = function(center, radius ) {
  Shape.call(this, center);
  this.radius = radius;
};
classExtend(Shape, Circle);
Circle.prototype.grow = function( factor ) {
  this.radius *= factor;
  return this;
};
Circle.prototype.growDistance = function( delta ) {
  this.radius += delta;
};
Circle.prototype.pushPath = function( context ) {
  context.arc(this.center.x, this.center.y, this.radius, 0, 2*Math.PI, false);
};
Circle.prototype.intersect = function( shape ) {
  if(shape instanceof Circle) {
    var d = Vec2.distance(this.center, shape.center);
    return d < this.radius + shape.radius &&
        this.radius < d + shape.radius && // the other circle is not inside this circle
        shape.radius < d + this.radius; // this circle is not inside the other circle
  }
  else return shape.intersect(this);
};
Circle.prototype.contains = function( point ) {
  return Vec2.distance(this.center, point) < this.radius;
};
Circle.prototype.getRect = function() {
  return new Rect(this.center.x - this.radius, this.center.y - this.radius,
                  this.center.x + this.radius, this.center.y + this.radius);
};
Circle.prototype.getRadius = function() { return this.radius; };
Circle.prototype.getCircle = function() {
  return new Circle(this.center, this.radius); };
Circle.prototype.perimeter = function() { return 2*Math.PI*this.radius; };
Circle.prototype.area = function() { return Math.pow(this.radius, 2)*Math.PI; };
Circle.prototype.clone = Circle.prototype.getCircle;

//______________________________________________________________________________
// - - - - - - - - - - - - - - - - - - -Line - - - - - - - - - - - - - - - - - -
//******************************************************************************
var Line = function( p1, p2 ) {
  Shape.call(this, p1.clone().add(p2).mul(0.5));
  var u = Vec2.translation(p1, p2);
  this.radians = u.getAngle();
  this.length = u.magnitude();
};
classExtend(Shape, Line);
Line.prototype.grow = function( factor ) {
  this.length *= factor;
  return this;
};
Line.prototype.growDistance = function( delta ) {
  this.length += 2*delta;
};
Line.prototype.rotate = function( radians ) {
  this.radians += radians;
  return this;
};
Line.prototype.mirrorVertically = function( axisY ) {
  Line.super.mirrorVertically.call(this, axisY);
  this.radians = - this.radians;
  return this;
};
Line.prototype.mirrorHorizontally = function( axisX ) {
  Line.super.mirrorHorizontally.call(this, axisX);
  this.radians = Math.PI - this.radians;
  return this;
};
Line.prototype.pushPath = function( context ) {
  var dX = (this.length*Math.cos(this.radians))/2;
  var dY = (this.length*Math.sin(this.radians))/2;
  context.moveTo(this.center.x - dX, this.center.y - dY);
  context.lineTo(this.center.x + dX, this.center.y + dY);
};
Line.prototype.getP0 = function() {
  return this.center.clone().addXY(
    -(this.length*Math.cos(this.radians))/2,
    -(this.length*Math.sin(this.radians))/2);
};
Line.prototype.getP1 = function() {
  return this.center.clone().addXY(
    (this.length*Math.cos(this.radians))/2,
    (this.length*Math.sin(this.radians))/2);
};
Line.prototype.setP0 = function( p0 ) {
  var trans = Vec2.translation(p0, this.getP1());
  this.radians = trans.getAngle();
  this.length = trans.magnitude();
  this.center.set(trans.mul(0.5).add(p0));
  return this;
};
Line.prototype.setP1 = function( p1 ) {
  var p0 = this.getP0();
  var trans = Vec2.translation(p0, p1);
  this.radians = trans.getAngle();
  this.length = trans.magnitude();
  this.center.set(trans.mul(0.5).add(p0));
  return this;
};
Line.prototype.setPoints = function( p0, p1 ) {
  var trans = Vec2.translation(p0, p1);
  this.radians = trans.getAngle();
  this.length = trans.magnitude();
  this.center.set(trans.mul(0.5).add(p0));
  return this;
};
Line.prototype.getVect = function() {
  return new Vec2(
      this.length*Math.cos(this.radians),
      this.length*Math.sin(this.radians));
};
Line.prototype.getDirectorVect = function() {
  return Vec2.createFromRadians(this.radians);
};
Line.prototype.intersect = function( shape ) {
  if(shape instanceof Circle) {
    let A = this.getP0();
    let B = this.getP1();
    if(shape.contains(A)) return !shape.contains(B);
    if(shape.contains(B)) return !shape.contains(A);
    
    let AB = Vec2.translation(A, B);
    let AC = Vec2.translation(A, shape.center);
    var u = this.getDirectorVect();
    var I = u.clone().mul(Vec2.dotProd(u, AC)).add(A);
    
    return I.x > Math.min(A.x, B.x) && I.x < Math.max(A.x, B.x) &&
           I.y > Math.min(A.y, B.y) && I.y < Math.max(A.y, B.y) &&
           Vec2.distance(I, shape.center) <= shape.radius;
  }
  else if(shape instanceof Line) {
    var A = this.getP0(), B = this.getP1(), C = shape.getP0(), D = shape.getP1();
    var AC = Vec2.translation(A, C), BC = Vec2.translation(B, C),
        AD = Vec2.translation(A, D), BD = Vec2.translation(B, D);
    if(Vec2.ccw2(AC, AD)!=Vec2.ccw2(BC, BD)) {
      var AB = Vec2.translation(A, B), CD = Vec2.translation(C, D);
      return Vec2.ccw2(AB, AC) != Vec2.ccw2(AB, AD);
    }
    else return false;
  }
  else shape.intersect(this);
};
Line.prototype.contains = function( point ) {
  var v = Vec2.translation(this.center, point);
  var u = this.getDirectorVect();
  return v.equals(u.mul(Vec2.distance(this.center, point)))
        || v.equals(u.mul(-1));
};
Line.prototype.getRect = function() {
  var p1 = this.getP1(), p0 = this.getP0(), left, top, right, bottom;
  if(p0.x < p1.x) { left = p0.x; right = p1.x; }
  else            { left = p1.x; right = p0.x; }
  if(p0.y < p1.y) { top = p0.y; bottom = p1.y; }
  else            { top = p1.y; bottom = p0.y; }
  return new Rect(left, top, right, bottom);
};
Line.prototype.getRadius = function() { return this.length/2; };
Line.prototype.perimeter = function() { return this.length*2; };
Line.prototype.clone = function() {
  return new Line(this.getP0(), this.getP1());
};

//______________________________________________________________________________
// - - - - - - - - - - - - - - - - - - Point - - - - - - - - - - - - - - - - - -
//******************************************************************************
var Point = function( vec ) {
  Shape.call(this, vec);
};
classExtend(Shape, Point);
Point.prototype.pushPath = function( context ) {
  context.rect(this.center.x, this.center.y, 1, 1);
};
Point.prototype.intersect = function( shape ) {
  if(shape instanceof Circle) {
    return Vec2.distance(shape.center, this.center) === shape.radius;
  }
  else if(shape instanceof Line) {
    return shape.contains(this.center);
  }
  else if(shape instanceof Point) {
    return shape.center.equals(this.center);
  }
  else return shape.intersect(this);
};
Point.prototype.contains = function( point ) {
  return this.center.equals(point);
};
Point.prototype.clone = function() {
  return new Point(this.center);
};

//______________________________________________________________________________
// - - - - - - - - - - - - - - - - - - -Path - - - - - - - - - - - - - - - - - -
//******************************************************************************
var Path = function( pointsArray ) {
  var center = Vec2.zero();
  this.points = [];
  if(pointsArray) {
    var len = pointsArray.length, i=len;
    if(len>0) {
      while(i--) {
        center.add(pointsArray[i]);
      }
      center.mul(1/len);
      for(i=0; i< len; i++) {
        this.points.push(pointsArray[i].clone().remove(center));
      }
    }
    else if(len === undefined){
      pointsArray = arguments;
      len = pointsArray.length;
      if(len>0) {
        i=len;
        while(i--) {
          center.add(pointsArray[i]);
        }
        center.mul(1/len);
        for(i=0; i< len; i++) {
          this.points.push(pointsArray[i].clone().remove(center));
        }
      }
    }
  }
  Shape.call(this, center);
  if(isNaN(this.center.x)) console.stack(center);
};
classExtend(Shape, Path);
Path.prototype.closed = false;
Path.prototype.grow = function( factor ) {
  var i=this.points.length;
  if(i>0) while(i--) {
    this.points[i].mul(factor);
  }
  return this;
};
Path.prototype.growDistance = function( delta ) {
  var norm, p, i=this.points.length;
  if(i>0) while(i--) { p = this.points[i];
    norm = p.magnitude();
    p.mul(1/norm).mul(norm+delta);
  }
  return this;
};
Path.prototype.rotate = function( radians ) {
  var rad, mag, p, i=this.points.length;
  if(i>0) while(i--) { p = this.points[i];
    p.rotate(radians);
  }
  return this;
};
Path.prototype.mirrorVertically = function( axisY ) {
  Path.super.mirrorVertically.call(this, axisY);
  var p, i=this.points.length;
  if(i>0) while(i--) { p = this.points[i];
    p.set(p.getVerticalMirror());
  }
  return this;
};
Path.prototype.mirrorHorizontally = function( axisX ) {
  Path.super.mirrorHorizontally.call(this, axisX);
  var p, i=this.points.length;
  if(i>0) while(i--) { p = this.points[i];
    p.set(p.getHorizontalMirror());
  }
  return this;
};
Path.prototype.pushPath = function( context ) {
  var len = this.points.length;
  if(len) {
    context.translate(this.center.x, this.center.y);
    context.moveTo(this.points[0].x, this.points[0].y);
    for(var i=1; i< len; i++) {
      context.lineTo(this.points[i].x, this.points[i].y);
    }
    if(this.closed) {
      context.closePath();
    }
    context.translate(-this.center.x, -this.center.y);
  }
};
Path.prototype.getLines = function() {
  var result = [], lenm1 = this.points.length-1;
  for(var i=0; i< lenm1; i++) { //optimize
    result.push(new Line(this.points[i], this.points[i+1]).move(this.center));
  }
  if(this.closed)
    result.push(new Line(this.points[lenm1], this.points[0]).move(this.center));
  return result;
};
Path.prototype.intersect = function( shape ) {
  var lines = this.getLines(), i=lines.length;
  if(!i) return false;
  if(shape instanceof Path) {
    var otherLines = shape.getLines(), len = otherLines.length, line;
    var j;
    while(i--) {
      line = lines[i];
      j=len;
      while(j--) {
        if(otherLines[j].intersect(line))
          return true;
      }
    }
  }
  else {
    while(i--) {
      if(lines[i].intersect(shape)) {
        return true;
      }
    }
  }
  return false;
};
Path.prototype.getIntersectionLine = function( shape ) {
  var lines = this.getLines(), i=lines.length, result = false;
  if(!i) return null;
  if(shape instanceof Path) {
    var otherLines = shape.getLines(), len = otherLines.length, line;
    var j;
    while(i--) {
      line = lines[i];
      j=len;
      while(j--) {
        if(otherLines[j].intersect(line))
          return line;
      }
  } }
  else {
    while(i--) {
      if(lines[i].intersect(shape)) {
        result = lines[i];
        break;
  } } }
  return result;
};
Path.prototype.contains = function( point ) {
  var rect = this.getRect();
  var width = rect.width()+10, height = rect.height()+10;
  var endPoint = point.clone();
  var lines = [
    new Line(point, endPoint.add(width, 0)),
    new Line(point, endPoint.add(-2*width, 0)),
    new Line(point, endPoint.add(width, height)),
    new Line(point, endPoint.add(0, -2*height))
  ];
  return this.intersect(lines[0]) && this.intersect(lines[1])
      && this.intersect(lines[2]) && this.intersect(lines[3]);
};
Path.prototype.getRect = function() {
  var left = 0, top = 0, right = 0, bottom = 0, point;
  for(var i=this.points.length-1; i>= 0; i--) { point = this.points[i];
    if(point.x < left) left = point.x;
    else if(point.x > right) right = point.x;
    if(point.y < top) top = point.y;
    else if(point.y > bottom) bottom = point.y;
  }
  var rect = new Rect(left, top, right, bottom);
  rect.move(this.center);
  return rect;
};
Path.prototype.getRadius = function() {
  var r = 0, mag;
  for(var i=this.points.length-1; i>= 0; i--) {
    mag = this.points[i].squareMagnitude(); if(mag > r) r = mag;
  }
  return Math.sqrt(r);
};
Path.prototype.redefineCenter = function(delta) {
  var i = this.points.length;
  if(!i) return;
  if(delta) {
    while(i--)
      this.points[i].remove(delta);
  }
  else {
    delta = Vec2.zero();
    var len=i;
    while(i--)
      delta.add(this.points[i]);
    delta.mul(1/len);
    this.center.set(delta);
  }
};
Path.prototype.perimeter = function() {
  var i = this.points.length-1,
      res = this.closed? Vec2.distance(this.points[i], this.points[0]) : 0;
  while(i) res += Vec2.distance(this.points[i--], this.points[i]);
  return res;
};
Path.prototype.area = function() {
  var res = 0, len = this.points.length, i=len;
  var p0, p1 = this.points[0];
  while(i--) {
    p0 = this.points[i];
    res += (p0.x+p1.x)*(p0.y-p1.y);
    p1 = p0;
  }
  return res/2;
};
Path.prototype.clone = function() {
  var result = new Path([]);
  result.center.set(this.center);
  var i=this.points.length;
  var p = new Array(i);
  while(i--) p[i] = this.points[i].clone();
  result.points = p;
  if(this.closed && !result.closed) result.closed = true;
  return result;
};
//______________________________________________________________________________
// - - - - - - - - - - - - - - - - - -Polygon- - - - - - - - - - - - - - - - - -
//******************************************************************************
var Polygon = function( pointsArray ) {
  Path.call(this, pointsArray);
};
classExtend(Path, Polygon);
Polygon.prototype.closed = true;
//all the methods already are in the Path prototype.
Polygon.createRectangle = (center, width, height)=> {
  var left = center.x-width/2, top = center.y - height/2;
  return new Polygon([
    {x: left      , y: top       },
    {x: left+width, y: top       },
    {x: left+width, y: top+height},
    {x: left      , y: top+height}
    ]);
};
Polygon.createFromCenter = function(center, pointsArray) {
  var polygon = new Polygon([]);
  polygon.moveTo(center);
  var i = pointsArray.length;
  polygon.pointsArray = new Array(i);
  while(i--) {
    polygon.pointsArray[i] = pointsArray[i].clone();
  }
  return polygon;
};

var RegularPolygon = function( center, radius, pointsNumber, startRadians ) {
  var dR = (Math.PI*2)/pointsNumber;
  var angle = startRadians;
  this.center = center.clone();
  this.points = new Array(pointsNumber);
  var i=pointsNumber;
  var rLen = radius.length;
  if(exists(rLen)) {
    while(i--) {
      this.points[i] = Vec2.createFromRadians(angle).mul(radius[i%rLen]);
      angle += dR;
    }
  }
  else {
    while(i--) {
      this.points[i] = Vec2.createFromRadians(angle).mul(radius);
      angle += dR;
    }
  }
};
classExtend(Polygon, RegularPolygon);

//______________________________________________________________________________
// - - - - - - - - - - - - - - - - - - -Ray- - - - - - - - - - - - - - - - - - -
//******************************************************************************
var Ray = function( origin, radians ) {
  Shape.call(this, origin);
  this.radians = radians;
};
classExtend(Shape, Ray);
Ray.prototype.rotate = function( radians ) {
  this.radians += radians;
  return this;
};
Ray.prototype.mirrorVertically = function( axisY ) {
  Ray.super.mirrorVertically.call(this, axisY);
  this.radians = - this.radians;
  return this;
};
Ray.prototype.mirrorHorizontally = function( axisX ) {
  Ray.super.mirrorHorizontally.call(this, axisX);
  this.radians = Math.PI - this.radians;
};
Ray.prototype.endPoint = function( length ) {
  var result = this.center.clone();
  result.add(Math.cos(this.radians)*length, Math.sin(this.radians)*length);
  return result;
};
Ray.prototype.pushPath = function( context ) {
  var endPoint = this.endPoint(
      context.canvas.clientWidth + context.canvas.clientHeight);
  context.moveTo(this.center.x, this.center.y);
  context.lineTo(endPoint.x, endPoint.y);
};
Ray.prototype.intersect = function( shape ) {
  var rect = shape.getRect();
  return new Line(this.center, this.endPoint(
      Vec2.distance(this.center, shape.center) + rect.width() + rect.height()))
      .intersect(shape);
};
Ray.prototype.contains = function( point ) {
  return new Line(this.center, this.endPoint(
      Vec2.distance(this.center, point))).contains(point);
};
Ray.prototype.getRect = function() {
  var endPoint = this.endPoint(Number.MAX_SAFE_INTEGER);
  return new Rect(
      Math.min(endPoint.x, this.center.x), Math.min(endPoint.y, this.center.y),
      Math.max(endPoint.x, this.center.x), Math.max(endPoint.y, this.center.y));
};
Ray.prototype.getRadius = function() {
  return Number.MAX_SAFE_INTEGER;
};
Ray.prototype.perimeter = function() { return Number.MAX_SAFE_INTEGER; };
Ray.prototype.clone = function() {
  return new Ray(this.center, this.radians);
};



