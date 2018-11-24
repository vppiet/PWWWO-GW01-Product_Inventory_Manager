'user strict'

process.env['NODE_CONFIG_DIR'] = __dirname + '/../config/';
const config = require('config');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const saltRounds = 10;

function getConnectionString() {
    return new Promise((resolve, reject) => {
        if (!config.has('database.connectionstring')) {
            reject('Connection string not found.');
        }
        else {
            let connString = config.get('database.connectionstring')
            resolve(connString);
        }
    });
}

getConnectionString()
.then((connectionString) => {
    mongoose.connect(connectionString, (err) => {
        if (err) { throw err; };
        console.log('Connected to database.');
    
        let userArgs = process.argv.slice(2);
        
        if (userArgs.length != 2) {
            console.log('Please provide exactly two arguments: username password');
        }
        else {
            let username = userArgs[0],
                password = userArgs[1];
        
            bcrypt.hash(password, saltRounds)
            .then((passwordHash) => {
                let newUser = new User({
                    username:   username,
                    hash:       passwordHash
                });
        
                newUser.save((err) => {
                    if (err) { return console.log('Error while saving user to database.'); }
                    console.log(`New user ${username} created.`);
                    mongoose.disconnect(() => {
                        console.log('Disconnected from database.');
                    });
                });
            });
        }
    });
})
.catch((reason) => {
    console.log('Error:', reason);
});
