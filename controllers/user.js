'use strict';
const crypto = require('crypto');
const uuidv4 = require('uuid/v4');
const mail = require('../wrappers/mail');
const db = require('../wrappers/db');
const redis = require('redis');
const pool = db.getPool();
const redisDB = redis.createClient();
let query = require('../querys/user');
const errMsg = require('../wrappers/constants');

exports.login = (req, res, callback) => {
    const { name, email, password } = req.body;

    pool.query(query.getUserByEmail, [email]).then(result => {
        if (result.rowCount == 0) return callback(errMsg.userNotFound, 401);
        if (hashPass(password) != result.rows[0].password) return callback(errMsg.wrongPass, 401);

    }).catch((err) => { return callback(err, 500) });
};

exports.add = (req, res, callback) => {
    const { name, email, password, active, device_token, genre, date_birth, cellphone } = req.body.info;

    pool.query(query.getUserByEmail, [email]).then(result => {
        if (result.rowCount > 0) return callback(errMsg.existentEmail, 404);

        let hashpass = hashPass(password);
        //@ToDo get APP_ID.
        const user = {
            name,
            email,
            password: hashpass,
            active,
            device_token,
            genre,
            date_birth,
            cellphone
        };

        const hashParam = uuidv4();
        const key = 'new_user' + hashParam;
        const exp = 36000;

        redisDB.SET(key, JSON.stringify(user), (err, cb) => {
            if (err) return callback('Redis DB Error', 500); // Valído apenas se um CB chegou pois o retorno do SET ou tem um cb dizendo 'OK' ou null caso aja algum error.
            return redisDB.EXPIRE(key, exp, (err, cb) => {
                if (err) return callback('Redis DB Error', 500);
                const url = 'http://localhost:3000/confirm/' + hashParam + '/';

                mail.send({
                    to: user.email,
                    subject: 'Confirmação de conta iSim',
                    html: '<p>Parabeins rapaiz clica aqui pa nos e passa o paiero' + url.toString('utf8') + '.</p>'
                }, (err) => {
                    if (err) return callback('MAIL ERROR', 500);
                    return callback(null, 200, url);
                });
            });
        });
    }).catch((err) => { return callback(err, 404); })
};

exports.confirm = (req, res, callback) => {
    const { hex } = req.params;
    const key = 'new_user' + hex;

    redisDB.GET(key, (err, userInfo) => {
        if (err) return callback(err, 500);
        if (userInfo == null) return callback('Link expirado', 401);

        userInfo = JSON.parse(userInfo);//Volto para Objeto a string de dados do Redis
        userInfo.active = true; // Ativo o Usuario.
        userInfo.cellphone = userInfo.cellphone.replace('-', '');// Removo o - do telefone @TODO fazer no middleware.

        pool.query(query.insertUser,
            [userInfo.name, userInfo.email, userInfo.password, userInfo.active,
            userInfo.device_token, userInfo.genre, userInfo.date_birth, userInfo.cellphone]
        ).then(result => {
            if (result.rowCount > 0)
                return redisDB.DEL(key, (err, cb) => {
                    if (err) return callback(err, 500);
                    callback(null, 204)
                });
            return callback('Erro ao Inserir dados', 404);

        }).catch((err) => { return callback(err, 500) });
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

function hashPass(pass) {
    return crypto.createHash('sha512').update(pass).digest('hex');
}
