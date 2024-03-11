const { MongoClient } = require("mongodb");
const data = require("./data");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const id = Object.keys(data.flights);
const flightInfo = id.map((id) => {
  let flight = {};
  (flight["flight"] = id), (flight["seats"] = data.flights[id]);
  return flight;
});

const batchImport = async () => {
  // creates a new client
  const client = new MongoClient(MONGO_URI, options);
  try {
    // connect to the client
    await client.connect();
    const db = client.db("slingAir");

    // connect to the database (db name is provided as an argument to the function)

    const users = await db.collection("slingair").find().toArray();
    const result = await db.collection("slingair").insertMany(flightInfo);
    const reservation = await db.collection("reservation").find().toArray();
    const insertReservation = await db
      .collection("reservation")
      .insertMany(data.reservations);

    console.log("success");
  } catch (error) {
    console.log(error);
  } finally {
    // close the connection to the database server
    client.close();
  }
};

batchImport();
