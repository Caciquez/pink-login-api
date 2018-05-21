const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  nome: String,
  endereco: String,
  descricao: String,
  email: String,
  evento: [{
    nome: String,
    local: String,
    horario: Date,
    descricao: String,
  }],
});


module.exports = mongoose.model('client', clientSchema);
