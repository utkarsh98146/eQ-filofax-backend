import db from "../models/index.model.js"
import { checkUserThroughToken } from "../services/jwt_tokenServices.service.js"
import path from "path"

// get the profile data controller
export const profileDetailsController = async (req, res) => {
  console.log("Get Profile data api called...")

  try {
    console.log(`The details from token extracting `, req.user)

    const { userId } = await checkUserThroughToken(req) // destructure the userId from the request object

    // console.log(" After extracting the userId :", userId)
    const user = await db.User.findByPk(userId) // find the user by id

    console.log(`User details after fetching through token :`, user)
    res.status(200).json({
      message: " Data for the profile send successfully..",
      success: true,
      data: {
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        profileImage: user.profileImage,
      },
    })
  } catch (error) {
    console.log(
      "Error while fetching the profile data in controller",
      error.message
    )
    res.status(500).json({
      message: "Error while fetching the profile data",
      success: false,
      error: error.message,
    })
  }
}

// update the profile data controller
export const updateProfileDetailsController = async (req, res) => {
  console.log(" Update profile api called...")
  try {
    // console.log(`The details from token extracting `, req.user)

    const { userId } = await checkUserThroughToken(req) // destructure the userId from the request object

    // console.log(" now ", userId)

    const user = await db.User.findByPk(userId) // find the user by id

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      })
    }

    // console.log(`User details after fetching through token :`, user)

    // console.log("The client data", req.body)

    const { name, email, phoneNumber } = req.body // destructure the data from the request body
    const profileImageLink = req.file
      ? `/uploads/${req.file.filename}`
      : (req.body.profileImageLink ?? user.profileImageLink)

    user.name = name ?? user.name // update the user n
    user.email = email ?? user.email // update the user email
    user.phoneNumber = phoneNumber ?? user.phoneNumber // update the user phone number
    user.profileImageLink = profileImageLink // update the user profile image link

    const updatedDetails = await user.save() // save the updated user details

    console.log(
      `Details name:${updatedDetails.name},phoneNumber : ${updatedDetails.phoneNumber}, email : ${updatedDetails.email}, profileImageLink : ${updatedDetails.profileImageLink}`
    )

    res.status(200).json({
      message: "Profile details updated successfully..",
      success: true,
      data: {
        name: updatedDetails.name,
        email: updatedDetails.email,
        phoneNumber: updatedDetails.phoneNumber,
        profileImageLink: updatedDetails.profileImageLink,
      },
    })
  } catch (error) {
    console.log("Error while updating the profile data", error.message)
    res.status(500).json({
      message: "Error while updating the profile data",
      success: false,
      error: error.message,
    })
  }
}

// delete the profile data controller
export const deleteProfileDetailsController = async (req, res) => {
  console.log("Delete profile api called..")

  try {
    const { userId } = await checkUserThroughToken(req) // destructure the userId from the request object
    const user = await db.User.findByPk(userId) // find the user by id
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      })
    }

    // Remove profile image from local storage if it exists and is not a placeholder
    if (user.profileImageLink) {
      // Remove 'filoFax-backend/' prefix if present
      const relativeImagePath = user.profileImageLink.replace(
        /^filoFax-backend[\/\\]?/,
        ""
      )
      const imagePath = path.join(process.cwd(), relativeImagePath)
      try {
        await fs.unlink(imagePath)
        console.log("Profile image deleted from local storage.")
      } catch (err) {
        console.log("Profile image not found or already deleted.")
      }
    }

    await user.destroy() // delete the user
    console.log(`User with id ${userId} deleted successfully`)
    res.status(200).json({
      message: "Profile deleted successfully",
      success: true,
    })
  } catch (error) {
    console.log("Error while deleting the profile data", error.message)
    res.status(500).json({
      message: "Error while deleting the profile data",
      success: false,
      error: error.message,
    })
  }
}
