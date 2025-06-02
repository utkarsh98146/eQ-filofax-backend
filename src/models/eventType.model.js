export default (sequelize, DataTypes) => {
  const EventType = sequelize.define("EventType", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      references: { model: User, key: "id" },
    },
    eventType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false, // "30min-consultation" for URL
    },
    duration: {
      type: DataTypes.INTEGER, // duration in minutes
      allowNull: false,
    },
    location: {
      type: DataTypes.ENUM("google-meet", "zoom"),
      defaultValue: "google_meet",
    },
    availability,
  })
}
