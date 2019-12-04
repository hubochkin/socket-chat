export interface IMessage {
  _id: string;
  userId: string;
  name: string;
  message: string;
  data: string;
  lastLogin: Date;
}
export interface IMessageInputDTO {
  name: string;
  userId: string;
  message: string;
}


