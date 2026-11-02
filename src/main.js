import { createApp } from 'vue'
import App from './App.vue'
import './css/global.css'
import './css/animations.css'
import './css/invitation.css'
import './css/traditional.css'
import './css/love-experience.css'
import tilt from './directives/tilt'

createApp(App).directive('tilt', tilt).mount('#app')
