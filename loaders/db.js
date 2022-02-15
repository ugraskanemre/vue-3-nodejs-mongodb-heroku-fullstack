var Mongoose = require("mongoose");

const db = Mongoose.connection;

db.once('open', () => {
    console.log('MongoDB: Connected');
});
db.once('error', (err) => {
    console.log('MongoDB: Error', err);
});

const connectDB = async() => {

    if (process.env.NODE_ENV == "development") {
        await Mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.qyjtt.mongodb.net/vueExpress?retryWrites=true&w=majority`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    } else {
        await Mongoose.connect(process.env.MONGODB_URI);
    }

}

module.exports = {
    connectDB
}