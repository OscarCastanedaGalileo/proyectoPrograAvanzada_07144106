var express = require('express');
var router = express.Router();
const Habit = require('../modelo/habit');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const authhenticateToken = (req, res, next) => {
  const token = req.headers['Authorization'] || req.headers['authorization'];
  if(!token) {
    return res.status(401).json({message: "Acceso denegado, no se encontró el token"});
  }try{
    const tokenWithoutBearer = token.replace('Bearer ', '');
    const verified = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
    req.user = verified;
    next();
  }catch(error){
    return res.status(403).json({message: "Token no válido o expirado"});
  } 
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/hello', function(req, res, next) {
  res.json({"status": "success", "message": "Hello World!"});
});

router.get('/habits', authhenticateToken, async function(req, res) {
  try{
    let userId = req.user && req.user.userId ? req.user.userId : res.status(500).json({message: "Error getting Habits"});

    const habits = await Habit.find({ userId: mongoose.Types.ObjectId(userId) });
    res.json(habits);
  }catch(err){
    res.status(500).json({message: "Error getting habits"});
  }
});

router.post('/habits', authhenticateToken, async function(req, res) {
  try{
    const { titulo, descripcion } = req.body;
    let userId = req.user && req.user.userId ? req.user.userId : res.status(500).json({message: "Error creating Habit"});
    userId = mongoose.Types.ObjectId(userId);
    const habit = new Habit({ titulo, descripcion, userId });
    await habit.save()
    res.json(habit);
  }catch(err){
    res.status(400).json({message: "Error creando habito"});
  }
});

router.delete('/habits/:id', authhenticateToken, async (req, res) => { 
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