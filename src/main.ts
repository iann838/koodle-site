import { createApp } from 'vue'
import App from './App.vue'

import router from './router'
import store from './store'

import { api, stge, _const } from './services'

import Icon from './components/Icon.vue'
import Image from './components/Image.vue'
import Select from './components/Select.vue'

createApp(App)

.use(store)
.use(router)

.use(api)
.use(stge)
.use(_const)

.component('Icon', Icon)
.component('Image', Image)
.component('Select', Select)

.mount('#app')
