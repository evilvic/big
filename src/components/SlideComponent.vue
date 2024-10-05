<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps({
  text: { type: String, required: true },
  lightColor: { type: String },
  darkColor: { type: String },
  collectionLightColor: { type: String, required: true },
  collectionDarkColor: { type: String, required: true },
  isDarkMode: { type: Boolean, required: true }
})

const effectiveLightColor = computed(() => props.lightColor || props.collectionLightColor)
const effectiveDarkColor = computed(() => props.darkColor || props.collectionDarkColor)

const backgroundColor = computed(() => props.isDarkMode ? effectiveDarkColor.value : effectiveLightColor.value)
const textColor = computed(() => props.isDarkMode ? effectiveLightColor.value : effectiveDarkColor.value)

const words = ref(props.text.split(' '))
const containerRef = ref(null)

const groupWordsIntoRows = () => {
  const rows = [];
  let currentRow = [];

  if (words.value.length <= 6) {
    words.value.forEach(word => {
      rows.push([word]);
    });
  } else {
    words.value.forEach((word, index) => {
      if (word.length <= 4) {
        currentRow.push(word);
        if (currentRow.length === 2) {
          rows.push(currentRow);
          currentRow = [];
        }
      } else {
        if (currentRow.length > 0) {
          rows.push(currentRow);
          currentRow = [];
        }
        rows.push([word]);
      }
    });

    if (currentRow.length > 0) {
      rows.push(currentRow);
    }
  }

  return rows;
};

const adjustLayout = () => {
  if (!containerRef.value) return

  const container = containerRef.value
  const containerWidth = container.clientWidth
  const containerHeight = container.clientHeight

  const rows = groupWordsIntoRows();

  container.innerHTML = ''
  const rowElements = rows.map(row => {
    const span = document.createElement('span')
    span.style.textAlign = 'center'
    span.style.lineHeight = '0.9'
    span.style.whiteSpace = 'nowrap'
    span.style.fontFamily = 'Barrio, sans-serif'
    span.style.color = textColor
    span.textContent = row.join(' ')
    container.appendChild(span)
    return span
  })

  const fontSizes = rowElements.map(row => {
    let fontSize = 1000
    while (fontSize > 10) {
      row.style.fontSize = `${fontSize}px`
      if (row.offsetWidth <= containerWidth * 0.95) {
        return fontSize
      }
      fontSize--
    }
    return 10
  })

  const middleIndex = Math.floor(rowElements.length / 2)
  const arrangedRows = []
  for (let i = 0; i < rowElements.length; i++) {
    if (i % 2 === 0) {
      arrangedRows.push(rowElements[middleIndex + Math.floor(i/2)])
    } else {
      arrangedRows.unshift(rowElements[middleIndex - Math.ceil(i/2)])
    }
  }

  container.innerHTML = ''
  const totalHeight = fontSizes.reduce((sum, size) => sum + size * 0.9, 0)
  const scale = Math.min(1, containerHeight * 0.95 / totalHeight)

  arrangedRows.forEach((row, index) => {
    const adjustedSize = fontSizes[index] * scale
    row.style.fontSize = `${adjustedSize}px`
    row.style.marginBottom = index < arrangedRows.length - 1 ? '-0.1em' : '0'
    container.appendChild(row)
  })

  const contentHeight = container.offsetHeight
  const topMargin = Math.max(0, (containerHeight - contentHeight) / 2)
  container.style.paddingTop = `${topMargin}px`
}

onMounted(() => {
  adjustLayout()
  window.addEventListener('resize', adjustLayout)
})

onUnmounted(() => {
  window.removeEventListener('resize', adjustLayout)
})
</script>

<template>
  <article 
    ref="containerRef" 
    :style="{ 
      backgroundColor: backgroundColor,
      color: textColor
    }"
  ></article>
</template>

<style scoped>
article {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  overflow: hidden;
}
span {
  color: inherit;
}
</style>