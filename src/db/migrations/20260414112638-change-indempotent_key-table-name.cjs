'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.sequelize.query(
      `
      ALTER TABLE Idempotent_Key RENAME TO Idempotent_Keys
      `
    )
  },

  async down (queryInterface, Sequelize) {
    queryInterface.sequelize.query(
      `
      ALTER TABLE Idempotent_Keys RENAME TO Idempotent_Key
      `
    )
  }
};
