/**
 * author : Loic France
 * created 05/31/2016
 */
Game.hud.views.Layout = (function(){
  class Layout extends Game.hud.views.View {
    constructor() {
      this.children = [];
      this.currentView = null;
      this.rect = new Rect(0,0,Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
      this.setState(Game.hud.views.STATE.NONE);
    }
    addView( view, layoutParams=null ) {
      if(layoutParams) view.layoutParams = layoutParams;
      else if(!view.layoutParams) view.layoutParams = this.getDefaultLayoutParams();
      this.children.push(view);
    }
    getDefaultLayoutParams() {
      return {};
    }
    onTouchEvent( evt ) {
      if(evt.description <= Game.hud.views.EVENT_DESC.EXIT)
        return this.mouseMove(evt);
      else if(!isNull(currentView)){
        return currentView.onTouchEvent(evt);
      }
    }
    updateRect( rect ) {
      this.getParentView().updateRect(rect);
    }
    mouseMove( evt ){
      let rect, view, done=false, i=this.views.length, pos = evt.position;
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
    }
    render( context2d ) {
      super.render(context2d);
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
    }
    getIndexOf( view ) { return this.children.indexOf(view); }
    getChild( index ) { return this.children[index]; }
    getChildPosition( view ) { return view.getPosition(); }
    getChildRect( view ) { return view.getRect(); }
  }
  return Layout;
});
Game.hud.views.LinearLayout = (function() {
  class LinearLayout extends Game.hud.views.Layout {
    constructor( horizontal=false, rtl=false ) {
      this.horizontal = horizontal;
      this.rtl = rtl;
    }
    getChildPosition( view ){
      let index = this.getIndexOf(view);
      var result = this.getChild(index).getPosition().clone();//.add(layout coords);
      if(index>0) result.addXY(0,this.getChildRect(this.getChild(index-1)).bottom);
      return result;
    }
    getChildRect( view ){
      var result = super.getChildRect(view);
      let index = this.getIndexOf(view);
      if(index>0) {
        var previous = this.getChildRect(this.getChild(index-1));
        if(this.horizontal) result.moveXY(rtl?-previous.left : previous.right, 0);
        else result.moveXY(0, rtl?-previous.top: previous.bottom);
      }
      else if(rtl) {
        if(this.horizontal) result.moveXY(this.getRect().width()-result.width(), 0);
        else result.moveXY(0, this.getRect().height()-result.height());
      }
      return result;
    }
  }
  return LinearLayout;
})();