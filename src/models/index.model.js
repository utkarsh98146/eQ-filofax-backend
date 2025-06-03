import { Sequelize } from "sequelize"
import { sequelize } from "../config/database.config.js"

import UserModel from "./user.model.js"
import TimeSlotModel from "./timeSlot.model.js"
import CalendarEvent from "./calendarEvent.model.js"
import ZoomMeetingModel from "./zoomMeeting.model.js"
import AvailabilityForEventModel from "./availabilityForEvent.model.js"
import EventTypeModel from "./eventType.model.js"
import BookingModel from "./Booking.model.js"

const db = {}

db.sequelize = sequelize
db.Sequelize = Sequelize

// initialize all the models

db.User = UserModel(sequelize, Sequelize.DataTypes)

db.Availability = AvailabilityForEventModel(sequelize, Sequelize.DataTypes)

db.CalendarEvent = CalendarEvent(sequelize, Sequelize.DataTypes)

db.TimeSlot = TimeSlotModel(sequelize, Sequelize.DataTypes)

db.ZoomMeeting = ZoomMeetingModel(sequelize, Sequelize.DataTypes)

db.EventType = EventTypeModel(sequelize, Sequelize.DataTypes)

db.Booking = BookingModel(sequelize, Sequelize.DataTypes)

db.User.hasMany(db.Availability, { foreignKey: "userId" })
db.Availability.belongsTo(db.User, { foreignKey: "userId" })

db.Availability.hasMany(db.TimeSlot, { foreignKey: "availabilityId" })
db.TimeSlot.belongsTo(db.Availability, { foreignKey: "availabilityId" })

db.TimeSlot.hasOne(db.CalendarEvent, { foreignKey: "timeSlotId" })
db.CalendarEvent.belongsTo(db.TimeSlot, { foreignKey: "timeSlotId" })

// new relations from here
db.User.hasMany(db.EventType, { foreignKey: "userId" })
db.EventType.belongsTo(db.User, { foreignKey: "userId" })

db.EventType.hasMany(db.TimeSlot, { foreignKey: "eventTypeId" })
db.TimeSlot.belongsTo(db.EventType, { foreignKey: "eventTypeId" })

db.EventType.hasMany(db.Booking, { foreignKey: "eventTypeId" })
db.Booking.belongsTo(db.EventType, { foreignKey: "eventTypeId" })

db.User.hasMany(db.Booking, { foreignKey: "hostId" })
db.Booking.belongsTo(db.User, { foreignKey: "hostId" })

export default db
