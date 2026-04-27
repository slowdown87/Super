import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAllData } from '../utils/storage';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';

const AssistantPage = () => {
  const router = useRouter();
  const { appData } = useApp();
  const [riskAssessment, setRiskAssessment] = useState(null);
  const [marketData, setMarketData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 检查是否登录
  if (!appData?.user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">请先登录</h1>
            <p className="text-gray-600 mb-6">登录后才能使用智能投资助手</p>
            <a href="/Super/login" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
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
    
    // 获取市场数据
    if (data.marketData) {
      setMarketData(data.marketData);
    }
    
    setIsLoading(false);
  }, [appData.user.id]);

  const getInvestmentAdvice = (riskLevel) => {
    switch (riskLevel) {
      case '保守型':
        return '建议配置低风险资产，如货币基金、债券等，追求稳定收益。';
      case '稳健型':
        return '建议均衡配置各类资产，平衡风险和收益，适当参与权益市场。';
      case '积极型':
        return '建议增加权益类资产配置，关注长期资本增值，接受较大市场波动。';
      case '激进型':
        return '建议重点配置权益类资产，关注高成长机会，接受高风险高收益。';
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">智能投资助手</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：风险评估和投资建议 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 风险评估卡片 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">风险承受能力</h2>
                {riskAssessment ? (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${riskAssessment.level === '保守型' ? 'bg-blue-100 text-blue-800' : riskAssessment.level === '稳健型' ? 'bg-green-100 text-green-800' : riskAssessment.level === '积极型' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                    {riskAssessment.level}
                  </span>
                ) : (
                  <button 
                    onClick={() => router.push('/risk-assessment')} 
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition"
                  >
                    开始评估
                  </button>
                )}
              </div>
              
              <div className="mb-4">
                <p className="text-gray-600 mb-2">{riskAssessment ? riskAssessment.description : '完成风险评估，获取个性化投资建议'}</p>
              </div>
              
              {riskAssessment ? (
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">投资建议</h3>
                  <p className="text-gray-600">{getInvestmentAdvice(riskAssessment.level)}</p>
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
            
            {/* 投资组合建议卡片 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">投资组合建议</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">稳健型组合</h3>
                    <p className="text-sm text-gray-600">适合平衡风险和收益的投资者</p>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                    查看详情
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">成长型组合</h3>
                    <p className="text-sm text-gray-600">适合追求长期资本增值的投资者</p>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                    查看详情
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">价值型组合</h3>
                    <p className="text-sm text-gray-600">适合关注价值投资的投资者</p>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                    查看详情
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* 右侧：市场动态和投资提醒 */}
          <div className="space-y-6">
            {/* 市场动态卡片 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">市场动态</h2>
              <div className="space-y-4">
                {marketData.map((stock, index) => (
                  <div key={stock.symbol} className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{stock.name}</h3>
                      <p className="text-sm text-gray-500">{stock.symbol}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${stock.price.toFixed(2)}</p>
                      <p className={`text-sm ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 投资提醒卡片 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">投资提醒</h2>
              <div className="space-y-3">
                <div className="flex items-start p-3 border border-gray-200 rounded-lg">
                  <svg className="w-5 h-5 text-blue-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-medium text-gray-900">市场波动提醒</h3>
                    <p className="text-sm text-gray-600">近期市场波动较大，建议关注风险控制。</p>
                  </div>
                </div>
                
                <div className="flex items-start p-3 border border-gray-200 rounded-lg">
                  <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-medium text-gray-900">投资机会</h3>
                    <p className="text-sm text-gray-600">科技板块出现买入机会，建议关注。</p>
                  </div>
                </div>
                
                <div className="flex items-start p-3 border border-gray-200 rounded-lg">
                  <svg className="w-5 h-5 text-yellow-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-medium text-gray-900">定期投资提醒</h3>
                    <p className="text-sm text-gray-600">本月定期投资日即将到来，请确保资金充足。</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantPage;