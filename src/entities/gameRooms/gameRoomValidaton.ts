/* eslint-disable sort-keys */
import Joi from 'joi';
import { gameRoomStatuses } from './types/gameRoom';
import { GAME_OPTIONS } from '../../constants/constants';

const defaultLimit = 10;
const minLimit = 1;
const maxLimit = 50;
const defaultPage = 1;

export const frontEndHomeSchemaDefault = {
  limit: defaultLimit,
  status: gameRoomStatuses.lobby,
  page: defaultPage,
};

const getManyGameRoomsSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(gameRoomStatuses))
    .default(gameRoomStatuses.lobby),

  teamSize: Joi.number()
    .integer()
    .min(GAME_OPTIONS.MIN_TEAM_SIZE)
    .max(GAME_OPTIONS.MAX_TEAM_SIZE),

  timePerRound: Joi.number()
    .integer()
    .min(GAME_OPTIONS.MIN_TIME_PER_ROUND_MINUTES)
    .max(GAME_OPTIONS.MAX_TIME_PER_ROUND_MINUTES),

  limit: Joi.number()
    .integer()
    .positive()
    .min(minLimit)
    .max(maxLimit)
    .default(defaultLimit),

  page: Joi.number().integer().min(defaultPage).positive().default(defaultPage),
});

export default getManyGameRoomsSchema;
