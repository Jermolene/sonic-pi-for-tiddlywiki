/*\
title: $:/plugins/tiddlywiki/sonicpi/sonicpi.js
type: application/javascript
module-type: startup

Sonic PI

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

// Export name and synchronous status
exports.name = "sonicpi";
exports.before = ["story"];
exports.synchronous = true;

exports.startup = function() {
	if($tw.browser) {
		$tw.rootWidget.addEventListener("tm-send-osc-command",function(event) {
			var args = [];
			$tw.utils.each(event.paramObject,function(value,name) {
				var numName = parseInt(name,10);
				if(name === numName + "") {
					args[numName] = {
						type: "s",
						value: value
					};
				}
			});
			$tw.utils.each(args,function(value,index) {
				if(value === "undefined") {
					args[index] = {
						type: "s",
						value: ""
					};
				}
			});
			$tw.utils.httpRequest({
				url: "/osc/" + event.param,
				type: "POST",
				data: JSON.stringify(args),
				callback: function(err,data) {
					if(err) {
						alert(err);
					}
				}
			});
		});
	}
	if($tw.node) {
		var config = $tw.boot.wikiInfo.config["sonic-pi-for-tiddlywiki"] || {},
			ports = config.ports || {},
			listenPort = ports.listen || 14557,
			sendPort = ports.send || 4557;
console.log("listenPort",listenPort)
console.log("sendPort",sendPort)
		var osc = require("osc")
		// Create an osc.js UDP Port listening on the listen port
		$tw.osc = Object.create(null);
		$tw.osc.sendPort = sendPort;
		$tw.osc.listenPort = listenPort;
		$tw.osc.udpPort = new osc.UDPPort({
			localAddress: "0.0.0.0",
			localPort: listenPort,
			metadata: true
		});
		// Listen for incoming OSC messages
		$tw.osc.udpPort.on("message",function(oscMsg,timeTag,info) {
			console.log("Received OSC message:",oscMsg);
			console.log("Args:",info);
		});
		// Open the socket
		$tw.osc.udpPort.open();
	}
};

})();
