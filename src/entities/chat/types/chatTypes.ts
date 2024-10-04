export interface IChat {
  gameRoomId: string;
  messages: Array<{
    userId: string;
    username: string;
    content: string;
    timestamp: string;
  }>;
}
