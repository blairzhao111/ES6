/**
*  An example implementation of a generator&promise-flow task runner
*/

//check if input is a generator function
function isGenerator(obj){
	"use strict";

	if(!obj || !obj.constructor){return false;}
	return obj.constructor.name === "GeneratorFunction";
}


//====================generator-flow tasks runner working with promise==========================================
//accepts a generator function as input and returns a promise object with final result
module.exports = function (generatorFn){
	"use strict";

	//if input is not a generator function, return promise object in rejected state with error and message
	if(!isGenerator(generatorFn)){
		return Promise.reject(new TypeError("Invalid generator function input..."));
	}

	return new Promise((resolve, reject) => {
		//get generator object(works as iterator) and start initial iteration
		var gen = generatorFn();
		var result = gen.next();

		(function iteration(result){
			//if reach final return(when done is true), send final returned data to resolve handler
			if(result.done){
				return resolve(result.value);
			}

			let promise = result.value;
			//each yield extracts a promise, when it's finished, push result back to generator and start next iteration
			promise.then(data => {
				result = gen.next(data);
				iteration(result);
			}).catch(err => reject(err));
		})(result);

	});
}



