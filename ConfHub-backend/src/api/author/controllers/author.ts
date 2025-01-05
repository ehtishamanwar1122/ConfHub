/**
 * author controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::author.author', ({ strapi }) => ({
    async registerAuthor(ctx) {
        
        try {
            // Destructure the fields directly from the request body
            const { firstName, lastName, email, alternativeContact, country,biography,researchInterests, password } = ctx.request.body;
      
            // Validation (optional)
            if (!firstName || !lastName || !email || !password ) {
              return ctx.badRequest('Missing required fields.');
            }
      console.log('authorr', ctx.request.body);
      
           
      
            // Check if the organizer already exists by email
            const existingAuthor= await strapi.query('api::author.author').findOne({
              where: { authorEmail:email },
            });
      
            if (existingAuthor) {
              return ctx.badRequest('Organizer with this email already exists.');
            }
      
            // Create the new organizer (you can hash the password before saving it)
           
            const fullName = `${firstName} ${lastName}`;
            let newAuthor:any;
            const newUser = await strapi.entityService.create(
              'plugin::users-permissions.user',
              {
                data: {
                  email: email,
                  password: password, // Ensure the password is hashed automatically by Strapi
                  username: fullName,
                  confirmed:true,
                  blocked:false,
                  Type:'author',
                },
              }
            );
            newAuthor = await strapi.entityService.create('api::author.author', {
              data: {
                firstName: firstName,
              lastName: lastName,
              authorEmail: email,
              alternativeContact: alternativeContact,
              country:country,
              biography:biography,
              researchInterest:researchInterests,
              UserID: newUser.id,
            },
          });
          await strapi.entityService.update(
            'plugin::users-permissions.user',
            newUser.id, // ID of the user to update
            {
              data: {
                authorId: newAuthor.id, // Add the organizer ID to the user
              },
            }
          );
            // Return the new organizer (without password)
            ctx.send({
              message: 'Author registered successfully!',
              author: {
                firstName: newAuthor.firstName,
                lastName: newAuthor.lastName,
                email: newAuthor.authorEmail,
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
    async loginAuthor(ctx) {
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
            if (user.Type !== 'author') {
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
    
}));
