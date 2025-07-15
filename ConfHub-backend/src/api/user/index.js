'use strict';

const customUser = require('./controllers/custom-user');
const customUserRoutes = require('./routes/custom-user');

module.exports = {
  controllers: {
    'custom-user': customUser,
  },
  routes: customUserRoutes.routes,
};
