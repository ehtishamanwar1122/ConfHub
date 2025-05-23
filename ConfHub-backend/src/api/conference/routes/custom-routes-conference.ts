export default {
    routes: [
     
      {
        method: 'POST',
        path: '/conference/create-conference', // Custom endpoint for registration
        handler: 'conference.createConference',
       
      },
      {
        method: 'PUT',
        path: '/conference/update-status',
        handler: 'conference.updateStatus',
        config: {
          auth: false, // Set to true if authentication is required
          policies: [],
        },
      },
      {
        method: 'POST',
        path: '/conferences/updateSubmissiondate',
        handler: 'conference.updateSubmissiondate',
       
      },
      {
        method: 'POST',
        path: '/conferences/updateReviewDeadline',
        handler: 'conference.updateReviewDeadline',
       
      },
    ],
  };