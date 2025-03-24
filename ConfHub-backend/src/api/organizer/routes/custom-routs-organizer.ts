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
      {
        method: 'POST',
        path: '/organizers/Adminlogin', // Custom endpoint for registration
        handler: 'organizer.loginAdmin',
        config: {
          auth: false, // Disable authentication for this specific endpoint (if needed)
        },
        
      },
      {
        method: 'PUT',
        path: '/organizers/update-status',
        handler: 'organizer.updateStatus',
        config: {
          auth: false, // Set to true if authentication is required
          policies: [],
        },
      },
      {
        method: 'POST',
        path: '/organizers/ConfirmReviewRequest', // Custom endpoint for registration
        handler: 'organizer.confirmReviewRequest',
        config: {
          auth: false, // Disable authentication for this specific endpoint (if needed)
        },
        
      },
      {
        method: 'POST',
        path: '/organizers/RejectReviewRequest', // Custom endpoint for registration
        handler: 'organizer.rejectReviewRequest',
        config: {
          auth: false, // Disable authentication for this specific endpoint (if needed)
        },
        
      },
    ],
  };