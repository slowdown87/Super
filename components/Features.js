import React from 'react';

const Features = () => {
  const features = [
    {
      title: '系统化学习',
      description: '从基础到高级的课程体系，帮助您循序渐进地学习投资知识',
      icon: '📚'
    },
    {
      title: '模拟交易',
      description: '无风险的模拟交易环境，让您在真实市场环境中实践投资策略',
      icon: '💹'
    },
    {
      title: '投资组合管理',
      description: '实时跟踪和管理您的投资组合，优化资产配置',
      icon: '📊'
    },
    {
      title: '市场数据',
      description: '实时市场数据和分析工具，帮助您做出明智的投资决策',
      icon: '📈'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">我们的特色</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            为您提供全方位的投资学习和实践工具，帮助您建立正确的投资理念
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;