import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAllData } from '../utils/storage';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';

const RiskResultPage = () => {
  const router = useRouter();
  const { appData } = useApp();
  const [riskAssessment, setRiskAssessment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 检查是否登录
  if (!appData?.user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">请先登录</h1>
            <p className="text-gray-600 mb-6">登录后才能查看风险评估结果</p>
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
    const userAssessment = data.userRiskAssessment?.[appData.user.id];
    
    if (userAssessment) {
      setRiskAssessment(userAssessment);
    } else {
      // 如果没有评估结果，重定向到评估页面
      router.push('/risk-assessment');
    }
    setIsLoading(false);
  }, [appData.user.id, router]);

  const getInvestmentAdvice = (riskLevel) => {
    switch (riskLevel) {
      case '保守型':
        return {
          title: '保守型投资建议',
          description: '适合追求稳定收益、风险承受能力较低的投资者',
          allocation: [
            { asset: '银行存款/货币基金', percentage: 50 },
            { asset: '债券基金', percentage: 30 },
            { asset: '蓝筹股', percentage: 15 },
            { asset: '其他', percentage: 5 }
          ],
          strategy: [
            '优先考虑保本型产品',
            '关注短期收益',
            '避免高风险投资',
            '定期定额投资降低风险'
          ]
        };
      case '稳健型':
        return {
          title: '稳健型投资建议',
          description: '适合平衡风险和收益、风险承受能力中等的投资者',
          allocation: [
            { asset: '银行存款/货币基金', percentage: 30 },
            { asset: '债券基金', percentage: 30 },
            { asset: '蓝筹股', percentage: 25 },
            { asset: '成长股', percentage: 10 },
            { asset: '其他', percentage: 5 }
          ],
          strategy: [
            '均衡配置各类资产',
            '关注中长期收益',
            '适当参与市场波动',
            '定期调整投资组合'
          ]
        };
      case '积极型':
        return {
          title: '积极型投资建议',
          description: '适合追求较高收益、风险承受能力较高的投资者',
          allocation: [
            { asset: '银行存款/货币基金', percentage: 15 },
            { asset: '债券基金', percentage: 20 },
            { asset: '蓝筹股', percentage: 30 },
            { asset: '成长股', percentage: 25 },
            { asset: '其他', percentage: 10 }
          ],
          strategy: [
            '增加权益类资产配置',
            '关注长期资本增值',
            '接受较大市场波动',
            '积极调整投资策略'
          ]
        };
      case '激进型':
        return {
          title: '激进型投资建议',
          description: '适合追求高收益、风险承受能力高的投资者',
          allocation: [
            { asset: '银行存款/货币基金', percentage: 10 },
            { asset: '债券基金', percentage: 15 },
            { asset: '蓝筹股', percentage: 25 },
            { asset: '成长股', percentage: 30 },
            { asset: '其他', percentage: 20 }
          ],
          strategy: [
            '重点配置权益类资产',
            '关注高成长机会',
            '接受高风险高收益',
            '灵活调整投资组合'
          ]
        };
      default:
        return {
          title: '投资建议',
          description: '请完成风险评估以获取个性化投资建议',
          allocation: [],
          strategy: []
        };
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

  if (!riskAssessment) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">未找到风险评估结果</h1>
            <p className="text-gray-600 mb-6">请先完成风险评估</p>
            <button 
              onClick={() => router.push('/risk-assessment')} 
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              开始评估
            </button>
          </div>
        </div>
      </div>
    );
  }

  const investmentAdvice = getInvestmentAdvice(riskAssessment.level);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">风险评估结果</h1>
          
          {/* 风险评估结果卡片 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">您的风险承受能力：{riskAssessment.level}</h2>
                <p className="text-gray-600">{riskAssessment.description}</p>
              </div>
              <div className="mt-4 md:mt-0">
                <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  评估时间：{new Date(riskAssessment.assessedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">评估得分</h3>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-blue-600 h-4 rounded-full" 
                  style={{ width: `${(riskAssessment.score / 40) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-500">
                <span>0</span>
                <span>{riskAssessment.score}/40</span>
                <span>40</span>
              </div>
            </div>
            
            <button 
              onClick={() => router.push('/risk-assessment')} 
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
            >
              重新评估
            </button>
          </div>
          
          {/* 投资建议卡片 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{investmentAdvice.title}</h2>
            <p className="text-gray-600 mb-6">{investmentAdvice.description}</p>
            
            {/* 资产配置建议 */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">建议资产配置</h3>
              <div className="space-y-3">
                {investmentAdvice.allocation.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{item.asset}</span>
                      <span className="text-sm font-medium text-gray-700">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 投资策略建议 */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">投资策略建议</h3>
              <ul className="space-y-2">
                {investmentAdvice.strategy.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskResultPage;