/*import flyHeader from '@/components/header.vue'
import flyCell from '@/components/Cell.vue'
import flyCellBox from '@/components/CellBox.vue'
import flyPage from '@/components/page.vue'
import flySwitch from '@/components/switch.vue'
import refreshPage from '@/components/refreshPage.vue'
const components = [
  flyHeader,flyCell,flyCellBox,flyPage,flySwitch
]*/
const fly_ui = {
  install:function (Vue) {
      if (typeof window !== 'undefined' && window.Vue) {
        Vue = window.Vue;
      }
     /* Vue.component(flyHeader.name,flyHeader)
      Vue.component(flyCell.name,flyCell)
      Vue.component(flyCellBox.name,flyCellBox)
      Vue.component(flyPage.name,flyPage)
      Vue.component(flySwitch.name,flySwitch)
      Vue.component(refreshPage.name,refreshPage)*/
  }
};
export default fly_ui
