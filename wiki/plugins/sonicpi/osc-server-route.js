/*\
title: $:/plugins/tiddlywiki/sonicpi/osc-server-route.js
type: application/javascript
module-type: route

POST /osc/:command

JSON payload is an array of data to send

\*/
(function() {

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports.method = "POST";

exports.path = /^\/osc\/(.+)$/;

exports.handler = function(request,response,state) {
	var command = decodeURIComponent(state.params[0]),
		args = JSON.parse(state.data);
	// Send the command
	$tw.osc.udpPort.send({
		address: "/" + command,
		args: args
	}, "127.0.0.1", $tw.osc.sendPort);
	// Return response
	var result = {error: false}
	response.writeHead(200, {"Content-Type": "application/json"});
	response.end(JSON.stringify(result),"utf8");
};

}());
