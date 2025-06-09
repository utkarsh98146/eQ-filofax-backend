// define the table structure
export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "Email already exists",
        },
        validate: {
          notEmpty: {
            msg: "Email address cannot be empty",
          },
          isEmail: {
            msg: "Please enter a valid email",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true, // for google/microsoft users
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          notEmpty: {
            msg: "Phone number must required",
          },
          isNumeric: {
            msg: "Phone number must be numeric",
          },
          len: {
            args: [10, 15],
            msg: "Phone number must be between 10 and 15 digits",
          },
        },
      },
      role: {
        type: DataTypes.ENUM("invitee", "admin"),
        defaultValue: "admin",
      },
      profileImageLink: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      authType: {
        type: DataTypes.ENUM("local", "google", "microsoft"),
        allowNull: false,
        defaultValue: "local",
      },
      microsoftId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
      },
      googleId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
      },

      isEmailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      // jwt token
      token: DataTypes.TEXT,

      // google token
      googleAccessToken: DataTypes.TEXT,
      googleRefreshToken: DataTypes.TEXT,

      // microsoft token
      microsoftAccessToken: DataTypes.TEXT,
      microsoftRefreshToken: DataTypes.TEXT,

      // zoom token
      zoom_access_token: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      // zoom_access_token_expires: {
      //   type: DataTypes.DATE,
      //   allowNull: true,
      // },
      // accessToken: {
      //   type: DataTypes.TEXT,
      //   allowNull: true,
      // },
      // refreshToken: {
      //   type: DataTypes.TEXT,
      //   allowNull: true,
      // },
      lastLogin: {
        type: DataTypes.DATE,
      },
      lastLoginMethod: {
        type: DataTypes.ENUM("local", "google", "microsoft"),
      },
      welcomeMessage: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "Welcome to my profile",
      },
      dateFormat: {
        type: DataTypes.STRING,
        defaultValue: "YYYY/MM/DD",
      },
      timeFormat: {
        type: DataTypes.STRING,
        defaultValue: "12h",
      },
      timezone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: true,
    }
  )
  return User
}
