import request from 'supertest';
import { server } from '../../../app'; 
import { UserService } from '../UserService'; 
import { UserController } from '../UserController'; 

jest.mock('./UserService'); // Mock the UserService

const userService = new UserService();
const userController = new UserController(userService);

describe('UserController', () => {
  // Test for register
  describe('POST /api/v1/users/register', () => {
    it('should register a user successfully', async () => {
      const mockUser = { username: 'testuser', password: 'password123' };

      (userService.register as jest.Mock).mockResolvedValue(mockUser); // Mock the register method

      const response = await request(server)
        .post('/api/v1/users/register')
        .send(mockUser);

      expect(response.status).toBe(201); // Adjust the expected status based on your implementation
      expect(response.body).toEqual({ data: mockUser });
    });

    it('should return an error for duplicate user', async () => {
      (userService.create as jest.Mock).mockRejectedValue(new Error('User already exists'));

      const response = await request(server)
        .post('/api/v1/users/register')
        .send({ username: 'duplicateUser', password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'User already exists' });
    });
  });

  // Test for login
  describe('POST /api/v1/users/login', () => {
    it('should log in a user successfully', async () => {
      const mockUser = { username: 'testuser', token: 'mockToken' };

      (userService.getOne as jest.Mock).mockResolvedValue(mockUser); // Mock the login method

      const response = await request(server)
        .post('/api/v1/users/login')
        .send({ username: 'testuser', password: 'password123' });

      expect(response.status).toBe(200); // Adjust based on your implementation
      expect(response.body).toEqual({ data: mockUser });
    });

    it('should return an error for invalid credentials', async () => {
      (userService.getOne as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));

      const response = await request(server)
        .post('/api/v1/users/login')
        .send({ username: 'wronguser', password: 'wrongpassword' });

      expect(response.status).toBe(401); // Adjust based on your implementation
      expect(response.body).toEqual({ error: 'Invalid credentials' });
    });
  });

  // Test for logout
  describe('DELETE /api/v1/users/logout', () => {
    it('should log out a user successfully', async () => {
      (userService.logout as jest.Mock).mockResolvedValue('User logged out successfully'); // Mock the logout method

      const response = await request(server)
        .delete('/api/v1/users/logout')
        .set('Cookie', 'jwtToken=mockToken'); // Set the cookie if necessary

      expect(response.status).toBe(200); // Adjust based on your implementation
      expect(response.body).toEqual({ data: 'User logged out successfully' });
    });

    it('should return an error if not logged in', async () => {
      (userService.logout as jest.Mock).mockRejectedValue(new Error('No active session'));

      const response = await request(server)
        .delete('/api/v1/users/logout');

      expect(response.status).toBe(401); // Adjust based on your implementation
      expect(response.body).toEqual({ error: 'No active session' });
    });
  });
});
