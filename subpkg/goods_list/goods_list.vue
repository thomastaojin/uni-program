<template>
  <view>
    <view class="goods-list">
      <view v-for="(goods, i) in goodsList" :key="i" @click="gotoDetail(goods)">
        <!-- 为 my-goods 组件动态绑定 goods 属性的值 -->
        <my-goods :goods="goods"></my-goods>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 请求参数对象
        queryObj: {
          // 查询关键词
          query: '',
          // 商品分类Id
          cid: '',
          // 页码值
          pagenum: 0,
          // 每页显示多少条数据
          pagesize: 10
        },
        // 商品列表的数据
        goodsList: [],
        // 总数量，用来实现分页
        total: 0,
        // 是否正在请求数据
        isloading: false
      }
    },
    // 跳转到页面的时候携带参数
    onLoad(option) {
      this.queryObj.query = option.query || ''
      this.queryObj.cid = option.cid || ''
      this.getGoodsList()  // 调用获取商品列表数据的方法
    },
    
    methods: {
      // 使用节流在网络请求时间较长时，避免频繁触底多次发送网络请求
      downloadData() {
        if (!this.isloading) {
          // 此处setTimeout其实可以不适用，使用是为了复习布尔值的节流写法
          setTimeout(() => {
            this.getGoodsList()
            this.isloading = false
          }, 100)
        }
        this.isloading = true
      },
      
      // 获取商品列表数据的方法
      async getGoodsList(cb) {
        this.queryObj.pagenum += 1  // 让页码值自增 +1
        const { data: res } = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
        cb && cb()  // 只要数据请求完毕，就立即按需调用 cb 回调函数
        
        if (res.meta.status !== 200) return uni.$showMsg()
         // 为数据赋值：通过展开运算符的形式，进行新旧数据的拼接
        this.goodsList = [...this.goodsList, ...res.message.goods] 
        this.total = res.message.total
      },
      
      gotoDetail(item) {
       uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id  // 问号传参
        })
      }
    },
    
    // 触底的事件
    onReachBottom() {
      if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕!')
      // if (this.isloading) return  // 判断是否正在请求其它数据，如果是，则不发起额外的请求
      this.downloadData()  // 重新获取列表数据
    },
    
    // 下拉刷新的事件
    onPullDownRefresh() {
      // 重置关键数据
      this.queryObj.pagenum = 1
      this.total = 0
      this.isloading = false
      this.goodsList = []
      
      // 重新发起请求
      this.getGoodsList(() => uni.stopPullDownRefresh())
    },
  }
</script>

<style lang="scss">
  
</style>
