const Express = require('express');
const Message = require('../models/message');
const Group = require('../models/group');
const User = require('../models/user');
const Socket = require('../models/socket');
const router = Express.Router();

// 添加好友
router.post('/add', async (req, res) => {
  const {selfId, groupId} = req.body;
  if (!selfId || !groupId) {
    global.logger.error('selfId / roomId can\'t find')
    res.json({
      errno: 1
    });
    return;
  }
  try {
    if(selfId === groupId) {
      res.json({
        error: 1,
        data: '咱不开玩笑，放过自己吧🤣'
      })
      return;
    }

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
    const groupRes = await Group.find({selfId: groupId}).populate({
      path: 'groupId',
      select: 'name src socketId'
    }).exec();
    const selfSockets = await Socket.find({ userId: friendId });
    selfSockets.forEach((socket) => {
      // 兼容多端设备
      // io.to(socket.socketId).emit('message', mess);
      global.socketIO.to(socket.socketId).emit('friend', friendRes);
    });

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
    select: 'name src socketId'
  }).exec();
  console.log(checkGroup);

  res.json({
    errno: 0,
    data: checkGroup
  })
});


module.exports = router;