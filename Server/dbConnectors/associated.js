var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var associatedSchema = new Schema({
	id:           { type: Number },
	url:          { type: String },
	miniUrl:      { type: String },
	idAssociator: { type: Number },
	idAssociated: { type: Number }
});

/**
 * saveAssociation
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
 * findAssociationById
 *
 * Using the Id parameter information the function gets association.
 *
 * @param {String} requestId
 * @return {JSON|String} The new device or an error message in case there is any problem durin the execution.
 * 
 */
associatedSchema.statics.findAssociatedById = function findAssociatedById( id, cb){
	this.find({ idAssociator:id }, '-_id id url', function (err, associations) {
		//console.log(associations);
		if (err) return console.error(err);
		else cb(err,associations); //return cb(err,devices);
	});
};

/**
 * findAssociatedByUrl
 *
 * Using the URL parameter information the function gets association.
 *
 * @param {String} url or miniUrl
 * @return {JSON|String} The new device or an error message in case there is any problem durin the execution.
 * 
 */
associatedSchema.statics.findAssociatedByUrl = function findAssociationByURL( url, cb){
	var Association = this || mongoose.model('Associations');

	this.find({ url:url }, '-_id id url miniUrl',{sort: "-id", limit: 1}, function (err, associations) {
		if (err) return console.error(err);
		else{
			Association.find({ miniUrl:url }, '-_id id url miniUrl', {sort: "-id", limit: 1}, function (err, associations2) {
				//console.log(associations);
				var result=associations.concat(associations2).unique();
				if (err) return console.error(err);
				else cb(err,associations); //return cb(err,devices);
			});
		}
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

Array.prototype.unique = function() {
	var a = this.concat();
	for(var i=0; i<a.length; ++i) {
		for(var j=i+1; j<a.length; ++j) {
			if(a[i].id === a[j].id) a.splice(j--, 1);
		}
	}
	return a;
};
module.exports = mongoose.model('Associations', associatedSchema);
