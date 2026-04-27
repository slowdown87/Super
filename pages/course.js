import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAllData, saveAllData } from '../utils/storage';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';

const CoursePage = () => {
  const router = useRouter();
  const { appData } = useApp();
  const { id } = router.query;
  const [course, setCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewContent, setReviewContent] = useState('');

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!reviewRating || !reviewContent) {
      alert('请填写评分和评价内容');
      return;
    }

    const data = getAllData();
    const newReview = {
      id: Date.now(),
      courseId: parseInt(id),
      userId: appData.user.id,
      username: appData.user.name,
      avatar: appData.user.avatar,
      rating: reviewRating,
      content: reviewContent,
      date: new Date().toISOString()
    };

    data.courseReviews.push(newReview);
    saveAllData(data);
    
    // 更新评价列表
    setReviews([...reviews, newReview]);
    
    // 重置表单
    setReviewRating(0);
    setReviewContent('');
    
    // 更新课程评分
    const courseReviews = data.courseReviews.filter(r => r.courseId === parseInt(id));
    const averageRating = courseReviews.reduce((sum, r) => sum + r.rating, 0) / courseReviews.length;
    const courseIndex = data.courses.findIndex(c => c.id === parseInt(id));
    if (courseIndex !== -1) {
      data.courses[courseIndex].rating = parseFloat(averageRating.toFixed(1));
      data.courses[courseIndex].reviewCount = courseReviews.length;
      saveAllData(data);
      
      // 更新本地状态
      const updatedCourse = { ...course };
      updatedCourse.rating = parseFloat(averageRating.toFixed(1));
      updatedCourse.reviewCount = courseReviews.length;
      setCourse(updatedCourse);
    }
  };

  // 检查是否登录
  if (!appData?.user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">请先登录</h1>
            <p className="text-gray-600 mb-6">登录后才能学习课程</p>
            <a href="/login" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
              去登录
            </a>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (id) {
      const data = getAllData();
      const foundCourse = data.courses.find(c => c.id === parseInt(id));
      if (foundCourse) {
        setCourse(foundCourse);
        setSelectedLesson(foundCourse.lessons[0]);
        
        // 计算学习进度
        const completedLessons = foundCourse.lessons.filter(l => l.completed).length;
        const totalLessons = foundCourse.lessons.length;
        setProgress((completedLessons / totalLessons) * 100);
        
        // 获取课程评价
        const courseReviews = data.courseReviews || [];
        const reviewsForCourse = courseReviews.filter(r => r.courseId === parseInt(id));
        setReviews(reviewsForCourse);
      }
      setIsLoading(false);
    }
  }, [id]);

  const handleLessonClick = (lesson) => {
    setSelectedLesson(lesson);
  };

  const handleMarkComplete = (lessonId) => {
    const data = getAllData();
    const courseIndex = data.courses.findIndex(c => c.id === parseInt(id));
    if (courseIndex !== -1) {
      const lessonIndex = data.courses[courseIndex].lessons.findIndex(l => l.id === lessonId);
      if (lessonIndex !== -1) {
        data.courses[courseIndex].lessons[lessonIndex].completed = !data.courses[courseIndex].lessons[lessonIndex].completed;
        saveAllData(data);
        
        // 更新本地状态
        const updatedCourse = { ...course };
        updatedCourse.lessons = updatedCourse.lessons.map(l => 
          l.id === lessonId ? { ...l, completed: !l.completed } : l
        );
        setCourse(updatedCourse);
        
        // 更新进度
        const completedLessons = updatedCourse.lessons.filter(l => l.completed).length;
        const totalLessons = updatedCourse.lessons.length;
        setProgress((completedLessons / totalLessons) * 100);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">加载中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">课程不存在</h1>
            <button 
              onClick={() => router.push('/courses')} 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              返回课程列表
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* 课程头部信息 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="md:flex">
            <div className="md:w-1/3">
              <img 
                src={course.coverImage} 
                alt={course.title} 
                className="w-full h-64 object-cover"
              />
            </div>
            <div className="md:w-2/3 p-6">
              <div className="flex items-center mb-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {course.level}
                </span>
                <div className="ml-4 flex items-center">
                  <span className="text-yellow-500 mr-1">★</span>
                  <span className="font-semibold">{course.rating}</span>
                  <span className="text-gray-500 ml-2">({course.reviewCount} 评价)</span>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h1>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <div className="flex items-center mb-4">
                <div className="flex items-center mr-6">
                  <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{course.duration} 小时</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{course.lessons.length} 课时</span>
                </div>
              </div>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">学习进度</h3>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-1">{Math.round(progress)}% 完成</p>
              </div>
              <div className="flex items-center">
                <span className="text-2xl font-bold text-gray-900">¥{course.price}</span>
                <button className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                  开始学习
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 课程内容 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="md:flex">
            {/* 课程大纲 */}
            <div className="md:w-1/3 border-r border-gray-200">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">课程大纲</h2>
                <div className="space-y-2">
                  {course.lessons.map((lesson, index) => (
                    <div 
                      key={lesson.id} 
                      className={`p-3 rounded-md cursor-pointer transition-all duration-200 ${selectedLesson && selectedLesson.id === lesson.id ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50 hover:pl-4'}`}
                      onClick={() => handleLessonClick(lesson)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-500 mr-2">{index + 1}.</span>
                            <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                          </div>
                          <div className="flex items-center mt-1">
                            <span className="text-xs text-gray-500 mr-3">
                              {lesson.type === 'video' ? '视频' : lesson.type === 'text' ? '文本' : '文档'}
                            </span>
                            <span className="text-xs text-gray-500">{lesson.duration} 分钟</span>
                          </div>
                        </div>
                        <div>
                          {lesson.completed && (
                            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 课程内容 */}
            <div className="md:w-2/3">
              {selectedLesson && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">{selectedLesson.title}</h2>
                    <button 
                      onClick={() => handleMarkComplete(selectedLesson.id)}
                      className={`px-4 py-2 rounded-md transition ${selectedLesson.completed ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-green-600 text-white hover:bg-green-700'}`}
                    >
                      {selectedLesson.completed ? '已完成' : '标记完成'}
                    </button>
                  </div>
                  
                  <div className="prose max-w-none">
                    {selectedLesson.type === 'video' && (
                      <div className="bg-gray-900 rounded-lg mb-6 overflow-hidden">
                        <div className="aspect-w-16 aspect-h-9">
                          <div className="flex items-center justify-center h-64 bg-gray-800">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div dangerouslySetInnerHTML={{ __html: selectedLesson.content }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 课程评价 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">课程评价</h2>
            
            {/* 评价表单 */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">发表评价</h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">评分</label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star} 
                        type="button" 
                        onClick={() => setRating(star)}
                        className={`text-2xl ${reviewRating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">评价内容</label>
                  <textarea 
                    value={reviewContent} 
                    onChange={(e) => setReviewContent(e.target.value)}
                    rows={4} 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="请分享您的学习体验..."
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  提交评价
                </button>
              </form>
            </div>
            
            {/* 评价列表 */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">学员评价</h3>
              {reviews.length === 0 ? (
                <p className="text-gray-600">暂无评价，成为第一个评价的人吧！</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <img 
                            src={review.avatar} 
                            alt={review.username} 
                            className="h-10 w-10 rounded-full object-cover mr-3"
                          />
                          <div>
                            <h4 className="font-medium text-gray-900">{review.username}</h4>
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600">{review.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;