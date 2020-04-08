
const connection = require('../secret').qdc;
const request = require('request');
const querystring = require('querystring');

class QDC {

    constructor(){
        this.baseDir = connection.url+":"+connection.port;
        this.cookie = "Pippo";
        this.test = "Init"
    }

    init (credentials){
        let _this=this;
        return new Promise ( (fulfill, reject) =>{
            
            request({
                headers: {
                  'Content-Type': 'application/json'
                 },
                 uri: this.baseDir+'/qdc/j_spring_security_check?j_username='+credentials.username+'+&j_password='+credentials.password,
                 method: 'POST'
            }, function (err, res, body) {

                if(err)
                    reject({success:false, err:err})

                _this.cookie = JSON.stringify(res.headers["set-cookie"][0].split(";")[0]);
                console.log("INIT --> "+_this.cookie)
                
                fulfill({success:true, cookie : _this.cookie});

            })             
        })        
    }


    getFields(){
        let _this=this;
        return new Promise ( (fulfill, reject) =>{
            request({
                headers: {
                  'Content-Type': 'application/json',
                  cookie: _this.cookie
                 },
                 uri: _this.baseDir+'/qdc/field/v1/getFields',
                 method: 'GET'
            }, function (err, res, body) {

                console.log(_this.cookie)
                if(err)
                    reject({success:false, err:err})

                fulfill({success:true, data: body});

            })                 
        })
    }

    getSources(){
        let _this=this;
        return new Promise ( (fulfill, reject) =>{
            request({
                headers: {
                  'Content-Type': 'application/json',
                  cookie: _this.cookie
                 },
                 uri: _this.baseDir+'/qdc/source/v1/getSources',
                 method: 'GET'
            }, function (err, res, body) {

                console.log(_this.cookie)
                if(err)
                    reject({success:false, err:err})

                fulfill({success:true, data: body});

            })                 
        })
    }


    getSourcesConnection(){
        let _this=this;
        return new Promise ( (fulfill, reject) =>{
            request({
                headers: {
                  'Content-Type': 'application/json',
                  cookie: _this.cookie
                 },
                 uri: _this.baseDir+'/qdc/srcConnection/v1/getConnections',
                 method: 'GET'
            }, function (err, res, body) {

                console.log(_this.cookie)
                if(err)
                    reject({success:false, err:err})

                fulfill({success:true, data: body});

            })                 
        })
    }    

    getGroup(){
        let _this=this;
        return new Promise ( (fulfill, reject) =>{
            request({
                headers: {
                  'Content-Type': 'application/json',
                  cookie: _this.cookie
                 },
                 uri: _this.baseDir+'/qdc/security/group/v1/groupsByUser',
                 method: 'GET'
            }, function (err, res, body) {

                console.log(_this.cookie)
                if(err)
                    reject({success:false, err:err})

                fulfill({success:true, data: body});

            })                 
        })
    }

    saveMetadata(entity, sourceConnectionId) {
        let _this=this;
        return new Promise ( (fulfill, reject) =>{   
            
            let formData = JSON.stringify(entity);
            let queryStr = "bCreateInternal=true&sourceConnectionId="+sourceConnectionId;
            let uri = "/qdc/discovery/saveFileMetadata?"+queryStr

            request({
                headers: {
                  'Content-Type': 'application/json ;charset=UTF-8',
                  Accept : 'application/json, text/plain, */*',
                  Connection : 'keep-alive',
                  'User-Agent' : 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36',
                  Pragma : 'no-cache',
                  'Cache-Control' : 'no-cache',
                  Origin : 'http://e2e-qdc:8080',
                  Referer : 'http://e2e-qdc:8080/qdc/',
                  cookie: _this.cookie
                },
                uri: _this.baseDir+uri,
                method: 'PUT',
                body: formData,
                encoding: null                
            }, function (err, res, body) {

                if(err || (res.statusCode > 399) || (res.statusCode < 199) ){
                    let error = {err:err};
                    if (body) error['body']=body.toString('utf8')
                    if(res && res.headers) error['Headers'] = res.headers
                    if(res && res.statusCode) error['statusCode'] = res.statusCode
                    reject(error)
                }                    
                else {
                    console.log("[save Metadata] "+entity.dataSource.name+" created.");
                    let returnData = {success : true}
                    if(res && res.headers) returnData['Headers'] = res.headers
                    if(res && res.statusCode) returnData['statusCode'] = res.statusCode     
                    if(body) returnData['body'] = body.toString('utf8')                   
                    fulfill(returnData);
                }

            })                 
        })            
    }

    createEntity(entity){
        let _this=this;
        return new Promise ( (fulfill, reject) =>{   
            
            let queryStr = "entityName="+entity.entityName+"&sourceId="+entity.sourceId+"&sourceType="+entity.sourceType+"&baseDirectory="+entity.baseDirectory+"&sourceName="+entity.sourceName;
            let uri = "/qdc/entity/validateEntity?"+queryStr

            request({
                headers: {
                  'Content-Type': 'application/json ;charset=UTF-8',
                  Accept : 'application/json, text/plain, */*',
                  Connection : 'keep-alive',
                  'User-Agent' : 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36',
                  Pragma : 'no-cache',
                  'Cache-Control' : 'no-cache',
                  Origin : 'http://e2e-qdc:8080',
                  Referer : 'http://e2e-qdc:8080/qdc/',
                  cookie: _this.cookie
                },
                uri: _this.baseDir+uri,
                method: 'POST'
            }, function (err, res, body) {

                console.log(_this.cookie)
                if(err || (res.statusCode > 399) || (res.statusCode < 199) ){
                    let error = {err:err};
                    if (body) error['body']=body.toString('utf8')
                    if(res && res.headers) error['Headers'] = res.headers
                    if(res && res.statusCode) error['statusCode'] = res.statusCode
                    reject(error)
                }                    
                else {
                    console.log("[create Entity] "+entity.entityName+" created.");
                    let returnData = {success : true}
                    if(res && res.headers) returnData['Headers'] = res.headers
                    if(res && res.statusCode) returnData['statusCode'] = res.statusCode     
                    if(body) returnData['body'] = body                    
                    fulfill(returnData);
                }

            })                 
        })        
    }

    createSource(source){
        let _this=this;
        return new Promise ( (fulfill, reject) =>{    

            let formData = JSON.stringify(source);

            request({
                headers: {
                  'Content-Type': 'application/json ;charset=UTF-8',
                  Accept : 'application/json, text/plain, */*',
                  Connection : 'keep-alive',
                  'User-Agent' : 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36',
                  Pragma : 'no-cache',
                  'Cache-Control' : 'no-cache',
                  Origin : 'http://e2e-qdc:8080',
                  Referer : 'http://e2e-qdc:8080/qdc/',
                  cookie: _this.cookie
                },
                uri: _this.baseDir+'/qdc/srcConnection/save',
                body: formData,
                encoding: null,
                method: 'PUT'
            }, function (err, res, body) {

                console.log(_this.cookie)
                if(err || (res.statusCode > 399) || (res.statusCode < 199) ){
                    let error = {err:err};
                    if (body) error['body']=body.toString('utf8')
                    if(res && res.headers) error['Headers'] = res.headers
                    if(res && res.statusCode) error['statusCode'] = res.statusCode
                    reject(error)
                }                    
                else {
                    let returnData = JSON.parse(body.toString('utf8'))
                    console.log("[create Source] "+source.name+" created with id: "+returnData.id);
                    
                    fulfill({success:true, data: returnData });
                }

            })                 
        })
    }

}

module.exports = QDC;
