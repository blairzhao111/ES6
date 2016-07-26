
function isStrictMode(that){
	return (function(){
		return !!(!that);
	})();
}


function replacePrototypeAndCopy(object, prototype){
	//strict mode, function form
	"use strict";

	var obj = Object.create(prototype);

	Object
		.getOwnPropertyNames(object)
		.forEach(function(key){
			var descriptor = Object.getOwnPropertyDescriptor(object, key);
			Object.defineProperty(obj, key, descriptor);
		});

	return obj;
}

var o = {
	name: "object"
};

var copy = replacePrototypeAndCopy(o, null);

console.log(copy);
console.log(Object.getPrototypeOf(copy));


function rest(x, y, z){
	console.log(arguments);
	console.log(x, y, z);
	return x*y*z;
}

rest(...[1,2], 3);















