let app = new Vue({
  el: '#app',
  data: {
    columns: [
      { id: 1, name: 'Блок_1', maxCards: 3, cards: [] },
      { id: 2, name: 'Блок_2', maxCards: 5, cards: [] },
      { id: 3, name: 'Блок_3', maxCards: null, cards: [] }
    ]
  }
})