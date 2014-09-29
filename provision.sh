#!/bin/sh


sudo apt-get update

# install git
sudo apt-get -y install git

sudo apt-get -y install nodejs

sudo apt-get -y install npm

sudo npm install -g nvm

cd /vagrant

sudo npm install express

sudo npm install pleiades

sudo npm install twig