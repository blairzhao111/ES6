
var curryFun = 
	name => 
		size =>
			element =>
				`${name}--${size}--${element}`;



var result = curryFun("Naomi")("large")("fire");

console.log(result);