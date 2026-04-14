'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `Create table USERS(
        id Integer PRIMARY KEY AUTO_INCREMENT,
        name varchar(30),
        email varchar(30), 
        phone VARCHAR(15) CONSTRAINT chk_phone CHECK(phone REGEXP '^\\+[0-9]{1,3}[0-9]{7,12}$')
      )`
    )
  },

  async down (queryInterface, Sequelize) {
    queryInterface.sequelize.query(
      "DROP TABLE USERS"
    )
  }
};
