const express = require('express');
const fs = require('fs').promises;

const app = express();
const PORT = 3000;

app.use(express.json());

const leerTareas = async () => {
  const data = await fs.readFile('tareas.json', 'utf-8');
  return JSON.parse(data);
};

const escribirTareas = async (tareas) => {
  await fs.writeFile('tareas.json', JSON.stringify(tareas, null, 2));
};

app.get('/tareas', async (req, res) => {
  const tareas = await leerTareas();
  res.json(tareas);
});

app.post('/tareas', async (req, res) => {
  const { titulo, descripcion } = req.body;
  const tareas = await leerTareas();

  const nuevaTarea = {
    id: Date.now(),
    titulo,
    descripcion
  };

  tareas.push(nuevaTarea);
  await escribirTareas(tareas);

  res.status(201).json(nuevaTarea);
});

app.put('/tareas/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion } = req.body;

  const tareas = JSON.parse(await fs.readFile('tareas.json'));

  const index = tareas.findIndex(t => t.id == id);

  if (index === -1) {
    return res.status(404).json({ mensaje: 'Tarea no encontrada' });
  }

  tareas[index].titulo = titulo;
  tareas[index].descripcion = descripcion;

  await fs.writeFile('tareas.json', JSON.stringify(tareas, null, 2));
  res.json(tareas[index]);
});


app.delete('/tareas/:id', async (req, res) => {
  const { id } = req.params;
  const tareas = await leerTareas();

  const nuevasTareas = tareas.filter(t => t.id != id);
  await escribirTareas(nuevasTareas);

  res.json({ mensaje: 'Tarea eliminada' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
