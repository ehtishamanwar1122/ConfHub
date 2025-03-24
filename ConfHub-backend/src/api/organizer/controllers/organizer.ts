import { factories } from '@strapi/strapi';
//import path from 'path';
//const { sendEmail } = require(path.resolve(__dirname, '../../../api/email/email'));
const nodemailer = require('nodemailer');

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
  
        // Create the new organizer
       
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
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'mudassiralishah555@gmail.com',  // Your Gmail address
          pass: 'mfrm qmsz yiey pgzp',   // Your Gmail password (or App Password if 2FA is enabled)
        },
      });
      
      // Function to send email
      const sendEmail = async (to, subject, text, html) => {
        const mailOptions = {
          from: 'mudassiralishah555@gmail.com',    // Sender address
          to,                              // Recipient address
          subject,                         // Subject line
          text,                            // Plain text body
          html,                            // HTML body
        };
      
        try {
          await transporter.sendMail(mailOptions);
          console.log('Email sent successfully');
        } catch (error) {
          console.error('Error sending email:', error);
        }
      };
      await sendEmail(
        email,
        'Your Account has been created',
        'Hello, Your request for a organizer account in Confhub  has been recieved now wait for the admin approval to login to your account.  ',
        `<p>Hello,</p><p>Your request for a organizer account in Confhub  has been recieved now wait for the admin's approval to login to your account.</p>`
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
        if (!updatedOrganizer) {
          return ctx.notFound('Organizer not found');
        }
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'mudassiralishah555@gmail.com',  // Your Gmail address
            pass: 'mfrm qmsz yiey pgzp',   // Your Gmail password (or App Password if 2FA is enabled)
          },
        });
        
        // Function to send email
        const sendEmail = async (to, subject, text, html) => {
          const mailOptions = {
            from: 'mudassiralishah555@gmail.com',    // Sender address
            to,                              // Recipient address
            subject,                         // Subject line
            text,                            // Plain text body
            html,                            // HTML body
          };
        
          try {
            await transporter.sendMail(mailOptions);
            console.log('Email sent successfully');
          } catch (error) {
            console.error('Error sending email:', error);
          }
        };
        
    
        if (status === 'approved') {
          // Get the linked user from the organizer
          const linkedUser = (updatedOrganizer as any).UserID?.id;
          const userEmail = (updatedOrganizer as any).UserID?.email;
      const loginUrl = 'http://localhost:5173/login';
          console.log('linedd',linkedUser);
          
          // Update the user's status (confirmed: true, blocked: false)
          await strapi.entityService.update('plugin::users-permissions.user', linkedUser, {
            data: {
              confirmed: true,
              blocked: false,
            },
          });
         await sendEmail(
        userEmail,
        'Your Account has been Approved',
        'Hello, Your request for a organizer account in Confhub  has been approved by the admin. You can now log in to your account using the following link: ' + loginUrl,
        `<p>Hello,</p><p>Your request for a organizer account in Confhub  has been approved by the admin. You can now log in to your account using the following link:</p><a href="${loginUrl}">${loginUrl}</a>`
      );
        }
        if (status === 'rejected') {
          const userEmail = (updatedOrganizer as any).UserID?.email;
          await sendEmail(
            userEmail,
            'Your Account has been Rejected',
            'Hello, Your request for a organizer account in Confhub  has been rejected by the admin. ',
            `<p>Hello,</p><p>Your request for a organizer account in Confhub  has been rejected by the admin </p>`
          );
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
    async confirmReviewRequest(ctx) {
      const { paperId, reviewerId } = ctx.request.body;
      const reviewer = await strapi.entityService.findOne('api::reviewer.reviewer', reviewerId, {
        populate:'*',
    });
const reviewerEmail=reviewer.email;
    if (!reviewer) {
        return ctx.badRequest("Reviewer not found.");
    }
      console.log('Request Body:', ctx.request.body); // Log the request to inspect the data
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'mudassiralishah555@gmail.com',  // Your Gmail address
          pass: 'mfrm qmsz yiey pgzp',   // Your Gmail password (or App Password if 2FA is enabled)
        },
      });
      
      // Function to send email
      const sendEmail = async (to, subject, text, html) => {
        const mailOptions = {
          from: 'mudassiralishah555@gmail.com',    // Sender address
          to,                              // Recipient address
          subject,                         // Subject line
          text,                            // Plain text body
          html,                            // HTML body
        };
      
        try {
          await transporter.sendMail(mailOptions);
          console.log('Email sent successfully');
        } catch (error) {
          console.error('Error sending email:', error);
        }
      };
      
      try {
        //for reviewr collection typee
        const AssignPaperToReviewer = await strapi.db.query("api::reviewer.reviewer").update({
          where: { id: reviewerId },
          data: {
            AssignedPapers: {
              connect: [{ id: paperId }], 
            },
          },
        });
        //for paper collection type
        const ConfirmReviewRequest = await strapi.db.query("api::paper.paper").update({
          where: { id: paperId },
          data: {
            reviewRequestsConfirmed: {
              connect: [{ id: reviewerId }], 
            },
          },
        });
        const updatedPaper = await strapi.db.query("api::paper.paper").update({
          where: { id: paperId },
          data: {
            reviewRequests: {
              disconnect: [{ id: reviewerId }],
            },
          },
          populate: ['reviewRequests'], // Ensure the updated data is returned
        });
        await sendEmail(
          reviewerEmail,
          `Your request for paper review with title "${updatedPaper.Paper_Title}" has been Approved`,
          `Hello, Your request to review the paper titled "${updatedPaper.Paper_Title}" has been approved by the admin. You can now log in to your account and proceed with the review process. `,
          `<p>Hello,</p><p>Your request to review the paper titled <strong>"${updatedPaper.Paper_Title}"</strong> has been approved by the admin.</p><p>You can now log in to your account and proceed with the review process.</p>`
        );
        
        
    
       
        return ctx.send({
          message: 'paper assignment successful',
          updatedPaper:updatedPaper
        });
      } catch (err) {
        console.error("Error during paper assignment  :", err);
        return ctx.internalServerError("Error during paper assignment.");
      }
    },
    async rejectReviewRequest(ctx) {
      const { paperId, reviewerId } = ctx.request.body;
      const reviewer = await strapi.entityService.findOne('api::reviewer.reviewer', reviewerId, {
        populate:'*',
     });
      const reviewerEmail=reviewer.email;
     if (!reviewer) {
        return ctx.badRequest("Reviewer not found.");
     }
      console.log('Request Body:', ctx.request.body); // Log the request to inspect the data
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'mudassiralishah555@gmail.com',  // Your Gmail address
          pass: 'mfrm qmsz yiey pgzp',   // Your Gmail password (or App Password if 2FA is enabled)
        },
      });
      
      // Function to send email
      const sendEmail = async (to, subject, text, html) => {
        const mailOptions = {
          from: 'mudassiralishah555@gmail.com',    // Sender address
          to,                              // Recipient address
          subject,                         // Subject line
          text,                            // Plain text body
          html,                            // HTML body
        };
         const sendEmail = async (to, subject, text, html) => {
        const mailOptions = {
          from: 'mudassiralishah555@gmail.com',    // Sender address
          to,                              // Recipient address
          subject,                         // Subject line
          text,                            // Plain text body
          html,                            // HTML body
        };
      
        try {
          await transporter.sendMail(mailOptions);
          console.log('Email sent successfully');
        } catch (error) {
          console.error('Error sending email:', error);
        }
       };
      
       try {
        
        //for paper collection type
        const RejectReviewRequest = await strapi.db.query("api::paper.paper").update({
          where: { id: paperId },
          data: {
            reviewRequestsRejected: {
              connect: [{ id: reviewerId }], 
            },
          },
        });
        const updatedPaper = await strapi.db.query("api::paper.paper").update({
          where: { id: paperId },
          data: {
            reviewRequests: {
              disconnect: [{ id: reviewerId }],
            },
          },
          populate: ['reviewRequests'], // Ensure the updated data is returned
        });
        
        await sendEmail(
          reviewerEmail,
          `Your request for paper review with title "${updatedPaper.Paper_Title}" has been Rejected`,
          `Hello, Your request to review the paper titled "${updatedPaper.Paper_Title}" has been rejected by the admin. If you have any questions, please contact support.`,
          `<p>Hello,</p><p>Your request to review the paper titled <strong>"${updatedPaper.Paper_Title}"</strong> has been rejected by the admin.</p><p>If you have any questions, please contact support.</p>`
        );
        
       
        return ctx.send({
          message: 'paper rejection successful',
          updatedPaper:updatedPaper
        });
      } catch (err) {
        console.error("Error during paper assignment  :", err);
        return ctx.internalServerError("Error during paper assignment.");
      }
    }
  },
  }));
  