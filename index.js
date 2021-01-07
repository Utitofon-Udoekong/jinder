const express = require('express')
const pool = require('./db')

const app = express()

const PORT = 5000

app.use(express.json())

app.get('/', async (req, res) => {
    const allTodos = await pool.query("SELECT * FROM todo")
    res.send(allTodos.rows.reverse())
})
// get all todo
app.get('/todos', async (req, res) => {
    try {
        const allTodos = await pool.query("SELECT * FROM todo")

        res.json(allTodos.rows)
        res.send(allTodos.rows)
    } catch (error) {
        console.error(error.message)
    }
})


// get a todo
app.get('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params
        const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id])
        res.json(todo.rows[0])
    } catch (error) {

    }
})

// create todo
app.post('/todos', async (req, res) => {
    try {
        const { description } = req.body
        const newTodo = await pool.query("INSERT into todo (description) VALUES ($1) RETURNING * ",
            [description])
        res.json(newTodo.rows[0])
    } catch (error) {
        console.error(error)
    }
})


// update todo
app.put('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;

        const updateTodo = await pool.query("UPDATE todo SET description = $1 WHERE todo_id = $2", [description, id])

        res.json("todo was updated")

    } catch (error) {
        console.error(error)
    }
})

// delete todo
app.delete('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const delTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [id])

        res.json("todo was deleted!")
    } catch (error) {
        console.error(error)
    }
})

app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`)
})