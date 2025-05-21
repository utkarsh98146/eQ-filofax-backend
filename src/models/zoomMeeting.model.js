export default (sequelize, DataTypes) => {
  const ZoomMeeting = sequelize.define(
    "ZoomMeeting",
    {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      startTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      eventType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      hostTimezone: {
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
      hostName: {
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
      attendees: {
        type: DataTypes.JSON,
        allowNull: true,
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
  return ZoomMeeting
}
