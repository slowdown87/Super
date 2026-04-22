import React from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useApp } from '../context/AppContext';
import { getTotalPortfolioValue } from '../utils/trading';

const Portfolio = () => {
  const { appData, marketData, loading, getPortfolio, getTotalAssets } = useApp();
  
  // 检查是否登录
  if (!appData?.user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Head>
          <title>投资组合 - 智投学堂</title>
        </Head>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">请先登录</h1>
          <p className="text-gray-600 mb-8">登录后才能查看和管理您的投资组合</p>
          <a href="/login" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
            去登录
          </a>
        </div>
        <Footer />
      </div>
    );
  }
  
  const portfolio = getPortfolio();
  const portfolioValue = getTotalPortfolioValue();
  const totalAssets = getTotalAssets();
  const initialBalance = 100000; // 初始资金
  const totalProfit = totalAssets - initialBalance;
  const profitPercentage = ((totalProfit / initialBalance) * 100).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>投资组合 - 智投学堂</title>
        <meta name="description" content="查看和管理您的投资组合" />
      </Head>
      
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">投资组合</h1>
        
        {/* 资产概览卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white shadow rounded-lg p-6">
            <p className="text-gray-600 text-sm mb-1">总资产</p>
            <p className="text-2xl font-bold text-gray-900">¥{totalAssets.toLocaleString()}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <p className="text-gray-600 text-sm mb-1">可用资金</p>
            <p className="text-2xl font-bold text-gray-900">¥{appData?.balance?.toLocaleString() || 0}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <p className="text-gray-600 text-sm mb-1">持仓市值</p>
            <p className="text-2xl font-bold text-gray-900">${portfolioValue.toLocaleString()}</p>
          </div>
          <div className={`bg-white shadow rounded-lg p-6 ${totalProfit >= 0 ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-red-500'}`}>
            <p className="text-gray-600 text-sm mb-1">总收益</p>
            <p className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalProfit >= 0 ? '+' : ''}¥{totalProfit.toLocaleString()} ({profitPercentage}%)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 持仓列表 */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">持仓股票</h2>
              </div>
              
              {loading ? (
                <div className="p-6 text-center text-gray-600">加载中...</div>
              ) : portfolio.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-gray-600 mb-4">您还没有持仓</p>
                  <button 
                    onClick={() => window.location.href = '/simulation'}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    去模拟交易
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">股票</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">数量</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">成本</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">现价</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">市值</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">盈亏</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {portfolio.map((item) => {
                        const stock = marketData.find(s => s.symbol === item.symbol);
                        return (
                          <tr key={item.symbol} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="font-medium text-gray-900">{item.symbol}</div>
                              <div className="text-sm text-gray-500">{item.name}</div>
                            </td>
                            <td className="px-6 py-4 text-right">{item.quantity}</td>
                            <td className="px-6 py-4 text-right">${item.averageCost.toFixed(2)}</td>
                            <td className="px-6 py-4 text-right">${item.currentPrice.toFixed(2)}</td>
                            <td className="px-6 py-4 text-right">${item.currentValue.toLocaleString()}</td>
                            <td className={`px-6 py-4 text-right font-medium ${
                              item.profit >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {item.profit >= 0 ? '+' : ''}${item.profit.toFixed(2)} ({item.profitPercent.toFixed(2)}%)
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* 交易历史 */}
            {appData?.transactions?.length > 0 && (
              <div className="bg-white shadow rounded-lg mt-8">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">交易历史</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">时间</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">股票</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">类型</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">数量</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">价格</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">金额</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {appData.transactions.slice(0, 10).map((tx) => (
                        <tr key={tx.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(tx.date).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-900">{tx.symbol}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs font-medium rounded ${
                              tx.type === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {tx.type === 'buy' ? '买入' : '卖出'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">{tx.quantity}</td>
                          <td className="px-6 py-4 text-right">${tx.price.toFixed(2)}</td>
                          <td className="px-6 py-4 text-right font-medium">${tx.total.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* 侧边栏 - 资产配置 */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">资产配置</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">现金</span>
                    <span className="text-gray-900">{totalAssets > 0 ? ((appData?.balance / totalAssets) * 100).toFixed(1) : 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${totalAssets > 0 ? (appData?.balance / totalAssets) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>

                {portfolio.map((item) => {
                  const percentage = totalAssets > 0 ? ((item.currentValue / totalAssets) * 100).toFixed(1) : 0;
                  return (
                    <div key={item.symbol}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{item.symbol}</span>
                        <span className="text-gray-900">{percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 快速操作 */}
            <div className="bg-white shadow rounded-lg p-6 mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">快速操作</h2>
              <div className="space-y-3">
                <button 
                  onClick={() => window.location.href = '/simulation'}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  进行交易
                </button>
                <button 
                  className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 border border-gray-300"
                >
                  导出数据
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Portfolio;