exports.id = 4;
exports.ids = [4];
exports.modules = {

/***/ 8887:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  w: () => (/* binding */ AppProvider),
  q: () => (/* binding */ useApp)
});

// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(5893);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(6689);
// EXTERNAL MODULE: ./utils/storage.js
var storage = __webpack_require__(8312);
;// CONCATENATED MODULE: ./utils/marketData.js
// 市场数据工具类
// 由于是纯前端项目，我们使用模拟数据，但设计了可以扩展真实API的结构
// 模拟的股票数据生成函数
function generateStockData() {
    const stocks = [
        {
            symbol: "AAPL",
            name: "苹果公司",
            basePrice: 185.50
        },
        {
            symbol: "MSFT",
            name: "微软公司",
            basePrice: 410.00
        },
        {
            symbol: "GOOGL",
            name: "谷歌",
            basePrice: 172.00
        },
        {
            symbol: "AMZN",
            name: "亚马逊",
            basePrice: 178.00
        },
        {
            symbol: "TSLA",
            name: "特斯拉",
            basePrice: 217.00
        },
        {
            symbol: "META",
            name: "Meta平台",
            basePrice: 470.00
        },
        {
            symbol: "NVDA",
            name: "英伟达",
            basePrice: 890.00
        },
        {
            symbol: "JPM",
            name: "摩根大通",
            basePrice: 195.00
        }
    ];
    return stocks.map((stock)=>{
        // 生成随机波动
        const change = (Math.random() - 0.5) * stock.basePrice * 0.05;
        const price = stock.basePrice + change;
        const changePercent = change / stock.basePrice * 100;
        return {
            ...stock,
            price: Number(price.toFixed(2)),
            change: Number(change.toFixed(2)),
            changePercent: Number(changePercent.toFixed(2))
        };
    });
}
// 获取市场数据
async function getMarketData() {
    try {
        // 这里可以替换为真实的API调用
        // 例如使用Yahoo Finance API：
        // const response = await axios.get('https://query1.finance.yahoo.com/v7/finance/quote?symbols=AAPL,MSFT,GOOGL');
        // 目前使用模拟数据
        return generateStockData();
    } catch (error) {
        console.error("获取市场数据失败:", error);
        // 失败时返回静态示例数据
        return [
            {
                symbol: "AAPL",
                name: "苹果公司",
                price: 189.56,
                change: 1.23,
                changePercent: 0.65
            },
            {
                symbol: "MSFT",
                name: "微软公司",
                price: 412.34,
                change: -0.87,
                changePercent: -0.21
            },
            {
                symbol: "GOOGL",
                name: "谷歌",
                price: 174.56,
                change: 2.34,
                changePercent: 1.36
            }
        ];
    }
}
// 获取单个股票的历史数据
async function getStockHistory(symbol, days = 30) {
    try {
        const data = [];
        const basePrice = {
            "AAPL": 180,
            "MSFT": 400,
            "GOOGL": 165,
            "AMZN": 170,
            "TSLA": 210,
            "META": 460,
            "NVDA": 880,
            "JPM": 190
        }[symbol] || 100;
        let currentPrice = basePrice;
        const now = new Date();
        for(let i = days; i >= 0; i--){
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            // 生成随机波动
            const change = (Math.random() - 0.5) * currentPrice * 0.03;
            currentPrice = currentPrice + change;
            data.push({
                date: date.toISOString().split("T")[0],
                price: Number(currentPrice.toFixed(2)),
                open: Number((currentPrice - (Math.random() - 0.5) * 2).toFixed(2)),
                high: Number((currentPrice + Math.random() * 3).toFixed(2)),
                low: Number((currentPrice - Math.random() * 3).toFixed(2)),
                volume: Math.floor(Math.random() * 50000000) + 10000000
            });
        }
        return data;
    } catch (error) {
        console.error("获取股票历史数据失败:", error);
        return [];
    }
}

// EXTERNAL MODULE: ./utils/trading.js
var trading = __webpack_require__(4035);
;// CONCATENATED MODULE: ./context/AppContext.js





const AppContext = /*#__PURE__*/ (0,external_react_.createContext)();
function AppProvider({ children }) {
    const [appData, setAppData] = (0,external_react_.useState)(null);
    const [marketData, setMarketData] = (0,external_react_.useState)([]);
    const [loading, setLoading] = (0,external_react_.useState)(true);
    // 初始化应用数据
    const initializeApp = (0,external_react_.useCallback)(async ()=>{
        setLoading(true);
        try {
            // 初始化示例数据
            const initialData = (0,storage/* initializeSampleData */.W0)();
            setAppData(initialData);
            // 获取市场数据
            const stocks = await getMarketData();
            setMarketData(stocks);
        } catch (error) {
            console.error("初始化应用失败:", error);
        } finally{
            setLoading(false);
        }
    }, []);
    // 应用启动时初始化
    (0,external_react_.useEffect)(()=>{
        initializeApp();
    }, [
        initializeApp
    ]);
    // 更新应用数据
    const updateAppData = (0,external_react_.useCallback)((newData)=>{
        setAppData(newData);
        (0,storage/* saveAllData */.yZ)(newData);
    }, []);
    // 刷新市场数据
    const refreshMarketData = (0,external_react_.useCallback)(async ()=>{
        try {
            const stocks = await getMarketData();
            setMarketData(stocks);
            return stocks;
        } catch (error) {
            console.error("刷新市场数据失败:", error);
            return marketData;
        }
    }, [
        marketData
    ]);
    // 获取投资组合
    const getPortfolio = (0,external_react_.useCallback)(()=>{
        return (0,trading/* getPortfolioWithCurrentPrices */.Kw)(marketData);
    }, [
        marketData
    ]);
    // 获取投资组合总价值
    const getTotalPortfolioValue = (0,external_react_.useCallback)(()=>{
        return (0,trading/* getPortfolioTotalValue */.CL)(marketData);
    }, [
        marketData
    ]);
    // 获取总资产（余额 + 投资组合价值）
    const getTotalAssets = (0,external_react_.useCallback)(()=>{
        if (!appData) return 0;
        return appData.balance + getTotalPortfolioValue();
    }, [
        appData,
        getTotalPortfolioValue
    ]);
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
    return /*#__PURE__*/ jsx_runtime.jsx(AppContext.Provider, {
        value: value,
        children: children
    });
}
// 自定义 Hook
function useApp() {
    const context = (0,external_react_.useContext)(AppContext);
    if (!context) {
        throw new Error("useApp 必须在 AppProvider 内部使用");
    }
    return context;
}


/***/ }),

/***/ 6004:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6764);
/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _context_AppContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8887);



function MyApp({ Component, pageProps }) {
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_context_AppContext__WEBPACK_IMPORTED_MODULE_2__/* .AppProvider */ .w, {
        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(Component, {
            ...pageProps
        })
    });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyApp);


/***/ }),

/***/ 8312:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   W0: () => (/* binding */ initializeSampleData),
/* harmony export */   jl: () => (/* binding */ getAllData),
/* harmony export */   yZ: () => (/* binding */ saveAllData)
/* harmony export */ });
/* unused harmony exports getItem, setItem */
// 本地存储工具类
const STORAGE_KEY = "investment_platform_data";
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
function getAllData() {
    try {
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (!storedData) {
            return {
                ...defaultData
            };
        }
        return JSON.parse(storedData);
    } catch (error) {
        console.error("获取数据失败:", error);
        return {
            ...defaultData
        };
    }
}
// 保存所有数据
function saveAllData(data) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error("保存数据失败:", error);
        return false;
    }
}
// 获取特定键的数据
function getItem(key) {
    const data = getAllData();
    return data[key];
}
// 设置特定键的数据
function setItem(key, value) {
    const data = getAllData();
    data[key] = value;
    return saveAllData(data);
}
// 初始化示例数据
function initializeSampleData() {
    const data = getAllData();
    // 如果没有课程数据，添加示例课程
    if (!data.courses || data.courses.length === 0) {
        data.courses = [
            {
                id: 1,
                title: "投资基础入门",
                description: "了解投资的基本概念和原理，为后续学习打下基础",
                level: "初级",
                duration: 2.5,
                price: 0,
                coverImage: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=investment%20basics%20education%20financial%20literacy&image_size=landscape_16_9",
                rating: 4.8,
                reviewCount: 125,
                lessons: [
                    {
                        id: 1,
                        title: "什么是投资",
                        duration: 15,
                        type: "video",
                        videoUrl: "https://example.com/video1.mp4",
                        content: "<h2>什么是投资？</h2><p>投资是指将资金投入到不同的资产中，以期望获得未来的收益。投资的目的是为了使资金增值，对抗通货膨胀，实现财务目标。</p><p>常见的投资方式包括：股票、债券、基金、房地产、加密货币等。</p>",
                        completed: false
                    },
                    {
                        id: 2,
                        title: "风险与回报",
                        duration: 20,
                        type: "text",
                        content: "<h2>风险与回报的关系</h2><p>投资中的一个基本原理是：高风险通常伴随着高回报，低风险则通常带来低回报。</p><p>作为投资者，你需要根据自己的风险承受能力和投资目标来选择合适的投资产品。</p><p>风险评估是投资决策的重要环节，你需要了解自己的风险偏好，制定相应的投资策略。</p>",
                        completed: false
                    },
                    {
                        id: 3,
                        title: "投资工具介绍",
                        duration: 25,
                        type: "document",
                        content: "<h2>常见投资工具</h2><h3>1. 股票</h3><p>股票是公司的所有权凭证，购买股票意味着你成为公司的股东。</p><h3>2. 债券</h3><p>债券是一种债务工具，购买债券意味着你借钱给发行方。</p><h3>3. 基金</h3><p>基金是集合投资工具，由专业基金经理管理，分散投资于多种资产。</p><h3>4. 房地产</h3><p>房地产投资包括购买住宅、商业地产等，通过租金和资产增值获得收益。</p>",
                        completed: false
                    }
                ]
            },
            {
                id: 2,
                title: "股票市场分析",
                description: "学习股票市场的分析方法和技巧，提高投资决策能力",
                level: "中级",
                duration: 4.0,
                price: 99,
                coverImage: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=stock%20market%20analysis%20financial%20charts&image_size=landscape_16_9",
                rating: 4.6,
                reviewCount: 89,
                lessons: [
                    {
                        id: 1,
                        title: "基本面分析",
                        duration: 30,
                        type: "video",
                        content: "<h2>基本面分析</h2><p>基本面分析是通过分析公司的财务状况、行业地位、管理团队等因素来评估股票价值的方法。</p><p>关键指标包括：市盈率(P/E)、市净率(P/B)、每股收益(EPS)、营收增长等。</p><p>基本面分析适合长期投资者，帮助识别被低估的优质公司。</p>",
                        completed: false
                    },
                    {
                        id: 2,
                        title: "技术面分析",
                        duration: 45,
                        type: "video",
                        content: "<h2>技术面分析</h2><p>技术面分析是通过分析股票价格和交易量的历史数据来预测未来价格走势的方法。</p><p>常用技术指标包括：移动平均线、MACD、RSI、布林带等。</p><p>技术面分析适合短期交易者，帮助识别买卖时机。</p>",
                        completed: false
                    }
                ]
            },
            {
                id: 3,
                title: "投资组合管理",
                description: "学习如何构建和管理投资组合，实现资产的合理配置",
                level: "高级",
                duration: 5.5,
                price: 199,
                coverImage: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=investment%20portfolio%20management%20asset%20allocation&image_size=landscape_16_9",
                rating: 4.9,
                reviewCount: 67,
                lessons: [
                    {
                        id: 1,
                        title: "资产配置",
                        duration: 40,
                        type: "text",
                        content: "<h2>资产配置策略</h2><p>资产配置是根据投资者的风险承受能力和投资目标，将资金分配到不同资产类别中的过程。</p><p>常见的资产类别包括：股票、债券、现金、房地产、商品等。</p><p>合理的资产配置可以降低投资组合的整体风险，提高风险调整后的收益。</p>",
                        completed: false
                    },
                    {
                        id: 2,
                        title: "风险分散",
                        duration: 35,
                        type: "text",
                        content: "<h2>风险分散原理</h2><p>风险分散是通过投资于不同的资产来降低投资组合风险的策略。</p><p>关键原则：</p><ul><li>投资于不同行业的股票</li><li>投资于不同规模的公司</li><li>投资于不同国家和地区</li><li>投资于不同类型的资产</li></ul><p>风险分散可以在不降低预期收益的情况下降低投资组合的波动性。</p>",
                        completed: false
                    }
                ]
            },
            {
                id: 4,
                title: "技术分析进阶",
                description: "深入学习技术分析的高级技巧和策略",
                level: "高级",
                duration: 6.0,
                price: 299,
                coverImage: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=advanced%20technical%20analysis%20trading%20strategies&image_size=landscape_16_9",
                rating: 4.7,
                reviewCount: 45,
                lessons: [
                    {
                        id: 1,
                        title: "高级技术指标",
                        duration: 45,
                        type: "video",
                        content: "<h2>高级技术指标</h2><p>学习更复杂的技术指标，如Ichimoku云图、波浪理论、 Elliott Wave等。</p><p>这些指标可以帮助你更准确地识别市场趋势和反转点。</p>",
                        completed: false
                    },
                    {
                        id: 2,
                        title: "交易策略构建",
                        duration: 50,
                        type: "text",
                        content: "<h2>构建交易策略</h2><p>学习如何基于技术分析构建自己的交易策略，包括入场点、出场点、止损设置等。</p><p>一个好的交易策略应该包含：明确的信号、风险管理规则、资金管理计划。</p>",
                        completed: false
                    }
                ]
            },
            {
                id: 5,
                title: "基本面分析深度",
                description: "掌握财务报表分析和公司估值的核心方法",
                level: "高级",
                duration: 5.0,
                price: 249,
                coverImage: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fundamental%20analysis%20financial%20statements&image_size=landscape_16_9",
                rating: 4.8,
                reviewCount: 38,
                lessons: [
                    {
                        id: 1,
                        title: "财务报表分析",
                        duration: 40,
                        type: "document",
                        content: "<h2>财务报表分析</h2><p>深入学习如何分析公司的资产负债表、利润表和现金流量表。</p><p>关键财务比率分析，如盈利能力、偿债能力、运营效率等。</p>",
                        completed: false
                    },
                    {
                        id: 2,
                        title: "公司估值方法",
                        duration: 45,
                        type: "video",
                        content: "<h2>公司估值方法</h2><p>学习DCF（贴现现金流）、相对估值、重置成本法等公司估值方法。</p><p>如何使用这些方法来评估股票的内在价值。</p>",
                        completed: false
                    }
                ]
            }
        ];
    }
    // 如果没有市场数据，添加示例市场数据
    if (!data.marketData || data.marketData.length === 0) {
        data.marketData = [
            {
                symbol: "AAPL",
                name: "苹果公司",
                price: 189.56,
                change: 1.23,
                changePercent: 0.65
            },
            {
                symbol: "MSFT",
                name: "微软公司",
                price: 412.34,
                change: -0.87,
                changePercent: -0.21
            },
            {
                symbol: "GOOGL",
                name: "谷歌",
                price: 174.56,
                change: 2.34,
                changePercent: 1.36
            },
            {
                symbol: "AMZN",
                name: "亚马逊",
                price: 178.45,
                change: 0.56,
                changePercent: 0.31
            },
            {
                symbol: "TSLA",
                name: "特斯拉",
                price: 215.67,
                change: -1.23,
                changePercent: -0.57
            }
        ];
    }
    // 保存初始化数据
    saveAllData(data);
    return data;
}


/***/ }),

/***/ 4035:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CL: () => (/* binding */ getPortfolioTotalValue),
/* harmony export */   Kw: () => (/* binding */ getPortfolioWithCurrentPrices),
/* harmony export */   Sq: () => (/* binding */ executeBuyOrder),
/* harmony export */   vc: () => (/* binding */ executeSellOrder)
/* harmony export */ });
/* harmony import */ var _storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8312);

// 交易系统工具类
// 执行买入交易
function executeBuyOrder(symbol, quantity, currentPrice) {
    const data = (0,_storage__WEBPACK_IMPORTED_MODULE_0__/* .getAllData */ .jl)();
    const totalCost = quantity * currentPrice;
    // 检查余额是否足够
    if (data.balance < totalCost) {
        return {
            success: false,
            message: "余额不足"
        };
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
            name: "",
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
        type: "buy",
        symbol: symbol,
        quantity: quantity,
        price: currentPrice,
        total: totalCost,
        date: new Date().toISOString()
    });
    (0,_storage__WEBPACK_IMPORTED_MODULE_0__/* .saveAllData */ .yZ)(data);
    return {
        success: true,
        message: "买入成功",
        data
    };
}
// 执行卖出交易
function executeSellOrder(symbol, quantity, currentPrice) {
    const data = (0,_storage__WEBPACK_IMPORTED_MODULE_0__/* .getAllData */ .jl)();
    // 检查是否有足够持仓
    if (!data.portfolio || !data.portfolio[symbol] || data.portfolio[symbol].quantity < quantity) {
        return {
            success: false,
            message: "持仓不足"
        };
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
        type: "sell",
        symbol: symbol,
        quantity: quantity,
        price: currentPrice,
        total: totalRevenue,
        date: new Date().toISOString()
    });
    (0,_storage__WEBPACK_IMPORTED_MODULE_0__/* .saveAllData */ .yZ)(data);
    return {
        success: true,
        message: "卖出成功",
        data
    };
}
// 获取投资组合详情
function getPortfolioWithCurrentPrices(marketData) {
    const data = (0,_storage__WEBPACK_IMPORTED_MODULE_0__/* .getAllData */ .jl)();
    const portfolio = data.portfolio || {};
    const portfolioList = Object.values(portfolio).map((holding)=>{
        const stock = marketData.find((s)=>s.symbol === holding.symbol);
        const currentPrice = stock ? stock.price : holding.averageCost;
        const currentValue = holding.quantity * currentPrice;
        const profit = currentValue - holding.totalCost;
        const profitPercent = holding.totalCost > 0 ? profit / holding.totalCost * 100 : 0;
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
function getPortfolioTotalValue(marketData) {
    const portfolio = getPortfolioWithCurrentPrices(marketData);
    return portfolio.reduce((sum, item)=>sum + item.currentValue, 0);
}


/***/ }),

/***/ 6764:
/***/ (() => {



/***/ })

};
;