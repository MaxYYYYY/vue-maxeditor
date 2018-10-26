<template>
  <div class="maxeditor-root">
    <maxeditor-toolbar ref="maxeditor-toolbar" :class="{'maxeditor-fix2top':toolBarFixed}"
                       :maxeditor_mode="maxeditor_mode"
                       :maxeditor_current_board="maxeditor_boards[maxeditor_current_index]">
    </maxeditor-toolbar>
    <div class="maxeditor-body" id="maxeditor-body">
      <div class="maxeditor-body-inner" ref="maxEditorBodyInner">
        <maxeditor-board
          class="maxeditor-board"
          v-for="(item, index) in maxeditor_boards"
          :id="item.id"
          :key="item.id"
          :is="item.component"
          :grid="item.type==='hr'||item.type==='imgBox'?[1,1]:[25,25]"
          :parent="true"
          :class="{'maxeditor-board-fluid':item.isFluid}"
          :x="item.x===undefined||item.x===null?0:item.x"
          :y="item.y===undefined||item.y===null?0:item.y"
          :z="item.z"
          :w="item.width===undefined||item.width===null?200:item.width"
          :h="item.height===undefined||item.height===null?item.type==='hr'?20:200:item.height"
          :drag-handle="'.maxeditor-icon-move'"
          :handles="item.type==='hr'?[]:item.isFluid?['tm','bm']:item.type==='label'?['ml','mr']:['tl','tm','tr','ml','mr','bl','bm','br']"
          v-bind:axis="item.type==='hr'?'y':item.isFluid?'y':'both'"
          @click="onActivated(index)"
          @resizing="onResize"
          @dragging="onDrag"
          @activated="onActivated(index)"
          @deactivated="onDeactivated(index)">
          <!--面板标题-->
          <template v-if="item.type==='normal'&&item.title!==null&&item.title!==undefined">
            <div class="maxeditor-board-titile">{{item.title}}:</div>
          </template>
          <template v-if="item.type === 'normal'">
            <div contenteditable="true" style="width: 100%;height: 100%"
                 v-bind:contenteditable="(maxeditor_mode === 'design'||maxeditor_mode === 'edit')"
                 :id="item.id+'_content'"
                 :class="{'maxeditor-board-outline':maxeditor_mode!=='readonly'}"
                 @focus="onActivated(index)"
                 @click="onActivated(index)"
                 @keyup="onActivated(index)">
            </div>
          </template>
          <template v-if="item.type === 'label'">
            <p><span style="float: left;width: 65px;"
                     :class="{'maxeditor-single-line':getCharacterNum(item.label)>3,
                              'maxeditor-text-justify':getCharacterNum(item.label)<4}">{{item.label}}
              </span>
              <span style="float: left;">:</span>
              <span v-bind:contenteditable="(maxeditor_mode === 'design'||maxeditor_mode === 'edit')"
                    :id="item.id+'_content'"
                    class="maxeditor-single-line"
                    :class="{'maxeditor-board-outline':maxeditor_mode!=='readonly'}"
                    style="float: left;"
                    :style="{'width':item.width-70+'px'}"
                    @click="onActivated(index)"
                    @keyup="onActivated(index)"></span></p>
          </template>
          <template v-if="item.type === 'imgBox'">
            <div style="width: 100%;height: 100%"
                 :class="{'maxeditor-board-outline':maxeditor_mode!=='readonly'}"
                 @click="onActivated(index)"
                 :id="item.id+'_imgBox'">
              <div style="text-align: center">
                <template v-for="img in item.imgs">
                  <img :src="img.src"
                       :style="{'width':item.imgs.length===1?'100%':'160px','margin':item.imgs.length===1?'0':'4px'}"/>
                </template>
              </div>
            </div>
          </template>
          <template v-if="item.type === 'hr'">
            <div style="height: 20px;width: 100%;padding-top: 20px" @click="onActivated(index)">
              <hr/>
            </div>
          </template>
          <template v-if="item.type === ''">
          </template>
          <div class="maxeditor-board-toolbar"
               v-if="maxeditor_mode==='design'"
               :style="{'margin-left':item.type==='hr'?'325px':''}"
               :class="{'maxeditor-board-toolbar-active':item.id===maxeditor_current_id}">
            <span class="maxeditor-icon-move"></span>
            <span class="maxeditor-icon-delete" @click="deleteBoard(index)"></span>
            <span class="maxeditor-icon maxeditor-icon-upzindex" @click="upZindex(index)"
                  title="上移一层"></span>
            <span class="maxeditor-icon maxeditor-icon-downzindex" @click="downZindex(index)"
                  title="下移一层"></span>
            <span class="maxeditor-icon" @click="changeFluidState(index)" v-if="item.type!=='hr'&&item.type!=='label'"
                  :class="{'maxeditor-icon-checklist':item.isFluid,'maxeditor-icon-uncheck':!item.isFluid}"
                  title="宽度占满"><span style="font-size: 20px;">宽度占满</span></span>
            <span class="maxeditor-icon" style="font-size: 20px;">id:{{item.id}}</span>
            <span class="maxeditor-icon" style="font-size: 20px;">z-index:{{item.z}}</span>
          </div>
        </maxeditor-board>
      </div>
    </div>
  </div>

</template>

<script>
  import VueDraggableResizable from 'vue-draggable-resizable';
  import MaxEditorToolbar from './maxeidtor-toolbar.vue'

  export default {
    name: "maxeditor",
    data() {
      return {
        window: window,
        document: window.document,//
        maxeditor_boards: [],//
        maxeditor_mode: 'design',
        maxeditor_current_id: '',//当前编辑面板，值为id
        maxeditor_current_index: undefined,
        toolBarFixed: false,

      }
    },
    components: {
      'maxeditor-toolbar': MaxEditorToolbar,
      'maxeditor-board': VueDraggableResizable,
    },
    methods: {
      //全局方法
      addSection(id) {
        this.addBoard({id: id, type: 'normal', isFluid: true, z: 999})
      },
      addSectionWithTitle(id, title) {
        if (title === undefined || title === null) {
          alert('请输入标题');
          return
        }
        this.addBoard({id: id, title: title, type: 'normal', isFluid: true, z: 999})
      },
      addTextWithLabel(id, label) {
        if (label === undefined || label === null) {
          alert('请输入标签');
          return
        }
        this.addBoard({
          id: id,
          label: label,
          type: 'label',
          isFluid: false,
          width: 100,
          height: 25,
          x: 75,
          z: 1025
        })
      },
      addHr() {
        this.addBoard({type: 'hr', isFluid: true, z: 1050})
      },
      addImgBox(id) {
        this.addBoard({id: id, type: 'imgBox', isFluid: false, z: 999})
      },
      insertImg(id, imgs) {
        let temp = this.maxeditor_boards;
        let imgdata = JSON.parse(imgs);
        for (let i = 0; i < temp.length; i++) {
          if (temp[i].id === id) {
            temp[i].imgs = imgdata;
            console.log('find it');
            break;
          }
        }
        console.log(temp);
        this.$set(this.maxeditor_boards, temp);
      },
      addBoard(option) {
        if (this.maxeditor_mode !== 'design') {
          alert('当前模式不可插入板块');
          return
        }
        if (option.id === '' || option.id === null || option.id === undefined) {
          if (option.type === 'hr') {
            option.id = 'maxeditor-board-hr-' + this.maxeditor_boards.length
          } else {
            alert('请输入id');
            return
          }
        }
        for (let i = 0; i < this.maxeditor_boards.length; i++) {
          if (this.maxeditor_boards[i].id === option.id) {
            alert('id已存在');
            return
          }
        }
        this.maxeditor_boards.push({
          component: 'maxeditor-board',
          id: option.id,
          type: option.type,
          isFluid: option.isFluid,
          title: option.title !== null && option.title !== undefined ? option.title : null,
          label: option.label !== null && option.label !== undefined ? option.label : null,
          x: option.x !== null && option.x !== undefined ? option.x : 0,
          z: option.z,
          width: option.width !== null && option.width !== undefined ? option.width : null,
          height: option.height !== null && option.height !== undefined ? option.height : null,
          imgs: null,
        });
        this.onActivated(this.maxeditor_boards.length - 1)
      },
      deleteBoard(index) {
        this.maxeditor_boards.splice(index, 1)
      },
      print() {
        /* //原html代码取出
         var html = document.getElementById('maxeditor-body').innerHTML;

         //生成iframe
         var iframe;
         try {
             iframe = document.createElement("<iframe id='ifr-max'></iframe>");
         } catch (e) {
             iframe = document.createElement("iframe");
             iframe.id = "ifr-max";
         }
         iframe.style.visibility = "hidden";

         //iframe插入
         document.body.append(iframe);

         var ifrMax = document.getElementById("ifr-max");
         ifrMax.contentWindow.document.getElementsByTagName("html")[0].innerHTML = html;
         ifrMax.contentWindow.print();*/

        //获取当前页的html代码
        var bodyhtml = document.getElementById('maxeditor-body').innerHTML;
        ;

        // 生成并打印ifrme
        var iframe;
        try {
          iframe = document.createElement("<iframe id='ifr-max'></iframe>");
        } catch (e) {
          iframe = document.createElement("iframe");
          iframe.id = "ifr-max";
        }
        //iframe.style.visibility = "hidden";
        iframe.style.width = "800px";


        //iframe插入
        document.body.append(iframe);


        var ifrMax = document.getElementById("ifr-max");
        ifrMax.contentWindow.document.getElementsByTagName("head")[0].innerHTML = document.getElementsByTagName('head')[0].innerHTML;
        ifrMax.contentWindow.document.getElementsByTagName("body")[0].innerHTML = bodyhtml;
        ifrMax.contentWindow.document.getElementsByTagName("body")[0].style.backgroundColor = 'red'
        //ifrMax.contentWindow.print();
        window.print()

      },

      //面板方法
      /*updateBoard(id, option) {
        console.log(option);
        let temp = this.maxeditor_boards;
        for (let i = 0; i < temp.length; i++) {
          if (temp[i].id === id) {
            for (let key in option) {
              temp[i].key = option[key];
            }

            this.$set(this.maxeditor_boards, temp);
            break;
          }
        }
      },*/
      updateId(oId, nId) {
        if (nId === undefined || nId === null) {
          return
        }
        for (let i = 0; i < this.maxeditor_boards.length; i++) {
          if (this.maxeditor_boards[i].id === nId) {
            console.log('id已存在');
            return
          }
        }
        let temp = this.maxeditor_boards;
        for (let i = 0; i < temp.length; i++) {
          if (temp[i].id === oId) {
            temp[i].id = nId;
            this.$set(this.maxeditor_boards, temp);
            break;
          }
        }
      },
      updateTitle(id, title) {
        if (title === undefined || title === null) {
          return
        }
        let temp = this.maxeditor_boards;
        for (let i = 0; i < temp.length; i++) {
          if (temp[i].id === id) {
            temp[i].title = title;
            this.$set(this.maxeditor_boards, temp);
            break;
          }
        }
      },
      updateLabel(id, label) {
        if (label === undefined || label === null) {
          console.log('请输入id');
          return
        }
        let temp = this.maxeditor_boards;
        for (let i = 0; i < temp.length; i++) {
          if (temp[i].id === id) {
            temp[i].label = label;
            this.$set(this.maxeditor_boards, temp);
            break;
          }
        }
      },
      updateZ(id, zindex) {
        if (zindex === undefined || zindex === null) {
          console.log('请输入id');
          return
        }
        let temp = this.maxeditor_boards;
        for (let i = 0; i < temp.length; i++) {
          if (temp[i].id === id) {
            temp[i].z = zindex;
            this.$set(this.maxeditor_boards, temp);
            break;
          }
        }
      },
      setMode(mode) {
        this.maxeditor_mode = mode
      },
      getMode() {
        return this.maxeditor_mode
      },
      getBoards() {
        return JSON.stringify(this.maxeditor_boards)
      },
      setBoards(boards) {
        /*if (typeof boards !== "object") {
          this.maxeditor_boards = JSON.parse(boards);
        }*/
        this.maxeditor_boards = JSON.parse(boards);

        this.$nextTick(function () {
          this.maxeditor_boards.forEach(function (item, index) {
            if (item.content !== undefined) {
              document.getElementById(item.id + '_content').innerHTML = item.content
            }
          });
        })
      },

      onResize(x, y, width, height) {
        try {
          this.maxeditor_boards[this.maxeditor_current_index].x = x;
          this.maxeditor_boards[this.maxeditor_current_index].y = y;
          this.maxeditor_boards[this.maxeditor_current_index].width = width;
          this.maxeditor_boards[this.maxeditor_current_index].height = height;
        } catch (e) {

        }
      },
      onDrag(x, y) {
        try {
          this.maxeditor_boards[this.maxeditor_current_index].x = x;
          this.maxeditor_boards[this.maxeditor_current_index].y = y;
        } catch (e) {
        }
        /* if (this.maxeditor_boards[this.maxeditor_current_index].x<25&&this.maxeditor_boards[this.maxeditor_current_index].type==='label'){
             this.maxeditor_boards[this.maxeditor_current_index].x = 25
         }*/
      },
      onActivated(index) {
        console.log('onActivated' + index);
        this.current_selection = this.document.getSelection();
        this.maxeditor_current_id = this.maxeditor_boards[index].id;
        this.maxeditor_current_index = index;
        try {
          this.maxeditor_boards[index].content = document.getElementById(this.maxeditor_current_id + "_content").innerHTML;
        } catch (e) {

        }
      },
      onDeactivated(index) {
        console.log('onDeactivated' + index);
        this.maxeditor_current_id = '';
        this.maxeditor_current_index = undefined;
      },
      //改变面板状态
      activeBoard(id) {
        /*for (let i = 0; i < this.maxeditor_boards.length; i++) {
          if (this.maxeditor_boards[i].id === id) {
            if (this.maxeditor_current_id === id) {
              console.log(id + ' is already activated.');
            } else {
              this.onActivated(i)
            }
          }
        }*/
        document.getElementById(id + '_content').focus();
      },
      deactiveBoard(id) {
        /*for (let i = 0; i < this.maxeditor_boards.length; i++) {
          if (this.maxeditor_boards[i].id === id) {
            if (this.maxeditor_current_id === id) {
              this.onDeactivated(i);
            } else {
              console.log(id + ' is not active already.');
            }
          }
        }*/
        document.getElementById(id + '_content').blur();
      },
      upZindex(index) {
        this.maxeditor_boards[index].z += 1;
      },
      downZindex(index) {
        this.maxeditor_boards[index].z -= 1;
      },
      changeFluidState(index) {
        //面板靠左贴边时才能切换为全屏
        if (this.maxeditor_boards[index].x === 0) {
          let temp = this.maxeditor_boards;
          temp[index].isFluid = !temp[index].isFluid;
          if (temp[index].isFluid) {
            temp[index].x = 0;
            this.$set(this.maxeditor_boards, temp);
          }
        }
      },

      getCurrentBoardContent() {
        let index = this.maxeditor_current_index;
        let id = this.maxeditor_current_id;
        if (id === null || id === undefined || index === null || index === undefined) {
          alert('没有正在编辑的面板');
          return
        }
        //alert(document.getElementById(this.maxeditor_current_id + "_content").innerHTML)
        return this.maxeditor_boards[this.maxeditor_current_index].content
      },
      getCurrentBoardId() {
        return this.maxeditor_current_id;
      },
      getBoardContentText(id) {
        for (let i = 0; i < this.maxeditor_boards.length; i++) {
          if (this.maxeditor_boards[i].id === id) {
            return document.getElementById(id + '_content').innerText;
          }
        }
        alert('id不存在')
      },
      getBoardContent(id) {
        for (let i = 0; i < this.maxeditor_boards.length; i++) {
          if (this.maxeditor_boards[i].id === id) {
            return this.maxeditor_boards[i].content;
          }
        }
        alert('id不存在')
      },
      setBoardContent(id, content) {
        let temp = this.maxeditor_boards;
        for (let i = 0; i < temp.length; i++) {
          if (temp[i].id === id) {
            temp[i].content = content;
            this.$set(this.maxeditor_boards, temp);
            this.$nextTick(function () {
              document.getElementById(id + '_content').innerHTML = this.maxeditor_boards[i].content
            });
            return
          }
        }
        alert('id不存在')
      },


      //编辑文本方法

      //光标处插入下拉框
      editInsertDatalist(id, values) {
        values = JSON.parse(values);
        let input = '<input id="' + id + 'dropDownInput" list="' + id + 'list" class="maxeditor-inner-dropdown" />';
        let option = '';
        for (let i = 0; i < values.length; i++) {
          option += '<option value="' + values[i].value + '">'
        }
        let datalist = '<datalist id="' + id + 'list">' + option + "</datalist>";

        document.execCommand('insertHtml', false, input + datalist);
      },

      editInsertText(text) {
        document.execCommand('insertText', false, text)
      },

      //其他方法
      //菜单栏滚动到顶部时固定
      handleToolbarScroll() {
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        var offsetTop = document.getElementById('maxeditor-toolbar').offsetTop;
        if (scrollTop > offsetTop) {
          this.toolBarFixed = true
        } else {
          this.toolBarFixed = false
        }
      },
      //计算文本中汉字个数
      getCharacterNum(text) {
        if (text === undefined || text === null) {
          console.log(text)
          return 0;
        }
        let num = text.match(/[\u4E00-\u9FA5]/g);
        if (num === undefined || num === null) {
          //字母和数字两个算一个
          let tnum = text.match(/[^a-zA-Z0-9\u4e00-\u9fa5]/g);
          if (tnum !== undefined && tnum !== null) {
            return tnum/2;
          }
          return 0;
        }
        return text.match(/[\u4E00-\u9FA5]/g).length;
      }

    },
    mounted() {
      window.addEventListener('scroll', this.handleToolbarScroll)
    },
    watch: {
      maxeditor_mode(n, o){
        console.log(n+':'+o)
        if (n==='readonly'){
          console.log('true')
          let list = document.getElementsByClassName('maxeditor-inner-dropdown');
          for(let i=0;i<list.length;i++){
            list[i].setAttribute('readonly','true')
          }
        }else {
          console.log('false')
          let list = document.getElementsByClassName('maxeditor-inner-dropdown');
          for(let i=0;i<list.length;i++){
            list[i].removeAttribute('readonly')
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>
