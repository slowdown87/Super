import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { getAllData, saveAllData } from '../utils/storage';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';

const RiskAssessmentPage = () => {
  const router = useRouter();
  const { appData } = useApp();
  const [answers, setAnswers] = useState({
    q1: 0,
    q2: 0,
    q3: 0,
    q4: 0,
    q5: 0,
    q6: 0,
    q7: 0,
    q8: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 检查是否登录
  if (!appData?.user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">请先登录</h1>
            <p className="text-gray-600 mb-6">登录后才能进行风险评估</p>
            <a href="/login" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
              去登录
            </a>
          </div>
        </div>
      </div>
    );
  }

  const questions = [
    {
      id: 'q1',
      question: '您的年龄段是？',
      options: [
        { value: 1, label: '18-25岁' },
        { value: 2, label: '26-35岁' },
        { value: 3, label: '36-45岁' },
        { value: 4, label: '46-55岁' },
        { value: 5, label: '56岁以上' }
      ]
    },
    {
      id: 'q2',
      question: '您的投资经验是？',
      options: [
        { value: 1, label: '无投资经验' },
        { value: 2, label: '1年以下' },
        { value: 3, label: '1-3年' },
        { value: 4, label: '3-5年' },
        { value: 5, label: '5年以上' }
      ]
    },
    {
      id: 'q3',
      question: '您的投资目标是？',
      options: [
        { value: 1, label: '保本为主，追求稳定收益' },
        { value: 2, label: '平衡风险和收益' },
        { value: 3, label: '追求较高收益，能承受一定风险' },
        { value: 4, label: '追求高收益，能承受较大风险' },
        { value: 5, label: '追求最高收益，能承受高风险' }
      ]
    },
    {
      id: 'q4',
      question: '您能接受的最大投资亏损是？',
      options: [
        { value: 1, label: '不能接受任何亏损' },
        { value: 2, label: '最多5%' },
        { value: 3, label: '最多10%' },
        { value: 4, label: '最多20%' },
        { value: 5, label: '20%以上' }
      ]
    },
    {
      id: 'q5',
      question: '您的投资期限是？',
      options: [
        { value: 1, label: '1年以内' },
        { value: 2, label: '1-3年' },
        { value: 3, label: '3-5年' },
        { value: 4, label: '5-10年' },
        { value: 5, label: '10年以上' }
      ]
    },
    {
      id: 'q6',
      question: '您的收入来源稳定性如何？',
      options: [
        { value: 1, label: '非常不稳定' },
        { value: 2, label: '不太稳定' },
        { value: 3, label: '一般' },
        { value: 4, label: '比较稳定' },
        { value: 5, label: '非常稳定' }
      ]
    },
    {
      id: 'q7',
      question: '您的家庭月收入水平是？',
      options: [
        { value: 1, label: '5000元以下' },
        { value: 2, label: '5000-10000元' },
        { value: 3, label: '10000-20000元' },
        { value: 4, label: '20000-50000元' },
        { value: 5, label: '50000元以上' }
      ]
    },
    {
      id: 'q8',
      question: '您的投资占总资产的比例是？',
      options: [
        { value: 1, label: '10%以下' },
        { value: 2, label: '10%-20%' },
        { value: 3, label: '20%-30%' },
        { value: 4, label: '30%-50%' },
        { value: 5, label: '50%以上' }
      ]
    }
  ];

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const calculateRiskLevel = (answers) => {
    const totalScore = Object.values(answers).reduce((sum, value) => sum + value, 0);
    
    if (totalScore <= 15) {
      return { level: '保守型', score: totalScore, description: '追求稳定收益，风险承受能力低' };
    } else if (totalScore <= 25) {
      return { level: '稳健型', score: totalScore, description: '平衡风险和收益，风险承受能力中等' };
    } else if (totalScore <= 35) {
      return { level: '积极型', score: totalScore, description: '追求较高收益，风险承受能力较高' };
    } else {
      return { level: '激进型', score: totalScore, description: '追求高收益，风险承受能力高' };
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 检查是否所有问题都已回答
    const allAnswered = Object.values(answers).every(value => value > 0);
    if (!allAnswered) {
      alert('请回答所有问题');
      return;
    }

    setIsSubmitting(true);

    // 计算风险等级
    const riskAssessment = calculateRiskLevel(answers);
    
    // 保存风险评估结果
    const data = getAllData();
    if (!data.userRiskAssessment) {
      data.userRiskAssessment = {};
    }
    data.userRiskAssessment[appData.user.id] = {
      ...riskAssessment,
      answers,
      assessedAt: new Date().toISOString()
    };
    saveAllData(data);

    // 跳转到结果页面
    setTimeout(() => {
      router.push('/risk-result');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">风险评估问卷</h1>
          <p className="text-gray-600 mb-8">请回答以下问题，帮助我们评估您的风险承受能力，为您提供个性化的投资建议。</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {questions.map((question, index) => (
              <div key={question.id} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{index + 1}. {question.question}</h3>
                <div className="space-y-3">
                  {question.options.map((option) => (
                    <div key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        id={`${question.id}_${option.value}`}
                        name={question.id}
                        value={option.value}
                        checked={answers[question.id] === option.value}
                        onChange={() => handleAnswerChange(question.id, option.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label
                        htmlFor={`${question.id}_${option.value}`}
                        className="ml-3 block text-sm font-medium text-gray-700"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
              >
                {isSubmitting ? '提交中...' : '提交评估'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RiskAssessmentPage;