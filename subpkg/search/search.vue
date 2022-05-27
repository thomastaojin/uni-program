<template>
  <view>
    <view class="search-box">
      <!-- 基本用法 -->
      <uni-search-bar @input="input" :radius="100" cancelButton="none"></uni-search-bar>
    </view>
    
    <!-- 搜索建议列表 -->
    <view class="sugg-list" v-if="searchResults.length !== 0">
      <view class="sugg-item" v-for="(item, i) in searchResults" :key="i" @click="gotoDetail(item)">
        <view class="goods-name">{{item.goods_name}}</view>
        <uni-icons type="arrowright" size="16"></uni-icons>
      </view>
    </view>
      
    <!-- 搜索历史  -->
    <view class="history-box" v-else>
      <!-- 标题区域 -->
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="17" @click="cleanHistory"></uni-icons>
      </view>
      <!-- 列表区域 -->
      <!-- 使用了计算属性 histories -->
      <view class="history-list">
        <uni-tag :text="item" v-for="(item, i) in histories" :key="i" @click="gotoGoodsList(item)"></uni-tag>
      </view>
    </view>
    
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 延时器的 timerId
        timer: null,
        kw: '',
        // 搜索结果列表
        searchResults: [],
        // 搜索关键词的历史记录
        historyList: []
      }
    },
    
    onLoad() {
      this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
    },
    
    methods: {
      input(e) {
        // 清除 timer 对应的延时器
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          // 如果 500 毫秒内，没有触发新的输入事件，则为搜索关键词赋值
          // console.log(e);
          this.kw = e,
          this.getSearchList()
        }, 500)
      },
      
      // 根据搜索关键词，搜索商品建议列表
      async getSearchList() {
        // 判断关键词是否为空
        if(this.kw.length === 0) {
          this.searchResults = []
          return
        }
        // 发起请求，获取搜索建议列表
        const {data: res} = await uni.$http.get('/api/public/v1/goods/qsearch', {query: this.kw})
        if (res.meta.status !== 200) return uni.$showMsg()
        this.searchResults = res.message
        
        // 查询到搜索建议之后，调用 saveSearchHistory() 方法保存搜索关键词
        this.saveSearchHistory()
        
      },
      
      gotoDetail(item) {
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?good_id=' + item.goods_id
        })
      },
      
      // 保存搜索关键词的方法 
      saveSearchHistory() {
        const set = new Set(this.historyList)
        set.delete(this.kw)
        set.add(this.kw)
        this.historyList = Array.from(set)
        // 调用 uni.setStorageSync(key, value) 将搜索历史记录持久化存储到本地
        uni.setStorageSync('kw', JSON.stringify(this.historyList))  
      },
      
      cleanHistory() {
        this.historyList = []
        uni.setStorageSync('kw', '[]')
      },
      
      gotoGoodsList(kw) {
        uni.navigateTo({
          url: '/subpkg/goods_list/goods_list?query=' + kw
        })
      },
    },
    
    // 计算属性
    computed: {
      histories() {
        // 注意：由于数组是引用类型，所以不要直接基于原数组调用 reverse 方法，以免修改原数组中元素的顺序
        // 而是应该新建一个内存无关的数组，再进行 reverse 反转  
        return [...this.historyList].reverse()
      }
    },
  }
</script>

<style lang="scss">
  .search-box {
    position: sticky;
    top: 0;
    z-index: 999;
  }
  
  .sugg-list {
    padding: 0 5px;
    
    .sugg-item {
      font-size: 16px;
      padding: 13px 0;
      border-bottom: 1px solid #efefef;
      display: flex;
      align-items: center; // 纵向居中
      justify-content: space-between; //两端贴边对齐
      
      .goods-name {
        // 文字不允许换行（单行文本）
        white-space: nowrap;
        // 溢出部分隐藏
        overflow: hidden;
        // 文本溢出后，使用 ... 代替
        text-overflow: ellipsis;
      }
    }
  }

  .history-box {
    padding: 0 7px;
    
    .history-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      font-size: 14px;
      border-bottom: 1px solid #efefef;
    }
    .history-list {
      margin-top: 5px;
      display: flex;
      flex-wrap: wrap;
      
      .uni-tag {
        color: #000;
        font-weight: 500;
        margin-right: 5px;
        background-color: #f8f8ff;
        border: 1px solid #fff;
        border-radius: 15%;
      }
    }
  }
</style>
