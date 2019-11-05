/*\
title: $:/plugins/tiddlywiki/sonicpi/cue-server-route.js
type: application/javascript
module-type: route

POST /cue/:command

JSON payload is an array of data to send in osc.js format

\*/
(function() {

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports.method = "POST";

exports.path = /^\/cue\/(.+)$/;

exports.handler = function(request,response,state) {
	var command = decodeURIComponent(state.params[0]),
		args = JSON.parse(state.data);
	console.log("Received cue command",command,args,$tw.osc.sendPublicPort)
	// Send the command
	$tw.osc.udpPort.send({
		address: "/" + command,
		args: args
	},$tw.osc.address,$tw.osc.sendPublicPort);
	// Return response
	var result = {error: false}
	response.writeHead(200,{"Content-Type": "application/json"});
	response.end(JSON.stringify(result),"utf8");
};

}());
