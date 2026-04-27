import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useApp } from '../context/AppContext';

const Profile = () => {
  const { appData, updateAppData } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    investmentGoal: '短期',
    experienceLevel: '新手'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 初始化表单数据
  useEffect(() => {
    if (appData?.user) {
      const users = appData.users || [];
      const currentUser = users.find(u => u.id === appData.user.id);
      if (currentUser) {
        setFormData({
          name: currentUser.name,
          email: currentUser.email,
          investmentGoal: currentUser.investmentGoal || '短期',
          experienceLevel: currentUser.experienceLevel || '新手'
        });
      }
    }
  }, [appData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name) {
      setError('请填写姓名');
      return;
    }

    // 更新用户信息
    const users = appData?.users || [];
    const updatedUsers = users.map(user => {
      if (user.id === appData.user.id) {
        return {
          ...user,
          name: formData.name,
          investmentGoal: formData.investmentGoal,
          experienceLevel: formData.experienceLevel
        };
      }
      return user;
    });

    // 更新用户状态
    updateAppData({
      ...appData,
      users: updatedUsers,
      user: {
        ...appData.user,
        name: formData.name
      }
    });

    setSuccess('个人资料更新成功');
    setTimeout(() => {
      setSuccess('');
    }, 3000);
  };

  // 处理退出登录
  const handleLogout = () => {
    updateAppData({
      ...appData,
      user: null
    });
    window.location.href = '/Super/';
  };

  // 检查是否登录
  if (!appData?.user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Head>
          <title>个人资料 - 智投学堂</title>
        </Head>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">请先登录</h1>
          <p className="text-gray-600 mb-8">登录后才能查看和管理个人资料</p>
          <a href="/Super/login" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
            去登录
          </a>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>个人资料 - 智投学堂</title>
        <meta name="description" content="管理个人资料和投资偏好" />
      </Head>
      
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">个人资料管理</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：个人信息 */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 mx-auto mb-4">
                  <img 
                    src={appData.user.avatar} 
                    alt="用户头像" 
                    className="w-full h-full rounded-full object-cover" 
                  />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{appData.user.name}</h2>
                <p className="text-gray-600">{appData.user.email}</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-gray-600">账号类型</span>
                  <span className="font-medium">普通用户</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-gray-600">注册时间</span>
                  <span>{(() => {
                    const users = appData.users || [];
                    const currentUser = users.find(u => u.id === appData.user.id);
                    return currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : '未知';
                  })()}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">投资经验</span>
                  <span className="font-medium">
                    {(() => {
                      const users = appData.users || [];
                      const currentUser = users.find(u => u.id === appData.user.id);
                      return currentUser?.experienceLevel || '新手';
                    })()}
                  </span>
                </div>
              </div>
              
              <button 
                onClick={handleLogout}
                className="w-full mt-6 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                退出登录
              </button>
            </div>
          </div>
          
          {/* 右侧：资料编辑 */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">编辑个人资料</h2>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-4">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-4">
                  {success}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    姓名
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    邮箱
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">邮箱地址不可修改</p>
                </div>
                
                <div>
                  <label htmlFor="investmentGoal" className="block text-sm font-medium text-gray-700 mb-1">
                    投资目标
                  </label>
                  <select
                    id="investmentGoal"
                    name="investmentGoal"
                    value={formData.investmentGoal}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="短期">短期（1年以内）</option>
                    <option value="中期">中期（1-3年）</option>
                    <option value="长期">长期（3年以上）</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700 mb-1">
                    投资经验
                  </label>
                  <select
                    id="experienceLevel"
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="新手">新手（无经验）</option>
                    <option value="有经验">有经验（1-3年）</option>
                    <option value="专业">专业（3年以上）</option>
                  </select>
                </div>
                
                <div className="pt-4 border-t">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    保存修改
                  </button>
                </div>
              </form>
            </div>
            
            {/* 安全设置 */}
            <div className="bg-white shadow rounded-lg p-6 mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">安全设置</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <h3 className="font-medium text-gray-900">修改密码</h3>
                    <p className="text-sm text-gray-600">定期更新密码以保障账户安全</p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-500">
                    立即修改
                  </button>
                </div>
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <h3 className="font-medium text-gray-900">登录设备管理</h3>
                    <p className="text-sm text-gray-600">查看和管理登录设备</p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-500">
                    查看
                  </button>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <h3 className="font-medium text-gray-900">账号注销</h3>
                    <p className="text-sm text-gray-600">永久删除您的账号和所有数据</p>
                  </div>
                  <button className="text-red-600 hover:text-red-500">
                    注销账号
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Profile;