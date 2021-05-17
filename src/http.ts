import express, { response } from 'express'
import { createServer } from 'http'
import { Server, Socket } from 'socket.io'
import path from 'path'

import './database'

const app = express()

//Upgrade 2: Protocolo Web Socket 
app.use(express.static(path.join(__dirname, '..', 'public')))
app.set("views", path.join(__dirname, '..', 'public'))
app.engine("html", require("ejs").renderFile)
app.set("view engine", "html")
app.get('/pages/clients', (req, res) => {
    return res.render("html/client.html")
})
app.get('/pages/admin', (req, res) => {
    return res.render("html/admin.html")
})

const http = createServer(app)  //criando protocolo http
const io = new Server(http)     //criando protocolo web socket

//Trigger with min code: 'const socket = io()' on public/js/chat.js
/*io.on("connection", (socket: Socket) => {
    console.log("Socket", socket.id, "connected")
})*/
//Upgrade 2 - End


//Upgrade 1 - import routes from 'routes'
//app.get('/status', (req, res) => {return res.send('200 - OK')})
//app.get('/users', (req, res) => {return res.json({name: 'A'})})
//app.post('/users', (req, res) => {return res.send('User cadastrado')})

import {routes} from './routes'

app.use(express.json())
app.use(routes)
//Upgrade 1 - End


//http uses app
//io uses http
//NOTE: app.use(routes) is after http and io inits, but both can use it.
//(Yes, block 2 could and should be before 1, but it didn't seems to matter...) 
export {http, io}
