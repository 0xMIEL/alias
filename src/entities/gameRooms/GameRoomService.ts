import mongoose, { Model } from 'mongoose';
import {
  GameRoomQueryOptions,
  GameRoomStatus,
  gameRoomStatuses,
  IGameRoom,
  IGameRoomUpdate,
} from './types/gameRoom';
import { AppError } from '../../core/AppError';
import { HTTP_STATUS_CODE } from '../../constants/constants';

interface GameRoomQuery {
  status: GameRoomStatus;
  teamSize?: number;
  timePerRound?: number;
}

type JoinTeamProps = {
  roomId: string;
  team: number;
  userId: string;
};

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

  async joinTeam({ roomId, team, userId }: JoinTeamProps) {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const teamField = `team${team}.players`;

    const updatedRoom = await this.GameRoom.findOneAndUpdate(
      {
        _id: roomId,
        [`${teamField}`]: { $ne: userObjectId },
      },
      {
        $addToSet: { [teamField]: userObjectId },
        $pull: { playerJoined: userObjectId },
      },
      { new: true },
    ).lean();

    if (!updatedRoom) {
      throw new AppError('Player already exists in the room');
    }

    return updatedRoom;
  }

  async leaveRoom(roomId: string, playerId: string) {
    const gameRoom = await this.GameRoom.findById(roomId).lean();

    if (!gameRoom) {
      throw new AppError('Room not found', HTTP_STATUS_CODE.NOT_FOUND_404);
    }

    const playerObjectId = new mongoose.Types.ObjectId(playerId);

    if (playerId === gameRoom.hostUserId.toString()) {
      return await this.remove(roomId);
    }

    const updatedRoom = await this.GameRoom.findOneAndUpdate(
      { _id: roomId },
      {
        $pull: {
          playerJoined: playerObjectId,
          'team1.players': playerObjectId,
          'team2.players': playerObjectId,
        },
      },
      { new: true },
    ).lean();

    if (!updatedRoom) {
      throw new AppError(
        'Failed to update room',
        HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR_500,
      );
    }

    return updatedRoom;
  }

  async startGame(roomId: string) {
    return await this.GameRoom.findByIdAndUpdate(
      { _id: roomId },
      { status: gameRoomStatuses.inProgress },
    ).lean();
  }

  async updateScoreByOne(roomId: string, team: number) {
    const scoreField = `team${team}.score`;

    return await this.GameRoom.findByIdAndUpdate(
      roomId,
      { $inc: { [scoreField]: 1 } },
      { new: true },
    ).lean();
  }
}
