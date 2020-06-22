<template>
  <div class="hello">
    <div class="">
      <mu-appbar>
        <mu-button icon slot="left" >
        </mu-button>
        <div class="title">唠会儿</div>
        <mu-button icon slot="right">
          <mu-icon value="expand_more" color="#03a9f4"></mu-icon>
        </mu-button>
      </mu-appbar>
    </div>
    <div class="chat-list">
      <mu-paper>
        <mu-list style="background: #eee">
          <mu-sub-header>世界说</mu-sub-header>
          <mu-list-item style="padding: 5px 0 5px 0;background: #fff;border-radius: 5px;margin: 0 10px 0 10px" avatar button :ripple="true" @click="chatwindow('room1')">
            <mu-list-item-action>
              <div class="avatar">
                <span class="tip" v-if="unRead1!==0">{{unRead1 > 99 ? '99+' : unRead1}}</span>
                <Avatar :src="house1" size="small"></Avatar>
              </div>
            </mu-list-item-action>
            <mu-list-item-content>
              <mu-list-item-title>公共聊天室</mu-list-item-title>
              <mu-list-item-sub-title>{{getTailMsg('room1')}}</mu-list-item-sub-title>
            </mu-list-item-content>
            <mu-list-item-action>
              <mu-icon value="chat_bubble"></mu-icon>
            </mu-list-item-action>
          </mu-list-item>
        </mu-list>
        <mu-list style="background: #eee">
          <mu-sub-header>我的群聊</mu-sub-header>
          <mu-list-item style="padding: 5px 0 5px 0;background: #fff;border-radius: 5px;margin: 0 10px 0 10px" avatar button :ripple="true" @click="chatwindow(item.groupId._id, item.groupId.name)" v-for="item in groupList" :key="item._id">
            <mu-list-item-action>
              <div class="avatar">
                <Avatar :src="house1" size="small"></Avatar>
              </div>
            </mu-list-item-action>
            <mu-list-item-content>
              <mu-list-item-title>{{item.groupId.name}}</mu-list-item-title>
              <mu-list-item-sub-title>{{getTailMsg(item.groupId._id)}}</mu-list-item-sub-title>
            </mu-list-item-content>
            <mu-list-item-action>
              <mu-icon value="chat_bubble"></mu-icon>
            </mu-list-item-action>
          </mu-list-item>
        </mu-list>
        <mu-list style="background: #eee">
          <mu-sub-header>好友</mu-sub-header>
          <mu-list-item style="padding: 5px 0 5px 0;background: #fff;border-radius: 5px;margin: 0 10px 0 10px" avatar button :ripple="true" @click="chatSingle(item.friendId._id, item.friendId.name)" v-for="item in friendList" :key="item._id">
            <mu-list-item-action>
              <mu-avatar class="avatar">
                <img :src="item.friendId.src">
              </mu-avatar>
            </mu-list-item-action>
            <mu-list-item-content>
              <mu-list-item-title>{{item.friendId.name}}</mu-list-item-title>
              <mu-list-item-sub-title>{{getSingleTailMsg(item.friendId._id)}}</mu-list-item-sub-title>
            </mu-list-item-content>
            <mu-list-item-action>
              <mu-icon value="chat_bubble"></mu-icon>
            </mu-list-item-action>
          </mu-list-item>
        </mu-list>
      </mu-paper>
    </div>
    <Bottom></Bottom>
  </div>
</template>

<script>
import Confirm from "@components/Confirm";
import Bottom from "@components/Bottom";
import Avatar from "@components/Avatar";
import { mapState } from "vuex";
import env from '@utils/env';
import { sort } from '@utils/tools';
import { ROBOT_URL, HOST_URL1, HOST_URL2 } from "@const/index";
import socket from "../socket";

export default {
  name: 'Loan',
  data() {
    return {
      house1: HOST_URL1,
      house2: HOST_URL2,
      robot: ROBOT_URL
    };
  },
  async mounted() {
    // 只全局监听一次
    if(this.userInfo.id) {
      this.$store.dispatch('postListFriend', {selfId: this.userInfo.id});
      this.$store.dispatch('postListGroup', {selfId: this.userInfo.id});
    }
  },
  methods: {
    getSingleTailMsg(friendId) {
      const userId = this.userInfo.id;
      const roomID = sort(userId, friendId);
      return this.getTailMsg(roomID);
    },
    getTailMsg(roomid) {
      const roomData = this.roomdetail[roomid] || [];
      if(roomData.length === 0) {
        return '暂无消息';
      }
      const lastMsg = roomData[roomData.length-1];
      const { username, msg, img } = lastMsg;

      if(img) {
        return `${username}说: [图片]`;
      } else {
        const content = `${username}说: ${msg}`;
        if(content.length > 15) {
          return `${username}说: ${msg.slice(0, 7)}...`;
        }
        return content;
      }
    },
    async chatwindow(roomID, roomName) {
      if (!this.userInfo.token) {
        const res = await Confirm({
          title: "提示",
          content: "聊天请先登录，但是你可以查看聊天记录哦~"
        });
        if (res === "submit") {
          this.$router.push({ path: "login" });
        }
        return;
      }
      this.$router.push({ path: "/chat", query: { roomId: roomID, type: 'group', roomName} });
    },
    async chatSingle(friendId, friendName) {
      const userId = this.userInfo.id;
      const roomID = sort(userId, friendId);
      this.$router.push({ path: "/chat", query: { roomId: roomID, from: userId,to: friendId, type: 'single', friendName } });
    },
    chatRobot() {
      this.$router.push({ path: "/robot" });
    }
  },
  computed: {
    ...mapState({
      roomdetail: state => state.roomdetail,
      username: state => state.userInfo.userid,
      userid: state => state.userInfo.id,
      src: state => state.userInfo.src,
      isLogin: state => state.isLogin,
      unRead1: state => state.unRead.room1,
      unRead2: state => state.unRead.room2,
      userInfo: state => state.userInfo,
      friendList: state => state.friendList,
      groupList: state => state.groupList
    })
  },
  components: {
    Bottom,
    Avatar
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">

.title {
  text-align: center;
  color: #03a9f4;
}
.chat-list {
  overflow-y: scroll;
  height: calc(100% - 133px);
  background: #eee;
}
.avatar {
  position: relative;

  .tip {
    position: absolute;
    right: -5px;
    top: -8px;
    padding: 0px 5px;
    border-radius: 10px;
    line-height: 20px;
    text-align: center;
    background: #ff2a2a;
    color: #fff;
    font-size: 12px;
  }

  .mu-avatar {
    img {
      border-radius: 5px;
    }
  }
}
</style>
