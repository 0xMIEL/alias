import { Request, Response, NextFunction } from 'express';
import { validateId } from '../../../middleware/validateId';
import mongoose from 'mongoose';
import { AppError } from '../../../core/AppError';

jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');
  return {
    ...actualMongoose,
    Types: {
      ...actualMongoose.Types,
      ObjectId: {
        ...actualMongoose.Types.ObjectId,
        isValid: jest.fn(),
      },
    },
  };
});
describe('validateId middleware', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      body: {},
      cookies: {},
      headers: {},
      params: { id: 'someInvalidId' },
      query: {},
      signedCookies: {},
    } as unknown as Request;

    res = {} as Response;
    next = jest.fn();
  });

  it('should call next with an error when ID is invalid', () => {
    (mongoose.Types.ObjectId.isValid as jest.Mock).mockReturnValue(false);

    validateId(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect((next as jest.Mock).mock.calls[0][0].message).toBe('Invalid id');
    // eslint-disable-next-line no-magic-numbers
    expect((next as jest.Mock).mock.calls[0][0].statusCode).toBe(400);
  });

  it('should call next without arguments when ID is valid', () => {
    req.params.id = '507f1f77bcf86cd799439011';
    (mongoose.Types.ObjectId.isValid as jest.Mock).mockReturnValue(true);

    validateId(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });
});
