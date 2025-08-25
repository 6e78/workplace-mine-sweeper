from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Set

app = FastAPI()

# --- Mock Database ---
COMPANIES = {
    1: {"id": 1, "name": "深圳牛马科技有限公司", "city": "深圳", "overallScore": 1.5, "tags": ['996', '画大饼', '加班严重', 'HR不专业', '薪资虚报', 'PUA']},
    2: {"id": 2, "name": "北京卷王文化", "city": "北京", "overallScore": 1.8, "tags": ['加班严重', '薪资虚报']},
    3: {"id": 3, "name": "上海奋斗者网络", "city": "上海", "overallScore": 2.1, "tags": ['环境脏乱差', 'HR不专业']},
    4: {"id": 4, "name": "某某无限责任公司", "city": "广州", "overallScore": 1.2, "tags": ['面试官态度差', 'PUA']},
    5: {"id": 5, "name": "幸福里科技", "city": "杭州", "overallScore": 4.8, "tags": ['WLB典范', '技术氛围好', '福利待遇好']},
    6: {"id": 6, "name": "摸鱼网络", "city": "成都", "overallScore": 4.9, "tags": ['从不加班', '福利待遇好']},
}

REVIEWS = {
    1: [
        {"id": 1, "author": "匿名用户A", "rating": 1, "text": "面试迟到半小时，态度傲慢，全程玩手机，问的问题和岗位完全不相关。"},
        {"id": 2, "author": "匿名用户B", "rating": 2, "text": "HR在面试时疯狂打探个人隐私，薪资画大饼，实际到手只有一半。"}
    ],
    5: [
        {"id": 3, "author": "匿名用户C", "rating": 5, "text": "非常棒的公司，同事都很友好，技术氛围浓厚，推荐！"}
    ]
}

POSTS = [
    { "id": 1, "topic": "#面试吐槽#", "title": "遇到奇葩面试官，全程PUA", "author": "匿名用户", "likes": 128, "isLiked": False, "isBookmarked": True, "content": "今天面试一家公司，面试官迟到半小时不说，全程态度傲慢，问题和岗位也无关，简直是浪费时间。" },
    { "id": 2, "topic": "#offer选择求助#", "title": "手里三个offer，求大佬指点", "author": "匿名用户", "likes": 99, "isLiked": True, "isBookmarked": False, "content": "A公司钱多事少离家远，B公司钱少事多离家近，C公司大小周但是给的实在太多了。该怎么选？" }
]

COMMENTS = {
    1: [
        {"id": 1, "author": "打工人", "content": "深有同感，面试官全程心不在焉，感觉不尊重人。", "likes": 15, "isLiked": False, "replies": [
            {"id": 101, "author": "楼主", "reply_to_author": "打工人", "content": "是的，体验极差！", "likes": 2, "isLiked": False}
        ]},
        {"id": 2, "author": "小透明", "content": "内部员工路过，加班是常态，而且没有加班费，建议慎重。", "likes": 33, "isLiked": True, "replies": []},
    ],
    2: [
        {"id": 3, "author": "选择困难症", "content": "果断C啊，钱给够了什么都好说。", "likes": 50, "isLiked": False, "replies": []},
    ]
}

BOOKMARKED_POST_IDS: Set[int] = {1}

USER_PROFILE_DATA = {
    "nickName": "职场明白人",
    "avatarUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256"
}

USER_REVIEWS = [
    REVIEWS[1][0],
    REVIEWS[1][1]
]

# --- Pydantic Models ---
class Company(BaseModel):
    id: int
    name: str
    city: str
    overallScore: float
    tags: List[str]

class Review(BaseModel):
    id: int
    author: str
    rating: int
    text: str

class CompanyDetails(Company):
    reviews: List[Review]

class ReviewCreate(BaseModel):
    companyName: str
    city: str
    reviewText: str
    experience: str
    suggestion: Optional[str] = None

class LoginRequest(BaseModel):
    code: str

class Post(BaseModel):
    id: int
    topic: str
    title: str
    author: str
    likes: int
    isLiked: bool
    isBookmarked: bool
    content: str

class PostCreate(BaseModel):
    topic: str
    title: str
    content: str
    isAnonymous: bool

class Reply(BaseModel):
    id: int
    author: str
    reply_to_author: str
    content: str
    likes: int
    isLiked: bool

class Comment(BaseModel):
    id: int
    author: str
    content: str
    likes: int
    isLiked: bool
    replies: List[Reply] = []

class CommentCreate(BaseModel):
    content: str

class ReplyCreate(BaseModel):
    content: str

class UserProfile(BaseModel):
    nickName: str
    avatarUrl: str

class UserStats(BaseModel):
    exposures: int
    recommendations: int
    collections: int

Comment.update_forward_refs()

# --- Helper Functions ---
def find_post(post_id: int):
    return next((p for p in POSTS if p["id"] == post_id), None)

def find_comment(comment_id: int):
    for post_comments in COMMENTS.values():
        for comment in post_comments:
            if comment['id'] == comment_id:
                return comment
            for reply in comment.get('replies', []):
                if reply['id'] == comment_id:
                    return reply
    return None

# --- API Endpoints ---

@app.post("/api/login")
def login(request: LoginRequest):
    print(f"Received login code: {request.code}")
    return {"token": "fake_session_token_for_user_123"}

@app.get("/api/companies/latest", response_model=List[Company])
def get_latest_companies():
    bad_companies = [c for c in COMPANIES.values() if c['overallScore'] < 3]
    return sorted(bad_companies, key=lambda x: x['id'], reverse=True)

@app.get("/api/companies/hot", response_model=List[Company])
def get_hot_companies():
    bad_companies = [c for c in COMPANIES.values() if c['overallScore'] < 3]
    return sorted(bad_companies, key=lambda x: x['overallScore'])
    
@app.get("/api/companies/recommended", response_model=List[Company])
def get_recommended_companies():
    good_companies = [c for c in COMPANIES.values() if c['overallScore'] > 4]
    return sorted(good_companies, key=lambda x: x['overallScore'], reverse=True)

@app.get("/api/companies/search", response_model=List[Company])
def search_companies(q: str = ""):
    if not q:
        return []
    return [c for c in COMPANIES.values() if q.lower() in c['name'].lower()]

@app.get("/api/companies/{company_id}", response_model=CompanyDetails)
def get_company_details(company_id: int):
    company = COMPANIES.get(company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    company_reviews = REVIEWS.get(company_id, [])
    return {**company, "reviews": company_reviews}

@app.post("/api/reviews")
def create_review(review: ReviewCreate):
    company_id = None
    existing_company = next((c for c in COMPANIES.values() if c['name'].lower() == review.companyName.lower()), None)
    if existing_company:
        company_id = existing_company['id']
    else:
        company_id = len(COMPANIES) + 1
        COMPANIES[company_id] = {
            "id": company_id, "name": review.companyName, "city": review.city,
            "overallScore": 1.0, "tags": ["新曝光"]
        }
        REVIEWS[company_id] = []
    new_review_id = sum(len(r) for r in REVIEWS.values()) + 1
    new_review_data = {
        "id": new_review_id, "author": "匿名用户", "rating": 1, "text": review.reviewText
    }
    REVIEWS[company_id].append(new_review_data)
    return {"message": "Review submitted successfully"}

@app.post("/api/posts")
def create_post(post: PostCreate):
    new_post_id = len(POSTS) + 1
    new_post_data = {
        "id": new_post_id,
        "topic": post.topic,
        "title": post.title,
        "author": "匿名用户" if post.isAnonymous else "实名用户",
        "likes": 0,
        "isLiked": False,
        "isBookmarked": False,
        "content": post.content
    }
    POSTS.insert(0, new_post_data)
    return {"message": "Post created successfully", "postId": new_post_id}

@app.get("/api/posts/hot", response_model=List[Post])
def get_hot_posts():
    for post in POSTS:
        post["isBookmarked"] = post["id"] in BOOKMARKED_POST_IDS
    return POSTS

@app.get("/api/posts/{post_id}", response_model=Post)
def get_post_details(post_id: int):
    post = find_post(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    post["isBookmarked"] = post["id"] in BOOKMARKED_POST_IDS

    total_likes = post.get('likes', 0)
    post_comments = COMMENTS.get(post_id, [])
    for comment in post_comments:
        total_likes += comment.get('likes', 0)
        for reply in comment.get('replies', []):
            total_likes += reply.get('likes', 0)
    
    post_with_aggregated_likes = post.copy()
    post_with_aggregated_likes['likes'] = total_likes

    return post_with_aggregated_likes

@app.get("/api/posts/{post_id}/comments", response_model=List[Comment])
def get_comments(post_id: int):
    if not find_post(post_id):
        raise HTTPException(status_code=404, detail="Post not found")
    return COMMENTS.get(post_id, [])

@app.post("/api/posts/{post_id}/comments", response_model=Comment, status_code=201)
def create_comment(post_id: int, comment: CommentCreate):
    if not find_post(post_id):
        raise HTTPException(status_code=404, detail="Post not found")
    
    new_comment_id = sum(len(c) for c in COMMENTS.values()) + 100
    new_comment = {
        "id": new_comment_id,
        "author": "我",
        "content": comment.content,
        "likes": 0,
        "isLiked": False,
        "replies": []
    }
    
    if post_id not in COMMENTS:
        COMMENTS[post_id] = []
    COMMENTS[post_id].insert(0, new_comment)
    return new_comment

@app.post("/api/comments/{comment_id}/replies", response_model=Reply, status_code=201)
def create_reply(comment_id: int, reply: ReplyCreate):
    comment = find_comment(comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    new_reply_id = sum(len(c.get('replies', [])) for p_c in COMMENTS.values() for c in p_c) + 1000
    new_reply = {
        "id": new_reply_id,
        "author": "我",
        "reply_to_author": comment['author'],
        "content": reply.content,
        "likes": 0,
        "isLiked": False
    }
    comment['replies'].insert(0, new_reply)
    return new_reply

@app.post("/api/posts/{post_id}/like")
def like_post(post_id: int):
    post = find_post(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    if post['isLiked']:
        post['likes'] -= 1
        post['isLiked'] = False
    else:
        post['likes'] += 1
        post['isLiked'] = True
        
    return {"likes": post['likes'], "isLiked": post['isLiked']}

@app.post("/api/comments/{comment_id}/like")
def like_comment(comment_id: int):
    comment = find_comment(comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    if comment['isLiked']:
        comment['likes'] -= 1
        comment['isLiked'] = False
    else:
        comment['likes'] += 1
        comment['isLiked'] = True

    return {"likes": comment['likes'], "isLiked": comment['isLiked']}

@app.post("/api/posts/{post_id}/bookmark")
def bookmark_post(post_id: int):
    post = find_post(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    if post_id in BOOKMARKED_POST_IDS:
        BOOKMARKED_POST_IDS.discard(post_id)
        post["isBookmarked"] = False
    else:
        BOOKMARKED_POST_IDS.add(post_id)
        post["isBookmarked"] = True
        
    return {"isBookmarked": post["isBookmarked"]}

@app.get("/api/bookmarks", response_model=List[Post])
def get_bookmarks():
    for post in POSTS:
        post["isBookmarked"] = post["id"] in BOOKMARKED_POST_IDS
    bookmarked_posts = [p for p in POSTS if p["id"] in BOOKMARKED_POST_IDS]
    return bookmarked_posts

@app.get("/api/me/profile", response_model=UserProfile)
def get_user_profile():
    return USER_PROFILE_DATA

@app.get("/api/me/stats", response_model=UserStats)
def get_user_stats():
    exposures = len(USER_REVIEWS)
    recommendations = 0 # Mock value
    collections = len(BOOKMARKED_POST_IDS)
    return {
        "exposures": exposures,
        "recommendations": recommendations,
        "collections": collections
    }

@app.get("/api/me/exposures", response_model=List[Review])
def get_my_exposures():
    return USER_REVIEWS

@app.get("/api/me/recommendations", response_model=List[Company])
def get_my_recommendations():
    # Feature not implemented, return empty list
    return []