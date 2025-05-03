      // Harvest Tracker Script
let harvestData = [];
let totalWeight = 0;

const chartElement = document.getElementById("harvestChart");
const trackerMessage = document.getElementById("trackerMessage");
const harvestList = document.getElementById("harvestList");

let chart = new Chart(chartElement, {
    type: 'doughnut',
    data: {
        labels: ['Harvested', 'Remaining'],
        datasets: [{
            data: [0, 500],
            backgroundColor: ['#4CAF50', '#e0e0e0']
        }]
    },
    options: {
        responsive: true,
        cutout: '70%',
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `${context.label}: ${context.raw} lbs`;
                    }
                }
            }
        }
    }
});

function updateTracker() {
    let harvested = harvestData.reduce((sum, item) => sum + item.weight, 0);
    let remaining = Math.max(500 - harvested, 0);

    chart.data.datasets[0].data = [harvested, remaining];
    chart.update();

    trackerMessage.textContent = `Total Harvested: ${harvested.toFixed(1)} lbs out of 500 lbs goal.`;
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
    harvestList.appendChild(listItem);

    updateTracker();
}

async function submitAll() {
    if (harvestData.length === 0) {
        alert("No data to submit.");
        return;
    }

    try {
        const response = await fetch("https://xev1gp9cab.execute-api.us-east-1.amazonaws.com/prod/SubmitHarvest", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ items: harvestData })
        });

        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }

        const result = await response.json();
        console.log("Submission result:", result);

        alert("Harvest data submitted successfully!");
        harvestData = [];
        harvestList.innerHTML = '';
        updateTracker();
    } catch (error) {
        console.error("Error submitting harvest data:", error);
        alert("Failed to submit harvest data. Please try again.");
    }
}


// Lightbox Script
function openLightbox(src) {
    document.getElementById("lightbox-img").src = src;
    document.getElementById("lightbox").classList.add("show");
}

function closeLightbox() {
    document.getElementById("lightbox").classList.remove("show");
}
