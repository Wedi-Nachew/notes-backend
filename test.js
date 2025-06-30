const mongoose = require("mongoose");

if (process.argv.length < 3) {
    console.log("provide password as an argument");
    process.exit(1);
}

password = process.argv[2];
const url =
    "mongodb+srv://wedi-nachew:<db_password>@cluster0.or84efx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose
    .connect(url)
    .then(() => {
        const noteSchema = new mongoose.Schema({
            content: String,
            important: Boolean,
        });

        const Note = mongoose.model("Note", noteSchema);
        const note = new Note({
            content: "HTML is easy",
            important: false,
        });

        return note.save();
    })
    .then(() => {
        console.log("note saved");
        return mongoose.connection.close();
    })
    .catch((error) => console.log("Error: ", error));

