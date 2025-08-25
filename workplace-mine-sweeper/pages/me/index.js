// pages/me/index.js
const app = getApp();

Page({
  data: {
    userInfo: {
      avatarUrl: '/assets/images/me.png', // Default avatar
      nickName: '加载中...',
    },
    stats: {
      exposures: '-',
      recommendations: '-',
      collections: '-'
    }
  },

  onShow() {
    this.fetchUserProfile();
    this.fetchUserStats();
  },

  fetchUserProfile() {
    wx.request({
      url: `${app.globalData.backendUrl}/api/me/profile`,
      success: res => {
        if (res.statusCode === 200) {
          this.setData({ userInfo: res.data });
        }
      }
    });
  },

  fetchUserStats() {
    wx.request({
      url: `${app.globalData.backendUrl}/api/me/stats`,
      success: res => {
        if (res.statusCode === 200) {
          this.setData({ stats: res.data });
        }
      }
    });
  },

  // ... (rest of the functions remain the same)
  navigateToMyExposures() {
    wx.navigateTo({ url: '/pages/my-content/index?type=exposures' });
  },

  navigateToMyRecommendations() {
    wx.navigateTo({ url: '/pages/my-content/index?type=recommendations' });
  },

  navigateToMyCollections() {
    wx.navigateTo({ url: '/pages/bookmarks/index' });
  },

  navigateToSettings() {
    wx.navigateTo({ url: '/pages/settings/index' });
  }
});
