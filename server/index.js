const {
  client,
  createTables,
  fetchUsers,
  fetchPlaces,
  fetchVacations,
  createUser,
  createPlace,
  createVacation,
  destroyVacation
} = require('./db');

const init = async()=> {
  console.log('starting');
  await client.connect();
  console.log('connected to database');
  await createTables();
  console.log('tables created');
  const [moe, lucy, ethyl, rome, nyc, paris] = await Promise.all([
    createUser({ name: 'moe'}),
    createUser({ name: 'lucy'}),
    createUser({ name: 'ethyl'}),
    createPlace({ name: 'rome'}),
    createPlace({ name: 'nyc'}),
    createPlace({ name: 'paris'}),
  ]);
  const users = await fetchUsers();
  console.log(users);
  const places = await fetchPlaces();
  console.log(places);

  const seededVacations = await Promise.all([
    createVacation({ user_id: moe.id, place_id: rome.id}),
    createVacation({ user_id: moe.id, place_id: rome.id}),
    createVacation({ user_id: moe.id, place_id: rome.id}),
    createVacation({ user_id: lucy.id, place_id: rome.id}),
    createVacation({ user_id: ethyl.id, place_id: rome.id})
  ]);

  await destroyVacation(seededVacations[0]);
  const vacations = await fetchVacations();
  console.log(vacations);

  console.log('data seeded');
};

init();
