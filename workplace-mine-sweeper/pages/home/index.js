// pages/home/index.js
const app = getApp();

Page({
  data: {
    searchQuery: '',
    latestExposures: [],
    hotCompanies: []
  },

  onShow() {
    this.fetchLatest();
    this.fetchHot();
  },

  onTabItemTap(item) {
    // The center "Publish" button is a special case
    if (item.pagePath === "pages/publish/index") {
      wx.showActionSheet({
        itemList: ['曝光公司', '发帖交流', '推荐公司'],
        success: res => {
          if (res.tapIndex === 0) {
            wx.navigateTo({ url: '/pages/review-create/index' });
          } else if (res.tapIndex === 1) {
            wx.navigateTo({ url: '/pages/post-create/index' });
          } else if (res.tapIndex === 2) {
            wx.showToast({ title: '推荐功能待开发', icon: 'none' });
          }
        },
        fail: (err) => {
          if (err.errMsg !== 'showActionSheet:fail cancel') {
            console.error(err);
          }
        }
      });
    }
  },

  fetchLatest() {
    wx.showLoading({ title: '加载中...' });
    wx.request({
      url: app.globalData.backendUrl + '/api/companies/latest',
      success: res => {
        this.setData({ latestExposures: res.data });
      },
      fail: console.error,
      complete: wx.hideLoading
    });
  },

  fetchHot() {
    wx.showLoading({ title: '加载中...' });
    wx.request({
      url: app.globalData.backendUrl + '/api/companies/hot',
      success: res => {
        this.setData({ hotCompanies: res.data });
      },
      fail: console.error,
      complete: wx.hideLoading
    });
  },

  onSearchInput(e) {
    this.setData({
      searchQuery: e.detail.value
    })
  },

  onSearch() {
    if (!this.data.searchQuery) return;
    wx.showLoading({ title: '搜索中...' });
    wx.request({
      url: app.globalData.backendUrl + '/api/companies/search',
      data: { q: this.data.searchQuery },
      success: res => {
        // Navigate to a search results page or display results in a modal
        console.log('Search results:', res.data);
        // For now, we'll just show the first result's page
        if (res.data.length > 0) {
          wx.navigateTo({ url: `/pages/company/index?id=${res.data[0].id}` });
        } else {
          wx.showToast({ title: '未找到相关公司', icon: 'none' });
        }
      },
      fail: console.error,
      complete: wx.hideLoading
    });
  },

  navigateToCompany(e) {
    const companyId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/company/index?id=${companyId}`,
    })
  }
});
