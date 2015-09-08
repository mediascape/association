var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var requestsSchema = new Schema({
	id:        { type: Number },
	timestamp: { type: Number },
	url:       { type: String },
	miniUrl:   { type: String },
	locatLong: { type: Number },
	locatLat:  { type: Number },
	place:     { type: String }
});

/**
 * saveRequest
 *
 * Using the parameters information the function creates and saves new request document in mongodb Requests collection.
 *
 * @param {String} requestId
 * @param {String} requestTimestamp
 * @param {String} requestUrl
 * @param {String} requestMiniUrl
 * @param {String} requestLocation
 * @param {String} requestPlace
 * @return {JSON|String} The new device or an error message in case there is any problem durin the execution.
 * 
 */
requestsSchema.statics.saveRequest = function saveRequest(requestId, requestTimestamp, requestUrl, requestMiniUrl, requestLocationLong, requestLocationLang, requestPlace, cb){
	var Request = this || mongoose.model('Requests');

	var request = new Request({
				id: requestId,
				timestamp: requestTimestamp,
				url: requestUrl,
				miniUrl: requestMiniUrl,
				locatLong: requestLocationLong,
				locatLat: requestLocationLang,
				place: requestPlace
			});
	request.save(function (err) {
		if (err) return console.error(err);
		else return cb(err,request);
	});
};

/**
 * findAssociableRequest
 *
 * Using the parameters information the function creates and saves new request document in mongodb Requests collection.
 *
 * @param {String} requestId
 * @param {String} requestTimestamp
 * @param {String} requestUrl
 * @param {String} requestMiniUrl
 * @param {String} requestLocation
 * @param {String} requestPlace
 * @return {JSON|String} The new device or an error message in case there is any problem durin the execution.
 * 
 */
requestsSchema.statics.findAssociableRequest = function findAssociableRequest( requestTimestamp, requestLocationLong, requestLocationLang, requestPlace, cb){
	var Request = this || mongoose.model('Requests');
	var timestampMax=parseInt(requestTimestamp)+10000;
	var timestampMin=parseInt(requestTimestamp)-10000;

	var longMax=parseFloat(requestLocationLong)+0.02;
	var longMin=parseFloat(requestLocationLong)-0.02;

	var latMax=parseFloat(requestLocationLang)+0.02;
	var latMin=parseFloat(requestLocationLang)-0.02;

	var devices1;
	var devices2;

	console.log("Timestamp:("+timestampMin+","+timestampMax+")");
	console.log("Longitude:("+longMin+","+longMax+")");
	console.log("Latitude:("+latMin+","+latMax+")");

	this.find({ place:requestPlace, timestamp: {$gt : timestampMin, $lt : timestampMax} , url: { $ne: null} }, '-_id id', function (err, requests) {
		if (err) return console.error(err);
		else{
			devices1=requests; //return cb(err,devices);
			Request.find('', '-_id id url miniUrl',{sort: "-id"})
				.where('timestamp').gt(timestampMin).lt(timestampMax)
				.where('locatLong').gt(longMin).lt(longMax)
				.where('locatLat').gt(latMin).lt(latMax)
				.where('url').ne(null)
				.where('miniUrl').ne(null)
				.exec(function (err, requests) {
					if (err) return console.error(err);
					else{
						devices2=requests; //return cb(err,requests);
			
						var result=devices1.concat(devices2).unique(); 
						console.log("Join: "+result);
						cb(err,result);
					};
			});
		}
	});
};

/**
 * getLastRequestId
 *
 * Find the last numerical deviceId from mongodb Devices collection. 
 *
 * @return {JSON|String} The last numerical deviceId from mongodb Devices collection or an error message in case there 
 * is any problem durin the execution.
 * 
 */
requestsSchema.statics.getLastRequestId = function getLastRequestId(cb) {
	var Request = this || mongoose.model('Requests');
	var count;
	
	this.count("id",  function (err, number) {
		if(number!=0){
				Request.find("", '-_id id', {sort: "-id", limit: 1},function (err,count){
					return cb(err, count[0]);
				});
		} else {
			count = new Request({id: '0'});
			return cb(err,count);
		}
	});
};

Array.prototype.unique = function() {
	var a = this.concat();
	for(var i=0; i<a.length; ++i) {
		for(var j=i+1; j<a.length; ++j) {
			if(a[i] === a[j]) a.splice(j--, 1);
		}
	}
	return a;
};

module.exports = mongoose.model('Requests', requestsSchema);
