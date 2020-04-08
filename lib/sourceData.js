const fs = require ('fs');
const input = require('../secret').input;

class SOURCE_DATA {

    constructor(){
        this.content="";
    }

    init(){
        this.content = JSON.parse(fs.readFileSync(input.fileName,'utf8'));
    }

    getSource(){
        /** Qui va la logica complessissima di trasformazione 
         *  dal formato sorgente al formato JSON di ingestion
         *  per QDC
         */ 

         return this.content.source;
    }

    getEntity(){
        /** Qui va la logica complessissima di trasformazione 
         *  dal formato sorgente al formato JSON di ingestion
         *  per QDC
         */ 

         return this.content.entity.header;
    }    

    getEntityDefinition(){
        /** Qui va la logica complessissima di trasformazione 
         *  dal formato sorgente al formato JSON di ingestion
         *  per QDC
         */ 

         return this.content.entity.definition;
    }      
}

module.exports = SOURCE_DATA