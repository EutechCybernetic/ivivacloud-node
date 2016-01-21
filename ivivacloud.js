var http = require('http');
var querystring = require('querystring');
var signalR = require('signalr-client');
var self = null;

function Account(hostserver,apikey){

	this.api_key = apikey;

	this.hostserver = hostserver;

	var temp = hostserver.toLowerCase().replace('https://','');

	temp = temp.replace('http://','');

	var arr = temp.split(':');

	this.host = arr[0];

	this.port_no = arr[1]; //nodejs wont throw error if arr[1] dosen't exist

	this.last_result = "";

	this.AccountURL = "";

	self = this;

}

Account.prototype.executeService = function executeService(service,parameters,callback){

	try{

		var xstr = service.replace(':','/');

		var serviceurl = xstr.replace('.','/');

		parameters['apikey'] = this.api_key;

		var data = querystring.stringify(parameters);

		var options = {

		    host: this.host,
		    
		    port: this.port_no,
		    
		    path: '/api/'+serviceurl,
		    
		    method: 'POST',
		    
		    headers: {
		    
		        'Content-Type': 'application/x-www-form-urlencoded',
		    
		        'Content-Length': Buffer.byteLength(data),
		    
		        'Authentication': this.api_key
		    
		    }
		
		};


		var req = http.request(options, function(res) {
		    
		    res.setEncoding('utf8');
			
			var str = '';

			//another chunk of data has been recieved, so append it to `str`

			res.on('data', function (chunk) {

				str += chunk;

			});

			//the whole response has been recieved, so we just print it out here

			res.on('end', function () {

				console.log(str);

				if (!!callback)

					callback(str,null);

			});

			res.on('error', function(){

				console.log(str);

				if (!!callback)

					callback(null,str);

			});

		});

		req.write(data);
		
		req.end();

	}catch(err){

		callback(null,err);

	}

};

Account.prototype.MessageBus = function MessageBus(){

	var client = null;
 
 	var Hubs = ['GlobalHub'];

	var subscriptions = {};

	var signalRUrl = self.hostserver + '/signalR';

	var apikey = self.api_key;

	this.subscribe = function(channel,callback2){

		subscriptions[channel] = callback2;

		client.invoke(Hubs[0],'subscribe',apikey,channel);

	};

	this.broadcast = function(channel,message){
	
		client.invoke(Hubs[0],'broadcast',apikey,channel,message);
	
	};


	this.init = function(callback){

		client = new signalR.client(signalRUrl,Hubs,2,true);

		client.start();

		client.handlers.globalhub = { broadcast: function(channel,message){
	
			if(subscriptions[channel]!=null){

				subscriptions[channel](channel,message);

			}else{

				console.log('err:'+channel);
			}

		}};

		client.serviceHandlers.connected = function(connection) {

			callback();

		};

	};

}

module.exports.Account = Account;