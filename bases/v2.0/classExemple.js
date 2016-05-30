var Class;
(function(){
  var parent = ParentClass;
  
// - - - - - - - - - - - - - - - - -constructor- - - - - - - - - - - - - - - - -
  Class = function( constructorArgs ) { // constructor
    // public fields definition, constructor work
  };
  classExtend(parent, Class);
  
// - - - - - - - - - - - - - - - - - -private- - - - - - - - - - - - - - - - - -
  var privateStaticField = /*value*/1;
  
  var privateStaticMethod = function( args ) { /* ... */ };
  // OR
  function privateStaticMethod_2( args ) { /* ... */ }
  
// - - - - - - - - - - - - - - - - - -public - - - - - - - - - - - - - - - - - -
  Class.publicStaticField = /*value*/1;
  Class.publicStaticMethod = function(args) {/* ... */ };
  
  //instance method not calling same method in ParentClass
  Class.prototype.newPublicMethod = function( args ) {
    // ...
  };
  
  //instance method calling same method in ParentClass
  var parentMethod = override(Class, 'overridenPublicMethod', function( args ) {
    parentMethod.call(this, args);//call parent method
    // ...
  });
  
})();