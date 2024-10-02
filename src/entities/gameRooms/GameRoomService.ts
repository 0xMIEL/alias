import { Model } from 'mongoose';
import { IGameRoom, IGameRoomUpdate } from './types/gameRoom';
import { AppError } from '../../core/AppError';

export class GameRoomService {
  constructor(private GameRoom: Model<IGameRoom>) {
    this.GameRoom = GameRoom;
  }

  async create(gameData: IGameRoom) {
    const gameRoom = new this.GameRoom(gameData);

    return await gameRoom.save();
  }

  async getOne(id: string) {
    const gameRoom = await this.GameRoom.findById(id);

    if (!gameRoom) {
      throw new AppError(`Invalid game room id: ${id}`);
    }

    return gameRoom;
  }

  async getMany() {
    return await this.GameRoom.find();
  }

  async update(data: IGameRoomUpdate, id: string) {
    return await this.GameRoom.findOneAndUpdate({ _id: id }, data, {
      new: true,
    });
  }

  async remove(id: string) {
    const deletedRoom = await this.GameRoom.findByIdAndDelete({ _id: id });

    if (!deletedRoom) {
      throw new AppError(`Fail to delete the game room. Id ${id} not found`);
    }

    return deletedRoom;
  }
}
