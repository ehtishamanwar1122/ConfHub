/**
 * conference controller
 */

import { factories } from '@strapi/strapi'
const nodemailer = require('nodemailer');
export default factories.createCoreController('api::conference.conference', ({ strapi }) => ({
    async createConference(ctx) {
        try {
            console.log('conf data',ctx.request.body);
            
            // Destructure fields directly from the request body
            const {
                conferenceTitle,
                conferenceDescription,
                startDate,
                endDate,
                conferenceLocation,
                trackTitle,
                trackDescription,
                sessionTitle,
                speakerNames,
                submissionDeadline,
                reviewDeadline,
                organizerId
              
            } = ctx.request.body;
        
            // Validation for required fields
            
          
              // Ensure end date is not earlier than start date
              if (new Date(startDate) > new Date(endDate)) {
                return ctx.badRequest("End date cannot be earlier than start date.");
              }
          
              // Ensure review deadline is not earlier than submission deadline
              if (new Date(submissionDeadline) > new Date(reviewDeadline)) {
                return ctx.badRequest("Review deadline cannot be earlier than submission deadline.");
              }
          
              // Check if a conference with the same title already exists
              const existingConference = await strapi.query("api::conference.conference").findOne({
                where: { Conference_title: conferenceTitle }, // Make sure you're using the correct column name.
              });
              
          
              if (existingConference) {
                return ctx.badRequest("A conference with this title already exists.");
              }
          
              // Create the conference
              const newConference = await strapi.entityService.create("api::conference.conference", {
                data: {
                    Conference_title: conferenceTitle,
                    Description:conferenceDescription,
                  Start_date:startDate,
                  End_date:endDate,
                  Conference_location:conferenceLocation,
                  Track_title:trackTitle,
                  Track_description:trackDescription,
                  Session_title:sessionTitle,
                  Speaker_names:speakerNames,
                  Submission_deadline:submissionDeadline,
                  Review_deadline: reviewDeadline,
                  Organizer: organizerId,
                  requestStatus:'pending',
                }, 
            
              });
              const organizerEmail = await strapi.query("api::organizer.organizer").findOne({
                where: { id: organizerId },
                select: ["Organizer_Email"]  // Ensure you're selecting only the email field
            });
            console.log('org email', organizerEmail);
            const emailAddress = organizerEmail?.Organizer_Email;
            if (emailAddress) {
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
            
              // Send email using the extracted email address
              await sendEmail(
                emailAddress,  // Pass the email string here
                'Your Conference Request Has Been Received',
                `Thank you for submitting your conference request on ConfHub. We have received your request to create "${conferenceTitle}" and it is currently under review. Our team will review the details, and you will be notified once it has been approved.`,
                `<p>Hello,</p>
                 <p>Your request to create the conference "<strong>${conferenceTitle}</strong>" on ConfHub has been received. Please wait for the admin's approval. You will be notified once the review process is complete.</p>
                 <p>Best regards,<br>ConfHub Team</p>`
              );
            } else {
              console.error('No organizer email found.');
            }
            
              return ctx.send({
                message: "Conference created successfully.",
                conference: newConference,
              });
            } catch (error) {
              console.error("Error creating conference:", error);
              return ctx.internalServerError("An error occurred while creating the conference.");
            }
          
        
    },

    async updateStatus(ctx) {
        try {
          const { id, status } = ctx.request.body;
    console.log('confo', ctx.request.body);
    
          if (!id || !status) {
            return ctx.badRequest('Missing required fields: id and status');
          }
    
          // Update the organizer's status
          const updatedConference = await strapi.entityService.update('api::conference.conference', id, {
            data: {
              requestStatus: status,
              Status:'inProgress',
            },
          });
         console.log('up dat coff',updatedConference);
         
          if (!updatedConference) {
            return ctx.notFound('conference not found');
          }
          // Fetch the conference and populate the organizer relationship
const conference = await strapi.entityService.findOne('api::conference.conference', id, {
  populate: ['Organizer']  // Ensure 'organizer' relation is populated
});

if (!conference || !(conference as any).Organizer) {
  return ctx.badRequest('Organizer not found for this conference');
}

// Extract organizer details
const organizerId = (conference as any).Organizer.id;
const organizerEmail = (conference as any).Organizer.Organizer_Email;

// Fetch the conference title separately (optional)
const conferenceTitle = conference.Conference_title;

console.log('Organizer ID:', organizerId);
console.log('Organizer Email:', organizerEmail);
console.log('Conference Title:', conferenceTitle);

      
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
            organizerEmail,
            'Your Conference Status Has Been Updated',
            `Your conference "${conferenceTitle}" on ConfHub has been updated to the status: ${status}.`,
            `<p>Hello,</p>
             <p>The status of your conference "<strong>${conferenceTitle}</strong>" on ConfHub has been updated to <strong>${status}</strong>.</p>
             <p>Please log in to your account to view further details.</p>
             <p>If you have any questions, feel free to contact our support team.</p>
             <p>Best regards,<br>ConfHub Team</p>`
        );
        
      
          // Respond with the updated organizer
          ctx.send({
            message: 'Status updated successfully',
            organizer: updatedConference,
          });
        } catch (error) {
          console.error('Error updating organizer status:', error);
          ctx.internalServerError('An error occurred while updating status');
        }
      },
}));