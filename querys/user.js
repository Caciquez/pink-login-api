let insertUser = `INSERT INTO USERS
        (name,email,password,active,device_token,genre,date_birth,cellphone,created_at)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,now())`;
let getUserByEmail = `SELECT id,name,email,password from USERS
            WHERE email like '%' || $1 || '%'`

module.exports = {
    insertUser,
    getUserByEmail
};