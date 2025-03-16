export default {
    routes: [
      {
        method: 'POST',
        path: '/reviewers/register', 
        handler: 'reviewer.registerReviewer',
        config: {
          auth: false,
        },
      },
      {
        method: 'POST',
        path: '/reviewers/login', 
        handler: 'reviewer.loginReviewer',
        config: {
          auth: false, 
        },
      },
      
     
    ]
  };