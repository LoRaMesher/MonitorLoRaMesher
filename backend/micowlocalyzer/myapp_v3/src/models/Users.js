const { Schema, model } = require('mongoose');
const bcryptjs = require('bcryptjs');

const UserSchema = new Schema({
    name: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true}
}, {
    timestamps: true
});

//Metodo asincrono que cifra pass
UserSchema.methods.encryptPassword = async password => {
    const salt = await bcryptjs.genSalt(10); //await para que siga haciendo cosas
    return await bcryptjs.hash(password,salt);
};

//Comparar pass y devuelve true or false
UserSchema.methods.matchPassword = async function(password) {
    return await bcryptjs.compare(password, this.password);
};
module.exports = model('User',UserSchema);
