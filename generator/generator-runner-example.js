const request = require('request');
const runner = require('./generator-runner.js');

//load user data from api, operation wrapped in promise and promise is returned
function fetchUser(id){
	"use strict";

	return new Promise((resolve,reject) => {
		request.get("http://jsonplaceholder.typicode.com/users/" + id, (err, response, body) => {
			if(err){return reject(err);}

			if(response.statusCode === 200){
				resolve(body);
			}else{
				reject(new Error("statusCode is" + response.statusCode));
			}
		})
	});
}

//load all posts made by user from api, operation wrapped in promise and promise is returned
function fetchPosts(userid){
	"use strict";

	return new Promise((resolve, reject) => {
		request.get("http://jsonplaceholder.typicode.com/posts/?userId=" + userid, (err, response, body) => {
			if(err){return reject(err);}

			if(response.statusCode === 200){
				resolve(body);
			}else{
				reject(new Error("statusCode is" + response.statusCode));
			}
		})		
	});
}

//====================runner working with promise-style asynchronous function==============================
//don't need to wrap JSON.parse in try catch block, because when error is thrown in promise chain
//following catch block will catch the error
//use runner to run asychronous code in synchronous-style
runner(function* (){
	let user = yield fetchUser(1);
	user = JSON.parse(user);
	let posts = yield fetchPosts(user.id);
	posts = JSON.parse(posts);
	return {
		user: user,
		posts: posts
	};
}).then(data => {
	//do something with data
	console.log(data);
}).catch(err => {
	//deal with occured errors
	console.error(err.stack);
});
