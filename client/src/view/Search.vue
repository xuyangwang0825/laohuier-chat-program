<template>
  <div>
    <SearchBarUser disabled="true" @submit="handleSearchUser"></SearchBarUser>
    <SearchBarGroup disabled="true" @submit="handleSearchGroup"></SearchBarGroup>
    <div>
      <mu-sub-header>热门用户</mu-sub-header>
      <mu-chip class="list-chip" :color="item.color" v-for="item in mapHotList" :key="item._id" @click="lookInfo(item)">
        <mu-avatar :size="32">
          <img :src="item.user.src">
        </mu-avatar>
        {{item._id.length > 10 ? `${item._id.slice(0,10)}...` : item._id}}
      </mu-chip>
    </div>
    <div style="height:80px"></div>
    <Bottom></Bottom>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { clear, removeItem } from "@utils/localStorage";
import Confirm from "@components/Confirm";
import Alert from "@components/Alert";
import Bottom from "@components/Bottom";
import UserHead from "@components/userHead";
import SearchBarUser from "@components/searchBarUser";
import SearchBarGroup from "@components/searchBarGroup";
const randomColor = require('randomcolor');
import { sort } from '@utils/tools';

export default {
  name: 'Search',
  data() {
    return {};
  },
  async mounted() {
    await this.$store.dispatch('getHostUserList');
    await this.$store.dispatch('getvipuser');
    console.log(this.vipUserList);
  },
  methods: {
    changeAvatar() {
      this.$router.push("/avatar");
    },
    lookInfo(item) {
      this.$router.push({ path: "/persionDetail", query: { id: item._id } });
    },
    handleSearchUser() {

      this.$router.push("/searchResultUser");
    },
    handleSearchGroup() {

      this.$router.push("/searchResultGroup");
    },
  },
  computed: {
    ...mapState([
      'hotUserList',
      'userInfo',
      'vipUserList'
    ]),
    mapHotList() {
      return this.hotUserList.map(item => ({
        ...item,
        color: randomColor()
      }))
    }
  },
  components: {
    Bottom,
    UserHead,
    SearchBarUser,
    SearchBarGroup
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

.logout {
  margin: 0 20px;
}
.demo-chip-wrapper {
  text-align: center;
}
.list-chip {
  margin: 8px;
  vertical-align: middle;
}
.vip-chip {
  position: relative;
  .vip-img {
    display: block;
    left: -8px;
    top: -17px;
    width: 28px;
    position: absolute;
  }
}
</style>
