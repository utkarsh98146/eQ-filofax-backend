import { DataTypes } from "sequelize"

export const zoomMeetingModel = (sequelize, DataTypes) => {
  const ZoomMeeting = sequelize.define(
    "ZoomMeeting",
    {
      zoomMeetingId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      topic: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      startTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      timezone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      agenda: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      hostId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      hostEmail: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      joinUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  )
}
