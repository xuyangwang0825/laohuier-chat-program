const Express = require('express');
const Message = require('../models/message');
const Group = require('../models/group');
const User = require('../models/user');
const Socket = require('../models/socket');
const router = Express.Router();

router.post('/list', async (req, res) => {
  const {selfId} = req.body;
  if (!selfId) {
    global.logger.error('selfId can\'t find')
    res.json({
      errno: 1
    });
    return;
  }

  const checkGroup = await Group.find({selfId}).populate({
    path: 'groupId',
    select: 'name'
  }).exec();
  console.log(checkGroup);
  
  res.json({
    errno: 0,
    data: checkGroup
  })
});



module.exports = router;