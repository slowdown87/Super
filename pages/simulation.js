import React, { useState } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useApp } from '../context/AppContext';
import { executeBuyOrder, executeSellOrder } from '../utils/trading';

const Simulation = () => {
  const { appData, marketData, loading, refreshMarketData, updateAppData } = useApp();
  
  // 检查是否登录
  if (!appData?.user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Head>
          <title>模拟交易 - 智投学堂</title>
        </Head>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">请先登录</h1>
          <p className="text-gray-600 mb-8">登录后才能进行模拟交易</p>
          <a href="/login" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
            去登录
          </a>
        </div>
        <Footer />
      </div>
    );
  }
  const [transaction, setTransaction] = useState({
    symbol: '',
    type: 'buy',
    quantity: 1,
    price: 0
  });
  const [message, setMessage] = useState('');

  // 当选择股票时，自动填充价格
  const handleSymbolChange = (symbol) => {
    const stock = marketData.find(s => s.symbol === symbol);
    setTransaction({
      ...transaction,
      symbol,
      price: stock ? stock.price : 0
    });
  };

  // 执行交易
  const handleTransaction = (e) => {
    e.preventDefault();
    if (!transaction.symbol || transaction.quantity <= 0) {
      setMessage('请选择股票并输入正确的数量');
      return;
    }

    let result;
    if (transaction.type === 'buy') {
      result = executeBuyOrder(transaction.symbol, transaction.quantity, transaction.price);
    } else {
      result = executeSellOrder(transaction.symbol, transaction.quantity, transaction.price);
    }

    if (result.success) {
      setMessage(result.message);
      updateAppData(result.data);
      refreshMarketData();
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>模拟交易 - 智投学堂</title>
        <meta name="description" content="模拟股票交易，实践投资策略" />
      </Head>
      
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">模拟交易</h1>
        
        {/* 账户信息 */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-600">可用资金</p>
              <p className="text-3xl font-bold text-gray-900">¥{appData?.balance?.toLocaleString() || 0}</p>
            </div>
            <div className="flex items-center justify-end">
              <button 
                onClick={refreshMarketData}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                刷新市场数据
              </button>
            </div>
          </div>
        </div>

        {/* 消息提示 */}
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-8">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：市场数据 */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">市场数据</h2>
              {loading ? (
                <p className="text-gray-600">加载中...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">股票</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">价格</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">涨跌</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {marketData.map((stock) => (
                        <tr key={stock.symbol} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <div className="font-medium text-gray-900">{stock.symbol}</div>
                            <div className="text-sm text-gray-500">{stock.name}</div>
                          </td>
                          <td className="px-4 py-4 text-right text-gray-900">${stock.price.toFixed(2)}</td>
                          <td className={`px-4 py-4 text-right ${
                            stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                          </td>
                          <td className="px-4 py-4 text-right">
                            <button 
                              onClick={() => {
                                setTransaction({
                                  symbol: stock.symbol,
                                  type: 'buy',
                                  quantity: 1,
                                  price: stock.price
                                });
                              }}
                              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 mr-2"
                            >
                              买入
                            </button>
                            <button 
                              onClick={() => {
                                setTransaction({
                                  symbol: stock.symbol,
                                  type: 'sell',
                                  quantity: 1,
                                  price: stock.price
                                });
                              }}
                              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                            >
                              卖出
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* 右侧：交易表单 */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">快速交易</h2>
              <form onSubmit={handleTransaction} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">股票代码</label>
                  <select
                    value={transaction.symbol}
                    onChange={(e) => handleSymbolChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">请选择</option>
                    {marketData.map((stock) => (
                      <option key={stock.symbol} value={stock.symbol}>{stock.symbol} - {stock.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">交易类型</label>
                  <select
                    value={transaction.type}
                    onChange={(e) => setTransaction({ ...transaction, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="buy">买入</option>
                    <option value="sell">卖出</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">数量</label>
                  <input
                    type="number"
                    min="1"
                    value={transaction.quantity}
                    onChange={(e) => setTransaction({ ...transaction, quantity: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">价格</label>
                  <input
                    type="number"
                    step="0.01"
                    value={transaction.price}
                    onChange={(e) => setTransaction({ ...transaction, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="pt-2 border-t">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">预计金额</span>
                    <span className="font-medium text-gray-900">
                      ${(transaction.quantity * transaction.price).toFixed(2)}
                    </span>
                  </div>
                </div>

                <button 
                  type="submit"
                  className={`w-full py-3 rounded-md text-white font-medium ${
                    transaction.type === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {transaction.type === 'buy' ? '确认买入' : '确认卖出'}
                </button>
              </form>
            </div>

            {/* 交易历史 */}
            {appData?.transactions?.length > 0 && (
              <div className="bg-white shadow-md rounded-lg p-6 mt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">最近交易</h2>
                <div className="space-y-3">
                  {appData.transactions.slice(0, 5).map((tx) => (
                    <div key={tx.id} className="flex justify-between items-center py-2 border-b">
                      <div>
                        <span className={`font-medium ${tx.type === 'buy' ? 'text-green-600' : 'text-red-600'}`}>
                          {tx.type === 'buy' ? '买入' : '卖出'} {tx.symbol}
                        </span>
                        <div className="text-sm text-gray-500">{new Date(tx.date).toLocaleString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{tx.quantity} 股</div>
                        <div className="text-sm text-gray-500">${tx.total.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Simulation;