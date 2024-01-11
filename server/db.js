const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/the_acme_travel_web_db');
const uuid = require('uuid');

const createTables = async()=> {
   const SQL = `
      DROP TABLE IF EXISTS vacations;
      DROP TABLE IF EXISTS users;
      DROP TABLE IF EXISTS places;
      CREATE TABLE users(
        id UUID PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE
      );
      CREATE TABLE places(
        id UUID PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE
      );

      CREATE TABLE vacations(
        id UUID PRIMARY KEY,
        departure_date TIMESTAMP DEFAULT now(),
        user_id UUID REFERENCES users(id) NOT NULL,
        place_id UUID REFERENCES places(id) NOT NULL
      );
   `;
  await client.query(SQL);
}

const fetchUsers = async()=> {
  const SQL = `
    SELECT * FROM users;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchPlaces = async()=> {
  const SQL = `
    SELECT * FROM places;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchVacations = async()=> {
  const SQL = `
    SELECT * FROM vacations;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const createUser = async(user)=> {
  const SQL = `
    INSERT INTO users(id, name)
    VALUES ($1, $2)
    RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), user.name]);
  return response.rows[0];
};

const createPlace = async(place)=> {
  const SQL = `
    INSERT INTO places(id, name)
    VALUES ($1, $2)
    RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), place.name]);
  return response.rows[0];
};

//add code for departure_date
const createVacation = async(vacation)=> {
  const SQL = `
    INSERT INTO vacations(id, user_id, place_id)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), vacation.user_id, vacation.place_id]);
  return response.rows[0];
};

const destroyVacation = async(vacation)=> {
  const SQL = `
    DELETE FROM vacations
    WHERE id = $1
  `;
  await client.query(SQL, [vacation.id]);
};


module.exports = {
  client,
  createTables,
  fetchUsers,
  fetchPlaces,
  fetchVacations,
  createUser,
  createPlace,
  createVacation,
  destroyVacation
};
