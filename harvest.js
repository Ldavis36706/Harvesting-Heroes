document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("harvestForm");
    const apiEndpoint = "https://your-api-endpoint.amazonaws.com/Prod/harvest"; // Replace with your actual endpoint
    const totalExpectedWeight = 500; // Adjust based on your total expected harvest
    let harvestChart;

    const ctx = document.getElementById("harvestTracker").getContext("2d");

    // Initialize the chart with 0 harvested weight
    harvestChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Harvested', 'Remaining'],
            datasets: [{
                data: [0, totalExpectedWeight],
                backgroundColor: ['#4caf50', '#e0e0e0'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `${context.label}: ${context.parsed} lbs`;
                        }
                    }
                }
            }
        }
    });

    // Function to update chart with current total
    function updateHarvestChart(weight) {
        if (harvestChart) {
            const remaining = Math.max(totalExpectedWeight - weight, 0);
            harvestChart.data.datasets[0].data = [weight, remaining];
            harvestChart.update();
        }
    }

    // Fetch and update chart on page load
    fetch(apiEndpoint)
        .then(response => response.json())
        .then(data => {
            const totalWeight = data.TotalHarvestWeight;
            updateHarvestChart(totalWeight);
            document.getElementById("trackerMessage").textContent = `Total Harvested: ${totalWeight} lbs`;
        })
        .catch(error => {
            console.error("Error fetching total harvest weight:", error);
        });

    // Handle form submission
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(form);
        const entry = {
            date: formData.get("date"),
            crop: formData.get("crop"),
            weight: parseFloat(formData.get("weight"))
        };

        fetch(apiEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(entry)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to save entry");
            }
            return response.json();
        })
        .then(data => {
            alert("Entry saved successfully!");
            form.reset();

            // Refetch total after new entry
            return fetch(apiEndpoint);
        })
        .then(response => response.json())
        .then(data => {
            const totalWeight = data.TotalHarvestWeight;
            updateHarvestChart(totalWeight);
            document.getElementById("trackerMessage").textContent = `Total Harvested: ${totalWeight} lbs`;
        })
        .catch(error => {
            console.error("Error submitting entry or updating chart:", error);
        });
    });
});
