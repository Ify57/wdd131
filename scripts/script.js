// Product Array
const products = [
    { id: "eco-cup", name: "Eco-Friendly Cup" },
    { id: "solar-charger", name: "Solar Phone Charger" },
    { id: "recycled-backpack", name: "Recycled Fabric Backpack" },
    { id: "bamboo-utensils", name: "Bamboo Travel Utensils" }
];

// Populate select field
document.addEventListener("DOMContentLoaded", () => {
    const select = document.getElementById("productName");

    products.forEach(product => {
        const option = document.createElement("option");
        option.value = product.id;
        option.textContent = product.name;
        select.appendChild(option);
    });
});
