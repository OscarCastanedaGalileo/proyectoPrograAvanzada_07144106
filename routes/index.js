var express = require('express');
var router = express.Router();
const Habit = require('../modelo/habit');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/hello', function(req, res, next) {
  res.json({"status": "success", "message": "Hello World!"});
});

router.get('/habits', async function(req, res) {
  try{
    const habits = await Habit.find();
    res.json(habits);
  }catch(err){
    res.status(500).json({message: "Error getting habits"});
  }
});

router.post('/habits', async function(req, res) {
  try{
    const { titulo, descripcion } = req.body;
    const habit = new Habit({ titulo, descripcion });
    await habit.save()
    res.json(habit);
  }catch(err){
    res.status(400).json({message: "Error creando habito"});
  }
});

router.delete('/habits/:id', async (req, res) => { 
  try{
    await Habit.findByIdAndDelete(req.params.id);
    res.json({message: 'Habit deleted'});
  }catch(err){
    res.status(500).json({message: "Habit not found"});
  }
});

module.exports = router;
