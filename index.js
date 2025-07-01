require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Note = require("./models/note");
const PORT = process.env.PORT;

const app = express();
app.use(express.static("dist"));
app.use(express.json());
app.use(cors());

const requestHandler = (req, res, next) => {
    console.log("Method: ", req.method);
    console.log("Path: ", req.path);
    req.body && console.log("Body: ", req.body);
    console.log("----------------");
    next();
};

app.use(requestHandler);

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
app.get("/api/notes/:id", (req, res, next) => {
    Note.findById(req.params.id)
        .then((note) => {
            if (note) {
                res.json(note);
            } else {
                res.status(404).end();
            }
        })
        .catch((error) => {
            next(error);
        });
});

app.delete("/api/notes/:id", (req, res, next) => {
    Note.findByIdAndDelete(req.params.id)
        .then((result) => res.status(204).end())
        .catch((error) => next(error));
});

app.get("/api/notes", (req, res) => {
    Note.find({}).then((notes) => res.json(notes));
});

app.post("/api/notes", (req, res, next) => {
    const body = req.body;

    const note = new Note({
        content: body.content,
        important: body.important || false,
    });
    note.save()
        .then((savedNote) => res.json(savedNote))
        .catch((error) => next(error));
});

app.put("/api/notes/:id", (req, res, next) => {
    const { content, important } = req.body;

    Note.findById(req.params.id)
        .then((note) => {
            if (!note) {
                return res.status(404).end();
            }

            note.content = content;
            note.important = important;

            return note.save().then((updatedNote) => res.json(updatedNote));
        })
        .catch((error) => next(error));
});
const unkownEndpoint = (req, res, next) => {
    res.status(404).send({ error: "Unknown endpoint" });
};

app.use(unkownEndpoint);

const errorHandler = (error, req, res, next) => {
    console.log(error.name);
    if (error.name === "CastError") {
        return res.status(400).send({ error: "malformatted id" });
    } else if (error.name === "ValidationError") {
        return res.status(400).send({ error: error.message });
    }

    next(error);
};

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
