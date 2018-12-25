<template>
  <div class="maxeditor-toolbar maxeditor-toolbar-responsive"
       :id="'maxeditor-toolbar-'+maxeditorRootId"
       :ref="'maxeditor-toolbar-'+maxeditorRootId"
       style=""
       :style="{'width': width+paddingX*2+'px'}">
    <div :id="'maxeditor-toolbar-'+maxeditorRootId+'-a'"
         :ref="'maxeditor-toolbar-'+maxeditorRootId+'-a'">
      <a class="maxeditor-toolbar-item" style="width: 100px" @click="hideMenu">隐藏菜单</a>
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
        <span title="字体大小" class="maxeditor-icon maxeditor-icon-font"></span>
        <div v-show="current_pop_menu==='fontSize'" class="maxeditor-btn-menu-fontsize">
          <div @click="document.execCommand('fontsize',false,'7')" class="maxeditor-hoverable"><font size="7">超大</font>
          </div>
          <div @click="document.execCommand('fontsize',false,'6')" class="maxeditor-hoverable"><font size="6">特大</font>
          </div>
          <div @click="document.execCommand('fontsize',false,'5')" class="maxeditor-hoverable"><font size="5">比较大</font>
          </div>
          <div @click="document.execCommand('fontsize',false,'4')" class="maxeditor-hoverable"><font size="4">稍大</font>
          </div>
          <div @click="document.execCommand('fontsize',false,'3')" class="maxeditor-hoverable"><font size="3">正常</font>
          </div>
          <div @click="document.execCommand('fontsize',false,'2')" class="maxeditor-hoverable"><font size="2">小</font>
          </div>
          <div @click="document.execCommand('fontsize',false,'1')" class="maxeditor-hoverable"><font size="1">超小</font>
          </div>
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
    </div>
    <a class="maxeditor-toolbar-item" @click="showMenu"
       :id="'maxeditor-toolbar-'+maxeditorRootId+'-showbtn'"
       :ref="'maxeditor-toolbar-'+maxeditorRootId+'-showbtn'"
       style="width: 100px;display: none">显示菜单</a>
    <div v-if="isModeBtnShow"
         class="maxeditor-p-b-10"
         :id="'maxeditor-toolbar-'+maxeditorRootId+'-b'"
         :ref="'maxeditor-toolbar-'+maxeditorRootId+'-b'">
      <button style="display: none"></button>
      <button title="插入分隔线" class="maxeditor-toolbar-button maxeditor-m-l-15"
              @click="addHr">分隔线
      </button>
      <button title="插入文本框" class="maxeditor-toolbar-button"
              @click="openDialog('文本框')">文本框
      </button>
      <button title="插入带标签文本" class="maxeditor-toolbar-button"
              @click="openDialog('标签文本')">标签文本
      </button>
      <button title="插入下拉框" class="maxeditor-toolbar-button"
              @click="openDialog('下拉框')">下拉框
      </button>
      <button title="插入图片容器" class="maxeditor-toolbar-button"
              @click="openDialog('图片框')">图片框
      </button>
      <button title="插入表格" class="maxeditor-toolbar-button"
              @click="openDialog('表格')">表格
      </button>
      <button title="清空编辑器" class="maxeditor-toolbar-button"
              @click="clearBoards">清空编辑器
      </button>

      <button title="插入关键词" class="maxeditor-toolbar-button maxeditor-m-t-10"
              @click="editInsertKeyWord">关键词
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
    <!--弹出框-->
    <transition name="animation">
      <div v-if="isDialogShow"
           class="maxeditor-toolbar-dialog-bg"
           :style="{'height':viewPortHeight+134+'px'}">
        <div class="maxeditor-toolbar-dialog">
        <span class="maxeditor-icon maxeditor-icon-times maxeditor-hover-rotate"
              style="position: absolute;right: 10px;top: 8px;font-size: 20px;color: grey;"
              @click="closeDialog"></span>
          <div style="font-size: 25px;text-align: center">插入组件-{{dialog_title}}</div>
          <transition name="animation">
            <div v-if="dialog_error" class="maxeditor-m-t-10" style="color: red;">{{dialog_error}}</div>
          </transition>
          <div class="maxeditor-m-t-10">
            <span style="width: 75px;display: inline-block">ID</span>
            <span style="display: inline-block">:</span>
            <input class="maxeditor-board-outline"
                   v-model="dialog_data.id"
                   style="width: 200px;border: none;height: 20px;font-size: 16px"/>
            <span style="color:red;">*</span>
          </div>
          <div class="maxeditor-m-t-10" v-if="dialog_title==='文本框'">
            <span style="width: 75px;display: inline-block"
                  :style="{'color':this.dialog_data.writable?'':'grey'}">标题</span>
            <span style="display: inline-block">:</span>
            <input class="maxeditor-board-outline" :disabled="!dialog_data.writable"
                   v-model="dialog_data.title"
                   style="width: 200px;border: none;height: 20px;font-size: 16px"/>
          </div>
          <div class="maxeditor-m-t-10" v-if="dialog_title==='文本框'">
            <span style="width: 75px;display: inline-block">可编辑</span>
            <span style="display: inline-block">:</span>
            <label><input class="maxeditor-switch maxeditor-switch-anim" style="margin-bottom: -10px"
                          type="checkbox"
                          v-model="dialog_data.writable"></label>
          </div>
          <div class="maxeditor-m-t-10" v-if="dialog_title==='标签文本'||dialog_title==='下拉框'">
            <span style="width: 75px;display: inline-block">标签</span>
            <span style="display: inline-block">:</span>
            <input class="maxeditor-board-outline"
                   v-model="dialog_data.label"
                   style="width: 200px;border: none;height: 20px;font-size: 16px"/>
          </div>
          <div class="maxeditor-m-t-10" v-if="dialog_title==='下拉框'">
            <div style="width: 30%;text-align: center;display: inline-block;background-color: rgba(104, 166, 243, 0.34)">选项id</div>
            <div style="width: 30%;text-align: center;display: inline-block;background-color: rgba(104, 166, 243, 0.34)">选项value</div>

            <template v-for="(item, idx) in dialog_data.droplist">
              <div class="maxeditor-m-t-10">
                <input class="maxeditor-board-outline"
                       v-model="item.id"
                       style="width: 30%;border: none;height: 20px;font-size: 16px"/>
                <input class="maxeditor-board-outline"
                       v-model="item.value"
                       style="width: 30%;border: none;height: 20px;font-size: 16px"/>
                <button class="maxeditor-toolbar-button" style="width: 75px;background-color: grey"
                        @click="dialog_data.droplist.splice(idx,1)">删除选项
                </button>

              </div>
            </template>
            <button class="maxeditor-toolbar-button maxeditor-m-t-10" style="width: 75px;display: block"
                    @click="dialog_data.droplist.push({id:'',value:''})">增加选项
            </button>
          </div>

          <button class="maxeditor-toolbar-button maxeditor-m-t-10" style="float: right;width: 100px"
                  @click="confirmDialog()">确认
          </button>
          <button class="maxeditor-toolbar-button maxeditor-m-t-10 maxeditor-m-r-15"
                  style="float: right;width: 100px;background-color: grey" @click="closeDialog">取消
          </button>
        </div>
      </div>
    </transition>


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
      viewPortHeight: {type: Number, default: 500},//编辑器的视口高度
      isModeBtnShow: {type: Boolean, default: true},
      maxeditor_current_board: {
        type: Object,
        default() {
          return {
            type: ''
          }
        }
      }
    },
    directives: {},
    data() {
      return {
        document: window.document,
        menu_normal_show: false,
        current_pop_menu: '',
        isMenuCollapsed: false,
        isDialogShow: false,
        command: {
          bold: false,//加粗
          italic: false,//斜体
          underline: false,//下划线
          strikeThrough: false,//删除线
          justifycenter: false,//居中对齐
          justifyleft: false,//左对齐
          justifyright: false,//右对齐
        },
        dialog_title: '',
        dialog_error: '',
        dialog_data: {
          id: '',
          label: '',
          title: '',
          writable: true,
          droplist: [],//下拉框数组
        }
      }
    },
    methods: {
      //弹出窗封装
      closeDialog() {
        this.dialog_title = '';
        this.dialog_error = '';
        this.dialog_data.id = '';
        this.dialog_data.label = '';
        this.dialog_data.title = '';
        this.dialog_data.writable = true;
        this.dialog_data.droplist = [];
        this.isDialogShow = false;
      },
      openDialog(title) {
        if (this.$parent.maxeditor_mode !== 'design') {
          throw new Error('MaxEditor:非设计模式不可插入文本框');
        }
        this.dialog_title = title;
        this.isDialogShow = true;
      },

      confirmDialog() {
        let that = this;
        if (!this.dialog_data.id) {
          this.dialog_error = 'ID不能为空';
          return
        }
        switch (this.dialog_title) {
          case '文本框':
            if (!this.dialog_data.writable) {
              try {
                this.$parent.addReadOnlySection(this.dialog_data.id);
              } catch (e) {
                this.dialog_error = e.message;
                return
              }
            } else if (this.dialog_data.title) {
              try {
                this.$parent.addSectionWithTitle(this.dialog_data.id, this.dialog_data.title);
              } catch (e) {
                this.dialog_error = e.message;
                return
              }
            } else {
              try {
                this.$parent.addSection(this.dialog_data.id);
              } catch (e) {
                this.dialog_error = e.message;
                return
              }
            }
            break;
          case '标签文本':
            try {
              this.$parent.addTextWithLabel(this.dialog_data.id, this.dialog_data.label);
            } catch (e) {
              this.dialog_error = e.message;
              return
            }
            break;
          case '下拉框':
            if (0===this.dialog_data.droplist.length) {
              this.dialog_error = '下拉选项不能为空';
              return
            }
            if(this.dialog_data.label){
              try {
                this.$parent.addDropDownWithLabel(this.dialog_data.id,this.dialog_data.label,this.dialog_data.droplist)
              } catch (e) {
                this.dialog_error = e.message;
                return
              }
            }else {
              try {
                this.$parent.addDropDown(this.dialog_data.id,this.dialog_data.droplist)
              } catch (e) {
                this.dialog_error = e.message;
                return
              }
            }
            break;
          case '图片框':
            try {
              this.$parent.addImgBox(this.dialog_data.id)
            } catch (e) {
              this.dialog_error = e.message;
              return
            }
            break;
          case '表格':
            try {
              this.$parent.addTable(this.dialog_data.id)
            } catch (e) {
              this.dialog_error = e.message;
              return
            }
            break;
          default:
            break;
        }
        this.closeDialog();
      },
      //关键字
      editInsertKeyWord() {
        let id = prompt('请输入id');
        let values = prompt('values');
        this.$parent.editInsertKeyWord(id, values);
      },

      //表格


      addHr() {
        if (this.$parent.maxeditor_mode !== 'design') {
          throw new Error('MaxEditor:非设计模式不可插入分隔线');
        }
        this.$parent.addHr();
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

      //隐藏、显示菜单
      hideMenu() {
        let that = this;
        this.isMenuCollapsed = true;
        this.$refs['maxeditor-toolbar-' + this.maxeditorRootId + '-a'].style.display = 'none';
        this.$refs['maxeditor-toolbar-' + this.maxeditorRootId + '-showbtn'].style.display = 'block';
        try {
          if (this.isModeBtnShow)
            that.$refs['maxeditor-toolbar-' + that.maxeditorRootId + '-b'].style.display = 'none';
        } catch (e) {
          console.log(e)
        }
        this.$refs['maxeditor-toolbar-' + this.maxeditorRootId].style.width = '100px';
      },
      showMenu() {
        let that = this;
        let isModeBtnShow = this.isModeBtnShow;
        this.isMenuCollapsed = false;
        this.$refs['maxeditor-toolbar-' + this.maxeditorRootId].style.width = this.width + this.paddingX * 2 + 'px';
        setTimeout(function () {
          that.$refs['maxeditor-toolbar-' + that.maxeditorRootId + '-a'].style.display = 'block';
          that.$refs['maxeditor-toolbar-' + that.maxeditorRootId + '-showbtn'].style.display = 'none';
          try {
            if (isModeBtnShow)
              that.$refs['maxeditor-toolbar-' + that.maxeditorRootId + '-b'].style.display = 'block';
          } catch (e) {
            console.log(e)
          }
        }, 300)
      },

      //隐藏所有弹出菜单弹出菜单
      hidePopMenu(event) {
        try {
          if (event.target.className !== 'maxeditor-toolbar-item' && event.target.parentElement.className !== 'maxeditor-toolbar-item') {
            this.current_pop_menu = '';
          }
        } catch (e) {
          console.log(e)
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
      //监听选区改变，高频事件
      let command = this.command;
      let that = this;
      document.onselectionchange = function (e) {
        command.bold = document.queryCommandState('bold');
        command.italic = document.queryCommandState('italic');
        command.underline = document.queryCommandState('underline');
        command.strikeThrough = document.queryCommandState('strikeThrough');
        command.justifycenter = document.queryCommandState('justifycenter');
        command.justifyleft = document.queryCommandState('justifyleft');
        command.justifyright = document.queryCommandState('justifyright');
      };
      //点击弹出菜单外部时隐藏弹出菜单
      document.addEventListener('click', function (event) {
        that.hidePopMenu(event)
      })
    },
    created() {

    },
    watch: {}
  }
</script>

<style scoped>
  .animation-enter-active, .animation-leave-active {
    transition: opacity .3s;
  }

  .animation-enter, .animation-leave-to {
    opacity: 0;
  }
</style>
