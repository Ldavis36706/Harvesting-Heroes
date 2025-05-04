let harvestData = [];
const goal = 500;

document.getElementById("harvestForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const plantName = document.getElementById("plantName").value;
    const harvestDate = document.getElementById("harvestDate").value;
    const location = document.getElementById("location").value;
    const weight = document.getElementById("weight").value;

    const data = {
        plantName,
        harvestDate,
        location,
        weight: parseFloat(weight)
    };

    try {
        const response = await fetch("https://YOUR_API_GATEWAY_ENDPOINT/harvest", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            console.log("Data submitted successfully!");
            alert("Harvest entry added!");
            document.getElementById("harvestForm").reset();
        } else {
            console.error("Failed to submit data.");
            alert("Failed to submit data. Please try again.");
        }
    } catch (error) {
        console.error("Error submitting data:", error);
        alert("An error occurred. Please try again.");
    }
});


async function fetchTotalHarvest() {
    try {
        const response = await fetch("https://xev1gp9cab.execute-api.us-east-1.amazonaws.com/prod/GetTotalHarvestWeight");
        const data = await response.json();
        return data.TotalHarvestWeight || 0;
    } catch (error) {
        console.error("Error fetching total harvest:", error);
        return 0;
    }
}

async function updateTracker() {
    try {
        const totalWeight = await fetchTotalHarvest();
        document.getElementById("trackerMessage").innerText = `Total Produce Harvested: ${totalWeight} lbs`;

        const remainingWeight = Math.max(goal - totalWeight, 0);
        const ctx = document.getElementById("harvestChart").getContext("2d");

        new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: ["Harvested", "Remaining"],
                datasets: [{
                    data: [totalWeight, remainingWeight],
                    backgroundColor: ["#4CAF50", "#D3D3D3"]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: "bottom" }
                }
            }
        });
    } catch (error) {
        console.error("Error updating tracker:", error);
    }
}

function addHarvest() {
    const plantName = document.getElementById("plantName").value;
    const harvestDate = document.getElementById("harvestDate").value;
    const location = document.getElementById("location").value;
    const weight = parseFloat(document.getElementById("weight").value);

    if (!plantName || !harvestDate || !location || isNaN(weight)) {
        alert("Please fill out all fields correctly.");
        return;
    }

    const entry = { plantName, harvestDate, location, weight };
    harvestData.push(entry);

    const listItem = document.createElement("li");
    listItem.textContent = `${plantName} - ${weight} lbs on ${harvestDate} at ${location}`;
    document.getElementById("harvestList").appendChild(listItem);
}

async function submitAll() {
    if (!harvestData.length) {
        alert("No data to submit.");
        return;
    }

    try {
        const response = await fetch(https://1ysvae9t7h.execute-api.us-east-1.amazonaws.com/prod/harvestEntryHandler", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ entries: harvestData })
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
        }

        alert("Harvest data submitted successfully!");
        harvestData = [];
        document.getElementById("harvestList").innerHTML = "";
        updateTracker();
    } catch (error) {
        console.error("Submission error:", error);
        alert("Failed to submit data. Please try again.");
    }
}

window.onload = updateTracker;
