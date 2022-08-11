const apiURL = "https://mindicador.cl/api/";
let localCurrency = document.querySelector(".form-control");
let conversionOption = document.querySelector(".custom-select");
let serverState = document.querySelector(".serverState");
let queryDate = document.querySelector(".queryDate");
let result = document.querySelector(".result");
let button = document.querySelector(".btn");
const cArray = [];
let myChart = null;
const ctx = document.getElementById("myChart");
let arrDateLabel = [];
let arrCurrencyValue = [];

const currentDate = () => {
  let cDate = new Date();
  let today =
    String(cDate.getDate()).padStart(2, "0") +
    "/" +
    String(cDate.getMonth() + 1).padStart(2, "0") +
    "/" +
    cDate.getFullYear();
  queryDate.innerHTML = `Fecha: ${today}`;
};

const getCurrencyInfo = async () => {
  try {
    currency = conversionOption.value;
    const res = await fetch(`${apiURL}${currency}`);
    if (res.status === 200) {
      const data = await res.json();
      console.log(data);
      serverState.innerHTML = "Conexión realizada con éxito!";
      currentDate(data.serie[0].fecha);
      currencyConversion(data.serie[0].valor);
      conversionArray(data.serie);
    } else {
      const data = await res.json();
      serverState.innerHTML = `${data.message}`;
    }
  } catch (error) {
    console.log(error);
    serverState.innerHTML = "Error en la conexión!";
  }
};

const filterCurrencyInfo = async () => {
  try {
    const res = await fetch(`${apiURL}`);
    const data = await res.json();
    for (const currency in data) {
      cArray.push(data[currency]);
    }
    filterArray = cArray.filter(
      (x) =>
        x.codigo != undefined &&
        x.codigo != "ivp" &&
        x.codigo != "dolar_intercambio" &&
        x.codigo != "ipc" &&
        x.codigo != "libra_cobre" &&
        x.unidad_medida != "Porcentaje"
    );
    return filterArray;
  } catch (error) {
    console.log(error);
  }
};

const template = (currency) => {
  return `<option value=${currency.codigo}>${currency.nombre}</option>`;
};

const currencySelectRender = async () => {
  try {
    let filter = await filterCurrencyInfo();
    let html = "";
    filter.forEach((i) => {
      html += template(i);
    });
    conversionOption.innerHTML = html;
  } catch (error) {
    console.log(error);
  }
};

const currencyConversion = (rateX) => {
  let currency = conversionOption.value;

  switch (currency) {
    case "dolar":
      currencyFormat = "US$";
      break;
    case "euro":
      currencyFormat = "€";
      break;
    case "uf":
      currencyFormat = "UF";
      break;
    case "utm":
      currencyFormat = "UTM";
      break;
    case "bitcoin":
      currencyFormat = "₿";
      break;
  }

  let conversionResult = Number((localCurrency.value / rateX).toFixed(2));
  console.log(conversionResult);
  result.innerHTML = `${conversionResult.toLocaleString(
    "de-DE"
  )} ${currencyFormat}`;
  localCurrency.value = "";
};

const conversionArray = (arrDate) => {
  let days = 10;
  let arrFilter = arrDate.slice(0, days);
  const order = arrFilter.reverse();
  arrDateLabel = order.map(
    (i) =>
      `${i.fecha.substring(8, 10)}-${i.fecha.substring(
        5,
        7
      )}-${i.fecha.substring(0, 4)}`
  );
  arrCurrencyValue = order.map((i) => i.valor);
  renderChart(arrDateLabel, arrCurrencyValue);
};

const renderChart = (arrLabel, arrValue) => {
  if (myChart != null) {
    myChart.destroy();
  }
  myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: arrLabel,
      datasets: [
        {
          label: `Valor del ${currency.toUpperCase()} en $CLP`,
          data: arrValue,
          backgroundColor: ["red"],
          borderColor: ["red"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      maintainAspectRatio: true,
      responsive: true,

      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: "#007BFF",
          },
        },
        x: {
          beginAtZero: true,
          grid: {
            color: "#007BFF",
          },
        },
      },
    },
  });
};

const validate = () => {
  if (localCurrency.value === "") {
    alert("Ingresa una cantidad de CLP a convertir!");
    return;
  }
  getCurrencyInfo();
};

currencySelectRender();
button.addEventListener("click", () => {
  validate("click");
});
