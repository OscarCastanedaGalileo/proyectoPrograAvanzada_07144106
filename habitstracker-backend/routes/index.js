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
router.patch('/habits/markasdone/:id', async (req, res) => {
  try{
    const habit = await Habit.findById(req.params.id);
    habit.lastDone = new Date();
    if(timeDifferenceInHours(habit.lastDone, habit.lastUpdate) < 24){
      habit.dias = timeDifferenceInDays(habit.lastDone, habit.startedAt);
      habit.lastUpdate = new Date();
      habit.save();
      res.status(200).json({'message': "Habit  marked as done "});
    }else{
      habit.dias = 1;
      habit.lastUpdate = new Date();
      habit.save();
      res.status(200).json({'message': "Habit restarted"});
    }
    
  } catch(err){
    console.error(err);
    res.status(500).json({message: "Error marking habit as done"});
  }

});

const timeDifferenceInHours = (date1, date2) => {
  const differenceMs = Math.abs(date2 - date1);
  return differenceMs / (1000 * 60 * 60); 
}
const timeDifferenceInDays = (date1, date2) => {
  const differenceMs = Math.abs(date2 - date1);
  return Math.floor (differenceMs / (1000 * 60 * 60 * 24)); 
}
module.exports = router;
