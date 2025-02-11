export default () => ({
    'users-permissions': {
      config: {
        jwt: {
          expiresIn: '7d', // Set JWT expiration time
        },
        roles: {
          default: 'authenticated', // Default role for new users
        },
      },
    },
    email: {
      provider: 'nodemailer',
      providerOptions: {
        host: 'smtp.gmail.com', // e.g., 'smtp.gmail.com'
        port: 587, // or 465 for secure connections
        secure: false, // true for 465, false for other ports
        auth: {
          user: 'mudassiralishah555@gmail.com', // your email address
          pass: 'shah5555',    // your email password
        },
      },
      settings: {
        defaultFrom: 'mudassiralishah555@gmail.com', // default sender address
        defaultReplyTo: 'mudassiralishah555@gmail.com', // default reply-to address
      },
    },
  });