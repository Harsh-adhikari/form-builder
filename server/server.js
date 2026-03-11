// const express = require("express")
// const app = express()
// const dotenv = require("dotenv").config()
// const connectDb = require("./config/connectionDb")
// const cors = require("cors")

// const PORT = process.env.PORT || 3000
// connectDb()

// app.use(express.json())


// // app.use(cors({
// //     origin: [
// //         'http://localhost:5173', 
// //         'https://your-frontend-url.vercel.app' 
// //     ],
// //     credentials: true,
// //     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
// // }))


// app.use(cors({
//     origin: [
//         'http://localhost:5173',
//         'https://crave-craft-dequ3qw2x-harsh-adhikaris-projects-f6407523.vercel.app',
//         'https://crave-craft-git-main-harsh-adhikaris-projects-f6407523.vercel.app', // Vercel preview URLs
//         /^https:\/\/crave-craft-.*\.vercel\.app$/ // Allow all Vercel deployment URLs
//     ],
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
// }))


// app.use(express.static("public"))

// app.use("/", require("./routes/user"))
// app.use("/recipe", require("./routes/recipe"))

// app.listen(PORT, (err) => {
//     if (err) {
//         console.error('Error starting server:', err)
//     } else {
//         console.log(`Server is listening on port ${PORT}`)
//     }
// })



const express = require("express")
const app = express()
const dotenv = require("dotenv").config()
const connectDb = require("./config/connectionDb")
const cors = require("cors")

const PORT = process.env.PORT || 3000
connectDb()

app.use(express.json())

// UPDATED CORS - Add your actual Vercel URL
app.use(cors({
    origin: [
        'http://localhost:5173',
        /^https:\/\/.*\.vercel\.app$/  // Allows ANY vercel.app domain
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.static("public"))

app.use("/", require("./routes/user"))
app.use("/recipe", require("./routes/recipe"))

app.listen(PORT, (err) => {
    if (err) {
        console.error('Error starting server:', err)
    } else {
        console.log(`Server is listening on port ${PORT}`)
    }
})