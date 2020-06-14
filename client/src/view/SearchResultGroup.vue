<template>
  <div>
    <SearchBarGroup @change="change" @cancel="cancel"></SearchBarGroup>
    <mu-list>
      <mu-sub-header v-if="searchGroupList.length == 0">
        暂无查询结果
        </br>
        <mu-button class="op" color="primary" @click="handelCreateRoom">创建名为{{value}}群聊</mu-button>
      </mu-sub-header>
      <mu-list-item avatar button :ripple="false" v-for="item in searchGroupList" :key="item._id" @click="lookInfo(item)">
        <mu-list-item-action>
          <mu-avatar>
            <img src= "http://markdown.diobrando0825.cn/2020-06-14-ajpg.jpg" >
          </mu-avatar>
        </mu-list-item-action>
        <mu-list-item-title>{{item.name}}</mu-list-item-title>
        <mu-list-item-action>
          <mu-icon value="chat_bubble"></mu-icon>
        </mu-list-item-action>
      </mu-list-item>
    </mu-list>
  </div>
</template>

<script>
import { mapState } from "vuex";
import SearchBarGroup from "@components/searchBarGroup";
import {queryString} from '@utils/queryString';
import debounce from 'lodash/debounce';
import Toast from "@components/Toast";
import Alert from '@components/Alert';

export default {
  name: 'SearchResultGroup',

  components: {
    SearchBarGroup
  },
  data () {
    return {
    };
  },

  computed: {
    ...mapState([
      'searchGroupList',
      'UserInfo'
    ])
  },

  mounted() {
  },

  methods: {
    change (value) {
      this.value = value
      console.log(value);
      this.$store.dispatch('getSearchGroup', {name: value});
    },
    cancel() {
      console.log('cancel');
      this.$router.isBack = true;
      this.$router.goBack();
    },
    lookInfo(item) {
      this.$router.push({ path: "/groupInfo", query: {roomId: item._id}});
    },
    async handelCreateRoom() {
      if (!this.value){
        Alert({
          content: "请输入想创建的群聊名称"
        })
      } else {
        const res = await this.$store.dispatch('createRoom', {
          name: this.value
        });
        if (res.status === "success") {
          Toast({
            content: res.data.data,
            timeout: 1000,
            background: "#2196f3"
          });
          /*
          const roomInfo = {
            name: res.data.roomInfo.name,
            id: res.data.userInfo.id,
          }
          await handleInit({
            name: userInfo.userid,
            id: userInfo.id,
            src: userInfo.src,
            roomList: roomList
          })
          this.$router.push({ path: "/"});
          */
        this.$router.go(-1)
        } else {
          Alert({
            content: res.data.data
          });
        }
      }
    }
  }
}

</script>
<style lang='scss' scoped>
</style>