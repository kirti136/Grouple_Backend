"use strict";
const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface, Sequelize) {
    const password1 = await bcrypt.hash("user12345", 10);
    const password2 = await bcrypt.hash("user54321", 10);

    await queryInterface.bulkInsert(
      "users",
      [
        {
          username: "john_doe",
          email: "john.doe@example.com",
          password: password1,
          profilePicture: "default.jpg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: "jane_doe",
          email: "jane.doe@example.com",
          password: password2,
          profilePicture: "default.jpg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
