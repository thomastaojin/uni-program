import { mapGetters } from 'vuex'

// 导出一个 mixin 对象
export default {
  computed: {
    // 将 m_cart 模块中的 total 映射为当前页面的计算属性
    ...mapGetters('m_cart', ['total'])
  },
  onShow() {
    // 在页面刚展示的时候，设置数字徽标
    this.setBadge()
  },
  
  methods: {
    // 调用 uni.setTabBarBadge() 方法，为购物车设置右上角的徽标
    setBadge() {
      uni.setTabBarBadge({
        index: 2, // 索引
        text: this.total + ''  // 注意：text 的值必须是字符串，不能是数字
      })
    }
  },
}
