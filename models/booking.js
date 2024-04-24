"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      Booking.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }
  }
  Booking.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      date: {
        type: DataTypes.DATE,
      },
      startTime: {
        type: DataTypes.TIME,
      },
      endTime: {
        type: DataTypes.TIME,
      },
      location: {
        type: DataTypes.STRING,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
      },
    },
    {
      sequelize,
      modelName: "Booking",
      tableName: "bookings",
    }
  );
  return Booking;
};
