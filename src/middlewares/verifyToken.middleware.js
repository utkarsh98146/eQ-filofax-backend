import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { decodeToken } from "../services/jwt_tokenServices.service.js"

dotenv.config()

// verify token middleware
export const verifyToken = async (req, res, next) => {
  // console.log(" the header data :", req.headers["authorization"])

  const bearerHeader = req.headers["authorization"] // request the bearer header
  // console.log(" now for value :", bearerHeader)

  if (!bearerHeader || !bearerHeader.startsWith("Bearer ")) {
    console.warn("Authorization header missing")
    return res.status(401).json({
      message:
        "Invalid authorization format. Expected 'Bearer <token>' means Token not received from client",
      success: false,
    })
  }

  const token = bearerHeader.split(" ")[1] // extracting token value from bearer header

  const decodedData = decodeToken(token) // decoded the details from token

  if (!decodedData || !decodedData.id) {
    console.error("Decoded token is missing ")
    return res
      .status(403)
      .json({ message: "Invalid or expired token", success: false })
  }

  const userId = decodedData.id
  const { name, email } = decodedData
  console.log(
    `User id ${userId} from decode token and decode-Token `,
    decodedData
  )

  if (!userId) {
    return res.status(403).json({
      message: "Invalid token payload",
      success: false,
    })
  }

  req.user = { userId, name, email }
  console.log(`User Authenticated successfully.. User ID: ${userId}`)

  next() // used to pass control to the next middleware function

  /*
    console.log(`Token value :${token}`)
    if (!token) {
      console.log("Token not extracted from client bearer header")
    }

    jwt.verify(token, process.env.JWT_SCRERT_KEY, (error, decoded) => {
      if (error) return res.status(403).json({ message: "Un" })
    })
    */
  // ends here
}
