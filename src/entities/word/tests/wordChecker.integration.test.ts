/* eslint-disable */
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { server } from '../../../app';
import { Word } from '../Word';
import { User } from '../../users/User';


describe('WordChecker Integration Tests', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    logSpy.mockRestore();
  });

  beforeEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
    jest.restoreAllMocks();
  });

  
  it('should return a random word', async () => {
    await Word.create([
        { category: "testCategory", difficulty: "easy", value: 'apple' }, 
        { category: "testCategory", difficulty: "easy", value: 'banana' }
    ]);

    const response = await request(server)
        .post(`/api/v1/word/randomWord`)
        .send({ difficulty: 'easy' });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('value');
    expect(['apple', 'banana']).toContain(response.body.data.value);
  });

  it('should check word similarity correctly', async () => {

    const response = await request(server)
        .post(`/api/v1/word/similarity`)
        .send({
            inputWord: { value: 'applle' }, 
            targetWord: { value: 'apple' }
        });
           
    expect(response.status).toBe(200);
    expect(response.body.data).toBeGreaterThan(0.8);
    });

    
  });

  it('should return 400 if sent wrong type of difficulty', async () => {
    const response = await request(server)
        .post(`/api/v1/word/randomWord`)
        .send({ difficulty: 'wrongDifficulty' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid difficulty level.');
  });

  it('should return validation error for missing input word', async () => {
    const response = await request(server).post(`/api/v1/word/similarity`)
    .send({
      inputWord: '',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Both input and target words must be provided.');
  });




