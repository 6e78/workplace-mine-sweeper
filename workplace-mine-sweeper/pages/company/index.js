// pages/company/index.js
const app = getApp();

Page({
  data: {
    company: null
  },

  onLoad(options) {
    const companyId = options.id;
    if (companyId) {
      this.fetchCompanyDetails(companyId);
    }
  },

  fetchCompanyDetails(companyId) {
    wx.showLoading({ title: '加载中...' });
    wx.request({
      url: `${app.globalData.backendUrl}/api/companies/${companyId}`,
      success: res => {
        if (res.statusCode === 200) {
          this.setData({ company: res.data });
        } else {
          wx.showToast({ title: '公司信息不存在', icon: 'none' });
        }
      },
      fail: console.error,
      complete: wx.hideLoading
    });
  }
});
