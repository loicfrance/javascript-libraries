Game.board = {};
Game.board.Map = (function(){
  /**
   * Use this map instead of the standard map if you want a map
   * with some usefull functions to make a board game.
   * For example, to get the center of the case (5, 3), you can call the function
   * 'map.getCasePosition(5, 3)', supposing the top-left case is the case (0, 0)
   * 
   * This standard board map suppose that your cases are square-shaped,
   * but you can modify the functions in order to have hexagonal cases, for example.
   */
  var parent = Game.Map;
  class Map extends Game.Map {
    constructor( canvas, width, height, horizontalCases, verticalCases ) {
      super(canvas, width, height);
      this.horizontalCases = horizontalCases;
      this.verticalCases = verticalCases;
      this.boardMarginLeft  = this.boardMarginTop = 0;
      this.boardMarginRight = this.boardMarginBottom = 0;
    }
//---------- map dimensions part ----------
    getHorizontalCases() { return this.horizontalCases; }
    getVerticalCases() { return this.verticalCases; }
    setHorizontalCases( hCases ) { this.horizontalCases = hCases; }
    setVerticalCases( vCases ) { this.verticalCases = vCases; }
    getBoardMarginLeft() { return this.boardMarginLeft; }
    getBoardMarginTop() { return this.boardMarginTop; }
    getBoardMarginRight() { return this.boardMarginRight; }
    getBoardMarginBottom() { return this.boardMarginBottom; }
    setBoardMarginLeft( mLeft ) { this.boardMarginLeft = mLeft; }
    setBoardMarginTop( mTop ) { this.boardMarginTop = mTop; }
    setBoardMarginRight( mRight ) { this.boardMarginRight = mRight; }
    setBoardMarginBottom( mBottom ) { this.boardMarginBottom = mBottom; }
    getBoardRect() {
      return this.getGameRect().clone().addMargins(-this.getBoardMarginLeft(),
          -this.getBoardMarginTop(), -this.getBoardMarginRight(), -this.getBoardMarginBottom());
    }
    getCaseWidth( boardRect ) { return boardRect.width/this.getHorizontalCases(); }
    getCaseHeight( boardRect ) { return boardRect.height/this.getVerticalCases(); }
    getCasePosition( boardRect, caseX, caseY ) {
      var caseW = this.getCaseWidth(boardRect),
          caseH = this.getCaseHeight(boardRect);
      return new Vec2(boardRect.left + caseW*(caseX+0.5), boardRect.top + caseH*(caseY+0.5));
    }
    getCaseXY( boardRect, gamePos ) {
      var caseW = this.getCaseWidth(boardRect),
          caseH = this.getCaseHeight(boardRect);
      return new Vec2(Math.floor((gamePos.x-boardRect.left)/caseW),
                      Math.floor((gamePos.y-boardRect.top)/caseH));
    }
    getCaseShape( boardRect, caseX, caseY ) {
      return this.getCaseRect(boardRect, caseX, caseY).getShape();
    }
    getCaseRect( boardRect, caseX, caseY ) {
      var caseW = this.getCaseWidth(boardRect),
          caseH = this.getCaseHeight(boardRect);
      var left = boardRect.left + caseW*caseX, top = boardRect.top + caseH*caseY;
      return new Rect(left, top, left+caseW, top+caseH);
    }
// ---------- debug part ----------
    renderDebug( context ) {
      var rect = this.getBoardRect();
      context.strokeStyle = '#F00';
      rect.draw(context, false, true);
      var i=this.getHorizontalCases();
      var caseW = this.getCaseWidth(rect);
      var caseH = this.getCaseHeight(rect);
      var x = rect.left;
      var y = rect.top;
      context.beginPath();
      rect.pushPath(context);
      while(--i>0) {
        x += caseW;
        context.moveTo(x, rect.top);
        context.lineTo(x, rect.bottom);
      }
      i=this.getVerticalCases();
      while(i-->0) {
        y += caseH;
        context.moveTo(rect.left, y);
        context.lineTo(rect.right, y);
      }
      context.closePath();
      context.stroke();
    }
    showMouseOverInfos( gameManager, objects, ctx ) {
      super.showMouseOverInfos(gameManager, objects, ctx);
      if(this.debug) {
        var pos = this.getPointerPosition();
        var rect = this.getBoardRect();
        if(rect.contains(pos)) {
          ctx.strokeStyle = '#00F';
          ctx.lineWidth *=2;
          var caseXY = this.getCaseXY(rect, pos);
          ctx.beginPath();
          this.getCaseShape(rect, caseXY.x, caseXY.y).pushPath(ctx);
          (new Line(this.getCasePosition(rect, caseXY.x, caseXY.y), pos)).pushPath(ctx);
          ctx.closePath();
          ctx.stroke();
          ctx.lineWidth /= 2;
          var objs = this.getObjectsAtCase(rect, objects, caseXY.x, caseXY.y);
          if(objs.length) {
            objs[0].renderMouseOver(ctx, pos, gameManager, this.debug);
          }
        }
      }
    }
//---------- map occupation part ----------
    getBoardObjects( gameManager ) {
      return gameManager.getObjects(Map.boardObjectFilter);
    }
    getObjectsAtCase( boardRect, objects, caseX, caseY ) {
      var i=objects.length, obj, objX, objY, occupMat, width, height, caseI, caseJ;
      var result = [];
      while(i--) { obj = objects[i]; occupMat = obj.boardOccupationMatrix;
        if(!occupMat) continue;
        objX = obj.getCaseX();
        objY = obj.getCaseY();
        height = occupMat.length;
        caseJ = Math.floor(height/2)+caseY-objY;
        if(caseJ >= 0 && caseJ < height) {
          width=occupMat[caseJ].length;
          caseI = Math.floor(width/2)+caseX-objX;
          if(caseI >= 0 && caseI < width && (+occupMat[caseJ][caseI]))
            result.push(obj);
        }
        
      }
      return result;
    }
    getNativeOccupationMap() {
      var h=this.getVerticalCases(), w = this.getHorizontalCases();
      var map = new Array(h), i=h, j;
      while(i--) {
        map[i] = new Array(w);
        j=w;
        while(j--) map[i][j]=0;
      }
      return map;
    }
    getOccupationMap( objects ) {
      var map = this.getNativeOccupationMap();
      var i=objects.length;
      while(i--) objects[i].addOccupationToMap(map);
      return map;
    }
  //---------- path-finding part ----------
    getDistanceMap( occupationMap, x, y ) {
      var h = occupationMap.length, w = occupationMap[0].length,
          i, j, minI=y, maxI=y, minJ=x, maxJ=x,next,
          ok=false, res = new Array(h);
      for(i=0; i<h; i++) {
        res[i] = new Array(w);
        for(j=0; j<w; j++) {
          res[i][j] = -1;
        }
      }
      res[y][x] = 0;
      while(!ok) {
        ok= true;
        for(i=minI; i<=maxI; i++) {
          for(j=minJ; j<=maxJ; j++) {
            if(res[i][j]>=0) {
              next = res[i][j]+1;
              if(i>0   && (res[i-1][j]==-1|| res[i-1][j]>next) && !occupationMap[i-1][j]) {
                res[i-1][j] = next; if(i==minI) minI--; ok = false; }
              if(i<h-1 && res[i+1][j]==-1 && !occupationMap[i+1][j]) {
                res[i+1][j] = next; if(i==maxI) maxI++; ok = false; }
              if(j>0   && res[i][j-1]==-1 && !occupationMap[i][j-1]) {
                res[i][j-1] = next; if(j==minJ) minJ--; ok = false; }
              if(j<w-1 && res[i][j+1]==-1 && !occupationMap[i][j+1]) {
                res[i][j+1] = next; if(j==maxJ) maxJ++; ok = false; }
      } } } }
      return res;
    }
    getPath( distanceMapFromTarget, xi, yi, xf, yf ) {
      let dMap = distanceMapFromTarget,
          result = [], x=xi, y=yi, min, minX=x, minY=y, w=dMap[0].length, h=dMap.length,
          point = new Vec2(xf, yf), dist = Vec2.squareDistance(new Vec2(x,y),point);
      let setNew=(x,y)=> {
            min=dMap[y][x]; minX = x; minY = y;
            dist = Vec2.squareDistance(new Vec2(x,y),point);
          }, compareDist=(x, y)=>dMap[y][x]<min||
            (dMap[y][x]==min&&Vec2.squareDistance(new Vec2(x, y), point) < dist);
      
      while(dMap[y][x]) {
        min = dMap[y][x]==-1 ? Number.MAX_SAFE_INTEGER : dMap[y][x];
        if(x>0 && dMap[y][x-1]!=-1 && compareDist(x-1, y))
          setNew(x-1, y);
        if(x<w-1 && dMap[y][x+1]!=-1 && compareDist(x+1, y))
          setNew(x+1, y);
        if(y>0 && dMap[y-1][x]!=-1 && compareDist(x, y-1))
          setNew(x, y-1);
        if(y<h-1 && dMap[y+1][x]!=-1 && compareDist(x, y+1))
          setNew(x, y+1);
        if(minX != x || minY != y) {
          x = minX;
          y = minY;
          result.push(x, y);
        } else break;
      }
      return result;
    }
    findPath( gameManager, xi, yi, xf, yf ) {
      return this.getPath(this.getDistanceMap(
              this.getOccupationMap(this.getBoardObjects(gameManager)),
              xf, yf), xi, yi, xf, yf);
    }
  }
  Map.boardObjectFilter = obj => obj.addOccupationToMap;
  return Map;
})();

