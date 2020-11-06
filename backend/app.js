import express from 'express'
import path from 'path'
import cookieParser from "cookie-parser";
import morgan from 'morgan'

var app = express();
const __dirname = path.resolve(path.dirname(''));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "frontend", "build")));

app.get('/test', (req, res) => 
    res.send('Hello, World!')
)

export default app;
console.log("départ",__dirname)
