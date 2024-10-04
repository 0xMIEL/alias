export interface IMessage {
  userId: string;
  username: string;
  content: string;
  sendAt: Date;
}

export interface IChat {
  gameRoomId: string;
  messages: Array<IMessage>;
}
