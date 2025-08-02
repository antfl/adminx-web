import { getLessVar } from '@/utils';

export const createPie = ({ data = [], name = '' }: { data: any[]; name: string }) => {
  return {
    backgroundColor: getLessVar('--color-bg-container'),
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: <span style="font-weight:700">{c}</span> ({d}%)',
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderColor: '#eee',
      borderWidth: 1,
      textStyle: { color: '#333', fontSize: 12 },
      padding: [10, 15],
      extraCssText: 'box-shadow: 0 4px 12px rgba(255,255,255,0.01); border-radius: 6px;',
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      right: 20,
      top: 'center',
      textStyle: { color: getLessVar('--color-text-secondary') },
      itemGap: 12,
      itemWidth: 14,
      itemHeight: 14,
      pageIconColor: '#888',
      pageTextStyle: { color: '#444' },
    },
    graphic: {
      type: 'text',
      left: '36%',
      top: 'center',
      style: {
        text: name,
        textAlign: 'center',
        fill: '#999',
        fontSize: 14,
        fontWeight: 'normal',
      },
    },
    series: [
      {
        name: '数据分布',
        type: 'pie',
        radius: ['35%', '60%'],
        center: ['40%', '50%'],
        avoidLabelOverlap: true,
        hoverOffset: 10,
        itemStyle: {
          borderRadius: 8,
          borderWidth: 2,
          shadowBlur: 0,
          shadowColor: 'rgba(200, 200, 200, 0)',
          borderColor: '#fff',
        },
        label: {
          show: true,
          position: 'outside',
          formatter: (params: Record<string, any>) => {
            return `{name|${params.name}}\n{value|${params.percent}%}`;
          },
          rich: {
            name: {
              fontSize: 11,
              padding: [8, 0],
              color: getLessVar('--color-text-secondary'),
            },
            value: {
              padding: [0, 0, 8, 0],
              fontSize: 13,
              fontWeight: 'bold',
              color: getLessVar('--color-text'),
            },
          },
          distanceToLabelLine: 5,
        },
        labelLine: {
          length: 15,
          length2: 20,
          smooth: true,
          lineStyle: {
            width: 1.5,
            type: 'dashed',
          },
        },
        emphasis: {
          scale: true,
          scaleSize: 8,
          itemStyle: {
            shadowBlur: 15,
            shadowColor: 'rgba(200, 200, 200, 0.2)',
          },
        },
        data,
        animationType: 'scale',
        animationEasing: 'elasticOut',
      },
    ],
  };
};
