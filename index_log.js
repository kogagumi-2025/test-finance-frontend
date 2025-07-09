let analysisData = {};

// 東証プライム主要銘柄のサンプルデータ（実際にはAPIから取得）
const tokyoStockExchangeStocks = [
  { code: "7203", name: "トヨタ自動車", sector: "輸送用機器" },
  { code: "6758", name: "ソニーグループ", sector: "電気機器" },
  { code: "9984", name: "ソフトバンクグループ", sector: "情報・通信業" },
  { code: "6861", name: "キーエンス", sector: "電気機器" },
  { code: "8306", name: "三菱UFJフィナンシャル・グループ", sector: "銀行業" },
  { code: "7974", name: "任天堂", sector: "その他製品" },
  { code: "6954", name: "ファナック", sector: "機械" },
  { code: "4519", name: "中外製薬", sector: "医薬品" },
  { code: "8035", name: "東京エレクトロン", sector: "電気機器" },
  { code: "9432", name: "日本電信電話", sector: "情報・通信業" },
  { code: "8058", name: "三菱商事", sector: "卸売業" },
  { code: "9433", name: "KDDI", sector: "情報・通信業" },
  { code: "4063", name: "信越化学工業", sector: "化学" },
  { code: "8031", name: "三井物産", sector: "卸売業" },
  { code: "6098", name: "リクルートホールディングス", sector: "サービス業" },
  { code: "4661", name: "オリエンタルランド", sector: "サービス業" },
  { code: "7182", name: "ゆうちょ銀行", sector: "銀行業" },
  {
    code: "8604",
    name: "野村ホールディングス",
    sector: "証券、商品先物取引業",
  },
  { code: "2914", name: "日本たばこ産業", sector: "食料品" },
  { code: "4502", name: "武田薬品工業", sector: "医薬品" },
  { code: "6273", name: "SMC", sector: "機械" },
  { code: "6367", name: "ダイキン工業", sector: "機械" },
  { code: "7267", name: "ホンダ", sector: "輸送用機器" },
  { code: "4578", name: "大塚ホールディングス", sector: "医薬品" },
  { code: "8316", name: "三井住友フィナンシャルグループ", sector: "銀行業" },
  { code: "4543", name: "テルモ", sector: "精密機器" },
  { code: "7201", name: "日産自動車", sector: "輸送用機器" },
  { code: "3382", name: "セブン&アイ・ホールディングス", sector: "小売業" },
  { code: "8001", name: "伊藤忠商事", sector: "卸売業" },
  { code: "6178", name: "日本郵政", sector: "サービス業" },
];

// 株価データ生成（実際のAPIの代替）
// Generates simulated stock data (replaces actual API calls)
function generateStockData(stock) {
  const basePrice = Math.random() * 8000 + 1000;
  const volatility = basePrice * (0.01 + Math.random() * 0.03);

  // Previous day's closing price
  const previousClose = basePrice + (Math.random() - 0.5) * volatility;

  // Current price
  const currentPrice = previousClose + (Math.random() - 0.5) * volatility * 0.8;

  // Generate 30 days of historical data
  const historicalData = [];
  let price = previousClose;

  for (let i = 30; i >= 0; i--) {
    const change = (Math.random() - 0.5) * volatility * 0.6;
    price = Math.max(100, price + change);
    historicalData.push({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
      price: price,
      volume: Math.floor(Math.random() * 2000000) + 100000,
    });
  }

  return {
    code: stock.code,
    name: stock.name,
    sector: stock.sector,
    currentPrice: currentPrice,
    previousClose: previousClose,
    historicalData: historicalData,
  };
}

// AI投資分析アルゴリズム
// AI investment analysis algorithm
function analyzeStock(stockData) {
  const { historicalData, currentPrice, previousClose } = stockData;

  if (historicalData.length < 10) return null;

  // Technical analysis indicators
  const prices = historicalData.map((d) => d.price);
  const volumes = historicalData.map((d) => d.volume);

  // Moving Averages
  const sma5 = calculateSMA(prices.slice(-5));
  const sma10 = calculateSMA(prices.slice(-10));
  const sma20 = calculateSMA(prices.slice(-20));

  // RSI (Relative Strength Index)
  const rsi = calculateRSI(prices);

  // MACD
  const macd = calculateMACD(prices);

  // Volatility
  const volatility = calculateVolatility(prices);

  // Volume analysis
  const avgVolume = volumes.reduce((a, b) => a + b, 0) / volumes.length;
  const volumeRatio = volumes[volumes.length - 1] / avgVolume;

  // Predicted price calculation
  const trendScore = (sma5 - sma20) / sma20;
  const momentumScore = (currentPrice - sma10) / sma10;
  const volumeScore = Math.min(volumeRatio - 1, 1);

  const predictedPriceChange =
    (trendScore * 0.4 + momentumScore * 0.3 + volumeScore * 0.3) *
    currentPrice *
    0.1;
  const predictedPrice = currentPrice + predictedPriceChange;

  // Investment recommendation calculation
  let score = 0;
  let recommendation = "HOLD";

  // Trend analysis
  if (sma5 > sma10 && sma10 > sma20) score += 30;
  if (currentPrice > sma5) score += 20;

  // RSI analysis
  if (rsi < 30) score += 25; // Oversold
  if (rsi > 70) score -= 25; // Overbought

  // MACD analysis
  if (macd.signal > 0) score += 15;

  // Volume analysis
  if (volumeRatio > 1.5) score += 10;

  // Volatility adjustment
  if (volatility < 0.02) score += 5; // Low volatility is stable

  // Recommendation decision
  if (score >= 60) recommendation = "BUY";
  else if (score <= 20) recommendation = "SELL";

  // Calculate predicted profit margin for sorting
  const predictedProfitMargin =
    ((predictedPrice - currentPrice) / currentPrice) * 100;

  return {
    ...stockData,
    predictedPrice: predictedPrice,
    changePercent: ((currentPrice - previousClose) / previousClose) * 100,
    recommendation: recommendation,
    score: score,
    predictedProfitMargin: predictedProfitMargin, // Add predicted profit margin
    technicals: {
      rsi: rsi,
      sma5: sma5,
      sma10: sma10,
      sma20: sma20,
      volatility: volatility,
      volumeRatio: volumeRatio,
    },
  };
}

// テクニカル指標計算関数
// Technical indicator calculation functions
function calculateSMA(prices) {
  return prices.reduce((a, b) => a + b, 0) / prices.length;
}

function calculateRSI(prices, period = 14) {
  if (prices.length < period + 1) return 50;

  let gains = 0,
    losses = 0;

  for (let i = 1; i <= period; i++) {
    const change = prices[prices.length - i] - prices[prices.length - i - 1];
    if (change > 0) gains += change;
    else losses -= change;
  }

  const avgGain = gains / period;
  const avgLoss = losses / period;

  if (avgLoss === 0) return 100;

  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

function calculateMACD(prices) {
  const ema12 = calculateEMA(prices, 12);
  const ema26 = calculateEMA(prices, 26);
  const macdLine = ema12 - ema26;

  // Signal line (9-period EMA of MACD line) - simplified here
  // For a full MACD, you'd calculate EMA of macdLine
  const signalLine = macdLine > 0 ? 1 : -1;

  return {
    line: macdLine,
    signal: signalLine,
  };
}

function calculateEMA(prices, period) {
  if (prices.length < period) return prices[prices.length - 1];

  const multiplier = 2 / (period + 1);
  let ema = prices[0];

  for (let i = 1; i < prices.length; i++) {
    ema = prices[i] * multiplier + ema * (1 - multiplier);
  }

  return ema;
}

function calculateVolatility(prices) {
  if (prices.length < 2) return 0;

  const returns = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  }

  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance =
    returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;

  return Math.sqrt(variance);
}

async function analyzeAllStocks() {
  showLoading();
  performanceMonitor.start();

  try {
    // In a real implementation, this would involve an API call to a backend
    // that fetches data from yfinance for all TSE Prime stocks.
    // const response = await fetch('/api/stocks/tsx-prime');
    // const stocks = await response.json();

    // Using sample data for demonstration
    const allAnalysis = [];

    // Analyze stocks sequentially (in a real app, consider batching or web workers)
    for (let stock of tokyoStockExchangeStocks) {
      try {
        const stockData = generateStockData(stock);
        const analysis = analyzeStock(stockData);
        if (analysis) {
          allAnalysis.push(analysis);
        }
      } catch (error) {
        console.error(`Error analyzing stock ${stock.code}:`, error);
        continue;
      }

      // Add a small delay for progress visualization
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    if (allAnalysis.length === 0) {
      throw new Error("No stocks could be analyzed."); // No stocks could be analyzed
    }

    // Sort all analysis by score initially for overall recommendations.
    // Specific sections will be sorted by profit margin.
    allAnalysis.sort((a, b) => b.score - a.score);

    analysisData = {
      total: allAnalysis.length,
      recommendations: allAnalysis, // All analyzed stocks
      stats: calculateStats(allAnalysis),
    };

    displayResults();
    performanceMonitor.end("Full analysis");
  } catch (error) {
    console.error("Analysis error:", error);
    showError("分析中にエラーが発生しました: " + error.message); // An error occurred during analysis
  }
}

function calculateStats(analysis) {
  const buy = analysis.filter((a) => a.recommendation === "BUY").length;
  const hold = analysis.filter((a) => a.recommendation === "HOLD").length;
  const sell = analysis.filter((a) => a.recommendation === "SELL").length;

  const avgGain =
    analysis.reduce((sum, a) => sum + a.changePercent, 0) / analysis.length;

  return { buy, hold, sell, avgGain };
}

// Helper function to populate a table
function populateTable(tbodyId, stocks) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return; // Ensure tbody exists
  tbody.innerHTML = ""; // Clear existing rows

  stocks.forEach((stock) => {
    const row = document.createElement("tr");
    row.innerHTML = `
                    <td>
                        <div class="company-name">${stock.name}</div>
                        <div class="stock-code">${stock.code}</div>
                    </td>
                    <td class="price ${
                      stock.changePercent > 0 ? "price-up" : "price-down"
                    }">
                        ¥${stock.currentPrice.toLocaleString("ja-JP", {
                          maximumFractionDigits: 0,
                        })}
                    </td>
                    <td class="price">
                        ¥${stock.previousClose.toLocaleString("ja-JP", {
                          maximumFractionDigits: 0,
                        })}
                    </td>
                    <td class="price ${
                      stock.predictedPrice > stock.currentPrice
                        ? "price-up"
                        : "price-down"
                    }">
                        ¥${stock.predictedPrice.toLocaleString("ja-JP", {
                          maximumFractionDigits: 0,
                        })}
                    </td>
                    <td class="price ${
                      stock.changePercent > 0 ? "price-up" : "price-down"
                    }">
                        ${
                          stock.changePercent > 0 ? "+" : ""
                        }${stock.changePercent.toFixed(2)}%
                    </td>
                    <td>
                        <span class="recommendation ${stock.recommendation.toLowerCase()}">${
      stock.recommendation
    }</span>
                    </td>
                `;
    tbody.appendChild(row);
  });
}

function displayResults() {
  const { total, recommendations, stats } = analysisData;

  // Display statistics
  document.getElementById("totalStocks").textContent = total;
  document.getElementById("buyRecommendations").textContent = stats.buy;
  document.getElementById("holdRecommendations").textContent = stats.hold;
  document.getElementById("sellRecommendations").textContent = stats.sell;
  document.getElementById("averageGain").textContent = `${stats.avgGain.toFixed(
    2
  )}%`;
  document.getElementById("averageGain").className = `value ${
    stats.avgGain > 0 ? "price-up" : "price-down"
  }`;

  // Filter and sort BUY recommendations
  let buyRecommendations = recommendations.filter(
    (r) => r.recommendation === "BUY"
  );
  buyRecommendations.sort(
    (a, b) => b.predictedProfitMargin - a.predictedProfitMargin
  );

  // Populate "Top 3 Recommended Stocks"
  const top3Recommendations = buyRecommendations.slice(0, 3);
  populateTable("top3StockTableBody", top3Recommendations);

  // Populate "Other Recommended Stocks"
  const otherBuyRecommendations = buyRecommendations.slice(3, 15); // Show next 12 or fewer
  populateTable("otherRecommendedStockTableBody", otherBuyRecommendations);

  // Populate "All Stocks List"
  // Sort all stocks by company name for the full list
  const allStocksSortedByName = [...recommendations].sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  populateTable("allStockTableBody", allStocksSortedByName);

  showResults();
}

async function refreshData() {
  await analyzeAllStocks();
}

function showLoading() {
  document.getElementById("loading").style.display = "block";
  document.getElementById("error").style.display = "none";
  document.getElementById("results").style.display = "none";
  document.getElementById("analyzeAllBtn").disabled = true;
  document.getElementById("refreshBtn").disabled = true;
}

function showResults() {
  document.getElementById("loading").style.display = "none";
  document.getElementById("error").style.display = "none";
  document.getElementById("results").style.display = "block";
  document.getElementById("analyzeAllBtn").disabled = false;
  document.getElementById("refreshBtn").disabled = false;
}

function showError(message) {
  document.getElementById("loading").style.display = "none";
  document.getElementById("error").style.display = "block";
  document.getElementById("error").textContent = message;
  document.getElementById("results").style.display = "none";
  document.getElementById("analyzeAllBtn").disabled = false;
  document.getElementById("refreshBtn").disabled = false;
}

// 自動更新機能（5分ごと）
// Auto-refresh function (every 5 minutes)
setInterval(() => {
  if (analysisData.total > 0) {
    refreshData();
  }
}, 5 * 60 * 1000);

// 初期化
// Initialization
document.addEventListener("DOMContentLoaded", function () {
  console.log("東証プライム全銘柄分析システムが初期化されました"); // TSE Prime All Stock Analysis System initialized

  // ページ読み込み時に自動で分析開始
  // Start analysis automatically on page load
  setTimeout(() => {
    analyzeAllStocks();
  }, 1000);
});

// リアルタイム更新のシミュレーション
// Real-time update simulation
function simulateRealTimeUpdates() {
  if (
    !analysisData.recommendations ||
    analysisData.recommendations.length === 0
  ) {
    return;
  }

  try {
    // Randomly update prices and re-analyze each stock
    analysisData.recommendations.forEach((stock) => {
      const volatility = stock.currentPrice * 0.005;
      const change = (Math.random() - 0.5) * volatility;
      stock.currentPrice = Math.max(100, stock.currentPrice + change);
      stock.changePercent =
        ((stock.currentPrice - stock.previousClose) / stock.previousClose) *
        100;

      const reAnalyzedStock = analyzeStock(stock);
      if (reAnalyzedStock) {
        Object.assign(stock, reAnalyzedStock); // Update stock data with new analysis
      }
    });

    // Re-calculate stats and re-display all tables
    analysisData.stats = calculateStats(analysisData.recommendations);
    displayResults(); // This will re-sort and populate all three tables
  } catch (error) {
    console.error("Error in simulateRealTimeUpdates:", error);
  }
}

// 30秒ごとにリアルタイム更新
// Real-time update every 30 seconds
setInterval(simulateRealTimeUpdates, 30000);

// パフォーマンス監視
// Performance monitoring
const performanceMonitor = {
  startTime: null,

  start() {
    this.startTime = performance.now();
  },

  end(operation) {
    if (this.startTime) {
      const duration = performance.now() - this.startTime;
      console.log(`${operation} completed in ${duration.toFixed(2)}ms`);
      this.startTime = null;
    }
  },
};

// エラーハンドリング強化
// Enhanced error handling
window.addEventListener("error", function (event) {
  console.error("Global error:", event.error);
  if (
    document.getElementById("loading") &&
    document.getElementById("loading").style.display === "block"
  ) {
    showError("システムエラーが発生しました。ページを更新してください。"); // A system error occurred. Please refresh the page.
  }
});

// ネットワーク状態監視
// Network status monitoring
window.addEventListener("online", function () {
  console.log("ネットワーク接続が復旧しました"); // Network connection restored
  if (!analysisData.total || analysisData.total === 0) {
    analyzeAllStocks();
  }
});

window.addEventListener("offline", function () {
  console.log("ネットワーク接続が切断されました"); // Network connection disconnected
});
