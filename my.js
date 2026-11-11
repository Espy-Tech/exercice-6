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
  var typePrices = { basic: 100, extended: 200, premium: 300 };
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
    var count = Number(quantity.value);
    var serviceType = getSelectedType();
    var basePrice = typePrices[serviceType];
    var extraPrice = 0;

    if (!Number.isInteger(count) || count < 1) {
      quantityError.hidden = false;
      quantity.setAttribute('aria-invalid', 'true');
      priceOutput.textContent = 'Введите корректное количество.';
      return;
    }

    quantityError.hidden = true;
    quantity.removeAttribute('aria-invalid');
    if (serviceType === 'extended') {
      extraPrice = Number(option.value) || 0;
    } else if (serviceType === 'premium' && property.checked) {
      extraPrice = Number(property.value) || 0;
    }

    priceOutput.textContent = 'Итого: ' + rubles.format(count * (basePrice + extraPrice));
  }

  form.addEventListener('change', function () {
    updateVisibility();
    updatePrice();
  });
  quantity.addEventListener('input', updatePrice);

  updateVisibility();
  updatePrice();
});
