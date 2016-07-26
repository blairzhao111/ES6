//generator function
function* genFn() {
	yield 1;
	yield 3;
	yield 5;
	return 7;
}

//get a generator object by invoking a generator function, returned generator is in suspended state
var gen = genFn();
var hasNext = true;

//generator works as an iterator object, call next on it and get result object with value and done properies
//when encounter a final return statement, done will be set to true to indicate there is no more data
while(hasNext){
	let result = gen.next();
	console.log("value: ", result.value);
	console.log("done: ", result.done);
	hasNext = !result.done;
}


