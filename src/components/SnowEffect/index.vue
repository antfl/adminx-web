<template>
  <canvas ref="canvas" class="snow-canvas"></canvas>
</template>

<script lang="ts">
export default defineComponent({
  name: 'SnowEffect',
  props: {
    snowCount: {
      type: Number,
      default: 20,
    },
    snowSpeed: {
      type: Number,
      default: 0.5,
    },
    snowSize: {
      type: Number,
      default: 2,
    },
    windStrength: {
      type: Number,
      default: 0.5,
    },
    clickThreshold: {
      type: Number,
      default: 9,
    },
  },
  setup(props) {
    const canvas = ref<HTMLCanvasElement | null>(null);
    let ctx: CanvasRenderingContext2D | null = null;
    let snowflakes: Snowflake[] = [];
    let animationId: number | null = null;
    let isPlaying = false;
    let clickCount = 0;

    class Snowflake {
      x: number;
      y: number;
      radius: number;
      speed: number;
      wind: number;
      opacity: number;
      windAngle: number;
      windChangeSpeed: number;

      constructor() {
        this.x = Math.random() * (canvas.value?.width || window.innerWidth);
        this.y = Math.random() * -(canvas.value?.height || window.innerHeight);
        this.radius = Math.random() * props.snowSize + 1;
        this.speed = Math.random() * props.snowSpeed + 1;
        this.wind = props.windStrength;
        this.opacity = Math.random() * 0.5 + 0.5;
        this.windAngle = Math.random() * Math.PI * 2;
        this.windChangeSpeed = Math.random() * 0.05 + 0.01;
      }

      update() {
        if (!canvas.value) return;

        this.y += this.speed;
        this.windAngle += this.windChangeSpeed;
        this.x += Math.sin(this.windAngle) * this.wind;

        if (this.y > canvas.value.height) {
          this.reset();
        }

        if (this.x < -this.radius || this.x > canvas.value.width + this.radius) {
          this.reset();
        }
      }

      reset() {
        if (!canvas.value) return;

        this.x = Math.random() * canvas.value.width;
        this.y = -this.radius;
        this.radius = Math.random() * props.snowSize + 1;
        this.speed = Math.random() * props.snowSpeed + 1;
        this.wind = props.windStrength;
      }

      draw() {
        if (!ctx) return;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
        ctx.closePath();
      }
    }

    function initSnowflakes() {
      snowflakes = [];
      for (let i = 0; i < props.snowCount; i++) {
        snowflakes.push(new Snowflake());
      }

      for (let i = 0; i < 10; i++) {
        const bigFlake = new Snowflake();
        bigFlake.radius = Math.random() * 5;
        bigFlake.speed = Math.random() * 1.5 + 0.5;
        bigFlake.opacity = Math.random() * 0.3 + 0.7;
        snowflakes.push(bigFlake);
      }
    }

    // 设置 Canvas 尺寸为窗口大小
    function resizeCanvas() {
      if (!canvas.value) return;

      canvas.value.width = window.innerWidth;
      canvas.value.height = window.innerHeight;
    }

    // 动画循环
    function animate() {
      if (!canvas.value || !ctx) return;

      ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

      // 更新并绘制所有雪花
      snowflakes.forEach((flake) => {
        flake.update();
        flake.draw();
      });

      if (isPlaying) {
        animationId = requestAnimationFrame(animate);
      }
    }

    // 启动动画
    function startAnimation() {
      if (!isPlaying && canvas.value) {
        isPlaying = true;
        ctx = canvas.value.getContext('2d');
        resizeCanvas();
        initSnowflakes();
        animate();
      }
    }

    // 暂停动画
    function pauseAnimation() {
      isPlaying = false;
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    }

    // 处理点击事件
    function handleClick() {
      clickCount++;
      if (clickCount >= props.clickThreshold && !isPlaying) {
        startAnimation();
      }
    }

    // 初始化
    onMounted(() => {
      window.addEventListener('resize', resizeCanvas);
      window.addEventListener('click', handleClick);
    });

    // 清理
    onBeforeUnmount(() => {
      pauseAnimation();
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('click', handleClick);
    });

    return {
      canvas,
    };
  },
});
</script>

<style scoped>
.snow-canvas {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
