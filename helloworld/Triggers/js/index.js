document.addEventListener('mediascape-ready',function(e){

	var req;
	var value;
	var interval;
	var interval1;
	var timeout;
	var group;
	var url;
	var token;
	var sharedStates={};
	var serverUrl=window.location.host;
	var shakeGo=false;
	var applicationID = "mediascape";
	var map = mediascape.mappingService();

	document.getElementById("nwsCreate").onclick = function(){
		var event = new CustomEvent("createNWS", { "detail": "Generates Named Web Sockets Message." });
		document.dispatchEvent(event);
	};

	document.getElementById("qrCreate").onclick = function(){
		var event = new CustomEvent("createQr", { "detail": "Generates Qr code." });
		document.dispatchEvent(event);
	};

	document.getElementById("miniUrlCreate").onclick = function(){
		var event = new CustomEvent("createMiniUrl", { "detail": "Generates miniUrl." });
		document.dispatchEvent(event);
	};

	document.getElementById("bothCreate").onclick = function(){
		var event = new CustomEvent("createBoth", { "detail": "Generates both elements." });
		document.dispatchEvent(event);
	};

	document.getElementById("fskCreate").onclick = function(){
		var event = new CustomEvent("createFSK", { "detail": "Generates both elements." });
		document.dispatchEvent(event);
	};

	document.getElementById("shakeGoStart").onclick = function(){
		var event = new CustomEvent("startShakeGo", { "detail": "Generates both elements." });
		document.dispatchEvent(event);
	};

	document.getElementById("syncStart").onclick = function(){
		var event = new CustomEvent("startSync", { "detail": "Generates both elements." });
		document.dispatchEvent(event);
	};

	mediascape.discovery.isPresent('namedwebsockets').then(function(data){
		if(data.presence){
			delete value;
			delete interval;
			delete interval1;
			console.log("NamedWebSocket Proxy is active.");
			map.getGroupMapping(applicationID).then(function (data){
				console.log("getGroupMapping");
				group=data.group;
				url="http://"+location.host+location.pathname+"?"+group;
				connectSharedState('app', group);
				mediascape.association.doAssociation("nws","mediascape",url,false);
			});
		}else{
			$("#myModal").modal({
				show: true
			});
			document.getElementById("associationCodes").innerHTML = "";
			document.getElementById("associationCodes").innerHTML = "<p>It has been impossible to find the NamedWebSocket Proxy.</p><p>Remeber that you can associate using On Demand system.<p>";
			map.getGroupMapping(applicationID).then(function (data){
				console.log("getGroupMapping");
				group=data.group;
				url="http://"+location.host+location.pathname+"?"+group;
				connectSharedState('app', group);
			});
			timeout=setTimeout(function(){
				$("#myModal").modal("hide");
			}, 5000);
		}
	});

	document.addEventListener('createNWS', function(){
		mediascape.discovery.isPresent('namedwebsockets').then(function(data){
			if(data.presence){
				console.log("NamedWebSocket Proxy is active.");
				map.getGroupMapping(applicationID).then(function (data){
					console.log("getGroupMapping");
					group=data.group;
					url="http://"+location.host+location.pathname+"?"+group;
					connectSharedState('app', group);
					mediascape.association.doAssociation("nws","mediascape",url,false);
				});
			}else{
				$("#myModal").modal({
					show: true
				});
				document.getElementById("associationCodes").innerHTML = "";
				document.getElementById("associationCodes").innerHTML = "<p>It has been impossible to find the NamedWebSocket Proxy.</p><p>Remeber that you can associate using On Demand system.<p>";
				map.getGroupMapping(applicationID).then(function (data){
					console.log("getGroupMapping");
					group=data.group;
					url="http://"+location.host+location.pathname+"?"+group;
					connectSharedState('app', group);
				});
				timeout=setTimeout(function(){
					$("#myModal").modal("hide");
				}, 5000);
			}
		});
	});

	document.addEventListener('stopInterval', function(){
		if(value!==undefined){
			if(value.readyState == 1){
				console.log("Stop Intervals");
				if(interval!=null) clearInterval(interval);
				if(interval1!=null) clearInterval(interval1);
				if(value.id==value.peersIds[0]) value.send(JSON.stringify({"peersIds":value.peersIds}));
				value.close();
				document.getElementById("associationCodes").innerHTML = '';
			}
		}else{
			document.getElementById("associationCodes").className = '';
			document.getElementById("associationCodes").innerHTML = '';
		}
	});

	document.addEventListener('createQr', function(){
		console.log('createQr');
		document.getElementById("associationCodes").innerHTML = "";
		mediascape.association.doAssociation("qr","associationCodes",url,false).then(function(data){
			if(data!=undefined){
				$("#myModal").modal({
					show: true
				});
				visualize("associationCodes",url,"");
			}
		});
	});

	document.addEventListener('createMiniUrl', function(){
		document.getElementById("associationCodes").innerHTML = "";
		mediascape.association.doAssociation("text",url,true).then(function(data){
			if(data!=undefined){
				$("#myModal").modal({
					show: true
				});
				visualize("associationCodes",url, data.response);
			}else console.log("It has not been possible to minimize the url.");
		});
	});


	document.addEventListener('createBoth', function(){
		document.getElementById("associationCodes").innerHTML = "";
		mediascape.association.doAssociation("qr","associationCodes",url,true).then(function(data){
			$("#myModal").modal({
				show: true
			});
			visualize("associationCodes",url,data.response);
		});
	});

	function visualize(place,url,minimized){
		var shortedUrl = url;
		var asociationElement=document.getElementById(place);
		var associationCode = document.createElement("div");
		associationCode.id=place+"code";
		associationCode.appendChild(document.createElement("br"));
		if(minimized!==""){
			var urlElement1 = document.createElement("div");
			urlElement1.id="miniUrl";
			urlElement1.innerHTML=minimized;
			associationCode.appendChild(urlElement1);
			var urlElement3 = document.createElement("br");
			associationCode.appendChild(urlElement3);
		}
		var urlElement2 = document.createElement("div");
		urlElement2.id="url";
		urlElement2.innerHTML=url;
		associationCode.appendChild(urlElement2);
		asociationElement.appendChild(associationCode);
	}

	document.addEventListener('createFSK', function(){
		console.log("createFSK");
		shakeGo=false;
		$("#myModal").modal({
			show: true
		});
		console.log(url);
		document.getElementById("associationCodes").innerHTML = "";
		document.getElementById("associationCodes").innerHTML = "<img src='img/icono_play.jpg'>";
		mediascape.association.doAssociation("acoustic",url,true);
	});

	$('#myModal').on('hidden.bs.modal', function () {
		if(req!=undefined ) req.abort();
		if(timeout) clearTimeout(timeout);
		if(document.getElementsByTagName('img').length!=0){
			if(document.getElementsByTagName('img')[0].src.indexOf("icono_play.jpg")!=-1){
				mediascape.association.stopAssociation('acoustic').then(function(data){console.log(data);});
			}else mediascape.association.stopAssociation('');
		}else mediascape.association.stopAssociation('');
	});

	document.addEventListener('ended',function(){
		if(!shakeGo){
			setTimeout(function(){
				$('#myModal').modal('hide');
			},1000);
		}else {
			req = $.post("http://"+serverUrl+"/api/associated",{url:url}, function(data1){
				if(data1)
				{
					if(data1.response.indexOf('http://')!=-1||data1.response.indexOf('https://')!=-1){
						$("#myModal").modal({
							show: true
						});
						associationMessage(2);
						timeout=setTimeout(function(){
							$("#myModal").modal("hide");
						}, 5000);
					} else {
						errorMessage(2);
						timeout = setTimeout(function(){
							associationMessage(1);
							document.getElementById("associationCodes").innerHTML = "";
							mediascape.association.doAssociation("qr","associationCodes",url,true).then(function(data){
								$("#myModal").modal({
									show: true
								});
								visualize("associationCodes",url,data.response);
							});
						},5000);
					}
				}
			});
		}
	});

	document.addEventListener('startSync', function(){
		document.getElementById("associationCodes").innerHTML = "";
		associationMessage(1);
		$("#myModal").modal({
			show: true
		});
		mediascape.association.doAssociation("sync",url).then(function(data){
			if(data){
				if(data.response.indexOf('http://')!=-1||data.response.indexOf('https://')!=-1){
					$("#myModal").modal({
						show: true
					});
					associationMessage(2);
					timeout=setTimeout(function(){
						$("#myModal").modal("hide");
					}, 5000);
				} else {
					errorMessage(data.response);
					timeout = setTimeout(function(){
						$("#myModal").modal("hide");
					}, 5000);
				}
			}
		});
	});

	document.addEventListener('startShakeGo', function(){
		shakeGo=true;
		mediascape.association.on("shakeChange",function(data){
			if(data.response.show===true){
				$("#myModal").modal("show");
				if(data.response.type==="message") associationMessage(data.response.text);
				else if(data.response.type==="errorMessage") errorMessage(data.response.text);
			}else if(data.response.show===false) $("#myModal").modal("hide");
		});
		mediascape.association.doAssociation("shake",url);
	});

	function connectSharedState(type, url) {
		console.log("connectSharedState");
		if (type && url) {
			if(sharedStates[type]==undefined) sharedStates[type] = mediascape.sharedState(url, "'"+token+"'");
			sharedStates[type].on('readystatechange', function (data) {
				if (data === 'open'){
					var keys = sharedStates[type].keys();
					if(keys.length!=0){
						for (var i = 0, len = keys.length; i < len; i++) {
							if(type=='app'){
								console.log(keys[i]);
								if(keys[i]=="users"||keys[i]=="vars"){
									var value;
									var result;
									if(keys[i]=="users") value=userID;
									if(keys[i]=="vars") value="z=3";
									var newValue = sharedStates[type].getItem(keys[i]);
									if(newValue.indexOf(value)==-1) result = newValue.concat([value]);
									else result=newValue;
									console.log(result);
									sharedStates[type].setItem(keys[i], result);
								}
							}else if(type=='user'){
								console.log(keys[i]);
								if(keys[i]=="applications"||keys[i]=="age"||keys[i]=="address"){
									var value;
									var result;
									if(keys[i]=="applications") value=applicationID;
									if(keys[i]=="age") value="24";
									if(keys[i]=="address") value="Heriz 42 1-C";
									var newValue = sharedStates[type].getItem(keys[i]);
									if(newValue.indexOf(value)==-1) result = newValue.concat([value]);
									else result=newValue;
									console.log(result);
									sharedStates[type].setItem(keys[i], result);
								}
							}
						}
					}else{
						console.log("Not Defined");
						if(type=='app'){
							sharedStates[type].setItem('users', [userID]);
							sharedStates[type].setItem('vars', ["x=4"]);
						}
						else if(type=='user'){
							sharedStates[type].setItem('applications', [applicationID]);
							sharedStates[type].setItem('age', ["23"]);
							sharedStates[type].setItem('address', ["Bera-Bera 109 2ºB"]);
						}
					}
				}
			});
		}
	}

	function errorMessage(message){
		console.log('errorMessage');
		document.getElementsByClassName('modal-title')[0].textContent="Association Error";
		document.getElementById("associationCodes").innerHTML = "";
		if(message==1) document.getElementById("associationCodes").innerHTML = "<p>It has been impossible to Associate.</p><p>FSK asssociation is going to start in 5 seconds.</p>";
		else if(message==2) document.getElementById("associationCodes").innerHTML = "<p>It has been impossible to Associate.</p><p>QR Code is going to appear in 5 seconds.</p>";
			else if(message==3) document.getElementById("associationCodes").innerHTML = "<p>It has been impossible to Associate.</p><p>QR Code and Audio catchers are going to start in 5 seconds.</p>";
				else if(message==4) document.getElementById("associationCodes").innerHTML = "<p>Named Web Socket Proxy has not been started.</p><p>Start Named Web Socket Proxy or use other technology.</p>";
					else document.getElementById("associationCodes").innerHTML = message;
	}
	function associationMessage(message){
		console.log('Message');
		if(message==1){
			document.getElementsByClassName('modal-title')[0].textContent="Associating ...";
			document.getElementById("associationCodes").innerHTML = "";
			document.getElementById("associationCodes").innerHTML = "<img src='img/loader.gif'>";
		}else if(message==2){
				document.getElementsByClassName('modal-title')[0].textContent="Associated";
				document.getElementById("associationCodes").innerHTML = "";
				document.getElementById("associationCodes").innerHTML = "<p>Association process has been completed successfully</p>";
			}else if(message==3){
				document.getElementsByClassName('modal-title')[0].textContent="Associating ...";
				document.getElementById("associationCodes").innerHTML = "";
				document.getElementById("associationCodes").innerHTML = "<img src='img/icono_play.jpg'>";
			}
	}
},false);
