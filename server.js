const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');
let notes = [];

app.use(express.static('public'));

app.get('*', (req, res) => 
    res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    const existingNotes = fs.readFileSync(path.join(__dirname, 'db/db.json'));
    notes = JSON.parse(existingNotes); 
    res.json(notes);
});

app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = uuid.v4();
    notes.push(newNote);
    fs.appendFile(path.join(__dirname, 'db/db.json'), JSON.stringify(notes));
    res.send('Note Added Successfully');
});

app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    const noteIndex = notes.findIndex(noteId);
    notes.splice(noteIndex);
    fs.writeFileSync(path.join(__dirname, 'db/db.json'), JSON.stringify(notes));
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});