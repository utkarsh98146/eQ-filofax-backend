import { Sequelize } from "sequelize"
import { sequelize } from "../config/database.config.js"

import UserModel from "./user.model.js"
import TimeSlotModel from "./timeSlot.model.js"
import CalendarEvent from "./calendarEvent.model.js"
import ZoomMeetingModel from "./zoomMeeting.model.js"
import AvailabilityForEventModel from "./availabilityForEvent.model.js"

const db = {}

db.sequelize = sequelize
db.Sequelize = Sequelize

// initialize all the models

db.User = UserModel(sequelize, Sequelize.DataTypes)

db.Availability = AvailabilityForEventModel(sequelize, Sequelize.DataTypes)

db.CalendarEvent = CalendarEvent(sequelize, Sequelize.DataTypes)

db.TimeSlot = TimeSlotModel(sequelize, Sequelize.DataTypes)

db.ZoomMeeting = ZoomMeetingModel(sequelize, Sequelize.DataTypes)

db.User.hasMany(db.Availability, { foreignKey: "userId" })
db.Availability.belongsTo(db.User, { foreignKey: "userId" })

db.Availability.hasMany(db.TimeSlot, { foreignKey: "availabilityId" })
db.TimeSlot.belongsTo(db.Availability, { foreignKey: "availabilityId" })

db.TimeSlot.hasOne(db.CalendarEvent, { foreignKey: "timeSlotId" })
db.CalendarEvent.belongsTo(db.TimeSlot, { foreignKey: "timeSlotId" })

export default db
