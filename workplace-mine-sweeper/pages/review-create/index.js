// pages/review-create/index.js
const app = getApp();

Page({
  data: {
    companyName: '',
    city: '',
    // The rating part can be enhanced later
    // rating: {
    //   hrAttitude: 0,
    //   interviewProcess: 0,
    //   companyEnvironment: 0,
    //   salaryBenefits: 0
    // },
    reviewText: '',
    experience: '',
    suggestion: ''
  },

  onInputChange(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({ [field]: e.detail.value });
  },

  // onRateChange(e) {
  //   const { category } = e.currentTarget.dataset;
  //   const score = e.detail.value;
  //   this.setData({
  //     [`rating.${category}`]: score
  //   });
  // },

  onSubmit() {
    if (!this.data.companyName || !this.data.reviewText || !this.data.experience) {
      wx.showToast({
        title: '公司名称、避雷点和经历为必填项',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({ title: '提交中...' });

    const reviewData = {
      companyName: this.data.companyName,
      city: this.data.city,
      reviewText: this.data.reviewText,
      experience: this.data.experience,
      suggestion: this.data.suggestion
    };

    wx.request({
      url: app.globalData.backendUrl + '/api/reviews',
      method: 'POST',
      data: reviewData,
      success: res => {
        if (res.statusCode === 200) {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 2000,
            complete: () => {
              setTimeout(() => {
                wx.switchTab({ url: '/pages/home/index' });
              }, 2000);
            }
          });
        } else {
          wx.showToast({ title: '提交失败', icon: 'none' });
        }
      },
      fail: err => {
        console.error('Submit failed', err);
        wx.showToast({ title: '提交失败', icon: 'none' });
      },
      complete: wx.hideLoading
    });
  }
});
