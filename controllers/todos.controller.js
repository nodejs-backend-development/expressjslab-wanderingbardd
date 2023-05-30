const axios = require('axios');

const getTodos = async (req, res) => {
  const { userID } = req.params;
  try {
    const response = await axios.get(`https://gorest.co.in/public/v2/users/${userID}/todos`);
    res.json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(404).send('Post not found.');
    } else {
      res.status(500).send('Error fetching data from https://gorest.co.in/');
    }
  }
};

const addTodo = async (req, res) => {
  const { userID } = req.params;
  const { id, name, title, due_on, status} = req.body;

  const userIDInt = parseInt(userID);

  if (!id || !name || !title || !due_on || !status) {
    res.status(400).json({ error: 'Missing required fields. Required: id, name, title, due_on, status.' });
    return;
  }

  const todo = {
    id,
    user_id: userIDInt,
    title,
    due_on,
    status,
  };

  const headers = {
    Authorization: 'Bearer 3106b91e11485649402da29d801a1df5ef3c6d0f50a79e5623caa093ac97efa4',
    'Content-Type': 'application/json',
  };

  try {
    const response = await axios.post(`https://gorest.co.in/public/v2/users/${userID}/todos`, todo, { headers });
    res.json(response.data);
  } catch (error) {
    console.log(error);
    if (error.response && error.response.status === 401) {
      console.log('Authorization wrong');
    }
    res.status(500).send(error.message);
  }
};

module.exports = {
  getTodos,
  addTodo,
};
