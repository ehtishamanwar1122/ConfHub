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
  });