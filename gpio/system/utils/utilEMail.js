/*jslint node: true */
/*jshint strict:false */
'use strict';

var fs = require('fs');
var path = require('path');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var nodemailer = require("nodemailer");
var xoauth2 = require('xoauth2');

// https://developers.google.com/drive/v3/web/quickstart/nodejs
// http://masashi-k.blogspot.pt/2013/06/sending-mail-with-gmail-using-xoauth2.html
// http://stackoverflow.com/questions/35704117/how-to-automatically-get-the-authorization-token-for-node-google-apis-for-gmail

// http://www.thesnoopybub.com/blog/tag/nodemailer/
// https://github.com/nodemailer/nodemailer
// http://adilapapaya.com/docs/nodemailer/

var utilEMail = {


  SCOPES : function () {

    // If modifying these scopes, delete your previously saved credentials
    // at ~/.credentials/gmail-nodejs-gpio.json
    // var SCOPES = ['https://www.googleapis.com/auth/gmail.labels',
    //               'https://www.googleapis.com/auth/gmail.compose',
    //               'https://www.googleapis.com/auth/gmail.send',
    //               'https://mail.google.com/']
    var __SCOPES = ['https://www.googleapis.com/auth/gmail.send',
                  'https://mail.google.com/'];

    return __SCOPES;
  },


  TOKEN_DIR : function () {

    //    var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    //        process.env.USERPROFILE) + '/.credentials/';
    var __TOKEN_DIR = path.resolve(__dirname, '..', '..');
    __TOKEN_DIR = path.join(__TOKEN_DIR, '/.credentials/');

    return __TOKEN_DIR;
  },


  TOKEN_PATH : function () {

    var self = this;
/*
    // it not works on RPi
    var __TOKEN_PATH =  path.format({
                 dir  : self.TOKEN_DIR(),
                 base : 'gmail-nodejs-gpio.json'
               });
*/
    var __TOKEN_PATH = self.TOKEN_DIR() + 'gmail-nodejs-gpio.json';

    console.log('--- ' + __TOKEN_PATH);
//    throw Error();
    return __TOKEN_PATH;
  },


  generateAuthUrl : function (credentials, urlIndex) {

    var self = this;

    var clientSecret = credentials.installed.client_secret;
    var clientId = credentials.installed.client_id;
    var redirectUrl = credentials.installed.redirect_uris[0];
    var auth = new googleAuth();

    // to select the url to redirect
    if (credentials.installed.redirect_uris.length > urlIndex) {
      redirectUrl = credentials.installed.redirect_uris[urlIndex];
    }

    var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

    var authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: self.SCOPES()
    });

    return authUrl;
  },  // generateAuthUrl


  processCode : function (code, credentials, urlIndex) {

    var self = this;

    var clientSecret = credentials.installed.client_secret;
    var clientId = credentials.installed.client_id;
    var redirectUrl = credentials.installed.redirect_uris[0];
    var auth = new googleAuth();

    // to select the url to redirect
    if (credentials.installed.redirect_uris.length > urlIndex) {
      redirectUrl = credentials.installed.redirect_uris[urlIndex];
    }

    var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;

//      console.log('oauth --->' + oauth2Client);

      self.storeToken(token);
    });

  },  // storeToken


  storeToken : function (token) {

    var self = this;

    /**
     * Store token to disk be used in later program executions.
     *
     * @param {Object} token The token to store to disk.
     */

      try {
        fs.mkdirSync(self.TOKEN_DIR());
      } catch (err) {
        if (err.code != 'EEXIST') {
          throw err;
        }
      }
      fs.writeFile(self.TOKEN_PATH(), JSON.stringify(token));
      console.log('Token stored to ' + self.TOKEN_PATH());
  },


  getAuhorization: function () {

    var self = this;

    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     *
     * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
     * @param {getEventsCallback} callback The callback to call with the authorized
     *     client.
     */
    function getNewToken(oauth2Client, callback) {
      var authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: self.SCOPES()
      });
      console.log('Authorize this app by visiting this url: ', authUrl);
      var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      rl.question('Enter the code from that page here: ', function(code) {
        rl.close();
        oauth2Client.getToken(code, function(err, token) {
          if (err) {
            console.log('Error while trying to retrieve access token', err);
            return;
          }
          oauth2Client.credentials = token;
          console.log('oauth --->' + oauth2Client);
          self.storeToken(token);
          callback(oauth2Client);
        });
      });
    }

    /**
     * Lists the labels in the user's account.
     *
     * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
     */
    function listLabels(auth) {
      var gmail = google.gmail('v1');
      gmail.users.labels.list({
        auth: auth,
        userId: 'me',
      }, function(err, response) {
        if (err) {
          console.log('The API returned an error: ' + err);
          return;
        }
        var labels = response.labels;
        if (labels.length == 0) {
          console.log('No labels found.');
        } else {
          console.log('Labels:');
          for (var i = 0; i < labels.length; i++) {
            var label = labels[i];
            console.log('- %s', label.name);
          }
        }
      });
    }


    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     *
     * @param {Object} credentials The authorization client credentials.
     * @param {function} callback The callback to call with the authorized client.
     */

    function authorize(credentials, callback) {
      var clientSecret = credentials.installed.client_secret;
      var clientId = credentials.installed.client_id;
      var redirectUrl = credentials.installed.redirect_uris[0];
      var auth = new googleAuth();
      var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

      // Check if we have previously stored a token.
      fs.readFile(self.TOKEN_PATH(), function(err, token) {
        if (err) {
          getNewToken(oauth2Client, callback);
        } else {
          oauth2Client.credentials = JSON.parse(token);
          callback(oauth2Client);
        }
      });
    }

    // Load client secrets from a local file.
    fs.readFile('client_secret.json', function processClientSecrets(err, content) {
      if (err) {
        console.log('Error loading client secret file: ' + err);
        return;
      }

      // Authorize a client with the loaded credentials, then call the
      // Drive API.
      console.log(content);
      authorize(JSON.parse(content), listLabels);
    });

  },  //  getAuhorization


  readClientSecret : function (OnSuccessCallback) {

    // Load client secrets from a local file.
    fs.readFile('client_secret.json', function processClientSecrets(err, content) {
      if (err) {
        console.log('Error loading client secret file: ' + err);
        return;
      }

      OnSuccessCallback(JSON.parse(content));
    });   // readFile

  },


  sendEMail : function (message) {

    var self = this;

    // Load client secrets from a local file.
    fs.readFile('client_secret.json', function processClientSecrets(err, content) {
      if (err) {
        console.log('Error loading client secret file: ' + err);
        return;
      }

      var secrets = JSON.parse(content).installed;

      fs.readFile(self.TOKEN_PATH(), function processClientSecrets(err, content) {
        if (err) {
          console.log('Error loading client secret file: ' + err);
          return;
        }

        var tokens = JSON.parse(content);
        console.log(tokens);

        // login
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                xoauth2: xoauth2.createXOAuth2Generator({
                    user: process.env.USER,
                    clientId: secrets.client_id,
                    clientSecret: secrets.client_secret,
                    refreshToken: tokens.refresh_token,
                    // optional
                    accessToken: tokens.access_token,
                    timeout: 3600
                })
            }
        });

        var transporter2 = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.USER,     // Your email id
                pass: process.env.PASSWORD  // Your password
            }
        });

        var mailOptions = {
          from: 'Do Not Replay <process.env.TO>',
//          sender: 'rossa.jmr@gmail.com',
          to:      process.env.TO,
          subject: global.lang.mailSubject,
          text:    message,
          // generateTextFromHTML: true,
          // html: "<b>Hello world</b>"
        };

        // https://support.google.com/mail/answer/14257
        transporter.sendMail(mailOptions, function(error, response) {
          if (error) {
            console.log(error);
          } else {
            console.log(response);
          }

          transporter.close();
        });

      });   // readFile
    });   // readFile

  }  //  sendEMail

};


module.exports = utilEMail;
