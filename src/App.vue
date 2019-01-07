<template>
  <div style="position: relative;">
    <button @click="addSection">addSection</button>
    <button @click="addSectionWithTitle">addSectionWithTitle</button>
    <button @click="addTextWithLabel">addTextWithLabel</button>
    <button @click="addHr">addHr</button>
    <button @click="addImgBox">addImgBox</button>
    <button @click="getBoards">getBoards</button>
    <button @click="setBoards">setBoards</button>
    <button @click="insertImg">insertImg</button>
    <button @click="deleteImg">deleteImg</button>
    <button @click="addImg">addImg</button>
    <button @click="updateImg">updateImg</button>
    <button @click="getImg">getImg</button>
    <button @click="clearImgBoxContent">clearImgBoxContent</button>
    <button @click="insertQRCode">insertQRCode</button>
    <br/>

    <button @click="getBoardContent">getBoardContent</button>
    <button @click="getBoardContentText">getBoardContentText</button>
    <button @click="setBoardContent">setBoardContent</button>
    <button @click="setMode('design')">设计模式</button>
    <button @click="setMode('edit')">编辑模式</button>
    <button @click="setMode('readonly')">只读模式</button>
    <button @click="refreshLayout">refreshLayout</button>
    <button @click="wrapContentHeight">wrapContentHeight</button>
    <br/>

    <button @click="editInsertText">editInsertText</button>
    <button @click="editInsertDatalist">editInsertDatalist</button>
    <button @click="activeBoard">activeBoard</button>
    <button @click="deactiveBoard">deactiveBoard</button>

    <button @click="getBoard">getBoard</button>

    <br/>
    <button @click="updateDropDownList">updateDropDownList</button>
    <button @click="getDropDownList">getDropDownList</button>
    <button @click="setDropDownCurrentItem">setDropDownCurrentItem</button>
    <button @click="getDropDownCurrentItem">getDropDownCurrentItem</button>
    <button @click="test">test</button>
    <button @click="bindImgTabBox">bindImgTabBox</button>
    <button @click="test2">test2</button>
    <button @click="print">print</button>
    <br/>
    <button @click="imgaddtest">imgaddtest</button>
    <button @click="imgdeletetest">imgdeletetest</button>
    <input/>

    <div style="width: 100%;">
      <MaxEditor ref="maxeditor" style="margin-top: 20px"
                 :is-mode-btn-show="true" :view-port-height="500" :is-toolbar-show="true"
                 :height="300"></MaxEditor>
    </div>

    <div id="temp" contenteditable="true"></div>

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
      //增删图片测试
      imgaddtest() {
        let imgJson = {
          src: "http://dmt.upload.streakingman.com/test01.jpg",
          tab: {
            position: "br",
            color: "green"
          },
          tabX: 0,
          tabY: 0,
          key: "pic9",
          label: "pic9"
        };
        this.$refs.maxeditor.addImg('33', imgJson)
      },
      imgdeletetest() {
        this.$refs.maxeditor.deleteImg('33', 'pic9')
      },

      print() {
        this.$refs.maxeditor.print()
      },
      wrapContentHeight() {
        let index = prompt('请输入index');
        this.$refs.maxeditor.wrapContentHeight(index)
      },
      refreshLayout() {
        let id = prompt('id');
        this.$refs.maxeditor.refreshLayout(id)
      },
      updateImg() {
        let id = prompt('请输入id');
        let img = prompt('img');
        let imgJson = JSON.parse(img);
        this.$refs.maxeditor.updateImg(id, imgJson)
      },
      getImg() {
        let id = prompt('请输入id');
        let key = prompt('请输入key');
        document.getElementById('temp').innerText = JSON.stringify(this.$refs.maxeditor.getImg(id, key));
      },
      addImg() {
        let id = prompt('请输入id');
        let img = prompt('img');
        let imgJson = JSON.parse(img);
        this.$refs.maxeditor.addImg(id, imgJson)
      },

      deleteImg() {
        let id = prompt('请输入id');
        let key = prompt('请输入key');
        this.$refs.maxeditor.deleteImg(id, key)
      },

      bindImgTabBox() {
        let sid = prompt('扫描图容器id');
        let tid = prompt('示意图容器id');
        this.$refs.maxeditor.bindImgTabBox(sid, tid);
      },

      test2() {
        this.$refs.maxeditor.test();
      },

      test() {
        document.execCommand('insertHTML', false, '<span></span><span contenteditable="false">RVDd:</span>' +
          '<span contenteditable="true">hahaha</span>' +
          '<span style="float: right" contenteditable="false">cm</span>')
      },

      addSection() {
        let id = prompt('请输入id');
        this.$refs.maxeditor.addSection(id);
      },
      addSectionWithTitle() {
        let id = prompt('请输入id');
        let title = prompt('请输入标题');
        this.$refs.maxeditor.addSection(id, title);
      },
      addTextWithLabel() {
        let id = prompt('请输入id');
        let label = prompt('请输入标题');
        this.$refs.maxeditor.addTextWithLabel(id, label);
      },
      addHr() {
        this.$refs.maxeditor.addHr();
      },
      addImgBox() {
        let id = prompt('请输入id');
        this.$refs.maxeditor.addImgBox(id);
      },
      setMode(mode) {
        this.$refs.maxeditor.setMode(mode);
      },
      getBoards() {
        document.getElementById('temp').innerText = JSON.stringify(this.$refs.maxeditor.getBoards())
      },
      setBoards() {
        let boards = prompt('请输入json数组');
        this.$refs.maxeditor.setBoards(JSON.parse(boards));
      },
      insertImg() {
        let id = prompt('请输入id');
        let imgs = prompt('请输入json数组');
        this.$refs.maxeditor.insertImg(id, imgs);
      },
      getCurrentBoardContent() {
        alert(this.$refs.maxeditor.getCurrentBoardContent())
      },
      getCurrentBoardId() {
        alert(this.$refs.maxeditor.getCurrentBoardId());
      },
      getCurrentBoardType() {
        alert(this.$refs.maxeditor.getCurrentBoardType());
      },
      getBoardContent() {
        let id = prompt('请输入id');
        console.log(this.$refs.maxeditor.getBoardContent(id));
      },
      getBoardContentText() {
        let id = prompt('请输入id');
        console.log(this.$refs.maxeditor.getBoardContentText(id))

      },
      setBoardContent() {
        let id = prompt('请输入id');
        let content = prompt('内容');
        this.$refs.maxeditor.setBoardContent(id, content);
      },
      activeBoard() {
        let id = prompt('请输入id');
        this.$refs.maxeditor.activeBoard(id);
      },
      deactiveBoard() {
        let id = prompt('请输入id');
        this.$refs.maxeditor.deactiveBoard(id);
      },
      getBoard() {
        let id = prompt('请输入id');
        document.getElementById('temp').innerText = JSON.stringify(this.$refs.maxeditor.getBoard(id))
      },
      insertQRCode() {
        let id = prompt('请输入id');
        let url = prompt('请输入url');
        this.$refs.maxeditor.insertQRCode(id, url)
      },
      clearImgBoxContent() {
        let id = prompt('请输入id');
        this.$refs.maxeditor.clearImgBoxContent(id);
      },
      updateDropDownList() {
        let id = prompt('请输入id');
        let datalist = prompt('请输入list');
        this.$refs.maxeditor.updateDropDownList(id, datalist)
      },
      getDropDownList() {
        let id = prompt('请输入id');
        console.log(this.$refs.maxeditor.getDropDownList(id))
      },
      getDropDownCurrentItem() {
        let id = prompt('请输入id');
        console.log(this.$refs.maxeditor.getDropDownCurrentItem(id))
      },
      setDropDownCurrentItem() {
        let id = prompt('请输入id');
        let itemId = prompt('请输入itemId');
        this.$refs.maxeditor.setDropDownCurrentItem(id, itemId)
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
  body {
    margin: 0;
    padding: 0;
  }
</style>
