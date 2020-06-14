const Express = require('express');
const Message = require('../models/message');
const Group = require('../models/group');
const User = require('../models/user');
const Socket = require('../models/socket');
const router = Express.Router();

// 加入群组
router.post('/add', async (req, res) => {
  const {selfId, groupId} = req.body;
  if (!selfId || !groupId) {
    global.logger.error('selfId / groupId can\'t find')
    res.json({
      errno: 1
    });
    return;
  }
  try {

    const checkUser = await User.findOne({_id: selfId}).exec();

    if(checkUser.length === 0 ) {
      res.json({
        errno: 1,
        data: '登录异常，请重新登录'
      });
      return;
    }

    const checkGroup = await Group.find({selfId, groupId}).exec();

    if(checkGroup.length !== 0) {
      res.json({
        errno: 1,
        data: '您已经添加过该群组，请勿重复添加'
      });
      return;
    }

    const groupMoal = {
      selfId,
      groupId,
    }

    const group = new Group(groupMoal);

    const groupResult = await group.save();

    console.log(groupResult);

    res.json({
      data: '添加成功',
      errno: 0,
    });
    /*
    socket.join(roomid);
    global.socketIO.to(groupId).emit('room', { onlineUsers, roomid }
    */
    /*
    const groupRes = await Group.find({selfId: friendId}).populate({
      path: 'friendId',
      select: 'name src socketId'
    }).exec();
    const selfSockets = await Socket.find({ userId: friendId });
    selfSockets.forEach((socket) => {
      // 兼容多端设备
      // io.to(socket.socketId).emit('message', mess);
      global.socketIO.to(socket.socketId).emit('friend', friendRes);
    });
    */
  } catch(e) {
    console.log(e);
    res.json({
      errno: 1,
      data: '服务器异常'
    })
  }
});

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