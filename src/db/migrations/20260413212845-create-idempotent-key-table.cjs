'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.sequelize.query(
      `
      CREATE TABLE Idempotent_Key(
        id Integer AUTO_INCREMENT PRIMARY KEY,
        idempotent_key Varchar(60) NOT NULL,
        user_id Varchar(50),
        request_method VARCHAR(10) NOT NULL,
        endpoint VARCHAR(255) NOT NULL,
        request_hash CHAR(64) NOT NULL,
        response_data JSON,
        status ENUM('PROCESSING', 'COMPLETED', 'FAILED') DEFAULT 'PROCESSING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        expires_at TIMESTAMP,

        UNIQUE KEY unique_idempotenc(
          idempotent_key,
          request_method,
          endpoint
        )
      )
        
      `
    )
  },

  async down (queryInterface, Sequelize) {
    queryInterface.sequelize.query(
      "DROP TABLE Idempotency_Key"
    )
  }
};
