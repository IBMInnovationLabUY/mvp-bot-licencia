var MongoClient = require('mongodb').MongoClient

var state = {
  db: null,
  licencesCollection: null,
  employeesCollection: null,
}

exports.connect = function(url, done) {
  if (state.db) return done()

  MongoClient.connect(url, function(err, db) {
    if (err) return done(err)
    state.db = db
    state.chatbotDBCollection = db.db("ChatbotDB").collection("Licences");
    state.employeesCollection = db.db("ChatbotDB").collection("Employees");
    done()
  })
}

exports.get = function() {
  return state.chatbotDBCollection
}

exports.insert_licence = function(datos, done){
  state.chatbotDBCollection.insertOne(datos, function(err, result){
    if (err) return done(err, null)

    done(null, result.insertedId)
  });
}

exports.find_licence = function(datos, done){
  state.chatbotDBCollection.find(datos).toArray(function(err, result) {
    if (err) throw done(err, null);

    done(null, result)
  });
}

exports.find_employee = function(datos, done){
  state.employeesCollection.find(datos).toArray(function(err, result) {
    if (err) throw done(err, null);
      if (result[0]){
        done(null, result[0].available_days)
      }else{
        done(null, 50);
        let element = {
          document_id: datos.document_id,
          available_days: "50"
        };
        state.employeesCollection.insertOne(element);
     }
  });
}

exports.update_employee = function(datos, done){
  state.employeesCollection.update({"document_id": datos.document_id}, {"document_id": datos.document_id, "available_days": datos.available_days},{upsert: true})
}

exports.close = function(done) {
  if (state.db) {
    state.db.close(function(err, result) {
      state.db = null
      state.chatbotDBCollection = null
      state.mode = null
      done(err)
    })
  }
}
