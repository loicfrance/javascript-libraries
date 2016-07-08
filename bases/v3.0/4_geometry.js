/**
 * @preserve
 * author : Loic France
 * created 05/31/2016
 */
//______________________________________________________________________________
// - - - - - - - - - - - - - - - - - - -Vec2 - - - - - - - - - - - - - - - - - -
//******************************************************************************
/** a simple class with two members : x and y,
 *  used to represent points and vectors
 */
class Vec2 {
  /**
   * @struct
   * @constructor
   * @param {number} x - x coordinate
   * @param {number} y - y coordinate
   */
  constructor( x, y ) {
    this.x = x;
    this.y = y;
  }
  /**
   * @nosideeffects
   * @return {Vec2} a Vec2 with the same x and y properties
   */
  clone() { return new Vec2(this.x, this.y); }
  /**
   * sets x and y coordinates of this Vec2
   * @param {number} x - new x coordinate
   * @param {number} y - new y coordinate
   * @return {Vec2} this
   */
  setXY( x, y ) {
    this.x = x;
    this.y = y;
    return this;
  }
  /**
   * sets x and y coordinates to 0
   * @return {Vec2} this
   */
  raz() {
    this.x = this.y = 0;
    return this;
  }
  /**
   * sets x and y coordinates to the same as the 'vec' parameter
   * @param {Vec2} vec
   * @return {Vec2} this
   */
  set( vec ) {
    this.x = vec.x;
    this.y = vec.y;
    return this;
  }
  /**
   * @param {number} x - number to be added to x coordinate
   * @param {number} y - number to be added to y coordinate
   * @return {Vec2} this
   */
  addXY( x, y ) {
    this.x += x;
    this.y += y;
    return this;
  }
  /**
   * @param {Vec2} vec
   * @return {Vec2} this
   */
  add( vec ) {
    this.x += vec.x;
    this.y += vec.y;
    return this;
  }
  /**
   * @param {Vec2} vec
   * @return {Vec2} this
   */
  remove( vec ) {
    this.x -= vec.x;
    this.y -= vec.y;
    return this;
  }
  /**
   * multiplies x and y coordinates by the parameter.
   * @param {number} factor
   * @return {Vec2} this
   */
  mul( factor ) {
    this.x *= factor;
    this.y *= factor;
    return this;
  }
  /**
   * sets x and y coordinates to make the magnitude = 1.
   * if x = y = 0, this function does nothing.
   * @return {Vec2} this
   */
  normalize() {
    let m = this.magnitude;
    if(m) this.mul(1/m);
    return this;
  }
  /**
   * square magnitude of this Vec2, computed from the coordinates
   * @nosideeffects
   * @return {nuumber} the square magnitude of this Vec2 : x * x + y * y
   */
  get squareMagnitude() {
    let x=this.x, y=this.y;
    return x*x+y*y;
  }
  /**
   * magnitude of this Vec2, computed from the coordinates
   * @nosideeffects
   * @return {number} the magnitude of this Vec2 : sqrt(x * x + y * y)
   */
  get magnitude() {
    return Math.sqrt(this.squareMagnitude);
  }
  /**
   * sets x and y coordinates to make the magnitude = mag.
   * @param {number} mag - the new magnitude of this Vec2
   * @return {number} mag
   */
  set magnitude( mag ) {
    let m = this.magnitude;
    if(m) this.mul(mag/m);
    else thix.x = mag;
    return mag;
  }
  /**
   * sets x and y coordinates to make the magnitude = mag.
   * @param {number} mag -the new magnitude of this Vec2
   * @return {Vec2} this
   */
  setMagnitude( mag ) {
    let m = this.magnitude;
    if(m) this.mul(mag/m);
    else thix.x = mag;
    return this;
  }
  /**
   * angle of this Vec2, computed from the coordinates
   * @nosideeffects
   * @return {number} angle = atan2(y, x).
   */
  get angle() {
    return Math.atan2(this.y, this.x);
  }
  /**
   * x= cos(a)*magnitude, y= sin(a)*magnitude
   * @param {number} a - new angle(radians) of this Vec2
   * @return {number} a
   */
  set angle( a ) {
    let m = this.magnitude;
    if(m) {
      this.x = Math.cos(a)*m;
      this.y = Math.sin(a)*m;
    }
    return a;
  }
  /**
   * x= cos(a)*magnitude, y= sin(a)*magnitude
   * @param {number} a - new angle(radians) of this Vec2
   * @return {Vec2} this
   */
  setAngle( a ) {
    let m = this.magnitude;
    if(m) {
      this.x = Math.cos(a)*m;
      this.y = Math.sin(a)*m;
    }
    return this;
  }
  /**
   * @param {number} a - angle(radians) to rotate this Vec2
   * this.angle += a;
   * @return {Vec2} this
   */
  rotate( a ) {
    this.angle+=a;
    return this;
  }
  /**
   * rotate this Vec2 around the center, and keep the distance to the center
   * @param {Vec2} center - point to rotate this Vec2 around
   * @param {number} a - angle(radians) to rotate this Vec2
   * @return {Vec2} this
   */
  rotateAround( center, a ) {
    var delta = Vec2.translation(center, this);
    delta.angle += a;
    this.set(delta.add(center));
    return this;
  }
  /**
   * @nosideeffects
   * @return {string} "(x,y)"
   */
  toString() {
    return ['(',this.x,',',this.y,')'].join('');
  }
  /**
   * @nosideeffects
   * @return {boolean} true if this.x=x and this.y=y, false otherwise.
   */
  equalsXY( x, y ) {
    return this.x == x && this.y == y;
  }
  /**
   * @nosideeffects
   * @return {boolean} true if this.x=vec.x and this.y=vec.y, false otherwise.
   */
  equals( vec ) {
    return this.x == vec.x && this.y == vec.y;
  }
  /**
   * @nosideeffects
   * @return {boolean} true if x=y=0, false otherwise.
   */
  isZero() {
    return !(this.x||this.y);
  }
  /**
   * @nosideeffects
   * @return {Vec2} new Vec2 containing unit (magnitude=1) version of this Vec2
   */
  getUnit() {
    return this.clone().normalize();
  }
  /**
   * @param {Vec2} [center=Vec2.ZERO]
   * @nosideeffects
   * @return {Vec2} the mirror Vec2 of this Vec2, relative to the center
   */
  getMirror( center=Vec2.ZERO ) {
    return Vec2.translation(this, center).add(center);
  }
  /**
   * @param {number} [axisX=0]
   * @nosideeffects
   * @return {Vec2} the horizontal mirror Vec2 of this Vec2,
   * relative to the axisX x coordinate
   */
  getHorizontalMirror( axisX=0 ) {
    return this.clone().mirrorHorizontally();
  }
  /**
   * @param {number} [axisY=0]
   * @nosideeffects
   * @return {Vec2} the vertical mirror Vec2 of this Vec2,
   * relative to the axisY y coordinate
   */
  getVerticalMirror( axisY=0 ) {
    return this.clone().mirrorVertically();
  }
  mirror( center=Vec2.ZERO ) {
    this.x = center.x ? 2*center.y - this.x : -this.x;
    this.y = center.y ? 2*center.y - this.y : -this.y;
    return this;
  }
  /**
   * same (but faster) as instance.set(instance.getHorizontalMirror(axisX))
   * @param {number} [axisX=0]
   * @return {Vec2} this
   */
  mirrorHorizontally( axisX=0 ) {
    this.x = axisX ? 2*axisX - this.x : -this.x;
    return this;
  }
  /**
   * same (but faster) as instance.set(instance.getVerticalMirror(axisY))
   * @param {number} [axisY=0]
   * @return {Vec2} this
   */
  mirrorVertically( axisY=0 ) {
    this.y = axisY ? 2*axisY - this.y : -this.y;
    return this;
  }
  /**
   * @param {number} [digits=0] - number of digits the result must have.
   *        if not set (= 0), the result will be the closest integer.
   * @nosideeffects
   * @return {number} rounded value of x coordinate.
   */
  getRoundedX( digits=0 ) {
    if(digits) return this.x.toPrecision(digits);
    else return Math.round(this.x);
  }
  /**
   * @param {number} [digits=0] - number of digits the result must have.
   *        if not set (= 0), the result will be the closest integer.
   * @nosideeffects
   * @return {number} rounded value of y coordinate.
   */
  getRoundedY( digits=0 ) {
    if(digits) return this.y.toPrecision(digits);
    else return Math.round(this.y);
  }
  /**
   * @param {number} [digits=0] - number of digits the result must have.
   *        if not set (= 0), the result will be the closest integer.
   * @nosideeffects
   * @return {Vec2} copy of this Vec2 with rounded coordinates.
   */
  roundedVec( digits=0 ) {
    return new Vec2(this.roundedX(digits), this.roundedY(digits));
  }
  /**
   * if the magnitude of this Vec2 is not in the interval [min, max],
   * this method modifies the coordinate to make the magnitude
   * to the max(if magnitude is higher) or the min (if magnitude is lower).
   * @param {number} min - the minimum magnitude
   * @param {number} max - the maximum magnitude
   * @return {Vec2} this
   */
  clampMagnitude( min,  max ) {
    let m = this.magnitude;
    if(m) {
      if(m < min) this.mul(min/m);
      else if(m > max) this.mul(max/m);
    }
    else this.x = min;
    return this;
  }
  /**
   * @param {Vec2} u
   * @param {Vec2} v
   * @return {number} the result of the dot product of u and v.
   */
  static dotProd( u, v ) { return u.x*v.x + u.y*v.y; }
  /**
   * @param {Vec2} u
   * @param {Vec2} v
   * @return {number} the result of the vectorial product of u and v.
   */
  static vectProd( u, v ) { return u.x*v.y - u.u*v.x; }
  /**
   * @param {Vec2} A - start point
   * @param {Vec2} B - end point
   * @return {Vec2} the translation from A to B
   */
  static translation( A, B ) { return new Vec2(B.x-A.x, B.y-A.y); }
  /**
   * @param {Vec2} A
   * @param {Vec2} B
   * @return {number} the square distance between A and B
   */
  static squareDistance( A, B ) {
    let dX = B.x-A.x, dY = B.y - A.y;
    return dX*dX+dY*dY;
  }
  /**
   * @param {Vec2} A
   * @param {Vec2} B
   * @return {number} the distance between A and B
   */
  static distance( A, B ) {
    return Math.sqrt(Vec2.squareDistance(A,B));
  }
  /**
   * @param {Vec2} A
   * @param {Vec2} B
   * @param {Vec2} C
   * @return {boolean} true if AB and AC are in counter-clockwise order,
   *         false otherwise
   */
  static ccw( A, B, C ) {
    return (C.y-A.y)*(B.x-A.x)>(B.y-A.y)*(C.x-A.x);
  }
  /**
   * @param {Vec2} AB
   * @param {Vec2} AC
   * @return {boolean} true if AB and AC are in counter-clockwise order,
   *         false otherwise
   */
  static ccw2( AB, AC ) {
    return AC.y*AB.x>AB.y*AC.x;
  }
  /**
   * @param {number} radians
   * @param {number} [magnitude=1]
   * @return {Vec2} (cos(radians)*magnitude, sin(radians)*magnitude)
   */
  static createFromRadians( radians, magnitude=1 ) {
    return new Vec2(Math.cos(radians)*magnitude, Math.sin(radians)*magnitude);
  }
  /**
   * @param {Array<number>} xyxyArray - array of points coordinates ordered
   *        like this : [x1, y1, x2, y2, x3, y3, ...].
   * @return {Array<Vec2>} a Vec2 array : [(x1,y1), (x2,y2), (x3,y3), ...].
   */
  static createVec2Array( xyxyArray ) {
    let len = Math.floor(xyxyArray.length/2);
    let result = new Array(len);
    let i=len, i2;
    while(i--) { i2 = 2*i; 
      result[i] = new Vec2(xyxyArray[i2], xyxyArray[i2+1]);
    }
    return result;
  }
  /**
   * @return {Vec2} a new Vec2 with x = y = 0.
   */
  static get zero() { return new Vec2(0,0); }
}
/**
 * @const {Vec2} (0,0).
 */
Vec2.ZERO = Vec2.zero;
//______________________________________________________________________________
// - - - - - - - - - - - - - - -Rect (not a shape) - - - - - - - - - - - - - - -
//******************************************************************************
class Rect {
  constructor( left, top, right, bottom ) {
    this.left = left; this.right = right;
    this.top = top; this.bottom = bottom;
  }
  clone() {
    return new Rect(this.left, this.top, this.right, this.bottom);
  }
  get width() { return this.right - this.left; }
  get height() { return this.bottom - this.top; }
  get ratio() { return this.width/this.height; }
  get perimeter(){ return 2*(this.width + this.height); }
  get area() { return this.width*this.height; }
  get center() {
    return new Vec2(this.left+this.right, this.top+this.bottom).mul(0.5);
  }
  set center( center ) {
    let w = this.width/2, h = this.height/2;
    this.left = center.x-w; this.right = center.x+w;
    this.top = center.y-h; this.bottom = center.y+h;
    return center;
  }
  overlap( rect ) {
    return rect.left <= this.right && rect.top <= this.bottom
        && rect.right >= this.left && rect.bottom >= this.top;
  }
  containsXY( x, y ) {
    return x >= this.left && x <= this.right
        && y >= this.top && y <= this.bottom;
  }
  containsRect( rect ) {
    return rect.left >= this.left && rect.right <= this.right
        && rect.top >= this.top && rect.bottom <= this.bottom;
  }
  contains( vec ) {
    return vec.x >= this.left && vec.x <= this.right
        && vec.y >= this.top && vec.y <= this.bottom;
  }
  onLeftOfXY( x, y )    { return this.right < x;      }
  onLeftOfRect( rect )  { return this.right < r.left; }
  onLeftOf( vec )       { return this.right < vec.x;  }
  onRightOfXY( x, y )   { return this.left > x;       }
  onRightOfRect( rect ) { return this.left > r.right; }
  onRightOf( vec )      { return this.left > vec.x;   }
  aboveXY( x, y )       { return this.bottom < y;     }
  aboveRect( rect )     { return this.bottom < r.top; }
  above( vec )          { return this.bottom < vec.y; }
  belowXY( x, y )       { return this.top > y;        }
  belowRect( rect )     { return this.top > r.bottom; }
  below( vec )          { return this.top > vec.y;    }
  addMargin( margin ) {
    this.left -= margin; this.right += margin;
    this.top -= margin; this.bottom += margin;
    return this;
  }
  addMarginsXY( marginX, marginY ) {
    this.left -= marginX; this.right += marginX;
    this.top -= marginY; this.bottom += marginY;
    return this;
  }
  addMargins( marginLeft, marginTop, marginRight, marginBottom ) {
    this.left -= marginLeft; this.right += marginRight;
    this.top -= marginTop; this.bottom += marginBottom;
    return this;
  }
  pushPath( context ) {
    context.rect(this.left, this.top, this.width, this.height);
  }
  draw( context, fill, stroke ) {
    context.beginPath();
    this.pushPath(context);
    if(fill) context.fill();
    if(stroke) context.stroke();
  }
  setRect ( rect ) {
    this.left = rect.left; this.right = rect.right;
    this.top = rect.top; this.bottom = rect.bottom;
    return this;
  }
  set( left, top, right, bottom ) {
    this.top = top;
    this.left = left;
    this.right = right;
    this.bottom = bottom;
    return this;
  }
  moveXY( x, y ) {
    this.left += x; this.right += x;
    this.top += y; this.bottom += y;
    return this;
  }
  move( delta ) {
    this.left += delta.x; this.right += delta.x;
    this.top += delta.y; this.bottom += delta.y;
    return this;
  }
  getCurvePercentPoint( percent ) {
    if((percent%=1) < 0.25)
      return new Vec2(this.left+percent*4*this.width, this.top);
    if(percent < 0.5 )
      return new Vec2(this.right, this.top+(percent*4-1)*this.height);
    if(percent < 0.75)
      return new Vec2(this.right-(percent*4-2)*this.width, this.bottom);
    return new Vec2(this.left, this.bottom-(percent*4-3)*this.height);
  }
  getShape() {
    return new Polygon(Vec2.createVec2Array(
      [this.left,this.top,  this.right,this.top,
      this.right,this.bottom,  this.left,this.bottom]));
  }
  toString() {
    return ['[',this.left,', ',this.top,', ',this.right,', ',this.bottom,']'].join('');
  }
  static getUnion( rects ) {
    let i=rects.length;
    if(i) {
      var res = rects[--i].clone();
      while(i--) {
        res.left = Math.min(res.left, rects[i].left);
        res.top = Math.min(res.top, rects[i].top);
        res.right = Math.max(res.right, rects[i].right);
        res.bottom = Math.max(res.bottom, rects[i].bottom);
      }
      return res;
    }
    else return null;
  }
  static getIntersection( rects ) {
    let maxLeft, maxTop, minRight, minBottom, i=rects.length, r;
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
  }
  static createFromPoint( p ) { return new Rect(p.x, p.y, p.x, p.y); }
  static createFromXY( x, y ) { return new Rect(x, y, x, y); }
  static createFromPoints( array ) {
    let minX=array[0].x,maxX=minX, minY=array[0].y,maxY=minY, i=array.length, p;
    while(--i) { p = array[i];
      if(p.x < minX) minX = p.x;
      else if(p.x > maxX) maxX = p.x;
      if(p.y < minY) minY = p.y;
      else if(p.y > maxY) maxY = p.y;
    }
    return new Rect(minX, minY, maxX, maxY);
  }
}
//______________________________________________________________________________
// - - - - - - - - - - - - - - - - - - Shape - - - - - - - - - - - - - - - - - -
//******************************************************************************
class Shape {
  constructor( center ) {
    this.center = center.clone();
  }
  copyCenter() {
    return this.center.clone();
  }
  grow( factor ) { return this; }
  growDistance( delta ) { return this; }
  rotate( radians ) { return this; }
  pushPath( context ) { }
  intersect( shape ) { return false; }
  contains( point ) { return false; }
  getRect() { return Rect.createFromPoint(this.center); }
  getRadius() { return 0; }
  getCircle() { return new Circle(this.center, this.getRadius()); }
  get perimeter() { return 0; }
  get area() { return 0; }
  getCurvePercentPoint( percent ) { return this.center; }
  clone() { return new Shape(this.center); }
  mirrorVertically( axisY ) {
    this.center.set(this.center.getVerticalMirror(axisY));
    return this;
  }
  mirrorHorizontally( axisX ) {
    this.center.set(this.center.getHorizontalMirror(axisX));
    return this;
  }
  moveXY( dX, dY ) { this.center.addXY(dX, dY); return this; }
  move( delta ) { this.center.add(delta); return this; }
  moveToXY( x, y ) { this.center.setXY( x, y ); return this; }
  moveTo( center ) { this.center.set(center); return this; }
  draw( context, fill=true, stroke=false ) {
    context.beginPath();
    this.pushPath(context);
    if(fill) context.fill();
    if(stroke) context.stroke();
  }
}
//______________________________________________________________________________
// - - - - - - - - - - - - - - - - - -Circle - - - - - - - - - - - - - - - - - -
//******************************************************************************
class Circle extends Shape{
  constructor(center, radius ) {
    super(center);
    this.radius = radius;
  }
  grow( factor ) {
    this.radius *= factor;
    return this;
  }
  growDistance( delta ) {
    this.radius += delta;
    return this;
  }
  relativePointForRadians( radians ) {
    return Vec2.createFromRadians(radians, this.radius);
  }
  pointForRadians( radians ) {
    return Vec2.createFromRadians(radians, this.radius).add(this.center);
  }
  pushPath( context ) {
    context.arc(this.center.x, this.center.y, this.radius, 0, Circle.PI2, false);
  }
  intersect( shape ) {
    if(shape instanceof Circle) {
      var d = Vec2.distance(this.center, shape.center);
      return d < this.radius + shape.radius &&
          this.radius < d + shape.radius && // the other circle is not inside this circle
          shape.radius < d + this.radius; // this circle is not inside the other circle
    }
    else return shape.intersect(this);
  }
  contains( point ) {
    return Vec2.distance(this.center, point) < this.radius;
  }
  getRect() {
    return super.getRect().addMargin(this.radius);
  }
  getCurvePercentPoint( percent ) {
    return Vec2.createFromRadians(percent*Circle.PI2);
  }
  getRadius() { return this.radius; }
  getCircle() { return new Circle(this.center, this.radius); }
  get perimeter() { return Circle.PI2*this.radius; }
  get area() { return Math.pow(this.radius, 2)*Math.PI; }
  clone() { return new Circle(this.center, this.radius); }
  toPolygon( edges, startRadians = 0 ) {
    return new RegularPolygon(this.center, [this.radius], edges, startRadians);
  }
}
Circle.PI2 = 2*Math.PI;

//______________________________________________________________________________
// - - - - - - - - - - - - - - - - - -Ellispe- - - - - - - - - - - - - - - - - -
//******************************************************************************
/**
 * /!\ radiusX must be >= radiusY in order to the methods to work properly.
 * you can make reorder radiusX and radiusY by calling 'checkRadius()' method,
 * which will also change the rotation to make sure that the ellipse looks the same.
 * /!\ ellipses cannot be used for collision detection, and ellipses methods
 * can take time. you can make an ellipse-like polygon by calling
 * Polygon.createEllipse(center, radiusX, radiusY, edges, (optional)radians);
 */
class Ellipse extends Shape {
  constructor( center, radiusX, radiusY, radians=0 ) {
    super(center);
    this.radiusX = radiusX;
    this.radiusY = radiusY;
    this.radians = radians;
  }
  mirrorHorizontally( axisX ) {
    this.radians = Math.PI-this.radians;
    return super.mirrorHorizontally(axisX);
  }
  mirrorVertically( axisY ) {
    this.radians = -this.radians;
    return super.mirrorVertically(axisY);
  }
  grow( factor ) {
    this.radiusX*=factor;
    this.radiusY*=factor;
    return this;
  }
  growDistance( delta ) {
    this.radiusX += delta;
    this.radiusY += delta;
    return this;
  }
  rotate( radians ) {
    this.radians += radians;
    return this;
  }
  setRadians( radians ) {
    this.radians = radians%Circle.PI2;
    return this;
  }
  setRadiusX( radiusX ) {
    this.radiusX = radiusX;
    return this;
  }
  setRadiusY( radiusY ) {
    this.radiusY = radiusY;
    return this;
  }
  checkRadius() {
    let rx = this.radiusX, ry = this.radiusY;
    if(rx < ry) {
      this.radiusY = rx;
      this.radiusX = ry;
      this.setRadians(this.radians + Math.PI/2);
    }
    return this;
  }
  get squareFocusDistance() {
    let rx = this.radiusX, ry = this.radiusY;
    return rx*rx-ry*ry;
  }
  get focusDistance() {
    return Math.sqrt(this.squareFocusDistance);
  }
  get excentricity() {
    return this.focusDistance/this.radiusX;
  }
  relativePointForRadians( radians ) {
    let r = radians-this.radians;
    return new Vec2(this.radiusX*Math.cos(r), this.radiusY*Math.sin(r)).rotate(this.radians);
  }
  pointForRadians( radians ) {
    return this.relativePointForRadians(radians).add(this.center);
  }
  squareRadiusForRadians( radians ) {
    return this.relativePointForRadians(radians).squareMagnitude;
  }
  radiusForRadians( radians ) {
    return this.relativePointForRadians(radians).magnitude;
  }
  pushPath( context ) {
    context.ellipse(this.center.x, this.center.y, this.radiusX, this.radiusY, this.radians, 0, Circle.PI2);
  }
  intersect( shape ) {
    return false; // too complicated
  }
  contains( point ) {
    let p = point.clone().remove(this.center);
    let r = this.squareRadiusForRadians(p.getAngle());
    return r > p.squareMagnitude();
  }
  getRect() {
    let h,w;
    if(this.radians) {
      let a=this.radiusX, b=this.radiusY, alpha=this.radians,
          tanAlpha = Math.tan(alpha), sinAlpha=Math.sin(alpha), cosAlpha = Math.cos(alpha),
          b_a = b/a,
          t_xMax = Math.atan(-b_a*tanAlpha), t_yMax = Math.atan(b_a/tanAlpha);
      h = Math.abs(a*Math.cos(t_yMax)*sinAlpha + b*Math.sin(t_yMax)*cosAlpha);
      w = Math.abs(a*Math.cos(t_xMax)*cosAlpha + b*Math.sin(t_xMax)*sinAlpha);
    } else {
      h= this.radiusY;
      w= this.radiusX;
    }
    return new Rect(this.center.x-w, this.center.y-h, this.center.x+w, this.center.y+h);
  }
  getRadius() {
    return this.radiusX;
  }
  get perimeter() { //approximation
    return Math.PI*Math.sqrt(2*(Math.pow(this.radiusX, 2)+Math.pow(this.radiusY, 2)));
  }
  get area() {
    return this.radiusX*this.radiusY*Math.PI;
  }
  getCurvePercentPoint( percent ) {
    return this.pointForRadians(2*percent*Math.PI+this.radians);
  }
  clone() {
    return new Ellipse(this.center, this.radiusX, this.radiusY, this.radians);
  }
  createPolygon( edges ) {
    return Polygon.createEllipse(this.center, this.radiusX, this.radiusY, edges,
                                                                    this.radians);
  }
}
//______________________________________________________________________________
// - - - - - - - - - - - - - - - - - - -Line - - - - - - - - - - - - - - - - - -
//******************************************************************************
class Line extends Shape {
  constructor( p1, p2 ) {
    super(p1.clone().add(p2).mul(0.5));
    var u = Vec2.translation(p1, p2);
    this.radians = u.angle;
    this.length = u.magnitude;
  }
  grow( factor ) {
    this.length *= factor;
    return this;
  }
  growDistance( delta ) {
    this.length += 2*delta;
  }
  rotate( radians ) {
    this.radians += radians;
    return this;
  }
  mirrorVertically( axisY ) {
    super.mirrorVertically(axisY);
    this.radians = -this.radians;
    return this;
  }
  mirrorHorizontally( axisX ) {
    super.mirrorHorizontally(axisX);
    this.radians = Math.PI - this.radians;
    return this;
  }
  pushPath( context ) {
    var dX = (this.length*Math.cos(this.radians))/2;
    var dY = (this.length*Math.sin(this.radians))/2;
    context.moveTo(this.center.x - dX, this.center.y - dY);
    context.lineTo(this.center.x + dX, this.center.y + dY);
  }
  get p0() {
    return this.center.clone().addXY(
      -(this.length*Math.cos(this.radians))/2,
      -(this.length*Math.sin(this.radians))/2);
  }
  get p1() {
    return this.center.clone().addXY(
      (this.length*Math.cos(this.radians))/2,
      (this.length*Math.sin(this.radians))/2);
  }
  set p0( p0 ) {
    var trans = Vec2.translation(p0, this.p1);
    this.radians = trans.getAngle();
    this.length = trans.magnitude();
    this.center.set(trans.mul(0.5).add(p0));
    return p0;
  }
  set p1( p1 ) {
    var trans = Vec2.translation(this.p0, p1);
    this.radians = trans.getAngle();
    this.length = trans.magnitude();
    this.center.set(trans.mul(-0.5).add(p1));
    return p1;
  }
  setP0( p0 ) {
    var trans = Vec2.translation(p0, this.p1);
    this.radians = trans.getAngle();
    this.length = trans.magnitude();
    this.center.set(trans.mul(0.5).add(p0));
    return this;
  }
  setP1( p1 ) {
    var trans = Vec2.translation(this.p0, p1);
    this.radians = trans.getAngle();
    this.length = trans.magnitude();
    this.center.set(trans.mul(-0.5).add(p1));
    return this;
  }
  setPoints( p0, p1 ) {
    var trans = Vec2.translation(p0, p1);
    this.radians = trans.getAngle();
    this.length = trans.magnitude();
    this.center.set(trans.mul(0.5).add(p0));
    return this;
  }
  get vector() {
    return new Vec2(
        this.length*Math.cos(this.radians),
        this.length*Math.sin(this.radians));
  }
  get directorVect() {
    return Vec2.createFromRadians(this.radians);
  }
  intersect( shape ) {
    if(shape instanceof Circle) {
      let A = this.p0;
      let B = this.p1;
      if(shape.contains(A)) return !shape.contains(B);
      if(shape.contains(B)) return !shape.contains(A);
      let AB = Vec2.translation(A, B),
          AC = Vec2.translation(A, shape.center),
          u = this.directorVect,
          d = Vec2.dotProd(u, AC);
      return Vec2.distance((d<0) ? A : (d>this.length)? B : u.mul(d).add(A),
                           shape.center) <= shape.radius;
    }
    else if(shape instanceof Line) {
      var A = this.p0, B = this.p1, C = shape.p0, D = shape.p1;
      var AC = Vec2.translation(A, C), BC = Vec2.translation(B, C),
          AD = Vec2.translation(A, D), BD = Vec2.translation(B, D);
      if(Vec2.ccw2(AC, AD)!=Vec2.ccw2(BC, BD)) {
        var AB = Vec2.translation(A, B);
        return Vec2.ccw2(AB, AC) != Vec2.ccw2(AB, AD);
      }
      else return false;
    }
    else shape.intersect(this);
  }
  contains( point ) {
    var v = Vec2.translation(this.center, point);
    var u = this.directorVect;
    return v.equals(u.mul(Vec2.distance(this.center, point)))
          || v.equals(u.mul(-1));
  }
  distanceToPoint( point ) {
    let A  = this.p0,
        B  = this.p1,
        AB = Vec2.translation(A, B),
        AC = Vec2.translation(A, point),
        u  = this.directorVect,
        d  = Vec2.dotProd(u, AC);
    return Vec2.distance((d<0)? A : (d>this.length)? B : u.mul(d).add(A), point);
  }
  getNormalVect( left=true ) {
    return this.directorVect.rotate(left ? -Math.PI*0.5 : Math.PI*0.5);
  }
  getRect() {
    var p1 = this.p1, p0 = this.p0, left, top, right, bottom;
    if(p0.x < p1.x) { left = p0.x; right = p1.x; }
    else            { left = p1.x; right = p0.x; }
    if(p0.y < p1.y) { top = p0.y; bottom = p1.y; }
    else            { top = p1.y; bottom = p0.y; }
    return new Rect(left, top, right, bottom);
  }
  getCurvePercentPoint( p ) {
    return this.p0.mul(p).add(this.p1.mul(1-p));
  }
  getRadius() { return this.length/2; }
  get perimeter() { return this.length*2; }
  clone() {
    return new Line(this.p0, this.p1);
  }
  /**
   * return an object with 3 properties :
   *    the first one, 'point',  is the point where the 2 lines intersect, 
   *    the second one, 'onLine1', is true if the point is on the segment 'line1',
   *    the third one, 'onLine2', is true if the point is on the segment 'line2'.
   * If the two lines are parallel, this method returns null.
   */
  static intersectionPoint( line1, line2 ) {
    let A = line1.p0, B = line1.p1, C = line2.p0, D = line2.p1,
        AB = Vec2.translation(A,B), CD = Vec2.translation(C,D),
        denom = CD.y*AB.x - CD.x*AB.y;
    if(!denom) return null;
    let CA = Vec2.translation(C,A), num1 = CD.x*CA.y - CD.y*CA.x,
        num2 = AB.x*CA.y - AB.y*CA.x, pos1 = num1/denom, pos2 = num2/denom;
    return {
      point: A.add(AB.mul(pos1)), onLine1: pos1>0&&pos1<1, onLine2: pos2>0&&pos2<1
    };
  }
}

//______________________________________________________________________________
// - - - - - - - - - - - - - - - - - - Point - - - - - - - - - - - - - - - - - -
//******************************************************************************
class Point extends Shape {
  constructor( vec ) {
    super(vec);
  }
  pushPath( context ) {
    context.rect(this.center.x-0.5, this.center.y-0.5, 1, 1);
  }
  intersect( shape ) {
    if(shape instanceof Circle) {
      return Vec2.distance(shape.center, this.center) == shape.radius;
    } else if(shape instanceof Line) {
      return shape.contains(this.center);
    } else if(shape instanceof Point) {
      return this.center.equals(shape.center);
    }
    else return shape.intersect(this);
  }
  contains( point ) {
    return this.center.equals(point);
  }
  clone() {
    return new Point(this.center);
  }
}
//______________________________________________________________________________
// - - - - - - - - - - - - - - - - - - -Path - - - - - - - - - - - - - - - - - -
//******************************************************************************
class Path extends Shape {
  constructor( pointsArray ) {
    var center = Vec2.zero;
    var len = pointsArray.length, i=len, points = new Array(len);
    if(len) {
      while(i--) {
        center.add(pointsArray[i]);
      }
      center.mul(1/len);
      for(i=0; i< len; i++) {
        points[i] = pointsArray[i].clone().remove(center);
      }
    }
    super(center);
    this.points = points;
  }
  grow( factor ) {
    let i=this.points.length;
    while(i--) {
      this.points[i].mul(factor);
    }
    return this;
  }
  growDistance( delta ) {
    let i=this.points.length;
    while(i--) this.points[i].magnitude += delta;
    return this;
  }
  rotate( radians ) {
    let i=this.points.length;
    while(i--) this.points[i].angle+=radians;
    return this;
  }
  mirrorVertically( axisY ) {
    super.mirrorVertically(axisY);
    let i=this.points.length;
    while(i--) this.points[i].mirrorVertically();
    return this;
  }
  mirrorHorizontally( axisX ) {
    super.mirrorHorizontally(axisX);
    let i=this.points.length;
    while(i--) this.points[i].mirrorHorizontally();
    return this;
  }
  pushPath( context ) {
    let len = this.points.length;
    if(len) {
      context.translate(this.center.x, this.center.y);
      context.moveTo(this.points[0].x, this.points[0].y);
      for(let i=1; i< len; i++) {
        context.lineTo(this.points[i].x, this.points[i].y);
      }
      context.translate(-this.center.x, -this.center.y);
    }
  }
  getPoint( index ) {
    return this.points[index].clone().add(this.center);
  }
  getPoints() {
    let i = this.points.length;
    var res = new Array(i);
    while(i--) res[i] = this.getPoint(i);
    return res;
  }
  get lines() {
    let i = this.points.length-1, res = new Array(i);
    while(i--) {
      result.push(this.getLine(i));
    }
    return result;
  }
  getLine( index ) {
    let len = this.points.length;
    return new Line(this.points[index++], this.points[index==len?0:index])
                                                              .move(this.center);
  }
  getNormalVectForLine( index ) {
    return new Line(this.points[index], this.points[(index+1)%this.points.length])
                                                          .getNormalVect(false);
  }
  rotatePointsOrder( delta /* number of times the indexes must be incremented*/) {
    if(delta%1) delta = Math.round(delta);
    let len = this.points.length, i = len;
    var p = new Array(len);
    while(i--) {
      p[i] = this.points[(i+delta)%len];
    }
    this.points = p;
  }
  getReducedPath( distance ) {
    let len = this.points.length;
    let points = new Array(len), p, l1, l2;
    for(let i=0; i<len; i++) {
      p = this.points[i].clone();
      if(i) {
        l1 = this.getLine(i-1);
        l1.move(l1.getNormalVect().mul(distance));
      }
      else {
        l1 = this.getLine(len-1);
        l1.move(l1.getNormalVect().mul(distance));
      }
      l2 = this.getLine(i);
      l2.move(l2.getNormalVect().mul(distance));
      points[i] = Line.intersectionPoint(l1, l2).point;
    }
    return new Path(points);
  }
  getReducedPolygon( distance ) {
    let len = this.points.length;
    let points = new Array(len), p, l1, l2;
    for(let i=0; i<len; i++) {
      p = this.points[i].clone();
      if(i) {
        l1 = this.getLine(i-1);
        l1.move(l1.getNormalVect().mul(distance));
      }
      else {
        l1 = this.getLine(len-1);
        l1.move(l1.getNormalVect().mul(distance));
      }
      l2 = this.getLine(i);
      l2.move(l2.getNormalVect().mul(distance));
      points[i] = Line.intersectionPoint(l1, l2).point;
    }
    return new Polygon(points);
  }
  intersect( shape ) {
    let lines = this.lines, i=lines.length;
    if(!i) return false;
    if(shape instanceof Path) {
      var otherLines = shape.lines, len = otherLines.length, line;
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
    else while(i--) {
      if(lines[i].intersect(shape)) {
        return true;
      }
    }
    return false;
  }
  getIntersectionLine( shape, startIndex = 0) {
    let lines = this.lines, i=lines.length;
    var result = null;
    if(i<=startIndex) return null;
    if(shape instanceof Path) {
      let otherLines = shape.lines, len = otherLines.length, line, j;
      while(i-->startIndex) {
        line = lines[i];
        j=len;
        while(j--) {
          if(otherLines[j].intersect(line))
            return line;
    } } }
    else {
      while(i-->startIndex) {
        if(lines[i].intersect(shape)) {
          result = lines[i];
          break;
    } } }
    return result;
  }
  getIntersectionLines(shape, startIndex = 0) {
    let lines = this.lines, i = lines.length;
    var result = [];
    if(shape instanceof Path) {
      let otherLines = shape.lines, len = otherLines.length, line, j;
      while(i-->startIndex) {
        line = lines[i];
        j=len;
        while(j--) {
          if(otherLines[j].intersect(line))
            result.push(line);
    } } }
    else {
      while(i-->startIndex) {
        if(lines[i].intersect(shape)) {
          result.push(lines[i]);
    } } }
    return result;
  }
  contains( point ) {
    let rect = this.getRect();
    let width = rect.width+10, height = rect.height+10;
    let endPoint = point.clone();
    let lines = [
      new Line(point, endPoint.add(width, 0)),
      new Line(point, endPoint.add(-2*width, 0)),
      new Line(point, endPoint.add(width, height)),
      new Line(point, endPoint.add(0, -2*height))
    ];
    return this.intersect(lines[0]) && this.intersect(lines[1])
        && this.intersect(lines[2]) && this.intersect(lines[3]);
  }
  getRect() {
    let left = 0, top = 0, right = 0, bottom = 0, point, i = this.points.length;
    while(i--) { point = this.points[i];
      if(point.x < left) left = point.x;
      else if(point.x > right) right = point.x;
      if(point.y < top) top = point.y;
      else if(point.y > bottom) bottom = point.y;
    }
    return new Rect(left, top, right, bottom).move(this.center);
  }
  getCurvePercentPoint( p ) {
    let dist = this.perimeter*p;
    let lines = this.lines, len=lines.length, l;
    for(var i=0; i< len; i++) {
      l=lines[i].length;
      if(l>dist) {
        return lines[i].getCurvePercentPoint(dist/l);
      }
      else dist-=l;
    }
    return this.points[i].add(this.center);
  }
  getRadius() {
    let r = 0, mag;
    for(var i=this.points.length-1; i>= 0; i--) {
      mag = this.points[i].squareMagnitude; 
      if(mag > r) r = mag;
    }
    return Math.sqrt(r);
  }
  redefineCenter(delta = null) {
    let i = this.points.length;
    if(!i) return;
    if(delta) {
      while(i--)
        this.points[i].remove(delta);
    }
    else {
      delta = Vec2.zero;
      var len=i;
      while(i--)
        delta.add(this.points[i]);
      delta.mul(1/len);
      this.center.set(delta);
    }
  }
  get perimeter() {
    let i = this.points.length-1, res = 0;
    while(i) res += Vec2.distance(this.points[i--], this.points[i]);
    return res;
  }
  get area() {
    var res = 0, len = this.points.length, i=len;
    var p0, p1 = this.points[0];
    while(i--) {
      p0 = this.points[i];
      res += (p0.x+p1.x)*(p0.y-p1.y);
      p1 = p0;
    }
    return res/2;
  }
  clone() {
    let i = this.points.length;
    var result = new Path([]), p = new Array(i);
    result.center.set(this.center);
    while(i--) p[i] = this.points[i].clone();
    result.points = p;
    return result;
  }
}
//______________________________________________________________________________
// - - - - - - - - - - - - - - - - - -Polygon- - - - - - - - - - - - - - - - - -
//******************************************************************************
class Polygon extends Path {
  constructor( pointsArray ) {
    super(pointsArray);
  }
  pushPath( context ) {
    super.pushPath(context);
    context.closePath();
  }
  get lines() {
    let i = this.points.length, res = new Array(i);
    while(i--) {
      res[i]=this.getLine(i);
    }
    return res;
  }
  get perimeter() {
    let i = this.points.length-1, res = vec2.distance(this.points[0], this.points[i]);
    while(i) res += Vec2.distance(this.points[i--], this.points[i]);
    return res;
  }
  clone() {
    let i = this.points.length;
    var result = new Polygon([]), p = new Array(i);
    result.center.set(this.center);
    while(i--) p[i] = this.points[i].clone();
    result.points = p;
    return result;
  }
  static createRectangle( center, width, height ) {
    let left = center.x-width/2, top = center.y - height/2;
    return new Polygon(Vec2.createVec2Array([
        left,top  ,  left+width,top,
        left+width,top+height  ,  left,top+height
      ]));
  }
  static createEllipse( center, radiusX, radiusY, edges, radians=0 ) {
    let dA = Circle.PI2/edges, a = Circle.PI2+radians,
        points = new Array(edges), i=edges.length;
    while(i--) {
      a-=dA;
      points[i] = new Vec2(radiusX*Math.cos(a), radiusY*Math.sin(a));
    }
    return Polygon.createManually(center, points);
  }
  static createManually( center, pointsArray ) {
    var polygon = new Polygon([]);
    polygon.moveTo(center);
    let i = pointsArray.length;
    polygon.points = new Array(i);
    while(i--) {
      polygon.points[i] = pointsArray[i].clone();
    }
    return polygon;
  }
  static createFromCenter( center, pointsArray ) {
    console.deprecated('Polygon.createFromCenter(center, pointsArray) is deprecated.'
        + ' Use Polygon.createManually(center, pointsArray) instead.');
    return Polygon.createManually( center, pointsArray );
  }
  static Regular( center, radiusArray, pointsNumber, startRadians ) {
    let dR = (Math.PI*2)/pointsNumber;
    let angle = startRadians;
    var result = new Polygon([]);
    result.center = center.clone();
    result.points = new Array(pointsNumber);
    var rLen = radius.length;
    if(exists(rLen)) {
      let i=-1;
      while(i++<pointsNumber) {
        result.points[i] = Vec2.createFromRadians(angle, radius[i%rLen]);
        angle += dR;
      }
    }
    else {
      let i=pointsNumber;
      while(i--) {
        result.points[i] = Vec2.createFromRadians(angle, radius);
        angle += dR;
      }
    }
  }
}
//______________________________________________________________________________
// - - - - - - - - - - - - - - - - - - -Ray- - - - - - - - - - - - - - - - - - -
//******************************************************************************
class Ray extends Shape {
  constructor( origin, radians ) {
    super(origin);
    this.radians = radians;
  }
  get origin() { return this.center; }
  set origin( o ) { this.center.set(o); return o;}
  rotate( radians ) {
    this.radians += radians;
    return this;
  }
  mirrorVertically( axisY ) {
    super.mirrorVertically(axisY);
    this.radians = -this.radians;
    return this;
  }
  mirrorHorizontally( axisY ) {
    super.mirrorHorizontally(axisY);
    this.radians = Math.PI-this.radians;
    return this;
  }
  endPoint( length ) {
    return this.center.clone()
        .addXY(Math.cos(this.radians)*length, Math.sin(this.radians)*length);
  }
  pushPath( context ) {
    let endPoint = this.endPoint(
        context.canvas.clientWidth + context.canvas.clientHeight);
    context.moveTo(this.center.x, this.center.y);
    context.lineTo(endPoint.x, endPoint.y);
  }
  intersect( shape ) {
    let rect = shape.getRect();
    return new Line(this.center, this.endPoint(
        Vec2.distance(this.center, shape.center) + rect.width() + rect.height()))
        .intersect(shape);
  }
  contains( point ) {
    return this.endPoint(Vec2.distance(this.center, point)).equals(point);
  }
  getRect() {
    let endPoint = this.endPoint(Number.MAX_SAFE_INTEGER);
    return new Rect(
        Math.min(endPoint.x, this.center.x), Math.min(endPoint.y, this.center.y),
        Math.max(endPoint.x, this.center.x), Math.max(endPoint.y, this.center.y));
  }
  getRadius() { return Number.MAX_SAFE_INTEGER; }
  get perimeter() { return Number.MAX_SAFE_INTEGER; }
  clone() { return new Ray(this.center, this.radians); }
}
