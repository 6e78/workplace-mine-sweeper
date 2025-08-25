// pages/my-content/index.js
const app = getApp();

Page({
  data: {
    pageType: '',
    items: [],
    pageTitle: ''
  },

  onLoad(options) {
    const type = options.type || 'exposures'; // Default to exposures
    this.setData({ pageType: type });
    this.fetchContent(type);
  },

  fetchContent(type) {
    const config = {
      exposures: {
        title: '我的曝光',
        url: `${app.globalData.backendUrl}/api/me/exposures`
      },
      recommendations: {
        title: '我的推荐',
        url: `${app.globalData.backendUrl}/api/me/recommendations`
      }
    };

    const currentConfig = config[type];
    if (!currentConfig) {
      console.error('Invalid page type:', type);
      return;
    }

    this.setData({ pageTitle: currentConfig.title });
    wx.setNavigationBarTitle({ title: currentConfig.title });

    wx.showLoading({ title: '加载中...' });
    wx.request({
      url: currentConfig.url,
      success: res => {
        if (res.statusCode === 200) {
          this.setData({ items: res.data });
        } else {
          wx.showToast({ title: '加载失败', icon: 'none' });
        }
      },
      fail: () => wx.showToast({ title: '网络错误', icon: 'none' }),
      complete: wx.hideLoading
    });
  }
});