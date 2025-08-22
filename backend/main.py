from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, validator
from typing import List, Optional, Set
from sqlalchemy import create_engine, Column, Integer, String, Float, Text, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship

# --- Database Configuration ---
DATABASE_URL = "mysql+mysqlconnector://root:6z78l905E@localhost/program"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- SQLAlchemy Models ---
class Company(Base):
    __tablename__ = "companies"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, index=True)
    city = Column(String(255))
    overallScore = Column(Float)
    tags = Column(String(1024)) # Storing tags as a comma-separated string
    reviews = relationship("Review", back_populates="company")

class Review(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True, index=True)
    author = Column(String(255))
    rating = Column(Integer)
    text = Column(Text)
    company_id = Column(Integer, ForeignKey("companies.id"))
    company = relationship("Company", back_populates="reviews")

class Post(Base):
    __tablename__ = "posts"
    id = Column(Integer, primary_key=True, index=True)
    topic = Column(String(255))
    title = Column(String(255))
    author = Column(String(255))
    content = Column(Text)
    likes = Column(Integer, default=0)
    isLiked = Column(Boolean, default=False)
    isBookmarked = Column(Boolean, default=False)
    comments = relationship("Comment", back_populates="post")

class Comment(Base):
    __tablename__ = "comments"
    id = Column(Integer, primary_key=True, index=True)
    author = Column(String(255))
    content = Column(Text)
    likes = Column(Integer, default=0)
    isLiked = Column(Boolean, default=False)
    post_id = Column(Integer, ForeignKey("posts.id"))
    post = relationship("Post", back_populates="comments")
    parent_id = Column(Integer, ForeignKey("comments.id"), nullable=True)
    replies = relationship("Comment", back_populates="parent", remote_side=[id])
    parent = relationship("Comment", back_populates="replies", remote_side=[parent_id])


# --- Pydantic Models ---
class CompanyBase(BaseModel):
    name: str
    city: str
    overallScore: float
    tags: List[str]

    @validator('tags', pre=True, allow_reuse=True)
    def split_tags(cls, v):
        if isinstance(v, str):
            return [tag.strip() for tag in v.split(',')]
        return v

class CompanyCreate(CompanyBase):
    pass

class CompanyModel(CompanyBase):
    id: int

    class Config:
        orm_mode = True

class ReviewBase(BaseModel):
    author: str
    rating: int
    text: str

class ReviewCreate(BaseModel):
    companyName: str
    city: str
    reviewText: str
    experience: str
    suggestion: Optional[str] = None

class ReviewModel(ReviewBase):
    id: int

    class Config:
        orm_mode = True

class CompanyDetails(CompanyModel):
    reviews: List[ReviewModel] = []

class PostBase(BaseModel):
    topic: str
    title: str
    author: str
    content: str
    likes: int
    isLiked: bool
    isBookmarked: bool

class PostCreate(BaseModel):
    topic: str
    title: str
    content: str
    isAnonymous: bool

class PostModel(PostBase):
    id: int

    class Config:
        orm_mode = True

class Reply(BaseModel):
    id: int
    author: str
    reply_to_author: str
    content: str
    likes: int
    isLiked: bool

class CommentBase(BaseModel):
    author: str
    content: str
    likes: int
    isLiked: bool

class CommentCreate(BaseModel):
    content: str

class CommentModel(CommentBase):
    id: int
    replies: List['CommentModel'] = []

    class Config:
        orm_mode = True

CommentModel.update_forward_refs()

class UserProfile(BaseModel):
    nickName: str
    avatarUrl: str

class UserStats(BaseModel):
    exposures: int
    recommendations: int
    collections: int

# --- FastAPI App ---
app = FastAPI()

# --- Dependency ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

# --- API Endpoints ---

@app.post("/api/login")
def login(request: BaseModel):
    return {"token": "fake_session_token_for_user_123"}

@app.get("/api/companies/latest", response_model=List[CompanyModel])
def get_latest_companies(db: Session = Depends(get_db)):
    companies = db.query(Company).filter(Company.overallScore < 3).order_by(Company.id.desc()).all()
    return companies

@app.get("/api/companies/hot", response_model=List[CompanyModel])
def get_hot_companies(db: Session = Depends(get_db)):
    companies = db.query(Company).filter(Company.overallScore < 3).order_by(Company.overallScore).all()
    return companies

@app.get("/api/companies/recommended", response_model=List[CompanyModel])
def get_recommended_companies(db: Session = Depends(get_db)):
    companies = db.query(Company).filter(Company.overallScore > 4).order_by(Company.overallScore.desc()).all()
    return companies

@app.get("/api/companies/search", response_model=List[CompanyModel])
def search_companies(q: str = "", db: Session = Depends(get_db)):
    if not q:
        return []
    return db.query(Company).filter(Company.name.contains(q)).all()

@app.get("/api/companies/{company_id}", response_model=CompanyDetails)
def get_company_details(company_id: int, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company

@app.post("/api/reviews")
def create_review(review: ReviewCreate, db: Session = Depends(get_db)):
    db_company = db.query(Company).filter(Company.name == review.companyName).first()
    if not db_company:
        db_company = Company(name=review.companyName, city=review.city, overallScore=1.0, tags="新曝光")
        db.add(db_company)
        db.commit()
        db.refresh(db_company)

    db_review = Review(author="匿名用户", rating=1, text=review.reviewText, company_id=db_company.id)
    db.add(db_review)
    db.commit()
    return {"message": "Review submitted successfully"}

@app.post("/api/posts", response_model=PostModel)
def create_post(post: PostCreate, db: Session = Depends(get_db)):
    db_post = Post(
        topic=post.topic,
        title=post.title,
        author="匿名用户" if post.isAnonymous else "实名用户",
        content=post.content
    )
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

@app.get("/api/posts/hot", response_model=List[PostModel])
def get_hot_posts(db: Session = Depends(get_db)):
    return db.query(Post).order_by(Post.likes.desc()).all()

@app.get("/api/posts/{post_id}", response_model=PostModel)
def get_post_details(post_id: int, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@app.get("/api/posts/{post_id}/comments", response_model=List[CommentModel])
def get_comments(post_id: int, db: Session = Depends(get_db)):
    return db.query(Comment).filter(Comment.post_id == post_id, Comment.parent_id == None).all()

@app.post("/api/posts/{post_id}/comments", response_model=CommentModel, status_code=201)
def create_comment(post_id: int, comment: CommentCreate, db: Session = Depends(get_db)):
    db_post = db.query(Post).filter(Post.id == post_id).first()
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    db_comment = Comment(author="我", content=comment.content, post_id=post_id)
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

@app.post("/api/comments/{comment_id}/replies", response_model=CommentModel, status_code=201)
def create_reply(comment_id: int, reply: CommentCreate, db: Session = Depends(get_db)):
    parent_comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not parent_comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    db_reply = Comment(
        author="我",
        content=reply.content,
        post_id=parent_comment.post_id,
        parent_id=comment_id
    )
    db.add(db_reply)
    db.commit()
    db.refresh(db_reply)
    return db_reply

@app.post("/api/posts/{post_id}/like")
def like_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    post.isLiked = not post.isLiked
    if post.isLiked:
        post.likes += 1
    else:
        post.likes -= 1
    db.commit()
    return {"likes": post.likes, "isLiked": post.isLiked}

@app.post("/api/comments/{comment_id}/like")
def like_comment(comment_id: int, db: Session = Depends(get_db)):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    comment.isLiked = not comment.isLiked
    if comment.isLiked:
        comment.likes += 1
    else:
        comment.likes -= 1
    db.commit()
    return {"likes": comment.likes, "isLiked": comment.isLiked}

@app.post("/api/posts/{post_id}/bookmark")
def bookmark_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    post.isBookmarked = not post.isBookmarked
    db.commit()
    return {"isBookmarked": post.isBookmarked}

@app.get("/api/bookmarks", response_model=List[PostModel])
def get_bookmarks(db: Session = Depends(get_db)):
    return db.query(Post).filter(Post.isBookmarked == True).all()

@app.get("/api/me/profile", response_model=UserProfile)
def get_user_profile():
    # This would typically fetch data for the authenticated user
    return {"nickName": "职场明白人", "avatarUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256"}

@app.get("/api/me/stats", response_model=UserStats)
def get_user_stats(db: Session = Depends(get_db)):
    # These would be calculated for the authenticated user
    exposures = db.query(Review).count()
    recommendations = 0 # Not implemented
    collections = db.query(Post).filter(Post.isBookmarked == True).count()
    return {
        "exposures": exposures,
        "recommendations": recommendations,
        "collections": collections
    }

@app.get("/api/me/exposures", response_model=List[ReviewModel])
def get_my_exposures(db: Session = Depends(get_db)):
    # This would fetch reviews created by the authenticated user
    return db.query(Review).all()

@app.get("/api/me/recommendations", response_model=List[CompanyModel])
def get_my_recommendations():
    # Feature not implemented, return empty list
    return []
