import MaxEditor from './maxeditor.vue'
import './style.css'

MaxEditor.install = function(Vue) {
  Vue.component('MaxEditor', MaxEditor)
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(MaxEditor)
}

export default MaxEditor
