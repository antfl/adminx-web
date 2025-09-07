import type { App } from 'vue';
import { withInstall } from '@/utils/withInstall';
import Editor from './src/Editor/index.vue';
import Viewer from './src/Viewer/index.vue';
import type { SFCWithInstall } from '@/utils/withInstall';

export const MdEditor: SFCWithInstall<typeof Editor> = withInstall(Editor);

export const MdViewer: SFCWithInstall<typeof Viewer> = withInstall(Viewer);

export const Markdown = {
  install(app: App) {
    if (MdEditor.name) app.component(MdEditor.name, MdEditor);
    if (MdViewer.name) app.component(MdViewer.name, MdViewer);
  },
};

export default Markdown;
