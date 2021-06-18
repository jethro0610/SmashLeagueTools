const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tournamentSchema = new Schema({
    phaseGroupId: { type: String, required: false},
    name: {type: String, required: false},
    started: { type: Boolean, required: true},
    titleCard: { type: String, required: true},
    subtitleCard: {type: String, required: true},
    hasRegistration: {type: Boolean, required: true},
    bracketUrl: {type: String, required: false},
    registerUrl: {type: String, required: false}
}, 
{
    timestamps: true,
    collection: 'tournament'
});

const Tournament = mongoose.model('Tournament', tournamentSchema);
module.exports = Tournament;