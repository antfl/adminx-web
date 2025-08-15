export const useAppLoading = () => {
  const isAppLoaded = ref(false);

  onMounted(() => {
    const appLoading = document.getElementById('app-loading-container');
    if (appLoading) {
      appLoading.style.transition = 'opacity 600ms ease-in';
      appLoading.style.opacity = '0';
    }

    isAppLoaded.value = true;
  });

  return {
    isAppLoaded,
  };
};
