##Association Hello World

This HelloWorld shows the association library developed for the [MediaScape project](http://mediascapeproject.eu/) in action.

## Navigation
[Installation][] | [Prerequisite][] | [Deployment][]  | [Run][]

###Installation
####Prerequisite
* Install git
```sh
sudo apt-get install git
```
* Install npm
```sh
sudo apt-get install npm
```
* Go to https://nodejs.org/en/download/ and download and install node.js source code's last version.

```sh
cd node-v0.X.X
./configure
make
make install
```
* Install mongodb
```sh
sudo apt-get install mongodb-org
```
* Start mongodb
```sh
mongod
```
* Download Association repository:
```sh
    git clone https://github.com/mediascape/association.git
```

####Deployment

Next to this file you will find a script called `deploy.sh`.
This script will clone the git and install everything in a folder called `deploy` relative to the file itsself. It will copy the [server](../Server) and the [API](../API) including this HelloWorld sample. After preparing the files, the script will install all needed dependencies for the backend and start a small setup-script to configure it.
```sh
Once the system has been deployed, you have to set your bit.ly user and password in "deploy/public/Catchers/js/mediascape/Association/association.js" and "deploy/public/Triggers/js/mediascape/Association/association.js" files to could short the URLs in the shorten processes.
```
Please dont execute it inside the git folder. Best practice is to download just the the `.sh` file and execute.

### run
After everything is set up, and the node.js server is started, you can access the Catcher and Trigger demos using the urls (depending on your setup): 
```
    http://localIP:7000/Triggers/
    http://localIP:7000/Catchers/

```
When the page is loaded, it should show you the detected components and capabilities of your current device.
Starting another Browser with the same URL this data will be shared via the applicationContext between all sessions.


Any time later you can start the node.js server via:

```bash
node index.js
```

[Installation]: #installation
[Prerequisite]: #prerequisite
[Deployment]: #deployment
[Run]: #run
