<template>
  <div>
    <SearchBarGroup @change="change" @cancel="cancel"></SearchBarGroup>
    <mu-list>
      <mu-sub-header v-if="searchGroupList.length === 0">暂无查询结果</mu-sub-header>
      <mu-list-item avatar button :ripple="false" v-for="item in searchGroupList" :key="item._id" @click="lookInfo(item)">
        <mu-list-item-action>
          <mu-avatar>
            <img :src="item.src">
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
import debounce from 'lodash/debounce';

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
      'searchGroupList'
    ])
  },

  mounted() {

  },

  methods: {
    change (value) {
      console.log(value);
      this.$store.dispatch('getSearchGroup', {name: value});
    },
    cancel() {
      console.log('cancel');
      this.$router.isBack = true;
      this.$router.goBack();
    },
    lookInfo(item) {
      this.$router.push({ path: "/groupDetail", query: { roomId: item.roomid}});
    }
  }
}

</script>
<style lang='scss' scoped>
</style>