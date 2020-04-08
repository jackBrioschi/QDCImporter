const credentials = require('./secret').credentials;
const QDC = require('./lib/qdc');
const source = require('./lib/sourceData');


const qdc = new QDC();
const src = new source();

src.init();

qdc.init(credentials)
.then(() =>  qdc.createSource(src.getSource()))
//.then(() =>  qdc.createEntity(src.getEntity()))
.then( (res) => qdc.saveMetadata(src.getEntityDefinition(),res.data.id))
//.then( () => qdc.getSources())
.then(data => console.log("Processo di importazione terminato"))
//.then(() => qdc.getSourcesConnection())
.catch (error => console.log(error))

