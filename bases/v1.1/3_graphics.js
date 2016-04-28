var Gravity = {
  LEFT   : 1,
  TOP    : 2,
  RIGHT  : 4,
  BOTTOM : 8,
  CENTER : 16,
  getRect: ( gravity, availableRect, width, height, margin /* | marginX*/, marginY )=> {
    if(exists(margin)){
      if(!exists(marginY)) marginY = margin;
      availableRect = availableRect.clone().addMargin(-margin, -marginY);
    }
    if((gravity & Gravity.CENTER)===0) {
      if(gravity === 0) gravity = Gravity.LEFT | Gravity.TOP;
      else {
        if((gravity & Gravity.LEFT)===0 && (gravity & Gravity.RIGHT)===0)
          gravity |= Gravity.LEFT;
        if((gravity & Gravity.TOP)===0 && (gravity & Gravity.BOTTOM)===0)
          gravity |= Gravity.TOP;
      }
    }
    var left, top, right, bottom;
    if(gravity & Gravity.CENTER  !== 0) {
      left   = availableRect.left   + (availableRect.width ()-width)/2;
      top    = availableRect.top    + (availableRect.height()-height)/2;
      right  = availableRect.right  - (availableRect.width ()-width)/2;
      bottom = availableRect.bottom - (availableRect.height()-height)/2;
    }
    if(gravity & Gravity.LEFT   !== 0) left = availableRect.left;
    if(gravity & Gravity.TOP    !== 0) top = availableRect.top;
    if(gravity & Gravity.RIGHT  !== 0) right = availableRect.right;
    if(gravity & Gravity.BOTTOM !== 0) bottom = availableRect.right;
         if(!exists(left  )) left  = right - width ;
    else if(!exists(right )) right = left  + width ;
         if(!exists(top   )) top   = bottom- height;
    else if(!exists(bottom)) bottom= top   + height;
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
  CanvasRenderingContext2D.prototype.wrapText = function( text, rect, lineHeight, textGravity ) {
    var paragraphs = text.split('\n');
    var parLen = paragraphs.length;
    var lines = [], line='';
    var linesX = [], lineX=0;
    var words, len;
    var testLine;
    var metrics;
    var width=0; var rectWidth = rect.width();
    var n;
    for(var i=0; i<parLen; i++) {
      words = paragraphs[i].split(' ');
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
      this.strokeText(lines[n], linesX[n], y);
      y += lineHeight;
    }
  };
}