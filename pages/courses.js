import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAllData } from '../utils/storage';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';

const CoursesPage = () => {
  const router = useRouter();
  const { appData } = useApp();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // 检查是否登录
  if (!appData?.user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">请先登录</h1>
            <p className="text-gray-600 mb-6">登录后才能浏览和学习课程</p>
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
    setCourses(data.courses || []);
    setIsLoading(false);
  }, []);

  const handleCourseClick = (courseId) => {
    router.push(`/course?id=${courseId}`);
  };

  const filteredCourses = filter === 'all' 
    ? courses 
    : courses.filter(course => course.level === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">投资学习课程</h1>
            <p className="mt-2 text-gray-600">选择适合你的投资课程，提升投资技能</p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium rounded-l-lg ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-900 hover:bg-gray-100'}`}
                onClick={() => setFilter('all')}
              >
                全部
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium ${filter === '初级' ? 'bg-blue-600 text-white' : 'bg-white text-gray-900 hover:bg-gray-100'}`}
                onClick={() => setFilter('初级')}
              >
                初级
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium ${filter === '中级' ? 'bg-blue-600 text-white' : 'bg-white text-gray-900 hover:bg-gray-100'}`}
                onClick={() => setFilter('中级')}
              >
                中级
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium rounded-r-lg ${filter === '高级' ? 'bg-blue-600 text-white' : 'bg-white text-gray-900 hover:bg-gray-100'}`}
                onClick={() => setFilter('高级')}
              >
                高级
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">加载中...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">暂无课程</h2>
            <p className="text-gray-600">敬请期待更多精彩课程</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div 
                key={course.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                onClick={() => handleCourseClick(course.id)}
              >
                <div className="relative">
                  <img 
                    src={course.coverImage} 
                    alt={course.title} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-medium">
                      {course.level}
                    </span>
                  </div>
                  {course.price === 0 && (
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-green-600 text-white rounded-full text-xs font-medium">
                        免费
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span className="font-semibold">{course.rating}</span>
                      <span className="text-gray-500 ml-2">({course.reviewCount})</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm text-gray-500">{course.duration} 小时</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-sm text-gray-500">{course.lessons.length} 课时</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">¥{course.price}</span>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                      查看详情
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;