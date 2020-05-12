import AbstractComponent from "./abstract-component.js";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {EVENT_TYPES_ACTIVITY, KeyMap} from "../const.js";
import {groupTripItemsByKey, capitalize} from "../utils/common.js";
import moment from "moment";


const BAR_HEIGHT = 55;


const EventEmojiMap = {
  TAXI: `🚕`,
  BUS: `🚌`,
  TRAIN: `🚂`,
  SHIP: `🛳`,
  TRANSPORT: `🚊`,
  DRIVE: `🚗`,
  FLIGHT: `✈`,
  CHECK: `🏨`,
  SIGHTSEEING: `🏛`,
  RESTAURANT: `🍴`,
};


const ChartType = {
  MONEY: `money`,
  TRANSPORT: `transport`,
  TIME: `time`
};


const convertDurationFormat = (ms) => {
  return moment.duration(ms, `milliseconds`).format(`DD[D] hh[H] mm[M]`);
};


const formatDataForChart = (itemsGroup, chartType) => {
  const copyItemsGroup = Object.assign({}, itemsGroup);
  const itemsForChart = [];
  switch (chartType) {
    case ChartType.TRANSPORT:
      EVENT_TYPES_ACTIVITY.forEach((type) => delete copyItemsGroup[type]);
      for (const key in copyItemsGroup) {
        if (copyItemsGroup[key] !== undefined) {
          itemsForChart.push([key, copyItemsGroup[key].length]);
        }
      }
      break;

    case ChartType.MONEY:
      for (const key in copyItemsGroup) {
        if (copyItemsGroup[key] !== undefined) {
          itemsForChart.push([key, copyItemsGroup[key].reduce((acc, item) => {
            return acc + item.price;
          }, 0)]);
        }
      }
      break;

    case ChartType.TIME:
      for (const key in copyItemsGroup) {

        if (copyItemsGroup[key] !== undefined) {
          itemsForChart.push([key, copyItemsGroup[key].reduce((acc, item) => {
            const durationItem = item.endEventTime.getTime() - item.startEventTime.getTime();

            return acc + durationItem;

          }, 0)]);
        }
      }
      break;
  }
  return itemsForChart.sort((a, b) => a[1] - b[1]);
};

const moneyChart = (moneyCtx, itemsGroup) => {
  const events = formatDataForChart(itemsGroup, ChartType.MONEY);
  const eventLabels = events.map((type) => {
    const eventEmoji = EventEmojiMap[type[0] === `check-in` ? `CHECK` : [type[0].toUpperCase()]];
    return `${eventEmoji} ${capitalize(type[0])}`;
  });
  const eventCosts = events.map((type) => type[1]);

  moneyCtx.height = BAR_HEIGHT * eventLabels.length + 1;
  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: eventLabels,
      datasets: [{
        data: eventCosts,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`,
        barThickness: 44,
        minBarLength: 50
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
  const events = formatDataForChart(itemsGroup, ChartType.TRANSPORT);
  const eventLabels = events.map((type) => {
    const eventEmoji = EventEmojiMap[type[0] === `check-in` ? `CHECK` : [type[0].toUpperCase()]];
    return `${eventEmoji} ${capitalize(type[0])}`;
  });
  const eventCosts = events.map((type) => type[1]);

  transportCtx.height = BAR_HEIGHT * eventLabels.length + 1;
  return new Chart(transportCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: eventLabels,
      datasets: [{
        data: eventCosts,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`,
        barThickness: 44,
        minBarLength: 50
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
  const events = formatDataForChart(itemsGroup, ChartType.TIME);
  const eventLabels = events.map((type) => {
    const eventEmoji = EventEmojiMap[type[0] === `check-in` ? `CHECK` : [type[0].toUpperCase()]];
    return `${eventEmoji} ${capitalize(type[0])}`;
  });
  const eventCosts = events.map((type) => type[1]);

  timeSpendCtx.height = BAR_HEIGHT * eventLabels.length + 1;

  return new Chart(timeSpendCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: eventLabels,
      datasets: [{
        data: eventCosts,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`,
        barThickness: 44,
        minBarLength: 100
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
          formatter: (val) => `${convertDurationFormat(val)}`
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


export default class Statistics extends AbstractComponent {
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

  rerender() {
    this._renderCharts();
  }


  _renderCharts() {
    const items = this._itemsModel.getItemsAll();
    const groupedItems = groupTripItemsByKey(items, KeyMap.TYPE);

    const element = this.getElement();
    const moneyCtx = element.querySelector(`.statistics__chart--money`);
    const transportCtx = element.querySelector(`.statistics__chart--transport`);
    const timeSpendCtx = element.querySelector(`.statistics__chart--time`);

    this._resetCharts();

    this._moneyChart = moneyChart(moneyCtx, groupedItems);
    this._transportChart = transportChart(transportCtx, groupedItems);
    this._timeChart = timeSpendChart(timeSpendCtx, groupedItems);
    this._timeChart.generateLegend();
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
