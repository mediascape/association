document.addEventListener('mediascape-ready',function(e){
	document.getElementById("nwsCatcher").onclick = function(){
		var event = new CustomEvent("catchNWS", { "detail": "Catch Named Web Sockets Messages." });
		document.dispatchEvent(event);
	};

	document.getElementById("visualCatcher").onclick = function(){
		var event = new CustomEvent("catchQr", { "detail": "Generates Qr code." });
		document.dispatchEvent(event);
	};

	document.getElementById("acousticCatcher").onclick = function(){
		var event = new CustomEvent("catchFSK", { "detail": "Generates both elements." });
		document.dispatchEvent(event);
	};

	document.getElementById("syncCatcher").onclick = function(){
		var event = new CustomEvent("catchSync", { "detail": "Generates sync association." });
		document.dispatchEvent(event);
	};

	document.getElementById("shakeCatcher").onclick = function(){
		var event = new CustomEvent("catchShake", { "detail": "Generates Shake&Go association." });
		document.dispatchEvent(event);
	};


	document.addEventListener('catchNWS', function(){
		mediascape.discovery.isPresent('namedwebsockets').then(function(data){
			if(data.presence){
				mediascape.association.doAssociation("nws","mediascape").then(function (data){
					if(data.response.indexOf('http://')!=-1||data.response.indexOf('https://')!=-1) window.location=data.response;
				});
			}else{
				$("#myModal").modal("show");
				errorMessage(4);
			}
		});
	});
	document.addEventListener('catchQr', function(){
		document.getElementById("qrCatcher").style.display='block';
		document.getElementById("audioCatcher").style.display='none';
		mediascape.association.doAssociation("qr","qrCatcher").then(function(data){
			if(data.response.indexOf('http://')!=-1||data.response.indexOf('https://')!=-1) window.location=data.response;
			else {
				$("#myModal").modal("show");
				errorMessage(data.response);
			}
		});
	});
	document.addEventListener('catchFSK', function(){
		document.getElementById("qrCatcher").style.display='none';
		document.getElementById("audioCatcher").style.display='none';
		mediascape.association.on("startAudioProcessing",function(data){
			document.getElementById("qrCatcher").style.display="none";
			document.getElementById("audioCatcher").style.display="block";
		});
		mediascape.association.doAssociation("acoustic","audioCatcherInfo").then(function(data){
			if(data.response.indexOf('http://')!=-1||data.response.indexOf('https://')!=-1) window.location=data.response;
			else {
				document.getElementById("audioCatcherInfo").innerHTML="";
				document.getElementById("audioCatcher").style.display='none';
				$("#myModal").modal({
					show: true
				});
				errorMessage(data.response)
				timeout=setTimeout(function(){
					$("#myModal").modal("hide");
				}, 5000);
			}
		});
	});

	document.addEventListener('catchSync', function(){
		document.getElementById("associationCodes").innerHTML = "";
		associationMessage(1);
		$("#myModal").modal({ show: true });
		mediascape.association.doAssociation("sync").then(function(data){
			if(data.response.indexOf('http://')!=-1||data.response.indexOf('https://')!=-1) window.location=data.response;
			else{
				errorMessage(data.response);
				timeout = setTimeout(function(){
					$("#myModal").modal("hide");
				}, 5000);
			}
		});
	});

	document.addEventListener('catchShake', function(){
		mediascape.discovery.isPresent('namedwebsockets').then(function(data){
			if(data.presence){
				mediascape.association.doAssociation("nws","mediascape").then(function(data){
					if(data.response.indexOf('http://')!=-1||data.response.indexOf('https://')!=-1) window.location=data.response;
				});
				document.getElementById("qrCatcher").style.display='block';
				document.getElementById("audioCatcher").style.display='';
				mediascape.association.on("shakeChange",function(data){
					if(data.response.show===true){
						$("#myModal").modal("show");
						if(data.response.type==="message") associationMessage(data.response.text);
						else if(data.response.type==="errorMessage") errorMessage(data.response.text);
					}else if(data.response.show===false) $("#myModal").modal("hide");
				});
				mediascape.association.on("startAudioProcessing",function(data){
					document.getElementById("qrCatcher").style.display="none";
					document.getElementById("audioCatcher").style.display="block";
				});
				mediascape.association.doAssociation("shake","qrCatcher","audioCatcherInfo").then(function(data){
					if(data.response.indexOf('http://')!=-1||data.response.indexOf('https://')!=-1) window.location=data.response;
				});
			}else{
				document.getElementById("qrCatcher").style.display='block';
				document.getElementById("audioCatcher").style.display='';
				mediascape.association.on("shakeChange",function(data){
					if(data.response.show===true){
						$("#myModal").modal("show");
						if(data.response.type==="message") associationMessage(data.response.text);
						else if(data.response.type==="errorMessage") errorMessage(data.response.text);
					}else if(data.response.show===false) $("#myModal").modal("hide");
				});
				mediascape.association.on("startAudioProcessing",function(data){
					document.getElementById("qrCatcher").style.display="none";
					document.getElementById("audioCatcher").style.display="block";
				});
				mediascape.association.doAssociation("shake","qrCatcher","audioCatcherInfo").then(function(data){
					if(data.response.indexOf('http://')!=-1||data.response.indexOf('https://')!=-1) window.location=data.response;
				});
			}
		});
	});

	$('#myModal').on('hidden.bs.modal', function () {
		if(document.getElementsByTagName('img').length!=0){
			//mediascape.association.stopFSKModulator();
			mediascape.association.stopAssociation('acoustic');
		}else mediascape.association.stopAssociation('');
	});

	function errorMessage(message){
		document.getElementsByClassName('modal-title')[0].textContent="Association Error";
		document.getElementById("associationCodes").innerHTML = "";
		if(message==1) document.getElementById("associationCodes").innerHTML = "<p>It has been impossible to Associate.</p><p>FSK asssociation is going to start in 5 seconds.</p>";
		else if(message==2) document.getElementById("associationCodes").innerHTML = "<p>It has been impossible to Associate.</p><p>QR Code is going to appear in 5 seconds.</p>";
			else if(message==3) document.getElementById("associationCodes").innerHTML = "<p>It has been impossible to Associate.</p><p>QR Code and Audio catchers are going to start in 5 seconds.</p>";
				else if(message==4) document.getElementById("associationCodes").innerHTML = "<p>Named Web Socket Proxy has not been started.</p><p>Start Named Web Socket Proxy or use other technology.</p>";
					else document.getElementById("associationCodes").innerHTML = message;
	}
	function associationMessage(message){
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
});
