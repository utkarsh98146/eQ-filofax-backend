import express from "express"

const router = express()

router.get("/", (req, res) => {
  res.send(
    "<h1>Welcome to the FiloFax Web-Application</h1> <br> <h1> It is a meeting scheduling app </h1>"
  )
})

export const welcomeRouter = router
