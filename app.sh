#!/bin/bash

sleep 30
sudo apt-get update -y
# sudo amazon-linux-extras install php8.0 mariadb10.5
# sudo apt-get install -y httpd


sudo apt-get install zip unzip
sudo apt update && sudo apt install --assume-yes curl
curl --silent --location https://deb.nodesource.com/setup_16.x  | sudo bash -

sudo apt-get install mysql -y

sudo apt-get install -y nodejs
sudo apt-get install -y gcc g++ make

cd ~/ && unzip webapp.zip
cd ~/webapp && npm i


mkdir /tmp/ssm
cd /tmp/ssm
wget https://s3.us-east-1.amazonaws.com/amazon-ssm-us-east-1/latest/debian_amd64/amazon-ssm-agent.deb
sudo dpkg -i amazon-ssm-agent.deb
sudo systemctl start snap.amazon-ssm-agent.amazon-ssm-agent.service
sudo snap start amazon-ssm-agent
sudo systemctl status amazon-ssm-agent


sudo npm i pm2
sudo npm i -g pm2
sudo pm2 start server.js
sudo pm2 startup systemd


