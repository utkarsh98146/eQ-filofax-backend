export default (sequelize, DataTypes) => {
  const EventType = sequelize.define(
    "EventType",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        references: { model: "Users", key: "id" },
      },
      eventType: {
        // event 1-1
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        // name of the event
        type: DataTypes.STRING,
        defaultValue: "New Meeting",
      },

      // slug: {
      //   type: DataTypes.STRING,
      //   allowNull: false, // "30min-consultation" for URL
      // },
      duration: {
        type: DataTypes.INTEGER, // duration in minutes
        allowNull: false,
      },
      location: {
        // platform
        type: DataTypes.STRING,
        allowNull: true,
      },
      availability_time: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      hostName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      hostEmail: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      timestamps: true,
    }
  )
  return EventType
}
