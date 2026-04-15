'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.sequelize.query(
      `
      ALTER TABLE Users
      ADD COLUMN created_at TIMESTAMP,
      ADD COLUMN updated_at TIMESTAMP
      `
    )
  },

  async down (queryInterface, Sequelize) {
    queryInterface.sequelize.query(
      `
      ALTER TABLE Users
      DROP COLUMN created_at,
      DROP COLUMN updated_at
      `
    )
  }
};
