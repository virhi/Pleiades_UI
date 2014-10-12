#!/usr/bin/env bash


sudo apt-get update

# install git
sudo apt-get -y install git

sudo apt-get -y install nodejs

sudo apt-get -y install npm

sudo npm install -g nvm

sudo ln -s /usr/bin/nodejs /usr/local/bin/node

# Configuring alias
cat <<EOT >/home/vagrant/.bashrc_alias
alias node='nodejs'
EOT

if [ `grep -c "source /home/vagrant/.bashrc_alias" /home/vagrant/.bashrc` -eq 0 ]
then
    echo "source /home/vagrant/.bashrc_alias" >>/home/vagrant/.bashrc
fi

cd /vagrant

sudo npm install express

sudo npm install twig

sudo npm install bootstrap

sudo npm install chokidar

sudo npm install rsvp
