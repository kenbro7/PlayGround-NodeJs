var mongoose = require('mongoose');
var schema = mongoose.Schema;

var standupSchema = new schema({
    memberName: String,
    project: String,
    workYesterday: String,
    workToday: String,
    impediment: String,
    createdOn: {
        type: Date,
        default: Date.now
    }
});

// Export model
module.exports = mongoose.model('Standup',standupSchema);