/**
 * author : Loic France
 * created 05/31/2016
 */
var Gravity = {
  LEFT   : 1,
  TOP    : 2,
  RIGHT  : 4,
  BOTTOM : 8,
  CENTER : 16,
  getRect: ( gravity, availableRect, width, height, marginX, marginY )=> {
    if(!exists(marginX)) {
      console.deprecated('Gravity.getRect(g,r,w,h)');
      marginX = marginY = 0;
    }
    else if(!exists(marginY)) {
      console.deprecated('Gravity.getRect(g,r,w,h,m)');
      marginY = marginX;
    }
    availableRect = availableRect.copy().addMarginsXY(-marginX, -marginY);
    if(!(gravity & Gravity.CENTER)) {
      if(gravity) {
        if(!(gravity & Gravity.LEFT) && !(gravity & Gravity.RIGHT))
          gravity |= Gravity.LEFT;
        if(!(gravity & Gravity.TOP) && (gravity & Gravity.BOTTOM))
          gravity |= Gravity.TOP;
      }
      else gravity = Gravity.LEFT | Gravity.TOP;
    }
    var left=NaN, top=NaN, right=NaN, bottom=NaN;
    if(gravity & Gravity.CENTER) {
      left   = availableRect.left   + (availableRect.width ()-width)/2;
      top    = availableRect.top    + (availableRect.height()-height)/2;
      right  = availableRect.right  - (availableRect.width ()-width)/2;
      bottom = availableRect.bottom - (availableRect.height()-height)/2;
    }
    if(gravity & Gravity.LEFT   !== 0) left = availableRect.left;
    if(gravity & Gravity.TOP    !== 0) top = availableRect.top;
    if(gravity & Gravity.RIGHT  !== 0) right = availableRect.right;
    if(gravity & Gravity.BOTTOM !== 0) bottom = availableRect.right;
         if(isNaN(left  )) left   = right  - width ;
    else if(isNaN(right )) right  = left   + width ;
         if(isNaN(top   )) top    = bottom - height;
    else if(isNaN(bottom)) bottom = top    + height;
    return new Rect(left, top, right, bottom);
  },
  getHorizontalGravity: function(g, defaultG) {
    return (g&Gravity.LEFT)? Gravity.LEFT : (g&Gravity.RIGHT)? Gravity.RIGHT :
           (g&Gravity.CENTER)? Gravity.CENTER :
           defaultG? defaultG : Gravity.LEFT;
  },
  getVerticalGravity: function(g, defaultG) {
    return (g&Gravity.TOP)? Gravity.TOP : (g&Gravity.BOTTOM)? Gravity.BOTTOM :
           (g&Gravity.CENTER)? Gravity.CENTER :
           defaultG? defaultG : Gravity.TOP;
  }
};

if(!CanvasRenderingContext2D.prototype.wrapText) {
  CanvasRenderingContext2D.prototype.wrapText = function( text, rect, lineHeight, textGravity, fill, stroke ) {
    var paragraphs = text.split('\n');
    var parLen = paragraphs.length;
    var lines = [], line;
    var linesX = [], lineX=0;
    var words, len;
    var testLine;
    var metrics;
    var width=0; var rectWidth = rect.width();
    var n;
    for(var i=0; i<parLen; i++) {
      words = paragraphs[i].split(' ');
      line='';
      len = words.length;
      for(n = 0; n < len; n++) {
        testLine = line + words[n];
        metrics = this.measureText(testLine);
        width = metrics.width;
        if (width > rectWidth && n > 0) {
          lineX = rect.left;
          if(!(textGravity & Gravity.LEFT)) {
            metrics = this.measureText(line);
            width = metrics.width;
            if(textGravity & Gravity.RIGHT) lineX += rectWidth-width;
            else lineX += (rectWidth-width)/2;
          }
          lines.push(line);
          line = words[n] + ' ';
          linesX.push(lineX);
        }
        else {
          line = testLine + ' ';
        }
      }
      lineX = rect.left;
      if(!(textGravity & Gravity.LEFT)) {
        metrics = this.measureText(line);
        width = metrics.width;
        if(textGravity & Gravity.RIGHT) lineX += rectWidth-width;
        else lineX += (rectWidth-width)/2;
      }
      lines.push(line);
      linesX.push(lineX);
    }
    len = lines.length;
    var y = rect.top+lineHeight/2;
    if(!(textGravity & Gravity.TOP)) {
      var h = lineHeight*len;
      if(textGravity & Gravity.BOTTOM) y += rect.height()-h;
      else y += (rect.height()-h)/2;
    }
    for(n=0; n<len; n++) {
      if(fill)   this.fillText  (lines[n], linesX[n], y);
      if(stroke) this.strokeText(lines[n], linesX[n], y);
      y += lineHeight;
    }
  };
}