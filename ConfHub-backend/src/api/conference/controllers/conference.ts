/**
 * conference controller
 */

import { factories } from '@strapi/strapi'

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