/**
* Callback
*/
//old callback error-first way to perform async operations.
//loadUser funtion performs async task... and callback function works both as error handler and data result handler
function loadUser(id, callback){
	//mocking a database search query
	User.findById(id, function(err, user){
		if(err){
			return callback(err);
		}

		callback(null, user);
	});
}

loadUser("12345", function(err, user){
	if(err){
		return showError(err);
	}

	showUser(user);
});


/**
* Promise
* A promise object represents an async operation that hasn't completed yet, but is expected in the future.
* A promise has three states: 
*   1. pending: initial state, not fulfilled or rejected
*   2. fulfilled: meaning that the operation completed successfully
*   3. rejected: meaning that operation failed
*/
//using promise to handle single async task...
function loadUserWithPromise(id){
	//return a promise object that wraps async task's code
	return new Promise(function(resolve, reject){
		//mocking a database search query
		User.findById(id, function(err, user){
			if(err){
				reject(err);
			}

			resolve(user);
		});
	});
}

//once opertion completes successful, invoke then with resolve handler, when error occurs, invoke error handler...
loadUserWithPromise("12345")
	.then(function(user){
		showUser(user);
	})
	.catch(function(err){
		showError(err);
	});

//a non-promise value returned in then and catch methods would be passed as data to the next method in the chain
//could use this feature to break resolve handler into multiple functions...
loadUserWithPromise("67890")
	.catch(function(err){
		showError(err);
	})
	.then(function(user){
		user = processUserData(user);
		return user;
	})
	.then(function(user){
		user = processUserDataAgain(user);
		return user;
	})
	.then(function(user){
		showUser(user);
	});


//by default, all promise methods would return the original promise object with extra attached handlers.
//in the meanwhile, the state of promise object reamins the same...
//an explicit promise object instance can be returned, it will be resolved before next then or catch is triggered.
loadUserWithPromise("24680")
	.then(function(user24680){
		//this resolved handler working on promise that loads user 24680
		showUser(user24680);
		return loadUserWithPromise("13579");
	})
	.then(function(user13579){
		//this resolved handler working on promise that loads user 13579
		//this handler won't be call if the promise that loads user 12579 is not resolved
		showUser(user13579);
	})
	.catch(err => {
		showError(err);
	});


//using promise to handle multiple async tasks...
var ids = ["12345", "45678", "13579", "02468", "98765"];
//get an array of promise objects, each promise object wraps a single async task...
var promises = ids.map(loadUserWithPromise);

//Promise.all will return a single promise object that contains the collection of results that every siingle promise returns...
//Only when every user promise in promise array is resolved, resolve handler for result collection will be invoked...
//Once any of promise object in promise array throwing error, catch error handler will be invoked... 
Promise.all(promises)
	.then(function(users){
		showUsers(users);
	})
	.catch(function(err){
		showError(err);
	});


//Promise.resolve method can be used to set default returned promise object
var userPromise = userId?loadUserWithPromise(userId):Promise.resolve(defaultUser);

userPromise
	.then(function(user){
		showUser(user);
	})
	.catch(function(err){
		showError(err);
	});


//Promise.reject method can be used to return rejected promise when having invalid user argument
//Functions that return promises should always return promises...
function loadUserWithPromise(id){
	if(typeof id !== 'string' || Number.isNaN(Number.parseInt(id))){
		//when dealing with invalid user input, instead of throwing error, return a rejected promise to maintain consistence.
		return Promise.reject(new TypeError("Invalid user id format"));
	}

	return new Promise((resolve, reject) => {
		//load user operation 
		//if succeed
		resolve(user);
		//if fail
		reject(err);
	});
}

//alternatively, errors can be thrown inside a promise executor function or any promise chain
function loadUserWithPromise(id){
	return new Promise((resolve, reject) => {
		if(typeof id !== 'string' || Number.isNaN(Number.parseInt(id))){
			throw new TypeError("Invalid user id format");
		}
		//load user operation 
		//if succeed
		resolve(user);
		//if fail
		reject(err);
	});
}

//ATTENTION: if an error is thrown inside promise chain, the throwing error would be impliticly caught by promise 
// and treated as a call to reject(err)
loadUserWithPromise("00000")
	.then(user => {
		if(!user){
			//throwing error will be caught by following catch handler
			throw new Error("No user found!");
		}
		showUser(user);
	})
	.catch(err => {
		showError(err);
		console.log(err.message);
	});