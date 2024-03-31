const express = require('express');
const app = express();
const dotenv = require('dotenv')
dotenv.config({ path: './.env' });
const userRouter = require('./Routes/userRoutes')
const contactRouter = require('./Routes/contactRoutes')
const productRouter = require('./Routes/productRoutes')
const cors = require('cors')

//^Middlewares
app.use(express.json());
// app.use(cors())
app.use(cors({ origin: 'https://e-commerce-client-3.onrender.com/' }));
app.use('/api/users/', userRouter);
app.use('/api/contacts/', contactRouter);
app.use('/api/products/', productRouter);
//& DB Connection
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE).then(() => {
    console.log("Data Base Connection Successfully");
}).catch(error => console.log(error))



app.listen(process.env.PORT, () => {
    console.log("Server Started at", process.env.PORT);
})