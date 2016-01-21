# ivivacloud-node

A node.js helper library for accessing iVivaCloud
A node.js Twilio helper library.


# Getting Started
You need to have access to an iVivaCloud installation and have a valid api key.

## Installation

	npm install ivivacloud-node

## Usage

	var iviva = require('ivivacloud-node');
	var account = new iviva.Account('http://ivivacloud.url','apikey');

	/* A sample service to execute */
	account.executeService('System.AvailableDateFormats',{},function(data,err){
		if (err != null) {
			console.log('Received data:'  + data);
		}
	});

	var mb = new account.MessageBus();
	mb.init(function(){
		mb.subscribe('test',function(msg){
			console.log('recieved test message:' + msg);
		});
	});




