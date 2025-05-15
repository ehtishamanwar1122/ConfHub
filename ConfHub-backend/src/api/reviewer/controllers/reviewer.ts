/**
 * reviewer controller
 */
const sendEmail = require('../../email/email');
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
    async requestReview(ctx) {
      try {
        const { paperId, reviewerId, status } = ctx.request.body;
    
        console.log("Request Body:", ctx.request.body);
        const reviewer = await strapi.entityService.findOne('api::reviewer.reviewer', reviewerId, {
          fields: ['email', 'firstName', 'lastName'],
        });
        
        const reviewerEmail = reviewer?.email;
        
        if (!reviewerEmail) {
          return ctx.throw(400, 'Reviewer email not found');
        }
        const updatedPaper = await strapi.db.query("api::paper.paper").update({
          where: { id: paperId },
          data: {
            reviewRequests: {
              connect: [{ id: reviewerId }], 
            },
          },
        });
        const paperTitle= updatedPaper.Paper_Title;
        await sendEmail(
          reviewerEmail,
          'Your Request for Paper Review Revieved',
          `Hello, Your request to review paper with title "${paperTitle}" is recieved now wait for Organizer decision for further actions.`,
          `<p>Hello,</p><p>Hello, Your request to review paper with title <strong>${paperTitle}</strong> is recieved now wait for Organizer decision for further actions. `
        );
        return ctx.send({
          message: "Request received successfully!",
          paper: updatedPaper,
        });
      } catch (error) {
        console.error("Error processing review request:", error);
    
        return ctx.badRequest("Failed to process review request");
      }
    },
    async submitReview(ctx) {
      try {
        const { comments, recommendation, score ,paperId,reviewerId,significance,overall,presentation,originality} = ctx.request.body;
    
        console.log("Request Body:", ctx.request.body);
        const reviewer = await strapi.entityService.findOne('api::reviewer.reviewer', reviewerId, {
          fields: ['email', 'firstName', 'lastName'],
        });
        
        const reviewerEmail = reviewer?.email;
        
        if (!reviewerEmail) {
          return ctx.throw(400, 'Reviewer email not found');
        }
        const review = await strapi.entityService.create('api::review.review', {
          data: {
            Comments: comments,
          Recommendations: recommendation,
          // Score: score,
          paper: paperId,
          reviewer:reviewerId,
          overall:overall,
          originality:originality,
          presentation:presentation,
          significance:significance
        },
      });
      const updatedPaper = await strapi.db.query("api::paper.paper").update({
        where: { id: paperId },
        data: {
          reviewRequestsConfirmed: {
            disconnect: [{ id: reviewerId }],
          },
        },});
        const paperTitle= updatedPaper.Paper_Title;
        await sendEmail(
          reviewerEmail,
          'Review Submitted Sussessfully',
          `Hello, your review for paper "${paperTitle}"  is recieved.`,
          `<p>Hello,</p><p>Hello, Your review for paper <strong>${paperTitle}</strong> is recieved. `
        );
       
        return ctx.send({
          message: "Request received successfully!",
         
        });
      } catch (error) {
        console.error("Error processing review request:", error);
    
        return ctx.badRequest("Failed to process review request");
      }
    },
    
    
}));