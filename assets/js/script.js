let localCurrency = document.querySelector(".form-control");
let conversionOption = document.querySelector(".custom-select");
let result = document.querySelector(".result");
let button = document.querySelector(".btn");
const arr = [];

const getCurrencyInfo = async () => {
  try {
    const res = await fetch("https://mindicador.cl/api/");
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const filterCurrencyInfo = async () => {
  try {
    const data = await getCurrencyInfo();
    for (const currency in data) {
      arr.push(data[currency]);
    }
    filterArr = arr.filter(
      (x) => x.codigo != undefined && x.unidad_media != "Porcentaje"
    );
    return filterArr;
  } catch (error) {
    console.log(error);
  }
};

const template = (currency) => {
  return `<option value=${currency.valor}>${currency.codigo}</option>`;
};

const currencyRender = async () => {
  try {
    let filter = await filterCurrencyInfo();
    let html = "";
    filter.forEach((x) => {
      html += template(x);
    });
    conversionOption.innerHTML = html;
  } catch (error) {
    console.log(error);
  }
};

const currencyConversion = () => {
  let currency = conversionOption.value;
  let localC = localCurrency.value;
  let total = localC / currency;
  let clp = new Intl.NumberFormat("es-CL", {
    currency: "CLP",
    style: "currency",
  }).format(total);
  result.innerHTML = `${currency.codigo} ${clp}`;
};

currencyRender();
button.addEventListener("click", currencyConversion);
