/**
 * Created by brendan on 2014-10-23.
 */
require('canvas-testbed')(render, start)

var img = require('img');
var baboon = require('baboon-image-uri')

var image = null, pos = {x:0, y:0}

function render(context, width, height, deltaTime) {
	context.clearRect(0, 0, width, height)
	context.fillRect(0, 0, width, 50)

	if (image) {
		var aspect = image.width/image.height
		context.drawImage(image, pos.x, pos.y, width, width / aspect)
	}
}

function start(context, width, height) {

	console.log(require('img'))
	console.log("blfoiasdf")
	img(baboon, function(err, i) {
		image = i
	})
}

var events = require('dom-events')

events.on(window, 'mousemove', function(ev) {
	pos.x = ev.clientX
	pos.y = ev.clientY

})