<template>
  <div class="maxeditor-root" :id="maxEditorRootId">
    <maxeditor-toolbar ref="maxEditorToolbar" :class="{'maxeditor-fix2top':toolBarFixed}"
                       :style="{'left':toolBarFixed?toolBarLeft+'px':''}"
                       :width="width"
                       :padding-x="paddingX"
                       :maxeditor_mode="maxeditor_mode"
                       :maxeditor_current_board="maxeditor_boards[maxeditor_current_index]"
                       :is-mode-btn-show="isModeBtnShow"
                       :maxeditor-root-id="maxEditorRootId">
    </maxeditor-toolbar>
    <div class="maxeditor-body"
         :style="{'margin-top':toolBarFixed?'136px':'20px',
                  'width':width+'px','height':height+'px',
                  'padding-left':paddingX+'px','padding-right':paddingX+'px',
                  'padding-top':paddingY+'px','padding-bottom':paddingY+'px'}"
         @click="handleBodyClick">
      <div class="maxeditor-body-inner" ref="maxEditorBodyInner">
        <maxeditor-board
          class="maxeditor-board"
          v-for="(item, index) in maxeditor_boards"
          :style="{'z-index':index === maxeditor_current_index?maxeditor_mode==='design'?'200':'':''}"
          :id="item.id+'_'+maxEditorRootId"
          :key="item.id+'_'+maxEditorRootId"
          :is="item.component"
          :grid="item.type==='hr'||item.type==='imgBox'?[1,1]:[8,8]"
          :parent="true"
          :class="{'maxeditor-board-fluid':item.isFluid}"
          :x="item.x===undefined||item.x===null?0:item.x"
          :y="item.y===undefined||item.y===null?0:item.y"
          :z="isExited(item.z)?item.z:100"
          :w="item.width===undefined||item.width===null?200:item.width"
          :h="item.height===undefined||item.height===null?item.type==='hr'?20:200:item.height"
          :minh="14"
          :drag-handle="'.maxeditor-icon-move'"
          :handles="(item.type==='hr'||item.type==='table')?[]:item.isFluid?['tm','bm']:item.type==='label'?['ml','mr']:['tl','tm','tr','ml','mr','bl','bm','br']"
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
          <!--normal面板-->
          <template v-if="item.type === 'normal'">
            <div style="width: 100%;height: 100%"
                 v-bind:contenteditable="item.writable?maxeditor_mode!=='readonly':maxeditor_mode==='design'"
                 :id="item.id+'_content_'+maxEditorRootId"
                 :class="{'maxeditor-board-outline':maxeditor_mode==='readonly'?false:maxeditor_mode==='design'?true:isExited(item.title),
                          'maxeditor-single-line':item.isSingleLine}"
                 @focus="onActivated(index)"
                 @click="onActivated(index)"
                 @keyup="onActivated(index)">
            </div>
          </template>
          <!--label标题-->
          <template v-if="item.type === 'label'">
            <p style="height: 25px;margin: 0;position: relative">
              <span style="float: left;width: 65px;height: 25px"
                    class="maxeditor-single-line"
                    @click="onActivated(index)">{{item.label}}
              </span>
              <span style="float: left;margin-right: 5px">:</span>
              <span
                v-bind:contenteditable="(maxeditor_mode === 'design'||maxeditor_mode === 'edit')&&!isExited(item.datalist)"
                :id="item.id+'_content_'+maxEditorRootId"
                class="maxeditor-single-line"
                :class="{'maxeditor-board-outline':maxeditor_mode==='design'}"
                style="float: left;display: inline-block"
                :style="{'width':item.width-75+'px'}"
                @click="onActivated(index);maxeditor_current_dropdown = item.id"
                @keyup="onActivated(index)"></span>
              <span class="maxeditor-icon maxeditor-icon-caret-down"
                    style="position: absolute;right: -10px;top: 4px;"
                    v-if="(maxeditor_mode === 'design'||maxeditor_mode === 'edit')&&isExited(item.datalist)"
                    @click="changeDropDownState(item.id);maxeditor_current_index=index"></span>
            </p>
            <div class="maxeditor-dropdown"
                 v-if="maxeditor_current_dropdown===item.id&&(maxeditor_mode === 'design'||maxeditor_mode === 'edit')&&isExited(item.datalist)">
              <template v-for="(t, i) in item.datalist" v-if="isExited(item.datalist)">
                <p class="maxeditor-noselect"
                   @click="setDropDownValue(item.id,t.value);
                   maxeditor_current_dropdown = undefined;
                   maxeditor_boards[index].datalist_current = t.id;">{{t.value}}</p>
              </template>
            </div>
          </template>
          <!--imgBox面板-->
          <template v-if="item.type === 'imgBox'">
            <div style="width: 100%;height: 100%"
                 :class="{'maxeditor-board-outline':maxeditor_mode==='design'}"
                 @click="onActivated(index)"
                 :id="item.id+'_imgBox_'+maxEditorRootId">
              <div style="text-align: center" v-if="item.imgs!==null&&item.imgs!==undefined">
                <template v-for="(img, imgIdx) in item.imgs" v-if="item.imgs!==undefined&&item.imgs!==null">
                  <div style="display: inline-grid">
                    <div style="position: relative;">
                      <img :src="img.src" :id="item.id+'_imgDom_'+img.key+'_'+maxEditorRootId"
                           :style="{'width':item.imgs.length===1?'':'160px',
                                'height':item.imgs.length===1?item.height+'px':'',
                                'margin':item.imgs.length===1?'0':'4px'}"/>
                      <!--图片角标-->
                      <div style="position: absolute;
                      margin: 4px 4px 8px;height: 20px;width: 20px;"
                           v-show="isExited(img.tab)"
                           :style="{'background-color':isExited(img.tab)?isExited(img.tab)?img.tab.color:'white':'white'}"
                           :class="{'maxeditor-position-tl':isExited(img.tab)&&img.tab.position==='tl',
                                    'maxeditor-position-tr':isExited(img.tab)&&img.tab.position==='tr',
                                    'maxeditor-position-bl':isExited(img.tab)&&img.tab.position==='bl',
                                    'maxeditor-position-br':isExited(img.tab)&&img.tab.position==='br'}">{{imgIdx+1}}
                      </div>
                    </div>
                    <p style="text-align: center; margin: 0;">{{isExited(img.label)?img.label:''}}</p>
                  </div>
                </template>
              </div>
              <div :id="item.id+'_imgBox_qrCode_'+maxEditorRootId" v-if="!isExited(item.imgs)"></div>
              <!--图片标记-->
              <maxeditor-tab v-if="isExited(item.watchTo)"
                             v-for="(i, idx) in (isExited(item.watchTo)?maxeditor_boards[item.watchTo].imgs:[])"
                             :x="isExited(i.tabX)?i.tabX:0"
                             :y="isExited(i.tabY)?i.tabY:0"
                             :w="isExited(i.tabWidth)?i.tabWidth:20"
                             :h="isExited(i.tabHeight)?i.tabHeight:20"
                             :minh="15"
                             :minw="15"
                             :parent="true"
                             :handles="[]"
                             @click="maxeditor_current_index=index;maxeditor_current_tabImg_index=idx;"
                             @activated="maxeditor_current_index=index;maxeditor_current_tabImg_index=idx;"
                             @dragging="onImgTabDrag"
                             @resizing="onImgTabResize">
                <div style="background-color: white;width: 100%;height: 100%;text-align: center;cursor: pointer;"
                     :style="{'background-color':isExited(i.color)?i.color:'white'}" :title="i.key">
                  {{idx+1}}
                </div>
              </maxeditor-tab>
            </div>
          </template>
          <!--表格面板-->
          <template v-if="item.type === 'table'">
            <table class="maxeditor-table" contenteditable="true" @click="onActivated(index)">
              <tbody>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              </tbody>
            </table>
          </template>
          <!--hr面板-->
          <template v-if="item.type === 'hr'">
            <div style="height: 20px;width: 100%" @click="onActivated(index)">
              <hr/>
            </div>
          </template>
          <!--面板工具栏-->
          <div class="maxeditor-board-toolbar"
               v-show="maxeditor_mode==='design'"
               :style="{'margin-left':item.type==='hr'?'325px':''}"
               :class="{'maxeditor-board-toolbar-active':item.id===maxeditor_current_id}">
            <span class="maxeditor-icon-move"></span>
            <span class="maxeditor-icon-delete" @click="deleteBoard(index)"></span>
            <span class="maxeditor-icon maxeditor-icon-upzindex" @click="upZindex(index)"
                  title="上移一层"></span>
            <span class="maxeditor-icon maxeditor-icon-downzindex" @click="downZindex(index)"
                  title="下移一层"></span>
            <span class="maxeditor-icon" @click="changeSingeLineState(index)"
                  v-if="item.type==='normal'"
                  :class="{'maxeditor-icon-checklist':item.isSingleLine,
                           'maxeditor-icon-uncheck':!item.isSingleLine}"
                  title="单行文本"><span style="font-size: inherit;">单行</span></span>
            <span class="maxeditor-icon" @click="changeFluidState(index)"
                  v-if="item.type!=='hr'&&item.type!=='label'"
                  :class="{'maxeditor-icon-checklist':item.isFluid,'maxeditor-icon-uncheck':!item.isFluid}"
                  title="宽度占满"><span style="font-size: inherit;">宽度占满</span></span>
            <span class="maxeditor-icon">id:{{item.id}}</span>
            <span class="maxeditor-icon">z-index:{{item.z}}</span>
          </div>
        </maxeditor-board>
      </div>
    </div>
  </div>

</template>

<script>
  import VueDraggableResizable from 'vue-draggable-resizable';
  import MaxEditorToolbar from './maxeidtor-toolbar.vue';
  import QRCode from 'qrcodeautojs';

  export default {
    name: "maxeditor",
    props: {
      width: {default: 794},
      height: {default: 1124},
      paddingX: {default: 20},
      paddingY: {default: 20},
      isModeBtnShow: {default: false},//模式控制按钮显示
      maxEditorRootId: {type: String, default: 'maxEditor_00'}
    },
    data() {
      return {
        window: window,
        document: window.document,//
        maxeditor_boards: [],//
        maxeditor_mode: 'design',
        maxeditor_current_id: '',//当前编辑面板，值为id
        maxeditor_current_index: undefined,
        maxeditor_current_dropdown: undefined,
        maxeditor_current_tabImg_index: undefined,//维持带数字标记的图片当前操作的标记的索引
        toolBarFixed: false,
        toolBarLeft: 0,
      }
    },
    components: {
      'maxeditor-toolbar': MaxEditorToolbar,
      'maxeditor-board': VueDraggableResizable,
      'maxeditor-tab': VueDraggableResizable
    },
    methods: {
      //全局方法
      addBoard(option) {
        if (this.maxeditor_mode !== 'design') {
          throw new Error('MaxEditor:当前模式不可插入板块');
        }
        if (option.id === '' || option.id === null || option.id === undefined) {
          if (option.type === 'hr') {
            option.id = 'maxeditor-board-hr-' + this.maxeditor_boards.length
          } else {
            throw new Error('MaxEditor:缺少id,无法插入板块');
          }
        }
        this.checkId(option.id, function () {
          throw new Error('MaxEditor:id已存在,无法插入板块');
        }, function () {
        });

        let common = {
          component: 'maxeditor-board',
          id: this.isExited(option.id) ? option.id : 'maxeditor_default_id_' + this.maxeditor_boards.length + '',
          type: option.type,
          isFluid: option.isFluid,
          x: this.isExited(option.x) ? option.x : 0,
          y: this.isExited(option.y) ? option.y : 0,
          z: this.isExited(option.z) ? option.z : 100,
          width: this.isExited(option.width) ? option.width : null,
          height: this.isExited(option.height) ? option.height : null,
          minWidth: this.isExited(option.minWidth) ? option.minWidth : null,
          minHeight: this.isExited(option.minHeight) ? option.minHeight : null,
        };

        if (option.type === 'normal') {
          common.isSingleLine = this.isExited(option.isSingleLine) ? option.isSingleLine : false;
          common.title = this.isExited(option.title) ? option.title : null;
          common.writable = this.isExited(option.writable) ? option.writable : true;
        }

        if (option.type === 'label') {
          common.label = this.isExited(option.label) ? option.label : null;
          common.datalist = this.isExited(option.datalist) ? option.datalist : null;//下拉数组
          common.datalist_current = null;//当前选中项
        }

        if (option.type === 'imgBox') {
          common.imgs = this.isExited(option.imgs) ? option.imgs : null;
          common.imgTabs = this.isExited(option.imgTabs) ? option.imgTabs : null;
          common.watchTo = null;
          common.watchBy = null;
        }

        if (option.type === 'table') {

        }

        this.maxeditor_boards.push(common);
        this.onActivated(this.maxeditor_boards.length - 1)
      },
      getBoards() {
        return this.maxeditor_boards;
      },
      setBoards(boards) {
        try {
          if (typeof JSON.parse(boards) === "object") {
            boards = JSON.parse(boards)
          }
        } catch (e) {
        }
        this.maxeditor_boards = boards;
        let rootId = this.maxEditorRootId;
        this.$nextTick(function () {
          this.maxeditor_boards.forEach(function (item, index) {
            if (item.content !== undefined) {
              document.getElementById(item.id + '_content_' + rootId).innerHTML = item.content
            }
          });
        })
      },
      clearBoards() {
        this.maxeditor_boards = [];
      },
      addSection(id) {
        this.addBoard({id: id, type: 'normal', isFluid: true, z: 100})
      },
      addReadOnlySection(id) {
        this.addBoard({id: id, type: 'normal', isFluid: false, z: 100, writable: false, height: 24, width: 300})
      },
      addSectionWithTitle(id, title) {
        if (title === undefined || title === null || title === '') {
          throw new Error('MaxEditor:插入带标题文本框时未得到标题');
        }
        this.addBoard({id: id, title: title, type: 'normal', isFluid: true, z: 100})
      },
      addTextWithLabel(id, label) {
        if (!this.isExited(label)) {
          throw new Error('MaxEditor:插入带标签文本时未得到标签');
        }
        this.addBoard({
          id: id, label: label, type: 'label', isFluid: false, width: 125, height: 25, x: 75, z: 101
        })
      },
      addTable(id) {
        this.addBoard({id: id, type: 'table', isFluid: true, width: 600, z: 100})
      },
      addDropDownWithLabel(id, label, datalist) {
        if (!this.isExited(label)) {
          throw new Error('MaxEditor:插入带标签下拉框时未得到标签');
        }
        if (!this.isExited(datalist)) {
          throw new Error('MaxEditor:插入带标签下拉框时未得到列表');
        }
        if (typeof datalist !== 'object') {
          datalist = JSON.parse(datalist)
        }
        this.addBoard({
          id: id, label: label, type: 'label', isFluid: false, width: 150, height: 25, x: 75, z: 101, datalist: datalist
        })
      },
      updateDropDownList(id, datalist) {
        if (!this.isExited(datalist)) {
          throw new Error('MaxEditor:未传入下拉列表，无法更新下拉框');
        }
        if (typeof datalist !== "object") {
          datalist = JSON.parse(datalist)
        }
        let temp = this.maxeditor_boards;
        let index;
        this.checkId(id, function (i) {
          index = i;
        }, function () {
          throw new Error('MaxEditor:' + id + '不存在，无法更新下拉框');
        });
        temp[index].datalist = datalist;
        document.getElementById(id + '_content_' + this.maxEditorRootId).innerText = '';
        this.$set(this.maxeditor_boards, temp);
      },
      changeDropDownState(id) {
        if (this.isExited(this.maxeditor_current_dropdown)) {
          this.maxeditor_current_dropdown = undefined
        } else {
          this.maxeditor_current_dropdown = id;
        }
      },
      getDropDownList(id) {
        let temp = this.maxeditor_boards;
        let list;
        this.checkId(id, function (i) {
          list = temp[i].datalist;
        }, function () {
          throw new Error('MaxEditor:' + id + '不存在，无法获取下拉列表');
        });
        if (!this.isExited(list)) {
          throw new Error('MaxEditor:没有下拉列表，可能这个面板不是下拉框~');
        } else {
          return list;
        }
      },
      getDropDownCurrentItem(id) {
        let item;
        let temp = this.maxeditor_boards;
        this.checkId(id, function (index) {
          for (let i = 0; i < temp[index].datalist.length; i++) {
            if (temp[index].datalist[i].id === temp[index].datalist_current) {
              item = temp[index].datalist[i];
              break;
            }
          }
        }, function () {
          throw new Error('MaxEditor:' + id + '不存在，无法获取下拉列表当前选项');
        });
        if (this.isExited(item)) {
          return item;
        } else {
          console.log('MaxEditor:下拉框当前未选中选项')
        }
      },
      setDropDownCurrentItem(id, itemId) {
        let temp = this.maxeditor_boards;
        let dItem;
        let list;
        let index;
        this.checkId(id, function (i) {
          index = i;
          list = temp[i].datalist;
        }, function () {
          throw new Error('MaxEditor:' + id + '不存在，无法设置下拉框值');
        });
        if (this.isExited(list)) {
          list.forEach(function (item, index) {
            if (item.id === itemId) {
              dItem = item;
            }
          })
        }
        if (this.isExited(dItem)) {
          this.maxeditor_boards[index].datalist_current = dItem.id;
          this.setDropDownValue(id, dItem.value);
          this.maxeditor_current_index = index; //设置值后置顶
          return;
        }
        throw new Error('MaxEditor:下拉列表中找到不' + itemId);
      },
      setDropDownValue(id, value) {
        document.getElementById(id + '_content_' + this.maxEditorRootId).innerText = value
      },
      addHr() {
        this.addBoard({type: 'hr', isFluid: true, z: 101})
      },

      addImgBox(id) {
        this.addBoard({id: id, type: 'imgBox', isFluid: false, z: 101})
      },
      insertImg(id, imgs, cb = (imgDomList) => {
        console.log(imgDomList)
      }) {
        let temp = this.maxeditor_boards;
        let rootId = this.maxEditorRootId;
        let imgdata;
        if (typeof imgs === 'object') {
          imgdata = imgs;
        } else {
          imgdata = JSON.parse(imgs);
        }
        this.checkId(id, function (index) {
          //TODO 此处不要写死，后期必改
          try {
            document.getElementById(id + '_imgBox_qrCode_' + this.maxEditorRootId).innerHTML = '';//清空容器中二维码
          } catch (e) {
          }
          temp[index].imgs = imgdata;
        }, function () {
          throw new Error('MaxEditor:' + id + '不存在，无法插入图片');
        });
        this.$set(this.maxeditor_boards, temp);
        let doms = [];
        this.$nextTick(function () {
          imgdata.forEach(function (item, idx) {
            let dom = document.getElementById(id + '_imgDom_' + item.key + '_' + rootId);
            doms.push(dom)
          });
          cb(doms)
        })


      },
      deleteImg(id, key) {
        let temp = this.maxeditor_boards;
        this.checkId(id, function (index) {
          let isExit = false;
          temp[index].imgs.forEach(function (img, idx) {
            if (img.key === key) {
              temp[index].imgs.splice(idx, 1);
              isExit = true;
            }
          });
          if (!isExit) {
            throw new Error('MaxEditor:' + id + '中' + key + '不存在，无法删除图片');
          }
        }, function () {
          throw new Error('MaxEditor:' + id + '不存在，无法删除图片');
        });
        this.$nextTick(function () {
          this.$set(this.maxeditor_boards, temp)
        });
      },
      addImg(id, img, cb = (imgDom) => {
        console.log(imgDom)
      }) {
        try {
          if (typeof JSON.parse(img) === "object") {
            img = JSON.parse(img)
          }
        } catch (e) {
        }
        let temp = this.maxeditor_boards;
        this.checkId(id, function (index) {
          if (temp[index].imgs === null || temp[index].imgs === undefined) {
            temp[index].imgs = []
          }
          temp[index].imgs.push(img);
        }, function () {
          throw new Error('MaxEditor:' + id + '不存在，无法插入图片');
        });
        this.$set(this.maxeditor_boards, temp);
        this.$nextTick(function () {
          let imgDom = document.getElementById(id + '_imgDom_' + img.key + '_' + this.maxEditorRootId);
          cb(imgDom);
        });
      },
      getImg(id, key) {
        let temp = this.maxeditor_boards;
        this.checkId(id, function (index) {
          let isExist = false;
          let imgObj = {};
          temp[index].imgs.forEach(function (img, idx) {
            if (img.key === key) {
              isExist = true;
              imgObj = temp[index].imgs[idx];
            }
          });
          if (isExist) {
            console.log(imgObj)
            return imgObj;
          } else {
            throw new Error('MaxEditor:' + id + '中' + key + '不存在，无法获取图片');
          }
        }, function () {
          throw new Error('MaxEditor:' + id + '不存在，无法获取扫描图')
        })
      },
      //根据key值更新容器内图片
      updateImg(id, img, cb = (imgDom) => {
        console.log(imgDom)
      }) {
        try {
          if (typeof JSON.parse(img) === "object") {
            img = JSON.parse(img)
          }
        } catch (e) {
        }
        let temp = this.maxeditor_boards;
        this.checkId(id, function (index) {
          temp[index].imgs.forEach(function (i, idx) {
            if (i.key === img.key) {
              temp[index].imgs.splice(idx, 1, img);
            }
          });
        }, function () {
          throw new Error('MaxEditor:' + id + '不存在，无法更新图片');
        });
        this.$set(this.maxeditor_boards, temp);
        this.$nextTick(function () {
          let imgDom = document.getElementById(id + '_imgDom_' + img.key + '_' + this.maxEditorRootId);
          cb(imgDom);
        });
      },

      clearImgBoxContent(id) {
        let temp = this.maxeditor_boards;
        let rootId = this.maxEditorRootId;
        this.checkId(id, function (i) {
          try {
            document.getElementById(id + '_imgBox_qrCode_' + rootId).innerHTML = '';//清空容器中二维码
          } catch (e) {
          }
          temp[i].imgs = null;
        }, function () {
          throw new Error('MaxEditor:' + id + '不存在，无法清空图片容器');
        });
        this.$set(this.maxeditor_boards, temp);
      },
      insertQRCode(id, url) {
        let rootId = this.maxEditorRootId;
        this.checkId(id, function () {
          let dom = document.getElementById(id + '_imgBox_qrCode_' + rootId);
          dom.innerHTML = '';
          new QRCode(dom, url);
        }, function () {
          throw new Error('MaxEditor:' + id + '不存在，无法插入二维码');
        });
      },
      bindImgTabBox(changerBoxId, watcherBoxId) {
        let temp = this.maxeditor_boards;
        let changerIndex = null;
        let watcherIndex = null;

        this.checkId(changerBoxId, function (index) {
          if (temp[index].type !== 'imgBox') {
            throw new Error('MaxEditor:该方法不可绑定非图片容器');
          }
          changerIndex = index;
        }, function () {
          throw new Error('MaxEditor:' + id + '不存在，无法绑定容器');
        });
        this.checkId(watcherBoxId, function (index) {
          if (temp[index].type !== 'imgBox') {
            throw new Error('MaxEditor:该方法不可绑定非图片容器');
          }
          watcherIndex = index;
        }, function () {
          throw new Error('MaxEditor:' + id + '不存在，无法绑定容器');
        });

        temp[watcherIndex].watchTo = changerIndex;
        temp[changerIndex].watchBy = watcherIndex;
        this.$set(this.maxeditor_boards, temp);
        console.log('MaxEditor:绑定了' + changerBoxId + '和' + watcherBoxId)
      },
      unBindImgTabBox(changerBoxId, watcherBoxId) {
        let temp = this.maxeditor_boards;
        let changerIndex = null;
        let watcherIndex = null;

        this.checkId(changerBoxId, function (index) {
          if (temp[index].type !== 'imgBox') {
            throw new Error('MaxEditor:非图片容器');
          }
          changerIndex = index;
        }, function () {
          throw new Error('MaxEditor:' + id + '不存在，无法解除绑定容器');
        });
        this.checkId(watcherBoxId, function (index) {
          if (temp[index].type !== 'imgBox') {
            throw new Error('MaxEditor:非图片容器');
          }
          watcherIndex = index;
        }, function () {
          throw new Error('MaxEditor:' + id + '不存在，无法解除绑定容器');
        });

        temp[watcherIndex].watchTo = null;
        temp[changerIndex].watchBy = null;
        this.$set(this.maxeditor_boards, temp);
      },

      deleteBoard(index) {
        this.maxeditor_boards.splice(index, 1)
      },


      setMode(mode) {
        this.maxeditor_mode = mode
      },
      getMode() {
        return this.maxeditor_mode
      },
      activeBoard(id) {
        document.getElementById(id + '_content_' + this.maxEditorRootId).focus();
      },
      deactiveBoard(id) {
        document.getElementById(id + '_content_' + this.maxEditorRootId).blur();
      },
      print() {


      },

      //图片数字标记拖动时位置大小信息记录
      onImgTabDrag(x, y) {
        if (this.isExited(this.maxeditor_boards[this.maxeditor_current_index].watchTo)) {
          this.maxeditor_boards[this.maxeditor_boards[this.maxeditor_current_index].watchTo].imgs[this.maxeditor_current_tabImg_index].tabX = x;
          this.maxeditor_boards[this.maxeditor_boards[this.maxeditor_current_index].watchTo].imgs[this.maxeditor_current_tabImg_index].tabY = y;
        }
      },
      onImgTabResize(x, y, width, height) {
        /* if (this.isExited(this.maxeditor_boards[this.maxeditor_current_index].watchTo)) {
           this.maxeditor_boards[this.maxeditor_boards[this.maxeditor_current_index].watchTo].imgs[this.maxeditor_current_tabImg_index].tabX = x;
           this.maxeditor_boards[this.maxeditor_boards[this.maxeditor_current_index].watchTo].imgs[this.maxeditor_current_tabImg_index].tabY = y;
           this.maxeditor_boards[this.maxeditor_boards[this.maxeditor_current_index].watchTo].imgs[this.maxeditor_current_tabImg_index].tabWidth = width;
           this.maxeditor_boards[this.maxeditor_boards[this.maxeditor_current_index].watchTo].imgs[this.maxeditor_current_tabImg_index].tabHeight = height;
         }*/
      },

      //面板方法
      onResize(x, y, width, height) {
        try {
          this.maxeditor_boards[this.maxeditor_current_index].x = x;
          this.maxeditor_boards[this.maxeditor_current_index].y = y;
          this.maxeditor_boards[this.maxeditor_current_index].width = width;
          this.maxeditor_boards[this.maxeditor_current_index].height = height;
        } catch (e) {

        }
        //动态调整
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
        this.maxeditor_current_id = this.maxeditor_boards[index].id;
        this.maxeditor_current_index = index;
        try {
          this.maxeditor_boards[index].content = document.getElementById(this.maxeditor_current_id + "_content_" + this.maxEditorRootId).innerHTML;
        } catch (e) {

        }
      },
      onDeactivated(index) {
        console.log('onDeactivated' + index);
        this.maxeditor_current_id = '';
        this.maxeditor_current_index = undefined;
        this.maxeditor_current_dropdown = undefined;
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
      changeSingeLineState(index) {
        let temp = this.maxeditor_boards;
        temp[index].isSingleLine = !temp[index].isSingleLine;
        this.$set(this.maxeditor_boards, temp);
      },
      updateId(oId, nId) {
        let temp = this.maxeditor_boards;
        let index;
        if (oId === nId) {
          return
        }
        this.checkId(oId, function (i) {
          index = i;
        }, function () {
          throw new Error('MaxEditor:' + oId + '不存在，无法更新id');
        });
        this.checkId(nId, function () {
          throw new Error('MaxEditor:' + nId + '已存在，无法更新id');
        }, function () {
        });
        temp[index].id = nId;
        this.$set(this.maxeditor_boards, temp);
      },
      updateTitle(id, title) {
        if (!this.isExited(title)) {
          throw new Error('MaxEditor:未传入标题，无法更新');
        }
        let temp = this.maxeditor_boards;
        let index;
        this.checkId(id, function (i) {
          index = i;
        }, function () {
          throw new Error('MaxEditor:' + id + '不存在，无法更新标题');
        });
        temp[index].title = title;
        this.$set(this.maxeditor_boards, temp);
      },
      updateLabel(id, label) {
        if (!this.isExited(label)) {
          throw new Error('MaxEditor:未传入标签，无法更新');
        }
        let temp = this.maxeditor_boards;
        let index;
        this.checkId(id, function (i) {
          index = i;
        }, function () {
        });
        temp[index].label = label;
        this.$set(this.maxeditor_boards, temp);
      },
      updateZ(id, zindex) {
        if (!this.isExited(zindex)) {
          throw new Error('MaxEditor:未传入z-index值，无法更新');
        }
        let temp = this.maxeditor_boards;
        let index;
        this.checkId(id, function (i) {
          index = i;
        }, function () {
          throw new Error('MaxEditor:' + id + '不存在，无法更新z-index值');
        });
        temp[index].z = zindex;
        this.$set(this.maxeditor_boards, temp);
      },
      getBoard(id) {
        let temp = this.maxeditor_boards;
        let index = undefined;
        this.checkId(id, function (i) {
          index = i;
        }, function () {
          throw new Error('MaxEditor:id' + id + '不存在，无法获取面板信息');
        });
        return temp[index];
      },
      setBoard(boardObject) {
        let temp = this.maxeditor_boards;
        boardObject.id = boardObject.id + "_copy" + this.maxeditor_boards.length;
        temp.push(boardObject);
        this.$set(this.maxeditor_boards, temp)
      },
      getCurrentBoardContent() {
        let index = this.maxeditor_current_index;
        let id = this.maxeditor_current_id;
        if (id === null || id === undefined || index === null || index === undefined) {
          console.log('MaxEditor:没有正在编辑的面板');
          return null;
        }
        //alert(document.getElementById(this.maxeditor_current_id + "_content").innerHTML)
        return this.maxeditor_boards[this.maxeditor_current_index].content
      },
      getCurrentBoardId() {
        if (!this.isExited(this.maxeditor_current_id)) {
          console.log('MaxEditor:没有正在编辑的面板');
          return null
        }
        return this.maxeditor_current_id;
      },
      getCurrentBoardType() {
        return this.maxeditor_boards[this.maxeditor_current_index].type;
      },
      getBoardContentText(id) {
        this.checkId(id, function (i) {
        }, function () {
          throw new Error('MaxEditor:id' + id + '不存在，无法获取面板文本内容');
        });
        return document.getElementById(id + '_content_' + this.maxEditorRootId).innerText;
      },
      getBoardContent(id) {
        let index;
        this.checkId(id, function (i) {
          index = i;
        }, function () {
          throw new Error('MaxEditor:id' + id + '不存在，无法获取面板内容');
        });
        return this.maxeditor_boards[index].content;
      },
      setBoardContent(id, content) {
        let temp = this.maxeditor_boards;
        let index = undefined;
        this.checkId(id, function (i) {
          temp[i].content = content;
          index = i;
        }, function () {
          throw new Error('MaxEditor:id' + id + '不存在，无法设置面板内容');
        });
        this.$set(this.maxeditor_boards, temp);
        let rootId = this.maxEditorRootId;
        this.$nextTick(function () {
          document.getElementById(id + '_content_' + rootId).innerHTML = this.maxeditor_boards[index].content
        });
      },

      //文本编辑方法
      //光标处插入下拉框
      editInsertDatalist(id, values) {
        if (!this.isExited(values)) {
          throw new Error('MaxEditor:未传入选项值，无法插入下拉框');
        }
        if (typeof values !== 'object') {
          values = JSON.parse(values);
        }
        let input = '<input id="' + id + 'dropDownInput" list="' + id + 'list" class="maxeditor-inner-dropdown" />';
        let option = '';
        for (let i = 0; i < values.length; i++) {
          option += '<option value="' + values[i].value + '">'
        }
        let datalist = '<datalist id="' + id + 'list">' + option + "</datalist>";
        document.execCommand('insertHtml', false, input + datalist);
      },
      editInsertText(text) {
        if (!this.isExited(text)) {
          throw new Error('MaxEditor:未传入文本，无法插入');
        }
        document.execCommand('insertText', false, text)
      },

      //工具
      //菜单栏滚动到顶部时固定
      handleToolbarScroll() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        let offsetTop = document.getElementById('maxeditor-toolbar-' + this.maxEditorRootId).offsetTop;
        this.toolBarFixed = scrollTop > offsetTop;
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
            return tnum / 2;
          }
          return 0;
        }
        return text.match(/[\u4E00-\u9FA5]/g).length;
      },
      //存在性检验
      isExited(sth) {
        if (undefined === sth || null === sth || '' === sth) {
          return false;
        } else {

        }
        return true
      },
      //id检查
      checkId(id, cb1, cb2) {
        if (!this.isExited(id)) {
          throw new Error('MaxEditor:未传入id');
        }
        for (let i = 0; i < this.maxeditor_boards.length; i++) {
          if (this.maxeditor_boards[i].id === id) {
            cb1(i);//id存在回调函数
            return;
          }
        }
        cb2();//id不存在回调函数
      },
      //焦点释放
      handleBodyClick(event) {
        if (event.target.className === 'maxeditor-body-inner') {
          this.blurAll()
        }
      },
      blurAll() {
        console.log('释放焦点');
        this.maxeditor_current_dropdown = undefined;
        this.maxeditor_current_id = undefined;
        this.maxeditor_current_index = undefined;
        this.maxeditor_current_tabImg_index = undefined;
      },
      //normal面板适应内容高度
      wrapContentHeight(boxIndex) {
        /*let temp = this.maxeditor_boards;
        //TODO 此处的dom访问可能会造成性能问题
        let dom =  document.getElementById(temp[boxIndex].id + '_' + this.maxEditorRootId);
        let scrollHeight = dom.scrollHeight;
        let offsetHeight = dom.offsetHeight;
        if(scrollHeight>offsetHeight+21){
          console.log('asdfasdf')
          this.maxeditor_boards[boxIndex].height = scrollHeight;

          document.getElementById(temp[boxIndex].id + '_' + this.maxEditorRootId).height=scrollHeight;
          console.log(temp[boxIndex].id + '_' + this.maxEditorRootId)
         // console.log( document.getElementById(temp[boxIndex].id + '_' + this.maxEditorRootId))
         // this.refreshLayout(boxIndex);
        }*/
        console.log('wrapContentHeight')
        let temp = this.maxeditor_boards;
        temp[boxIndex].height = 400;
        //
        this.clearBoards()
        this.$nextTick(function () {
          console.log('nextTick')
          this.setBoards(temp)
        })
      },
      //刷新排版，向下调整
      refreshLayout(id) {
        let baseBoxIndex;
        this.checkId(id, function (index) {
          baseBoxIndex = index
        }, function () {
          throw new Error('MaxEditor:' + id + '不存在，无法更新排版');
        });
        let temp = this.maxeditor_boards;
        let dom = document.getElementById(temp[baseBoxIndex].id + '_' + this.maxEditorRootId);
        let scrollHeight = dom.scrollHeight;
        let offsetHeight = dom.offsetHeight;
        if (scrollHeight > offsetHeight + 21) {
          temp[baseBoxIndex].height = scrollHeight;
        }
        let topY = temp[baseBoxIndex].y;
        let bottomY = topY + temp[baseBoxIndex].height;
        let transY = 0;
        temp.forEach(function (item, index) {
          if (item.y > topY && item.y < bottomY) {
            let tty = bottomY - item.y;
            transY = transY > tty ? transY : tty;
          }
        });
        transY += 30;
        temp.forEach(function (item, index) {
          if (item.y > topY) {
            item.y += transY;
          }
        });
        this.clearBoards();
        this.$nextTick(function () {
          this.setBoards(temp)
        })
      }
    },
    mounted() {
      window.addEventListener('scroll', this.handleToolbarScroll);
      window.onresize = () => {
        this.toolBarLeft = this.$refs.maxEditorBodyInner.getBoundingClientRect().left - 20;
      }
    },
    watch: {
      maxeditor_mode(n, o) {
        if (n === 'readonly') {
          let list = document.getElementsByClassName('maxeditor-inner-dropdown');
          for (let i = 0; i < list.length; i++) {
            list[i].setAttribute('readonly', 'true')
          }
        } else {
          let list = document.getElementsByClassName('maxeditor-inner-dropdown');
          for (let i = 0; i < list.length; i++) {
            list[i].removeAttribute('readonly')
          }
        }

        if (n !== 'design') {
          this.blurAll()
        }
      }
    }
  }
</script>

<style scoped>

</style>
