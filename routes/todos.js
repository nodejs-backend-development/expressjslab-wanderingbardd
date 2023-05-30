const express = require('express');

const { getTodos, addTodo } = require('../controllers/todos.controller');

const router = express.Router();

/* GET todos listing. */
router.get('/', (req, res) => {
    res.status(500).send("Please send user ID");
});

router.get('/:userID/todos', getTodos);

router.post('/:userID/todos', addTodo);

module.exports = router;