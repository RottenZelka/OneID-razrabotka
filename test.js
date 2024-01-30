const { request } = require('supertest');
const app = require('./app.js');
const { describe, it } = require('mocha');

describe('Sign-up endpoint', () => {
  it('should create a new user with valid credentials', async () => {
    const newUser = {
      username: 'testuser',
      given_names: 'Test',
      last_name: 'User',
      password_hash: 'password',
      dob: '2000-01-01',
      birth_location: 1,
      home_location: 2,
      personal_bank_account: '1234567890',
      education_history: 'I went to school',
      mom_id: 3,
      dad_id: 4,
      gender_id: 5,
    };

    const response = await request(app).post('/api/signup').send(newUser);
    expect(response.status).toBe(201);
    const user = response.body;
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('username');
    expect(user).toHaveProperty('given_names');
    expect(user).toHaveProperty('last_name');

    const existingUser = await User.findByPk(user.id);
    expect(existingUser).toBeTruthy();
    expect(existingUser.username).toBe(newUser.username);
    expect(existingUser.given_names).toBe(newUser.given_names);
    expect(existingUser.last_name).toBe(newUser.last_name);
  });

  it('should not create a new user with invalid credentials', async () => {
    const newUser = {
      username: 'invalid_username',
      given_names: 'Test',
      last_name: 'User',
      password_hash: 'invalid_password',
      dob: '2000-01-01',
      birth_location: 1,
      home_location: 2,
      personal_bank_account: '1234567890',
      education_history: 'I went to school',
      mom_id: 3,
      dad_id: 4,
      gender_id: 5,
    };

    const response = await request(app).post('/api/signup').send(newUser);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid request');
  });
});
