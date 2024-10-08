import mongoose, { Model } from 'mongoose';
import {
  GameRoomQueryOptions,
  GameRoomStatus,
  gameRoomStatuses,
  IGameRoom,
  IGameRoomUpdate,
  Player,
} from './types/gameRoom';
import { AppError } from '../../core/AppError';

interface GameRoomQuery {
  status: GameRoomStatus;
  teamSize?: number;
  timePerRound?: number;
}

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

  async getMany(filters: GameRoomQueryOptions) {
    const { limit, page, status, teamSize, timePerRound } = filters;
    const skip = (page - 1) * limit;

    const query: GameRoomQuery = { status };

    if (teamSize) {
      query.teamSize = teamSize;
    }

    if (timePerRound) {
      query.timePerRound = timePerRound;
    }

    return await this.GameRoom.find(query).limit(limit).skip(skip).lean();
  }

  async update(data: IGameRoomUpdate, id: string) {
    return await this.GameRoom.findOneAndUpdate({ _id: id }, data, {
      new: true,
    }).lean();
  }

  async remove(id: string) {
    await this.GameRoom.findByIdAndDelete(id).lean();
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
    ).lean();

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
    ).lean();

    if (!udpatedRoom) {
      throw new AppError('Player already exists in the room');
    }

    return udpatedRoom;
  }

  async leaveRoom(roomId: string, playerId: string) {
    const gameRoom = await this.GameRoom.findById(roomId).lean();

    if (playerId === gameRoom?.hostUserId.toString()) {
      return await this.remove(roomId);
    }

    const playerObjectId = new mongoose.Types.ObjectId(playerId);

    const updatedRoom = await this.GameRoom.findOneAndUpdate(
      { _id: roomId },
      {
        $pull: {
          playerJoined: playerObjectId,
          players: { userId: playerObjectId },
        },
      },
      { new: true },
    ).lean();

    return updatedRoom;
  }

  async startGame(roomId: string) {
    return await this.GameRoom.findByIdAndUpdate(
      { _id: roomId },
      { status: gameRoomStatuses.inProgress },
    ).lean();
  }
}
