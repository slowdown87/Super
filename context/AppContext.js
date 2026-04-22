import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getAllData, saveAllData, initializeSampleData } from '../utils/storage';
import { getMarketData } from '../utils/marketData';
import { getPortfolioWithCurrentPrices, getPortfolioTotalValue } from '../utils/trading';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [appData, setAppData] = useState(null);
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 初始化应用数据
  const initializeApp = useCallback(async () => {
    setLoading(true);
    try {
      // 初始化示例数据
      const initialData = initializeSampleData();
      setAppData(initialData);

      // 获取市场数据
      const stocks = await getMarketData();
      setMarketData(stocks);
    } catch (error) {
      console.error('初始化应用失败:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 应用启动时初始化
  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  // 更新应用数据
  const updateAppData = useCallback((newData) => {
    setAppData(newData);
    saveAllData(newData);
  }, []);

  // 刷新市场数据
  const refreshMarketData = useCallback(async () => {
    try {
      const stocks = await getMarketData();
      setMarketData(stocks);
      return stocks;
    } catch (error) {
      console.error('刷新市场数据失败:', error);
      return marketData;
    }
  }, [marketData]);

  // 获取投资组合
  const getPortfolio = useCallback(() => {
    return getPortfolioWithCurrentPrices(marketData);
  }, [marketData]);

  // 获取投资组合总价值
  const getTotalPortfolioValue = useCallback(() => {
    return getPortfolioTotalValue(marketData);
  }, [marketData]);

  // 获取总资产（余额 + 投资组合价值）
  const getTotalAssets = useCallback(() => {
    if (!appData) return 0;
    return appData.balance + getTotalPortfolioValue();
  }, [appData, getTotalPortfolioValue]);

  const value = {
    appData,
    marketData,
    loading,
    updateAppData,
    refreshMarketData,
    getPortfolio,
    getTotalPortfolioValue,
    getTotalAssets,
    initializeApp
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// 自定义 Hook
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp 必须在 AppProvider 内部使用');
  }
  return context;
}