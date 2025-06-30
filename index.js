require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Note = require("./models/note");
const PORT = process.env.PORT;

const app = express();
app.use(express.json());
app.use(express.static("dist"));
app.use(cors());

let notes = [
    {
        id: "1",
        content: "HTML is easy",
        important: true,
    },
    {
        id: "2",
        content: "Browser can execute only JavaScript",
        important: false,
    },
    {
        id: "3",
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true,
    },
    {
        id: "4",
        content: "Express makes it easy to code servers in Node",
        important: true,
    },
];

app.get("/", (req, res) => res.send("<h1>Welcome to our server</h1>"));
app.get("/api/notes/:id", (req, res) => {
    console.log("id: ", req.params.id);
    Note.findById(req.params.id).then((note) => res.json(note));
    // .then((note) => {
    //     if (note) {
    //         res.json(note);
    //     } else {
    //         res.status(404).end();
    //     }
    // })
    // .catch((error) => {
    //     res.status(400).json({ error: "malformatted id" });
    // });
});

app.delete("/api/notes/:id", (req, res) => {
    const id = req.params.id;
    notes = notes.filter((note) => note.id !== id);
    res.status(204).end();
});

app.get("/api/notes", (req, res) => {
    Note.find({}).then((notes) => res.json(notes));
});

const generateId = () => {
    const maxId =
        notes.length > 0
            ? Math.max(...notes.map((note) => Number(note.id)))
            : 0;
    return String(maxId + 1);
};

app.post("/api/notes", (req, res) => {
    const body = req.body;
    if (!body.content) {
        return res.status(400).json({ error: "content missing" });
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
    });
    note.save().then((savedNote) => res.json(savedNote));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
