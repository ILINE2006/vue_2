Vue.component('note-column', {
  props: {
    column: {
      type: Object,
      required: true
    }
  },
  template: `
    <div class="column">
      <h2>{{ column.name }}</h2>
      <p>карточки: {{ column.cards.length }} / {{ column.maxCards || 'бесконечно' }}</p>
      <note-card 
        v-for="card in column.cards" 
        :key="card.id"
        :card="card">
      </note-card>
      <button @click="$emit('add-card', column.id)">+ добавить</button>
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
      <p>{{ progress }}%</p>
      <ul>
        <li v-for="(item, index) in card.items" :key="index">
          <input type="checkbox" v-model="item.completed" @change="$emit('item-changed', card.id)">
          {{ item.text }}
        </li>
      </ul>
      <button @click="addItem" :disabled="card.items.length >= 5">+ Добавить</button>
      <button @click="removeItem" :disabled="card.items.length <= 3">- Удалить</button>
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
      { id: 3, name: 'Блок 3', maxCards: null, cards: [] }
    ]
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
    }
  }
})