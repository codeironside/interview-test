require("dotenv").config();
const express = require("express");
const http = require('http'); // Import http module

const cors = require("cors");
const corsOption = require("./config/corsOption");
const { errorHandler } = require("./middleware/errormiddleware");
const connectDB = require("./config/db");

const app = express();


const port = process.env.PORT;

// Database connection
connectDB();

// Middleware

app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//authorizations endpoint
app.set('trust proxy', true);
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    // Add the 'Authorization' header to the list of exposed headers
    res.append('Access-Control-Expose-Headers', 'Authorization');
    next();
});
// Your routes go here
app.get('/', (req, res) => {
    res.send('finished the end point');
});
// Routes
app.use("/api/v1/users/auth", require("./routes/user"));
app.use("/api/v1/coffee", require("./routes/coffee"));
app.use("/api/v1/orders", require("./routes/order"));
app.use("/api/v1/cart", require("./routes/cart"));


// Error handling middleware
app.use(errorHandler);


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});