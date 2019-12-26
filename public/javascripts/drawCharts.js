$(function() {
  Highcharts.setOptions({
    lang: {
      // months: [],
      weekdays: ['週一', '週二', '週三', '週四', '週五', '週六', '週日']
    }
  })

  const shopId = document.getElementById('shopId').value
  var start = moment().subtract(29, 'days')
  var end = moment()

  let dailyRevenueLineChart = {
    title: {
      text: '過去30日營業額'
    },
    xAxis: {
      type: 'datetime',
      // dateTimeLabelFormats: {
      //   day: '%m/%e',
      // }
      labels: {
        format: '{value: %m/%e}'
        // align: 'right',
        // rotation: -30
      }
    },
    yAxis: {
      title: {
        text: '新台幣 (元)'
      }
    },
    legend: {
      enabled: false
      //   layout: 'vertical',
      //   align: 'right',
      //   verticalAlign: 'middle'
    },
    tooltip: {
      valuePrefix: 'NT$',
      valueSuffix: ' 元'
    },
    plotOptions: {
      series: {
        label: {
          connectorAllowed: false
        },
        pointStart: Date.UTC(2019, 8, 24),
        pointInterval: 24 * 3600 * 1000 // one day
      }
    },
    series: [{
      name: ''
    }],
    responsive: {
      rules: [{
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom'
          }
        }
      }]
    }
  }

  function cbDailyRevenue(start, end, label) {
    let param = ''

    $('#reportrange span').html(
      start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY')
    )

    switch (label) {
      case '今日':
        param = 'dailyRevenueToday'
        break
      case '昨日':
        param = 'dailyRevenueYesterday'
        break
      case '過去7日':
        param = 'dailyRevenueLastSevenDays'
        break
      case '過去30日':
        param = 'dailyRevenueLastThirtyDays'
        break
      case '本月':
        param = 'dailyRevenueThisMonth'
        break
      case '上個月':
        param = 'dailyRevenueLastMonth'
        break
      default:
        param = 'dailyRevenueCustomRange'
    }

    const url =
      'http://127.0.0.1:3000/api/dashboard/' +
      shopId +
      '/' +
      param +
      '?start=' +
      start.format('YYYY-MM-DD') +
      '&end=' +
      end.format('YYYY-MM-DD')

    $.getJSON(url, function(data) {
      dailyRevenueLineChart.title = data.title
      dailyRevenueLineChart.plotOptions.series.pointStart =
        data.plotOptions.series.pointStart
      dailyRevenueLineChart.series[0].data = data.series[0].data
      Highcharts.chart('container', dailyRevenueLineChart)
    })
  }

  $('#reportrange').daterangepicker(
    {
      startDate: start,
      endDate: end,
      ranges: {
        今日: [moment(), moment()],
        昨日: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        過去7日: [moment().subtract(6, 'days'), moment()],
        過去30日: [moment().subtract(29, 'days'), moment()],
        本月: [moment().startOf('month'), moment().endOf('month')],
        上個月: [
          moment()
            .subtract(1, 'month')
            .startOf('month'),
          moment()
            .subtract(1, 'month')
            .endOf('month')
        ]
      }
    },
    cbDailyRevenue
  )

  let bestSellersColumnChart = {
    chart: {
      type: 'column'
    },
    title: {
      text: ''
    },
    xAxis: {
      type: 'category',
      labels: {
        rotation: -45,
        style: {
          fontSize: '12px',
          fontFamily: 'Verdana, sans-serif'
        }
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: '個數 (個)'
      }
    },
    legend: {
      enabled: false
    },
    tooltip: {
      pointFormat: '銷出: <b>{point.y} 個</b>'
    },
    series: [{
      name: '',
      data: [
        // ['itemA', 24],
        // ['itemB', 20],
        // ['itemC', 14],
      ],
      dataLabels: {
        enabled: true,
        rotation: -90,
        color: '#FFFFFF',
        align: 'right',
        format: '{point.y}',
        y: 10, // 10 pixels down from the top
        style: {
          fontSize: '12px',
          fontFamily: 'Verdana, sans-serif'
        }
      }
    }]
  }

  function cbBestSellers(start, end, label) {
    let param = ''

    $('#reportrange2 span').html(
      start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY')
    )

    switch (label) {
      case '今日':
        param = 'bestSellersToday'
        break
      case '昨日':
        param = 'bestSellersYesterday'
        break
      case '過去7日':
        param = 'bestSellersLastSevenDays'
        break
      case '過去30日':
        param = 'bestSellersLastThirtyDays'
        break
      case '本月':
        param = 'bestSellersThisMonth'
        break
      case '上個月':
        param = 'bestSellersLastMonth'
        break
      default:
        param = 'bestSellersCustomRange'
    }

    const url =
      'http://127.0.0.1:3000/api/dashboard/' +
      shopId +
      '/' +
      param +
      '?start=' +
      start.format('YYYY-MM-DD') +
      '&end=' +
      end.format('YYYY-MM-DD')

    $.getJSON(url, function(data) {
      bestSellersColumnChart.title = data.title
      bestSellersColumnChart.series[0].data = data.series[0].data
      Highcharts.chart('container2', bestSellersColumnChart)
    })
  }

  $('#reportrange2').daterangepicker(
    {
      startDate: start,
      endDate: end,
      ranges: {
        今日: [moment(), moment()],
        昨日: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        過去7日: [moment().subtract(6, 'days'), moment()],
        過去30日: [moment().subtract(29, 'days'), moment()],
        本月: [moment().startOf('month'), moment().endOf('month')],
        上個月: [
          moment()
            .subtract(1, 'month')
            .startOf('month'),
          moment()
            .subtract(1, 'month')
            .endOf('month')
        ]
      }
    },
    cbBestSellers
  )

  let mostMentionedColumnChart = {
    chart: {
      type: 'column'
    },
    title: {
      text: ''
    },
    xAxis: {
      type: 'category',
      labels: {
        rotation: -45,
        style: {
          fontSize: '12px',
          fontFamily: 'Verdana, sans-serif'
        }
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: '出現於交易紀錄中比例 (%)'
      }
    },
    legend: {
      enabled: false
    },
    tooltip: {
      pointFormat: '出現於 <b>{point.y:.1f} %</b> 之交易紀錄中'
    },
    series: [{
      name: '',
      data: [
        // ['itemA', 24.2],
        // ['itemB', 20.8],
        // ['itemC', 14.9],
      ],
      dataLabels: {
        enabled: true,
        rotation: -90,
        color: '#FFFFFF',
        align: 'right',
        format: '{point.y:.1f}',
        y: 10, // 10 pixels down from the top
        style: {
          fontSize: '12px',
          fontFamily: 'Verdana, sans-serif'
        }
      }
    }]
  }

  function cbMostMentioned(start, end, label) {
    let param = ''

    $('#reportrange3 span').html(
      start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY')
    )

    switch (label) {
      case '今日':
        param = 'mostMentionedToday'
        break
      case '昨日':
        param = 'mostMentionedYesterday'
        break
      case '過去7日':
        param = 'mostMentionedLastSevenDays'
        break
      case '過去30日':
        param = 'mostMentionedLastThirtyDays'
        break
      case '本月':
        param = 'mostMentionedThisMonth'
        break
      case '上個月':
        param = 'mostMentionedLastMonth'
        break
      default:
        param = 'mostMentionedCustomRange'
    }

    const url =
      'http://127.0.0.1:3000/api/dashboard/' +
      shopId +
      '/' +
      param +
      '?start=' +
      start.format('YYYY-MM-DD') +
      '&end=' +
      end.format('YYYY-MM-DD')

    $.getJSON(url, function(data) {
      mostMentionedColumnChart.title = data.title
      mostMentionedColumnChart.series[0].data = data.series[0].data
      Highcharts.chart('container3', mostMentionedColumnChart)
    })
  }

  $('#reportrange3').daterangepicker(
    {
      startDate: start,
      endDate: end,
      ranges: {
        今日: [moment(), moment()],
        昨日: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        過去7日: [moment().subtract(6, 'days'), moment()],
        過去30日: [moment().subtract(29, 'days'), moment()],
        本月: [moment().startOf('month'), moment().endOf('month')],
        上個月: [
          moment()
            .subtract(1, 'month')
            .startOf('month'),
          moment()
            .subtract(1, 'month')
            .endOf('month')
        ]
      }
    },
    cbMostMentioned
  )

  const daysToExpPackedBubble = {
    chart: {
      type: 'packedbubble',
      height: '100%'
    },
    title: {
      text: '所有商品新鮮狀態'
    },
    tooltip: {
      useHTML: true,
      pointFormat: '<b>{point.name}:</b> {point.value}天'
    },
    plotOptions: {
      packedbubble: {
        minSize: '90%',
        maxSize: '20%',
        zMin: 0,
        zMax: 500,
        layoutAlgorithm: {
          splitSeries: false,
          gravitationalConstant: 0.02
        },
        dataLabels: {
          enabled: true,
          format: '{point.name}',
          filter: {
            property: 'y',
            operator: '>',
            value: 250
          },
          style: {
            color: 'black',
            textOutline: 'none',
            fontWeight: 'normal'
          }
        }
      }
    },
    series: []
  }

  function cbDaysToExp(start, end, label) {
    let param = 'daysToExp'

    // $('#reportrange4 span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'))

    const url =
      'http://127.0.0.1:3000/api/dashboard/' +
      shopId +
      '/' +
      param +
      '?start=' +
      start.format('YYYY-MM-DD') +
      '&end=' +
      end.format('YYYY-MM-DD')

    $.getJSON(url, function(data) {
      daysToExpPackedBubble.series = data
      Highcharts.chart('container4', daysToExpPackedBubble)
    })
  }

  let holdingTimeDumbbell = {
    chart: {
      type: 'dumbbell',
      inverted: true
    },
    legend: {
      enabled: false
    },
    subtitle: {
      text: '最短 vs 平均 vs 最長'
    },
    title: {
      text: ''
    },
    tooltip: {
      shared: true,
      // formatter: function () {
      //   return 'The value for <b>' + this.x + '</b> is <b>' + this.y.low + '</b>';
      // }
    },
    xAxis: {
      type: 'category'
    },
    yAxis: {
      title: {
        text: '架上停留時間（小時）'
      }
    },
    series: [{
      name: '停留',
      data: [],
      tooltip: {}
    }, {
      type: 'scatter',
      name: '點',
      data: [],
      tooltip: {
        pointFormat: '{point.name}<br><b>{point.y}</b>',
      }
    }]
  }

  function cbMaxAvgMinHoldingTime(start, end, label) {
    let param = ''

    $('#reportrange5 span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'))

    switch (label) {
      case '今日':
        param = 'HoldingTimeToday'
        break
      case '昨日':
        param = 'HoldingTimeYesterday'
        break
      case '過去7日':
        param = 'HoldingTimeLastSevenDays'
        break
      case '過去30日':
        param = 'HoldingTimeLastThirtyDays'
        break
      case '本月':
        param = 'HoldingTimeThisMonth'
        break
      case '上個月':
        param = 'HoldingTimeLastMonth'
        break
      default:
        param = 'HoldingTimeCustomRange'
    }

    const url =
      'http://127.0.0.1:3000/api/dashboard/' +
      shopId +
      '/' +
      param +
      '?start=' +
      start.format('YYYY-MM-DD') +
      '&end=' +
      end.format('YYYY-MM-DD')

    $.getJSON(url, function(data) {
      console.log(data)
      holdingTimeDumbbell.title = data.title
      holdingTimeDumbbell.series[0].data = data.series[0].data
      holdingTimeDumbbell.series[1].data = data.series[1].data
      Highcharts.chart('container5', holdingTimeDumbbell)
    })
  }

  $('#reportrange5').daterangepicker({
    startDate: start,
    endDate: end,
    ranges: {
      今日: [moment(), moment()],
      昨日: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
      過去7日: [moment().subtract(6, 'days'), moment()],
      過去30日: [moment().subtract(29, 'days'), moment()],
      本月: [moment().startOf('month'), moment().endOf('month')],
      上個月: [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
    }},
    cbMaxAvgMinHoldingTime
  )

  cbDailyRevenue(start, end, '過去30日')
  cbBestSellers(start, end, '過去30日')
  cbMostMentioned(start, end, '過去30日')
  cbDaysToExp(start, end, '')
  cbMaxAvgMinHoldingTime(start, end, '過去30日')
})
