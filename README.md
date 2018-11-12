# vue-maxeditor

> 基于vue-draggable-resizable的电子病历编辑器

* [功能](#功能)
* [使用方法](#使用方法)
* [属性](#属性)
* [全局方法](#全局方法)
* [面板方法](#面板方法)
  * [通用方法](#通用方法)
  * [分隔线](#分隔线)
  * [文本框](#文本框)
  * [标签文本](#标签文本)
  * [下拉框](#分隔线)
  * [图片容器](#图片容器)
* [其他](#其他方法)


## 功能

* 通过新增拖拽面板编辑编辑内容
* 设计、编辑、只读模式
* 很多


## 使用方法
安装vue-draggable-resizable
``` bash
$ npm install --save vue-draggable-resizable
```
安装qrcodeautojs,在package.json中写入配置后进行安装
```json
"dependencies":{
  "qrcodeautojs": "git+https://github.com/MaxYYYYY/qrcodejs.git"
}
```
```bash
npm install 
```
最后将assets中所有文件拷贝到你的项目中，在Vue通过import引入

```vue
<template>
  <div>
    <MaxEditor></MaxEditor>
  </div>
</template>

<script>
import MaxEditor from './your/dir/maxeditor/assets'

export default {
  components:{ MaxEditor}
}
</script>
```

## 属性 
#### maxEditorRootId
Type: `String`<br>
Required: `true`<br>
Default: `maxEditor_00`
编辑器id，多tab下需要传入

#### width
Type: `Number`<br>
Required: `false`<br>
Default: `794`

#### height
Type: `Number`<br>
Required: `false`<br>
Default: `1124`

#### paddingX
Type: `Number`<br>
Required: `false`<br>
Default: `20`

左右边距

#### paddingY
Type: `Number`<br>
Required: `false`<br>
Default: `20`

上下边距

#### isModeBtnShow
Type: `Boolean`<br>
Required: `false`<br>
Default: `false`

面板相关按钮是否可见

## 方法
方法通过钩子调用
```vue
<template>
  <div >
    <button @click="getBoards"></button>
    <MaxEditor ref="maxeditor"></MaxEditor>
  </div>
</template>

<script>
import MaxEditor from 'vue-maxeditor'

export default {
  components:{ MaxEditor},
  methods: {
    getBoards(){
      this.$refs.maxeditor.getBoards()
    },
  }
}
</script>
```

## 全局方法

#### getBoards()
获取面板列表，返回值为json数组，示例如下

```json
[{"component":"maxeditor-board","id":"3","type":"label","isFluid":false,"title":null,"label":"3","x":75,"z":1025,"width":100,"height":25,"y":75,"w":100,"h":50},
{"component":"maxeditor-board","id":"1","type":"label","isFluid":false,"title":null,"label":"1","x":275,"z":1025,"width":100,"height":25,"y":75,"w":100,"h":50},
{"component":"maxeditor-board","id":"4","type":"label","isFluid":false,"title":null,"label":"4","x":475,"z":1025,"width":100,"height":25,"y":75,"w":100,"h":50}]
```

#### setBoards(boards)
设置面板列表，boards为json数组(对象以及字符串皆可)，结构如上

#### clearBoards()
清除所有面板

#### setMode(mode)
设置编辑器模式，可选值为'design'、'edit'、 'readonly'

#### getMode()
获取当前模式, 返回值为'design'||'edit'|| 'readonly'

#### activeBoard(id)
根据id激活面板

#### deactiveBoard(id)
释放面板焦点

#### getCurrentBoardContent()
获取当前编辑面板内容，返回值为html代码

#### getCurrentBoardId()
获取当前编辑面板id

## 面板方法

### 通用方法

#### updateId(oId, nId)
更改面板id

#### updateTitle(id, title)
更改面板标题（仅文本框可修改）

#### updateLabel(id, label)
更改标签（仅标签文本和下拉框可用）

#### updateZ(id, zindex) 
更改面板z-index值

#### getBoard(id)
更具id获取面板对象，返回值示例如下
```
{
  component: "maxeditor-board",
  content: "春眠不觉晓<div>处处闻啼鸟</div>",
  height: 48,
  id: "dd",
  imgs: null,
  isFluid: false,
  isSingleLine: false,
  label: null,
  title: null,
  type: "normal",
  width: 200,
  x: 168,
  y: 224,
  z: 999,
}
```

#### getBoardContent(id)
根据id获取面板内容，返回值为html代码

#### getBoardContentText(id)
根据id获取面板内容，innerText

#### setBoardContent(id, content)
设置面版内容，content可为html代码或文本内容


### 分隔线

#### addHr() 
插入分隔线

### 文本框

#### addSection(id)
插入普通多行文本面板，需要传入id

#### addSectionWithTitle(id, title)
插入带标题多行文本面板

#### addReadOnlySection(id)
插入不可编辑的文本面板，该面板内容仅在设计模式下可编辑

### 标签文本

#### addTextWithLabel(id, label) 
插入带标签输入框

### 下拉框

#### addDropDownWithLabel(id, label, datalist) 
插入带标签下拉框，datalist示例如下

```json
[{"value":"张三","id":"doctor_1"},
{"value":"李四","id":"doctor_2"},
{"value":"王五","id":"doctor_3"}]
```

#### updateDropDownList(id, datalist)
更新下拉面板的选项列表，datalist如上所示

#### getDropDownList(id)
获取下拉框选项列表

#### getDropDownCurrentItem(id)
获取下拉框当前选中项，返回值为对象
```json
{"value":"张三","id":"doctor_1"}
```

#### setDropDownCurrentItem(id, itemId)
设置下拉框选中选项，itemId为选项的id

### 图片容器

#### addImgBox(id)
插入图片容器

#### insertImg(id,imgs)

向图片容器中插入图片，imgs为json数组

```json
[{
   "src": "http://dmt.upload.streakingman.com/test01.jpg",
   "tab": {
     "position": "tr", 
     "color":"green"
   },
   "key": "pic2",
   "label": "pic2"
 }]
```
插入单张图片时也需要传入数组，此时图片大小根据容器高度而定
图片数量大于1时宽度为固定值160px

#### clearImgBoxContent(id)
清空图片容器内容

#### insertQrCode(id, url)

向图片容器中插入二维码

#### addImg(id, img, cb)
像图片容器中插入单张图片，img格式如下
```json
{
  "src": "http://dmt.upload.streakingman.com/test01.jpg",
  "tab": {
    "position": "br", 
    "color":"green"
  },
  "key": "pic2",
  "label": "pic2"
}
```
tab的position为角标位置，有四个可选值tl、tr、bl、br，分别为左上角、右上角、左下角、右下角。

color为背景颜色，值可为颜色名称或颜色代码（如white、#ff3306）

cb为回掉函数，返回插入图片的dom元素
```js
addImg(id, img, function (imgDom) {
  console.log(imgDom)
  //DO SOMETHING
})
```

#### deleteImg(id, key)
根据key删除图片

#### bindImgTabBox(changerBoxId, watcherBoxId)
绑定扫描图容器和示意图容器，两个入参分别为扫描图的容器id和示意图的容器id
被绑定的扫描图容器务必设置tab属性

#### unBindImgTabBox(changerBoxId, watcherBoxId)
解除绑定

## 其他方法

#### editInsertText(text)
在光标处插入文本，此方法底层为execCommand，所以调用时若焦点转移则无法插入

#### editInsertDatalist(id, values)
在光标处插入下拉框，values为选项json数组，示例如下

```json
[{"value":"数据1"},
{"value":"数据2"},
{"value":"数据3"}]
```


