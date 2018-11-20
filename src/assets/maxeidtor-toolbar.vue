<template>
  <div class="maxeditor-toolbar"
       :id="'maxeditor-toolbar-'+maxeditorRootId"
       ref="maxEditorToolbar"
       :style="{'width': width+paddingX*2+'px'}">
    <a title="粗体" class="maxeditor-toolbar-item" :class="{'maxeditor-bgcolor-gainsboro':command.bold}"
       @click="document.execCommand('bold', false, null)"><span
      class="maxeditor-icon maxeditor-icon-bold"></span></a>
    <a title="斜体" class="maxeditor-toolbar-item" :class="{'maxeditor-bgcolor-gainsboro':command.italic}"
       @click="document.execCommand('italic', false, null)"><span
      class="maxeditor-icon maxeditor-icon-italic"></span></a>
    <a title="下划线" class="maxeditor-toolbar-item" :class="{'maxeditor-bgcolor-gainsboro':command.underline}"
       @click="document.execCommand('underline', false, null)"><span
      class="maxeditor-icon maxeditor-icon-underline"></span></a>
    <a title="删除线" class="maxeditor-toolbar-item" :class="{'maxeditor-bgcolor-gainsboro':command.strikeThrough}"
       @click="document.execCommand('strikeThrough', false, null)">
      <span class="maxeditor-icon maxeditor-icon-strikethrough"></span></a>
    <a class="maxeditor-toolbar-item-separator"></a>
    <a class="maxeditor-toolbar-item"
       :class="{'maxeditor-bgcolor-gainsboro':current_pop_menu==='fontSize'}"
       @click="current_pop_menu==='fontSize'?current_pop_menu='':current_pop_menu='fontSize'">
      <span title="字体大小"  class="maxeditor-icon maxeditor-icon-font"></span>
      <div v-show="current_pop_menu==='fontSize'" class="maxeditor-btn-menu-fontsize">
        <div @click="document.execCommand('fontsize',false,'7')" class="maxeditor-hoverable"><font size="7">超大</font></div>
        <div @click="document.execCommand('fontsize',false,'6')" class="maxeditor-hoverable"><font size="6">特大</font></div>
        <div @click="document.execCommand('fontsize',false,'5')" class="maxeditor-hoverable"><font size="5">比较大</font></div>
        <div @click="document.execCommand('fontsize',false,'4')" class="maxeditor-hoverable"><font size="4">稍大</font></div>
        <div @click="document.execCommand('fontsize',false,'3')" class="maxeditor-hoverable"><font size="3">正常</font></div>
        <div @click="document.execCommand('fontsize',false,'2')" class="maxeditor-hoverable"><font size="2">小</font></div>
        <div @click="document.execCommand('fontsize',false,'1')" class="maxeditor-hoverable"><font size="1">超小</font></div>
      </div>
    </a>
    <!--<a title="增大字体" class="maxeditor-toolbar-item"
       @click="increaseFontSize"><span class="maxeditor-icon maxeditor-icon-font-plus"></span></a>
    <a title="减小字体" class="maxeditor-toolbar-item"
       @click="decreaseFontSize"><span
      class="maxeditor-icon maxeditor-icon-font-minus"></span></a>-->
    <a class="maxeditor-toolbar-item"
       :class="{'maxeditor-bgcolor-gainsboro':current_pop_menu==='textColor'}"
       @click="current_pop_menu==='textColor'?current_pop_menu='':current_pop_menu='textColor'">
      <span title="字体颜色" class="maxeditor-icon maxeditor-icon-tint"></span>
      <div v-show="current_pop_menu==='textColor'" class="maxeditor-btn-menu-textcolor">
        <div @click="changeTextColor('white')"
             style="width: 20px;height: 20px;position: relative;display: inline-block;background-color: white;outline: gray auto 1px;"></div>
        <div @click="changeTextColor('grey')"
             style="width: 20px;height: 20px;position: relative;display: inline-block;background-color: grey"></div>
        <div @click="changeTextColor('black')"
             style="width: 20px;height: 20px;position: relative;display: inline-block;background-color: black"></div>
        <div @click="changeTextColor('red')"
             style="width: 20px;height: 20px;position: relative;display: inline-block;background-color: red"></div>
        <div @click="changeTextColor('yellow')"
             style="width: 20px;height: 20px;position: relative;display: inline-block;background-color: yellow"></div>
        <div @click="changeTextColor('blue')"
             style="width: 20px;height: 20px;position: relative;display: inline-block;background-color: blue"></div>
        <div @click="changeTextColor('green')"
             style="width: 20px;height: 20px;position: relative;display: inline-block;background-color: green"></div>
        <div @click="changeTextColor('brown')"
             style="width: 20px;height: 20px;position: relative;display: inline-block;background-color: brown"></div>
      </div>
    </a>
    <a class="maxeditor-toolbar-item"
       :class="{'maxeditor-bgcolor-gainsboro':current_pop_menu==='bgColor'}"
       @click="current_pop_menu==='bgColor'?current_pop_menu='':current_pop_menu='bgColor'">
      <span title="背景颜色" class="maxeditor-icon maxeditor-icon-tint"></span>
      <div v-show="current_pop_menu==='bgColor'" class="maxeditor-btn-menu-textcolor">
        <div @click="changeBgColor('white')"
             style="width: 20px;height: 20px;position: relative;display: inline-block;background-color: white;outline: gray auto 1px;"></div>
        <div @click="changeBgColor('grey')"
             style="width: 20px;height: 20px;position: relative;display: inline-block;background-color: grey"></div>
        <div @click="changeBgColor('black')"
             style="width: 20px;height: 20px;position: relative;display: inline-block;background-color: black"></div>
        <div @click="changeBgColor('red')"
             style="width: 20px;height: 20px;position: relative;display: inline-block;background-color: red"></div>
        <div @click="changeBgColor('yellow')"
             style="width: 20px;height: 20px;position: relative;display: inline-block;background-color: yellow"></div>
        <div @click="changeBgColor('blue')"
             style="width: 20px;height: 20px;position: relative;display: inline-block;background-color: blue"></div>
        <div @click="changeBgColor('green')"
             style="width: 20px;height: 20px;position: relative;display: inline-block;background-color: green"></div>
        <div @click="changeBgColor('brown')"
             style="width: 20px;height: 20px;position: relative;display: inline-block;background-color: brown"></div>
      </div>
    </a>
    <a class="maxeditor-toolbar-item-separator"></a>
    <a title="居中对齐" class="maxeditor-toolbar-item" :class="{'maxeditor-bgcolor-gainsboro':command.justifycenter}"
       @click="document.execCommand('justifycenter', false, null)"><span
      class="maxeditor-icon maxeditor-icon-align-center"></span></a>
    <a title="居左对齐" class="maxeditor-toolbar-item" :class="{'maxeditor-bgcolor-gainsboro':command.justifyleft}"
       @click="document.execCommand('justifyleft', false, null)"><span
      class="maxeditor-icon maxeditor-icon-align-left"></span></a>
    <a title="居右对齐" class="maxeditor-toolbar-item" :class="{'maxeditor-bgcolor-gainsboro':command.justifyright}"
       @click="document.execCommand('justifyright', false, null)"><span
      class="maxeditor-icon maxeditor-icon-align-right"></span></a>
    <a class="maxeditor-toolbar-item-separator"></a>

    <div v-show="isModeBtnShow" class="maxeditor-p-b-10 maxeditor-p-t-10">
      <button title="插入分隔线" class="maxeditor-toolbar-button maxeditor-m-l-15"
              @click="addHr">分隔线
      </button>
      <button title="插入文本框" class="maxeditor-toolbar-button"
              @click="addSection">文本框
      </button>
      <button title="插入不可编辑文本" class="maxeditor-toolbar-button"
              @click="addReadOnlySection">不可编辑文本
      </button>
      <button title="插入带标题文本框" class="maxeditor-toolbar-button"
              @click="addSectionWithTitle">文本框（带标题）
      </button>
      <button title="插入带标签文本" class="maxeditor-toolbar-button"
              @click="addTextWithLabel">文本（带标签）
      </button>
      <button title="插入带标签下拉框" class="maxeditor-toolbar-button"
              @click="addDropDownWithLabel">下拉框（带标签）
      </button>
      <button title="插入图片容器" class="maxeditor-toolbar-button"
              @click="addImgBox">图片容器
      </button>
      <button title="插入表格" class="maxeditor-toolbar-button"
              @click="addTable">表格
      </button>
      <button title="清空编辑器" class="maxeditor-toolbar-button"
              @click="clearBoards">清空编辑器
      </button>
      <br/>

      <button title="设计模式" class="maxeditor-toolbar-button maxeditor-m-l-15 maxeditor-m-t-10"
              :class="{'maxeditor-toolbar-button-disable':maxeditor_mode!=='design'}"
              @click="setMode('design')">设计模式
      </button>
      <button title="编辑模式" class="maxeditor-toolbar-button maxeditor-m-t-10"
              :class="{'maxeditor-toolbar-button-disable':maxeditor_mode!=='edit'}"
              @click="setMode('edit')">编辑模式
      </button>
      <button title="只读模式" class="maxeditor-toolbar-button maxeditor-m-t-10"
              :class="{'maxeditor-toolbar-button-disable':maxeditor_mode!=='readonly'}"
              @click="setMode('readonly')">只读模式
      </button>


      <div class="maxeditor-float-r maxeditor-m-t-10"
           v-show="maxeditor_mode==='design'&&(maxeditor_current_board.type==='normal'
         ||maxeditor_current_board.type==='label'||maxeditor_current_board.type==='imgBox'||maxeditor_current_board.type==='table')">
        <!-- <button title="修改z-index"
                 class="maxeditor-toolbar-button maxeditor-float-r"
                 @click="updateZ">修改z-index:{{maxeditor_current_board.z}}
         </button>-->
        <button title="修改title"
                class="maxeditor-toolbar-button maxeditor-float-r maxeditor-m-r-15"
                v-if="maxeditor_current_board.type==='normal'"
                @click="updateTitle">修改title:{{maxeditor_current_board.title}}
        </button>
        <button title="修改label"
                class="maxeditor-toolbar-button maxeditor-float-r maxeditor-m-r-15"
                v-if="maxeditor_current_board.type==='label'"
                @click="updateLabel">修改label:{{maxeditor_current_board.label}}
        </button>
        <button title="修改id"
                class="maxeditor-toolbar-button maxeditor-float-r maxeditor-m-r-15"
                @click="updateId">修改id:{{maxeditor_current_board.id}}
        </button>
        <button title="面板类型"
                class="maxeditor-toolbar-button maxeditor-float-r maxeditor-m-r-15">
          面板类型:{{maxeditor_current_board.type}}
        </button>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    name: "maxeidtor-toolbar",
    props: {
      width: '',
      paddingX: '',
      maxeditor_mode: '',
      maxeditorRootId: '',
      isModeBtnShow: '',
      maxeditor_current_board: {
        type: Object,
        default() {
          return {
            type: ''
          }
        }
      }
    },
    directives: {

    },
    data() {
      return {
        document: window.document,
        menu_normal_show: false,
        current_pop_menu: '',
        command: {
          bold: false,
          italic: false,
          underline: false,
          strikeThrough: false,
          justifycenter: false,
          justifyleft: false,
          justifyright: false,
        }
      }
    },
    methods: {
      //表格


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
      addReadOnlySection() {
        if (this.$parent.maxeditor_mode !== 'design') {
          alert('当前模式不可插入板块');
          return
        }
        let id = prompt('请输入id');
        this.$parent.addReadOnlySection(id)
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
      addDropDownWithLabel() {
        if (this.$parent.maxeditor_mode !== 'design') {
          alert('当前模式不可插入板块');
          return
        }
        let id = prompt('请输入id');
        let label = prompt('请输入标签');
        let datalist = prompt('请输入下拉数组');
        this.$parent.addDropDownWithLabel(id, label, datalist)
      },
      addImgBox() {
        if (this.$parent.maxeditor_mode !== 'design') {
          alert('当前模式不可插入板块');
          return
        }
        let id = prompt('请输入id');
        this.$parent.addImgBox(id)
      },
      addTable() {
        if (this.$parent.maxeditor_mode !== 'design') {
          alert('当前模式不可插入板块');
          return
        }
        let id = prompt('请输入id');
        this.$parent.addTable(id);
      },
      setMode(mode) {
        this.$parent.maxeditor_mode = mode
      },
      updateId() {
        let id = prompt('请输入id', '');
        this.$parent.updateId(this.maxeditor_current_board.id, id);
      },
      updateTitle() {
        let title = prompt('请输入title');
        this.$parent.updateTitle(this.maxeditor_current_board.id, title);
      },
      updateZ() {
        let z = prompt('请输入z-index');
        this.$parent.updateZ(this.maxeditor_current_board.id, z);
      },
      updateLabel() {
        let label = prompt('请输入label');
        this.$parent.updateLabel(this.maxeditor_current_board.id, label);
      },
      clearBoards() {
        this.$parent.clearBoards();
      },

      //弹出菜单
      hidePopMenu(event){
        try{
          if (event.target.className !== 'maxeditor-toolbar-item'){
            this.current_pop_menu='';
          }
        }catch (e) {

        }
      },

      //编辑方法
      //改变背景色
      changeBgColor(color) {
        let selection = document.getSelection();
        let selectionText = selection.toString();
        let range = selection.getRangeAt(0);
        let span = document.createElement('span');
        span.style.backgroundColor = color;
        range.surroundContents(span);
      },
      //改变字体颜色
      changeTextColor(color) {
        let selection = document.getSelection();
        if (!selection) {
          return
        }
        let selectionText = selection.toString();
        let range = selection.getRangeAt(0);
        let span = document.createElement('span');
        span.style.color = color;
        range.surroundContents(span);
      },
      //设置字号
      setFontSize(size) {
        //size为string
        document.execCommand('fontsize', false, size)
      },
      //增大字号
      increaseFontSize() {
        //选区用span截断，防止整行文本操作
        document.execCommand('formatblock', false, '<span>');
        let selection = document.getSelection();
        //未选择文本返回
        if (selection.isCollapsed) {
          return;
        }
        let fs = selection.baseNode.parentElement.style.fontSize;
        let selectionEl = selection.baseNode.parentElement;
        if (!fs) {
          fs = '16px'
        }
        fs = parseInt(fs) + 1;
        fs += 'px';
        selectionEl.style.fontSize = fs;
      },
      //减小字号
      decreaseFontSize() {
        //选区用span截断，防止整行文本操作
        document.execCommand('formatblock', false, '<span>');
        let selection = document.getSelection();
        //未选择文本返回
        if (selection.isCollapsed) {
          return;
        }
        let fs = selection.baseNode.parentElement.style.fontSize;
        let selectionEl = selection.baseNode.parentElement;
        if (!fs) {
          fs = '16px'
        }
        fs = parseInt(fs) - 1;
        fs += 'px';
        selectionEl.style.fontSize = fs;
      }
    },
    mounted() {
      this.$parent.toolBarLeft = this.$refs.maxEditorToolbar.getBoundingClientRect().left;
      //监听选区改变，高频事件
      let command = this.command;
      document.onselectionchange = function (e) {
        command.bold = document.queryCommandState('bold');
        command.italic = document.queryCommandState('italic');
        command.underline = document.queryCommandState('underline');
        command.strikeThrough = document.queryCommandState('strikeThrough');
        command.justifycenter = document.queryCommandState('justifycenter');
        command.justifyleft = document.queryCommandState('justifyleft');
        command.justifyright = document.queryCommandState('justifyright');
      };
      //点击弹出菜单外部是隐藏弹出菜单
      document.addEventListener('click', this.hidePopMenu(event))
    },
    created() {
      console.log(this.width)
      console.log(this.width + this.paddingX * 2)
      console.log(this.width + this.paddingX * 2 + 'px')
    },
    watch: {}
  }
</script>

<style scoped>

</style>
