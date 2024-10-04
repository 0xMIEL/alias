import mongoose, { Model } from 'mongoose';
import {
  gameRoomStatuses,
  IGameRoom,
  IGameRoomUpdate,
  Player,
} from './types/gameRoom';
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
    const gameRoom = await this.GameRoom.findById(id).lean();

    if (!gameRoom) {
      throw new AppError(`Invalid game room id: ${id}`);
    }

    return gameRoom;
  }

  async getMany(filters: object = {}) {
    return await this.GameRoom.find(filters).lean();
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

  async removeAll() {
    await this.GameRoom.deleteMany();
  }

  async joinRoom(roomId: string, userId: string) {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const updatedRoom = await this.GameRoom.findByIdAndUpdate(
      { _id: roomId },
      { $addToSet: { playerJoined: userObjectId } },
      { new: true },
    );

    return updatedRoom;
  }

  async joinTeam(roomId: string, player: Player) {
    const { userId } = player;
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const udpatedRoom = await this.GameRoom.findOneAndUpdate(
      {
        _id: roomId,
        players: { $not: { $elemMatch: { userId: userId } } },
      },
      {
        $addToSet: { players: player },
        $pull: { playerJoined: userObjectId },
      },
      { new: true },
    );

    if (!udpatedRoom) {
      throw new AppError('Player already exists in the room');
    }

    return udpatedRoom;
  }

  async removePlayer(roomId: string, playerId: string) {
    const updatedRoom = await this.GameRoom.findOneAndUpdate(
      { _id: roomId },
      {
        $pull: {
          playerJoined: { userId: playerId },
          players: { userId: playerId },
        },
      },
      { new: true },
    );

    return updatedRoom;
  }

  async startGame(roomId: string) {
    return await this.GameRoom.findByIdAndUpdate(
      { _id: roomId },
      { status: gameRoomStatuses.inProgress },
    );
  }
}
