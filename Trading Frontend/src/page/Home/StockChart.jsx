import { Zap } from 'lucide-react'
import ReactApexChart from 'react-apexcharts'
import { Button } from '@/components/ui/button'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMarketChart } from '../../State/Coin/Action'

const timesSeries = [
  { label: "1 Day", value: 1 },
  { label: "1 Week", value: 7 },
  { label: "1 Month", value: 30 },
  { label: "1 Year", value: 365 }
]

function StockChart({ coinId }) {
  const dispatch = useDispatch()
  const { coin } = useSelector((store) => store)

  const [activeValue, setActiveValue] = React.useState(1)

  const series = [
    {
      data: coin?.marketChart?.data || [] // prevent undefined error
    }
  ]

  const options = {
    chart: {
      id: 'area-datetime',
      type: 'area',
      height: 280,
      zoom: { enabled: true },
      toolbar: { show: false },
      animations: { enabled: true, easing: 'easeinout', speed: 800 },
      background: 'transparent'
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: 'smooth',
      width: 3,
      colors: ['#FFA500']
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        gradientToColors: ['#FFD700'],
        shadeIntensity: 1,
        type: 'vertical',
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 90, 100]
      }
    },
    xaxis: {
      type: 'datetime',
      labels: { style: { colors: '#6B7280', fontSize: '12px' } },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: {
        style: { colors: '#6B7280', fontSize: '12px' },
        formatter: (val) => `$${val.toLocaleString()}`
      }
    },
    grid: {
      borderColor: '#F3F4F6',
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } }
    },
    tooltip: { theme: 'dark', x: { format: 'dd MMM yyyy' } },
    markers: {
      size: 0,
      colors: ['#FFA500'],
      strokeColors: '#fff',
      strokeWidth: 2
    }
  }

  useEffect(() => {
    dispatch(fetchMarketChart({ coinId, days: activeValue, jwt: localStorage.getItem("jwt") }))
  }, [dispatch, activeValue, coinId])

  return (
    <div id="chart-timelines" className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
            Price Chart
          </h2>
         
        </div>
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl border-orange-300 dark:border-orange-600"
        >
          <Zap className="h-4 w-4 mr-2 text-orange-500" />
          Live
        </Button>
      </div>

      {/* Timeframe Buttons */}
      <div className="flex space-x-2 bg-orange-100/50 dark:bg-orange-900/20 p-1.5 rounded-xl">
        {timesSeries.map((item) => (
          <Button
            key={item.value}
            variant={activeValue === item.value ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveValue(item.value)}
            className={`flex-1 rounded-lg text-xs font-medium transition-all duration-200 transform hover:scale-105 ${
              activeValue === item.value
                ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-md"
                : "text-orange-600 dark:text-orange-400 hover:bg-orange-200/50 dark:hover:bg-orange-800/30"
            }`}
          >
            {item.label}
          </Button>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-gradient-to-b from-orange-50/30 to-transparent dark:from-orange-900/10 rounded-xl">
        <ReactApexChart
          options={options}
          series={series}
          type="area"
          height={400}
        />
      </div>
    </div>
  )
}

export default StockChart
