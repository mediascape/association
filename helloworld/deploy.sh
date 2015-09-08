#!/bin/bash

FolderPath=$(pwd)
echo $FolderPath
InstallFolder=$FolderPath/deploy
echo $InstallFoleder

Folder=/tmp #Folder=./application-context


##### check name of node.js
nodeCommand=node
if [ -f /usr/bin/nodejs ]; then
	nodeCommand=nodejs
fi
#####

cd $Folder

if [ ! -d $Folder/discovery-self ];
then
	echo "Cloning discovery-self repository..."
	git clone https://github.com/mediascape/discovery-self
else
	echo "Checking for discovery-self repository updates..."
	cd $Folder/discovery-self
	git pull
	cd ..
fi

if [ ! -d $Folder/application-context ];
then
	echo "Cloning application-context repository..."
	git clone https://github.com/mediascape/application-context
else
	echo "Checking for application-context repository updates..."
	cd $Folder/application-context
	git pull
	cd ..
fi

if [ ! -d $Folder/discovery-multi ];
then
	echo "Cloning discovery-multi repository..."
	git clone https://github.com/mediascape/discovery-multi
else
	echo "Checking for discovery-multi repository updates..."
	cd $Folder/discovery-multi
	git pull
	cd ..
fi

if [ ! -d $Folder/association ];
then
	echo "Cloning discovery-multi repository..."
	git clone https://github.com/mediascape/association
else
	echo "Checking for discovery-multi repository updates..."
	cd $Folder/association
	git pull
	cd ..
fi

cd $InstallFoleder

### TODO - maybe keep other old files??
if [ -d $InstallFolder/ ]; then
	if [ -d $InstallFolder/node_modules/ ]; then
		mkdir $InstallFolder/temp/
		mkdir $InstallFolder/temp/node_modules/
		mv $InstallFolder/node_modules/* $InstallFolder/temp/node_modules/
	fi
		rm -r $InstallFolder/
fi

mkdir $InstallFolder/
cd $InstallFolder/
echo "Copy needed files from repository..."
cp -R $Folder/association/Server/* $InstallFolder/
cp -R $Folder/association/helloworld/* $InstallFolder/public/

cp -R $Folder/application-context/API/* $InstallFolder/public/Triggers/js/
cp -R $Folder/discovery-self/API/mediascape/Discovery $InstallFolder/public/Triggers/js/mediascape/
cp -R $Folder/discovery-self/API/mediascape/Discovery $InstallFolder/public/Catchers/js/mediascape/
cp -R $Folder/association/API/mediascape/Association $InstallFolder/public/Triggers/js/mediascape/
cp -R $Folder/association/API/mediascape/Association $InstallFolder/public/Catchers/js/mediascape/
cp -R $Folder/discovery-multi/API/mediascape/* $InstallFolder/public/Triggers/js/mediascape/
cp -R $Folder/association/API/mediascape/lib/* $InstallFolder/www/Triggers/js/lib/
cp -R $Folder/association/API/mediascape/lib/* $InstallFolder/www/Catchers/js/lib/

if [ -d temp/node_modules/ ]; then
	mkdir $InstallFolder/node_modules/
	mv $InstallFolder/temp/node_modules/* $InstallFolder/node_modules/
	rm -r $InstallFolder/temp/
fi

cd $InstallFolder/
echo "Starting setup Script..."
$nodeCommand setup.js
echo "Installing dependencies..."
npm install
echo "Start the Node.js Server..."
$nodeCommand index.js
