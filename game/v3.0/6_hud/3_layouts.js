/**
 * author : Loic France
 * created 05/31/2016
 */
Game.hud.views.Layout = (function(){
  var parent = views.View;
  var Layout = function() {
    this.children = [];
    this.currentView = null;
    this.rect = new Rect(0,0,Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
    this.setState(Game.hud.views.STATE.NONE);
  };
  Layout.prototype.addView = function(view, layoutParams) {
    view.layoutParams = layoutParams;
    this.addView(view);
  };
  Layout.prototype.addView = function(view) {
    if(!view.layoutRule) view.layoutParams = this.getDefaultLayoutParams();
    this.children.push(view);
  };
  Layout.prototype.getDefaultLayoutParams = function() {
    return {};
  };
  Layout.prototype.onTouchEvent = function(evt) {
    if(evt.description <= Game.hud.views.EVENT_DESC.EXIT)
      return this.mouseMove(evt);
    else if(!isNull(currentView)){
      return currentView.onTouchEvent(evt);
    }
  };
  Layout.prototype.updateRect = function(rect) {
    this.getParentView().updateRect(rect);
  };
  Layout.mouseMove = function(evt){
    var rect, view, done=false, i=this.views.length, pos = evt.position;
    while(i--) {
      view = this.views[i];
      if(done && view != currentView) continue;
      if(view.state & Game.hud.views.STATE.INACTIVE) continue;
      rect = view.getRect();
      evt.position.set(pos).addXY(-rect.left, -rect.top);
      if(done && view == currentView) { currentView.onTouchEvent(evt); break; }
      if(view.onTouchEvent(evt)) {
        if(isNull(currentView)) { currentView = view; break; }
        done = true; evt.description = Game.hud.views.EVENT_DESC.EXIT;
      }
    }
  };
  var render = override(Layout, 'render',function(context2d) {
    render.call(this, context2d);
    context2d.save();
    context2d.translate(this.rect.left, this.rect.top);
    var r = this.getRect();
    context2d.rect(0, 0, r.width(), r.height());
    context2d.clip();
    var len=this.children.length, delta, view;
    for(var i=0; i<len; i++) {
      view = this.children[i];
      delta = new Vec2(this.getChildPosition(view)).remove(view.getPosition());
      if(!delta.isZero()) {
        context2d.save();
        context2d.translate(delta.x, delta.y);
        view.render(context2d);
        context2d.restore();
      }
      else view.render(context2d);
    }
  });
  Layout.prototype.getIndexOf = function(view) {
    return this.children.indexOf(view);
  };
  Layout.prototype.getChild = function(index) {
    return this.children[index];
  };
  Layout.prototype.getChildPosition = function(view/*| index*/) {
    return typeof view != TYPE_NUMBER ? view.getPosition :
                        this.getChildPosition(this.getChild(view));
  };
  Layout.prototype.getChildRect = function(view) {
    return typeof view != TYPE_NUMBER ? view.getRect() : this.getChild(view).getRect();
  };
  return Layout;
});
Game.hud.views.LinearLayout = (function() {
  var parent = Game.hud.views.Layout;
  var LinearLayout = function(horizontal, rtl) {
    this.horizontal = horizontal;
    this.rtl = rtl;
  };
  var getChildPosition = override(LinearLayout, 'getPosition',function(index){
    if(typeof index != TYPE_NUMBER) index = this.getIndexOf(index);
    var result = this.getChild(index).getPosition().clone();//.add(layout coords);
    if(index>0) result.addXY(0,this.getChildRect(index-1).bottom);
    return result;
  });
  var getChildRect = override(LinearLayout, 'getRect', function(index){
    if(typeof index != TYPE_NUMBER) index = this.getIndexOf(index);
    var result = getChildAt(index).getRect();
    if(index>0) {
      var previous = this.getChildRect(index-1);
      if(this.horizontal) result.moveXY(rtl?-previous.left : previous.right, 0);
      else result.moveXY(0, rtl?-previous.top: previous.bottom);
    }
    else if(rtl) {
      if(this.horizontal) result.moveXY(this.getRect().width()-result.width(), 0);
      else result.moveXY(0, this.getRect().height()-result.height());
    }
    return result;
  });
  return LinearLayout;
})();