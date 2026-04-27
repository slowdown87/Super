import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAllData } from '../utils/storage';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';

const PracticePage = () => {
  const router = useRouter();
  const { appData } = useApp();
  const [riskAssessment, setRiskAssessment] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 检查是否登录
  if (!appData?.user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">请先登录</h1>
            <p className="text-gray-600 mb-6">登录后才能使用实践环境</p>
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
    
    // 获取风险评估结果
    const userAssessment = data.userRiskAssessment?.[appData.user.id];
    if (userAssessment) {
      setRiskAssessment(userAssessment);
    }
    
    // 获取投资组合数据
    if (data.portfolio) {
      setPortfolio(data.portfolio);
    }
    
    setIsLoading(false);
  }, [appData.user.id]);

  const getInvestmentAdvice = (riskLevel) => {
    switch (riskLevel) {
      case '保守型':
        return '建议从低风险的货币基金或债券基金开始，逐步了解投资市场。';
      case '稳健型':
        return '建议配置均衡的投资组合，包括股票、债券和现金等多种资产。';
      case '积极型':
        return '建议增加权益类资产的配置比例，关注成长型股票和行业基金。';
      case '激进型':
        return '建议重点配置权益类资产，适当参与高风险高收益的投资品种。';
      default:
        return '请先完成风险评估以获取个性化投资建议。';
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">实践环境</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：投资建议和风险评估 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 风险评估和投资建议卡片 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">投资建议</h2>
                {riskAssessment ? (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${riskAssessment.level === '保守型' ? 'bg-blue-100 text-blue-800' : riskAssessment.level === '稳健型' ? 'bg-green-100 text-green-800' : riskAssessment.level === '积极型' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                    {riskAssessment.level}
                  </span>
                ) : (
                  <button 
                    onClick={() => router.push('/risk-assessment')} 
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition"
                  >
                    完成风险评估
                  </button>
                )}
              </div>
              
              <div className="mb-4">
                <p className="text-gray-600 mb-4">{riskAssessment ? getInvestmentAdvice(riskAssessment.level) : '完成风险评估，获取个性化投资建议'}</p>
              </div>
              
              {riskAssessment ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">模拟投资</h3>
                    <p className="text-sm text-gray-600 mb-3">无风险练习投资策略</p>
                    <button 
                      onClick={() => router.push('/simulation')} 
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm"
                    >
                      开始模拟
                    </button>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">小额投资</h3>
                    <p className="text-sm text-gray-600 mb-3">10元起投，真实市场体验</p>
                    <button 
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition text-sm"
                    >
                      了解详情
                    </button>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">投资组合分析</h3>
                    <p className="text-sm text-gray-600 mb-3">多维度分析投资表现</p>
                    <button 
                      onClick={() => router.push('/portfolio')} 
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition text-sm"
                    >
                      查看分析
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => router.push('/risk-assessment')} 
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  开始风险评估
                </button>
              )}
            </div>
            
            {/* 投资策略卡片 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">投资策略推荐</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">定期定额投资</h3>
                    <p className="text-sm text-gray-600">适合长期投资，分散风险</p>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                    了解详情
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">价值投资</h3>
                    <p className="text-sm text-gray-600">关注被低估的优质企业</p>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                    了解详情
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">成长投资</h3>
                    <p className="text-sm text-gray-600">投资高成长潜力的企业</p>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                    了解详情
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* 右侧：投资组合概览和快速操作 */}
          <div className="space-y-6">
            {/* 投资组合概览卡片 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">投资组合概览</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">总资产</span>
                  <span className="font-medium text-gray-900">¥{appData?.balance?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">持仓市值</span>
                  <span className="font-medium text-gray-900">¥0.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">总收益</span>
                  <span className="font-medium text-green-600">+¥0.00 (0.00%)</span>
                </div>
                <div className="pt-4 border-t">
                  <button 
                    onClick={() => router.push('/portfolio')} 
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    查看详情
                  </button>
                </div>
              </div>
            </div>
            
            {/* 快速操作卡片 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">快速操作</h2>
              <div className="space-y-3">
                <button 
                  onClick={() => router.push('/simulation')} 
                  className="w-full flex items-center justify-between px-4 py-3 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition"
                >
                  <span>模拟交易</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
                
                <button 
                  onClick={() => router.push('/portfolio')} 
                  className="w-full flex items-center justify-between px-4 py-3 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition"
                >
                  <span>投资组合</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </button>
                
                <button 
                  className="w-full flex items-center justify-between px-4 py-3 bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100 transition"
                >
                  <span>小额投资</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                
                <button 
                  className="w-full flex items-center justify-between px-4 py-3 bg-yellow-50 text-yellow-700 rounded-md hover:bg-yellow-100 transition"
                >
                  <span>投资分析</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* 学习资源卡片 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">学习资源</h2>
              <div className="space-y-3">
                <a href="/courses" className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                  <h3 className="font-medium text-gray-900 mb-1">投资基础知识</h3>
                  <p className="text-sm text-gray-600">了解投资的基本概念和原理</p>
                </a>
                <a href="/courses" className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                  <h3 className="font-medium text-gray-900 mb-1">投资策略详解</h3>
                  <p className="text-sm text-gray-600">掌握不同的投资策略和方法</p>
                </a>
                <a href="/courses" className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                  <h3 className="font-medium text-gray-900 mb-1">风险管理</h3>
                  <p className="text-sm text-gray-600">学习如何管理投资风险</p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticePage;