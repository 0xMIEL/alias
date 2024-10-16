import mongoose, { Model } from 'mongoose';
import { gameRoomStatuses, IGameRoom, IGameRoomUpdate } from './types/gameRoom';
import { AppError } from '../../core/AppError';
import { HTTP_STATUS_CODE } from '../../constants/constants';
import { ApiQueryBuilder } from '../../core/ApiQueryBuilder';
import { isGameRoomFull } from '../../utils/isGameRoomFull';
import { isTeamFull } from '../../utils/isTeamFull';

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

    return gameRoom as IGameRoom;
  }

  async getMany(queryParams: Record<string, unknown>): Promise<IGameRoom[]> {
    const features = new ApiQueryBuilder({
      query: this.GameRoom.find(),
      queryParams: queryParams,
    })
      .filter()
      .sort()
      .paginate();

    const games = await features.query.lean();

    return games as IGameRoom[];
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

    const gameRoom = await this.getOne(roomId);

    if (isGameRoomFull(gameRoom)) {
      throw new AppError('Game room is full');
    }

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
    const teamField1 = `team1.players`;
    const teamField2 = `team2.players`;

    const gameRoom = await this.getOne(roomId);

    if (isTeamFull(gameRoom, team)) {
      throw new AppError('Team is full, please choose another team');
    }

    const updatedRoom = await this.GameRoom.findOneAndUpdate(
      {
        _id: roomId,
        [`${teamField}`]: { $ne: userObjectId },
        [`${teamField1}`]: { $ne: userObjectId },
        [`${teamField2}`]: { $ne: userObjectId },
      },
      {
        $addToSet: { [teamField]: userObjectId },
        $pull: { playerJoined: userObjectId },
      },
      { new: true },
    ).lean();

    if (!updatedRoom) {
      throw new AppError('Player already exists in the one of the team');
    }

    return updatedRoom;
  }

  async leaveRoom(roomId: string, playerId: string) {
    const gameRoom = await this.GameRoom.findById(roomId).lean();

    if (!gameRoom) {
      throw new AppError('Room not found', HTTP_STATUS_CODE.NOT_FOUND_404);
    }

    const playerObjectId = new mongoose.Types.ObjectId(playerId);

    if (playerId.toString() === gameRoom.hostUserId.toString()) {
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

  async updateScoreByOne(roomId: string, userId: string) {
    const gameRoom = await this.getOne(roomId);
    let team = 2;

    gameRoom.team1.players.forEach((player) => {
      if (player._id.toString() === userId) {
        team = 1;
      }
    });

    const scoreField = `team${team}.score`;

    return await this.GameRoom.findByIdAndUpdate(
      roomId,
      { $inc: { [scoreField]: 1 } },
      { new: true },
    ).lean();
  }
}
