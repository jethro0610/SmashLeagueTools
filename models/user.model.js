const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true},
    discordId: { type: String, required: true},
    balance: { type: Number, required: true},
    admin: {type: Boolean, required: true},
    ggSlug: {type: String, requred: false}
}, 
{
    timestamps: true,
});

const User = mongoose.model('User', userSchema);
module.exports = User;