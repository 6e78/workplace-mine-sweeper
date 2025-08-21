// pages/discover/index.js
const app = getApp();

Page({
  data: {
    recommendedCompanies: [],
    hotPosts: []
  },

  onShow() {
    this.fetchRecommended();
    this.fetchHotPosts();
  },

  navigateToCompany(e) {
    const companyId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/company/index?id=${companyId}`,
    })
  },

  navigateToPost(e) {
    const postId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/post-detail/index?id=${postId}`,
    })
  },

  onTabItemTap(item) {
    if (item.index === 2) { // Index 2 is the "Publish" tab
      wx.showActionSheet({
        itemList: ['曝光公司', '推荐公司'],
        success: res => {
          if (res.tapIndex === 0) {
            wx.navigateTo({ url: '/pages/review-create/index' });
          } else if (res.tapIndex === 1) {
            wx.showToast({ title: '推荐功能待开发', icon: 'none' });
          }
        },
        fail: console.log
      });
    }
  },

  fetchRecommended() {
    wx.request({
      url: app.globalData.backendUrl + '/api/companies/recommended',
      success: res => {
        this.setData({ recommendedCompanies: res.data });
      },
      fail: console.error
    });
  },

  fetchHotPosts() {
    wx.request({
      url: app.globalData.backendUrl + '/api/posts/hot',
      success: res => {
        this.setData({ hotPosts: res.data });
      },
      fail: console.error
    });
  }
});
