import mongoose from "mongoose";

const bookSchema = mongoose.Schema({
    name: String,
    
    category: String,
    image: String,
    title: String,
    link:String,
});
const Book = mongoose.model("Book", bookSchema);

export default Book;