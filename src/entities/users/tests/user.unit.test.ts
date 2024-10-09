import { User } from '../User';
import { server } from '../../../app';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

jest.mock('../User');

let mockUser: { email: string; username: string; password: string };
let existingEmailUser: { email: string; username: string; password: string };

beforeAll(async () => {
  // eslint-disable-next-line no-magic-numbers
  const hashedPassword = await bcrypt.hash('password123', 10);
  process.env.JWT_SECRET = 'testSecret';

  mockUser = {
    email: 'user1@example.com',
    password: hashedPassword,
    username: 'user1',
  };

  existingEmailUser = {
    email: 'user2@example.com',
    password: hashedPassword,
    username: 'user2',
  };
});

afterAll(() => {
  jest.clearAllMocks();
  mongoose.connection.close();
});

describe('GET /api/v1/users', () => {
  it('should return all users with status 200', async () => {
    (User.find as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue([
        {
          email: 'user1@example.com',
        },
        {
          email: 'user2@example.com',
        },
      ]),
    });

    const response = await request(server).get('/api/v1/users');
    // eslint-disable-next-line no-magic-numbers
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.data).toBeInstanceOf(Array);
    // eslint-disable-next-line no-magic-numbers
    expect(response.body.data).toHaveLength(2);
    expect(response.body.data[0].email).toBe('user1@example.com');
    expect(response.body.data[0].email).toBe('user1@example.com');
  });
});

describe('POST /api/v1/login', () => {
  it('should return a token and status 200 on successful login', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);

    const response = await request(server)
      .post('/api/v1/users/login')
      .send({ email: 'user1@example.com', password: 'password123' });
    // eslint-disable-next-line no-magic-numbers
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.email).toBe('user1@example.com');
  });

});

describe('POST /api/v1/users/register', () => {
  it('should create a new user and return status 200', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    (User.prototype.save as jest.Mock).mockResolvedValue(existingEmailUser);

    const newUser = {
      email: existingEmailUser.email,
      password: 'password123',
      username: existingEmailUser.username,
    };

    const response = await request(server)
      .post('/api/v1/users/register')
      .send(newUser);
    // eslint-disable-next-line no-magic-numbers
    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.email).toBe(newUser.email);
    expect(response.body.data.username).toBe(newUser.username);
    expect(response.body.data).not.toHaveProperty('password');
  });
});

describe('DELETE /api/v1/users/:id', () => {
  const userIdToDelete = '60c72b2f9b1d4c001f7e9f77';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a user and return status 204', async () => {
    (User.findOne as jest.Mock).mockResolvedValueOnce({
      _id: userIdToDelete,
      email: 'user@example.com',
    });

    const response = await request(server).delete(
      `/api/v1/users/${userIdToDelete}`,
    );
    // eslint-disable-next-line no-magic-numbers
    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });
});

describe('PATCH /api/v1/users/:id (password update)', () => {
  const userIdToUpdate = '60c72b2f9b1d4c001f7e9f77';
  const updateData = {
    email: 'user1@example.com',
    password: 'newPassword123',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update the user password and return status 200', async () => {
    // eslint-disable-next-line no-magic-numbers
    const hashedPassword = await bcrypt.hash(updateData.password, 10);

    (User.findOneAndUpdate as jest.Mock).mockResolvedValue({
      _id: userIdToUpdate,
      email: 'user1@example.com',
      password: hashedPassword,
    });

    const response = await request(server)
      .patch(`/api/v1/users/${userIdToUpdate}`)
      .send(updateData);
    // eslint-disable-next-line no-magic-numbers
    expect(response.status).toBe(200);
    expect(response.body.data.email).toBe('user1@example.com');
    expect(response.body.data.password).not.toBe('newPassword123');
  });
});
