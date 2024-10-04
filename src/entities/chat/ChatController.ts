import { BaseController } from './../../core/BaseController';
import ChatService from './ChatService';

export class ChatController extends BaseController {
  constructor(private chatService: ChatService) {
    super()
    this.chatService = chatService;
  }

  
}
