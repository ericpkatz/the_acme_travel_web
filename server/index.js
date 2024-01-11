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

const express = require('express');
const app = express();
app.use(express.json());

app.get('/api/users', async(req, res, next)=> {
  try {
    res.send(await fetchUsers());
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/places', async(req, res, next)=> {
  try {
    res.send(await fetchPlaces());
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/vacations', async(req, res, next)=> {
  try {
    res.send(await fetchVacations());
  }
  catch(ex){
    next(ex);
  }
});

app.post('/api/vacations', async(req, res, next)=> {
  try {
    res.status(201).send(await createVacation(req.body));
  }
  catch(ex){
    next(ex);
  }
});

app.delete('/api/vacations/:id', async(req, res, next)=> {
  try {
    await destroyVacation({ id: req.params.id });
    res.sendStatus(204);
  }
  catch(ex){
    next(ex);
  }
});

app.use((error, req, res, next)=> {
  console.log(error);
  res.status(error.status || 500).send({ error: error.message || error });
});

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
  const port = process.env.PORT || 3000;
  app.listen(port, ()=> console.log(`listening on port ${port}`));
};

init();
