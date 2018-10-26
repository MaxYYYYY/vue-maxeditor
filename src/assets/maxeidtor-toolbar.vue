<template>
  <div class="maxeditor-toolbar" id="maxeditor-toolbar">
    <a title="粗体" class="maxeditor-toolbar-item"
       @click="document.execCommand('bold', false, null)"><span
      class="maxeditor-icon maxeditor-icon-bold"></span></a>
    <a title="斜体" class="maxeditor-toolbar-item"
       @click="document.execCommand('italic', false, null)"><span
      class="maxeditor-icon maxeditor-icon-italic"></span></a>
    <a title="下划线" class="maxeditor-toolbar-item"
       @click="document.execCommand('underline', false, null)"><span
      class="maxeditor-icon maxeditor-icon-underline"></span></a>
    <a title="删除线" class="maxeditor-toolbar-item">
      <span class="maxeditor-icon maxeditor-icon-strikethrough"></span></a>
    <a title="字体大小" class="maxeditor-toolbar-item"
       @click="document.execCommand('formatblock', false, '<h1>')"><span
      class="maxeditor-icon maxeditor-icon-font"></span></a>
    <a title="增大字体" class="maxeditor-toolbar-item"
       @click=""><span class="maxeditor-icon maxeditor-icon-font-plus"></span></a>
    <a title="减小字体" class="maxeditor-toolbar-item"
       @click=""><span class="maxeditor-icon maxeditor-icon-font-minus"></span></a>
    <a title="字体颜色" class="maxeditor-toolbar-item"><span class="maxeditor-icon maxeditor-icon-tint"></span></a>
    <a class="maxeditor-toolbar-item-separator"></a>
    <a title="居中对齐" class="maxeditor-toolbar-item"
       @click="document.execCommand('justifycenter', false, null)"><span
      class="maxeditor-icon maxeditor-icon-align-center"></span></a>
    <a title="居左对齐" class="maxeditor-toolbar-item"
       @click="document.execCommand('justifyleft', false, null)"><span
      class="maxeditor-icon maxeditor-icon-align-left"></span></a>
    <a title="居右对齐" class="maxeditor-toolbar-item"
       @click="document.execCommand('justifyright', false, null)"><span
      class="maxeditor-icon maxeditor-icon-align-right"></span></a>
    <a class="maxeditor-toolbar-item-separator"></a>


    <br/>
    <button title="插入分隔线" class="maxeditor-toolbar-button"
            @click="addHr">分隔线
    </button>
    <button title="插入文本框" class="maxeditor-toolbar-button"
            @click="addSection">文本框
    </button>
    <button title="插入带标题文本框" class="maxeditor-toolbar-button"
            @click="addSectionWithTitle">文本框（带标题）
    </button>
    <button title="插入带标签文本" class="maxeditor-toolbar-button"
            @click="addTextWithLabel">文本（带标签）
    </button>
    <button title="插入图片容器" class="maxeditor-toolbar-button"
            @click="addImgBox">图片容器
    </button>


    <br/>
    <button title="设计模式" class="maxeditor-toolbar-button"
            :class="{'maxeditor-toolbar-button-disable':maxeditor_mode!=='design'}"
            @click="setMode('design')">设计模式
    </button>
    <button title="编辑模式" class="maxeditor-toolbar-button"
            :class="{'maxeditor-toolbar-button-disable':maxeditor_mode!=='edit'}"
            @click="setMode('edit')">编辑模式
    </button>
    <button title="只读模式" class="maxeditor-toolbar-button"
            :class="{'maxeditor-toolbar-button-disable':maxeditor_mode!=='readonly'}"
            @click="setMode('readonly')">只读模式
    </button>

    <div class="maxeditor-float-r"
         v-show="maxeditor_mode==='design'&&(maxeditor_current_board.type==='normal'||maxeditor_current_board.type==='label'||maxeditor_current_board.type==='imgBox')">
      <button title="修改z-index"
              class="maxeditor-toolbar-button maxeditor-float-r  maxeditor-m-r-15"
              @click="updateZ">修改z-index:{{maxeditor_current_board.z}}
      </button>
      <button title="修改title"
              class="maxeditor-toolbar-button maxeditor-float-r"
              v-if="maxeditor_current_board.type==='normal'"
              @click="updateTitle">修改title:{{maxeditor_current_board.title}}
      </button>
      <button title="修改label"
              class="maxeditor-toolbar-button maxeditor-float-r"
              v-if="maxeditor_current_board.type==='label'"
              @click="updateLabel">修改label:{{maxeditor_current_board.label}}
      </button>
      <button title="修改id"
              class="maxeditor-toolbar-button maxeditor-float-r"
              @click="updateId">修改id:{{maxeditor_current_board.id}}
      </button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "maxeidtor-toolbar",
    props: {
      maxeditor_mode: '',
      maxeditor_current_board: {
        type: Object,
        default() {
          return {
            type: ''
          }
        }
      }
    },
    data() {
      return {
        document: window.document,
        menu_normal_show: false,
      }
    },
    methods: {
      addHr() {
        if (this.$parent.maxeditor_mode !== 'design') {
          alert('当前模式不可插入板块');
          return
        }
        this.$parent.addHr();
      },
      addSection() {
        if (this.$parent.maxeditor_mode !== 'design') {
          alert('当前模式不可插入板块');
          return
        }
        let id = prompt('请输入id');
        this.$parent.addSection(id)
      },
      addSectionWithTitle() {
        if (this.$parent.maxeditor_mode !== 'design') {
          alert('当前模式不可插入板块');
          return
        }
        let id = prompt('请输入id');
        let title = prompt('请输入标题');
        this.$parent.addSectionWithTitle(id, title)
      },
      addTextWithLabel() {
        if (this.$parent.maxeditor_mode !== 'design') {
          alert('当前模式不可插入板块');
          return
        }
        let id = prompt('请输入id');
        let label = prompt('请输入标签');
        this.$parent.addTextWithLabel(id, label)
      },
      addImgBox() {
        if (this.$parent.maxeditor_mode !== 'design') {
          alert('当前模式不可插入板块');
          return
        }
        let id = prompt('请输入id');
        this.$parent.addImgBox(id)
      },
      setMode(mode) {
        this.$parent.maxeditor_mode = mode
      },
      updateId() {
        let id = prompt('请输入id','');
        this.$parent.updateId(this.maxeditor_current_board.id, id);
      },
      updateTitle() {
        let title = prompt('请输入title');
        this.$parent.updateTitle(this.maxeditor_current_board.id, title);
      },
      updateZ() {
        let z = prompt('请输入z-index');
        this.$parent.updateZ(this.maxeditor_current_board.z, z);
      },
      updateLabel() {
        let label = prompt('请输入label');
        this.$parent.updateLabel(this.maxeditor_current_board.id, label);
      }
    },
    mounted() {

    },
    created() {

    },
    watch: {
    }
  }
</script>

<style scoped>

</style>
