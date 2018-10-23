<template>
  <div>
    <button @click="addSection">addSection</button>
    <button @click="addSectionWithTitle">addSectionWithTitle</button>
    <button @click="addTextWithLabel">addTextWithLabel</button>
    <button @click="addHr">addHr</button>
    <button @click="addImgBox">addImgBox</button>
    <button @click="getBoards">getBoards</button>
    <button @click="setBoards">setBoards</button>
    <button @click="insertImg">insertImg</button>
    <button @click="getCurrentBoardContent">getCurrentBoardContent</button>
    <button @click="getBoardContent">getBoardContent</button>
    <button @click="setBoardContent">setBoardContent</button>
    <button @click="setMode('design')">设计模式</button>
    <button @click="setMode('edit')">编辑模式</button>
    <button @click="setMode('readonly')">只读模式</button>

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
      addSection(){
        let id = prompt('请输入id');
        this.$refs.maxeditor.addSection(id);
      },
      addSectionWithTitle(){
        let id = prompt('请输入id');
        let title = prompt('请输入标题');
        this.$refs.maxeditor.addSection(id, title);
      },
      addTextWithLabel(){
        let id = prompt('请输入id');
        let label = prompt('请输入标题');
        this.$refs.maxeditor.addTextWithLabel(id, label);
      },
      addHr(){
        this.$refs.maxeditor.addHr();
      },
      addImgBox(){
        let id = prompt('请输入id');
        this.$refs.maxeditor.addImgBox(id);
      },
      setMode(){
        this.$refs.maxeditor.setMode();
      },
      getBoards(){
        this.$refs.maxeditor.getBoards();
      },
      setBoards(){
        let boards = prompt('请输入json数组');
        this.$refs.maxeditor.setBoards(boards);
      },
      insertImg(){
        let id = prompt('请输入id');
        let imgs = prompt('请输入json数组');
        this.$refs.maxeditor.insertImg(id, imgs);
      },
      getCurrentBoardContent(){
        this.$refs.maxeditor.getCurrentBoardContent();
      },
      getBoardContent(){
        let id = prompt('请输入id');
        this.$refs.maxeditor.getBoardContent(id);
      },
      setBoardContent(){
        let id = prompt('请输入id');
        let content = prompt('内容');
        this.$refs.maxeditor.setBoardContent(id, content);
      },
    },
    mounted() {

    },
    watch: {}
  }
</script>

<style scoped>

</style>
