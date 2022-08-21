const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json())
app.use(cors())


let notes = [
    {
        id: 0,
        content: "HTML is easy",
        date: "2018-6-31T16:29:30.97Z",
        important: true,
    },
    {
        id: 1,
        content: "Browser can execute only Javascript",
        date: "2021-6-31T17:38:33.90Z",
        important: false,
    },
    {
        id: 2,
        content: "GET and POST are the most important methods of HTTP protocol",
        date: "2021-6-31T18:19:13.297Z",
        important: true,
    },
];

app.get("/", (request, response) => {
    response.send("<h1>Hello</h1>");
});

app.get("/api/notes", (request, response) => {
    response.json(notes);
});

app.get("/api/notes/:id", (request, response) => {
    const id = Number(request.params.id);
    const note = notes.find((note) => {
        return note.id === id
    });
    if (note) {
        response.json(note);
    } else {
        response.statusMessage = "resource not found"
        response.status(404).end();
    }
});

app.delete("/api/notes/:id", (request, response) => {
    const id = Number(request.params.id);
    notes = notes.filter(note => note.id !== id);
    console.log('note is deleted of id', id);
    response.status(204).end();
})

const generateId = () => {
    const maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0;
    return maxId + 1;
}

app.post('/api/notes/', (req, res) => {
    const body = req.body
    if (!body.content) {
        return res.status(400).json({
            error: 'content missing'
        })
    }
    const note = {
        content: body.content,
        important: body.important || false,
        id: generateId(),
        date: new Date(),
    }

    notes = notes.concat(note);
    return res.json(note)
})

app.put('/api/notes/:id', (req, res) => {
    console.log('in update func')
    const id = Number(req.params.id);
    const body = req.body;
    const important = body.important ? body.important : false;
    if (!body.content) {
        return res.status(400).json({error: "content missing"});
    }
    const content = body.content;

    const note = notes.find(n => n.id === id);
    if (!note) {
        return res.status(404).json({error: `no note on ${id}`})
    }
    const newNote = {id, content, important};
    const newNotes = notes.map(n => n.id !== id ? n : newNote);
    return res.json(newNote);
})

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server runnning on port ${PORT}`);
