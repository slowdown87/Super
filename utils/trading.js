import { getItem, setItem, getAllData, saveAllData } from './storage';

// 交易系统工具类

// 执行买入交易
export function executeBuyOrder(symbol, quantity, currentPrice) {
  const data = getAllData();
  const totalCost = quantity * currentPrice;

  // 检查余额是否足够
  if (data.balance < totalCost) {
    return { success: false, message: '余额不足' };
  }

  // 更新余额
  data.balance -= totalCost;

  // 更新投资组合
  if (!data.portfolio) {
    data.portfolio = {};
  }

  if (!data.portfolio[symbol]) {
    data.portfolio[symbol] = {
      symbol: symbol,
      name: '',
      quantity: 0,
      averageCost: 0,
      totalCost: 0
    };
  }

  const holding = data.portfolio[symbol];
  const newQuantity = holding.quantity + quantity;
  const newTotalCost = holding.totalCost + totalCost;
  holding.quantity = newQuantity;
  holding.totalCost = newTotalCost;
  holding.averageCost = newTotalCost / newQuantity;

  // 记录交易历史
  if (!data.transactions) {
    data.transactions = [];
  }

  data.transactions.unshift({
    id: Date.now(),
    type: 'buy',
    symbol: symbol,
    quantity: quantity,
    price: currentPrice,
    total: totalCost,
    date: new Date().toISOString()
  });

  saveAllData(data);
  return { success: true, message: '买入成功', data };
}

// 执行卖出交易
export function executeSellOrder(symbol, quantity, currentPrice) {
  const data = getAllData();

  // 检查是否有足够持仓
  if (!data.portfolio || !data.portfolio[symbol] || data.portfolio[symbol].quantity < quantity) {
    return { success: false, message: '持仓不足' };
  }

  const holding = data.portfolio[symbol];
  const totalRevenue = quantity * currentPrice;

  // 更新余额
  data.balance += totalRevenue;

  // 更新投资组合
  holding.quantity -= quantity;
  holding.totalCost = holding.averageCost * holding.quantity;

  // 如果持仓为0，移除该股票
  if (holding.quantity <= 0) {
    delete data.portfolio[symbol];
  }

  // 记录交易历史
  if (!data.transactions) {
    data.transactions = [];
  }

  data.transactions.unshift({
    id: Date.now(),
    type: 'sell',
    symbol: symbol,
    quantity: quantity,
    price: currentPrice,
    total: totalRevenue,
    date: new Date().toISOString()
  });

  saveAllData(data);
  return { success: true, message: '卖出成功', data };
}

// 获取投资组合详情
export function getPortfolioWithCurrentPrices(marketData) {
  const data = getAllData();
  const portfolio = data.portfolio || {};
  
  const portfolioList = Object.values(portfolio).map(holding => {
    const stock = marketData.find(s => s.symbol === holding.symbol);
    const currentPrice = stock ? stock.price : holding.averageCost;
    const currentValue = holding.quantity * currentPrice;
    const profit = currentValue - holding.totalCost;
    const profitPercent = holding.totalCost > 0 ? (profit / holding.totalCost) * 100 : 0;

    return {
      ...holding,
      name: stock ? stock.name : holding.symbol,
      currentPrice: Number(currentPrice.toFixed(2)),
      currentValue: Number(currentValue.toFixed(2)),
      profit: Number(profit.toFixed(2)),
      profitPercent: Number(profitPercent.toFixed(2))
    };
  });

  return portfolioList;
}

// 获取投资组合总价值
export function getPortfolioTotalValue(marketData) {
  const portfolio = getPortfolioWithCurrentPrices(marketData);
  return portfolio.reduce((sum, item) => sum + item.currentValue, 0);
}