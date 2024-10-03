<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// const phrase = "Did you get older doing nothing today?"
// const phrase = "Don't you wanna stop complaining?"
// const phrase = "I'm not a bad person, I'm a good person"
// const phrase = "little? little? little? little? little? little? little?"
const phrase = "water your plants"
const words = ref(phrase.split(' '))
const containerRef = ref(null)

const adjustLayout = () => {
  if (!containerRef.value) return

  const container = containerRef.value
  const containerWidth = container.clientWidth
  const containerHeight = container.clientHeight

  console.log(containerWidth, containerHeight)

  // 1. Group words into rows with improved logic
  const groupWordsIntoRows = () => {
  const rows = [];
  let currentRow = [];

  if (words.value.length <= 6) {
    // Less than or equal to 6 words, each word gets its own row
    words.value.forEach(word => {
      rows.push([word]);
    });
  } else {
    // More than 6 words, attempt to group
    words.value.forEach((word, index) => {
      // Only consider grouping for words 4 letters or fewer
      if (word.length <= 4) {
        currentRow.push(word);
        // If we have 2 words in the currentRow, it's time to push them
        if (currentRow.length === 2) {
          rows.push(currentRow);
          currentRow = [];
        }
      } else {
        // Place any existing grouped words in the rows
        if (currentRow.length > 0) {
          rows.push(currentRow);
          currentRow = [];
        }
        // Add the current longer word as a separate row
        rows.push([word]);
      }
    });

    // Append any remaining words in the currentRow
    if (currentRow.length > 0) {
      rows.push(currentRow);
    }
  }

  return rows;
};

const rows = groupWordsIntoRows();
console.log(rows);

  // 2. Create elements for each row
  container.innerHTML = ''
  const rowElements = rows.map(row => {
    const div = document.createElement('div')
    div.style.textAlign = 'center'
    div.style.lineHeight = '0.9'
    div.style.whiteSpace = 'nowrap'
    div.style.color = '#FFF2D7'
    div.textContent = row.join(' ')
    container.appendChild(div)
    return div
  })

  // 3. Calculate optimal font sizes for each row
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

  // 4. Arrange rows from center outwards
  const middleIndex = Math.floor(rowElements.length / 2)
  const arrangedRows = []
  for (let i = 0; i < rowElements.length; i++) {
    if (i % 2 === 0) {
      arrangedRows.push(rowElements[middleIndex + Math.floor(i/2)])
    } else {
      arrangedRows.unshift(rowElements[middleIndex - Math.ceil(i/2)])
    }
  }

  // 5. Apply layout and adjust sizes to fit vertically
  container.innerHTML = ''
  const totalHeight = fontSizes.reduce((sum, size) => sum + size * 0.9, 0)
  const scale = Math.min(1, containerHeight * 0.95 / totalHeight)

  arrangedRows.forEach((row, index) => {
    const adjustedSize = fontSizes[index] * scale
    row.style.fontSize = `${adjustedSize}px`
    row.style.marginBottom = index < arrangedRows.length - 1 ? '-0.1em' : '0'
    container.appendChild(row)
  })

  // 6. Center vertically
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
  <main ref="containerRef"></main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  padding: 0 20px;
  box-sizing: border-box;
  overflow: hidden;
  font-family: 'Barrio', sans-serif;
  background: #F98866;
}
</style>
