//File: routes/api.js
module.exports = function(app,mongoose) {
	var Requests = require('../dbConnectors/requested');
	var Association = require('../dbConnectors/associated');


	//GET - 
	associateGet = function(req, res) {
		console.log('associateGET');
		var timestamp=req.query.timestamp;
		var location=req.query.location;
		var place=req.query.place;

		if(req.query.location){
			if(req.query.url){
				var url=req.query.url;
				var miniUrl=req.query.miniUrl;
				console.log("timestamp = "+timestamp+", location = "+JSON.stringify(location)+", url = "+url+", miniUrl = "+miniUrl);
			
			} else {
				var url=null;
				var miniUrl=null;
				console.log("timestamp = "+timestamp+", location = "+JSON.stringify(location));
			}
			Requests.getLastRequestId(function(err, request){
				if(request.id){
					console.log(request.id);
					var requestId=parseFloat(request.id)+1;
					Requests.saveRequest(requestId,timestamp,url,miniUrl,location.longitude,location.latitude,place,function(err, requests){
						console.log("saveRequest");
						//console.log(requests);
						if(url!=null){
							console.log("Url");
							setTimeout(function(){
								/*console.log("Sartu da");
								console.log(requestId);*/
								Association.findAssociatedById(requestId,function(err, requests2){
									console.log("FindAssociatedById:");
									//console.log(requests2);
									//console.log("");
									if(requests2 && (requests2.length==1)){
										response.status(200).send(JSON.parse('{"response":"'+requests2[0].url+'"}'));
									}else response.status(200).send(JSON.parse('{"response":"There is no association."}'));
								});
							},10000);
						}else{
							console.log("No Url");
							/*console.log(requestId);
							console.log(timestamp);
							console.log(location.longitude);
							console.log(location.latitude);
							console.log(place);*/
							Requests.findAssociableRequest(timestamp,location.longitude,location.latitude,place,function(err, requests2){
								console.log("findAssociableRequest");
								console.log(requests2);
								if(requests2.length==1){
									Association.getLastAssociatedId(function(err, association){
										console.log("getLastAssociatedId:");
										console.log(association);
										if(association.id || association.id==0){
											var associationId=parseFloat(association.id)+1;
											Association.saveAssociation(associationId, requests2[0].url, requests2[0].miniUrl, requests2[0].id, requestId, function(err, requests3){
												console.log("saveAssociation:");
												console.log(requests3);
												console.log("");
												response.status(200).send(JSON.parse('{"response":"'+requests3.url+'"}'));
											});
										}else response.status(200).send(JSON.parse('{"response":"There is no association."}'));
									});
								}else response.status(200).send(JSON.parse('{"response":"There is no association."}'));
							});
						}
					});
				}else response.status(200).send(JSON.parse('{"response":"There is no association."}'));
			});
		}else response.status(200).send(JSON.parse('{"response":"There is no association."}'));

		setTimeout(function(){
			res = addCoors(req, res);
			res.status(200).send(JSON.parse('{"response":"done"}'));
		},10000);
	};

	//GET - 
	associatedGet = function(req, res) {
		console.log('associatedGET');
		var url=req.query.url;
		
		res = addCoors(req, res);
		res.status(200).send(JSON.parse('{"response":"done"}'));
	};

	//POST - 
	associatePost = function(req, res) {
		console.log('associatePOST');
		var timestamp=req.body.timestamp;
		var location=req.body.location;
		var place=req.body.place;
		var response = addCoors(req, res);
		if(req.body.location){
			console.log('Location');
			if(req.body.url){
				console.log('URL');
				if(req.body.miniUrl){
					var url=req.body.url;
					var miniUrl=req.body.miniUrl;
					console.log("timestamp = "+timestamp+", location = "+JSON.stringify(location)+", url = "+url+", miniUrl = "+miniUrl+", location.longitude = "+location.longitude+", location.latitude = "+location.latitude+", place = "+place);
				}else{
					var request = require("request");
					var miniUrl;
					function expandUrl(shortUrl) {
						request( { method: "HEAD", url: shortUrl, followAllRedirects: true },
							function (error, response) {
							miniUrl=response.request.href;
						});
					}
				}
			} else {
				console.log('Not URL');
				var url=null;
				var miniUrl=null;
				console.log("timestamp = "+timestamp+", location = "+JSON.stringify(location)+", location.longitude = "+location.longitude+", location.latitude = "+location.latitude+", place = "+place);
			}
			if(req.body.timestamp){
				Requests.getLastRequestId(function(err, request){
					if(request.id || request.id==0){
						var requestId=parseFloat(request.id)+1;
						Requests.saveRequest(requestId,timestamp,url,miniUrl,location.longitude,location.latitude,place,function(err, requests){
							console.log("saveRequest");
							console.log(requests);
							if(url!=null){
								console.log("Url");
								setTimeout(function(){
									/*console.log("Sartu da");
									console.log(requestId);*/
									Association.findAssociatedById(requestId,function(err, requests2){
										console.log("FindAssociatedById:");
										console.log(requests2);
										console.log("");
										if(requests2 && (requests2.length==1)){
											response.status(200).send(JSON.parse('{"response":"'+requests2[0].url+'"}'));
										}else response.status(200).send(JSON.parse('{"response":"There is no association."}'));
									});
								},10000);
							}else{
								console.log("No Url");
								/*console.log(requestId);
								console.log(timestamp);
								console.log(location.longitude);
								console.log(location.latitude);
								console.log(place);*/
								Requests.findAssociableRequest(timestamp,location.longitude,location.latitude,place,function(err, requests2){
									console.log("findAssociableRequest");
									//console.log(requests2);
									if(requests2.length==1){
										Association.getLastAssociatedId(function(err, association){
											console.log("getLastAssociatedId:");
											//console.log(association);
											if(association.id || association.id==0){
												var associationId=parseFloat(association.id)+1;
												Association.saveAssociation(associationId, requests2[0].url, requests2[0].miniUrl, requests2[0].id, requestId, function(err, requests3){
													console.log("saveAssociation:");
													//console.log(requests3);
													//console.log("");
													response.status(200).send(JSON.parse('{"response":"'+requests3.url+'"}'));
												});
											}else response.status(200).send(JSON.parse('{"response":"There is no association."}'));
										});
									}else response.status(200).send(JSON.parse('{"response":"There is no association."}'));
								});
							}
						});
					}else response.status(200).send(JSON.parse('{"response":"There is no association."}'));
				});
			}else{
				console.log('No Timestamp');
				Association.getLastAssociatedId(function(err, association){
					console.log("getLastAssociatedId:");
					//console.log(association);
					if(association.id || association.id==0){
						var associationId=parseFloat(association.id)+1;
						Association.saveAssociation(associationId, url, miniUrl, null, null, function(err, requests){
							console.log("saveAssociation:");
							//console.log(requests3);
							//console.log("");
							response.status(200).send(JSON.parse('{"response":"'+requests.url+'"}'));
						});
					}else response.status(200).send(JSON.parse('{"response":"There is no association."}'));
				});
			}
		}else{
			console.log('No Location');
			response.status(200).send(JSON.parse('{"response":"There is no association."}'));
		}
	};

	//POST - 
	associatedPost = function(req, res) {
		console.log('associatedPOST');
		var url=req.body.url;
		console.log(req.body.url);
		Association.findAssociatedByUrl(url,function(err, requests){
			console.log("FindAssociatedById:");
			console.log(requests);
			console.log("");
			if(requests && (requests.length==1)){
				res.status(200).send(JSON.parse('{"response":"'+requests[0].url+'"}'));
			}else res.status(200).send(JSON.parse('{"response":"There is no association."}'));
		});
		//res = addCoors(req, res);
		//res.status(200).send(JSON.parse('{"response":"done"}'));
	};

	//PUT - Update a register already exists
	updateTVShow = function(req, res) {
		console.log('PUT' + req.params);
		console.log(req.params);
		res = addCoors(req, res);
		res.status(200).send(req.params);
	}

	//DELETE - Delete a TVShow with specified ID
	deleteTVShow = function(req, res) {
		console.log('DELETE' + req.params);
		res = addCoors(req, res);
		res.status(200).send(req.params);
	}

	//GET - Return all requests in the DB
	findAllRequests = function(req, res) {
		Requests.find(function(err, requests) {
			if(!err) {
				console.log('GET /requests')
				res.send(requests);
			} else {
				console.log('ERROR: ' + err);
			}
		});
	};

	//GET - Return a TVShow with specified ID
	findById = function(req, res) {
		TVShow.findById(req.params.id, function(err, tvshow) {
			if(!err) {
				console.log('GET /tvshow/' + req.params.id);
				res.send(tvshow);
			} else {
				console.log('ERROR: ' + err);
			}
		});
	};

	//GET - Return a TVShow with specified ID
	findByData = function(req, res) {
	};

	//POST - Insert a new TVShow in the DB
	addRequest = function(req, res) {
		console.log('POST');
		console.log(req.body);

		var requests = new Requests({
			id:        req.body.id,
			timestamp: req.body.timestamp,
			url:       req.body.url,
			miniUrl:   req.body.miniUrl,
			location:  req.body.location,
			place:     req.body.place
		});

		requests.save(function(err) {
			if(!err) {
				console.log('Created');
			} else {
				console.log('ERROR: ' + err);
			}
		});
		res.send(requests);
	};

	//PUT - Update a register already exists
	updateTVShow = function(req, res) {
		Requests.findById(req.params.id, function(err, requests) {
			requests.id        = req.body.id;
			requests.timestamp = req.body.timestamp;
			requests.url       = req.body.url;
			requests.miniUrl   = req.body.miniUrl;
			requests.location  = req.body.location;
			requests.place     = req.body.place;

			requests.save(function(err) {
				if(!err) {
					console.log('Updated');
				} else {
					console.log('ERROR: ' + err);
				}
				res.send(requests);
			});
		});
	}

	//DELETE - Delete a TVShow with specified ID
	deleteRequests = function(req, res) {
		Requests.findById(req.params.id, function(err, requests) {
			requests.remove(function(err) {
				if(!err) {
					console.log('Removed');
				} else {
					console.log('ERROR: ' + err);
				}
			})
		});
	}

	addCoors = function(req, res) {
		var origin = (req.headers.origin || "*");
		res.header('Access-Control-Allow-Origin', origin);
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
		res.header('Access-Control-Allow-Headers', 'Content-Type');
		return res;
	};

	/*
	//Link routes and functions
	app.get('/findAllRequests', findAllRequests);
	app.get('/findById', findById);
	app.get('/addRequest', findByData);
	app.post('/tvshow', addRequest);
	app.put('/updateTVShow', updateTVShow);
	app.delete('/deleteRequests', deleteRequests);*/

	//Link routes and functions
	app.get('/api/associate', associateGet);
	app.post('/api/associate', associatePost);
	app.get('/api/associated', associatedGet);
	app.post('/api/associated', associatedPost);
	/*app.post('/api', addTVShow);
	app.put('/api/:id', updateTVShow);
	app.delete('/api/:id', deleteTVShow);*/
}
