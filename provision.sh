#!/bin/sh


sudo apt-get update

# install git
sudo apt-get -y install git

sudo apt-get -y install nodejs

sudo apt-get -y install npm


echo "mysql-server mysql-server/root_password password root" | debconf-set-selections
echo "mysql-server mysql-server/root_password_again password root" | debconf-set-selections

sudo apt-get install -y mysql-server

sudo apt-get install -y mysql-client

sudo npm install -g nvm

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

sudo npm install pleiades

sudo npm install twig

sudo npm install nodemon