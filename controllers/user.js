'use strict';
const db = require('../secrets/rules');


exports.login = (req, res, callback) => {




};

exports.add = (req, res, callback) => {

    const data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        active: req.body.active,
        device_token: req.body.device_token,
        sexo: req.body.sexo,
        data_nascimento: req.body.data_nascimento,
    }

    db.knex('users')
        .returning('id')
        .insert(data).then(result => {
            if (!result) return callback('Erro ao Inserir', 500)
            return callback(null, 200, result);
        })

};



exports.get = (req, res, callback) => {

    db.knex.select('*').from('users').then(users => {
        if (!users) return callback('Error ao Buscar', 401);
        return callback(null, 200, users);
    });

};


exports.update = (req, res, callback) => {
    const idUser = req.body.id;
    const data = req.body;
    delete data['id'];

    db.knex('users')
        .where({ id: idUser }).update(data).then(result => {
            if (!result) return callback('Erro ao atualizar Usuario', 401);
            return callback(null, 204);
        })

};


exports.delete = (req, res, callback) => {
    const data = {
        id: req.body.id
    }

    db.knex('users')
        .where(data).del().then(result => {
            if (!result) return callback('Erro ao Deletar o usuario', 500)
            return callback(null, 200);
        })

};




