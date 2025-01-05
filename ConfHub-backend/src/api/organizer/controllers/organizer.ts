import { factories } from '@strapi/strapi';
export default factories.createCoreController('api::organizer.organizer', ({ strapi }) => ({
    async registerOrganizer(ctx) {
      try {
        // Destructure the fields directly from the request body
        const { firstName, lastName, email, alternativeContact, affiliation, department, password } = ctx.request.body;
  
        // Validation (optional)
        if (!firstName || !lastName || !email || !password ) {
          return ctx.badRequest('Missing required fields.');
        }
  
        // Check if the passwords match
        // if (password !== confirmPassword) {
        //   return ctx.badRequest('Passwords do not match.');
        // }
  
        // Check if the organizer already exists by email
        const existingOrganizer = await strapi.query('api::organizer.organizer').findOne({
          where: { Organizer_Email:email },
        });
  
        if (existingOrganizer) {
          return ctx.badRequest('Organizer with this email already exists.');
        }
  
        // Create the new organizer (you can hash the password before saving it)
       
        const fullName = `${firstName} ${lastName}`;
        let newOrganizer:any;
        const newUser = await strapi.entityService.create(
          'plugin::users-permissions.user',
          {
            data: {
              email: email,
              password: password, // Ensure the password is hashed automatically by Strapi
              username: firstName,
              confirmed:false,
              blocked:true,
              Type:'organizer',
            },
          }
        );
        newOrganizer = await strapi.entityService.create('api::organizer.organizer', {
          data: {
          Organizer_FirstName: firstName,
          Organizer_LastName: lastName,
          Organizer_Email: email,
          Alternative_contact: alternativeContact,
          Affiliation: affiliation,
          Department: department,
          reqStatus:'pending',
          UserID: newUser.id,
        },
      });
      await strapi.entityService.update(
        'plugin::users-permissions.user',
        newUser.id, // ID of the user to update
        {
          data: {
            organizerId: newOrganizer.id, // Add the organizer ID to the user
          },
        }
      );
        // Return the new organizer (without password)
        ctx.send({
          message: 'Organizer registered successfully!',
          organizer: {
            firstName: newOrganizer.Organizer_FirstName,
            lastName: newOrganizer.Organizer_LastName,
            email: newOrganizer.Organizer_Email,
          },
          user: {
            username: newUser.username,
            email: newUser.email,
           
          },
        });
      } catch (error) {
        console.error('Error during registration:', error);
        ctx.internalServerError('Something went wrong while registering the organizer.');
      }
    },
    async loginOrganizer(ctx) {
      const { username, password ,role} = ctx.request.body;
      
      console.log('Request Body:', ctx.request.body); // Log the request to inspect the data
      
      // Step 1: Fetch user by username or email
      let user;
      try {
        user = await strapi.query('plugin::users-permissions.user').findOne({
          where: {
            $or: [
              { username }, // Check by username
              { email: username } // Or check by email
            ],
          },
        });
      } catch (err) {
       // console.error("Error fetching user:", err);
        return ctx.badRequest("Error fetching user.");
      }
      
      if (!user) {
        
        return ctx.badRequest('Invalid credentials');
      }
      if (user.Type !== 'organizer') {
        // If Type is not organizer, return an error
        return ctx.badRequest('Invalid credentials');
      }
      if (!user.confirmed  || user.blocked) {
        
        return ctx.internalServerError('Account not approved yet');
      }
      try {
        const validPassword = await strapi.plugins['users-permissions'].services.user.validatePassword(password, user.password);
        
        if (!validPassword) {
          // Password doesn't match
          return ctx.badRequest('Invalid credentials');
        }
    
        const completeUser = await strapi.entityService.findOne(
          'plugin::users-permissions.user',
          user.id, // User ID
          {
            populate: '*', // Populate all fields and relations (use specific fields for better performance)
          }
        );
        return ctx.send({
          message: 'Login successful',
          user: completeUser,
        });
      } catch (err) {
        console.error("Error during password validation:", err);
        return ctx.internalServerError("Error during password validation.");
      }
    },

    async loginAdmin(ctx) {
      const { username, password ,role} = ctx.request.body;
      
      console.log('Request Body:', ctx.request.body); // Log the request to inspect the data
      
      // Step 1: Fetch user by username or email
      let user;
      try {
        user = await strapi.query('plugin::users-permissions.user').findOne({
          where: {
            $or: [
              { username }, // Check by username
              { email: username } // Or check by email
            ],
          },
        });
      } catch (err) {
        console.error("Error fetching user:", err);
        return ctx.badRequest("Error fetching user.");
      }
      
      if (!user) {
        
        return ctx.badRequest('Invalid credentials');
      }
    
      if (user.Type !== 'admin') {
        // If Type is not organizer, return an error
        return ctx.badRequest('Invalid credentials');
      }
      try {
        const validPassword = await strapi.plugins['users-permissions'].services.user.validatePassword(password, user.password);
        
        if (!validPassword) {
          // Password doesn't match
          return ctx.badRequest('Invalid credentials');
        }
    
       
        return ctx.send({
          message: 'Login successful',
          user: user,
        });
      } catch (err) {
        console.error("Error during password validation:", err);
        return ctx.internalServerError("Error during password validation.");
      }
    },
    async updateStatus(ctx) {
      try {
        const { id, status } = ctx.request.body;
  
        if (!id || !status) {
          return ctx.badRequest('Missing required fields: id and status');
        }
  
        // Update the organizer's status
        const updatedOrganizer = await strapi.entityService.update('api::organizer.organizer', id, {
          data: {
            reqStatus: status,
          },
          populate: {
            UserID: true,
          },
        });
       console.log('up dat',updatedOrganizer);
       
        if (!updatedOrganizer) {
          return ctx.notFound('Organizer not found');
        }
  
        if (status === 'approved') {
          // Get the linked user from the organizer
          const linkedUser = (updatedOrganizer as any).UserID?.id;
          console.log('linedd',linkedUser);
          
          // Update the user's status (confirmed: true, blocked: false)
          await strapi.entityService.update('plugin::users-permissions.user', linkedUser, {
            data: {
              confirmed: true,
              blocked: false,
            },
          });
        }
    
        // Respond with the updated organizer
        ctx.send({
          message: 'Status updated successfully',
          organizer: updatedOrganizer,
        });
      } catch (error) {
        console.error('Error updating organizer status:', error);
        ctx.internalServerError('An error occurred while updating status');
      }
    },
    
  }));
  