import type { Component } from 'vue';

const svgIcons = import.meta.glob('@/assets/svg/*.svg', { as: 'url', eager: true });

export interface IconData {
  name: string;
  url: string;
  component?: Component;
}

export const loadIcons = (): IconData[] => {
  return Object.entries(svgIcons).map(([path, url]) => {
    const name = path
      .split('/')
      .pop()
      ?.replace(/\.svg$/, '') as string;

    return { name, url };
  });
};
