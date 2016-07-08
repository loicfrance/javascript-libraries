/**
 * author : Loic France
 * created 05/31/2016
 */
var Utils = {};
Utils['merge'] = ( dest, source, override = false ) => {
  for(var p in source)
    if(override || !dest.hasOwnProperty(p)) dest[p] = source[p];
};
Utils['globalize'] = properties => {
  for( var p in properties )
    if(window.hasOwnProperty(p))
      console.error('the property ' + p + ' already exists in global space.');
    else window[p] = properties[p];
};
Utils['intersectionFilter'] = (array, x)=> {
  return array.indexOf(x)!=-1;
};
Utils['exclusionFilter'] = (array, x)=> {
  return array.indexOf(x)==-1;
};
Utils['randomColor'] = _=>"#"+Math.round(Math.random()*16777215).toString(16);
Function.prototype['override'] = function( functionName, newFunction ) {
  _super = this.prototype[functionName];
  this.prototype[functionName] = newFunction;
  return _super;
};
if(!window['exists']) window['exists'] = a => a !== undefined;
if(!window['isNull']) window['isNull'] = a => a === undefined || a === null;

if(!window['createProperties'])
  window['createProperties'] = ( defValues, values, out )=>{
    if(!out) out = {};
    if(values) Utils.merge(out, values);
    if(defValues) Utils.merge(out, defValues);
    return out;
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
console.map = ( map, separationChar='' )=> {
  for(let i=0; i< map.length; i++) {
    if(map[i].join) console.log(map[i].join(separationChar));
    else console.log(map[i]);
  }
};