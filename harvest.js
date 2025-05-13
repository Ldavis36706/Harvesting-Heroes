import { userManager } from "./main.js";

document.addEventListener("DOMContentLoaded", async function () {
    const form = document.getElementById("harvestForm");
    const formContainer = document.getElementById("formContainer"); // Make sure your HTML has this
    const message = document.getElementById("trackerMessage");
    const apiEndpoint = "https://xev1gp9cab.execute-api.us-east-1.amazonaws.com/prod/GetTotalHarvestWeight";
    const totalExpectedWeight = 500;
    let harvestChart;

    try {
        const user = await userManager.getUser();

        if (!user || user.expired) {
            // Redirect to sign-in if not authenticated
            await userManager.signinRedirect();
            return;
        }

        // Show form after successful sign-in
        formContainer.style.display = "block";

        const ctx = document.getElementById("harvestTracker").getContext("2d");

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
                    legend: { position: 'bottom' },
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

        function updateHarvestChart(weight) {
            const remaining = Math.max(totalExpectedWeight - weight, 0);
            harvestChart.data.datasets[0].data = [weight, remaining];
            harvestChart.update();
        }

        fetch(apiEndpoint)
            .then(response => response.json())
            .then(data => {
                const totalWeight = data.TotalHarvestWeight;
                updateHarvestChart(totalWeight);
                message.textContent = `Total Harvested: ${totalWeight} lbs`;
            })
            .catch(error => console.error("Error fetching total harvest weight:", error));

        form.addEventListener("submit", function (event) {
            event.preventDefault();
            const formData = new FormData(form);
            const entry = {
                date: formData.get("date"),
                crop: formData.get("crop"),
                weight: parseFloat(formData.get("weight"))
            };

            fetch('https://1ysvae9t7h.execute-api.us-east-1.amazonaws.com/prod/harvestEntryHandler', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(entry)
            })
                .then(response => {
                    if (!response.ok) throw new Error("Failed to save entry");
                    return response.json();
                })
                .then(() => {
                    alert("Entry saved successfully!");
                    form.reset();
                    return fetch(apiEndpoint);
                })
                .then(response => response.json())
                .then(data => {
                    const totalWeight = data.TotalHarvestWeight;
                    updateHarvestChart(totalWeight);
                    message.textContent = `Total Harvested: ${totalWeight} lbs`;
                })
                .catch(error => console.error("Error submitting entry or updating chart:", error));
        });

    } catch (authError) {
        console.error("Authentication error:", authError);
        await userManager.signinRedirect(); // Redirect if error occurs
    }
});
