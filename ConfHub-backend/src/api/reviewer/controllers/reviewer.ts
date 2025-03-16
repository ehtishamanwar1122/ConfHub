/**
 * reviewer controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::reviewer.reviewer', ({ strapi }) => ({
    async registerReviewer(ctx) {
        try {
            // Destructure the fields directly from the request body
            const { firstName, lastName, email, alternativeContact, domain,subDomain, password } = ctx.request.body;
      
           
            if (!firstName || !lastName || !email || !password ) {
              return ctx.badRequest('Missing required fields.');
            }
      console.log('reviewer', ctx.request.body);
      
           
      
           
            const existingReviwer= await strapi.query('api::reviewer.reviewer').findOne({
              where: { email:email },
            });
      
            if (existingReviwer) {
              return ctx.badRequest('Reviewer with this email already exists.');
            }
      
            
           
            const fullName = `${firstName} ${lastName}`;
            let newReviewer:any;
            const newUser = await strapi.entityService.create(
              'plugin::users-permissions.user',
              {
                data: {
                  email: email,
                  password: password, // Ensure the password is hashed automatically by Strapi
                  username: fullName,
                  confirmed:true,
                  blocked:false,
                  Type:'reviewer',
                },
              }
            );
            newReviewer = await strapi.entityService.create('api::reviewer.reviewer', {
              data: {
                firstName: firstName,
              lastName: lastName,
              authorEmail: email,
              alternativeContact: alternativeContact,
              domain:domain,
              subDoimain:subDomain,
              UserID: newUser.id,
            },
          });
          await strapi.entityService.update(
            'plugin::users-permissions.user',
            newUser.id, 
            {
              data: {
                reviewerId: newReviewer.id, 
              },
            }
          );
            
            ctx.send({
              message: 'Reviewer registered successfully!',
              reviewer: {
                firstName: newReviewer.firstName,
                lastName: newReviewer.lastName,
                email: newReviewer.authorEmail,
              },
              user: {
                username: newUser.username,
                email: newUser.email,
               
              },
            });
          } catch (error) {
            console.error('Error during registration:', error);
            ctx.internalServerError('Something went wrong while registering the author.');
          }
    
    
    },


    async loginReviewer(ctx) {
    
      const { username, password ,role} = ctx.request.body;
      
      console.log('Request Body:', ctx.request.body); // Log the request to inspect the data
      
      
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
      if (user.Type !== 'reviewer') {
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
            populate: '*', 
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
    
}));