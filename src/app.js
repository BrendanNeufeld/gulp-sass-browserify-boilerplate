/**
 * Created by brendan on 2014-10-23.
 */

function App() {
	console.log('app initialized');
	if (!(this instanceof App)) {
		throw new TypeError("App constructor cannot be called as a function.");
	}
}

App.STAIC_VARIABLE = "I am a static variable";

App.prototype =  {
	constructor: App,
	init: function(){
		console.log('App.init');
		console.log('App.STATIC_VARIABLE: ',App.STAIC_VARIABLE);
	}
};

module.exports = App;
