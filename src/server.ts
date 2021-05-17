
//All the former code from server.ts is now at http.ts

import { http } from './http'
import './websockets/client'
import './websockets/admin'

//app.listen(3333, () => {console.log('Server running on port 3333')})
http.listen(3333, () => {console.log('Server running on port 3333')})
