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
		var tracker = new OSCSubscriptionTracker({wiki: $tw.wiki});
		tracker.init();
		$tw.rootWidget.addEventListener("tm-send-osc-command",function(event) {
			sendOSCCommand("osc",event.param,event.paramObject);
		});
	}
	if($tw.node) {
		setupOSC();
	}
};

function OSCSubscriptionTracker(options) {
	this.wiki = options.wiki;
	this.subscriptions = [];
	window.requestAnimationFrame(this.tick.bind(this));
}

OSCSubscriptionTracker.prototype.init = function() {
	var self = this;
	$tw.utils.each($tw.wiki.getTiddlersWithTag("$:/tags/OSC/Subscription"),function(title) {
		var tiddler = self.wiki.getTiddler(title);
		self.subscriptions.push({
			title: title,
			command: tiddler.fields.command,
			tiddler: tiddler.fields.tiddler,
			lastValue: self.wiki.getTiddlerText(tiddler.fields.tiddler)
		});
	});
	console.log(this.subscriptions)
};

OSCSubscriptionTracker.prototype.tick = function() {
	var self = this;
	$tw.utils.each(this.subscriptions,function(subscription) {
		var value = self.wiki.getTiddlerText(subscription.tiddler);
		if(value !== subscription.lastValue) {
			subscription.lastValue = value;
			sendOSCCommand("cue",subscription.command,{"0": value});
		}
	});
	window.requestAnimationFrame(this.tick.bind(this));
};

function sendOSCCommand(type,command,params) {
	console.log("Sending OSC",type,command,params);
	var args = [];
	$tw.utils.each(params,function(value,name) {
		var numName = parseInt(name,10);
		if(name === numName + "") {
			if(value === parseFloat(value) + "") {
				args[numName] = {
					type: "f",
					value: parseFloat(value)
				};				
			} else {
				args[numName] = {
					type: "s",
					value: value
				};
			}
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
		url: "/" + type + "/" + command,
		type: "POST",
		data: JSON.stringify(args),
		callback: function(err,data) {
			if(err) {
				alert(err);
			}
		}
	});
}

function setupOSC() {
	var config = $tw.boot.wikiInfo.config["sonic-pi-for-tiddlywiki"] || {},
		address = config.address || "127.0.0.1",
		ports = config.ports || {},
		listenPort = ports.listen || 14557,
		sendPrivatePort = ports["send-private"] || 4557,
		sendPublicPort = ports["send-public"] || 4559;
	console.log("address",address)
	console.log("listenPort",listenPort)
	console.log("sendPrivatePort",sendPrivatePort)
	console.log("sendPublicPort",sendPublicPort)
	var osc = require("osc")
	// Create an osc.js UDP Port listening on the listen port
	$tw.osc = Object.create(null);
	$tw.osc.address = address;
	$tw.osc.sendPrivatePort = sendPrivatePort;
	$tw.osc.sendPublicPort = sendPublicPort;
	$tw.osc.listenPort = listenPort;
	$tw.osc.udpPort = new osc.UDPPort({
		localAddress: address,
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

})();
