'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.sequelize.query(
      `
      ALTER TABLE Users
      MODIFY COLUMN email varchar(30) NOT NULL UNIQUE,
      ADD COLUMN password varchar(150) NOT NULL,
      ADD COLUMN role ENUM('admin','analyst','engineer','user') default 'user',
      ADD COLUMN is_deleted TIMESTAMP,
      ADD COLUMN is_verified BOOLEAN default false,
      ADD COLUMN token_version INTEGER 
      `
    )
  },

  async down (queryInterface, Sequelize) {
    queryInterface.sequelize.query(
      `
      ALTER TABLE Users
      MODIFY COLUMN email,
      DROP COLUMN password,
      DROP COLUMN role,
      DROP COLUMN is_deleted,
      DROP COLUMN is_verifie,
      DROP COLUMN token_version
      `
    )
  }
};
