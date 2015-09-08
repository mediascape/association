var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var associatedSchema = new Schema({
	id:           { type: Number },
	url:          { type: String },
	idAssociator: { type: Number },
	idAssociated: { type: Number }
});

/**
 * saveAssociated
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
associatedSchema.statics.saveAssociation = function saveAssociation(associationId, associationUrl, associationMiniUrl, associationIdAssociator, associationIdAssociated, cb){
	var Association = this || mongoose.model('Associations');

	var association = new Association({
				id: associationId,
				url: associationUrl,
				miniUrl: associationMiniUrl,
				idAssociator: associationIdAssociator,
				idAssociated: associationIdAssociated
			});
	association.save(function (err) {
		if (err) return console.error(err);
		else return cb(err,association);
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
associatedSchema.statics.findAssociatedById = function findAssociatedById( id, cb){
	this.find({ idAssociator:id }, '-_id id url', function (err, associations) {
		console.log(associations);
		if (err) return console.error(err);
		else cb(err,associations); //return cb(err,devices);
	});
};

/**
 * getLastAssociatedId
 *
 * Find the last numerical deviceId from mongodb Devices collection. 
 *
 * @return {JSON|String} The last numerical deviceId from mongodb Devices collection or an error message in case there 
 * is any problem durin the execution.
 * 
 */
associatedSchema.statics.getLastAssociatedId = function getLastAssociatedId(cb) {
	var Association = this || mongoose.model('Associations');
	var count;
	
	this.count("id",  function (err, number) {
		if(number!=0){
				Association.find("", '-_id id', {sort: "-id", limit: 1},function (err,count){
					return cb(err, count[0]);
				});
		} else {
			count = new Association({id: '0'});
			return cb(err,count);
		}
	});
};
module.exports = mongoose.model('Associations', associatedSchema);
