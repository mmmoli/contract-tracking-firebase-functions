import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);

import * as graph from './modules/graph';
import * as users from './modules/users';
import * as sms from './modules/sms';
import * as email from './modules/email';

exports.graph = graph;
exports.users = users;
exports.sms = sms;
exports.email = email;
