/**
 * author : Loic France
 * created 05/31/2016
 */
window.classExtend||(window.classExtend=function(a,b){b.prototype=Object.create(a.prototype);b.prototype.constructor=b;b["super"]=a.prototype});window.override||(window.override=function(a,b,c){_super=a.prototype[b];a.prototype[b]=c;return _super});window.exists||(window.exists=function(a){return void 0!==a});window.isNull||(window.isNull=function(a){return void 0===a||null===a});
window.createProperties||(window.createProperties=function(a,b,c){isNull(c)&&(c={});if(!isNull(b))for(var d in b)c[d]=b[d];if(!isNull(a))for(var f in a)c.hasOwnProperty(f)||(c[f]=a[f]);return c});window.globalize||(window.globalize=function(a){for(var b in a)window.hasOwnProperty(b)?console.error("the property "+b+" already exists in global space."):window[b]=a[b]});
window.getStringFromUrl||(window.getStringFromUrl=function(a,b){var c=new XMLHttpRequest;c.open("GET",a);c.onreadystatechange=function(a){return b(c.responseText)};c.send()});window.TYPE_UNDEFINED="undefined";window.TYPE_OBJECT="object";window.TYPE_BOOLEAN="boolean";window.TYPE_NUMBER="number";window.TYPE_STRING="string";window.TYPE_FUNCTION="function";var KEY={State:{UP:0,DOWN:1},BACK_SPACE:8,TAB:9,ENTER:13,MAJ:16,CTRL:17,ALT:18,VERR_MAJ:20,ESCAPE:27,SPACE:32,PAGE_UP:33,PAGE_DOWN:34,END:35,BEGINNING:36,LEFT:37,UP:38,RIGHT:39,DOWN:40,PRINT_SCR:44,INSERT:45,SUPPR:46,ZERO:48,ONE:49,TWO:50,THREE:51,FOUR:52,FIVE:53,SIX:54,SEVEN:55,EIGHT:56,NINE:57,A:65,B:66,C:67,D:68,E:69,F:70,G:71,H:72,I:73,J:74,K:75,L:76,M:77,N:78,O:79,P:80,Q:81,R:82,S:83,T:84,U:85,V:86,W:87,X:88,Y:89,Z:90,NUM_0:96,NUM_1:97,NUM_2:98,NUM_3:99,NUM_4:100,NUM_5:101,NUM_6:102,NUM_7:103,
NUM_8:104,NUM_9:105,F1:112,F2:113,F3:114,F4:115,F5:116,F6:117,F7:118,F8:119,F9:120,F10:121,F11:122,F12:123,VERR_NUM:144,FN:255},Input=new function(){this.KeyState={UP:0,DOWN:1};for(var a=!1,b,c,d,f=Array(256),k=1;k<f.length;k++)f[k]=KEY.State.UP;var g=function(p){a=!0;d=[];c=function(a){f[a.keyCode]||(f[a.keyCode]=!0,d.forEach(function(b){b.onKeyDown(a.keyCode)}))};b=function(a){f[a.keyCode]&&(f[a.keyCode]=!1,d.forEach(function(b){b.onKeyUp(a.keyCode)}))};document.addEventListener("keydown",c,!1);
document.addEventListener("keyup",b,!1)};this.addKeyListener=function(b){a||g();d.push(b)};this.removeKeyListener=function(b){a&&d.remove(b)};this.getKeyState=function(a){return f[a]};this.addFocusListener=function(a,b){a.onfocus=function(){b(!0)};a.onblur=function(){b(!1)}};this.removeFocusListener=function(a){delete a.onfocus;delete a.onblur};var l=function(a){!a.which&&e.button&&(a.button&1&&(a.which=1),a.button&4&&(a.which=2),a.button&2&&(a.which=3))},h=function(a,b){return new Vec2(b.pageX-a.offsetLeft,
b.pageY-a.offsetTop)};this.MOUSE_UP=0;this.MOUSE_DOWN=1;this.MOUSE_CLICK=2;this.MOUSE_DBCLICK=3;this.MOUSE_CONTEXT_MENU=4;this.addMouseBtnListener=function(a,b){a.onclick=function(c){b.onClick&&(l(c),b.onClick(c.which,h(a,c)))};a.onmousedown=function(c){b.onMouseDown&&(l(c),b.onMouseDown(c.which,h(a,c)))};a.onmouseup=function(c){b.onMouseUp&&(l(c),b.onMouseUp(c.which,h(a,c)))};a.onrightclick=function(c){if(b.onContextMenu)return l(c),b.onContextMenu(h(a,c))};a.ondbclick=function(c){b.onDoubleClick&&
(l(c),b.onDoubleClick(c.which,h(a,c)))}};this.removeMouseBtnListener=function(a){delete a.onclick;delete a.onmousedown;delete a.onmouseup;delete a.onrightclick;delete a.ondbclick};this.MOUSE_EXIT=5;this.MOUSE_ENTER=6;this.MOUSE_MOVE=7;this.addMouseMoveListener=function(a,b){a.onmousemove=function(c){if(b.onMouseMove)b.onMouseMove(h(a,c))};a.onmouseover=function(c){if(b.onMouseEnter)b.onMouseEnter(h(a,c))};a.onmouseout=function(c){if(b.onMouseExit)b.onMouseExit(h(a,c))}};this.removeMouseMoveListener=
function(a){delete a.onmousemove;delete a.onmouseover;delete a.onmouseout};this.pointerLock=function(a,b){isNull(b)||(isNull(b.pointerLockChange)||(document.addEventListener("pointerlockchange",b.pointerLockChange,!1),document.addEventListener("mozpointerlockchange",b.pointerLockChange,!1),document.addEventListener("webkitpointerlockchange",b.pointerLockChange,!1)),isNull(b.pointerLockError)||(document.addEventListener("pointerlockerror",b.pointerLockError,!1),document.addEventListener("mozpointerlockerror",
b.pointerLockError,!1),document.addEventListener("webkitpointerlockerror",b.pointerLockError,!1)));if(document.webkitFullscreenElement===elem||document.mozFullscreenElement===elem||document.mozFullScreenElement===elem)elem.requestPointerLock=elem.requestPointerLock||elem.mozRequestPointerLock||elem.webkitRequestPointerLock,elem.requestPointerLock()};this.fullScreen=function(a,b){elem.requestFullscreen=elem.requestFullscreen||elem.mozRequestFullscreen||elem.mozRequestFullScreen||elem.webkitRequestFullscreen;
elem.requestFullscreen();isNull(b)||isNull(b.fullScreenChange)||(document.addEventListener("fullscreenchange",b.fullscreenChange,!1),document.addEventListener("mozfullscreenchange",b.fullscreenChange,!1),document.addEventListener("webkitfullscreenchange",b.fullscreenChange,!1))}},KeyMap=function(){var a=this,b=[],c=[],d=[],f={onKeyUp:function(b){var c=a.getAction(b);c&&d.forEach(function(a){if(a.thisArg)a.onUp.bind(a.thisArg,c);else a.onUp(c)})},onKeyDown:function(b){var c=a.getAction(b);c&&d.forEach(function(a){if(a.thisArg)a.onDown.bind(a.thisArg,
c);else a.onDown(c)})}};this.setAction=function(a,d){if(a.length)for(var f=0;f<a.length;f++)this.setAction(a[f],d);else f=b.indexOf(a),-1!==f?null===d?b.splice(f,1):c[f]=d:null!==d&&(b.push(a),c.push(d))};this.getAction=function(a){a=b.indexOf(a);if(-1!=a)return c[a]};this.getKeyState=function(a){a=this.getKeys(a);for(var b=0;b<a.length;b++)if(Input.getKeyState(a[b]))return!0;return!1};this.getKeys=function(a){for(var d=c.indexOf(a),f=[];-1!=d;)f.push(b[d]),d=c.indexOf(a,d+1);return f};this.addListener=
function(a){d.push(a);1==d.length&&Input.addKeyListener(f)};this.removeListener=function(a){a=d.indexOf(a);-1!=a&&d.splice(a,1);0===d.length&&Input.removeKeyListener(f)}};var Gravity={LEFT:1,TOP:2,RIGHT:4,BOTTOM:8,CENTER:16,getRect:function(a,b,c,d,f,k){exists(f)&&(exists(k)||(k=f),b=b.clone().addMargin(-f,-k));0===(a&Gravity.CENTER)&&(0===a?a=Gravity.LEFT|Gravity.TOP:(0===(a&Gravity.LEFT)&&0===(a&Gravity.RIGHT)&&(a|=Gravity.LEFT),0===(a&Gravity.TOP)&&0===(a&Gravity.BOTTOM)&&(a|=Gravity.TOP)));var g,l,h,p;a&0!==Gravity.CENTER&&(g=b.left+(b.width()-c)/2,l=b.top+(b.height()-d)/2,h=b.right-(b.width()-c)/2,p=b.bottom-(b.height()-d)/2);a&0!==Gravity.LEFT&&(g=b.left);a&
0!==Gravity.TOP&&(l=b.top);a&0!==Gravity.RIGHT&&(h=b.right);a&0!==Gravity.BOTTOM&&(p=b.right);exists(g)?exists(h)||(h=g+c):g=h-c;exists(l)?exists(p)||(p=l+d):l=p-d;return new Rect(g,l,h,p)},getHorizontalGravity:function(a,b){return a&Gravity.LEFT?Gravity.LEFT:a&Gravity.RIGHT?Gravity.RIGHT:a&Gravity.CENTER?Gravity.CENTER:b?b:Gravity.LEFT},getVerticalGravity:function(a,b){return a&Gravity.TOP?Gravity.TOP:a&Gravity.BOTTOM?Gravity.BOTTOM:a&Gravity.CENTER?Gravity.CENTER:b?b:Gravity.TOP}};
CanvasRenderingContext2D.prototype.wrapText||(CanvasRenderingContext2D.prototype.wrapText=function(a,b,c,d){var f=a.split("\n"),k=f.length;a=[];for(var g="",l=[],h,p,q,m,r=b.width(),n,t=0;t<k;t++){p=f[t].split(" ");q=p.length;for(n=0;n<q;n++)h=g+p[n],m=this.measureText(h),m=m.width,m>r&&0<n?(h=b.left,d&Gravity.LEFT||(m=this.measureText(g),m=m.width,h=d&Gravity.RIGHT?h+(r-m):h+(r-m)/2),a.push(g),g=p[n]+" ",l.push(h)):g=h+" ";h=b.left;d&Gravity.LEFT||(m=this.measureText(g),m=m.width,h=d&Gravity.RIGHT?
h+(r-m):h+(r-m)/2);a.push(g);l.push(h)}q=a.length;f=b.top+c/2;d&Gravity.TOP||(n=c*q,f=d&Gravity.BOTTOM?f+(b.height()-n):f+(b.height()-n)/2);for(n=0;n<q;n++)this.strokeText(a[n],l[n],f),f+=c});var Vec2=function(){switch(arguments.length){case 1:this.x=arguments[0].x;this.y=arguments[0].y;break;case 2:this.x=arguments[0];this.y=arguments[1];break;default:this.x=this.y=0}};Vec2.prototype.set=function(){switch(arguments.length){case 1:this.x=arguments[0].x;this.y=arguments[0].y;break;case 2:this.x=arguments[0];this.y=arguments[1];break;default:this.x=this.y=0}return this};
Vec2.prototype.add=function(){switch(arguments.length){case 1:this.x+=arguments[0].x;this.y+=arguments[0].y;break;case 2:this.x+=arguments[0],this.y+=arguments[1]}return this};Vec2.prototype.remove=function(a){this.x-=a.x;this.y-=a.y;return this};Vec2.prototype.mul=function(a){this.x*=a;this.y*=a;return this};Vec2.prototype.squareMagnitude=function(){return this.x*this.x+this.y*this.y};Vec2.prototype.magnitude=function(){return Math.sqrt(this.squareMagnitude())};
Vec2.prototype.getAngle=function(){return Math.atan2(this.y,this.x)};Vec2.prototype.rotate=function(a){a=this.getAngle()+a;var b=this.magnitude();this.set(b*Math.cos(a),b*Math.sin(a));return this};Vec2.prototype.rotateAround=function(a,b){var c=Vec2.translation(a,this);c.rotate(b);this.set(c.add(a))};Vec2.prototype.toString=function(){return"("+this.x+", "+this.y+")"};Vec2.prototype.equals=function(a,b){return void 0===b?this.x===a.x&&this.y===a.y:this.x===a&&this.y===b};
Vec2.prototype.isZero=function(){return!(this.x||this.y)};Vec2.prototype.getUnit=function(){return(new Vec2(this)).normalize()};Vec2.prototype.getMirror=function(a){return Vec2.translation(this,a).add(a)};Vec2.prototype.getHorizontalMirror=function(a){var b=new Vec2(this);b.x=a?2*a-b.x:-b.x;return b};Vec2.prototype.getVerticalMirror=function(a){var b=new Vec2(this);b.y=a?2*a-b.y:-b.y;return b};Vec2.prototype.normalize=function(){return this.mul(1/this.magnitude())};
Vec2.prototype.roundedX=function(a){return a?this.x.toPrecision(a):Math.round(this.x)};Vec2.prototype.roundedY=function(a){return a?this.y.toPrecision(a):Math.round(this.y)};Vec2.prototype.roundedVec=function(a){return new Vec2(this.roundedX(a),this.roundedY(a))};Vec2.prototype.clampMagnitude=function(a,b){var c=this.magnitude();c<a?this.mul(a/c):c>b&&this.mul(b/c);return this};Vec2.dotProd=function(a,b){return a.x*b.x+a.y*b.y};Vec2.vectProd=function(a,b){return a.x*b.y-a.y*b.u};
Vec2.translation=function(a,b){return new Vec2(b.x-a.x,b.y-a.y)};Vec2.squareDistance=function(a,b){var c=b.x-a.x,d=b.y-a.y;return c*c+d*d};Vec2.distance=function(a,b){return Math.sqrt(Vec2.squareDistance(a,b))};Vec2.ccw=function(a,b,c){return(c.y-a.y)*(b.x-a.x)>(b.y-a.y)*(c.x-a.x)};Vec2.ccw2=function(a,b){return b.y*a.x>a.y*b.x};Vec2.getRadiansBetween=function(a,b){return b.getAngle()-a.getAngle()};Vec2.createFromRadians=function(a){return new Vec2(Math.cos(a),Math.sin(a))};Vec2.ZERO=new Vec2;
var Rect=function(a,b,c,d){void 0!==d?(this.left=a,this.top=b,this.right=c,this.bottom=d):this.left=this.top=this.right=this.bottom=0};Rect.prototype.center=function(){return(new Vec2(this.left+this.right,this.top+this.bottom)).mul(.5)};Rect.prototype.overlap=function(a){return a.left<=this.right&&a.top<=this.bottom&&a.right>=this.left&&a.bottom>=this.top};
Rect.prototype.contains=function(a,b){return void 0!==b?a>=this.left&&a<=this.right&&b>=this.top&&b<=this.bottom:void 0!==a.x?this.contains(a.x,a.y):a instanceof Rect&&a.left>this.left&&a.right<this.right&&a.top>this.top&&a.bottom<this.bottom};Rect.prototype.onLeftOf=function(a,b){return this.right<(void 0===b)?a instanceof Rect?a.left:a.x:a};Rect.prototype.onRightOf=function(a,b){return this.left>(void 0===b)?a instanceof Rect?a.right:a.x:a};
Rect.prototype.above=function(a,b){return this.bottom<(void 0===b)?a instanceof Rect?a.top:a.y:b};Rect.prototype.below=function(){return this.top>(void 0===y)?x instanceof Rect?x.bottom:x.y:y};Rect.prototype.addMargin=function(a,b){this.left-=a;this.right+=a;var c=exists(b)?b:a;this.top-=c;this.bottom+=c;return this};Rect.prototype.pushPath=function(a){a.rect(this.left,this.top,this.width(),this.height())};
Rect.prototype.draw=function(a,b,c){a.beginPath();this.pushPath(a);a.closePath();b&&a.fill();c&&a.stroke()};Rect.prototype.set=function(a,b,c,d){void 0!==d?(this.top=b,this.left=a,this.right=c,this.bottom=d):(this.top=a.top,this.left=a.left,this.right=a.right,this.bottom=a.bottom);return this};Rect.prototype.move=function(a,b){void 0!==b?(this.left+=a,this.right+=a,this.top+=b,this.bottom+=b):(this.left+=a.x,this.right+=a.x,this.top+=a.y,this.bottom+=a.y);return this};
Rect.prototype.width=function(){return this.right-this.left};Rect.prototype.height=function(){return this.bottom-this.top};Rect.prototype.ratio=function(){return this.width()/this.height()};Rect.prototype.perimeter=function(){return 2*this.width()+2*this.height()};Rect.prototype.area=function(){return this.width()*this.height()};Rect.prototype.clone=function(){return new Rect(this.left,this.top,this.right,this.bottom)};
Rect.prototype.getShape=function(){return new Polygon([{x:this.left,y:this.top},{x:this.right,y:this.top},{x:this.right,y:this.bottom},{x:this.left,y:this.bottom}])};Rect.prototype.toString=function(){return"["+this.left+", "+this.top+", "+this.right+", "+this.bottom+"]"};
Rect.getUnion=function(){for(var a=arguments[0].clone(),b=1;b<arguments.length;b++)arguments[b].left<a.left&&(a.left=arguments[b].left),a.left=Math.min(a.left,arguments[b].left),a.top=Math.min(a.top,arguments[b].top),a.right=Math.max(a.right,arguments[b].right),a.bottom=Math.max(a.bottom,arguments[b].bottom);return a};Rect.createFromPoint=function(a,b){return b?new Rect(a,b,a,b):a?new Rect(a.x,a.y,a.x,a.y):new Rect(0,0,0,0)};var Shape=function(a){this.center=new Vec2(a)};
Shape.prototype.mirrorVertically=function(a){this.center.set(this.center.getVerticalMirror(a));return this};Shape.prototype.mirrorHorizontally=function(a){this.center.set(this.center.getHorizontalMirror(a));return this};Shape.prototype.grow=function(a){return this};Shape.prototype.growDistance=function(a){return this};Shape.prototype.rotate=function(a){return this};Shape.prototype.pushPath=function(a){};Shape.prototype.getCenter=function(){return this.center};Shape.prototype.copyCenter=function(){return new Vec2(this.center)};
Shape.prototype.intersect=function(a){return!1};Shape.prototype.contains=function(a){return!1};Shape.prototype.getRect=function(){return Rect.createFromPoint(this.center)};Shape.prototype.getRadius=function(){return 0};Shape.prototype.perimeter=function(){return 0};Shape.prototype.area=function(){return 0};Shape.prototype.clone=function(){return new Shape(this.center)};Shape.prototype.getCircle=function(){return new Circle(this.center,this.getRadius())};
Shape.prototype.move=function(){this.center.add.apply(this.center,arguments);return this};Shape.prototype.moveTo=function(){this.center.set.apply(this.center,arguments);return this};Shape.prototype.draw=function(a,b,c){a.save();a.beginPath();this.pushPath(a);b&&a.fill();c&&a.stroke();a.closePath();a.restore()};var Circle=function(a,b){Shape.call(this,a);this.radius=b};classExtend(Shape,Circle);Circle.prototype.grow=function(a){this.radius*=a;return this};
Circle.prototype.growDistance=function(a){this.radius+=a};Circle.prototype.pushPath=function(a){a.arc(this.center.x,this.center.y,this.radius,0,2*Math.PI,!1)};Circle.prototype.intersect=function(a){if(a instanceof Circle){var b=Vec2.distance(this.center,a.center);return b<this.radius+a.radius&&this.radius<b+a.radius&&a.radius<b+this.radius}return a.intersect(this)};Circle.prototype.contains=function(a){return Vec2.distance(this.center,a)<this.radius};
Circle.prototype.getRect=function(){return new Rect(this.center.x-this.radius,this.center.y-this.radius,this.center.x+this.radius,this.center.y+this.radius)};Circle.prototype.getRadius=function(){return this.radius};Circle.prototype.getCircle=function(){return new Circle(this.center,this.radius)};Circle.prototype.perimeter=function(){return 2*Math.PI*this.radius};Circle.prototype.area=function(){return Math.pow(this.radius,2)*Math.PI};Circle.prototype.clone=Circle.prototype.getCircle;
var Line=function(a,b){Shape.call(this,(new Vec2(a)).add(b).mul(.5));var c=Vec2.translation(a,b);this.radians=c.getAngle();this.length=c.magnitude()};classExtend(Shape,Line);Line.prototype.grow=function(a){this.length*=a;return this};Line.prototype.growDistance=function(a){this.length+=2*a};Line.prototype.rotate=function(a){this.radians+=a;return this};Line.prototype.mirrorVertically=function(a){Line["super"].mirrorVertically.call(this,a);this.radians=-this.radians;return this};
Line.prototype.mirrorHorizontally=function(a){Line["super"].mirrorHorizontally.call(this,a);this.radians=Math.PI-this.radians;return this};Line.prototype.pushPath=function(a){var b=this.length*Math.cos(this.radians)/2,c=this.length*Math.sin(this.radians)/2;a.moveTo(this.center.x-b,this.center.y-c);a.lineTo(this.center.x+b,this.center.y+c)};Line.prototype.getP0=function(){return(new Vec2(this.center)).add(-(this.length*Math.cos(this.radians))/2,-(this.length*Math.sin(this.radians))/2)};
Line.prototype.getP1=function(){return(new Vec2(this.center)).add(this.length*Math.cos(this.radians)/2,this.length*Math.sin(this.radians)/2)};Line.prototype.setP0=function(a){var b=this.getP1(),b=Vec2.translation(a,b);this.radians=b.getAngle();this.length=b.magnitude();this.center.set(b.mul(.5).add(a));return this};Line.prototype.setP1=function(a){var b=this.getP0();a=Vec2.translation(b,a);this.radians=a.getAngle();this.length=a.magnitude();this.center.set(a.mul(.5).add(b));return this};
Line.prototype.getVect=function(){return new Vec2(this.length*Math.cos(this.radians),this.length*Math.sin(this.radians))};
Line.prototype.intersect=function(a){if(a instanceof Circle){var b=this.getP0(),c=this.getP1();if(a.contains(b))return!a.contains(c);if(a.contains(c))return!a.contains(b);var d=Vec2.translation(b,c),f=Vec2.translation(b,a.center),d=(new Vec2(d)).normalize(),f=(new Vec2(d)).mul(Vec2.dotProd(d,f)).add(b);return f.x>Math.min(b.x,c.x)&&f.x<Math.max(b.x,c.x)&&f.y>Math.min(b.y,c.y)&&f.y<Math.max(b.y,c.y)&&Vec2.distance(f,a.center)<=a.radius}if(a instanceof Line){c=this.getP0();f=this.getP1();b=a.getP0();
a=a.getP1();var d=Vec2.translation(c,b),k=Vec2.translation(f,b),g=Vec2.translation(c,a),l=Vec2.translation(f,a);return Vec2.ccw2(d,g)!=Vec2.ccw2(k,l)?(c=Vec2.translation(c,f),Vec2.translation(b,a),Vec2.ccw2(c,d)!=Vec2.ccw2(c,g)):!1}a.intersect(this)};Line.prototype.contains=function(a){var b=Vec2.translation(this.center,a),c=this.getVect();c.mul(1/c.magnitude());c.mul(Vec2.distance(this.center,a));if(b.equals(c))return!0;c.mul(-1);return b.equals(c)};
Line.prototype.getRect=function(){var a=this.getP1(),b=this.getP0(),c,d,f;b.x<a.x?(c=b.x,f=a.x):(c=a.x,f=b.x);b.y<a.y?(d=b.y,a=a.y):(d=a.y,a=b.y);return new Rect(c,d,f,a)};Line.prototype.getRadius=function(){return this.length/2};Line.prototype.perimeter=function(){return 2*this.length};Line.prototype.clone=function(){return new Line(this.getP0(),this.getP1())};
var Point=function(){switch(arguments.length){case 1:Shape.call(this,arguments[0]);break;case 2:Shape.call(this,new Vec2(arguments[0],arguments[1]));break;default:Shape.call(this,Vec2.ZERO)}};classExtend(Shape,Point);Point.prototype.pushPath=function(a){a.rect(this.center.x,this.center.y,1,1)};Point.prototype.intersect=function(a){return a instanceof Circle?Vec2.distance(a.center,this.center)===a.radius:a instanceof Line?a.contains(this.center):a instanceof Point?a.center.equals(this.center):a.intersect(this)};
Point.prototype.contains=function(a){return this.center.equals(a)};Point.prototype.clone=function(){return new Point(this.center)};var Path=function(a){var b=new Vec2;this.points=[];if(a){exists(a.length)||(a=arguments);var c,d=a.length;for(c=0;c<d;c++)b.add(a[c]);b.mul(1/d);var f;for(c=0;c<d;c++)f=(new Vec2(a[c])).remove(b),this.points.push(f)}Shape.call(this,b)};classExtend(Shape,Path);Path.prototype.grow=function(a){for(var b=this.points.length-1;0<=b;b--)this.points[b].mul(a);return this};
Path.prototype.growDistance=function(a){for(var b,c,d=this.points.length-1;0<=d;d--)c=this.points[d],b=c.magnitude(),c.mul(1/b).mul(b+a);return this};Path.prototype.rotate=function(a){for(var b,c=this.points.length-1;0<=c;c--)b=this.points[c],b.rotate(a);return this};Path.prototype.mirrorVertically=function(a){Path["super"].mirrorVertically.call(this,a);for(var b=this.points.length-1;0<=b;b--)a=this.points[b],a.set(a.getVerticalMirror());return this};
Path.prototype.mirrorHorizontally=function(a){Path["super"].mirrorHorizontally.call(this,a);for(var b=this.points.length-1;0<=b;b--)a=this.points[b],a.set(a.getHorizontalMirror());return this};Path.prototype.pushPath=function(a){a.translate(this.center.x,this.center.y);a.moveTo(this.points[0].x,this.points[0].y);for(var b=this.points.length,c=1;c<b;c++)a.lineTo(this.points[c].x,this.points[c].y);this.closed&&a.closePath()};
Path.prototype.getLines=function(){for(var a=[],b=this.points.length-1,c=0;c<b;c++)a.push((new Line(this.points[c],this.points[c+1])).move(this.center));this.closed&&a.push((new Line(this.points[b],this.points[0])).move(this.center));return a};
Path.prototype.intersect=function(a){var b=this.getLines(),c,d=!1;if(a instanceof Path){a=a.getLines();var f=a.length,k,g;for(c=b.length-1;0<=c;c--){k=b[c];for(g=0;g<f;g++)if(a[g].intersect(k)){d=!0;break}if(d)break}}else for(c=b.length-1;0<=c;c--)if(b[c].intersect(a)){d=!0;break}return d};
Path.prototype.getIntersectionLine=function(a){var b=this.getLines(),c,d=!1;if(a instanceof Path){a=a.getLines();var f=a.length,k,g;for(c=b.length-1;0<=c;c--){k=b[c];for(g=0;g<f;g++)if(a[g].intersect(k)){d=k;break}if(d)break}}else for(c=b.length-1;0<=c;c--)if(b[c].intersect(a)){d=b[c];break}return d};
Path.prototype.contains=function(a){var b=this.getRect(),c=b.width()+10,b=b.height()+10,d=new Vec2(a);a=[new Line(a,d.add(c,0)),new Line(a,d.add(-2*c,0)),new Line(a,d.add(c,b)),new Line(a,d.add(0,-2*b))];return this.intersect(a[0])&&this.intersect(a[1])&&this.intersect(a[2])&&this.intersect(a[3])};
Path.prototype.getRect=function(){for(var a=0,b=0,c=0,d=0,f,k=this.points.length-1;0<=k;k--)f=this.points[k],f.x<a?a=f.x:f.x>c&&(c=f.x),f.y<b?b=f.y:f.y>d&&(d=f.y);a=new Rect(a,b,c,d);a.move(this.center);return a};Path.prototype.getRadius=function(){for(var a=0,b,c=this.points.length-1;0<=c;c--)b=this.points[c].squareMagnitude(),b>a&&(a=b);return Math.sqrt(a)};
Path.prototype.redefineCenter=function(a){var b=this.points.length,c;if(a)for(a=(new Vec2(a)).mul(-1),c=0;c<b;c++)this.points[c].move(a);else{a=new Vec2;for(c=0;c<b;c++)a.add(this.points[c]);a.mul(1/b);this.center.set(a)}};Path.prototype.perimeter=function(){for(var a=0,b=this.points.length-1,c=b-1;0<c;c--)a+=Vec2.distance(this.points[c],this.points[c-1]);this.closed&&(a+=Vec2.distance(this.points[b-1],this.points[0]));return a};
Path.prototype.area=function(){for(var a=0,b=this.points.length,c=this.points[b-1],d,f=0;f<b;f++)d=this.points[f],a+=(c.x+d.x)*(c.y-d.y),c=d;return a/2};Path.prototype.clone=function(){var a=new Path;a.center.set(this.center);a.points=[];for(var b=this.points.length-1;0<=b;b--)a.points.push(new Vec2(this.points[b]));this.closed&&(a.closed=!0);return a};var Polygon=function(a){Path.call(this,a)};classExtend(Path,Polygon);Polygon.prototype.closed=!0;
Polygon.createRectangle=function(a,b,c){var d=a.x-b/2;a=a.y-c/2;return new Polygon([{x:d,y:a},{x:d+b,y:a},{x:d+b,y:a+c},{x:d,y:a+c}])};var RegularPolygon=function(a,b,c,d){var f=2*Math.PI/c;this.center=new Vec2(a);this.points=Array(c);if(exists(b.length))for(a=0;a<c;a++)this.points[a]=Vec2.createFromRadians(d).mul(b[a%b.length]),d+=f;else for(a=0;a<c;a++)this.points[a]=Vec2.createFromRadians(d).mul(b),d+=f;this.closed=!0};classExtend(Polygon,RegularPolygon);
var Ray=function(a,b){Shape.call(this,a);this.radians=b};classExtend(Shape,Ray);Ray.prototype.rotate=function(a){this.radians+=a;return this};Ray.prototype.mirrorVertically=function(a){Ray["super"].mirrorVertically.call(this,a);this.radians=-this.radians;return this};Ray.prototype.mirrorHorizontally=function(a){Ray["super"].mirrorHorizontally.call(this,a);this.radians=Math.PI-this.radians};
Ray.prototype.endPoint=function(a){var b=new Vec2(this.center);b.add(Math.cos(this.radians)*a,Math.sin(this.radians)*a);return b};Ray.prototype.pushPath=function(a){var b=this.endPoint(a.canvas.clientWidth+a.canvas.clientHeight);a.moveTo(this.center.x,this.center.y);a.lineTo(b.x,b.y)};Ray.prototype.intersect=function(a){var b=a.getRect();return(new Line(this.center,this.endPoint(Vec2.distance(this.center,a.center)+b.width()+b.height()))).intersect(a)};
Ray.prototype.contains=function(a){return(new Line(this.center,this.endPoint(Vec2.distance(this.center,a)))).contains(a)};Ray.prototype.getRect=function(){var a=this.endPoint(Number.MAX_SAFE_INTEGER);return new Rect(Math.min(a.x,this.center.x),Math.min(a.y,this.center.y),Math.max(a.x,this.center.x),Math.max(a.y,this.center.y))};Ray.prototype.getRadius=function(){return Number.MAX_SAFE_INTEGER};Ray.prototype.perimeter=function(){return Number.MAX_SAFE_INTEGER};
Ray.prototype.clone=function(){return new Ray(this.center,this.radians)};