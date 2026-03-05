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
      <p>Карточки: {{ column.cards.length }} / {{ column.maxCards || 'бесконечно' }}</p>
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
  }
})