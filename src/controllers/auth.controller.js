// Signup/Login Controller

import jwt from "jsonwebtoken"
import dotenv from "dotenv"
// import { User } from "../models/user.model.js"
import bcrypt from "bcrypt"

import db from "../models/index.model.js"
import { generateToken } from "../services/tokenServices.service.js"
dotenv.config()

export const sendToken = (req, res) => {
  const user = req.user // getting the user details from token(browser)

  const token = generateToken(user) // generating refresh token via userId
  // console.log('Token generated:', token)
  // console.log(`Frontend URL: ${process.env.FRONTEND_BASE_URL}/dashboard?token=${token}`)
  res
  res.redirect(
    `"http://localhost:5173"||${"https://filo-fax-frontend-wkdx.vercel.app"}/dashboard?token=${token}`
  ) // dashboard url from client/
}

export const signup = async (req, res) => {
  console.log("Signup API called..")
  console.log("Data received from client in the req body :", req.body)
  const { name, email, password } = req.body // collecting the details from client

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Please enter the required fields",
      success: false,
    })
  }

  try {
    let existingUser = await db.User.findOne({ where: { email } }) // search the details via email

    if (existingUser) {
      res
        .status(400)
        .json({ message: "This email already exist..", success: false })
    }
    const hashingSalt = 14 // the no of rounds to generate the salt

    const hashpassword = await bcrypt.hash(password, hashingSalt) // hashing the password

    const user = await db.User.create({
      name,
      email,
      password: hashpassword,
      authType: "local",
      isEmailVerified: false,
      lastLoginMethod: "local",
      lastLogin: new Date(),
    })

    const token = generateToken(user.id) //Generate the token for client(UI)

    res.cookie("access_token", token, {
      httpOnly: true,
      sameSite: "Strict",
    })
    console.log("Local signup successfully..")
    res.status(201).json({
      message: "User SignUp successfully..",
      success: true,
      token,
      user,
    })
  } catch (error) {
    console.log(`Error while signup:${error.message}`)

    res.status(500).json({
      success: false,
      message: "Signup error",
      mainError: error.message,
      error,
    })
  }
}

export const login = async (req, res) => {
  console.log("Local Login api called..")

  try {
    console.log(req.body)

    const { email, password } = req.body
    console.log(
      `Data from the client ${req.body} and i store email  ${email} and password ${password}`
    )

    const user = await db.User.findOne({ where: { email } }) // search user details via email
    if (!user || (user.authType !== "local" && !password)) {
      res.status(400).json({
        message: "Invalid credentails for login,enter the correct one",
        success: false,
      })
    }

    const token = await generateToken(user) // generate token

    if (!token) {
      console.log("Token generation failed in local login controller")
      res.status(400).json({
        message: "Error while token generation in local login controller",
        success: false,
      })
    }
    console.log(`Token details after token generation : `, token)
    res.status(200).json({
      message: "Login successfully ",
      success: true,
      userDetails: user, // send user details object
      token: token, // send token in res to client(UI)
    })
  } catch (error) {
    res
      .status(500)
      .json({ message: "Login fails ", error, errorMessage: error.message })
  }
}

/*
// token logic
export const getUserProfile = async (req, res) => {
  const authHander = req.headers.authorization

  if (!authHander || !authHander.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Invalid authorization header" })
  }
  const token = authHander.split(" ")[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

    const user = await db.User.findByPk(decoded.id, {
      attributes: { exclude: ["password"] },
    })

    if (!user) {
      return res.status(404).json({ message: "User not exist" })
    }

    res.status(200).json({ message: "Token verify", userDetails: user })
  } catch (error) {
    return res.status(500).json({
      message: "Invalid or expire token ",
      errorMessage: error.message,
      error,
    })
  }
}

export const getUser = async (req, res) => {
  try {
    const token = req.cookies.access_token // getting the token from client
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      })
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) // decode the details from token received from client(UI)
    const user = await db.User.findOne({ where: { id: decoded.id } }) // getting the user details from db via id
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }
    res.status(200).json({
      success: true,
      user,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    })
  }
}
*/
