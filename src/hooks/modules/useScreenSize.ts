import { debounce } from 'lodash-es';

export const useScreenSize = () => {
  const breakpoint = 640;
  const currentInnerWidth = ref(0);

  const isMobile = computed(() => currentInnerWidth.value < breakpoint);

  const changeCallbacks = new Set<(value: boolean) => void>();
  const onChange = (callback: (value: boolean) => void) => {
    changeCallbacks.add(callback);
    return () => {
      changeCallbacks.delete(callback);
    };
  };

  const checkScreenSize = debounce(
    () => {
      currentInnerWidth.value = window.innerWidth;
      changeCallbacks.forEach((cb) => cb(isMobile.value));
    },
    200,
    { leading: true },
  );

  onMounted(() => {
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', checkScreenSize);
    checkScreenSize.cancel();
  });

  return { onChange, isMobile };
};
