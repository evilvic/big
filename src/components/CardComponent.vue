<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  text: { type: String },
  cardBackgroundColor: { type: String },
  cardColor: { type: String },
  deckBackgroundColor: { type: String, required: true },
  deckColor: { type: String, required: true },
  isNewCardPlaceholder: { type: Boolean, default: false },
})

const backgroundColor = computed(() => props.cardBackgroundColor || props.deckBackgroundColor)
const color = computed(() => props.cardColor || props.deckColor)

const words = ref(props.isNewCardPlaceholder ? [] : props.text.split(' '))
const cardRef = ref(null)

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
  if (!cardRef.value) return

  if (props.isNewCardPlaceholder) {
    const container = cardRef.value
    container.innerHTML = ''
    
    const newCardText = document.createElement('span')
    newCardText.style.textAlign = 'center'
    newCardText.style.lineHeight = '1'
    newCardText.textContent = '+ new card'
    newCardText.style.fontSize = '2rem'
    newCardText.style.fontFamily = 'Barrio, sans-serif'
    newCardText.style.color = color.value
    
    container.appendChild(newCardText)
    
    return
  }

  const container = cardRef.value
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
    span.style.color = color
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
    ref="cardRef" 
    :style="{ backgroundColor, color }"
    :class="{ 'new-card': isNewCardPlaceholder }"
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