import { io } from '../http'
import UsersService from '../services/UsersService'
import ConnectionsService from '../services/ConnectionsService'
import MessagesService from '../services/MessagesService'

io.on("connect", (socket) => {
    
    console.log("Client socket", socket.id, "connected")
    
    const usersService = new UsersService()
    const connectionsService = new ConnectionsService()
    const messagesService = new MessagesService()
    
    //Socket is called everytime the connection is established, including on server reset.
    //It should update the connection info in the db, 
    //but it should not re-send the last user message - TODO
    socket.on("client_first_access", async (params) => {
        
        //From the last user message
        console.log("Socket params:", params) //text, email

        //To create an entry in 'connections', I need 'user_id' and 'socket_id'

        //this user already exists?
        //'usersService.create' behavior:
        //if users exists, return user; else create one and return it
        const user = await usersService.create(params.email)

        //this connection already exists?
        const connection = await connectionsService.findByUserId(user.id)
        //No
        if (!connection) {
            await connectionsService.create({
                user_id: user.id, 
                socket_id: socket.id
            })
        } 
        //Yes
        //Update current connection with this params:
        //TODO - How did a 'create' command updated the table entry?
        else {
            connection.socket_id = socket.id
            await connectionsService.create(connection)
        }
        
        //Save this users's messages
        await messagesService.create({
            user_id: user.id, 
            text: params.text
        })

        //Get all messages from the user
        const allMessages = await messagesService.listFromUser(user.id)

        //Send them to socket from 'public/js/chat.ts'
        socket.emit("client_list_all_messages", allMessages)

        const allUsers = await connectionsService.findAllWithoutAdmin()
        io.emit("admin_list_all_users", allUsers)
    })

    socket.on("client_send_to_admin", async params => {
        const { text, socket_admin_id } = params

        const socket_id = socket.id
        
        const {user_id} = await connectionsService.findBySocketID(socket_id)

        const message = await messagesService.create({
            text, 
            user_id
        })

        io.to(socket_admin_id).emit("admin_receive_message", {
            message,
            socket_id
        })
    })
})