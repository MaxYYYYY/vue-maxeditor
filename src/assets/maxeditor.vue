<template>
  <div class="maxeditor-root" :id="maxEditorRootId" style="overflow-x: scroll">
    <!--编辑器工具栏-->
    <maxeditor-toolbar v-if="isToolbarShow"
                       :ref="'maxEditorToolbar_'+maxEditorRootId"
                       :width="width"
                       :padding-x="paddingX"
                       :maxeditor_mode="maxeditor_mode"
                       :maxeditor_current_board="maxeditor_boards[maxeditor_current_index]"
                       :view-port-height="viewPortHeight"
                       :is-mode-btn-show="isModeBtnShow"
                       :maxeditor-root-id="maxEditorRootId">
    </maxeditor-toolbar>
    <!--视口-->
    <div class="maxeditor-view-port"
         style="overflow-y: scroll;margin: 0 auto;padding-left: 15px;"
         :style="{'width':width+paddingX*2+30+'px',
                  'height':viewPortHeight+'px',
                  'padding-top':isToolbarShow?isModeBtnShow?'136px':'48px':'0'}">
      <div class="maxeditor-body"
           :style="{'width':width+'px','height':height+'px',
                  'padding-left':paddingX+'px','padding-right':paddingX+'px',
                  'padding-top':paddingY+'px','padding-bottom':paddingY+'px'}"
           @click="handleBodyClick">
        <div class="maxeditor-body-inner"
             :ref="'maxeditor-body-inner-'+maxEditorRootId"
             :id="'maxeditor-body-inner-'+maxEditorRootId">
          <maxeditor-board
            class="maxeditor-board"
            v-for="(item, index) in maxeditor_boards"
            :style="{'z-index':index === maxeditor_current_index?maxeditor_mode==='design'?'200':item.z:item.z}"
            :id="item.id+'_'+maxEditorRootId"
            :ref="item.id+'_'+maxEditorRootId"
            :key="item.id+'_'+maxEditorRootId"
            :grid="item.type==='hr'||item.type==='imgBox'?[1,1]:[8,8]"
            :parent="true"
            :resizable="maxeditor_mode==='design'"
            :x="item.x===undefined||item.x===null?0:item.x"
            :y="item.y===undefined||item.y===null?0:item.y"
            :z="isExited(item.z)?item.z:100"
            :w="item.type==='hr'?width:isExited(item.width)?item.width:200"
            :h="item.type==='hr'?20:isExited(item.height)?item.height:200"
            :minh="14"
            :minw="item.type==='label'?100:50"
            :drag-handle="'.maxeditor-icon-move'"
            :handles="(item.type==='hr'||item.type==='table')?[]:item.type==='label'?['ml','mr']:['tl','tm','tr','ml','mr','bl','bm','br']"
            :axis="item.type==='hr'?'y':'both'"
            @click="onActivated(index)"
            @resizing="onResize"
            @dragging="onDrag"
            @activated="onActivated(index)"
            @deactivated="onDeactivated(index)">
            <!--面板标题-->
            <template v-if="item.type==='normal'&&isExited(item.title)&&item.writable">
              <div class="maxeditor-board-titile"
                   :ref="item.id+'_title_'+maxEditorRootId"
                   :contenteditable="maxeditor_mode==='design'"
                   @focus="setTitleHTML(index)"
                   @click="setTitleHTML(index)"
                   @keyup="setTitleHTML(index)">{{item.title}}:
              </div>
            </template>
            <!--normal面板-->
            <template v-if="item.type === 'normal'">
              <div style="width: 100%;height: 100%"
                   :contenteditable="isExited(item.writable)?item.writable?maxeditor_mode!=='readonly':maxeditor_mode==='design':true"
                   :id="item.id+'_content_'+maxEditorRootId"
                   :ref="item.id+'_content_'+maxEditorRootId"
                   :class="{'maxeditor-board-outline':maxeditor_mode==='readonly'?false:maxeditor_mode==='design'?true:isExited(item.title)}"
                   @focus="onActivated(index)"
                   @click="onActivated(index)"
                   @keyup="onActivated(index);justifyNormalBoardHeight(index)">
              </div>
            </template>
            <!--label标题-->
            <template v-if="item.type === 'label'">
              <p style="height: 25px;margin: 0;position: relative">
                <span v-if="isExited(item.label)"
                      style="float: left;width: 65px;height: 25px"
                      class="maxeditor-single-line"
                      :ref="item.id+'_label_'+maxEditorRootId"
                      :contenteditable="maxeditor_mode==='design'"
                      @focus="setLabelHTML(index)"
                      @click="onActivated(index);setLabelHTML(index)"
                      @keyup="setLabelHTML(index)">{{item.label}}
                </span>
                <span v-if="isExited(item.label)" style="float: left;margin-right: 5px">:</span>
                <span
                  class="maxeditor-single-line"
                  style="float: left;display: inline-block;height: 25px"
                  :contenteditable="(maxeditor_mode === 'design'||maxeditor_mode === 'edit')"
                  :id="item.id+'_content_'+maxEditorRootId"
                  :ref="item.id+'_content_'+maxEditorRootId"
                  :class="{'maxeditor-board-outline':maxeditor_mode==='design'}"
                  :style="{'width':isExited(item.label)?item.width-80+'px':item.width-10+'px'}"
                  @click="onActivated(index);maxeditor_current_dropdown = item.id"
                  @keyup="onActivated(index)">{{item.content}}</span>
                <span class="maxeditor-icon maxeditor-icon-caret-down"
                      style="position: absolute;right: 2px;top: 4px;"
                      v-if="(maxeditor_mode === 'design'||maxeditor_mode === 'edit')&&isExited(item.datalist)"
                      @click="changeDropDownState(item.id);maxeditor_current_index=index"></span>
              </p>
              <div class="maxeditor-dropdown"
                   :style="{'margin-left':isExited(item.label)?'70px':'0'}"
                   v-if="maxeditor_current_dropdown===item.id&&(maxeditor_mode === 'design'||maxeditor_mode === 'edit')&&isExited(item.datalist)">
                <template v-for="(t, i) in item.datalist" v-if="isExited(item.datalist)">
                  <p class="maxeditor-noselect maxeditor-hoverable"
                     @click="setDropDownValue(item.id,t.value);
                   maxeditor_current_dropdown = undefined;
                   maxeditor_boards[index].datalist_current = t.id;
                   maxeditor_boards[index].content = t.value;">{{t.value}}</p>
                </template>
              </div>
            </template>
            <!--imgBox面板-->
            <template v-if="item.type === 'imgBox'">
              <div :style="{'height':isExited(item.height)?item.height+'px':'200px'}"
                   :class="{'maxeditor-board-outline':maxeditor_mode==='design'}"
                   :id="item.id+'_imgBox_'+maxEditorRootId"
                   :ref="item.id+'_imgBox_'+maxEditorRootId"
                   @click="onActivated(index)">
                <!--图片-->
                <div style="text-align: center"
                     v-if="isExited(item.imgs)"
                     :id="item.id+'_imgBox_imgs_'+maxEditorRootId"
                     :ref="item.id+'_imgBox_imgs_'+maxEditorRootId">
                  <template v-for="(img, imgIdx) in item.imgs" v-if="isExited(item.imgs)">
                    <div style="display: inline-grid">
                      <div style="position: relative;">
                        <img style="margin:4px" :src="img.src"
                             :id="item.id+'_imgDom_'+img.key+'_'+maxEditorRootId"
                             :ref="item.id+'_imgDom_'+img.key+'_'+maxEditorRootId"
                             :style="{'width':item.imgs.length===1?'':'160px',
                                      'height':item.imgs.length===1?item.height+'px':''}"
                             @load="justifyImgBoxHeight(index)"/>
                        <!--图片角标-->
                        <div style="position: absolute;margin: 4px 4px 8px;height: 20px;width: 20px;"
                             v-if="isExited(img.tab)"
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
                <!--二维码-->
                <div v-if="!isExited(item.imgs)"
                     :ref="item.id+'_imgBox_qrCode_'+maxEditorRootId"
                     :id="item.id+'_imgBox_qrCode_'+maxEditorRootId"></div>
                <!--图片标记-->
                <maxeditor-tab v-if="isExited(item.watchTo)"
                               v-for="(i, idx) in (isExited(item.watchTo)?maxeditor_boards[item.watchTo].imgs:[])"
                               :key="item.id+'_imgTabs_'+idx+'_'+maxEditorRootId"
                               :x="isExited(i.tabX)?i.tabX:0"
                               :y="isExited(i.tabY)?i.tabY:0"
                               :w="isExited(i.tabW)?i.tabW:20"
                               :h="isExited(i.tabH)?i.tabH:20"
                               :minh="15"
                               :minw="15"
                               :parent="true"
                               :handles="[]"
                               @click="maxeditor_current_index=index;maxeditor_current_tabImg_index=idx;"
                               @activated="maxeditor_current_index=index;maxeditor_current_tabImg_index=idx;"
                               @dragging="onImgTabDrag"
                               @resizing="onImgTabResize">
                  <div style="background-color: white;width: 100%;height: 100%;text-align: center;cursor: pointer;"
                       :style="{'background-color':isExited(i.tab)?isExited(i.tab.color)?i.tab.color:'white':'white'}"
                       :title="i.key">
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
              <div style="width: 100%;padding-top: 10px;padding-bottom: 10px" @click="onActivated(index)">
                <hr/>
              </div>
            </template>
            <!--面板工具栏：不可用v-if渲染，会导致文本框文字丢失-->
            <div class="maxeditor-board-toolbar"
                 v-show="maxeditor_mode==='design'"
                 :style="{'margin-left':item.type==='hr'?'325px':''}"
                 :class="{'maxeditor-board-toolbar-active':item.id===maxeditor_current_id}">
              <span class="maxeditor-icon-move" title="移动缩放"></span>
              <span class="maxeditor-icon-delete" title="删除面板" @click="deleteBoard(index)"></span>
              <span class="maxeditor-icon maxeditor-icon-mark"
                    style="vertical-align: super"
                    title="修改面板" v-if="item.type!=='hr'" @click="openUpdateDialog(item)"></span>
              <span style="vertical-align: super">id:{{item.id}}</span>
            </div>
          </maxeditor-board>
        </div>
      </div>
      <!--分页：超过1页时通过此模板渲染增加的页面-->
      <template v-for="n in maxeditor_pages">
        <div class="maxeditor-body"
             :style="{'width':width+'px','height':height+'px',
                  'padding-left':paddingX+'px','padding-right':paddingX+'px',
                  'padding-top':paddingY+'px','padding-bottom':paddingY+'px'}"
             @click="handleBodyClick">
        </div>
      </template>
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
      width: {type: Number, default: 794},//报告页面宽高，72dpi显示器下，A4纸的像素大小为794*1024
      height: {type: Number, default: 1124},
      viewPortHeight: {type: Number, default: 500},//编辑器的视口高度
      paddingX: {type: Number, default: 20},//报告页面水平内边距
      paddingY: {type: Number, default: 20},//报告页面垂直内边距
      isToolbarShow: {type: Boolean, default: true},//编辑器工具栏是否显示
      isModeBtnShow: {type: Boolean, default: false},//编辑器工具栏设计按钮是否可见
      maxEditorRootId: {type: String, default: 'maxEditor_' + Date.now()}//默认生成时间戳id
    },
    render() {

    },
    data() {
      return {
        window: window,
        document: window.document,
        maxeditor_boards: [],//面板列表，报告界面根据此列表渲染
        maxeditor_mode: 'design',//编辑器模式，'design'|'edit'|'readonly '
        maxeditor_current_id: '',//当前编辑面板id
        maxeditor_current_index: undefined,//当前编辑面板在maxeditor_boards中的索引值
        maxeditor_current_dropdown: undefined,//当前正在操作的下拉框（id值）
        maxeditor_current_tabImg_index: undefined,//当前正在操作的图片标记的索引值
        maxeditor_pages: 0//增加的页数
      }
    },
    components: {
      //'maxeditor-board-normal':MaxeditorBoardNormal,
      'maxeditor-toolbar': MaxEditorToolbar,
      'maxeditor-board': VueDraggableResizable,
      'maxeditor-tab': VueDraggableResizable
    },
    methods: {
      //全局方法
      //新增面板
      addBoard(option) {
        if (this.maxeditor_mode !== 'design') {
          throw new Error('MaxEditor:当前模式不可插入板块');
        }
        if (!this.isExited(option.id)) {
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
        //通用属性
        let common = {
          id: this.isExited(option.id) ? option.id : 'maxeditor_default_id_' + this.maxeditor_boards.length + '',
          type: option.type,
          x: this.isExited(option.x) ? option.x : 0,
          y: this.isExited(option.y) ? option.y : 0,
          z: this.isExited(option.z) ? option.z : 100,
          width: this.isExited(option.width) ? option.width : 200,
          height: this.isExited(option.height) ? option.height : 200,
          minWidth: this.isExited(option.minWidth) ? option.minWidth : null,
          minHeight: this.isExited(option.minHeight) ? option.minHeight : this.isExited(option.height) ? option.height : 200,
        };
        //文本框
        if (option.type === 'normal') {
          common.y = 20;
          common.title = this.isExited(option.title) ? option.title : null;
          common.writable = this.isExited(option.writable) ? option.writable : true;
        }
        //标签单行文本、下拉框
        if (option.type === 'label') {
          common.label = this.isExited(option.label) ? option.label : null;
          common.datalist = this.isExited(option.datalist) ? option.datalist : null;//下拉数组
          common.datalist_current = null;//当前选中项
        }
        //图片容器
        if (option.type === 'imgBox') {
          common.imgs = this.isExited(option.imgs) ? option.imgs : null;
          common.imgTabs = this.isExited(option.imgTabs) ? option.imgTabs : null;
          common.watchTo = null;
          common.watchBy = null;
        }
        //表格
        if (option.type === 'table') {

        }
        this.maxeditor_boards.push(common);
        //激活新增面板
        this.onActivated(this.maxeditor_boards.length - 1)
      },
      //标题、标签等html代码保存
      setLabelHTML(index) {
        this.maxeditor_boards[index].labelHTML = this.$refs[this.maxeditor_boards[index].id + '_label_' + this.maxEditorRootId][0].innerHTML;
      },
      setTitleHTML(index) {
        this.maxeditor_boards[index].titleHTML = this.$refs[this.maxeditor_boards[index].id + '_title_' + this.maxEditorRootId][0].innerHTML;
      },
      //获取面板数组
      getBoards() {
        this.blurAll();
        return this.maxeditor_boards;
      },
      setBoards(boards, cb = () => {
        console.log('MaxEditor:setBoards complete.')
      }) {
        try {
          if (typeof JSON.parse(boards) === "object") {
            boards = JSON.parse(boards)
          }
        } catch (e) {
        }
        this.maxeditor_boards = boards;
        let rootId = this.maxEditorRootId;
        let that = this;
        this.$nextTick(function () {
          that.maxeditor_boards.forEach(function (item, index) {
            if (that.isExited(item.content)) {
              if (item.type === 'normal') {
                that.$refs[item.id + '_content_' + rootId][0].innerHTML = item.content;
              }
              if (item.type === 'label') {
                that.$refs[item.id + '_content_' + rootId][0].innerText = item.content;
              }
            }
            if (that.isExited(item.titleHTML)) {
              that.$refs[item.id + '_title_' + rootId][0].innerHTML = item.titleHTML;
            }
            if (that.isExited(item.labelHTML)) {
              that.$refs[item.id + '_label_' + rootId][0].innerHTML = item.labelHTML;
            }
          });
          that.$nextTick(function () {
            cb();
          })
        })
      },
      clearBoards() {
        this.maxeditor_boards = [];
      },
      addSection(id) {
        this.addBoard({id: id, type: 'normal', z: 100})
      },
      //该文本框只在设计模式下可编辑，用于大标题以及页脚等
      addReadOnlySection(id) {
        this.addBoard({id: id, type: 'normal', z: 100, writable: false, height: 24, width: this.width})
      },
      addSectionWithTitle(id, title) {
        if (!this.isExited(title)) {
          throw new Error('MaxEditor:插入带标题文本框时未得到标题');
        }
        this.addBoard({id: id, title: title, type: 'normal', width: this.width, height: 200, z: 100})
      },
      addTextWithLabel(id, label) {
        if (!this.isExited(label)) {
          throw new Error('MaxEditor:插入带标签文本时未得到标签');
        }
        this.addBoard({
          id: id, label: label, type: 'label', width: 125, height: 25, x: 75, z: 101
        })
      },
      addTable(id) {
        this.addBoard({id: id, type: 'table', width: 600, z: 100})
      },
      addDropDown(id, datalist) {
        if (!this.isExited(datalist)) {
          datalist = [];
        }
        if (typeof datalist !== 'object') {
          datalist = JSON.parse(datalist)
        }
        this.addBoard({
          id: id, label: null, type: 'label', width: 150, height: 25, x: 75, z: 200, datalist: datalist
        })
      },
      addDropDownWithLabel(id, label, datalist) {
        if (!this.isExited(label)) {
          throw new Error('MaxEditor:插入带标签下拉框时未得到标签');
        }
        if (!this.isExited(datalist)) {
          datalist = [];
        }
        if (typeof datalist !== 'object') {
          datalist = JSON.parse(datalist)
        }
        this.addBoard({
          id: id, label: label, type: 'label', width: 150, height: 25, x: 75, z: 200, datalist: datalist
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
        this.$refs[id + '_content_' + this.maxEditorRootId][0].innerText = ''
      },
      changeDropDownState(id, index) {
        if (this.isExited(this.maxeditor_current_dropdown)) {
          this.maxeditor_current_dropdown = undefined
        } else {
          console.log(this.$refs[id + '_' + this.maxEditorRootId]);
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
          this.maxeditor_boards[index].content = dItem.value;
          this.setDropDownValue(id, dItem.value);
          //this.maxeditor_current_index = index; //设置值后置顶
          return;
        }
        throw new Error('MaxEditor:下拉列表中找到不' + itemId);
      },
      setDropDownValue(id, value) {
        this.$refs[id + '_content_' + this.maxEditorRootId][0].innerText = value
      },
      addHr() {
        this.addBoard({type: 'hr', z: 101})
      },

      addImgBox(id) {
        this.addBoard({id: id, type: 'imgBox', z: 101})
      },
      insertImg(id, imgs, cb = (imgDomList) => {
        console.log(imgDomList)
      }) {
        let Tindex;
        let that = this;
        let temp = this.maxeditor_boards;
        let rootId = this.maxEditorRootId;
        let imgdata;
        //入参控制
        if (typeof imgs === 'object') {
          imgdata = imgs;
        } else {
          imgdata = JSON.parse(imgs);
        }
        this.checkId(id, function (index) {
          //清空容器中二维码
          try {
            that.$refs[id + '_imgBox_qrCode_' + this.maxEditorRootId][0].innerHTML = '';
          } catch (e) {
          }
          Tindex = index;
          temp[index].imgs = imgdata;
        }, function () {
          throw new Error('MaxEditor:' + id + '不存在，无法插入图片');
        });
        //触发更新视图
        this.$set(this.maxeditor_boards, temp);
        let doms = [];
        //返还插入图片的dom数组
        this.$nextTick(function () {
          imgdata.forEach(function (item, idx) {
            let dom = that.$refs[id + '_imgDom_' + item.key + '_' + rootId][0];
            doms.push(dom)
          });
          that.justifyImgBoxHeight(Tindex);
          cb(doms)
        })
      },
      deleteImg(id, key) {
        let temp = this.maxeditor_boards;
        let ttemp;
        let that = this;
        let Tindex;
        let tidx;
        this.checkId(id, function (index) {
          let isExit = false;
          Tindex = index;
          //当存在多个相同key的图片时，删除最有一张（key的唯一性前端不作控制）
          temp[index].imgs.forEach(function (img, idx) {
            if (img.key === key) {
              tidx = idx;
              isExit = true;
            }
          });
          ttemp = temp[index].imgs;
          ttemp.splice(tidx, 1);
          if (!isExit) {
            throw new Error('MaxEditor:' + id + '中' + key + '不存在，无法删除图片');
          }
          temp[index].imgs = [];
          ttemp.forEach((item) => {
            temp[index].imgs.push(item)
          });
        }, function () {
          throw new Error('MaxEditor:' + id + '不存在，无法删除图片');
        });
        this.$set(this.maxeditor_boards, temp)
        this.$nextTick(function () {
          if (temp[Tindex].imgs.length !== 0) {
            that.justifyImgBoxHeight(Tindex);
          }
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
        let Tindex;
        let that = this;
        let temp = this.maxeditor_boards;
        this.checkId(id, function (index) {
          //初始化
          if (!that.isExited(temp[index].imgs)) {
            temp[index].imgs = []
          }
          Tindex = index;
          temp[index].imgs.push(img);
        }, function () {
          throw new Error('MaxEditor:' + id + '不存在，无法插入图片');
        });
        this.$set(this.maxeditor_boards, temp);
        this.$nextTick(function () {
          let imgDom = that.$refs[id + '_imgDom_' + img.key + '_' + this.maxEditorRootId][0];
          that.justifyImgBoxHeight(Tindex);
          cb(imgDom);
        });
      },
      //获取图片json对象
      getImg(id, key) {
        let temp = this.maxeditor_boards;
        let img = {};
        let isExist = false;
        let that = this;
        this.checkId(id, function (index) {
          if (!that.isExited(temp[index].imgs)) {
            throw new Error('MaxEditor:' + id + '下没有图片')
          }
          for (let i = 0; i < temp[index].imgs.length; i++) {
            if (temp[index].imgs[i].key === key) {
              img = temp[index].imgs[i];
              isExist = true
            }
          }
        }, function () {
          throw new Error('MaxEditor:' + id + '不存在，无法获取扫描图')
        });
        if (isExist) {
          return img;
        }
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
        let that = this;
        let Tindex;
        let temp = this.maxeditor_boards;
        this.checkId(id, function (index) {
          temp[index].imgs.forEach(function (i, idx) {
            if (i.key === img.key) {
              temp[index].imgs.splice(idx, 1, img);
            }
          });
          Tindex = index;
        }, function () {
          throw new Error('MaxEditor:' + id + '不存在，无法更新图片');
        });
        this.$set(this.maxeditor_boards, temp);
        this.$nextTick(function () {
          let imgDom = that.$refs[id + '_imgDom_' + img.key + '_' + this.maxEditorRootId][0];
          that.justifyImgBoxHeight(Tindex);
          cb(imgDom);
        });
      },
      clearImgBoxContent(id) {
        let that = this;
        let Tindex;
        let temp = this.maxeditor_boards;
        let rootId = this.maxEditorRootId;
        this.checkId(id, function (i) {
          try {
            that.$refs[id + '_imgBox_qrCode_' + rootId][0].innerHTML = '';//清空容器中二维码
          } catch (e) {
          }
          Tindex = i;
          temp[i].imgs = null;
        }, function () {
          throw new Error('MaxEditor:' + id + '不存在，无法清空图片容器');
        });
        this.$set(this.maxeditor_boards, temp);
        this.justifyImgBoxHeight(Tindex)
      },
      insertQRCode(id, url) {
        let that = this;
        let rootId = this.maxEditorRootId;
        if (!that.isExited(url)) {
          throw new Error('MaxEditor:未传入url，无法插入二维码');
        }
        this.$nextTick(function () {
          that.checkId(id, function () {
            let dom = that.$refs[id + '_imgBox_qrCode_' + rootId][0];
            dom.innerHTML = '';
            new QRCode(dom, url);
          }, function () {
            throw new Error('MaxEditor:' + id + '不存在，无法插入二维码');
          });
        })
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
        this.$refs[id + '_content_' + this.maxEditorRootId][0].focus();
      },
      deactiveBoard(id) {
        try {
          this.$refs[id + '_content_' + this.maxEditorRootId][0].blur();
        } catch (e) {

        }
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
          this.maxeditor_boards[this.maxeditor_current_index].minHeight = height;
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
        this.maxeditor_current_id = this.maxeditor_boards[index].id;
        this.maxeditor_current_index = index;
        try {
          this.maxeditor_boards[index].content = this.$refs[this.maxeditor_boards[index].id + "_content_" + this.maxEditorRootId][0].innerHTML;
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
      //更新面板（当前编辑）
      updateBoard(board) {
        let that = this;
        console.log(board.id)
        this.checkId(board.id, function (i) {
          if (i === that.maxeditor_current_index) {
            Object.keys(board).forEach(function (key) {
              that.maxeditor_boards[i][key] = board[key]
            });
            console.log(that.maxeditor_boards[i])
          } else {
            throw new Error('MaxEditor:id' + id + '已存在，无法更新面板');
          }
        }, function () {
          Object.keys(board).forEach(function (key) {
            that.maxeditor_boards[that.maxeditor_current_index][key] = board[key]
          });
          console.log(that.maxeditor_boards[that.maxeditor_current_index])
        })
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
      //TODO 业务混淆，待修改
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
        return this.$refs[id + '_content_' + this.maxEditorRootId][0].innerText;
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
        let that = this;
        this.checkId(id, function (i) {
          temp[i].content = content;
          index = i;
        }, function () {
          throw new Error('MaxEditor:id' + id + '不存在，无法设置面板内容');
        });
        this.$set(this.maxeditor_boards, temp);
        let rootId = this.maxEditorRootId;
        this.$nextTick(function () {
          that.$refs[id + '_content_' + rootId][0].innerHTML = this.maxeditor_boards[index].content
        });
        this.$nextTick(function () {
          if (temp[index].type === 'imgBox') {
            that.justifyImgBoxHeight(index)
          }
          if (temp[index].type === 'normal') {
            that.justifyNormalBoardHeight(index)
          }
        })
      },

      //文本编辑方法
      //初始化关键字事件

      //关键字
      editInsertKeyWord(values) {
        let id = Date.now()
        if (!this.isExited(values)) {
          throw new Error('MaxEditor:未传入选项值，无法插入下拉框');
        }
        if (typeof values !== 'object') {
          values = JSON.parse(values);
        }
        let rootId = this.maxEditorRootId;
        let option = '';
        for (let i = 0; i < values.length; i++) {
          option += '<option value="' + values[i].value + '">' + values[i].value + '</option>'
        }
        let select =
          '<span id="' + id + '_keyword_' + rootId + '" contenteditable="true" class="maxeditor-keyword-arrow maxeditor-keyword maxeditor-board-outline">' + values[0].value + '</span>' +
          '<select id="' + id + '_keywordSelect_' + rootId + '" class="maxeditor-keyword-select" onchange="this.previousElementSibling.innerHTML = this.value;" >' +
          option +
          '</select>';
        let container = '<b id="' + id + '_keyword_container' + rootId + '" class="maxeditor-select-editable">-插入代码-</b>';
        document.execCommand('insertHtml', false, container);
        document.getElementById(id + '_keyword_container' + rootId).innerHTML = select;
      },
      editInsertText(text) {
        if (!this.isExited(text)) {
          throw new Error('MaxEditor:未传入文本，无法插入');
        }
        document.execCommand('insertText', false, text)
      },

      //工具
      //动态调整关键词input宽度
      changeKeyWordInputWidth(id) {
        //document.getElementById()
      },
      //打印
      print(cb) {
        let oldMode = this.maxeditor_mode;
        this.maxeditor_mode = 'readonly';
        this.$nextTick(function () {
          let str = "",
            styles = document.querySelectorAll('style,link');
          for (let i = 0; i < styles.length; i++) {
            //开发环境
            if (styles[i].outerHTML.includes('/dist/main.css')) {
              console.log(styles[i].outerHTML);
              console.log(styles[i].innerHTML);
              str += styles[i].outerHTML;
            }
            //生产环境
            if (styles[i].innerHTML.includes('maxeditor的CSS文件')) {
              str += styles[i].outerHTML;
            }
            if (styles[i].innerHTML.includes('.vdr[')) {
              str += styles[i].outerHTML;
            }
          }
          str += '';
          let bodyHtml = document.getElementById('maxeditor-body-inner-' + this.maxEditorRootId).innerHTML;
          let iframe = document.createElement("iframe");
          iframe.id = 'print_iframe' + this.maxEditorRootId;
          iframe.width = this.width;
          iframe.height = this.height;
          iframe.style.display = 'none';
          document.body.appendChild(iframe);
          iframe.contentDocument.body.innerHTML = bodyHtml;
          iframe.contentDocument.head.innerHTML = str;
          iframe.contentWindow.print();
          document.body.removeChild(iframe);
          this.maxeditor_mode = oldMode;
          if (cb) {
            cb()
          }
        });
      },
      //计算文本中汉字个数
      getCharacterNum(text) {
        if (text === undefined || text === null) {
          console.log(text);
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
      blurAll(cb = () => {
        console.log('释放焦点');
      }) {
        let that = this;
        if (this.isExited(this.maxeditor_current_id)) {
          that.deactiveBoard(this.maxeditor_current_id);
        }
        this.maxeditor_current_dropdown = undefined;
        this.maxeditor_current_id = undefined;
        this.maxeditor_current_index = undefined;
        this.maxeditor_current_tabImg_index = undefined;
        this.$nextTick(cb)
      },
      //自适应图片容器高度
      justifyImgBoxHeight(index) {
        let temp = this.maxeditor_boards;
        if (temp[index].imgs.length === 1) {
          return
        }
        let boardRef = this.$refs[temp[index].id + '_' + this.maxEditorRootId];
        let containerInnerRef = this.$refs[temp[index].id + '_imgBox_imgs_' + this.maxEditorRootId];
        let oldHeight = temp[index].height;//原始高度
        let newHeight = containerInnerRef[0].offsetHeight;
        if (newHeight === 0) {
          return
        }
        if (newHeight < temp[index].minHeight) {
          console.log('--------------------------------')
        }
        temp[index].height = newHeight;
        boardRef[0].height = newHeight;
        this.refreshLayout(index, newHeight - oldHeight)
      },
      //自适应normal容器高度
      justifyNormalBoardHeight(index) {
        let that = this;
        let temp = this.maxeditor_boards;
        let oldHeight = temp[index].height;//原始高度
        let boardRef = this.$refs[temp[index].id + '_' + this.maxEditorRootId];
        let boardContentRef = this.$refs[temp[index].id + '_content_' + this.maxEditorRootId];
        let lastLineDom = boardContentRef[0].lastElementChild;//最后一行
        if (lastLineDom !== null) {
          let contentHeight = lastLineDom.offsetTop + lastLineDom.offsetHeight;
          if (contentHeight < temp[index].minHeight && that.maxeditor_mode === 'edit') {
            return;
          }
          if (contentHeight < 50 && that.maxeditor_mode === 'design') {
            return
          }
          temp[index].height = contentHeight;
          boardRef[0].height = contentHeight;
          that.refreshLayout(index, contentHeight - oldHeight);
        } else {
          console.log('MaxEditor:文本框内没有最后一行元素')
        }
      },
      //刷新排版
      refreshLayout(index, translateY) {
        console.log('MaxEditor:refresh layout.');
        let that = this;
        let temp = that.maxeditor_boards;
        let tX = temp[index].x;
        let tY = temp[index].y;
        let tHeight = temp[index].height;
        let tWidth = temp[index].width;

        let a = that.getTotalHeight();
        let b = that.height * (1 + that.maxeditor_pages) + (that.paddingY * 2 + 24) * that.maxeditor_pages;
        let c = that.height * that.maxeditor_pages + (that.paddingY * 2 + 24) * (that.maxeditor_pages - 1);
        console.log(a + ';' + b);
        console.log(a + ';' + c);
        //判断是否需要分页
        if (that.getTotalHeight() > that.height * (1 + that.maxeditor_pages) + (that.paddingY * 2 + 24) * that.maxeditor_pages) {

          that.addPage();

        } else if (that.getTotalHeight() < that.height * that.maxeditor_pages + (that.paddingY * 2 + 24) * (that.maxeditor_pages - 1)) {

          that.deletePage();

        }

        for (let i = 0; i < temp.length; i++) {
          //跳过自身
          if (i === index) {
            continue;
          }
          if (temp[i].y > (tY + tHeight)) {
            temp[i].y += translateY;
            that.$refs[temp[i].id + '_' + this.maxEditorRootId][0].top = temp[i].y;
          } else if (temp[i].y > tY && temp[i].y < (tY + tHeight)) {
            if (!(temp[i].x > tX + tWidth) && !((temp[i].x + temp[i].width) < tX)) {
              temp[i].y += translateY;
              that.$refs[temp[i].id + '_' + this.maxEditorRootId][0].top = temp[i].y;
            }
          }
        }
      },

      //分页
      addPage() {
        if (this.maxeditor_mode === 'design') {
          return
        }
        console.log('MaxEditor:add page.');
        this.maxeditor_pages += 1;

      },
      deletePage() {
        if (this.maxeditor_mode === 'design') {
          return
        }
        console.log('MaxEditor:delete page.');
        if (this.maxeditor_pages > 0) {
          this.maxeditor_pages -= 1;
        }

      },

      //获取页面最大高度（最后一个面板离顶部高度）
      getTotalHeight() {
        let height = 0;
        this.maxeditor_boards.forEach(function (item, index) {
          if (item.y + item.height > height) {
            height = item.y + item.height
          }
        });
        return height;
      },

      //修改面板
      openUpdateDialog(item) {
        let title;
        let that = this;
        if (item.type === 'normal') {
          title = '文本框'
        }
        if (item.type === 'label') {
          title = '标签文本';
          if (that.isExited(item.datalist)) {
            title = '下拉框';
          }
        }
        if (item.type === 'imgBox') {
          title = '图片框'
        }
        if (item.type === 'table') {
          title = '表格'
        }
        this.$refs['maxEditorToolbar_' + this.maxEditorRootId].openUpdateDialog(title);
      },
    },
    updated() {
      //console.log(this.maxeditor_boards)
    },
    mounted() {

    },
    created() {
    },
    watch: {
      maxeditor_mode(n, o) {
        //文本内部下拉框是否可编辑
        if (n === 'readonly') {
          let keywordList = document.getElementsByClassName('maxeditor-keyword');
          for (let i = 0; i < keywordList.length; i++) {
            keywordList[i].setAttribute('contenteditable', 'false')
            keywordList[i].classList.remove('maxeditor-board-outline');
            keywordList[i].classList.remove('maxeditor-keyword-arrow');
          }
          let selectList = document.getElementsByClassName('maxeditor-keyword-select');
          for (let i = 0; i < selectList.length; i++) {
            selectList[i].style.display = 'none'
          }
        } else {
          let keywordList = document.getElementsByClassName('maxeditor-keyword');
          for (let i = 0; i < keywordList.length; i++) {
            keywordList[i].classList.add('maxeditor-board-outline');
            keywordList[i].classList.add('maxeditor-keyword-arrow');
            keywordList[i].setAttribute('contenteditable', 'true')
          }
          let selectList = document.getElementsByClassName('maxeditor-keyword-select');
          for (let i = 0; i < selectList.length; i++) {
            selectList[i].style.display = 'block'
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
