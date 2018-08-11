<template>
    <div class="shareApp">
        <div class="shareHeader contentVerticalCenter">
            <div>
                <div style="text-align: center;">
                    <img />
                    <input class="search" data-action="queryShare" @input="eventHander($event)" />
                    <span style="float: right;margin-right: 5%;">取消</span>
                </div>
                <ul v-if="isQuerying">
                    <li v-bind:key="item._id" v-for="item in queryShareData" class="list-group-item">
                        <div style="-webkit-box-flex: 5;padding: 8px;">{{item.code +"---"+ item.name}}</div>
                        <div data-action="favShare" @click="eventHander($event,item)" class='btn-default' style="display:-webkit-box;-webkit-box-orient:vertical;-webkit-box-flex: 1;text-align: center;">
                            关注
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="shareBody">
            <ul class="list-group">
                <li data-action="stockDetail" v-bind:key="item._id" v-for="item in shareData" style="display:-webkit-box;" draggable="true" 
                @dragstart="eventHander($event,item)" class="list-group-item" 
                @dragover="eventHander($event,item)" @drop="eventHander($event,item)">
                    <div style="display:none;">{{ item.f_code }}</div>
                    <div style="-webkit-box-flex: 1;">{{ item.name }}</div>
                    <div style="-webkit-box-flex: 1;">{{ item.price }}</div>
                    <div style="display:-webkit-box;-webkit-box-flex: 3;">
                        <div style="-webkit-box-flex: 1;">{{ item.percentCL +"%" }}</div>
                        <div style="-webkit-box-flex: 1;">{{ item.priceCL }}</div>
                        <div style="-webkit-box-flex: 1;">{{ (item.totalWorth/100000000).toFixed(2) + "亿" }}</div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {};
  },
  computed: {
    maskClass() {
      var share = this.$store.state.todayShareCodes[0];
      var isLoaded = share && share.name;
      return isLoaded ? "shareMask fade-leave" : "shareMask fade-enter";
    },
    waveData() {
      return this.$store.state.waveData;
    },
    shareData() {
      return this.$store.state.todayShareCodes;
    },
    queryShareData() {
      return this.$store.state.queryShareCodes;
    },
    isQuerying() {
      var share = this.$store.state.queryShareCodes;
      return share.length > 0;
    }
  },
  methods: {
    eventHander(ev, data) {
      ev.bindedData = data;
      this.$store.commit("actionController", ev);
    }
  },
  created: function() {},
  beforeUpdate: function() {},
  components: {
  }
};
</script>




<style>
* {
  margin: 0px;
  padding: 0px;
}
body {
  background-color: #ecf0f1;
  font-family: DIN, "Microsoft YaHei", Arial, sans-serif;
  font-size: 14px;
  font-weight: 700;
}
input.search {
  height: 30px;
  vertical-align: top;
  text-indent: 6px;
  line-height: 30px;
  font-size: 14px;
  border: 1px solid #dddce2;
  border-right: 0;
  display: inline-block;
  font-family: "Microsoft YaHei";
  float: left;
}
.contentVerticalCenter {
  display: -webkit-box;
  -webkit-box-orient: vertical;
}

.contentVerticalCenter:before {
  content: "";
  -webkit-box-flex: 1;
  display: block;
}
.contentVerticalCenter:after {
  content: "";
  -webkit-box-flex: 1;
  display: block;
}
.shareApp {
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  padding: 2% 5% 0 5%;
}
.shareMask {
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  z-index: 1;
  text-align: center;
  background-color: #2c2a2d;
  color: white;
  padding-top: 50%;
}
.shareHeader {
  -webkit-box-flex: 1;
  background-color: #ecf0f1;
  overflow: auto;
}
.shareHeader ul {
  padding: 0px;
  height: 200px;
  z-index: 1;
  position: absolute;
  width: 100%;
  background: #ecf0f1;
}
.shareHeader ul li {
  display: -webkit-box;
  margin: 0px;
  padding: 0px;
  background: #95a5a6;
}
.shareBody {
  -webkit-box-flex: 15;
}
.btn-default:before {
  content: "";
  display: block;
  -webkit-box-flex: 1;
}
.btn-default:after {
  content: "";
  display: block;
  -webkit-box-flex: 1;
}
.fade-enter {
  transition: all 0.5s linear;
  opacity: 1;
  pointer-events: none;
}
.fade-leave {
  transition: all 0.5s linear;
  opacity: 0;
  pointer-events: none;
}
</style>