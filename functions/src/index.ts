import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);

import * as graph from './modules/graph';
import * as users from './modules/users';
import * as notifications from './modules/notifications';

exports.graph = graph;
exports.users = users;
exports.notifications = notifications;
