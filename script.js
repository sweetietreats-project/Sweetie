let orders = JSON.parse(localStorage.getItem('orders')) || [];
let dailyEarnings = JSON.parse(localStorage.getItem('dailyEarnings')) || {
    date: new Date().toLocaleDateString(),
    total: 0
};

document.getElementById('submitOrder').addEventListener('click', function() {
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let phone = document.getElementById('phone').value;

    let hardCandyQty = parseInt(document.getElementById('hardCandyQty').value) || 0;
    let chewyCandyQty = parseInt(document.getElementById('chewyCandyQty').value) || 0;
    let spongeCakeQty = parseInt(document.getElementById('spongeCakeQty').value) || 0;

    let hardCandyPrice = 1000 / 2;
    let chewyCandyPrice = 1000;
    let spongeCakePrice = 10000;

    let total = (hardCandyQty * hardCandyPrice) + (chewyCandyQty * chewyCandyPrice) + (spongeCakeQty * spongeCakePrice);

    let hardCandyFlavor = document.getElementById('hardCandyFlavor').value;
    let chewyCandyFlavor = document.getElementById('chewyCandyFlavor').value;

    let orderDetails = `
        Order Details:
        Hard Candy (${hardCandyFlavor}): ${hardCandyQty} pcs x ${hardCandyPrice} VND/pc
        Chewy Candy (${chewyCandyFlavor}): ${chewyCandyQty} pcs x ${chewyCandyPrice} VND/pc
        Sponge Cake: ${spongeCakeQty} pcs x ${spongeCakePrice} VND/pc
    `;

    document.getElementById('summaryName').textContent = `Name: ${name}`;
    document.getElementById('summaryEmail').textContent = `Email: ${email}`;
    document.getElementById('summaryPhone').textContent = `Phone: ${phone}`;
    document.getElementById('summaryOrderDetails').textContent = orderDetails;
    document.getElementById('summaryTotal').textContent = `Total: ${total} VND`;
    document.getElementById('orderSummary').style.display = 'block';

    orders.push({
        name: name,
        email: email,
        phone: phone,
        hardCandyQty: hardCandyQty,
        chewyCandyQty: chewyCandyQty,
        spongeCakeQty: spongeCakeQty,
        hardCandyFlavor: hardCandyFlavor,
        chewyCandyFlavor: chewyCandyFlavor,
        total: total,
        date: new Date().toLocaleDateString()
    });

    localStorage.setItem('orders', JSON.stringify(orders));
    updateDailyEarnings(total);
});

function displayOrders() {
    let orderList = document.getElementById('orderList');
    orderList.innerHTML = '';

    orders.forEach(order => {
        let orderDiv = document.createElement('div');
        orderDiv.innerHTML = `
            <p><strong>Date:</strong> ${order.date}</p>
            <p><strong>Name:</strong> ${order.name}</p>
            <p><strong>Email:</strong> ${order.email}</p>
            <p><strong>Phone:</strong> ${order.phone}</p>
            <p><strong>Hard Candy (${order.hardCandyFlavor}):</strong> ${order.hardCandyQty}</p>
            <p><strong>Chewy Candy (${order.chewyCandyFlavor}):</strong> ${order.chewyCandyQty}</p>
            <p><strong>Sponge Cake:</strong> ${order.spongeCakeQty}</p>
            <p><strong>Total:</strong> ${order.total} VND</p>
            <hr>
        `;
        orderList.appendChild(orderDiv);
    });
}

function updateDailyEarnings(total) {
    let today = new Date().toLocaleDateString();
    if (dailyEarnings.date === today) {
        dailyEarnings.total += total;
    } else {
        dailyEarnings = { date: today, total: total };
    }
    localStorage.setItem('dailyEarnings', JSON.stringify(dailyEarnings));
    document.getElementById('dailyEarnings').textContent = `Total Earnings Today: ${dailyEarnings.total} VND`;
}

function updateAdminView() {
    displayOrders();
    document.getElementById('dailyEarnings').textContent = `Total Earnings Today: ${dailyEarnings.total} VND`;
}

document.getElementById('adminView').addEventListener('click', function() {
    let password = prompt("Enter password:");
    if (password === "Sweetie, you are so pretty!") {
        updateAdminView();
        document.getElementById('adminSection').style.display = 'block';
    } else {
        alert("Incorrect password.");
    }
});

document.getElementById('calculateEarnings').addEventListener('click', function() {
    updateDailyEarnings(0);
});

// Update admin view every 5 seconds
setInterval(updateAdminView, 5000);

// Reset daily earnings at midnight
function resetDailyEarningsAtMidnight() {
    let now = new Date();
    let midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
    let timeUntilMidnight = midnight.getTime() - now.getTime();

    setTimeout(function() {
        dailyEarnings = { date: new Date().toLocaleDateString(), total: 0 };
        localStorage.setItem('dailyEarnings', JSON.stringify(dailyEarnings));
        updateAdminView();
        resetDailyEarningsAtMidnight(); // Set up the next reset
    }, timeUntilMidnight);
}

resetDailyEarningsAtMidnight(); // Start the midnight reset process

updateAdminView(); // Initial update of the admin view