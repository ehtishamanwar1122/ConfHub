'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  async changePassword(ctx) {
    const { currentPassword, newPassword, confirmNewPassword } = ctx.request.body;

    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized('You must be logged in');
    }

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return ctx.badRequest('All fields are required');
    }

    if (newPassword !== confirmNewPassword) {
      return ctx.badRequest('New passwords do not match');
    }

    const existingUser = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: { id: user.id },
    });

    const isValid = await bcrypt.compare(currentPassword, existingUser.password);
    if (!isValid) {
      return ctx.badRequest('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await strapi.db.query('plugin::users-permissions.user').update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return ctx.send({ message: 'Password changed successfully' });
  },
};
