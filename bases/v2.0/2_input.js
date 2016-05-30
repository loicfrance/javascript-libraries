
var KEY = {
  State: {UP:0, DOWN:1},
  BACK_SPACE:8, TAB:9,
  ENTER:13,
  MAJ:16, CTRL:17, ALT:18, VERR_MAJ:20,
  ESCAPE:27,
  SPACE:32, PAGE_UP:33, PAGE_DOWN:34, END:35, BEGINNING:36,
  LEFT:37, UP:38, RIGHT:39, DOWN:40,
  PRINT_SCR:44, INSERT:45, SUPPR:46,
  ZERO:48, ONE:49, TWO:50, THREE:51, FOUR:52,
  FIVE:53, SIX:54, SEVEN:55, EIGHT:56, NINE:57,
  A:65, B:66, C:67, D:68, E:69, F:70, G:71, H:72, I:73, J:74, K:75, L:76, M:77,
  N:78, O:79, P:80, Q:81, R:82, S:83, T:84, U:85, V:86, W:87, X:88, Y:89, Z:90,
  NUM_0:96, NUM_1:97, NUM_2:98, NUM_3:99, NUM_4:100,
  NUM_5:101, NUM_6:102, NUM_7:103, NUM_8:104, NUM_9:105,
  F1:112, F2:113, F3:114, F4:115, F5:116, F6:117,
  F7:118, F8:119, F9:120, F10:121, F11:122, F12:123,
  VERR_NUM:144,
  FN:255
};
var Input = {};
(function(){
//______________________________________________________________________________
// - - - - - - - - - - - - - - - - - VARIABLES - - - - - - - - - - - - - - - - -
//******************************************************************************
  var keyboardInit = false;
  var onKeyUp, onKeyDown;
  var keyboardListeners;
  var keyState = new Array(256);
  for(var i=1; i< keyState.length; i++) {
    keyState[i] = KEY.State.UP;
  }
//______________________________________________________________________________
// - - - - - - - - - - - - - - - PRIVATE FUNCTIONS - - - - - - - - - - - - - - -
//******************************************************************************
  var InitKeyboard = _ => {
    keyboardInit = true;
    keyboardListeners = [];
    onKeyDown = function( event ) {
      if(!keyState[event.keyCode]) {
        keyState[event.keyCode] = true;
        keyboardListeners.forEach(function( listener ) {
          listener.onKeyDown(event.keyCode);
        });
      }
    };
    onKeyUp = function( event ) {
      if(keyState[event.keyCode]) {
        keyState[event.keyCode] = false;
        keyboardListeners.forEach(function( listener ) {
          listener.onKeyUp(event.keyCode);
        });
      }
    };
    document.addEventListener( 'keydown', onKeyDown, false );
		document.addEventListener( 'keyup', onKeyUp, false );
  };
  
  var fixMouseWhich = event => {
    if(!event.which && e.button) {
      if(event.button & 1) event.which = 1; //left
      if(event.button & 4) event.which = 2; //middle
      if(event.button & 2) event.which = 3; //right
    }
  };
  var getVec = ( element, event )=> new Vec2(event.pageX - element.offsetLeft,
                                             event.pageY - element.offsetTop);
                                               
  Input.KeyState = { UP : 0, DOWN : 0 };
  
//______________________________________________________________________________
// - - - - - - - - - - - - - - - PUBLIC FUNCTIONS- - - - - - - - - - - - - - - -
//******************************************************************************
/**
 * @param listener {function( keyCode{integer}, down{boolean} )} a function
 * called when a key is pressed (down=true) or released(down=false),
 * with the given keyCode.
 * Use removeKeyListener( listener ) to remove this listener from the keyListeners.
 */
    Input.addKeyListener = listener => {
      if( !keyboardInit ) InitKeyboard();
      keyboardListeners.push( listener );
    };
/**
 * @param listener {function( keyCode{integer}, down{boolean} )}
 * the function used with addKeyListener();
 */
    Input.removeKeyListener = listener => {
      if( keyboardInit ) keyboardListeners.remove( listener );
    };
    Input.getKeyState = function( keyCode ) {
      return keyState[keyCode];
    };
    
    Input.addFocusListener = ( element, listener ) => {
      element.onfocus = function() {
        listener(true);
      };
      element.onblur = function() {
        listener(false);
      };
    };
    Input.removeFocusListener = element => {
      delete element.onfocus;
      delete element.onblur;
    };

    Input.MOUSE_UP = 0; Input.MOUSE_DOWN = 1; Input.MOUSE_CLICK = 2; Input.MOUSE_DBCLICK = 3;
    Input.MOUSE_CONTEXT_MENU = 4;
    Input.addMouseBtnListener = function( element, listener ) {
      element.onclick = event=> { if(listener.onClick) {
        fixMouseWhich(event);
        listener.onClick(event.which, getVec(element, event));
      } };
      element.onmousedown = event=> { if(listener.onMouseDown) {
        fixMouseWhich(event);
        listener.onMouseDown(event.which, getVec(element, event));
      } };
      element.onmouseup = event => { if(listener.onMouseUp) {
        fixMouseWhich(event);
        listener.onMouseUp(event.which, getVec(element, event));
      } };
      element.onrightclick = event => { if(listener.onContextMenu) {
        fixMouseWhich(event);
        return listener.onContextMenu(getVec(element, event));
      } };
      element.ondbclick = event => { if(listener.onDoubleClick) {
        fixMouseWhich(event);
        listener.onDoubleClick(event.which, getVec(element, event));
      } };
    };
    Input.removeMouseBtnListener = element => {
      delete element.onclick;
      delete element.onmousedown; delete element.onmouseup;
      delete element.onrightclick; delete element.ondbclick;
    };
    Input.MOUSE_EXIT = 5; Input.MOUSE_ENTER = 6; Input.MOUSE_MOVE = 7;
    Input.addMouseMoveListener = ( element, listener ) => {
      element.onmousemove = function( event ) { if(listener.onMouseMove)
        listener.onMouseMove(getVec(element, event)); };
      element.onmouseover = function( event ) { if(listener.onMouseEnter)
        listener.onMouseEnter(getVec(element, event)); };
      element.onmouseout  = function( event ) { if(listener.onMouseExit)
        listener.onMouseExit(getVec(element, event)); };
    };
    Input.removeMouseMoveListener = element => {
      delete element.onmousemove;
      delete element.onmouseover; delete element.onmouseout;
    };
    Input.pointerLock = ( element, eventListener ) => {
      if(!isNull(eventListener)) {
        if(!isNull(eventListener.pointerLockChange)) {
          document.addEventListener('pointerlockchange', eventListener.pointerLockChange, false);
          document.addEventListener('mozpointerlockchange', eventListener.pointerLockChange, false);
          document.addEventListener('webkitpointerlockchange', eventListener.pointerLockChange, false);
        }
        if(!isNull(eventListener.pointerLockError)) {
          document.addEventListener('pointerlockerror', eventListener.pointerLockError, false);
          document.addEventListener('mozpointerlockerror', eventListener.pointerLockError, false);
          document.addEventListener('webkitpointerlockerror', eventListener.pointerLockError, false);
        }
      }
      if (document.webkitFullscreenElement === elem ||
          document.mozFullscreenElement === elem ||
          document.mozFullScreenElement === elem) {
        elem.requestPointerLock = elem.requestPointerLock    ||
                                  elem.mozRequestPointerLock ||
                                  elem.webkitRequestPointerLock;
        elem.requestPointerLock();
      }
    };
    Input.fullScreen = ( element, eventListener ) => {
      elem.requestFullscreen = elem.requestFullscreen    ||
                           elem.mozRequestFullscreen ||
                           elem.mozRequestFullScreen || // Le caractère 'S' majuscule de l'ancienne API.
                           elem.webkitRequestFullscreen;
      elem.requestFullscreen();
      if(!isNull(eventListener) && !isNull(eventListener.fullScreenChange)) {
        document.addEventListener('fullscreenchange', eventListener.fullscreenChange, false);
        document.addEventListener('mozfullscreenchange', eventListener.fullscreenChange, false);
        document.addEventListener('webkitfullscreenchange', eventListener.fullscreenChange, false);
      }
    };
})();
var KeyMap = function() {
  var instance = this;
  var keys = [];
  var actions = [];
  var listeners = [];
  var keyListener = {
    onKeyUp: keyCode => {
      var a = instance.getAction(keyCode);
      if(a) listeners.forEach(function( l ) {
        if(l.thisArg) l.onUp.bind(l.thisArg, a);
        else l.onUp(a);
      });
    },
    onKeyDown: keyCode => {
      var a = instance.getAction(keyCode);
      if(a) listeners.forEach(function( l ) {
        if(l.thisArg) l.onDown.bind(l.thisArg, a);
        else l.onDown(a);
      });
    }
  };
  this.setAction = function( keyCode, action ) {
    if(keyCode.length) {
      for(var i=0; i< keyCode.length; i++) {
        this.setAction(keyCode[i], action);
      }
    }
    else {
      var index = keys.indexOf(keyCode);
      if(index !== -1) {
        if(action === null) keys.splice(index, 1);
        else actions[index] = action;
      }
      else if (action !== null){
        keys.push(keyCode);
        actions.push(action);
      }
    }
  };
  this.getAction = keyCode => {
    var index = keys.indexOf(keyCode);
    if(index != -1) return actions[index];
  };
  this.getKeyState = function( action ) {
    var keyCodes = this.getKeys(action);
    for(var i=0; i< keyCodes.length; i++) {
      if(Input.getKeyState(keyCodes[i])) return true;
    }
    return false;
  };
  this.getKeys = action => {
    var idx = actions.indexOf(action);
    var result = [];
    while (idx != -1) {
      result.push(keys[idx]);
      idx = actions.indexOf(action, idx + 1);
    }
    return result;
  };
  this.addListener = actionListener => {
    listeners.push( actionListener );
    if(listeners.length == 1) {
      Input.addKeyListener(keyListener);
    }
  };
  this.removeListener = actionListener => {
    var index = listeners.indexOf(actionListener);
    if(index != -1) {
      listeners.splice(index, 1);
    }
    if(listeners.length === 0) Input.removeKeyListener(keyListener);
  };
};

