const Express = require('express');
const Message = require('../models/message');
const Group = require('../models/group');
const User = require('../models/user');
const Room  = require('../models/room');
const Socket = require('../models/socket');
const router = Express.Router();

// 创建群组
router.post('/create',  (req, res) => {
  const { name } = req.body;
  if(name.length > 15) {
    res.json({
      errno: 1,
      data: '用户名过长'
    });
    return;
  }
  room = new Room({
    name
  })
  room.save( (err, room) => {
    if (err) {
      global.logger.error(err)
    }
    const roomInfo = {
      name: name,
      id: room.id,
    }
    res.json({
      errno: 0,
      roomInfo,
      data: '创建成功'
    })
  })
});

//获取room信息
router.get('/getInfo', async (req, res) => {
  const { id } = req.query;
  if (!id) {
    global.logger.error('id can\'t find')
    res.json({
      errno: 1
    });
    return;
  }
  const roomResult = await Room.find({_id: id}).exec();
  console.log(roomResult);
  res.json({
    errno: 0,
    data: {
      id: roomResult[0]._id,
      name: roomResult[0].name,
    }
  })
})

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