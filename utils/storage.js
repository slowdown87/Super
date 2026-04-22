// 本地存储工具类
const STORAGE_KEY = 'investment_platform_data';

// 初始化数据结构
const defaultData = {
  user: null,
  courses: [],
  learningProgress: {},
  portfolio: {},
  transactions: [],
  marketData: [],
  balance: 100000,
  courseReviews: [],
  achievements: []
};

// 获取所有数据
export function getAllData() {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (!storedData) {
      return { ...defaultData };
    }
    return JSON.parse(storedData);
  } catch (error) {
    console.error('获取数据失败:', error);
    return { ...defaultData };
  }
}

// 保存所有数据
export function saveAllData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('保存数据失败:', error);
    return false;
  }
}

// 获取特定键的数据
export function getItem(key) {
  const data = getAllData();
  return data[key];
}

// 设置特定键的数据
export function setItem(key, value) {
  const data = getAllData();
  data[key] = value;
  return saveAllData(data);
}

// 初始化示例数据
export function initializeSampleData() {
  const data = getAllData();
  
  // 如果没有课程数据，添加示例课程
  if (!data.courses || data.courses.length === 0) {
    data.courses = [
      {
        id: 1,
        title: '投资基础入门',
        description: '了解投资的基本概念和原理，为后续学习打下基础',
        level: '初级',
        duration: 2.5,
        price: 0,
        coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=investment%20basics%20education%20financial%20literacy&image_size=landscape_16_9',
        rating: 4.8,
        reviewCount: 125,
        lessons: [
          {
            id: 1,
            title: '什么是投资',
            duration: 15,
            type: 'video',
            videoUrl: 'https://example.com/video1.mp4',
            content: '<h2>什么是投资？</h2><p>投资是指将资金投入到不同的资产中，以期望获得未来的收益。投资的目的是为了使资金增值，对抗通货膨胀，实现财务目标。</p><p>常见的投资方式包括：股票、债券、基金、房地产、加密货币等。</p>',
            completed: false
          },
          {
            id: 2,
            title: '风险与回报',
            duration: 20,
            type: 'text',
            content: '<h2>风险与回报的关系</h2><p>投资中的一个基本原理是：高风险通常伴随着高回报，低风险则通常带来低回报。</p><p>作为投资者，你需要根据自己的风险承受能力和投资目标来选择合适的投资产品。</p><p>风险评估是投资决策的重要环节，你需要了解自己的风险偏好，制定相应的投资策略。</p>',
            completed: false
          },
          {
            id: 3,
            title: '投资工具介绍',
            duration: 25,
            type: 'document',
            content: '<h2>常见投资工具</h2><h3>1. 股票</h3><p>股票是公司的所有权凭证，购买股票意味着你成为公司的股东。</p><h3>2. 债券</h3><p>债券是一种债务工具，购买债券意味着你借钱给发行方。</p><h3>3. 基金</h3><p>基金是集合投资工具，由专业基金经理管理，分散投资于多种资产。</p><h3>4. 房地产</h3><p>房地产投资包括购买住宅、商业地产等，通过租金和资产增值获得收益。</p>',
            completed: false
          }
        ]
      },
      {
        id: 2,
        title: '股票市场分析',
        description: '学习股票市场的分析方法和技巧，提高投资决策能力',
        level: '中级',
        duration: 4.0,
        price: 99,
        coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=stock%20market%20analysis%20financial%20charts&image_size=landscape_16_9',
        rating: 4.6,
        reviewCount: 89,
        lessons: [
          {
            id: 1,
            title: '基本面分析',
            duration: 30,
            type: 'video',
            content: '<h2>基本面分析</h2><p>基本面分析是通过分析公司的财务状况、行业地位、管理团队等因素来评估股票价值的方法。</p><p>关键指标包括：市盈率(P/E)、市净率(P/B)、每股收益(EPS)、营收增长等。</p><p>基本面分析适合长期投资者，帮助识别被低估的优质公司。</p>',
            completed: false
          },
          {
            id: 2,
            title: '技术面分析',
            duration: 45,
            type: 'video',
            content: '<h2>技术面分析</h2><p>技术面分析是通过分析股票价格和交易量的历史数据来预测未来价格走势的方法。</p><p>常用技术指标包括：移动平均线、MACD、RSI、布林带等。</p><p>技术面分析适合短期交易者，帮助识别买卖时机。</p>',
            completed: false
          }
        ]
      },
      {
        id: 3,
        title: '投资组合管理',
        description: '学习如何构建和管理投资组合，实现资产的合理配置',
        level: '高级',
        duration: 5.5,
        price: 199,
        coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=investment%20portfolio%20management%20asset%20allocation&image_size=landscape_16_9',
        rating: 4.9,
        reviewCount: 67,
        lessons: [
          {
            id: 1,
            title: '资产配置',
            duration: 40,
            type: 'text',
            content: '<h2>资产配置策略</h2><p>资产配置是根据投资者的风险承受能力和投资目标，将资金分配到不同资产类别中的过程。</p><p>常见的资产类别包括：股票、债券、现金、房地产、商品等。</p><p>合理的资产配置可以降低投资组合的整体风险，提高风险调整后的收益。</p>',
            completed: false
          },
          {
            id: 2,
            title: '风险分散',
            duration: 35,
            type: 'text',
            content: '<h2>风险分散原理</h2><p>风险分散是通过投资于不同的资产来降低投资组合风险的策略。</p><p>关键原则：</p><ul><li>投资于不同行业的股票</li><li>投资于不同规模的公司</li><li>投资于不同国家和地区</li><li>投资于不同类型的资产</li></ul><p>风险分散可以在不降低预期收益的情况下降低投资组合的波动性。</p>',
            completed: false
          }
        ]
      },
      {
        id: 4,
        title: '技术分析进阶',
        description: '深入学习技术分析的高级技巧和策略',
        level: '高级',
        duration: 6.0,
        price: 299,
        coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=advanced%20technical%20analysis%20trading%20strategies&image_size=landscape_16_9',
        rating: 4.7,
        reviewCount: 45,
        lessons: [
          {
            id: 1,
            title: '高级技术指标',
            duration: 45,
            type: 'video',
            content: '<h2>高级技术指标</h2><p>学习更复杂的技术指标，如Ichimoku云图、波浪理论、 Elliott Wave等。</p><p>这些指标可以帮助你更准确地识别市场趋势和反转点。</p>',
            completed: false
          },
          {
            id: 2,
            title: '交易策略构建',
            duration: 50,
            type: 'text',
            content: '<h2>构建交易策略</h2><p>学习如何基于技术分析构建自己的交易策略，包括入场点、出场点、止损设置等。</p><p>一个好的交易策略应该包含：明确的信号、风险管理规则、资金管理计划。</p>',
            completed: false
          }
        ]
      },
      {
        id: 5,
        title: '基本面分析深度',
        description: '掌握财务报表分析和公司估值的核心方法',
        level: '高级',
        duration: 5.0,
        price: 249,
        coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fundamental%20analysis%20financial%20statements&image_size=landscape_16_9',
        rating: 4.8,
        reviewCount: 38,
        lessons: [
          {
            id: 1,
            title: '财务报表分析',
            duration: 40,
            type: 'document',
            content: '<h2>财务报表分析</h2><p>深入学习如何分析公司的资产负债表、利润表和现金流量表。</p><p>关键财务比率分析，如盈利能力、偿债能力、运营效率等。</p>',
            completed: false
          },
          {
            id: 2,
            title: '公司估值方法',
            duration: 45,
            type: 'video',
            content: '<h2>公司估值方法</h2><p>学习DCF（贴现现金流）、相对估值、重置成本法等公司估值方法。</p><p>如何使用这些方法来评估股票的内在价值。</p>',
            completed: false
          }
        ]
      }
    ];
  }
  
  // 如果没有市场数据，添加示例市场数据
  if (!data.marketData || data.marketData.length === 0) {
    data.marketData = [
      { symbol: 'AAPL', name: '苹果公司', price: 189.56, change: 1.23, changePercent: 0.65 },
      { symbol: 'MSFT', name: '微软公司', price: 412.34, change: -0.87, changePercent: -0.21 },
      { symbol: 'GOOGL', name: '谷歌', price: 174.56, change: 2.34, changePercent: 1.36 },
      { symbol: 'AMZN', name: '亚马逊', price: 178.45, change: 0.56, changePercent: 0.31 },
      { symbol: 'TSLA', name: '特斯拉', price: 215.67, change: -1.23, changePercent: -0.57 }
    ];
  }
  
  // 保存初始化数据
  saveAllData(data);
  return data;
}