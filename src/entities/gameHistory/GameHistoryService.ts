import { Model, Types } from 'mongoose';
import { IDescription, IMessage, IResponse } from './types/gameHistoryTypes';

class GameHistoryService {
  constructor(
    private Message: Model<IMessage>,
    private Description: Model<IDescription>,
    private Response: Model<IResponse>,
  ) {
    this.Message = Message;
    this.Description = Description;
    this.Response = Response;
  }

  async getAllMessages(gameId: Types.ObjectId) {
    return await this.Message.find({ gameId });
  }

  async storeMessage(
    gameId: Types.ObjectId,
    senderId: Types.ObjectId,
    text: string,
  ) {
    const newMessage = new this.Message({ gameId, senderId, text });

    return await newMessage.save();
  }

  async getAllDescriptions(
    gameId: Types.ObjectId,
    roundNumber: number,
    team: 'A' | 'B',
  ) {
    return await this.Description.find({ gameId, roundNumber, team });
  }

  async storeDescription(
    describerId: Types.ObjectId,
    description: string,
    gameId: Types.ObjectId,
    roundNumber: number,
    team: 'A' | 'B',
  ) {
    const newDescription = new this.Description({
      describerId,
      description,
      gameId,
      roundNumber,
      team,
    });

    return await newDescription.save();
  }

  async getAllResponses(
    gameId: Types.ObjectId,
    roundNumber: number,
    team: 'A' | 'B',
  ) {
    return await this.Response.find({ gameId, roundNumber, team });
  }

  async storeResponse(
    gameId: Types.ObjectId,
    playerId: Types.ObjectId,
    response: string,
    roundNumber: number,
    team: 'A' | 'B',
  ) {
    const newResponse = new this.Response({
      gameId,
      playerId,
      response,
      roundNumber,
      team,
    });

    return await newResponse.save();
  }
}

export default GameHistoryService;
