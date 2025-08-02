import { getLessVar } from '@/utils';

export const lineBar = () => {
  return {
    backgroundColor: getLessVar('--color-bg-container'),
    grid: {
      left: '3%',
      right: '5%',
      bottom: '10%',
      top: '30%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: ['AI大模型', '量子计算', '云原生', '区块链', '边缘计算', 'Web3.0', '隐私计算'],
      axisLine: {
        lineStyle: {
          color: getLessVar('--color-border-secondary'),
          width: 1,
        },
      },
      axisLabel: {
        color: getLessVar('--color-text'),
        fontSize: 12,
        fontWeight: 'bold',
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      name: '技术指数',
      nameTextStyle: {
        color: getLessVar('--color-text-secondary'),
        fontSize: 12,
        padding: [0, 0, 10, -10],
      },
      splitLine: {
        lineStyle: {
          color: getLessVar('--color-border-secondary'),
          type: 'dashed',
        },
      },
      axisLabel: {
        color: getLessVar('--color-text-secondary'),
      },
    },
    series: [
      {
        name: '2025',
        type: 'bar',
        data: [94, 82, 87, 76, 89, 71, 85],
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#00E5FF' },
              { offset: 1, color: '#0958d9' },
            ],
          },
          borderRadius: [11, 3],
        },
        label: {
          show: true,
          position: 'top',
          color: '#0D8BBD',
          fontWeight: 'bold',
        },
      },
      {
        name: '趋势线',
        type: 'line',
        data: [94, 82, 87, 76, 89, 71, 85],
        symbol: 'circle',
        symbolSize: 10,
        lineStyle: {
          width: 4,
          color: '#FF6B6B',
          shadowBlur: 15,
          shadowColor: '#FF6B6B',
        },
        itemStyle: {
          color: '#fff',
          borderWidth: 2,
          borderColor: '#FF6B6B',
        },
      },
    ],
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(13,139,189,0.85)',
      borderWidth: 0,
      textStyle: {
        color: '#fff',
      },
      axisPointer: {
        type: 'shadow',
        shadowStyle: {
          color: 'rgba(0,229,255,0.2)',
        },
      },
    },
    title: {
      text: 'IT技术发展指数 (2025)',
      left: '2%',
      top: '3%',
      textStyle: {
        color: getLessVar('--color-text'),
        fontSize: 15,
      },
    },
    legend: {
      right: '3%',
      top: '3%',
      textStyle: {
        color: '#666',
      },
    },
  };
};
