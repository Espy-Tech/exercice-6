document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var form = document.getElementById('service-form');
  var quantity = document.getElementById('quantity');
  var quantityError = document.getElementById('quantity-error');
  var optionGroup = document.getElementById('option-group');
  var option = document.getElementById('option');
  var propertyGroup = document.getElementById('property-group');
  var property = document.getElementById('property');
  var priceOutput = document.getElementById('price');
  var typePrices = Object.freeze({ basic: 100, extended: 200, premium: 300 });
  var optionPrices = Object.freeze({ '0': 0, '50': 50, '100': 100 });
  var rubles = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 });

  function getSelectedType() {
    var selected = form.querySelector('input[name="serviceType"]:checked');
    return selected ? selected.value : 'basic';
  }

  function updateVisibility() {
    var serviceType = getSelectedType();
    optionGroup.hidden = serviceType !== 'extended';
    propertyGroup.hidden = serviceType !== 'premium';

    if (serviceType !== 'extended') {
      option.value = '0';
    }
    if (serviceType !== 'premium') {
      property.checked = false;
    }
  }

  function updatePrice() {
    var countText = quantity.value;
    var count = Number(countText);
    var serviceType = getSelectedType();
    if (!/^[1-9][0-9]{0,5}$/.test(countText) || !Number.isSafeInteger(count) || count < 1) {
      quantityError.hidden = false;
      quantity.setAttribute('aria-invalid', 'true');
      priceOutput.textContent = 'Введите целое количество от 1 до 999999.';
      return;
    }
    if (!Object.prototype.hasOwnProperty.call(typePrices, serviceType)) {
      quantityError.hidden = true;
      quantity.removeAttribute('aria-invalid');
      priceOutput.textContent = 'Выберите допустимый тип услуги.';
      return;
    }

    var basePrice = typePrices[serviceType];
    var extraPrice = 0;

    quantityError.hidden = true;
    quantity.removeAttribute('aria-invalid');
    if (serviceType === 'extended') {
      if (!Object.prototype.hasOwnProperty.call(optionPrices, option.value)) {
        priceOutput.textContent = 'Выберите допустимую опцию услуги.';
        return;
      }
      extraPrice = optionPrices[option.value];
    } else if (serviceType === 'premium' && property.checked) {
      if (property.value !== '75') {
        priceOutput.textContent = 'Выбрана недопустимая дополнительная услуга.';
        return;
      }
      extraPrice = 75;
    }

    var total = count * (basePrice + extraPrice);
    if (!Number.isSafeInteger(total)) {
      priceOutput.textContent = 'Введите меньшее количество.';
      return;
    }
    priceOutput.textContent = 'Итого: ' + rubles.format(total);
  }

  form.addEventListener('change', function () {
    updateVisibility();
    updatePrice();
  });
  quantity.addEventListener('input', function () {
    var original = quantity.value;
    var position = quantity.selectionStart;
    var cleaned = original.replace(/[^0-9]/g, '').slice(0, 6);
    if (cleaned !== original) {
      quantity.value = cleaned;
      var cleanBeforeCursor = original.slice(0, position).replace(/[^0-9]/g, '').slice(0, 6);
      quantity.setSelectionRange(cleanBeforeCursor.length, cleanBeforeCursor.length);
    }
    updatePrice();
  });

  updateVisibility();
  updatePrice();
});
