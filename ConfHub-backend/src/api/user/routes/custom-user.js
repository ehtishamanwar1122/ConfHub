module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/users/change-password',
      handler: 'custom-user.changePassword',
      config: {
        auth: true, // requires user to be logged in
      },
    },
  ],
};
