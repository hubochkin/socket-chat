import { Service, Inject } from 'typedi';
import { IMessage, IMessageInputDTO } from '../interfaces/IMessage';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';



@Service()
export default class MessageService {
    constructor(
        @Inject('chatModel') private chatModel: Models.ChatModel,
        @Inject('logger') private logger,
    ) { }

    public async AddMessage(messageInputDTO: IMessageInputDTO): Promise<{ chat: IMessage }> {
        try {


            this.logger.silly('Creating message db record');
            const messageRecord = await this.chatModel.create({
                ...messageInputDTO,
            });


            if (!messageRecord) {
                throw new Error('Message cannot be add to db');
            }

            const message = messageRecord.toObject();

            return message;
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    public async GetHistory() {
        try {



            this.logger.silly('Creating message db record');

            const messages = await this.chatModel.find({}).sort('-date').limit(10).exec();
            // console.log("here" + posts)


            if (!messages) {
                throw new Error('Did not got message history from db');
            }
            return messages;
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }



}
