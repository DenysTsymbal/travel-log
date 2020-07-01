/* eslint linebreak-style: ["error", "windows"] */

const { Router } = require('express');

const router = Router();

const LogEntry = require('../models/LogEntry');

router.get('/', async (req, res) => {
  try {
  const entries = await LogEntry.find(); 
  res.json(entries);
  }
  catch(error)
  {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
   const logEntry = new LogEntry(req.body);
   const createdEntry = await logEntry.save();
   res.json(createdEntry);
  }
  catch(error)
  {
    console.log(error.name);
    if(error.name === 'ValidationError')
    {
      res.status(422);
    }
    next(error);
  }
});

router.delete('/', async (req, res, next) => {
   try {
      const deleted = await LogEntry.deleteOne(req.body);
      
      res.json({
        deleted: req.body,
        number: deleted.deletedCount,
      });
   }
   catch(error) {
     console.log(error);
     next(error);
   }
});

module.exports = router;
