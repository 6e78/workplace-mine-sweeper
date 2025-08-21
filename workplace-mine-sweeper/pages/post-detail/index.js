const app = getApp();

Page({
  data: {
    post: null,
    comments: [],
    newComment: '',
    replyingComment: null,
    inputPlaceholder: '说说你的看法...'
  },

  onLoad(options) {
    const postId = options.id || '1';
    if (postId) {
      this.fetchPostDetails(postId);
      this.fetchComments(postId);
    }
  },

  // --- Data Fetching ---
  fetchPostDetails(postId) {
    const url = `${app.globalData.backendUrl}/api/posts/${postId}`;
    console.log('>>> [API REQ] Fetching post details from:', url);
    wx.request({
      url: url,
      success: res => {
        console.log('<<< [API RES] fetchPostDetails:', res);
        if (res.statusCode === 200) {
          this.setData({ post: res.data });
        } else {
          wx.showToast({ title: '帖子加载失败', icon: 'none' });
        }
      },
      fail: err => {
        console.error('!!! [API ERR] fetchPostDetails:', err);
        wx.showToast({ title: '网络错误', icon: 'none' });
      }
    });
  },

  fetchComments(postId) {
    const url = `${app.globalData.backendUrl}/api/posts/${postId}/comments`;
    console.log('>>> [API REQ] Fetching comments from:', url);
    wx.request({
      url: url,
      success: res => {
        console.log('<<< [API RES] fetchComments:', res);
        if (res.statusCode === 200) {
          this.setData({ comments: res.data });
        }
      },
      fail: err => {
        console.error('!!! [API ERR] fetchComments:', err);
      }
    });
  },

  // --- Action Handlers ---
  handleLikePost() {
    const { post } = this.data;
    const originalPost = JSON.parse(JSON.stringify(post));
    const newPost = this.data.post;
    newPost.isLiked = !newPost.isLiked;
    newPost.likes += newPost.isLiked ? 1 : -1;
    this.setData({ post: newPost });

    const url = `${app.globalData.backendUrl}/api/posts/${post.id}/like`;
    console.log('>>> [API REQ] Liking post at:', url);
    wx.request({
      url: url,
      method: 'POST',
      success: (res) => {
        console.log('<<< [API RES] handleLikePost:', res);
        if (res.statusCode !== 200) {
          this.setData({ post: originalPost });
        }
      },
      fail: (err) => {
        console.error('!!! [API ERR] handleLikePost:', err);
        this.setData({ post: originalPost });
      }
    });
  },

  handleLikeComment(e) {
    const { index } = e.currentTarget.dataset;
    const { comments } = this.data;
    const originalComments = JSON.parse(JSON.stringify(comments));
    const comment = comments[index];
    comment.isLiked = !comment.isLiked;
    comment.likes += comment.isLiked ? 1 : -1;
    this.setData({ comments });

    const url = `${app.globalData.backendUrl}/api/comments/${comment.id}/like`;
    console.log('>>> [API REQ] Liking comment at:', url);
    wx.request({
      url: url,
      method: 'POST',
      success: (res) => {
        console.log('<<< [API RES] handleLikeComment:', res);
        if (res.statusCode !== 200) {
          this.setData({ comments: originalComments });
        }
      },
      fail: (err) => {
        console.error('!!! [API ERR] handleLikeComment:', err);
        this.setData({ comments: originalComments });
      }
    });
  },

  handleBookmarkPost() {
    const { post } = this.data;
    const originalPost = JSON.parse(JSON.stringify(post));
    const newPost = this.data.post;
    newPost.isBookmarked = !newPost.isBookmarked;
    this.setData({ post: newPost });

    const url = `${app.globalData.backendUrl}/api/posts/${post.id}/bookmark`;
    console.log('>>> [API REQ] Bookmarking post at:', url);
    wx.request({
      url: url,
      method: 'POST',
      success: (res) => {
        console.log('<<< [API RES] handleBookmarkPost:', res);
        if (res.statusCode !== 200) {
          this.setData({ post: originalPost });
        }
      },
      fail: (err) => {
        console.error('!!! [API ERR] handleBookmarkPost:', err);
        this.setData({ post: originalPost });
      }
    });
  },

  // --- Reply and Comment Handlers ---
  handleReply(e) {
    const { comment } = e.currentTarget.dataset;
    this.setData({ replyingComment: comment, inputPlaceholder: `回复 @${comment.author}:` });
  },

  cancelReply() {
    this.setData({ replyingComment: null, inputPlaceholder: '说说你的看法...' });
  },

  handleCommentInput(e) {
    this.setData({ newComment: e.detail.value });
  },

  submitComment() {
    const { newComment, post, replyingComment } = this.data;
    if (!newComment.trim()) return;
    if (replyingComment) {
      this.submitReply(replyingComment.id, newComment);
    } else {
      this.submitNewComment(post.id, newComment);
    }
  },

  submitNewComment(postId, content) {
    const url = `${app.globalData.backendUrl}/api/posts/${postId}/comments`;
    console.log('>>> [API REQ] Submitting new comment to:', url);
    wx.request({
      url: url,
      method: 'POST',
      data: { content },
      success: res => {
        console.log('<<< [API RES] submitNewComment:', res);
        if (res.statusCode === 201) {
          this.setData({ comments: [res.data, ...this.data.comments], newComment: '' });
        } else {
           wx.showToast({ title: '评论失败', icon: 'none' });
        }
      },
      fail: err => {
        console.error('!!! [API ERR] submitNewComment:', err);
      }
    });
  },

  submitReply(commentId, content) {
    const url = `${app.globalData.backendUrl}/api/comments/${commentId}/replies`;
    console.log('>>> [API REQ] Submitting reply to:', url);
    wx.request({
      url: url,
      method: 'POST',
      data: { content },
      success: res => {
        console.log('<<< [API RES] submitReply:', res);
        if (res.statusCode === 201) {
          const newReply = res.data;
          const cIndex = this.data.comments.findIndex(c => c.id === commentId);
          if (cIndex > -1) {
            const { comments } = this.data;
            comments[cIndex].replies.unshift(newReply);
            this.setData({ comments, newComment: '', replyingComment: null, inputPlaceholder: '说说你的看法...' });
          }
        } else {
          wx.showToast({ title: '回复失败', icon: 'none' });
        }
      },
      fail: err => {
        console.error('!!! [API ERR] submitReply:', err);
      }
    });
  }
});