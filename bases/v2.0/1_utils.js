/**
 * author : Loic France
 * created 05/31/2016
 */
if(!window['classExtend']) {
  window['classExtend'] = (parent, child) =>{
    child.prototype = Object.create(parent.prototype);
    child.prototype.constructor = child;
    child.super = parent.prototype;
  };
}
if(!window['override']) {
  window['override'] = ( _class, functionName, newFunction) => {
    _super = _class.prototype[functionName];
    _class.prototype[functionName] = newFunction;
    return _super;
  };
}
if(!window['exists']) window['exists'] = a => a !== undefined;
if(!window['isNull']) window['isNull'] = a => a === undefined || a === null;
if(!window['createProperties'])
  window['createProperties'] = ( defaultValues, values, out )=>{
    if(isNull(out)) out = {};
    if(!isNull(values)) for(var p in values) out[p] = values[p];
    if(!isNull(defaultValues)) for(var defP in defaultValues)
      if(!out.hasOwnProperty(defP)) out[defP] = defaultValues[defP];
    return out;
  };
if(!window['globalize']) window['globalize'] = properties => {
  for( var p in properties ) {
    if(window.hasOwnProperty(p))
      console.error('the property ' + p + ' already exists in global space.');
    else window[p] = properties[p];
  }
};
if(!window['getStringFromUrl']) window['getStringFromUrl']= ( url, listener )=> {
  var client = new XMLHttpRequest();
  client.open('GET', url);
  client.onreadystatechange=_=>listener(client.responseText);
  client.send();
};
window['TYPE_UNDEFINED'] = 'undefined';
window['TYPE_OBJECT'   ] = 'object';
window['TYPE_BOOLEAN'  ] = 'boolean';
window['TYPE_NUMBER'   ] = 'number';
window['TYPE_STRING'   ] = 'string';
window['TYPE_FUNCTION' ] = 'function';
console.stack = ( str ) =>{
  console.error(new Error(str).stack);
};
console.deprecated = ( str ) =>{
  console.stack('deprecated : ' + str);
};