"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Booking, {
        foreignKey: "userId",
      });
    }

    // Method to create user data
    static async createUser(userData) {
      try {
        const user = await User.create(userData);
        return user;
      } catch (error) {
        throw new Error("Error creating user");
      }
    }

    // Method to update user data
    static async updateUser(userId, newData) {
      try {
        const user = await User.findByPk(userId);
        if (!user) throw new Error("User not found");
        await user.update(newData);
        return user;
      } catch (error) {
        throw new Error("Error updating user");
      }
    }

    // Method to get all users
    static async getUsers() {
      try {
        const user = await User.findAll();
        if (!user) throw new Error("Users not found");
        return user;
      } catch (error) {
        throw new Error("Error getting user");
      }
    }

    // Method to get user data by ID
    static async getUserById(userId) {
      try {
        const user = await User.findByPk(userId);
        if (!user) throw new Error("User not found");
        return user;
      } catch (error) {
        throw new Error("Error getting user");
      }
    }

    // Method to delete user data
    static async deleteUser(userId) {
      try {
        const user = await User.findByPk(userId);
        if (!user) throw new Error("User not found");
        await user.destroy();
        return true;
      } catch (error) {
        throw new Error("Error deleting user");
      }
    }
  }

  User.init(
    {
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      profilePicture: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
    }
  );
  return User;
};
