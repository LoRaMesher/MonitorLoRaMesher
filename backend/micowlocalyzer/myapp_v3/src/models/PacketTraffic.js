const { Schema, model } = require('mongoose');

const PacketTrafficSchema = new Schema({
	recpackets:{type: String, required: true},
    	sendpackets: {type: String, required: true},
    	rechellopackets: {type: String, required: true},
    	sendhellopackets: {type: String, required: true},
        datapackme: {type: String, required: true},
        broadcast: {type: String, required: true},
        fwdpackets: {type: String, required: true},
        queuesendsize: {type: String, required: true},
        dstinyunreach: {type: String, required: true},
        notforme: {type:String, required: true},
        iamvia: {type:String, required: true},
        localaddress: {type:String,required: true},
	totalreceived: {type:String,required: true}
}, {
    timestamps: true
});
module.exports = model('PacketTraffic',PacketTrafficSchema)
