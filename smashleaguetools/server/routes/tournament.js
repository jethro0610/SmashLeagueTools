const router = require('express').Router();
const axios = require('axios');
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
    
    if (req.body.tournamentId) {
        const query = `{
            phaseGroup(id: "${req.body.tournamentId}"){
                id
            }
        }`

        axios.post(endpoint, {query}, options).then(ggRes => {
            if (!ggRes.data.data.phaseGroup) {
                res.status(400).send('Invalid ID');
                return;
            }
            
            setTournament(ggRes.data.data.phaseGroup.id.toString(), (tournament) => {
                res.send(tournament);
            });
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
    if (getTournamentInfo().signupLink)
        res.redirect(getTournamentInfo().signupLink);
    else
        res.redirect(process.env.FRONTEND_ORIGIN);
});

router.route('/bracket').get((req,res) => {
    if (getTournamentInfo().bracketLink)
        res.redirect(getTournamentInfo().bracketLink);
    else
        res.redirect(process.env.FRONTEND_ORIGIN);
});

router.route('/name').get((req,res) => {
    res.send(getTournamentInfo().tournamentName);
});

module.exports = router;