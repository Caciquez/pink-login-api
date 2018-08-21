'use strict';
const db = require('../secrets/rules');
const crypto = require('crypto');
const uuidv4 = require('uuid/v4');
const mail = require('../wrappers/mail');
const redis = require('redis');
const redisDB = redis.createClient();

exports.login = (req, res, callback) => {
    console.log(req.body);
    console.log('boop do something bruh!');
};

exports.add = (req, res, callback) => {
    const { name, email, password, active, device_token, sexo, date_birth, cellphone } = req.body.info;
    let hashpass = crypto.createHash('sha512').update(password).digest('hex');

    db.knex('users').where({ email: email }).then(result => {
        if (result.length > 1) return callback('Email ja registrado', 404);
    }).catch((err) => { return callback(err, 404); });

    //@ToDo get APP_ID.
    const user = {
        name,
        email,
        password: hashpass,
        active,
        device_token,
        sexo,
        date_birth,
        cellphone
    };

    const hashParam = uuidv4();
    const key = 'new_user' + hashParam;
    const exp = 36000;

    redisDB.SET(key, JSON.stringify(user), (err, cb) => {
        if (err) return callback('Redis DB Error', 500);    // Valído apenas se um CB chegou pois o retorno do SET ou tem um cb dizendo 'OK' ou null caso aja algum error.
        return redisDB.EXPIRE(key, exp, (err, cb) => {
            if (err) return callback('Redis DB Error', 500);
            const url = 'http://localhost:3000/confirm/' + hashParam + '/';

            mail.send({
                to: user.email,
                subject: 'Confirmação de conta iSim',
                html: '<p>Parabeins rapaiz clica aqui pa nos e passa o paiero' + url.toString('utf8') + '.</p>'
            }, (err) => {
                if (err) return callback('MAIL ERROR', 500);
                callback(null, 200, url);
            });
        });
    });
};

exports.confirm = (req, res, callback) => {
    const { hex } = req.params;
    const key = 'new_user' + hex;

    redisDB.GET(key, (err, userInfo) => {
        if (err) return callback('Error No Redis ao pegar a KEY de confirmar', 500);

        userInfo = JSON.parse(userInfo);//Volto para Objeto a string de dados do Redis
        userInfo.active = true; // Ativo o Usuario.
        userInfo.cellphone = userInfo.cellphone.replace('-', '');// Removo o - do telefone @TODO fazer no middleware.
        
        db.knex('users').returning('id').insert(userInfo).then(result => {
            if (result.length > 0)
                return redisDB.DEL(key, (err, cb) => {
                    if (err) return callback(err, 500);
                    callback(null, 200, result.id)
                });
            return callback('Erro ao Inserir dados', 404);
        });
    });
}



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
        });

};


exports.delete = (req, res, callback) => {
    const data = {
        id: req.body.id
    }

    db.knex('users')
        .where(data).del().then(result => {
            if (!result) return callback('Erro ao Deletar o usuario', 500)
            return callback(null, 200);
        });

};


