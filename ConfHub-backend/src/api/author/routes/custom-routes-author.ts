export default {
    routes: [
      {
        method: 'POST',
        path: '/author/register', // Custom endpoint for registration
        handler: 'author.registerAuthor',
        config: {
          auth: false, // Disable authentication for this specific endpoint (if needed)
        },
      },
      {
        method: 'POST',
        path: '/author/authorLogin', // Custom endpoint for registration
        handler: 'author.loginAuthor',
        config: {
          auth: false, // Disable authentication for this specific endpoint (if needed)
        },
      },
     
    ],
  };