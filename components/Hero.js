import React from 'react';
import Link from 'next/link';
import { useApp } from '../context/AppContext';

const Hero = () => {
  const { appData, getTotalAssets, loading } = useApp();
  
  return (
    <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl mb-6">
            智投学堂
          </h1>
          <p className="mt-3 max-w-3xl mx-auto text-xl sm:mt-5 mb-8">
            专为初学者设计的投资学习和模拟交易平台，让您在安全的环境中学习投资知识，实践投资策略。
          </p>
          
          {/* 账户信息卡片 */}
          {!loading && appData && (
            <div className="bg-white/10 backdrop-blur rounded-lg p-6 max-w-md mx-auto mb-8">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-blue-200 text-sm">可用资金</p>
                  <p className="text-2xl font-bold">¥{appData.balance.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-blue-200 text-sm">总资产</p>
                  <p className="text-2xl font-bold">¥{getTotalAssets().toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-10 max-w-3xl mx-auto flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/Super/courses">
              <a className="bg-white text-blue-600 px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-100 transition-colors">
                开始学习
              </a>
            </Link>
            <Link href="/Super/simulation">
              <a className="bg-transparent border border-white text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-white hover:text-blue-600 transition-colors">
                模拟交易
              </a>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;