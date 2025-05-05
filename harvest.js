let harvestChart;

window.onload = () => {
  const ctx = document.getElementById('harvestChart').getContext('2d');
  harvestChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Harvested', 'Remaining'],
      datasets: [{
        data: [0, 500], // Initially harvested is 0, remaining is 500
        backgroundColor: ['#4CAF50', '#e0e0e0'],
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
};

function updateChart(newHarvestWeight) {
  const currentHarvested = harvestChart.data.datasets[0].data[0];
  const harvested = currentHarvested + newHarvestWeight;
  const remaining = Math.max(500 - harvested, 0);
  harvestChart.data.datasets[0].data = [harvested, remaining];
  harvestChart.update();
}

async function saveToDynamoDB(entry) {
  try {
    const response = await fetch('https://your-api-url.amazonaws.com/prod/submitHarvest', {
      method: 'POST',
      body: JSON.stringify(entry),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Saved to DynamoDB:", result);
      updateChart(entry.weight);
    } else {
      console.error("Failed to save to DynamoDB:", response.statusText);
    }
  } catch (error) {
    console.error("Error saving to DynamoDB:", error);
  }
}

document.getElementById("harvestForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const entry = {
    plantName: document.getElementById("plantName").value,
    harvestDate: document.getElementById("harvestDate").value,
    location: document.getElementById("location").value,
    weight: parseFloat(document.getElementById("weight").value)
  };

  await saveToDynamoDB(entry);

  document.getElementById("harvestForm").reset();
});
