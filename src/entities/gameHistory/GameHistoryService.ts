import { Model, Types } from 'mongoose';
import { Description, Message, Response } from './GameHistory';
import { IDescription, IMessage, IResponse } from './types/gameHistoryTypes';

class GameHistoryService {
  constructor(
    private message: Model<IMessage>,
    private description: Model<IDescription>,
    private response: Model<IResponse>,
  ) {
    this.message = message;
    this.description = description;
    this.response = response;
  }

  async getAllMessages(gameId: string): Promise<Array<IMessage>> {
    return await this.message.find({ gameId });
  }

  async storeMessage(
    gameId: string,
    userId: string,
    username: string,
    text: string,
  ): Promise<IMessage> {
    const newMessage = new this.message({ gameId, text, userId, username });

    return await newMessage.save();
  }

  async getAllDescriptions(gameId: string) {
    return await this.description.find({ gameId }).lean();
  }

  async storeDescription(
    describerId: Types.ObjectId,
    description: string,
    gameId: string,
    roundNumber: number,
    team: number,
  ) {
    const newDescription = new this.description({
      describerId,
      description,
      gameId,
      roundNumber,
      team,
    });

    return await newDescription.save();
  }

  async getAllResponses(gameId: string) {
    return await this.response.find({ gameId }).lean();
  }

  async storeResponse(
    gameId: string,
    response: string,
    roundNumber: number,
    team: number,
  ) {
    const newResponse = new this.response({
      gameId,
      response,
      roundNumber,
      team,
    });

    return await newResponse.save();
  }
}

export const gameHistoryService = new GameHistoryService(
  Message,
  Description,
  Response,
);
