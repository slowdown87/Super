import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAllData } from '../utils/storage';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';

const LearningPage = () => {
  const router = useRouter();
  const { appData } = useApp();
  const [courses, setCourses] = useState([]);
  const [recentCourses, setRecentCourses] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [totalProgress, setTotalProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // 检查是否登录
  if (!appData?.user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">请先登录</h1>
            <p className="text-gray-600 mb-6">登录后才能查看学习进度</p>
            <a href="/login" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
              去登录
            </a>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const data = getAllData();
    if (data.courses && data.courses.length > 0) {
      setCourses(data.courses);
      
      // 计算总学习进度
      let completedLessons = 0;
      let totalLessons = 0;
      data.courses.forEach(course => {
        course.lessons.forEach(lesson => {
          totalLessons++;
          if (lesson.completed) {
            completedLessons++;
          }
        });
      });
      setTotalProgress(totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0);
      
      // 获取最近学习的课程（有完成课时的课程）
      const inProgressCourses = data.courses.filter(course => {
        return course.lessons.some(lesson => lesson.completed);
      });
      setRecentCourses(inProgressCourses.slice(0, 3));
      
      // 获取推荐课程（未开始学习的课程）
      const notStartedCourses = data.courses.filter(course => {
        return !course.lessons.some(lesson => lesson.completed);
      });
      setRecommendedCourses(notStartedCourses.slice(0, 3));
    }
    setIsLoading(false);
  }, []);

  const handleCourseClick = (courseId) => {
    router.push(`/course?id=${courseId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">学习中心</h1>
            <p className="mt-2 text-gray-600">追踪你的学习进度，发现推荐课程</p>
          </div>
          <button 
            onClick={() => router.push('/courses')} 
            className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            浏览全部课程
          </button>
        </div>

        {/* 学习概览 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">学习概览</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">总课程数</p>
                  <h3 className="text-2xl font-bold text-gray-900">{courses.length}</h3>
                </div>
                <div className="bg-blue-100 rounded-full p-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">已完成课程</p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {courses.filter(course => {
                      const completedLessons = course.lessons.filter(lesson => lesson.completed).length;
                      return completedLessons === course.lessons.length;
                    }).length}
                  </h3>
                </div>
                <div className="bg-green-100 rounded-full p-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">学习进度</p>
                  <h3 className="text-2xl font-bold text-gray-900">{Math.round(totalProgress)}%</h3>
                </div>
                <div className="bg-purple-100 rounded-full p-3">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">总体学习进度</h3>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${totalProgress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* 最近学习 */}
        {recentCourses.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">最近学习</h2>
            <div className="space-y-4">
              {recentCourses.map((course) => {
                const completedLessons = course.lessons.filter(lesson => lesson.completed).length;
                const courseProgress = (completedLessons / course.lessons.length) * 100;
                
                return (
                  <div 
                    key={course.id} 
                    className="flex flex-col md:flex-row md:items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                    onClick={() => handleCourseClick(course.id)}
                  >
                    <div className="md:w-1/4 mb-4 md:mb-0">
                      <img 
                        src={course.coverImage} 
                        alt={course.title} 
                        className="w-full h-32 object-cover rounded"
                      />
                    </div>
                    <div className="md:w-3/4 md:pl-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                        <span className="text-sm font-medium text-gray-600">{Math.round(courseProgress)}% 完成</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${courseProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 推荐课程 */}
        {recommendedCourses.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">推荐课程</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendedCourses.map((course) => (
                <div 
                  key={course.id} 
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                  onClick={() => handleCourseClick(course.id)}
                >
                  <img 
                    src={course.coverImage} 
                    alt={course.title} 
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex items-center mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {course.level}
                      </span>
                      <div className="ml-2 flex items-center">
                        <span className="text-yellow-500 mr-1">★</span>
                        <span className="text-sm font-medium">{course.rating}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">¥{course.price}</span>
                      <button className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm">
                        开始学习
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningPage;