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

sudo npm i pm2
sudo npm i -g pm2
cd ~/ && unzip webapp.zip -d webapp
cd ~/webapp && npm i
sudo pm2 start server.js
sudo pm2 startup systemd

wget https://s3.us-east-1.amazonaws.com/amazoncloudwatch-agent-us-east-1/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
#install it
sudo dpkg -i -E ./amazon-cloudwatch-agent.deb
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
    -a fetch-config \
    -m ec2 \
    -c file:/home/ubuntu/webapp/cloudwatch-config.json \
    -s

sudo pm2 start server.js
sudo pm2 startup systemd


