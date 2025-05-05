let harvestChart;

document.addEventListener("DOMContentLoaded", function () {
    const ctx = document.getElementById('harvestChart').getContext('2d');
    harvestChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Harvested', 'Remaining'],
            datasets: [{
                data: [0, 500], // Will be updated after fetch
                backgroundColor: ['#4CAF50', '#e0e0e0'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            cutout: '70%',
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom'
                }
            }
        }
    });

    // Fetch initial total weight from DynamoDB and update chart
    fetch('https://xev1gp9cab.execute-api.us-east-1.amazonaws.com/prod/GetTotalHarvestWeight')
        .then(response => response.json())
        .then(data => {
            let totalWeight = 0;
            if (Array.isArray(data)) {
                data.forEach(entry => {
                    if (entry.weight) {
                        totalWeight += Number(entry.weight);
                    }
                });
            }

            updateHarvestChart(totalWeight);
            document.getElementById('trackerMessage').innerText = `We have harvested ${totalWeight} lbs so far!`;
        })
        .catch(error => {
            console.error("Error fetching harvest data:", error);
            document.getElementById('trackerMessage').innerText = "Could not load harvest data.";
        });

    const form = document.getElementById('harvestForm');
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const plantName = document.getElementById('plantName').value;
        const harvestDate = document.getElementById('harvestDate').value;
        const location = document.getElementById('location').value;
        const weight = parseFloat(document.getElementById('weight').value);

        if (!plantName || !harvestDate || !location || isNaN(weight)) {
            alert("Please fill out all fields correctly.");
            return;
        }

        const harvestData = {
            plantName,
            harvestDate,
            location,
            weight
        };

        fetch('https://1ysvae9t7h.execute-api.us-east-1.amazonaws.com/prod/harvestEntryHandler', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(harvestData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to submit harvest data.");
            }
            return response.json();
        })
        .then(result => {
            updateHarvestChart(weight);
            alert("Harvest data submitted successfully!");
            form.reset();
        })
        .catch(error => {
            console.error("Error submitting harvest data:", error);
            alert("Error submitting data.");
        });
    });
});

function updateHarvestChart(addedWeight) {
    if (!harvestChart) return;
    
    const currentHarvested = harvestChart.data.datasets[0].data[0];
    const newTotal = currentHarvested + addedWeight;
    const remaining = Math.max(500 - newTotal, 0);

    harvestChart.data.datasets[0].data = [newTotal, remaining];
    harvestChart.update();
}
