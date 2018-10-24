# vue-maxeditor

> 基于vue-draggable-resizable的电子病历编辑器

## 功能

* 通过新增拖拽面板编辑编辑内容
* 设计、编辑、只读模式


## 使用方法

``` bash
$ npm install --save vue-maxeditor
```

使用组件

```vue
<template>
  <div>
    <MaxEditor></MaxEditor>
  </div>
</template>

<script>
import MaxEditor from 'vue-maxeditor'

export default {
  components:{ MaxEditor}
}
</script>
```

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

### addSection(id)
插入多行文本面板，需要传入id

示例：
```js
this.$refs.maxeditor.addSection(id)
```

### addSection(id)
插入多行文本面板，需要传入id

### addSectionWithTitle(id, title)
插入带标题多行文本面板

### addTextWithLabel(id, label) 
插入带标签输入框

### addHr() 
插入分隔线

### addImgBox(id)
插入图片容器

### insertImg(id,imgs)

向图片容器中插入图片，imgs为json数组

```json
[{"src":"http://dmt.upload.streakingman.com/test01.jpg"},
{"src":"http://dmt.upload.streakingman.com/test01.jpg"},
{"src":"http://dmt.upload.streakingman.com/test01.jpg"},
{"src":"http://dmt.upload.streakingman.com/test01.jpg"}]
```
插入单张图片时也需要传入数组，此时图片宽度占满图片容器
图片数量大于1时宽度为固定值160px

###

###


### setMode(mode)
设置编辑器模式，可选值为'design'、'edit'、 'readonly'

### getMode()
获取当前模式, 返回值为'design'||'edit'|| 'readonly'

### getBoards()
获取面板列表，返回值为json数组，示例如下

```json
[{"component":"maxeditor-board","id":"3","type":"label","isFluid":false,"title":null,"label":"3","x":75,"z":1025,"width":100,"height":25,"y":75,"w":100,"h":50},
{"component":"maxeditor-board","id":"1","type":"label","isFluid":false,"title":null,"label":"1","x":275,"z":1025,"width":100,"height":25,"y":75,"w":100,"h":50},
{"component":"maxeditor-board","id":"4","type":"label","isFluid":false,"title":null,"label":"4","x":475,"z":1025,"width":100,"height":25,"y":75,"w":100,"h":50}]
```

### setBoards(boards)
设置面板列表，boards为json数组，结构如上

### getCurrentBoardContent()
获取当前编辑面板内容，返回值为html代码

### getCurrentBoardId()
获取当前编辑面板id

### getBoardContent(id)
根据id获取面板内容，返回值为html代码

### getBoardContentText(id)
根据id获取面板内容，innerText

### setBoardContent(id, content)
设置面版内容，content可为html代码或文本内容

### editInsertText(text)
在光标处插入文本

### editInsertDatalist(id, values)
在光标处插入下拉框，values为选项json数组，示例如下

```json
[{"value":"数据1"},
{"value":"数据2"},
{"value":"数据3"}]
```



