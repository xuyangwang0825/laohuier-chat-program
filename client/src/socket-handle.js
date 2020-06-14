import env from '@utils/env';
import socket from './socket';
import store from './store';

export async function handleInit({
  name,
  id,
  src,
  roomList
}) {
    // 此处逻辑需要抽离复用
  socket.emit('login', {name, id, ...env});
  
  roomList.forEach(item => {
    const obj = {
      name,
      src,
      roomid: item.groupId._id,
    };
    socket.emit('room', obj);
  })
  const obj = {
    name,
    src,
    roomid: 'room1',
  };
  socket.emit('room', obj);
  /*
  roomList.forEach(item => {
    const obj = {
      name,
      src,
      roomid: item,
    };
    socket.emit('room', obj);
  })
  */
  await store.dispatch('getRoomHistory', { selfId: id })
}