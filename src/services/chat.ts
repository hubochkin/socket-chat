import { Service, Inject } from 'typedi';

import config from '../config';
import { Container } from 'typedi';
import middlewares from '../api/middlewares';
import MessageService from './message';
import { IMessageInputDTO } from '../interfaces/IMessage';


const changeUserData = (funcData, data, userId, username) => {
  funcData.message = data.message;
  funcData.name = username;
  if (userId) {
    funcData.userId = userId;
  }
  delete funcData._id;
  return funcData;
}



@Service()
export default class ChatService {
  constructor(
    @Inject('logger') private logger,
  ) { }

  public async joinChat(io) {
    const secret = config.jwtSecret;
    try {

      io.on('connection', (socket) => {
        let date = new Date();

        const token = socket.handshake;
        console.log('New user connected');

        const socketData = middlewares.isSocketAuth(secret, token);

        const authServiceInstance = Container.get(MessageService);
        let history = authServiceInstance.GetHistory();
        history.then(function (result) {
          result.reverse().forEach(element => {
            socket.emit('new_message', { message: element.message, username: element.name });
          });

          // console.log(result[1]) // "Some User token"
        })

        //default username
        socket.username = 'User'

        //listen on change_username
        socket.on('change_username', (data) => {
          socket.username = data.username
        })

        //listen on new_message
        socket.on('new_message', (data) => {
          //broadcast the new message
          let tmpDate = new Date();
          var Difference_In_Time = tmpDate.getTime() - date.getTime();
          date = new Date();
          
          if (Difference_In_Time > 200 && data.message.length < 300 && data.message.length > 0) {
            const userId = socketData._id;
            let newSocketData = socketData;
            const authServiceInstance = Container.get(MessageService);
            newSocketData = changeUserData(newSocketData, data, userId, socket.username);

            authServiceInstance.AddMessage(newSocketData as IMessageInputDTO);
            io.sockets.emit('new_message', { message: data.message, username: socket.username, id: socket.id });
          }

        })

        //listen on typing
        socket.on('typing', (data) => {
          socket.broadcast.emit('typing', { username: socket.username })
        })
      })

    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }



}
