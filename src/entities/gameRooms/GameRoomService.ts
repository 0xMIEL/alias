import { Model } from 'mongoose';
import { IGameRoom, IGameRoomUpdate } from './types/gameRoom';

export class GameRoomService {
  constructor(private GameRoom: Model<IGameRoom>) {
    this.GameRoom = GameRoom;
  }

  async create(gameData: IGameRoom) {
    const gameRoom = new this.GameRoom(gameData);

    return await gameRoom.save();
  }

  async getOne(id: string) {
    return await this.GameRoom.findById(id);
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
    return await this.GameRoom.findByIdAndDelete({ _id: id });
  }
}
