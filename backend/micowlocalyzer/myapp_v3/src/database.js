const mongoose = require('mongoose');
const {LORA_MONGODB_HOST,LORA_MONGODB_DATABASE } = process.env;
const MONGODB_URI = `mongodb://${LORA_MONGODB_HOST}/${LORA_MONGODB_DATABASE }`;

mongoose.connect(MONGODB_URI,{
    useUnifiedTopology: true,
    useNewUrlParser:true,
    useCreateIndex: true

})
    .then(db => console.log('Conectada a la DB'))
    .catch(err => console.log(err));
