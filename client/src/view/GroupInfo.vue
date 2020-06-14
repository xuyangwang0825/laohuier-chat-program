<template>
  <div>
    <Header
      leftIcon="chevron_left"
      rightIcon=""
      content="群组信息"
      color="#03a9f4"
      @leftClick="goback"
      ></Header>
    <div class="all-chat">
      <div class="group-avatar group-list">
        <Avatar v-for="(item,index) in Object.keys(roomUsers[roomid] || {}).slice(0, 3)" class="list-avatar" :key="index" :src="roomUsers[roomid][item].src" ></Avatar>
        <div class="group-more" v-show="Object.keys(allUser).length > 18" @click="gotoMore">查看更多群成员</div>
      </div>   
      <mu-row gutter class="user-tools">
        <mu-col span="6">
          <mu-button class="op" @click="chatwindow(lookRoomInfo._id, lookRoomInfo.name)">发起聊天</mu-button>
        </mu-col>
        <mu-col span="6">
          <mu-button class="op" color="primary" @click="handelAddGroup">加入群聊</mu-button>
        </mu-col>
      </mu-row>   
    </div>
  </div>
</template>

<script>
import Header from "@components/Header";
import Confirm from "@components/Confirm";
import Avatar from "@components/Avatar";
import {mapGetters, mapState} from 'vuex';
import Alert from '@components/Alert';
import {queryString} from '@utils/queryString';
export default {
  name: 'GroupDetail',

  components: {
    Header,
    Avatar
  },
  data () {
    return {
      events: false,
      calls: false,
      messages: false,
      notifications: false,
      sounds: false,
      videoSounds: false,
      roomid: '',
      allUser: {
        '005': {
          src: 'static/files/825836avatar-hua1995116.jpeg'
        }
      }
    };
  },

  computed: {
    ...mapState([
      'roomUsers',
      'userInfo',
      'lookRoomInfo'
    ]),
  },

  async mounted() {
    const roomId = queryString(window.location.href, 'roomId');
    this.roomid = roomId;
    const id = roomId
    await this.$store.dispatch('getUserInfo', {
      id,
    });
    // const allUser = {}
    // let i = 0;
    // while(i < 180) {
    //   allUser[i] = {
    //     src: 'static/files/825836avatar-hua1995116.jpeg'
    //   }
    //   i++;
    //   console.log(i);
    // }
    // this.allUser = allUser;
  },

  methods: {
    async handelAddGroup() {
      const res = await this.$store.dispatch('addGroup', {
        selfId: this.userInfo.id,
        groupId: this.roomid
      });
      if(res.data.errno === 0) {
        console.log('1111');
        Alert({
          content: res.data.data
        })
      } else {
        Alert({
          content: res.data.data
        })
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
    goback() {
      this.$router.isBack = true;
      this.$router.goBack();
    },
    gotoMore() {
      this.$router.push({ path: "/groupMember", query: {roomId: this.roomid} });
    }
  }
}

</script>
<style lang='stylus' scoped>
.all-chat {
  overflow: scroll;
  height: calc(100vh - 50px);
  background: #ddd;
}
.group-avatar {
  padding: 20px 0 10px;
}
.list-avatar {
  margin-left: 10px;
}
.group-more {
  text-align: center;
}
.group-list {
  margin-bottom: 10px;
  background: #fff;
}
.user-tools {
  width: 90%;
  margin: 0 auto;
  left:0;
  right: 0;
  position: center;
  bottom: 100px;
  .op {
    width 100%;
  }
}
</style>