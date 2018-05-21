const mongoose = require('mongoose');
const clientData = require('../model/client');

exports.add = (req, res, callback) => {
    //Fake Date
    let data = Date.now();
    let newEvento = {
        nome: req.body.evento.nome,
        local: req.body.evento.local,
        horario: data,
        descricao: req.body.evento.descricao
    }

    clientData.update({ nome: req.body.nome },
        {
            $push:
                { evento: newEvento }
        },
        (err, cb) => {
            if (err) return callback(err, 404);
            return callback(cb, 200);
        })

};

exports.get = (req, res, callback) => {
    clientData.find({}, { evento: 1 }, (err, cb) => {
        if (err) return callback(err, 404)
        return callback(cb, 200);
    })
};

exports.getOne = (req, res, callback) => {
    let evento = req.body;

    clientData.find(evento.nome, (err, cb) => {
        if (err) return callback(err, 404);
        return callback(cb, 200);
    });
};

exports.del = (req, res, callback) => {
    let event = req.body;

    clientData.findOneAndUpdate({ nome: event.nome },
        { $pull: { evento: { nome: event.evento.nome } } }, false, true, (err, cb) => {
            if (err) return callback(err, 404);
            else return callback(cb, 200);
        });
}









