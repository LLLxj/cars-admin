import System from '@/api/sys'
const user = {
  namespaced: true,
  state: {
    id: 0,
    name: ''
  },
  mutations: {
    updateId (state, id) {
      state.id = id
    },
    updateName (state, name) {
      // console.log(name)
      state.name = name
    }
  },
  action: {
    
  },
}

export default user
