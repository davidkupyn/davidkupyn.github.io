const mongoose = require('mongoose');

mongoose.set('autoIndex', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);

const hostDB = `mongodb+srv://HeezQ:TechniSchools!@cluster.ehkay.mongodb.net/Technischools?retryWrites=true&w=majority`;

module.exports = {
  hostDB,
};
