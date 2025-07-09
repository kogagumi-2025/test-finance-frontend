// index.js (Public Repo)

let analysisData = {};

// Fetch data.json from public repo
fetch("data.json")
  .then((response) => response.json())
  .then((data) => {
    analysisData = data;
    displayResults();
  })
  .catch((err) => {
    showError("データの取得に失敗しました: " + err.message);
  });

function populateTable(tbodyId, stocks) {
  const tbody = document.getElementById(tbodyId);
  tbody.innerHTML = "";

  stocks.forEach((stock) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>
        <div class="company-name">${stock.name}</div>
        <div class="stock-code">${stock.code}</div>
      </td>
      <td class="price ${stock.changePercent > 0 ? "price-up" : "price-down"}">
        ¥${stock.currentPrice.toLocaleString("ja-JP")}
      </td>
      <td class="price">
        ¥${stock.previousClose.toLocaleString("ja-JP")}
      </td>
      <td class="price ${
        stock.predictedPrice > stock.currentPrice ? "price-up" : "price-down"
      }">
        ¥${stock.predictedPrice.toLocaleString("ja-JP")}
      </td>
      <td class="price ${stock.changePercent > 0 ? "price-up" : "price-down"}">
        ${stock.changePercent.toFixed(2)}%
      </td>
      <td><span class="recommendation ${stock.recommendation.toLowerCase()}">${
      stock.recommendation
    }</span></td>
    `;
    tbody.appendChild(row);
  });
}

function displayResults() {
  const { total, recommendations, stats } = analysisData;

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

  const buyRecommendations = recommendations
    .filter((r) => r.recommendation === "BUY")
    .sort((a, b) => b.predictedProfitMargin - a.predictedProfitMargin);

  populateTable("top3StockTableBody", buyRecommendations.slice(0, 3));
  populateTable(
    "otherRecommendedStockTableBody",
    buyRecommendations.slice(3, 15)
  );
  populateTable(
    "allStockTableBody",
    [...recommendations].sort((a, b) => a.name.localeCompare(b.name))
  );

  document.getElementById("results").style.display = "block";
}

function showError(msg) {
  document.getElementById("error").style.display = "block";
  document.getElementById("error").textContent = msg;
}
