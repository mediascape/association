#Server

This folder contains the example of the server that will be use in the Association example web pages.

## Navigation
[Installation][] | [Run][] 


## Installation
Before you can start:
* Install node.js and npm
* Install mongodb
* start mongodb
* download this package

To install all needed dependencies run
```bash
    npm install
```
next to the `package.json`. Then simply run
```bash
    sudo node index.js
```
to start the server.

Inside public folder you will have to deploy the service that you wanna present. The name of the service folder will be the path to access the service.

## Deployment

In the helloworld[../helloworld] folder you will find the right way to deploy the full example with the Catchers and Triggers services to test the Association service.

## Run

Open a browser an go to:

http://localIP:7000/ServiceFolderName/

[Installation]: #installation
[Run]: #run
