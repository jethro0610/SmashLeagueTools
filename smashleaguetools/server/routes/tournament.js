const router = require('express').Router();
const axios = require('axios');
const isAdmin= require('../middleware/isAdmin');
const isTournamentStarted = require('../smashgg').isTournamentStarted;
const getPreRegInfo = require('../preregInfo').getPreRegInfo;
const setPreRegInfo = require('../preregInfo').setPreRegInfo;
const setTournament = require('../smashgg').setTournament;
const startTournament = require('../smashgg').startTournament;
const endTournament = require('../smashgg').endTournament;
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

router.route('/setprereg').post((req, res) => {
    setPreRegInfo(req.body.preregTitle, req.body.preregDate, (info) => {
        res.send(info);
    });
});

router.route('/getinfo').get((req, res) => {
    const tournamentInfo = getTournamentInfo();
    const preregInfo = getPreRegInfo();
    res.send({
        preregTitle: preregInfo.preregTitle,
        preregDate: preregInfo.preregDate,
        id: tournamentInfo.phaseGroupId,
        title: tournamentInfo.tournamentName,
        started: isTournamentStarted()
    })
})

router.route('/start').get(isAdmin, (req,res) => {
    if (getTournamentInfo()) {
        if (!isTournamentStarted()) {
            startTournament()
            res.status(200);
        }
        else {
            res.status(400).send('Tournament already started');
        }
    }
    else {
        res.status(400).send('No tournament is set');
    }
});

router.route('/end').get(isAdmin, (req,res) => {
    if (getTournamentInfo()) {
        if (isTournamentStarted()) {
            endTournament()
            res.status(200);
        }
        else {
            res.status(400).send('There\'s no tournament started right now');
        }
    }
    else {
        res.status(400).send('No tournament is set');
    }
});

router.route('/signup').get((req,res) => {
    if (getTournamentInfo().signupLink)
        res.redirect(getTournamentInfo().signupLink + '/register');
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