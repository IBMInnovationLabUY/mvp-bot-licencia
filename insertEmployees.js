var MongoClient = require('mongodb').MongoClient


MongoClient.connect("mongodb+srv://dverdier:9cUEGQRcwrrH2jJ@cluster0-sbwe9.mongodb.net/test?retryWrites=true", function(err, db) {
  if (err) return done(err)

  let collection = db.db("ChatbotDB").collection("Employees");

  const cedulas = [
    "41659582",
    "28839050",
    "20004905",
    "34005752",
    "28242679",
    "12007743",
    "50493993",
    "29805040",
    "40582549",
    "42287662",
    "44314468",
    "31955920",
    "19675687",
    "38889180",
    "11850725",
    "49040296",
    "33434422",
    "26775498",
    "58716837",
    "42201447"
  ]

  const dias = [
    "25",
    "2",
    "27",
    "3",
    "22",
    "21",
    "13",
    "20",
    "10",
    "5",
    "26",
    "4",
    "1",
    "21",
    "13",
    "18",
    "1",
    "14",
    "8",
    "11"
  ]

  for (let index = 0; index < cedulas.length; index++) {
    let element = {
      document_id: cedulas[index],
      available_days: dias[index]
    };

    collection.insertOne(element);
  }
  db.close()
})
