import { Color } from 'tvision-color';

const STYLE_ID = 'adminx-brand';

export const normalizeHex = (color: string) => {
  const value = color.trim();
  const matched = value.match(/^#?([0-9a-fA-F]{6})$/);
  return matched ? `#${matched[1].toUpperCase()}` : '';
};

/** 用 TDesign 推荐的 tvision-color 生成 10 阶色板。 */
const createPalette = (hex: string) => {
  const [{ colors, primary }] = Color.getColorGradations({
    colors: [hex],
    step: 10,
    remainInput: true,
  });
  const palette = colors.slice(0, 10);
  while (palette.length < 10) palette.push(hex);
  const index = Number.isInteger(primary) ? primary : 6;
  return {
    palette,
    primary: Math.min(9, Math.max(0, index)),
  };
};

/** chroma 的饱和度是 0–1，这里按百分比增减，避免减 4 把颜色洗成灰色。 */
const adjustSaturation = (color: string, deltaPercent: number) => {
  const [hue, saturation, lightness] = Color.colorTransform(color, 'hex', 'hsl');
  const unit = Math.abs(saturation) <= 1 && Math.abs(lightness) <= 1;
  const nextSaturation = unit
    ? Math.min(1, Math.max(0, saturation + deltaPercent / 100))
    : Math.min(100, Math.max(0, saturation + deltaPercent));
  return Color.colorTransform([hue, nextSaturation, lightness], 'hsl', 'hex');
};

/**
 * 亮色主色放在第 7 阶。色板按明度排好后整体平移，让相邻阶保持从浅到深。
 */
const alignLight = (palette: string[], primary: number, brand: string) => {
  const shift = 6 - primary;
  return Array.from({ length: 10 }, (_, index) => {
    const source = Math.min(9, Math.max(0, index - shift));
    return index === 6 ? brand : palette[source];
  });
};

/**
 * 暗色从深到浅，并略降饱和度。
 * 框架把暗色主色指向第 8 阶，这里放比亮色主色浅一档的颜色，保证深色背景上仍能看清。
 */
const alignDark = (light: string[]) => {
  const reversed = [...light].reverse().map((color) => adjustSaturation(color, -4));
  const shift = 3;
  return Array.from({ length: 10 }, (_, index) => {
    const source = Math.min(9, Math.max(0, index - shift));
    return reversed[source];
  });
};

const variables = (colors: string[]) =>
  colors.map((color, index) => `--td-brand-color-${index + 1}:${color}`).join(';');

/** 写入亮色、暗色两套品牌色阶。语义色由组件库别名到对应阶。 */
export const applyBrandColor = (color: string) => {
  const hex = normalizeHex(color);
  if (!hex) return;

  const { palette, primary } = createPalette(hex);
  const light = alignLight(palette, primary, hex);
  const dark = alignDark(light);

  let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement('style');
    style.id = STYLE_ID;
    document.head.appendChild(style);
  }

  const token = hex.slice(1);
  style.textContent = [
    `:root[theme-color="${token}"]{${variables(light)}}`,
    `:root[theme-color="${token}"][theme-mode="dark"]{${variables(dark)}}`,
  ].join('');
  document.documentElement.setAttribute('theme-color', token);
};
