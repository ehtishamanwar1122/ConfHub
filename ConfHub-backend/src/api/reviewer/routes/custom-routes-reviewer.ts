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
      {
        method: 'POST',
        path: '/reviewers/reviewRequest', 
        handler: 'reviewer.requestReview',
        config: {
          auth: false, 
        },
      },
      {
        method: 'POST',
        path: '/reviewers/reviewSubmit', 
        handler: 'reviewer.submitReview',
        config: {
          auth: false, 
        },
      },
      
     
    ]
  };