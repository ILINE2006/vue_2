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
  template: `
    <div class="card">
      <h3>{{ card.title }}</h3>
    </div>
  `
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
          items: []
        })
      }
    }
  }
})