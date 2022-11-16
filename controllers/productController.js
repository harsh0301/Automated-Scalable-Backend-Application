const db = require('../models')
const User = db.users;
// image Upload
const multer = require('multer')
const path = require('path')
const {
  v4: uuidv4
} = require('uuid');
const bcrypt = require('bcrypt');
const moment= require('moment');
const emailValidator = require("email-validator");
const winston = require('winston');
const logger=require("../config/logger")
const SDC = require('statsd-client')

const sdc = new SDC({host:"localhost", port:8125});
// create main Model
const Product = db.products;

const AWS = require('aws-sdk');
AWS.config.update({
    region: process.env.AWS_REGION || 'us-east-1'
});
var sns = new AWS.SNS({});
var dynamoDatabase = new AWS.DynamoDB({
    apiVersion: '2012-08-10',
    region: process.env.AWS_REGION || 'us-east-1'
});



// main work

// 1. create product

const addProduct = async (req, res) => {
  logger.info('Add a user');
  sdc.increment("endpoint.Add_user");
  var hash = await bcrypt.hash(req.body.password, 10);
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!emailRegex.test(req.body.username)) {
      logger.info("/create user 400");
      res.status(400).send({
          message: 'Enter your Email ID in correct format. Example: abc@xyz.com'
      });
  }
  const getUser = await User.findOne({
      where: {
          username: req.body.username
      }
  }).catch(err => {
      logger.error("/create user error 500");
      res.status(500).send({
          message: err.message || 'Some error occurred while creating the user'
      });
  });

  console.log('verified and existing 1');

 
  if (getUser) {
      console.log('verified and existing', getUser.dataValues.isVerified);
      var msg = getUser.dataValues.isVerified ? 'User already exists! & verified' : 'User already exists! & not verified';
      console.log('verified and existing msg' ,msg);
      
      res.status(400).send({
          message: msg
      });
  } else {
      var user = {
          id: uuidv4(),
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          password: hash,
          username: req.body.username,
          isVerified: false
      };
      console.log('above user');
      User.create(user).then(async udata => {

              const randomnanoID = uuidv4();

              const expiryTime = new Date().getTime();

              // Create the Service interface for dynamoDB
              var parameter = {
                  TableName: 'csye-6225',
                  Item: {
                      'Email': {
                          S: udata.username
                      },
                      'TokenName': {
                          S: randomnanoID
                      },
                      'TimeToLive': {
                          N: expiryTime.toString()
                      }
                  }
              };
              console.log('after user');
              //saving the token onto the dynamo DB
              try {
                  var dydb = await dynamoDatabase.putItem(parameter).promise();
                  console.log('try dynamoDatabase', dydb);
              } catch (err) {
                  console.log('err dynamoDatabase', err);
              }

              console.log('dynamoDatabase', dydb);
              var msg = {
                  'username': udata.username,
                  'token': randomnanoID
              };
              console.log(JSON.stringify(msg));

              const params = {

                  Message: JSON.stringify(msg),
                  Subject: randomnanoID,
                  TopicArn: 'arn:aws:sns:us-east-1:359745020237:verify_email'

              }
              var publishTextPromise = await sns.publish(params).promise();

              console.log('publishTextPromise', publishTextPromise);
              res.status(201).send({
                  id: udata.id,
                  first_name: udata.first_name,
                  last_name: udata.last_name,
                  username: udata.username,
                  account_created: udata.createdAt,
                  account_updated: udata.updatedAt,
                  isVerified: udata.isVerified
              });

          })
          .catch(err => {
              logger.error(" Error while creating the user! 500");
              res.status(500).send({
                  message: err.message || "Some error occurred while creating the user!"
              });
          });
    }
  };

//get single product

const getOneProduct = async (req, res) => {
    logger.info("retrieving the user details");
    sdc.increment("endpoint.Getting_userdetails");
    if (req.headers.authorization === undefined) {
      res.status(403).send();
    } else {
      //grab the encoded value, format: bearer <Token>, need to extract only <token>
      var encoded = req.headers.authorization.split(" ")[1];
      // decode it using base64
      var decoded = new Buffer(encoded, "base64").toString();
      var username = decoded.split(":")[0];
      var password = decoded.split(":")[1];
  
      // check if the passed username and password match with the values in our database.\
  
      const findUser = await User.findOne({
        where: { username: username },
      });
      if (findUser !== null) {
        if (await bcrypt.compare(password, findUser.password)) {
          let plainUser = {
            id: findUser.id,
            username: findUser.username,
            first_name: findUser.first_name,
            last_name: findUser.last_name,
            account_created: findUser.createdAt,
            account_updated: findUser.updatedAt,
          };
  
          //res.status(200).send(JSON.stringify(plainUser));
          res.status(200).json(plainUser);
        } else {
          res.status(401).send();
        }
      } else {
        res.status(400).send();
      }
    }
  };

// 4. update Product

const updateacc = async (req, res) => {
  logger.info("Updating the user details");
  sdc.increment("endpoint.updating_userdetails");
    if (req.body.id || req.body.account_created || req.body.account_updated) {
      res.status(400).send();
    } else {
      if (
        !req.body.username ||
        !req.body.first_name ||
        !req.body.last_name ||
        !req.body.password
      ) {
        res.status(400).send();
      } else {
        if (req.headers.authorization === undefined) {
          res.status(403).send();
        } else {
          //grab the encoded value, format: bearer <Token>, need to extract only <token>
          var encoded = req.headers.authorization.split(" ")[1];
          // decode it using base64
          var decoded = new Buffer(encoded, "base64").toString();
          var username = decoded.split(":")[0];
          var password = decoded.split(":")[1];
  
          const salt = await bcrypt.genSalt(10);
          const hashPassword = await bcrypt.hash(req.body.password, salt);
          // check if the passed username and password match with the values in our database.\
  
          const findUser = await User.findOne({
            where: { username: username },
          });
          if (findUser !== null) {
            if (!req.body.first_name || !req.body.last_name || !req.body.password) {
              res.status(400).send();
            } else {
              if (await bcrypt.compare(password, findUser.password)) {
                if (passValidator.validate(`${req.body.password}`)) {
                  findUser.update({
                    first_name: `${req.body.first_name}`,
                    last_name: `${req.body.last_name}`,
                    password: hashPassword,
                  });
                  res.status(204).send();
                } else {
                  res.status(400).send();
                }
              }
              res.status(401).send();
            }
          } else {
            res.status(400).send();
          }
        }
      }
    }
  };




module.exports = {
    addProduct,
    getOneProduct,
    updateacc
}