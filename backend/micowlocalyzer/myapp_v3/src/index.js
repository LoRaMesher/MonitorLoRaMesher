//Arrancar server,base de datos y otras configs básicas
require('dotenv').config();
const { default: CreateApi } = require('@elastic/elasticsearch/lib/api/api/create');
const app = require('./server');
require('./database');
const createTables = require('./setup/setupelastic.js')
const createTab = async() =>  {

createTables().catch(e => console.log(e))
}

setTimeout(createTab,35000);

app.listen(app.get('port'),() => {
    //const  misetup = setup.createTables().catch(e => console.log(e))
    console.log('Server on port:', app.get('port'));
});
