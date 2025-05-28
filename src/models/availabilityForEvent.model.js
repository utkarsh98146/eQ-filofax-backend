// availability for the event

export default (sequelize, DataTypes) => {
  const Availability = sequelize.define(
    "Availability",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        // reference through the user table
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      eventType: {
        // 1-1 event type type of the event
        type: DataTypes.STRING,
        allowNull: true,
      },
      location: {
        // meet or zoom
        // location of the event
        type: DataTypes.STRING,
        allowNull: true,
      },
      daysOfWeek: {
        // no of days in week to available
        type: DataTypes.STRING,
        allowNull: false,
      },
      startTime: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
          max: 1436, // 23:59
        },
      },
      endTime: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
          max: 1440, //24:00
        },
      },
      hostTimeZone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      timestamps: true,
    }
  )
  return Availability
}
