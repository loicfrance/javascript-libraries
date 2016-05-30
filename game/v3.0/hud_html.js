
(function(){
  Game.html = {};
  var proto = Object.create(HTMLDivElement.prototype);
  proto.show = function() {
    this.style.visibility = 'visible';
  };
  proto.hide = function() {
    this.style.visibility = 'hidden';
  };
  Game.html.hud = document.registerElement('game-hud', {
    prototype: proto, extends: 'div'
  });
})();