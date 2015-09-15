# Association API #

## Navigation
[Overview][] | [Association Mechanisms][] | [API][] | [Association Automatization][] | [Examples][] | [Code Example][]

## Overview
[Top][]

The Association module is responsible of establish the communication mechanisms and protocols to perform the dynamic pairing of resources for a specific session. The major challenge of the Association module is how to provide a unique Session ID, the root of the URL to access to a concrete Shared State

This document summarizes the *Association* API to access the implemented JS library information. The target of this document is to reflect the status of design and development of the *Association* library and provide a list of available functions.

Association API drives the bootstrapping of multi-device sessions, being highly depended on the initial conditions. 
The starting point only considers the case when the multi-device session involves two devices. However, generalization to a larger number of devices can be done the same way or on a two-by-two basis.

The general functional scenario comprises this behaviour:

1. In the beginning, a first device is running some kind of app that is willing to create a multi-device experience. 
2. The app running on the first device may be a regular Web app that the user is interacting with, or an autostart app triggered by a TV or radio channel.
3. After associating, apps running on both devices are from the same origin, so both devices are interacting with the same backend endpoint.
4. In the end, the two devices should partake in the same multi-device experience, meaning that the two devices should be able to exchange messages to agree on things.

So there are two main roles:
* **Trigger**: the application instance that wants to share its session to invite others to join the same experience
* **Catcher**: the application instance that wants to join with others to the same experience

For instance, both devices could use that channel to exchange the URL of a Shared State in the case of MediaScape, or the first device may use that channel to send control commands to the second.

This way, a set of instances of a MediaScape application, without explicit or implicit user login, running on top of devices could create transparently a shared experience.

These conditions establish a common starting point:
* Both devices are connected or not to the same local area network
* Both devices may access the internet
* An app can be launched on the second device, as opposed to the device just exposing a service endpoint.
* The user is the same for both devices
* The user may easily interact with the first device (e.g. enter a code)
* The user may easily interact with the second device (e.g. enter a code)
* Both devices are in close physical proximity

---

## Association Mechanisms
[Top][]

The users need to feel that they have the power to decide the moment that he wants to pair his devices, but at the same time it is also a bit lazy, that why we have divide in two main ways to perform the pairing: Automatic and On Demand.

Being the scenario a fully public domain, without authentication pre-conditions, the acquaintance is transferred to:

	A. the capability to reach a device to the physical ISO layer (WLAN/LAN), that bridges trusted devices that could be connected, and the rest of the world that are outside this area.
	B. a common timestamped interaction that would let unequivocally distinguish synchronous actions
	C. a shared physical environment, that meet devices in close physical proximity

As can be seen in the following diagram, during the information acquisition we have identified four different ways to associate user devices using NamedWebSockets, QR codes, FSK and Shake.

![alt text](https://github.com/mediascape/WP3/blob/master/API/WP3mediascape/Association/img/highProcess.png "High Abstraction Level of Association Process")

In the above diagram can be seen the global process of the association, divided in automatic and on demand association. One system does not discriminate the other, they are complementary. In the following sections we will explain the two main processes and their subprocesses, but first of all we are going to see the necessary technologies needed for this purpose.

## API
[Top][]

In order to preserve the smoothness of the Web application, it is mandatory to perform asynchronous requests to avoid blocking the application runtime waiting for the association responses. Promises overcomes these issues by providing uniform patterns for the callbacks of asynchronous operations.

Thus, the pattern for the different **_target_** association technologies will be:

 ```javascript
 	mediascape.association.<function>("<target>",[parameters]).then(cb(returnedJSON));
 ```

And the result is a JavaScript object with this format:

 ```
 	{"response":"functionValue"}
 ```

---

### JS Association API

In this section, it is described the way the Association module will respond to the different scenarios involving dynamic association.

The complete set of JavaScript functions defined for association are listed below.

* **doAssociation**

	```javascript
		mediascape.association.doAssociation("<target>",[parameters]).then(cb(sessionJSON));
	```

	For **_triggers_** the "doAssociation" method returns the promise to *cb(sessionJSON)*, where *cb(sessionJSON)* could mean:
	* have initiated a pairing process between two devices using the suggested method, process being in no particular state
	* have broadcasted the provided URL using the suggested method
	* have found a secondary device that will load the URL
 
	For **_catchers_** the promise returned by the "doAssociation" method is resolved on the Catcher when it has received a URL to launch.
	
	This function provides association methods based in the selected technology. In this moment the are 5 different technologies to associate devices:

	* Named Web Sockets (NWS)
	
		It creates a connection via named web sockets proxy for the association of devices. The the second parameter defines the name of the channel that will be use to transmit the url passed as a parameter.

		NWS has been designed to exchange or synchronise, audio/video and data. It assumes a model where multi-device apps are browser-to-browser apps, these browsers will need to communicate one with another. While the traditional way to do this deploys an intermediary server that both browsers connect to, and which acts as a relay between them. 

		Named WebSockets, in particular, allow web pages and applications to create a communication channel in a local network based in a channel name. This communication based on WebSockets can create ad-hoc or full-duplex broadcast channels. The intermediary server that connect both browsers is a Named WebSocket Proxy and performs the following three functions:

		* Broadcast to its channel peers.
		* Discover other channel peers.
		* Establish communication channels between its own channel peers and other channel peers.

		Association API has a daemon companion that exploits a Named Web Socket proxy to find other sessions available on its LAN. In such case, the daemon send a Push Notification and the user can decide to accept or decline joining a specific party.

		![alt text](https://github.com/mediascape/WP3/blob/master/API/WP3mediascape/Association/img/nwsNative.png "Named Web Sockets Native Stack")

		This way, the association mechanism is the following one:

		1. The MediaScape app acting as trigger, creates a new session in the app.
		2. This first device broadcasts the full app URL, including the session, through a “MediaScape” Named Web Socket.
		3. Other devices running the MediaScape daemon, acting as catchers, would capture the availability of this session in the “MediaScape” Named Web Socket and push a native notification.
		4. If user accepts it a web browser is launched with the MediaScape app in the target session, starting the shared experience.

	* QR Codes

		It creates and inserts a QR Code based in the url passed as a parameter for the association of devices.

		One of the most interesting uses of those matching-readable optical labels, from the point of view of the communication, is the association between devices. 

		The development of QR code scanners in the smart devices that contain camera in combination with the codification of long strings has permitted to spread the use of this technology. Furthermore in the last years has been developed multiple kinds of actions over the content scanned, for example if the content is a url the QR code scanner will open a browser and will visit the webpage behind that url. 

		The process is based in that one of the devices shows on its screen a QR code that contains the association way and the other devices that want discovery/associate read it using a QR code scanner. It processes the image using Reed–Solomon error correction until the image can be appropriately interpreted. The required data are then extracted from patterns present in both horizontal and vertical components of the image. Ones the scanner ups the technology behind the discovery/association data, it will be done. This system in combination with an appropriated technology can become a great and effective way to discover or associate devices.

		![alt text](https://github.com/mediascape/WP3/blob/master/API/WP3mediascape/Association/img/qr.png "Qr Code")

		This way, the association mechanism is the following one:

		1. The MediaScape app acting as trigger, creates a new session in the app.
		2. Other devices running the MediaScape Association app, acting as catchers, are waiting for a specific user interaction.
		3. The user holds both devices and perform a synchronous action on both, pushing a button.
		4. The trigger app creates a QR code from the full URL, including the session.
		5. The trigger displays the QR code.
		6. The user captures the code in the catcher.
		7. The catcher decodes the QR code to find the full URLand to the catcher redirects to this URL.

	* Acoustic

		It creates an acoustic signal based on the url passed as a parameter for the association of devices.

		Audio frequency-shift keying (AFSK) is a modulation technique by which digital data is represented by changes in the frequency (pitch) of an audio tone, yielding an encoded signal suitable for transmission. It transmitted audio alternates between two tones: one, the "mark", represents a binary one; the other, the "space", represents a binary zero.

		One of the most outstanding examples of using AFSK, in the field of communication, are the most early telephone-line modems that used to use audio frequency-shift keying (AFSK) to send and receive data.

		A trigger, instance 1, would create and play a acoustic pattern with the complete URL or a temporary unique code, while other instances, catchers, record the environmental audio to detect it and traduce to the final URL.

		![alt text](https://github.com/mediascape/WP3/blob/master/API/WP3mediascape/Association/img/acoustic.png "Audio frequency-shift keying")

		This way, the association mechanism is the following one:

		1. The MediaScape app acting as trigger, creates a new session in the app.
		2. Other devices running the MediaScape Association app, acting as catchers, are waiting for a specific user interaction.
		3. The user holds both devices and perform a synchronous action on both, pushing a button.
		4. The trigger encodes this  the full URL into an acoustic FSK pattern.
		5. The catcher starts audio recording.
		6. The trigger plays the acoustic pattern.
		7. The catcher decodes the acoustic pattern.
		8. The catcher finds the full URL and redirects to this URL.

	* Sync

		This approach gains the built-in sensors from mobile devices to solve the problem of devices association. For the use of this solution it is necessary to have a centralized server which manages all the association requests and processes.

		Depending on the kind of device, the association system will start using a button or shaking the device. Once the user has shaken the device for a time lapse, the association will detect and send an association message to the server. Meanwhile, other device do the same and the daemon service opens a MediaScape application in a Web Browser that performs the association message delivery through the association. When the server detects that two devices have begun the association process during the same time and in the same area, it will associate both devices sending the same sessionID to them.

	![alt text](https://github.com/mediascape/WP3/blob/master/API/WP3mediascape/Association/img/shake.png "Shake&Go")

		This way, the association mechanism is the following one:
	
		1. The MediaScape app acting as trigger, creates a new session in the app.
		2. Other devices running the MediaScape daemon, acting as catchers, are waiting for a specific user interaction.
		3. The user holds both devices and performs a synchronous action on both, pushing a button or shaking the device itself.
		4. The trigger app sends to a central server the full URL, including the session, and the timestamp of the action and the geoposition.
		5. The catcher automatically opens a MediaScape Association app and send the timestamp of the action and the geoposition to the central server.
		6. The central server matches the different requests finding the sync timestamps and send to the trigger the full URL, as a confirmation of association successfu,l and to the catcher to redirect to this URL.

	* Text

		Function that returns url as a textual element for the association of devices.

Each technology has different needs and that is why to call each technology it is necessary to use different parameter. In addition, for most of the technologies there is implemented a trigger and a catcher.

* **stopAssociation**

The "stopAssociation" function provides the possibility to stop the association process in case that the user need it. This function has been developed for the acoustic case, but in the future the idea is to use in the technologies where it is necessary.

```javascript
	mediascape.association.stopAssociation("<target>");
```

* **on**

The "on" function catches the different events defined to notify the stage of the association proccess. With the aim of be notified has been deffined some events that permits the follow of the assocaiation preccess in Shake&Go technology.

```javascript
	mediascape.association.on('event',cb(messageJSON));
```

The event deffined till now are:

* 'shakeChange'
* 'startAudioProcessing'

Once the user has decided to detect the different events, it has to call to the event and define how is going to handle the different messages that receives.

```javascript
	mediascape.association.on('shakeChange',function(data){
		console.log(data);
	});
```
--

##Association Automatization
[Top][]

### Process Definition

The association process is divided in two types. On one hand, the automated association mechanism and on the other, on-demand association mechanisms with different levels of required explicit user actions. MediaScape Association brings a wide set of possibilities. From those users with a HW and SW stack fully compatible with MediaScape Association that can enjoy a more transparent and consistent experience. To others that will join a multidevice experience through mechanisms adapted to their HW/SW limitations.

The first step for the bootstrapping of the association process is:

	1. Trigger device already running a MediaScape app instance that broadcast the available session for candidate companion devices. This includes:
		a) to have or to access to a Mediascape Application which will broadcast the association data
	2. Catcher device that want to join the MediaScape app to expand its experience. This involves:
		a) to have or to access to a Mediascape Association app which will start the association procedure or
		b) to get installed and running a Mediascape Daemon/Service working in the background of the device (currently only available for Android) and 
		c) a Gesture/Aurial/Visual catcher application to get/match somehow the transmitted information

Concerning the association mechanisms itself, the MediaScape app is the gateway to the service and contents published. But this application will have different objectives. The developer can decide if starting with the automated association or employ one specific of the available mechanisms.

Regarding the implementation details, an Android service originally was developed to discover device capabilities, is also employed for association, especially for those protocols that the Web Browser do not support the required stack. For the QR code capturing, a javascript library is used. In the case of the Aurial catchers we have developed a tool that is able to process all audio acquired through the microphone and decode the information encoded by the method FSK fully based on javascript and HTML5 features.

The following diagram shows the pipeline for automated association processes. 

![alt text](https://github.com/mediascape/WP3/blob/master/API/WP3mediascape/Association/img/process.png "Pipeline for automated association processes")

The workflow of the pairing system is quite simple, as soon as the user connect to the webpage, the system will detect the available technologies working in the device. 

--

##Sintaxis##
[Top][]

The parameters required by the different alternatives available in the Association API are. 

* doAssociation

	* Named Web Sockets
		* Trigger

			```javascript
				mediascape.association.doAssociation("nws",channel,url,beacon).then(cb(sessionJSON));
			```
			*for the trigger the App has to get previously a groupID from the WP4 Mapping service to be broadcasted added to the baseURL*

		* Catcher

			```javascript
				mediascape.association.doAssociation("nws",channel).then(cb(sessionJSON));
			```
		Parameters:
			* *url*: full URL including the session to be employed in any device to join a shared experience on a Web application. This way, the trigger gets acceptation awareness while the catcher gets the redirecting URL
			* *channel*: string to establish a communications room ID for LAN association through NWS
			* *beacon*: boolean to enable repeatedly association message send each second

	* QR Codes
		* Trigger

			```javascript
				mediascape.association.doAssociation("qr",htmlElementID,url,short[,xsize,ysize]).then(cb(sessionJSON));
			```
			*for the trigger the App has to get previously a groupID from the WP4 Mapping service to be broadcasted added to the baseURL*
			
		* Catcher

			```javascript
				mediascape.association.doAssociation("qr",htmlElementID).then(cb(sessionJSON));
			```
		Parameters:
			* *htmlElementID*: Unique identifier of a div-like HTML tag element that will host the QR code for the Trigger or the camera capturing solution for the Catcher.
			* *url*: full URL including the session to be employed in any device to join a shared experience on a Web application. This way, the trigger gets acceptation awareness while the catcher gets the redirecting URL
			* *short*: boolean to govern the utilization of shortened URLs
			* *xsize*,*ysize*: optional dimensions of the displayed QR code

	* Acoustic
		* Trigger

			```javascript
				mediascape.association.doAssociation("acoustic",url,short).then(cb(sessionJSON));
			```
			*for the trigger the App has to get previously a groupID from the WP4 Mapping service to be broadcasted added to the baseURL*

		* Catcher

			```javascript
				mediascape.association.doAssociation("acoustic",htmlElementID).then(cb(sessionJSON));
			```
		Parameters:
			* *url*: full URL including the session to be employed in any device to join a shared experience on a Web application. This way, the trigger gets acceptation awareness while the catcher gets the redirecting URL
			* *short*: boolean to govern the utilization of shortened URLs
			* *htmlElementID*: unique identifier of a div-like HTML tag element that will host the  mic capturing solution for the Catcher.

	* Sync
		* Trigger

			```javascript
				mediascape.association.doAssociation("sync", url).then(cb(sessionJSON));
			```
			*for the trigger the App has to get previously a groupID from the WP4 Mapping service to be broadcasted added to the baseURL*
			
		* Catcher

			```javascript
				mediascape.association.doAssociation("sync").then(cb(sessionJSON));
			```
		Parameters:
			* *url*: full URL including the session to be employed in any device to join a shared experience on a Web application. This way, the trigger gets acceptation awareness while the catcher gets the redirecting URL

	* Text
		* Trigger

			```javascript
				mediascape.association.doAssociation("text",url,true).then(cb(sessionJSON));
			```
			*for the trigger the App has to get previously a groupID from the WP4 Mapping service to be broadcasted added to the baseURL*

		* Catcher
		 
			```javascript
				The Catcher would have to open the displayed URL and no function is needed.
			```
		Parameters:
			* *url*: full URL including the session to be employed in any device to join a shared experience on a Web application. This way, the trigger gets acceptation awareness while the catcher gets the redirecting URL
			* *short*: boolean to govern the utilization of shortened URLs
			
	* Shake&Go (Association Automatization pipelining several association mechanisms to minimize user interaction)
		* Trigger

			```javascript
				mediascape.association.doAssociation("shake", url).then(cb(sessionJSON));
			```

		* Catcher

			```javascript
				mediascape.association.doAssociation("shake",htmlElementID_catcherQR,htmlElementID_catcherAcoustic).then(cb(sessionJSON));
			```
		Parameters:
			* *url*: full URL including the session to be employed in any device to join a shared experience on a Web application. This way, the trigger gets acceptation awareness while the catcher gets the redirecting URL
			* *htmlElementID_catcherQR*: Unique identifier of a div-like HTML tag element that will host the camera capturing solution for the Catcher.
			* *htmlElementID_catcherAcoustic*: Unique identifier of a div-like HTML tag element that will host the mic capturing solution for the Catcher.

--

##Examples##
[Top][]

The examples that follows show the use of Association API. 

* doAssociation

	* Named Web Sockets
		* Trigger

			```javascript
				mediascape.association.doAssociation("nws",'mediascape',url,true).then(function(data){
					console.log(data);
				});
			```

		* Catcher

			```javascript
				mediascape.association.doAssociation("nws",'mediascape').then(function(data){
					console.log(data);
				});
			```

	* QR Codes
		* Trigger

			```javascript
				mediascape.association.doAssociation("qr", "qrViewer", url, true, 160, 160).then(function(data){
					console.log(data);
				});
				mediascape.association.doAssociation("qr", "qrViewer", url, true).then(function(data){
					console.log(data);
				});
			```
			
		* Catcher

			```javascript
				mediascape.association.doAssociation("qr","qrCatcher").then(function(data){
					console.log(data);
				});
			```

	* Acoustic
		* Trigger

			```javascript
				mediascape.association.doAssociation("acoustic",url,true).then(function(data){
					console.log(data);
				});
			```

		* Catcher

			```javascript
				mediascape.association.doAssociation("acoustic","aciusticCatcher").then(function(data){
				console.log(data);
			});
			```

	* Shake&Go
		* Trigger

			```javascript
				mediascape.association.doAssociation("shake", url).then(function(data){
					console.log(data);
				});
			```

		* Catcher

			```javascript
				mediascape.association.doAssociation("shake","qrCatcher","audioCatcherPlace").then(function(data){
					console.log(data);
				});
			```

	* Text
		* Trigger

			```javascript
				mediascape.association.doAssociation("text",url,true).then(function(data){
					console.log(data);
				});
			```

* stopAssociation

	```javascript
		mediascape.association.stopAssociation("acoustic").then(function(data){
			console.log(data);
		});
	```

* on

	```javascript
		mediascape.association.on('shakeChange',function(data){
			console.log(data);
		});
	```
--

##Code Example
[Top][]

* Trigger

https://github.com/mediascape/WP3/tree/master/Tests/association/Triggers

* Catcher

https://github.com/mediascape/WP3/tree/master/Tests/association/Catchers

[Top]: #navigation
[Overview]: #overview
[Association Mechanisms]: #association-mechanisms
[API]: #api
[Association Automatization]: #association-automatization
[Examples]: #examples
[Code Example]: #code-example
