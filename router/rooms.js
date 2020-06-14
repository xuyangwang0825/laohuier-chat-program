const Express = require('express');
const Message = require('../models/message');
const Group = require('../models/group');
const User = require('../models/user');
const Room  = require('../models/room');
const Socket = require('../models/socket');
const router = Express.Router();

router.get('/searchGroup', async (req, res) => {
  const { name } = req.query;
  if(!name) {
    global.logger.error('room can\'t find')
    res.json({
      errno: 0,
      data: []
      // msg: 'name can\'t find'
    });
    return;
  }

  const result = await Room.find({name: new RegExp(name)}, '_id name src').exec();

  res.json({
    errno: 0,
    data: result
  })
})


module.exports = router;