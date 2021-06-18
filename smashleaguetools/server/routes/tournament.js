const router = require('express').Router();
const isUser = require('../middleware/isUser');
const isAdmin= require('../middleware/isAdmin');
const setTournament = require('../smashgg').setTournament;
const startTournament = require('../smashgg').startTournament;
const getTournamentInfo = require('../smashgg').getTournamentInfo;

const endpoint = 'https://api.smash.gg/gql/alpha';
const options = {
    headers: {
        'Authorization' : 'Bearer ' + process.env.SMASHGG_KEY
    }
}

router.route('/set').post(isAdmin, (req, res) => {
    if (req.body.phaseGroupId) {
        const query = `{
            phaseGroup(id: "${req.body.phaseGroupId}"){
                id
            }
        }`

        axios.post(endpoint, {query}, options).then(ggRes => {
            if (!ggRes.data.data.phaseGroup) {
                res.status(400).send('Invalid ID');
                return;
            }
            setTournament(ggRes.data.data.phaseGroup.id);
        })
        .catch(error => {
            console.log(error);
        })
    }
    else {
        res.status(400).send('No ID given');
    }
});

router.route('/start').get(isAdmin, (req,res) => {
    if (getTournamentInfo()) {
        startTournament()
        res.send(200);
    }
    else {
        res.send(400);
    }
});

router.route('/signup').get((req,res) => {
    res.send(getTournamentInfo().signupLink);
});

router.route('/bracket').get((req,res) => {
    res.send(getTournamentInfo().bracketLink);
});

router.route('/name').get((req,res) => {
    res.send(getTournamentInfo().tournamentName);
});

module.exports = router;