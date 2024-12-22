export default {
    routes: [
      {
        method: 'POST',
        path: '/organizers/register', // Custom endpoint for registration
        handler: 'organizer.registerOrganizer',
        config: {
          auth: false, // Disable authentication for this specific endpoint (if needed)
        },
      },
      {
        method: 'POST',
        path: '/organizers/login', // Custom endpoint for registration
        handler: 'organizer.loginOrganizer',
        config: {
          auth: false, // Disable authentication for this specific endpoint (if needed)
        },
      },
    ],
  };