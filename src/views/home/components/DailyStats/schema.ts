import { getLessVar } from '@/utils';
import dayjs from 'dayjs';

export const createOption = (source: any[]) => {
  const series = [
    {
      type: 'bar',
      name: '总操作量',
      data: source.map((item) => item.total),
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
        borderRadius: [3, 3, 0, 0],
      },
      label: {
        show: true,
        position: 'top',
        color: '#0d8bbd',
        fontWeight: 'bold',
      },
    },
    {
      type: 'line',
      name: '成功操作量',
      data: source.map((item) => item.success),
      symbol: 'circle',
      symbolSize: 10,
      lineStyle: {
        width: 4,
        color: '#91cc75',
        shadowBlur: 15,
        shadowColor: '#91cc75',
      },
      itemStyle: {
        color: '#fff',
        borderWidth: 2,
        borderColor: '#91cc75',
      },
    },
    {
      name: '失败操作量',
      type: 'line',
      data: source.map((item) => item.failure),
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
  ];

  const xAxisData = source.map((item) => dayjs(item.date).format('MM-DD'));

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
      data: xAxisData,
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
      name: '访问次数',
      nameTextStyle: {
        color: getLessVar('--color-text-secondary'),
        fontSize: 12,
        padding: [0, 0, 10, -10],
      },
      splitLine: {
        show: false,
      },
      axisLabel: {
        color: getLessVar('--color-text-secondary'),
      },
    },
    series,
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
          color: 'rgba(4, 158, 236, 0.2)',
        },
      },
    },
    title: {
      text: '访问统计',
      left: '2%',
      top: '3%',
      textStyle: {
        color: getLessVar('--color-text'),
        fontSize: 16,
        fontWeight: 'bold',
      },
    },
    legend: {
      right: '3%',
      top: '3%',
      textStyle: {
        color: getLessVar('--color-text-secondary'),
      },
    },
  };
};
