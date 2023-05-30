const axios = require('axios');
const axiosMockAdapter = require('axios-mock-adapter');
const { getTodos, addTodo } = require('../controllers/todos.controller');

describe('GET /users/:userID/todos', () => {
  it('should return todos for a specific user', async () => {
    const mockUserId = 123;
    const mockResponse = [
      { id: 1, title: 'Todo 1', completed: false },
      { id: 2, title: 'Todo 2', completed: true },
    ];

    // Create an instance of the axios mock adapter
    const mockAxios = new axiosMockAdapter(axios);

    // Mock the response for the GET request to the API
    mockAxios.onGet(`https://gorest.co.in/public/v2/users/${mockUserId}/todos`).reply(200, mockResponse);

    // Mock request and response objects
    const req = { params: { userID: mockUserId } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    // Call the function under test
    await getTodos(req, res);

    // Verify the response
    expect(res.json).toHaveBeenCalledWith(mockResponse);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });

  it('should handle error when fetching todos', async () => {
    const mockUserId = 123;

    // Create an instance of the axios mock adapter
    const mockAxios = new axiosMockAdapter(axios);

    // Mock the response for the GET request to the API with an error
    mockAxios.onGet(`https://gorest.co.in/public/v2/users/${mockUserId}/todos`).networkError();

    // Mock request and response objects
    const req = { params: { userID: mockUserId } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    // Call the function under test
    await getTodos(req, res);

    // Verify the response
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Error fetching data from https://gorest.co.in/');
    expect(res.json).not.toHaveBeenCalled();
  });
});

describe('POST /users/:userID/todos', () => {
  it('should add a new todo for a specific user', async () => {
    const mockUserId = 123;
    const mockTodo = {
      id: 1,
      name: 'Test Todo',
      title: 'Test Title',
      due_on: '2023-05-31',
      status: 'pending',
    };
    const mockResponse = { id: 1, ...mockTodo };

    // Create an instance of the axios mock adapter
    const mockAxios = new axiosMockAdapter(axios);

    // Mock the response for the POST request to the API
    mockAxios.onPost(`https://gorest.co.in/public/v2/users/${mockUserId}/todos`).reply(200, mockResponse);

    // Mock request and response objects
    const req = {
      params: { userID: mockUserId },
      body: mockTodo,
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    // Call the function under test
    await addTodo(req, res);

    // Verify the response
    expect(res.json).toHaveBeenCalledWith(mockResponse);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });

  it('should handle missing fields in the todo', async () => {
    const mockUserId = 123;
    const mockTodo = {}; // Missing required fields
    const expectedError = { error: 'Missing required fields. Required: id, name, title, due_on, status.' };

    // Mock request and response objects
    const req = {
      params: { userID: mockUserId },
      body: mockTodo,
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    // Call the function under test
    await addTodo(req, res);

    // Verify the response
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expectedError);
    expect(res.send).not.toHaveBeenCalled();
  });

});