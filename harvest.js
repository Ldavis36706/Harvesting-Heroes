// Plant names to populate the dropdown
const plantNames = [
    "Cantaloupe", "Crookneck Squash", "Greek Pepperoncini Pepper", "Sunflower Mammoth Grey",
    "Echinacea", "Sunflower Lemon Queen", "Straightneck Squash", "Okra Baby Bubba Hybrid",
    "Cucumber Muncher variety", "Cucumber Picklebush variety", "Basil",
    "Tomato Chadwick Cherry", "Sunflower Autumn Beauty", "Bellpepper", "Sweet Pea Oregon Sugar Pod", "Tomato Brandywine",
    "Tomato Brandywine Pink", "Green Bean", "Zuchini", "Hollyhock Flowers", "Watermelon Sugar Baby",
    "Watermelon Crimson Sweet", "Watermelon Jubilee", "Nasturtium", "Spinach", "Cabbage", "Collards", "Broccoli",
    "Carolina Reaper Pepper", "Habanero Pepper", "Cauliflower", "Potatoes", "Strawberry", "Asparagus",
    "Blackberries", "Pumpkin", "Sugar Cane", "Thyme", "Basil", "Rosemary", "Sweet Potatoe", "Turnips",
    "Beets", "Scallion", "Onion Vidala", "Onion Red", "Rose", "Daffoldil",
];

// Populate dropdown on page load
window.onload = () => {
    const plantSelect = document.getElementById("plantName");
    plantNames.forEach(name => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        plantSelect.appendChild(option);
    });
    updateChart();
};

// Global array to store harvest entries
let harvestData = [];

// Function to add one entry
function addHarvest() {
    const plantName = document.getElementById("plantName").value;
    const harvestDate = document.getElementById("harvestDate").value;
    const location = document.getElementById("location").value;
    const weight = parseFloat(document.getElementById("weight").value);

    if (!plantName || !harvestDate || !location || isNaN(weight)) {
        alert("Please fill out all fields correctly.");
        return;
    }

    harvestData.push({ plantName, harvestDate, location, weight });
    updateChart();
    document.getElementById("trackerMessage").textContent = `${getTotalWeight()} lbs harvested so far!`;

    // Clear form
    document.getElementById("plantName").value = "";
    document.getElementById("harvestDate").value = "";
    document.getElementById("location").value = "";
    document.getElementById("weight").value = "";
}

// Optional: Submit all function (stub)
function submitAll() {
    alert("Submitting all harvest data...");
    console.log(harvestData);
}

// Helper to calculate total weight
function getTotalWeight() {
    return harvestData.reduce((total, entry) => total + entry.weight, 0).toFixed(1);
}

// Initialize and update Chart.js doughnut chart
let chart;

function updateChart() {
    const ctx = document.getElementById("harvestChart").getContext("2d");
    const totalWeight = parseFloat(getTotalWeight());
    const goal = 500;
    const remaining = Math.max(0, goal - totalWeight);

    const data = {
        labels: ["Harvested", "Remaining"],
        datasets: [{
            label: 'Harvest Progress',
            data: [totalWeight, remaining],
            backgroundColor: ["#4caf50", "#cfd8dc"]
        }]
    };

    if (chart) {
        chart.data = data;
        chart.update();
    } else {
        chart = new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}
