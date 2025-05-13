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
      daysOfWeek: {
        // no of days in week to available
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
          max: 7,
        },
      },
      startMin: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
          max: 1436, // 23:59
        },
      },
      endMin: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
          max: 1440, //24:00
        },
      },
    },
    {
      timestamps: true,
    }
  )
  return Availability
}
