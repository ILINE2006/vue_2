Vue.component('note-column', {
  props: {
    column: {
      type: Object,
      required: true
    },
    isLocked: {
      type: Boolean,
      default: false
    }
  },
  template: `
    <div class="column" :class="{ locked: isLocked }">
      <h2>{{ column.name }}</h2>
      <p>карточки: {{ column.cards.length }} / {{ column.maxCards || 'бесконечно' }}</p>
      <note-card 
        v-for="card in column.cards" 
        :key="card.id"
        :card="card"
        @item-changed="$emit('item-changed', $event)">
      </note-card>
      <button @click="$emit('add-card', column.id)" :disabled="isLocked">+ добавить карточку</button>
    </div>
  `
})

Vue.component('note-card', {
  props: {
    card: {
      type: Object,
      required: true
    }
  },
  computed: {
    progress() {
      const completed = this.card.items.filter(i => i.completed).length
      return Math.round((completed / this.card.items.length) * 100)
    }
  },
  template: `
  <div class="card">
    <h3>{{ card.title }}</h3>
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: progress + '%' }"></div>
    </div>
    <p>{{ progress }}%</p>
    <ul>
      <li v-for="(item, index) in card.items" :key="index">
        <input type="checkbox" v-model="item.completed" @change="$emit('item-changed', card.id)">
        {{ item.text }}
      </li>
    </ul>
    <p v-if="card.completedAt" class="completed-date">Завершенный: {{ card.completedAt }}</p>
    <button @click="addItem" :disabled="card.items.length >= 5">+ добавить</button>
    <button @click="removeItem" :disabled="card.items.length <= 3">- удалить</button>
  </div>
  `,
  methods: {
    addItem() {
      if (this.card.items.length < 5) {
        this.card.items.push({ text: 'Новая Задача', completed: false })
      }
    },
    removeItem() {
      if (this.card.items.length > 3) {
        this.card.items.pop()
      }
    }
  }
})

let app = new Vue({
  el: '#app',
   data: {
    columns: [
      { id: 1, name: 'Блок 1', maxCards: 3, cards: [] },
      { id: 2, name: 'Блок 2', maxCards: 5, cards: [] },
      { id: 3, name: 'Блок 2', maxCards: null, cards: [] }
    ]
  },
  mounted() {
    const saved = localStorage.getItem('notesApp')
    if (saved) {
      this.columns = JSON.parse(saved)
    }
  },
  watch: {
    columns: {
      handler(newVal) {
        localStorage.setItem('notesApp', JSON.stringify(newVal))
      },
      deep: true
    }
  },
  computed: {
    isColumn1Locked() {
      const column2 = this.columns.find(c => c.id === 2)
      const column1 = this.columns.find(c => c.id === 1)
      
      if (column2.cards.length >= column2.maxCards) {
        for (let card of column1.cards) {
          const completed = card.items.filter(i => i.completed).length
          const progress = (completed / card.items.length) * 100
          if (progress > 50) {
            return true
          }
        }
      }
      return false
    }
  },
  methods: {
    addCard(columnId) {
      const column = this.columns.find(c => c.id === columnId)
      if (column.maxCards === null || column.cards.length < column.maxCards) {
        column.cards.push({
          id: Date.now(),
          title: 'Новая карточка',
          items: [
            { text: 'Задача 1', completed: false },
            { text: 'Задача 2', completed: false },
            { text: 'Задача 3', completed: false }
          ]
        })
      }
    },
    handleItemChanged(cardId) {
      for (let column of this.columns) {
        const card = column.cards.find(c => c.id === cardId)
        if (card) {
          const completed = card.items.filter(i => i.completed).length
          const progress = (completed / card.items.length) * 100
          
          if (progress === 100 && column.id !== 3) {
            if (!card.completedAt) {
              card.completedAt = new Date().toLocaleString()
            }
            this.moveCard(cardId, column.id, 3)
          } else if (progress > 50 && column.id === 1) {
            this.moveCard(cardId, column.id, 2)
          }
          break
        }
      }
    },
    moveCard(cardId, fromColumnId, toColumnId) {
      const fromColumn = this.columns.find(c => c.id === fromColumnId)
      const toColumn = this.columns.find(c => c.id === toColumnId)
      const cardIndex = fromColumn.cards.findIndex(c => c.id === cardId)
      const card = fromColumn.cards.splice(cardIndex, 1)[0]
      
      if (toColumn.maxCards === null || toColumn.cards.length < toColumn.maxCards) {
        toColumn.cards.push(card)
      } else {
        fromColumn.cards.splice(cardIndex, 0, card)
      }
    }
  }
})