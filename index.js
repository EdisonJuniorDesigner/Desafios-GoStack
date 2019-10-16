const express = require('express');

const server = express();

  server.use(express.json());


  let numberOfRequest = 0;
  const projects = [];


  //Middleware checa se o projeto existe

  function checkProjectExists(req, res, next) {
    const { id } = req.params;
    const project = projects.find(p => p.id == id);

    if(!project){
      return res.status(400).json({ error: 'Project not found'});
    }

    return next();
  }

  //Middleware que da log no número de requisições

  function logRequest(req, res, next) {
    numberOfRequest++;

    console.log(`Número de requisições: ${numberOfRequest}`);

    return next();
  }

  server.use(logRequest);

  //Projects

  server.get('/projects', (req, res) => {
    return res.json(projects);
  })

  server.post('/projects', (req, res) => {
    const { id, title } = req.body;

    const project = {
      id,
      title,
      tasks: []
    };

    projects.push(project);

    return res.json(project);
  })

  server.put('/projects/:id', checkProjectExists, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find(p => p.id == id);

    project.title = title;
    
    return res.json(project);
  });

  server.delete('/projects/:id', checkProjectExists, (req, res) => {
    const { id } = req.params;

    const projectIndex = projects.findIndex(p => p.id == id);

    projects.splice(projectIndex, 1);

    return res.send();
  });

//tasks

  server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find(p => p.id == id);

    project.tasks.push(title);

    return res.json(project);
  });

//localhost:3000/

server.listen(3000);