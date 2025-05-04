let harvestData = [];

async function fetchHarvestData() {
    try {
        const response = await fetch("https://1ysvae9t7h.execute-api.us-east-1.amazonaws.com/prod/harvestEntryHandler");
        if (response.ok) {
            harvestData = await response.json();
            updateTracker();
        } else {
            console.error("Failed to fetch harvest data.");
        }
    } catch (error) {
        console.error("Error fetching harvest data:", error);
    }
}

async function submitHarvestForm(e) {
    e.preventDefault();

    const plantName = document.getElementById("plantName").value;
    const harvestDate = document.getElementById("harvestDate").value;
    const location = document.getElementById("location").value;
    const weight = parseFloat(document.getElementById("weight").value);

    const data = { plantName, harvestDate, location, weight };

    try {
        const response = await fetch("https://1ysvae9t7h.execute-api.us-east-1.amazonaws.com/prod/harvestEntryHandler", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert("Harvest entry added!");
            document.getElementById("harvestForm").reset();
            fetchHarvestData(); // refresh data after submission
        } else {
            alert("Failed to submit data.");
        }
    } catch (error) {
        alert("An error occurred. Please try again.");
        console.error(error);
    }
}

function updateTracker() {
    const harvested = harvestData.reduce((sum, item) => sum + item.weight, 0);
    const remaining = Math.max(500 - harvested, 0);

    chart.data.datasets[0].data = [harvested, remaining];
    chart.update();

    const trackerMessage = document.getElementById("trackerMessage");
    trackerMessage.textContent = `Total Harvested: ${harvested.toFixed(1)} lbs out of 500 lbs goal.`;
}

document.getElementById("harvestForm").addEventListener("submit", submitHarvestForm);
window.onload = fetchHarvestData;
