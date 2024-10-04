<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  fontColor: {
    type: String,
    // default: '#FFF2D7',
  },
  backgroundColor: {
    type: String,
    // default: '#F98866',
  },
  darkFontColor: {
    type: String,
    default: '',
  },
  collectionFontColor: {
    type: String,
    required: true,
  },
  collectionBackgroundColor: {
    type: String,
    required: true,
  },
  collectionDarkFontColor: {
    type: String,
    required: true,
  }
})

const effectiveFontColor = computed(() => props.fontColor || props.collectionFontColor)
const effectiveBackgroundColor = computed(() => props.backgroundColor || props.collectionBackgroundColor)
const effectiveDarkFontColor = computed(() => props.darkFontColor || props.collectionDarkFontColor)

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
    const div = document.createElement('div')
    div.style.textAlign = 'center'
    div.style.lineHeight = '0.9'
    div.style.whiteSpace = 'nowrap'
    div.style.fontFamily = 'Barrio, sans-serif'
    div.style.color = props.effectiveFontColor
    div.textContent = row.join(' ')
    container.appendChild(div)
    return div
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
      backgroundColor: effectiveBackgroundColor,
      color: effectiveFontColor
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
</style>