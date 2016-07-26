
var request = require('request');

function loadUser(id){
	"use strict";
	
	var parsedId = Number.parseInt(id);
	if(Number.isNaN(parsedId) || id<=0){
		return Promise.reject(new TypeError("invlid id input"));
	}

	return new Promise((resolve, reject) => {
		request.get("http://jsonplaceholder.typicode.com/users/" + id, (err, response, body) => {
			if(err){
				return reject(err);
			}
			
			if(response.statusCode === 200){
				resolve(body);
			}else{
				reject(new Error("statusCode is" + response.statusCode));
			}
		});
	});
}

function loadUsers(ids){
	"use strict";

	if(!ids || !Array.isArray(ids)){
		return Promise.reject(new TypeError("Invalid id group input"));
	}

	var validify = ids.every( id => {
		var parsedId = Number.parseInt(id);
		if(Number.isNaN(parsedId) || id<=0){
			return false;
		}
		return true;
	});

	if(!validify){return Promise.reject(new TypeError("invalid id input in input group"));}

	var promises = ids.map( id => loadUser(id) );
	return Promise.all(promises);
}

console.log("=============load a single user====================");
loadUser(2)
	.then(user => JSON.parse(user))
	.then(user => console.log(user))
	.catch(err => console.error(err));


setTimeout(function(){
	console.log("=============load multiple users in parallel=================");
	loadUsers([4,6,8])
		.then(users => {
			var names = users.map(user => {
				user = JSON.parse(user);
				return user.name;
			});
			console.log(names);
		})
		.catch(err => console.error(err));
}, 1000);


setTimeout(function(){
	console.log("==============load multiple users in sequential==================");
	loadUser(1)
		.then(user => {
			user = JSON.parse(user);
			console.log("user1: ", user.name);
			return loadUser(2);
		})
		.then(user => {
			user = JSON.parse(user);
			console.log("user2: ", user.name);
			return loadUser(3);
		})
		.then(user => {
			user = JSON.parse(user);
			console.log("user3: ", user.name);
			return loadUser(4);
		})
		.then(user => {
			user = JSON.parse(user);
			console.log("user4: ", user.name);
			return loadUser(5);
		})
		.then(user => {
			user = JSON.parse(user);
			console.log("user5: ", user.name);
		})
		.catch(err => console.error(err));	
}, 2000);


setTimeout(function(){
	console.log("==================handle invalid input===============");
	loadUser("Not a number")
		.then(user => {
			user = JSON.parse(user);
			console.log("user email: ", user.email);
		})
		.catch(err => console.error(err));
}, 3000);



