const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const cors = require('cors');
const PORT = 3000;
app.use(express.json());
app.use(cors());

const notePathFile = path.join(__dirname, 'notes.json');
function readNoteFromFile() {
    const notes = fs.readFileSync(notePathFile,'utf8');
    return JSON.parse(notes);
}

function writeFiles(notes) {
    fs.writeFileSync(notePathFile, JSON.stringify(notes));
}

///Мидлвар middleware
app.use((req,res ,next )=> {
    console.log('Запрос'+ req.method + req.url);
    console.log(req.body.text);
    next(); // Передача управления в следующий мидлвар
})

// app.use((req,res ,next )=> {
//     console.log('Второй мидлвар '+ req.method + req.url);
//     next();// Передача управления в следующий мидлвар
// })
//
// app.get('/', function (req,res) {
//     res.send("Hello world");
// })

app.get('/notes',(req,res)=>{

    const notes = readNoteFromFile();
    console.log(notes);
    res.json(notes);
})

// Получить одну заметку
app.get('/notes/:id', (req,res) => {
    const notes = readNoteFromFile();
    const id = parseInt(req.params.id);
    const note = notes.find(n => n.id === id);
    if (note) {
        res.json(note);
    } else {
        res.status(404).json({message: "Заметка не найдена"});
    }
})
// Добавить заметку
app.post('/notes/create', (req,res) => {
    const notes = readNoteFromFile();
    const noteToCreate = {
     id: notes.length ? notes[notes.length - 1].id + 1 : 1,
     text: req.body.text}
    notes.push(noteToCreate);
    console.log(notes);
    writeFiles(notes);
    res.status(201).json(notes);
})
// Удалить заметку
app.delete('/notes/:id', function (req,res){
    const notes = readNoteFromFile();
    const id = parseInt(req.params.id);
    const noteToDelete = notes.find(n=>n.id === id);
    const deleteIndex = notes.indexOf(noteToDelete);
    if (deleteIndex > -1) {
        notes.splice(deleteIndex,1);
        writeFiles(notes);
    } else {
        res.status(404).json({message:"Заметка для удаления не найдена"});
    }

    res.status(201).json(notes);


})
// Обновить заметку
app.put('/notes/:id',(req,res) => {
    const notes = readNoteFromFile();
    const id = parseInt(req.params.id);
    const noteToUpdateIndex = notes.findIndex(n=>n.id === id);

    if (noteToUpdateIndex>-1) {
        notes[noteToUpdateIndex] = {
            id: notes[noteToUpdateIndex].id,
            text: req.body.text || notes[noteToUpdateIndex].text
        }
        console.log(notes);
        writeFiles(notes);
        res.status(200).json(notes);
    }
    else {
        res.status(404).json({message: "Заметка не найдена" });
    }

})


 app.listen(PORT, () => {
     console.log(`СЕрвер запущен на порту ${PORT}`);
 })
