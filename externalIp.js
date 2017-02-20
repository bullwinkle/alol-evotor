var os = require('os');
var _ = require('lodash');

var addresses  = [],
	interfaces = os.networkInterfaces();

_.each(interfaces, function (net) {
	_.each(net, function (address) {
		if (address.family == 'IPv4' && !address.internal) addresses.push(address.address);
	})
});

module.exports = addresses;