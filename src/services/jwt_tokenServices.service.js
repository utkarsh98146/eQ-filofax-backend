import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

// generate the jwt token for user
export const generateToken = async (user) => {
  try {
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    )
    console.log(`Token details : ${token}`)
    return token
  } catch (error) {
    console.log("Error while generating JWT token : ", error.mesaage)
    return null
  }
}

// decode the user details from the token
export const decodeToken = (token) => {
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY)
    console.log(" the decode value : ", decode)
    return decode
  } catch (error) {
    console.error("Error while decoding the token : ", error.mesaage)
    return null
  }
}

// check the user auth through the jwt token based
export const checkUserThroughToken = async (req, res) => {
  console.log(`The details from token extracting in token service `, req.user)
  const { userId } = req.user // destructure the userId from the request object
  console.log("UserId in checkToken function ", userId)

  if (!userId) {
    return res.status(403).json({
      message: "Unauthorized Access, you don't have permission",
      success: false,
    })
  }
  // console.log("User id extracted from the token service : ", userId)
  return { userId } // return the userId
}
