import axios from "axios"

export const verifyGoogleToken = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Invalid authorization header for google access_token" })
  }
  const acessToken = authHeader && authHeader.split(" ")[1]

  if (!acessToken) {
    return res
      .status(401)
      .json({ message: "No access token provided for google" })
  }

  try {
    const response = await axios.get(
      `https://www.googleapis.com/oauth2/v3/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${acessToken}`,
          "Content-Type": "application/json",
        },
      }
    )

    req.user = response.data
    next()
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired access token",
      errorMessage: error.message,
      error,
    })
  }
}
