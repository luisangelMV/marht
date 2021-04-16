const mongoose = require('mongoose');

const { NOTES_APP_MONGODB_HOST, NOTES_APP_MONGODB_DATABASE } = process.env;
const MONGODB_URI = `mongodb://${NOTES_APP_MONGODB_HOST}/${NOTES_APP_MONGODB_DATABASE}`;

mongoose.connect(MONGODB_URI, {
    useCreateIndex: true, 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useFindAndModify: false
})
    .then(db => console.log('database is connected'))
    .catch(err => console.log(err));
    
mongoose.Promise = global.Promise;

module.exports = {
    Account: require('./models/account.model'),
    RefreshToken: require('./models/refresh-token'),
    Device: require('./models/device.model'),
    isValidId
};

function isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

