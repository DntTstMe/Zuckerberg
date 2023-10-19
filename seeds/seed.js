require('dotenv').config();
const mongoose = require('mongoose');
const db = require('../config/connection');

const User = require('../models/User');
const Thought = require('../models/Thought');

const userData = [
    {
        username: 'user1',
        email: 'user1@example.com',
    },
    {
        username: 'user2',
        email: 'user2@example.com',
    }
];

const thoughtData = [
    {
        thoughtText: 'This is a thought',
        username: 'user1',
        reactions: [
            {
                reactionBody: 'This is a reaction',
                username: 'user2'
            }
        ]
    },
    {
        thoughtText: 'This is another thought',
        username: 'user2',
        reactions: [
            {
                reactionBody: 'This is another reaction',
                username: 'user1'
            }
        ]
    }
];

db.connectDatabase()
    .then(() => {
        return User.deleteMany({});
    })
    .then(() => {
        return Thought.deleteMany({}); 
    })
    .then(() => {
        return User.insertMany(userData);
    })
    .then(() => {
        return Thought.insertMany(thoughtData);
    })
    .then(data => {
        console.log('Data seeded!');
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });