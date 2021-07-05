const router = require('express').Router();
const axios = require('axios');
const isAdmin= require('../middleware/isAdmin');
const setTournament = require('../socketprocesses/smashgg').setTournament;
const startTournament = require('../socketprocesses/smashgg').startTournament;
const endTournament = require('../socketprocesses/smashgg').endTournament;
const setTitleCard = require('../socketprocesses/smashgg').setTitleCard;
const getTournamentInfo = require('../socketprocesses/smashgg').getTournamentInfo;
const isTournamentStarted = require('../socketprocesses/smashgg').isTournamentStarted;

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
        console.log(req.body.phaseGroupId);

        // Get the tournament information from smash.gg
        axios.post(endpoint, {query}, options).then(ggRes => {
            // Send back invalid if the tournament doesn't exist
            if (!ggRes.data.data.phaseGroup) {
                res.status(400).send('Invalid ID');
                return;
            }
            
            // Set the tournament if it's valid
            setTournament(req.body.phaseGroupId, (tournament) => {
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

router.route('/settitlecard').post(isAdmin, (req, res) => {
    setTitleCard(req.body.titleCard, req.body.subtitleCard, true, (info) => {
        res.send(info);
    });
});

router.route('/settitlecardend').post(isAdmin, (req, res) => {
    setTitleCard(req.body.titleCard, req.body.subtitleCard, false, (info) => {
        res.send(info);
    });
});

router.route('/getinfo').get((req, res) => {
    const tournamentInfo = getTournamentInfo();
    res.send({
        phaseGroupId: tournamentInfo.phaseGroupId,
        started: tournamentInfo.started,
        titleCard: tournamentInfo.titleCard,
        subtitleCard: tournamentInfo.subtitleCard,
        hasRegistration: tournamentInfo.hasRegistration,
        bracketUrl: tournamentInfo.bracketUrl,
        registerUrl: tournamentInfo.registerUrl
    })
})

router.route('/start').get(isAdmin, (req,res) => {
    if (!isTournamentStarted()) {
        startTournament()
        res.status(200);
    }
    else {
        res.status(400).send('Tournament already started');
    }
});

router.route('/end').get(isAdmin, (req,res) => {
    if (isTournamentStarted()) {
        endTournament()
        res.status(200);
    }
    else {
        res.status(400).send('There\'s no tournament started right now');
    }
});

router.route('/register').get((req,res) => {
    if (getTournamentInfo().registerUrl)
        res.redirect(getTournamentInfo().registerUrl);
    else
        res.redirect(process.env.FRONTEND_ORIGIN);
});

router.route('/bracket').get((req,res) => {
    if (getTournamentInfo().bracketUrl)
        res.redirect(getTournamentInfo().bracketUrl);
    else
        res.redirect(process.env.FRONTEND_ORIGIN);
});

router.route('/name').get((req,res) => {
    res.send(getTournamentInfo().name);
});

module.exports = router;