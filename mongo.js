const mongoose = require("mongoose");

console.log("Starting mongo.js...");

if (process.argv.length < 3) {
    console.log("give password as argument");
    process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://wedi-nachew:${password}@cluster0.or84efx.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose
    .connect(url)
    .then(() => {
        const noteSchema = new mongoose.Schema({
            content: String,
            important: Boolean,
        });

        const Note = mongoose.model("Note", noteSchema);
        return Note.find({})
            .then((res) => {
                console.log(res);
            })
            .catch((err) => console.log("fetching error", err));

        // const note = new Note({
        //     content: "Mongoose isn't easy to work with",
        //     important: true,
        // });

        // return note
        //     .save()
        //     .then((res) => {
        //         console.log("note saved!", res);
        //     })
        //     .catch((err) => console.log("saving error: ", err));
    })
    .then(() => {
        return mongoose.connection.close();
    })
    .then(() => {
        console.log("MongoDB connection closed.");
    })
    .catch((error) => {
        console.error("Error occurred:", error);
    });
