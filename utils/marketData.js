// 市场数据工具类
// 由于是纯前端项目，我们使用模拟数据，但设计了可以扩展真实API的结构

// 模拟的股票数据生成函数
function generateStockData() {
  const stocks = [
    { symbol: 'AAPL', name: '苹果公司', basePrice: 185.50 },
    { symbol: 'MSFT', name: '微软公司', basePrice: 410.00 },
    { symbol: 'GOOGL', name: '谷歌', basePrice: 172.00 },
    { symbol: 'AMZN', name: '亚马逊', basePrice: 178.00 },
    { symbol: 'TSLA', name: '特斯拉', basePrice: 217.00 },
    { symbol: 'META', name: 'Meta平台', basePrice: 470.00 },
    { symbol: 'NVDA', name: '英伟达', basePrice: 890.00 },
    { symbol: 'JPM', name: '摩根大通', basePrice: 195.00 }
  ];

  return stocks.map(stock => {
    // 生成随机波动
    const change = (Math.random() - 0.5) * stock.basePrice * 0.05;
    const price = stock.basePrice + change;
    const changePercent = (change / stock.basePrice) * 100;

    return {
      ...stock,
      price: Number(price.toFixed(2)),
      change: Number(change.toFixed(2)),
      changePercent: Number(changePercent.toFixed(2))
    };
  });
}

// 获取市场数据
export async function getMarketData() {
  try {
    // 这里可以替换为真实的API调用
    // 例如使用Yahoo Finance API：
    // const response = await axios.get('https://query1.finance.yahoo.com/v7/finance/quote?symbols=AAPL,MSFT,GOOGL');
    
    // 目前使用模拟数据
    return generateStockData();
  } catch (error) {
    console.error('获取市场数据失败:', error);
    // 失败时返回静态示例数据
    return [
      { symbol: 'AAPL', name: '苹果公司', price: 189.56, change: 1.23, changePercent: 0.65 },
      { symbol: 'MSFT', name: '微软公司', price: 412.34, change: -0.87, changePercent: -0.21 },
      { symbol: 'GOOGL', name: '谷歌', price: 174.56, change: 2.34, changePercent: 1.36 }
    ];
  }
}

// 获取单个股票的历史数据
export async function getStockHistory(symbol, days = 30) {
  try {
    const data = [];
    const basePrice = {
      'AAPL': 180,
      'MSFT': 400,
      'GOOGL': 165,
      'AMZN': 170,
      'TSLA': 210,
      'META': 460,
      'NVDA': 880,
      'JPM': 190
    }[symbol] || 100;

    let currentPrice = basePrice;
    const now = new Date();

    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // 生成随机波动
      const change = (Math.random() - 0.5) * currentPrice * 0.03;
      currentPrice = currentPrice + change;
      
      data.push({
        date: date.toISOString().split('T')[0],
        price: Number(currentPrice.toFixed(2)),
        open: Number((currentPrice - (Math.random() - 0.5) * 2).toFixed(2)),
        high: Number((currentPrice + Math.random() * 3).toFixed(2)),
        low: Number((currentPrice - Math.random() * 3).toFixed(2)),
        volume: Math.floor(Math.random() * 50000000) + 10000000
      });
    }

    return data;
  } catch (error) {
    console.error('获取股票历史数据失败:', error);
    return [];
  }
}