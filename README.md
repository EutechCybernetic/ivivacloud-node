# ivivacloud-node

A node.js helper library for accessing iVivaCloud


# Getting Started
You need to have access to an iVivaCloud installation and have a valid api key.

## Installation

	npm install ivivacloud-node

## Usage

	var iviva = require('ivivacloud-node');
	var account = new iviva.Account('http://ivivacloud-url','apikey');

	/* A sample service to execute */
	account.executeService('System.AvailableDateFormats',{},function(err,data){
	    if (err != null) {
	        console.log('Received data:'  + data);
	    }
	});

	var mb = new iviva.MessageBus(account);
	mb.init(function(){
	    mb.subscribe('test',function(channel,message){
	        console.log('received test message:' + message);
	    });
	});
