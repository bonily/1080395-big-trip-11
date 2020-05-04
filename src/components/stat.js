/* eslint-disable no-new-object */
import AbstractComponent from "./abstractComponent.js";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {groupTripItemsByKey, capitalize} from "../utils/common.js";
import {EVENT_TYPES_ACTIVITY} from "../const.js";
import moment from "moment";

const KeyMap = {
  start: `startEventTime`,
  type: `eventType`,
};

const EventEmodsiMap = {
  taxi: `🚕`, 
  bus: `🚌`, 
  train: `🚂`, 
  ship: `🛳`, 
  transport: `🚊`,
  drive: `🚗`,
  flight: `✈`, 
  check: `🏨`,
  sightseeing: `🏛`,
  restaurant: `🍴`,
};


const convertDuratiomFormat = (ms) => {
  return moment.duration(ms, `milliseconds`).format(`DD[D] hh[H] mm[M]`);
};

const BAR_HEIGHT = 55;


const formatDataForChart = (itemsGroup, chartType) => {
  let copyItemsGroup = Object.assign({}, itemsGroup);
  let data = [];
  switch (chartType) {
    case `transport`:
      EVENT_TYPES_ACTIVITY.forEach((type) => delete copyItemsGroup[type]);
      for (let key in copyItemsGroup) {
        if (copyItemsGroup[key] !== undefined) {
          data.push([key, copyItemsGroup[key].length]);
        }
      }
      break;

    case `money`:
      for (let key in copyItemsGroup) {
        if (copyItemsGroup[key] !== undefined) {
          data.push([key, copyItemsGroup[key].reduce((acc, item) => {
            return acc + item.price;
          }, 0)]);
        }
      }
      break;

    case `time`:
      for (let key in copyItemsGroup) {

        if (copyItemsGroup[key] !== undefined) {
          data.push([key, copyItemsGroup[key].reduce((acc, item) => {
            const durationItem = item.endEventTime.getTime() - item.startEventTime.getTime();

            return acc + durationItem;

          }, 0)]);
        }
      }
      break;
  }
  return data.sort((a, b) => a[1] - b[1]);
};

const moneyChart = (moneyCtx, itemsGroup) => {
  const data = formatDataForChart(itemsGroup, `money`);
  const eventTypes = data.map((type) => {
    return EventEmodsiMap[type[0] === `check-in` ? `check` : [type[0]]] + ` ` + capitalize(type[0]);
  });
  const labels = data.map((type) => type[1]);


  moneyCtx.height = BAR_HEIGHT * eventTypes.length + 1;
  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: eventTypes,
      datasets: [{
        data: labels,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `€ ${val}`
}
      },
      title: {
        display: true,
        text: `MONEY`,
        fontColor: `#000000`,
        padding: 35,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};


const transportChart = (transportCtx, itemsGroup) => {
  const data = formatDataForChart(itemsGroup, `transport`);
  const eventTypes = data.map((type) => {
    return EventEmodsiMap[type[0] === `check-in` ? `check` : [type[0]]] + ` ` + capitalize(type[0]);
  });
  const labels = data.map((type) => type[1]);

  transportCtx.height = BAR_HEIGHT * eventTypes.length + 1;
  return new Chart(transportCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: eventTypes,
      datasets: [{
        data: labels,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${val}x`
        }
      },
      title: {
        display: true,
        text: `TRANSPORT`,
        fontColor: `#000000`,
        padding: 35,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 15,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};


const timeSpendChart = (timeSpendCtx, itemsGroup) => {
  const data = formatDataForChart(itemsGroup, `time`);
  const eventTypes = data.map((type) => {
    return EventEmodsiMap[type[0] === `check-in` ? `check` : [type[0]]] + ` ` + capitalize(type[0]);
  });
  const labels = data.map((type) => type[1]);

  timeSpendCtx.height = BAR_HEIGHT * eventTypes.length + 1;

  return new Chart(timeSpendCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: eventTypes,
      datasets: [{
        data: labels,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${convertDuratiomFormat(val)}`
        }
      },
      title: {
        display: true,
        text: `TIME SPENT`,
        fontColor: `#000000`,
        padding: 35,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 15,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};



const createStatTemplate = () => {
  return (
    `<section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>

    <div class="statistics__item statistics__item--money">
      <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--transport">
      <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--time-spend">
      <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
    </div>
  </section>`
  );
};

export default class StatTemplate extends AbstractComponent {
  constructor(itemsModel) {
    super();
    this._itemsModel = itemsModel;

    this._moneyChart = null;
    this._transportChart = null;
    this._timeChart = null;

  }

  show() {
    super.show();

    this.rerender(this._itemsModel);
  }

  getTemplate() {
    return createStatTemplate();
  }

  rerender(itemsModel) {
    this._tasks = itemsModel;

    this._renderCharts();
  }


  _renderCharts() {
    const items = this._itemsModel.getItemsAll();
    const groupedItems = groupTripItemsByKey(items, KeyMap.type);

    const element = this.getElement();
    const moneyCtx = element.querySelector(`.statistics__chart--money`);
    const transportCtx = element.querySelector(`.statistics__chart--transport`);
    const timeSpendCtx = element.querySelector(`.statistics__chart--time`);

    this._resetCharts();

    this._moneyChart = moneyChart(moneyCtx, groupedItems);
    this._transportChart = transportChart(transportCtx, groupedItems);
    this._timeChart = timeSpendChart(timeSpendCtx, groupedItems);
    this._timeChart.generateLegend();
  //   for (const i in this._timeChart.data.labels) {
  //     if (this._timeChart.data.labels[i] !== undefined) {
  //      let lab = this._timeChart.data.labels[i];
  //      console.log(lab);
  //      lab = capitalize(lab);
  //    //   var $img = $("<img/>").attr("id", lab).attr("src", "https://www.free-country-flags.com/countries/"+lab+"/1/tiny/"+lab+".png");
  //    //   $("#pics").append($img);
  //     }
  //     }
  }

  _resetCharts() {
    if (this._moneyChart) {
      this._moneyChart.destroy();
      this._moneyChart = null;
    }

    if (this._transportChart) {
      this._transportChart.destroy();
      this._transportChart = null;
    }

    if (this._timeChart) {
      this._timeChart.destroy();
      this._timeChart = null;
    }
  }
}
