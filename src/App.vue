<template>
  <div>
    <button @click="print">打印</button>
    <button @click="getCurrentBoardContent">获取当前编辑框内容（html）</button>
    <button @click="getBoardContent">getBoardContent</button>
    <button @click="setBoardContent">setBoardContent</button>
    <button @click="addBoard({id:maxeditor_input_board_id,type:'normal',isFluid:true,z:999})">插入板块</button>
    <input v-model="maxeditor_input_board_id"/>
    <button @click="addHr">插入分隔线</button>
    <button @click="addSection('vue-draggable-resizable-section',input_section_title)">&nbsp;&nbsp;插入带标题多行文本
    </button>
    <input v-model="input_section_title"/>
    <button @click="addLabel('vue-draggable-resizable-label',input_label_title)">&nbsp;&nbsp;插入带签文本</button>
    <input v-model="input_label_title"/>
    <br/>
    <button @click="addImg('vue-draggable-resizable-img',input_img_id)">&nbsp;&nbsp;插入图片容器(需要id)</button>
    <input v-model="input_img_id"/>
    <button @click="insertImg(input_img_id)">插入图片(需要id)</button>
    <br/>
    <button @click="maxeditor_mode = 'design'">设计模式</button>
    <button @click="maxeditor_mode = 'edit'">编辑模式</button>
    <button @click="maxeditor_mode = 'readonly'">只读模式</button>
    <br/>
    <button @click="getBoards">getBoards</button>
    <button @click="setBoards(input_boards)">setBoards</button>
    <input v-model="input_boards"/>
    <button @click="insertImg()">insertImg</button>
    <MaxEditor ref="maxeditor"></MaxEditor>
  </div>

</template>

<script>

  import MaxEditor from './assets/maxeditor.vue'

  export default {
    name: "app",
    data() {
      return {}
    },
    components: {
      MaxEditor
    },
    methods: {
      addHr(){
        this.$refs.maxeditor.addHr();
      },
    },
    mounted() {

    },
    watch: {}
  }
</script>

<style scoped>

</style>
