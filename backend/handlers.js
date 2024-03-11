"use strict";
const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// use this package to generate unique ids: https://www.npmjs.com/package/uuid
const { v4: uuidv4 } = require("uuid");

// returns an array of all flight numbers
const getFlights = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db("slingAir");
    const result = await db.collection("slingair").distinct("flight");
    res.status(200).json({
      status: 200,
      message: "Success",
      flights: result,
    });
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
};

// returns all the seats on a specified flight
const getFlight = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const { flight } = req.params;
  try {
    await client.connect();
    const db = client.db("slingAir");
    const result = await db.collection("slingair").findOne({ flight: flight });
    res.status(200).json({
      status: 200,
      message: "Success",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: "error",
      data: flight,
    });
    console.log(error);
  } finally {
    client.close();
  }
};

// returns all reservations
const getReservations = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db("slingAir");
    const result = await db.collection("reservation").find().toArray();
    res.status(200).json({
      status: 200,
      message: "Success",
      Reservations: result,
    });
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
};

// returns a single reservation
const getSingleReservation = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const { reservation } = req.params;
  console.log(reservation);
  try {
    await client.connect();
    const db = client.db("slingAir");
    const result = await db
      .collection("reservation")
      .findOne({ id: reservation });
    res.status(200).json({
      status: 200,
      message: "Success",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: "error",
      data: reservation,
    });
    console.log(error);
  } finally {
    client.close();
  }
};

// creates a new reservation
const addReservation = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  //insertOne

  try {
    const id = uuidv4();
    await client.connect();
    const db = client.db("slingAir");
    const checkFlight = await db
      .collection("slingair")
      .findOne({ flight: req.body.flight });

    const newValue = checkFlight.seats.find((seat) => {
      return seat.id === req.body.seat;
    });
    console.log(newValue);
    if (newValue.isAvailable === false) {
      return res.status(400).json({
        status: 400,
        message: "Not Available",
      });
    } else {
      const { flight, seat } = req.body;
      const result = await db
        .collection("reservation")
        .insertOne({ id, ...req.body });
      //query // newvalues ---> in the updateone method
      const query = { flight: flight, seats: { $elemMatch: { id: seat } } };
      const eachSeat = { $set: { "seats.$.isAvailable": false } };
      const update = await db.collection("slingair").updateOne(query, eachSeat);
      if (update.acknowledged) {
        res.status(200).json({
          status: 200,
          message: "Reservation sucessful",
          data: id,
        });
      } else {
        return res.status(404).json({
          status: 404,
          message: "Reservation Unsucessful",
        });
      }
    }
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: "error",
      data: req.body,
    });
    console.log(error);
  } finally {
    client.close();
  }
};

// updates a specified reservation
const updateReservation = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const { id, givenName, surname, email, flight, seat } = req.body;
  const query = { flight: flight, "seats.id": seat };
  const newValue = { $set: { "seats.$.isAvailable": false } };

  //findOne //update one
  // deletes a specified reservation
  try {
    await client.connect();
    const db = client.db("slingAir");
    //finding the previous seat
    const update = await db.collection("reservation").findOne({ id });
    // .updateOne("") the old seat
    const oldSeat = await db
      .collection("slingair")
      .updateOne(
        { flight: flight, "seats.id": update.seat },
        { $set: { "seats.$.isAvailable": true } }
      );

    //.updateOne("") the new seat
    const newSeat = await db.collection("slingair").updateOne(query, newValue);

    const result = await db
      .collection("reservation")
      .updateOne({ id }, { $set: { givenName, surname, email, flight, seat } });
    res.status(200).json({
      status: 200,
      message: "Reservation updated",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: "error",
      data: req.body,
      error: error.stack,
    });
    console.log(error);
  } finally {
    client.close();
  }
};

const deleteReservation = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const id = req.params.reservation;

  try {
    await client.connect();
    const db = client.db("slingAir");
    const result = await db.collection("reservation").findOne({ id: id });
    const seat = result.seat;
    const flight = result.flight;
    const query = { flight: flight, "seats.id": seat };
    const newValue = { $set: { "seats.$.isAvailable": true } };

    const update = await db.collection("slingair").updateOne(query, newValue);
    const deleting = await db.collection("reservation").deleteOne({ id: id });
    res.status(200).json({
      status: 200,
      message: "Reservations deleted",
    });
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: "error",
      data: deleting,
    });
    console.log(error);
  } finally {
    client.close();
  }
};

module.exports = {
  getFlights,
  getFlight,
  getReservations,
  addReservation,
  getSingleReservation,
  deleteReservation,
  updateReservation,
};
