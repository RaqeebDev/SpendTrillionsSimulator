let balance = 1000000000000;
const balanceDisplay = document.querySelector(".leftmoney h2");
const receiptItems = document.querySelector(".items-list");
const receiptTotal = document.querySelector(".total");

let totalSpent = 0;
let receiptData = [];

function formatFullNumber(num) {
  return "$" + num.toLocaleString();
}

function animateBalance(oldBalance, newBalance, duration = 500) {
  const start = oldBalance;
  const end = newBalance;
  const diff = end - start;
  const startTime = performance.now();

  function step(currentTime) {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const value = Math.round(start + diff * progress);
    balanceDisplay.textContent = formatFullNumber(value);
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      balanceDisplay.textContent = formatFullNumber(end);
    }
  }

  requestAnimationFrame(step);
}

function updateBalance(newBalance) {
  animateBalance(balance, newBalance);
  balance = newBalance;
}

function showNotification(message, isSuccess) {
  const notification = document.createElement("div");
  notification.className = `notification ${isSuccess ? "success" : "error"}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = "1";
  }, 10);
  
  setTimeout(() => {
    notification.style.opacity = "0";
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

function updateReceipt(itemName, price, quantity, isBuy) {
  const transactionAmount = price * quantity;
  
  if (isBuy) {
    totalSpent += transactionAmount;
    
    const existingItem = receiptData.find(item => item.name === itemName);
    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.total += transactionAmount;
    } else {
      receiptData.push({
        name: itemName,
        quantity: quantity,
        total: transactionAmount
      });
    }
  } else {
    totalSpent -= transactionAmount;
    
    const existingItem = receiptData.find(item => item.name === itemName);
    if (existingItem) {
      existingItem.quantity -= quantity;
      existingItem.total -= transactionAmount;
      
      if (existingItem.quantity <= 0) {
        receiptData = receiptData.filter(item => item.name !== itemName);
      }
    }
  }
  
  renderReceipt();
}

function renderReceipt() {
  receiptItems.innerHTML = "";
  
  if (receiptData.length === 0) {
    receiptItems.innerHTML = "<div>No items purchased</div>";
    receiptTotal.textContent = "TOTAL: $0";
    return;
  }
  
  receiptData.forEach(item => {
    const itemElement = document.createElement("div");
    itemElement.innerHTML = `
      <span>${item.name} (${item.quantity})</span>
      <span>$${item.total.toLocaleString()}</span>
    `;
    receiptItems.appendChild(itemElement);
  });
  
  receiptTotal.textContent = `TOTAL: $${totalSpent.toLocaleString()}`;
}

document.querySelectorAll(".card").forEach((card) => {
  const priceText = card.querySelector(".price").textContent.replace(/[$,]/g, "");
  const price = parseFloat(priceText);
  const input = card.querySelector("input");
  const buyBtn = card.querySelector(".buy");
  const sellBtn = card.querySelector(".sell");
  const itemName = card.querySelector("h3").textContent;

  let owned = 0;
  input.value = owned;

  buyBtn.addEventListener("click", () => {
    let qty = parseInt(input.value);
    if (isNaN(qty) || qty < 0) qty = 0;

    const maxAffordable = Math.floor(balance / price);
    if (maxAffordable <= 0) {
      showNotification("Insufficient funds!", false);
      return;
    }

    qty = 1;
    const totalCost = price * qty;
    
    if (balance >= totalCost) {
      updateBalance(balance - totalCost);
      owned += qty;
      input.value = owned;
      updateReceipt(itemName, price, qty, true);
      showNotification(`Purchased ${qty} ${itemName}`, true);
    } else {
      showNotification("Insufficient funds!", false);
    }
  });

  sellBtn.addEventListener("click", () => {
    if (owned <= 0) {
      showNotification("You don't own any of this item!", false);
      return;
    }
    
    const qty = 1;
    updateBalance(balance + price * qty);
    owned -= qty;
    input.value = owned;
    updateReceipt(itemName, price, qty, false);
    showNotification(`Sold ${qty} ${itemName}`, true);
  });
});

balanceDisplay.textContent = formatFullNumber(balance);
renderReceipt();