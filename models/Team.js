const mongoose = require('mongoose');
var teamSchema = mongoose.Schema({
    teamname: {type: String, minlength:2},
    leadername : {type: String, minlength:2},
    leadersurname : {type: String, minlength:4},
    players: {type: Number, max:12},
    teamhq: String,
    borndate: {type: Date}
    }
);
Team = mongoose.model('Team',teamSchema);
module.exports = Team;

