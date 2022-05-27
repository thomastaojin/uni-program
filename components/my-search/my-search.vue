<template>
  <view class="my-search-container" :style="{'background-color': bgcolor}">
    <!-- 使用 view 组件模拟 input 输入框的样式 -->
    <view class="my-search-box" :style="{'border-radius': radius + 'px'}" @click="searchBoxHandler">
       <uni-icons type="search" size="17"></uni-icons>
       <text class="placeholder">搜索</text>
    </view>
  </view>
</template>

<script>
  export default {
    name:"my-search",
    data() {
      return {
      }
    },
    
    props: {
      // 背景颜色
      bgcolor: {
        type: String,
        default: '#c00000'
      },
      // 圆角尺寸
      radius: {
       type: Number,
        default: 18  // px
      }
    },
    
    methods: {
      searchBoxHandler()  {
        this.$emit('click')
      }
    },
  }
</script>

<style lang="scss">
  .my-search-container {
    // 移除背景颜色，改由 props 属性控制
    // background-color: #c00000;
    height: 50px;
    padding: 0 15px;
    display: flex;
    align-items: center;   
  }
  
  .my-search-box {
    height: 36px;
    background-color: #fff;
    // 移除圆角尺寸，改由 props 属性控制
    // border-radius: 18px;
    width: 100%;
    display: flex;
    align-items: center; // 纵向居中
    justify-content: center; // 横向居中
    
    .placeholder {
      font-size: 15px;
      margin-left: 5px;
    }
  }
</style>