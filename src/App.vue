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
    <br/>

    <button @click="getBoardContent">getBoardContent</button>
    <button @click="getBoardContentText">getBoardContentText</button>
    <button @click="setBoardContent">setBoardContent</button>
    <button @click="setMode('design')">设计模式</button>
    <button @click="setMode('edit')">编辑模式</button>
    <button @click="setMode('readonly')">只读模式</button>
    <br/>

    <button @click="editInsertText">editInsertText</button>
    <button @click="editInsertDatalist">editInsertDatalist</button>
    <button @click="activeBoard">activeBoard</button>
    <button @click="deactiveBoard">deactiveBoard</button>

    <button @click="getBoard">getBoard</button>


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
      setMode(mode){
        this.$refs.maxeditor.setMode(mode);
      },
      getBoards(){
        alert(this.$refs.maxeditor.getBoards());
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
        alert(this.$refs.maxeditor.getCurrentBoardContent())
      },
      getCurrentBoardId(){
        alert(this.$refs.maxeditor.getCurrentBoardId());
      },
      getCurrentBoardType(){
        alert(this.$refs.maxeditor.getCurrentBoardType());
      },
      getBoardContent(){
        let id = prompt('请输入id');
        this.$refs.maxeditor.getBoardContent(id);
      },
      getBoardContentText(){
        let id = prompt('请输入id');
        console.log(this.$refs.maxeditor.getBoardContentText(id))

      },
      setBoardContent(){
        let id = prompt('请输入id');
        let content = prompt('内容');
        this.$refs.maxeditor.setBoardContent(id, content);
      },
      activeBoard(){
        let id = prompt('请输入id');
        this.$refs.maxeditor.activeBoard(id);
      },
      deactiveBoard(){
        let id = prompt('请输入id');
        this.$refs.maxeditor.deactiveBoard(id);
      },
      getBoard(){
        let id = prompt('请输入id');
        console.log(this.$refs.maxeditor.getBoard(id));
      },
      setBoard(){
        let boardObjectStr = prompt('boardObjectStr');
        //let boardObject = JSON.parse(boardObjectStr);
        console.log(this.$refs.maxeditor.setBoard(boardObjectStr));
      },



      editInsertText() {
        let text = prompt('请输入文本');
        this.$refs.maxeditor.editInsertText(text)
      },
      editInsertDatalist() {
        let id = prompt('请输入id');
        let values = prompt('请输入数组');
        this.$refs.maxeditor.editInsertDatalist(id, values)
      }
    },
    mounted() {

    },
    watch: {}
  }
</script>

<style scoped>

</style>
