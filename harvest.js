let harvestEntries = [];

// Called when the "Add Harvest" button is clicked
function addHarvest() {
    const plantType = document.getElementById("plantType").value.trim();
    const date = document.getElementById("harvestDate").value;
    const quantity = document.getElementById("quantity").value.trim();

    if (!plantType || !date || !quantity) {
        alert("Please fill in all fields.");
        return;
    }

    const entry = {
        plantType,
        date,
        quantity: parseInt(quantity)
    };

    harvestEntries.push(entry);
    updateTracker();

    // Optionally clear inputs after adding
    document.getElementById("plantType").value = "";
    document.getElementById("harvestDate").value = "";
    document.getElementById("quantity").value = "";
}

// Updates the visual list of harvest entries
function updateTracker() {
    const list = document.getElementById("harvestList");
    list.innerHTML = "";

    harvestEntries.forEach((entry, index) => {
        const li = document.createElement("li");
        li.textContent = `#${index + 1} - ${entry.plantType} | ${entry.date} | Qty: ${entry.quantity}`;
        list.appendChild(li);
    });
}

// Sends all entries to the backend API
function submitAll() {
    if (harvestEntries.length === 0) {
        alert("No harvests to submit.");
        return;
    }

    fetch("https://1ysvae9t7h.execute-api.us-east-1.amazonaws.com/prod/harvestEntryHandler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ harvests: harvestEntries })
    })
    .then(response => response.json())
    .then(data => {
        alert("✅ Submission Successful!");
        harvestEntries = [];
        document.getElementById("harvestList").innerHTML = "";
        updateTracker();
    })
    .catch(error => {
        console.error("❌ Error submitting data:", error);
        alert("❌ Submission failed. Please try again.");
    });
}

