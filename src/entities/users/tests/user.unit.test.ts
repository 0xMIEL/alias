import { User } from '../User';
import { server } from '../../../app';
import request from 'supertest';

jest.mock('../User');

describe('GET /api/v1/users', () => {
  it('should return all users with status 200', async () => {
    (User.find as jest.Mock).mockResolvedValue([
      {  email: 'user1@example.com', username: 'user1' },
      {  email: 'user2@example.com', username: 'user2' },
    ]);

    const response = await request(server).get('/api/v1/users');

    expect(response.status).toBe(200);

    expect(response.body.data).toBeDefined();
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data).toHaveLength(2);
    expect(response.body.data[0].email).toBe('user1@example.com');
  });
});
