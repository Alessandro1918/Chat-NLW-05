import { Router } from 'express'
import SettingsController from './controllers/SettingsController'
import UsersController from './controllers/UsersController'
import MessagesController from './controllers/MessagesController'

const routes = Router()

//V1 - Without controllers
//routes.post("/settings", async (request, response) => {...})

//V2 - With controllers
const settingsController = new SettingsController()
const usersController = new UsersController()
const messagesController = new MessagesController()

routes.post("/settings", settingsController.create)
routes.get("/settings/:username", settingsController.findByUsername)
routes.put("/settings/:username", settingsController.update)

routes.post("/users", usersController.create)

routes.post("/messages", messagesController.create)
routes.get("/messages/:user_id", messagesController.list)

export { routes }