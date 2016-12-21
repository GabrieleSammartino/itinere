var express = require('express');
var Team = require('../models/Team');
var router = express.Router();
//middleware scrittura
var middleWrite =(function(req,res,next) {
    if (req.query.token && req.query.token === "write") {
        next();
    }
    else {
        res.status(401).json({message: "Utente non autorizzato"});
    }
});
//middleware lettura
var middleRead=(function(req,res,next) {
    if (req.query.token && req.query.token === "read") {
        next();
    }
    else {
        res.status(401).json({message: "Utente non autorizzato"});
    }
});
router.get('/',middleRead,function(req, res) {
    Team.find({}, function(err,teams){
        if(err) return res.status(500).json({error: err});
        res.json(teams);
    });
});
router.get('/:id',middleRead, function(req, res) {
    Team.find({_id:req.params.id}, function(err,teams)
    {
        if(err) return res.status(500).json({message: 'Utente non trovato'});
        res.json(teams);
    });
});
router.post('/',middleWrite, function (req, res) {
    var newTeam = Team(req.body);
    newTeam.save(function(err){
        res.status(201).json(newTeam);
    })
});
router.put('/:id',middleWrite,function(req,res,next){
    var _setObj = JSON.parse(JSON.stringify({
        teamname: req.body.teamname ? req.body.teamname : undefined,
        leadername: req.body.leadername ? req.body.leadername : undefined,
        leadersurname: req.body.leadersurname ? req.body.leadersurname : undefined,
        players: req.body.players ? req.body.players : undefined,
        teamhq: req.body.teamhq ? req.body.teamhq : undefined,
        borndate: req.body.borndate ? req.body.borndate : undefined

    }));
    if (req.params.id == 'all'){
        var conditions = {}, update =( {$set: _setObj}), options = { multi: true };
        return User.update(conditions, update, options, callback);
        function callback (err) {
            if(err) return res.status(500).json({message: 'Errore'});
            else return res.json({message : "Editate tutte le squadre"})
        }
    }
    else{
        Team.findOne({_id: req.params.id}).exec(function(err, Team){
            if(err) return res.status(500).json({message: 'Squadra non trovata'});
            if(!Team) return res.status(404).json({message: 'Squadra non trovata'});
            for(key in req.body) {
                Team[key] = req.body[key];
            }
            Team.save(function(err){
                if(err) return res.status(500).json({message: 'Non riesco a salvare'});
                res.json(Team);
            })
        })}
});
router.delete('/:id',middleWrite, function (req, res, next) {
    Team.remove({_id: req.params.id}, function(err){
        if(err) return response.status(500).json({message:'Squadra non trovata'});
        res.json({message : 'Squadra eliminata correttamente'})
    })
});

module.exports = router;

