 let moneyLeft = 1000000000000;
      const moneyDisplay = document.querySelector(".leftmoney h2");
      const receiptItems = document.querySelector(".items-list");
      const receiptTotal = document.querySelector(".total");

      function formatMoney(amount) {
        return "$" + amount.toLocaleString();
      }

      function updateMoneyDisplay(oldAmount, newAmount) {
        const change = newAmount - oldAmount;
        const steps = 20;
        const stepTime = 20;

        let currentStep = 0;
        const timer = setInterval(() => {
          currentStep++;
          const currentAmount = oldAmount + (change * currentStep) / steps;
          moneyDisplay.textContent = formatMoney(Math.round(currentAmount));

          if (currentStep >= steps) {
            clearInterval(timer);
            moneyDisplay.textContent = formatMoney(newAmount);
          }
        }, stepTime);
      }

      function refreshReceipt() {
        receiptItems.innerHTML = "";
        let overallTotal = 0;

        document.querySelectorAll(".card").forEach((itemCard) => {
          const itemName = itemCard.querySelector("h3").textContent;
          const itemPriceText = itemCard
            .querySelector(".price")
            .textContent.replace(/[$,]/g, "");
          const itemPrice = parseFloat(itemPriceText);
          const itemQuantity =
            parseInt(itemCard.querySelector("input").value) || 0;

          if (itemQuantity > 0) {
            const itemTotal = itemPrice * itemQuantity;
            overallTotal += itemTotal;

            const receiptLine = document.createElement("div");
            receiptLine.textContent = `${itemName} x${itemQuantity} ${formatMoney(
              itemTotal
            )}`;
            receiptItems.appendChild(receiptLine);
          }
        });

        receiptTotal.textContent = `TOTAL: ${formatMoney(overallTotal)}`;
      }

      document.querySelectorAll(".card").forEach((itemCard) => {
        const itemPriceText = itemCard
          .querySelector(".price")
          .textContent.replace(/[$,]/g, "");
        const itemPrice = parseFloat(itemPriceText);
        const quantityInput = itemCard.querySelector("input");
        const buyButton = itemCard.querySelector(".buy");
        const sellButton = itemCard.querySelector(".sell");

        let currentQuantity = 0;
        quantityInput.value = currentQuantity;

        buyButton.addEventListener("click", () => {
          const canAfford = Math.floor(moneyLeft / itemPrice);
          if (canAfford <= 0) return;

          currentQuantity += 1;
          quantityInput.value = currentQuantity;
          const oldMoney = moneyLeft;
          moneyLeft -= itemPrice;
          updateMoneyDisplay(oldMoney, moneyLeft);
          refreshReceipt();
        });

        sellButton.addEventListener("click", () => {
          if (currentQuantity <= 0) return;

          currentQuantity -= 1;
          quantityInput.value = currentQuantity;
          const oldMoney = moneyLeft;
          moneyLeft += itemPrice;
          updateMoneyDisplay(oldMoney, moneyLeft);
          refreshReceipt();
        });
      });

      moneyDisplay.textContent = formatMoney(moneyLeft);
      refreshReceipt();