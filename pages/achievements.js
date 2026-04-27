import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAllData, saveAllData } from '../utils/storage';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';

const AchievementsPage = () => {
  const router = useRouter();
  const { appData } = useApp();
  const [achievements, setAchievements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 检查是否登录
  if (!appData?.user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">请先登录</h1>
            <p className="text-gray-600 mb-6">登录后才能查看您的成就</p>
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
    
    // 定义成就列表
    const achievementDefinitions = [
      {
        id: 1,
        title: '初学者',
        description: '完成第一个课程',
        icon: '📚',
        type: 'course_completion',
        threshold: 1
      },
      {
        id: 2,
        title: '学习者',
        description: '完成3个课程',
        icon: '🎓',
        type: 'course_completion',
        threshold: 3
      },
      {
        id: 3,
        title: '专家',
        description: '完成所有课程',
        icon: '🏆',
        type: 'course_completion',
        threshold: 5
      },
      {
        id: 4,
        title: '勤奋学者',
        description: '完成10个课时',
        icon: '⏰',
        type: 'lesson_completion',
        threshold: 10
      },
      {
        id: 5,
        title: '知识大师',
        description: '完成所有课时',
        icon: '🌟',
        type: 'lesson_completion',
        threshold: 15
      },
      {
        id: 6,
        title: '评价达人',
        description: '评价3个课程',
        icon: '⭐',
        type: 'review',
        threshold: 3
      }
    ];

    // 计算用户完成的课程和课时数
    let completedCourses = 0;
    let completedLessons = 0;
    let reviewCount = 0;

    data.courses.forEach(course => {
      const courseCompletedLessons = course.lessons.filter(lesson => lesson.completed).length;
      if (courseCompletedLessons === course.lessons.length) {
        completedCourses++;
      }
      completedLessons += courseCompletedLessons;
    });

    if (data.courseReviews) {
      reviewCount = data.courseReviews.filter(review => review.userId === appData.user.id).length;
    }

    // 检查成就
    const userAchievements = data.achievements || [];
    const updatedAchievements = [];

    achievementDefinitions.forEach(definition => {
      let isUnlocked = false;
      let existingAchievement = userAchievements.find(a => a.id === definition.id);

      if (existingAchievement) {
        isUnlocked = true;
      } else {
        // 检查是否满足解锁条件
        switch (definition.type) {
          case 'course_completion':
            isUnlocked = completedCourses >= definition.threshold;
            break;
          case 'lesson_completion':
            isUnlocked = completedLessons >= definition.threshold;
            break;
          case 'review':
            isUnlocked = reviewCount >= definition.threshold;
            break;
          default:
            isUnlocked = false;
        }

        // 如果满足条件，添加成就
        if (isUnlocked) {
          const newAchievement = {
            id: definition.id,
            title: definition.title,
            description: definition.description,
            icon: definition.icon,
            unlockedAt: new Date().toISOString()
          };
          userAchievements.push(newAchievement);
        }
      }

      updatedAchievements.push({
        ...definition,
        isUnlocked
      });
    });

    // 保存更新后的成就
    if (userAchievements.length !== (data.achievements || []).length) {
      data.achievements = userAchievements;
      saveAllData(data);
    }

    setAchievements(updatedAchievements);
    setIsLoading(false);
  }, [appData.user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">学习成就</h1>
            <p className="mt-2 text-gray-600">查看您的学习成就和获得的徽章</p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">加载中...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id} 
                className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 transform hover:-translate-y-1 ${achievement.isUnlocked ? 'border-2 border-yellow-400' : 'bg-gray-50'}`}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl">{achievement.icon}</div>
                    {achievement.isUnlocked ? (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        已解锁
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                        未解锁
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{achievement.title}</h3>
                  <p className="text-gray-600 mb-4">{achievement.description}</p>
                  {!achievement.isUnlocked && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-2">解锁条件：</p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: '0%' }} // 这里可以根据实际进度计算
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementsPage;