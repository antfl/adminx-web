import { getLessVar } from '@/utils';

export const doubleBar = () => {
  return {
    backgroundColor: getLessVar('--color-bg-container'),
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 30, 50, 0.95)',
      borderColor: '#00ced1',
      borderWidth: 1,
      textStyle: {
        color: '#fff',
        fontSize: 14,
      },
      axisPointer: {
        type: 'shadow',
        shadowStyle: {
          color: 'rgba(0, 150, 255, 0.1)',
        },
      },
      formatter: (params: Record<string, any>) => {
        const language = params[0].name;
        const stability = params[0].value;
        const popularity = params[1].value;

        return `
        <div style="font-size:16px;font-weight:bold;margin-bottom:8px;color:#00ced1">${language}</div>
        <div style="display:flex;align-items:center;margin-bottom:5px">
            <span style="display:inline-block;width:12px;height:12px;background:linear-gradient(to right, #8a2be2, #4b0082);border-radius:2px;margin-right:8px"></span>
            生态稳定性: <b style="margin-left:8px;color:#fff">${stability}</b>
        </div>
        <div style="display:flex;align-items:center">
            <span style="display:inline-block;width:12px;height:12px;background:linear-gradient(to right, #00ced1, #008b8b);border-radius:2px;margin-right:8px"></span>
            开发者热度: <b style="margin-left:8px;color:#fff">${popularity}</b>
        </div>
                    `;
      },
    },
    title: {
      text: '编程语言生态与热度排名 (2025)',
      left: '2%',
      top: '3%',
      textStyle: {
        color: getLessVar('--color-text'),
        fontSize: 15,
      },
    },
    legend: {
      data: ['生态稳定性', '开发者热度'],
      right: '3%',
      top: '3%',
      textStyle: {
        color: getLessVar('--color-text'),
        fontSize: 14,
      },
      itemWidth: 25,
      itemHeight: 12,
      itemGap: 20,
    },
    grid: {
      left: '3%',
      right: '5%',
      bottom: '10%',
      top: '30%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: ['Python', 'JavaScript', 'Java', 'Go', 'Rust'],
      axisLine: {
        lineStyle: {
          color: getLessVar('--color-border-secondary'),
          width: 1,
        },
      },
      axisLabel: {
        color: getLessVar('--color-text'),
        fontSize: 13,
        fontWeight: 'bold',
        interval: 0,
        rotate: 0,
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      name: '综合指数',
      nameTextStyle: {
        color: getLessVar('--color-text-secondary'),
        fontSize: 12,
        padding: [0, 0, 10, -10],
      },
      splitLine: {
        lineStyle: {
          color: getLessVar('--color-border-secondary'),
          width: 1,
          type: 'dashed',
        },
      },
      axisLabel: {
        color: getLessVar('--color-text-secondary'),
        fontSize: 12,
        fontWeight: 'bold',
      },
      min: 0,
      max: 100,
    },
    series: [
      {
        name: '生态稳定性',
        type: 'bar',
        barWidth: 40,
        data: [92, 88, 90, 85, 82],
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#8a2be2' },
              { offset: 1, color: '#4b0082' },
            ],
          },
          borderRadius: 4,
          borderWidth: 0,
        },
        label: {
          show: true,
          position: 'top',
          color: '#4b0082',
          fontSize: 13,
          formatter: '{c}',
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 15,
            shadowColor: 'rgba(138, 43, 226, 0.6)',
          },
        },
      },
      {
        name: '开发者热度',
        type: 'bar',
        barWidth: 40,
        data: [95, 93, 85, 88, 90],
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#00ced1' },
              { offset: 1, color: '#008b8b' },
            ],
          },
          borderRadius: 4,
          borderWidth: 0,
        },
        label: {
          show: true,
          position: 'top',
          color: '#008b8b',
          fontSize: 13,
          formatter: '{c}',
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 15,
            shadowColor: 'rgba(0, 206, 209, 0.6)',
          },
        },
      },
    ],
    animation: true,
    animationDuration: 1500,
    animationEasing: 'cubicOut',
  };
};
