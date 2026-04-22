import React from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Footer from '../components/Footer';
import { useApp } from '../context/AppContext';

const Home = () => {
  const { marketData, loading, refreshMarketData, getPortfolio } = useApp();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>智投学堂 - 智能投资学习平台</title>
        <meta name="description" content="初学者的智能投资学习和模拟交易平台" />
      </Head>
      
      <Navbar />
      <Hero />
      <Features />
      
      {/* 市场数据预览 */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">市场概览</h2>
            <button 
              onClick={refreshMarketData}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              刷新数据
            </button>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">加载中...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {marketData.slice(0, 4).map((stock) => (
                <div key={stock.symbol} className="bg-gray-50 rounded-lg p-4 border">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg">{stock.symbol}</h3>
                      <p className="text-sm text-gray-500">{stock.name}</p>
                    </div>
                    <span className={`text-sm font-medium px-2 py-1 rounded ${
                      stock.change >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent}%
                    </span>
                  </div>
                  <p className="text-2xl font-bold">${stock.price}</p>
                  <p className={`text-sm ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.change}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* 投资组合预览 */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">投资组合</h2>
          <div className="bg-white rounded-lg shadow p-6">
            {loading ? (
              <p className="text-gray-600">加载中...</p>
            ) : (
              <div>
                {(() => {
                  const portfolio = getPortfolio();
                  if (portfolio.length === 0) {
                    return (
                      <div className="text-center py-8">
                        <p className="text-gray-600">您还没有持仓，去模拟交易试试吧！</p>
                      </div>
                    );
                  }
                  
                  return (
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4">股票</th>
                            <th className="text-right py-3 px-4">持仓</th>
                            <th className="text-right py-3 px-4">现价</th>
                            <th className="text-right py-3 px-4">市值</th>
                            <th className="text-right py-3 px-4">盈亏</th>
                          </tr>
                        </thead>
                        <tbody>
                          {portfolio.map((item) => (
                            <tr key={item.symbol} className="border-b">
                              <td className="py-3 px-4">
                                <div className="font-medium">{item.symbol}</div>
                                <div className="text-sm text-gray-500">{item.name}</div>
                              </td>
                              <td className="text-right py-3 px-4">{item.quantity}</td>
                              <td className="text-right py-3 px-4">${item.currentPrice}</td>
                              <td className="text-right py-3 px-4">${item.currentValue.toLocaleString()}</td>
                              <td className={`text-right py-3 px-4 font-medium ${
                                item.profit >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {item.profit >= 0 ? '+' : ''}${item.profit} ({item.profitPercent}%)
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Home;