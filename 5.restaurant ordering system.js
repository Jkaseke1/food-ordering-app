'use strict';

// Initialize orders array
let orders = [];

// Fetch meal data from the MealDB API
function fetchMealData(meal) {
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${meal}`;

    fetch(url)
        .then(response => response.json())
        .then(data => displayMealData(data.meals))
        .catch(error => {
            console.log(error);
            const errorContainer = document.getElementById('meal-container');
            errorContainer.innerHTML = '';
            const errorMessage = document.createElement('p');
            errorMessage.textContent = 'An error occurred while fetching meals. Please try again later.';
            errorContainer.appendChild(errorMessage);
        });
}

// Display meal data in the meal container
function displayMealData(meals) {
    const mealContainer = document.getElementById('meal-container');
    mealContainer.innerHTML = '';

    if (meals) {
        meals.forEach(meal => {
            const mealCard = document.createElement('div');
            mealCard.classList.add('meal-card');

            const mealName = document.createElement('h3');
            mealName.textContent = meal.strMeal;

            const mealImage = document.createElement('img');
            mealImage.src = meal.strMealThumb;
            mealImage.alt = meal.strMeal;

            const addToOrderBtn = document.createElement('button');
            addToOrderBtn.textContent = 'Add to Order';
            addToOrderBtn.addEventListener('click', () => addToOrder(meal));

            mealCard.appendChild(mealName);
            mealCard.appendChild(mealImage);
            mealCard.appendChild(addToOrderBtn);

            mealContainer.appendChild(mealCard);
        });
    } else {
        const noResultsMessage = document.createElement('p');
        noResultsMessage.textContent = 'No meals found. Please try again.';
        mealContainer.appendChild(noResultsMessage);
    }
}

// Add a meal to the order
function addToOrder(meal) {
    orders.push(meal);
    updateOrderList();
}

// Remove a meal from the order
function removeOrderItem(index) {
    orders.splice(index, 1);
    updateOrderList();
}

// Update the order list
function updateOrderList() {
    const orderContainer = document.getElementById('order-container');
    orderContainer.innerHTML = '';

    if (orders.length === 0) {
        const noOrdersMessage = document.createElement('p');
        noOrdersMessage.textContent = 'No items in the order.';
        orderContainer.appendChild(noOrdersMessage);
    } else {
        orders.forEach((meal, index) => {
            const orderItem = document.createElement('div');
            orderItem.classList.add('order-item');

            const orderName = document.createElement('p');
            orderName.textContent = meal.strMeal;

            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.addEventListener('click', () => removeOrderItem(index));

            orderItem.appendChild(orderName);
            orderItem.appendChild(removeBtn);

            orderContainer.appendChild(orderItem);
        });
    }
}

// Complete the order
function completeOrder() {
    orders = [];
    updateOrderList();
    alert('Order completed!');
}

// Handle form submission
document.getElementById('meal-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const mealInput = document.getElementById('meal-input');
    const meal = mealInput.value.trim();
    fetchMealData(meal);
    mealInput.value = '';
});

// Handle complete order button click
document.getElementById('complete-order-btn').addEventListener('click', completeOrder);

// Save orders to local storage
function saveOrders() {
    localStorage.setItem('orders', JSON.stringify(orders));
}

// Load orders from local storage
function loadOrders() {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
        orders = JSON.parse(savedOrders);
        updateOrderList();
    }
}

// Load orders on page load
window.addEventListener('DOMContentLoaded', loadOrders);