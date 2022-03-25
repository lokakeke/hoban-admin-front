<template>
  <div>
    <v-label v-if="label">{{ label }}</v-label>
    <v-card class="v-editor mt-3" v-if="readonly === false">
      <v-card-title class="grey lighten-4">
        <editor-menu-bar :editor="editor" v-slot="context">
          <div>
            <v-item-group class="v-btn-toggle">
              <v-editor-btn top icon="mdi-undo" @click="context.commands.undo">실행 취소</v-editor-btn>
              <v-editor-btn top icon="mdi-redo" @click="context.commands.redo">다시 실행</v-editor-btn>
            </v-item-group>
            <v-item-group class="v-btn-toggle ml-2">
              <v-editor-btn
                top
                icon="mdi-format-bold"
                :active="context.isActive.bold()"
                @click="context.commands.bold"
              >굵게 &lt;strong&gt;</v-editor-btn>
              <v-editor-btn
                top
                icon="mdi-format-italic"
                :active="context.isActive.italic()"
                @click="context.commands.italic"
              >기울이기 &lt;em&gt;</v-editor-btn>
              <v-editor-btn
                top
                icon="mdi-format-strikethrough"
                :active="context.isActive.strike()"
                @click="context.commands.strike"
              >취소선 &lt;strike&gt;</v-editor-btn>
              <v-editor-btn
                top
                icon="mdi-format-underline"
                :active="context.isActive.underline()"
                @click="context.commands.underline"
              >밑줄 &lt;u&gt;</v-editor-btn>
            </v-item-group>
            <v-item-group class="v-btn-toggle ml-2">
              <v-editor-btn
                top
                icon="mdi-format-paragraph"
                :active="context.isActive.paragraph()"
                @click="setParagraph(context)"
              >문단 &lt;p&gt;</v-editor-btn>
              <v-editor-btn
                top
                v-for="level in [1,2,3,4,5,6]"
                :key="level"
                :icon="`mdi-format-header-${level}`"
                :active="context.isActive.heading({ level })"
                @click="setHeading(context, level)"
              >제목 {{ level }} &lt;h{{ level }}&gt;</v-editor-btn>
            </v-item-group>
            <div class="helper-area">
              <v-tooltip left>
                <template v-slot:activator="{ on }">
                  <v-btn small icon v-on="on">
                    <v-icon>mdi-help-circle</v-icon>
                  </v-btn>
                </template>
                <div class="mt-1 mb-1">
                  <h3>에디터 도움말</h3>
                  <kbd>Ctrl</kbd> + <kbd>Z</kbd> : 실행 취소<br />
                  <kbd>Ctrl</kbd> + <kbd>Y</kbd> : 다시 실행<br />
                  <kbd>Enter</kbd> : 문단 &lt;p&gt; 생성<br />
                  <kbd>Shift</kbd> + <kbd>Enter</kbd> : 줄바꿈 &lt;br&gt;<br />
                  <kbd><v-icon x-small>mdi-windows</v-icon> Win</kbd> + <kbd>.</kbd> : 이모지(Emoji)
                  <ul class="mt-1">
                    <li>탐색기에서 이미지를 드래그하여<br />에디터에 드롭하면 이미지가 삽입됩니다.</li>
                    <li>엑셀에서 테이블을 복사하여<br />붙여넣으면 테이블이 삽입됩니다.</li>
                    <li>텍스트 혹은 이미지를 선택하면<br />URL 링크를 등록할 수 있습니다.</li>
                  </ul>
                </div>
              </v-tooltip>
            </div>
            <div class="mt-2">
              <v-item-group class="v-btn-toggle">
                <v-editor-btn
                  top
                  icon="mdi-format-align-left"
                  :active="equalAlignment(context, 'left')"
                  @click="setAlignment(context, 'left')"
                >왼쪽 정렬</v-editor-btn>
                <v-editor-btn
                  top
                  icon="mdi-format-align-center"
                  :active="equalAlignment(context, 'center')"
                  @click="setAlignment(context, 'center')"
                >가운데 정렬</v-editor-btn>
                <v-editor-btn
                  top
                  icon="mdi-format-align-right"
                  :active="equalAlignment(context, 'right')"
                  @click="setAlignment(context, 'right')"
                >오른쪽 정렬</v-editor-btn>
                <v-editor-btn
                  top
                  icon="mdi-format-align-justify"
                  :active="equalAlignment(context, 'justify')"
                  @click="setAlignment(context, 'justify')"
                >양쪽 정렬</v-editor-btn>
              </v-item-group>
              <v-item-group class="v-btn-toggle ml-2">
                <v-editor-btn
                  top
                  icon="mdi-format-list-bulleted"
                  :active="context.isActive.bullet_list()"
                  @click="context.commands.bullet_list"
                >순서없는 목록 &lt;ul&gt;</v-editor-btn>
                <v-editor-btn
                  top
                  icon="mdi-format-list-numbered"
                  :active="context.isActive.ordered_list()"
                  @click="context.commands.ordered_list"
                >순서있는 목록 &lt;ol&gt;</v-editor-btn>
              </v-item-group>
              <v-item-group class="v-btn-toggle ml-2">
                <v-editor-btn
                  top
                  icon="mdi-table-plus"
                  @click="context.commands.createTable({ rowsCount: 3, colsCount: 3, withHeaderRow: false })"
                >테이블 등록 &lt;table&gt;</v-editor-btn>
                <v-editor-btn
                  top
                  icon="mdi-image-plus"
                  @click="openImageDialog(context)"
                >이미지 등록 &lt;img&gt;</v-editor-btn>
              </v-item-group>
            </div>
            <div class="mt-2" v-if="context.isActive.table()">
              <!-- 표 도구 -->
              <v-item-group class="v-btn-toggle">
                <v-editor-btn bottom icon="mdi-table-remove" @click="context.commands.deleteTable">현재 테이블 삭제</v-editor-btn>
                <v-editor-btn
                  bottom
                  icon="mdi-table-column-plus-before"
                  @click="context.commands.addColumnBefore"
                >앞에 열 등록</v-editor-btn>
                <v-editor-btn
                  bottom
                  icon="mdi-table-column-plus-after"
                  @click="context.commands.addColumnAfter"
                >뒤에 열 등록</v-editor-btn>
                <v-editor-btn
                  bottom
                  icon="mdi-table-column-remove"
                  @click="context.commands.deleteColumn"
                >현재 열 삭제</v-editor-btn>
                <v-editor-btn
                  bottom
                  icon="mdi-table-row-plus-before"
                  @click="context.commands.addRowBefore"
                >위에 행 등록</v-editor-btn>
                <v-editor-btn
                  bottom
                  icon="mdi-table-row-plus-after"
                  @click="context.commands.addRowAfter"
                >아래에 행 등록</v-editor-btn>
                <v-editor-btn
                  bottom
                  icon="mdi-table-row-remove"
                  @click="context.commands.deleteRow"
                >현재 행 삭제</v-editor-btn>
                <v-editor-btn
                  bottom
                  icon="mdi-table-merge-cells"
                  @click="context.commands.toggleCellMerge"
                >셀 병합/해제</v-editor-btn>
              </v-item-group>
              <v-item-group class="v-btn-toggle ml-2">
                <v-editor-btn
                  bottom
                  icon="mdi-table-column"
                  @click="context.commands.toggleHeaderColumn"
                >현재 열 헤더 설정/해제</v-editor-btn>
                <v-editor-btn
                  bottom
                  icon="mdi-table-row"
                  @click="context.commands.toggleHeaderRow"
                >현재 행 헤더 설정/해제</v-editor-btn>
                <v-editor-btn
                  bottom
                  icon="mdi-crop-square"
                  @click="context.commands.toggleHeaderCell"
                >현재 셀 헤더 설정/해제</v-editor-btn>
              </v-item-group>
            </div>
          </div>
        </editor-menu-bar>
      </v-card-title>
      <v-card-text>
        <editor-menu-bubble class="menububble" :editor="editor" v-slot="{ commands, isActive, getMarkAttrs, menu }">
          <div
            class="menububble"
            :class="{ 'is-active': menu.isActive }"
            :style="`left: ${menu.left}px; bottom: ${menu.bottom}px;`"
          >
            <button
              type="button"
              :class="{ 'is-active': isActive.link() }"
              @click="openLinkDialog({ commands }, getMarkAttrs('link'))"
            >
              <v-icon left x-small>mdi-link-variant</v-icon>
              <span>{{ isActive.link() ? '링크 수정' : '링크 등록'}}</span>
            </button>
          </div>
        </editor-menu-bubble>
        <editor-content class="editor-content mt-3" :editor="editor" />
      </v-card-text>
    </v-card>
    <div class="v-editor readonly pa-4" v-else>
      <editor-content class="editor-content mt-3" :editor="editor" :readonly="readonly" />
    </div>
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar, EditorMenuBubble, Node } from 'tiptap'
import {
  Blockquote,
  Bold,
  BulletList,
  Code,
  CodeBlock,
  HardBreak,
  Heading,
  History,
  Image,
  Italic,
  Link,
  ListItem,
  OrderedList,
  Placeholder,
  Strike,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  TodoItem,
  TodoList,
  Underline
} from 'tiptap-extensions'
import { toggleBlockType } from 'tiptap-commands'
import VEditorBtn from './VEditorBtn'

class CustomParagraph extends Node {
  get name () {
    return 'paragraph'
  }

  get schema () {
    return {
      attrs: {
        textAlign: {
          default: 'left'
        }
      },
      content: 'inline*',
      group: 'block',
      draggable: false,
      parseDOM: [
        {
          tag: 'p',
          getAttrs: (node) => ({
            textAlign: node.style.textAlign || 'left'
          })
        }
      ],
      toDOM: (node) => ['p', { style: `text-align: ${node.attrs.textAlign}` }, 0]
    }
  }

  commands ({ type, schema }) {
    return (attrs) => toggleBlockType(type, schema.nodes.paragraph, attrs)
  }
}

class CustomHeading extends Heading {
  get schema () {
    return {
      attrs: {
        level: {
          default: 1
        },
        textAlign: {
          default: 'left'
        }
      },
      content: 'inline*',
      group: 'block',
      defining: true,
      draggable: false,
      parseDOM: this.options.levels
        .map(level => ({
          tag: `h${level}`,
          attrs: { level },
          getAttrs: (node) => ({
            textAlign: node.style.textAlign || 'left'
          })
        })),
      toDOM: (node) => [`h${node.attrs.level}`, { style: `text-align: ${node.attrs.textAlign}` }, 0]
    }
  }

  commands ({ type, schema }) {
    return attrs => toggleBlockType(type, schema.nodes.paragraph, attrs)
  }
}

export default {
  name: 'CommonEditor',
  model: {
    prop: 'content',
    event: 'change'
  },
  components: {
    EditorContent,
    EditorMenuBar,
    EditorMenuBubble,
    VEditorBtn
  },
  props: {
    /**
     * 레이블
     */
    label: {
      type: String
    },
    /**
     * 내용
     */
    content: {
      type: String
    },
    /**
     * placeholder
     */
    placeholder: {
      type: String,
      default () {
        return '여기에 내용을 입력하세요...'
      }
    },
    /**
     * 읽기전용 여부
     */
    readonly: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  data () {
    return {
      editor: null,
      html: null
    }
  },
  watch: {
    readonly () {
      this.editor.setOptions({
        editable: this.readonly === false
      })
    }
  },
  mounted () {
    this.init()
  },
  beforeDestroy () {
    this.editor.destroy()
  },
  methods: {
    /**
     * 초기화
     */
    init () {
      this.editor = new Editor({
        extensions: [
          new Blockquote(),
          new BulletList(),
          new CodeBlock(),
          new HardBreak(),
          new ListItem(),
          new OrderedList(),
          new TodoItem(),
          new TodoList(),
          new Link(),
          new Bold(),
          new Code(),
          new Italic(),
          new Strike(),
          new Underline(),
          new History(),
          new Table({
            resizable: true
          }),
          new TableHeader(),
          new TableCell(),
          new TableRow(),
          new Image(),
          new Placeholder({
            emptyEditorClass: 'is-editor-empty',
            emptyNodeClass: 'is-empty',
            emptyNodeText: this.placeholder,
            showOnlyWhenEditable: true,
            showOnlyCurrent: true
          }),
          new CustomParagraph(),
          new CustomHeading()
        ],
        content: this.content,
        editable: this.readonly === false,
        onUpdate: ({ getHTML }) => {
          this.html = getHTML()
          if (this.html === '<p></p>') this.html = ''
          this.$emit('change', this.html)
        }
      })
    },
    /**
     * 문단 설정
     */
    setParagraph ({ commands, isActive, getNodeAttrs }) {
      const attr = getNodeAttrs(isActive.paragraph() ? 'paragraph' : 'heading')
      commands.paragraph(attr)
    },
    /**
     * 제목 설정
     */
    setHeading ({ isActive, commands, getNodeAttrs }, level) {
      const attr = getNodeAttrs(isActive.paragraph() ? 'paragraph' : 'heading')
      commands.heading(Object.assign(attr, { level }))
    },
    /**
     * 정렬값이 동일한지 확인
     */
    equalAlignment ({ isActive }, textAlign) {
      return Boolean(isActive.paragraph({ textAlign }) || isActive.heading({ textAlign }))
    },
    /**
     * 정렬하기
     */
    setAlignment ({ isActive, commands, getNodeAttrs }, textAlign) {
      if (isActive.paragraph()) {
        commands.paragraph({ textAlign })
      } else {
        const level = getNodeAttrs('heading').level
        commands.heading({ level, textAlign })
      }
    },
    /**
     * 링크 Dialog 열기
     */
    openImageDialog ({ isActive, commands, getNodeAttrs }) {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Editor/VEditorImageDialog',
        options: {
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          width: 600,
          closeCallback: params => {
            if (params) {
              if (params.imageUrl !== undefined) {
                commands.image({ src: params.imageUrl })
              } else if (params.imageFile !== undefined) {
                // TODO
              }
            }
          }
        }
      })
    },
    /**
     * 링크 Dialog 열기
     */
    openLinkDialog ({ isActive, commands, getNodeAttrs }, attrs) {
      this.$store.dispatch('dialog/open', {
        componentPath: '/Editor/VEditorLinkDialog',
        params: {
          linkUrl: attrs.href || ''
        },
        options: {
          fullscreen: false,
          retainFocus: false,
          persistent: true,
          scrollable: true,
          width: 600,
          closeCallback: params => {
            if (params && params.linkUrl !== undefined) {
              commands.link({ href: params.linkUrl })
            }
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">
.v-editor {
  position: relative;
  .helper-area {
    position: absolute;
    top: 12px;
    right: 12px;
  }
  .menububble {
    position: absolute;
    display: -webkit-box;
    display: flex;
    z-index: 20;
    background: #000;
    border-radius: 5px;
    padding: .3rem .6rem;
    margin-bottom: .5rem;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    visibility: hidden;
    opacity: 0;
    -webkit-transition: opacity .2s,visibility .2s;
    transition: opacity .2s,visibility .2s;
    color: white;
    &.is-active {
      opacity: 1;
      visibility: visible;
    }
    input {
      color: white;
    }
  }
  img {
    max-width: 100%;
    &.ProseMirror-selectednode {
      filter: opacity(80%);
    }
  }
  p.is-editor-empty {
    &:first-child::before {
      content: attr(data-empty-text);
      float: left;
      color: #aaa;
      pointer-events: none;
      height: 0;
    }
  }
  :focus {
    outline: 1px dotted #ddd;
  }
  ul,
  ol {
    padding-left: 1rem;
  }

  li > p,
  li > ol,
  li > ul {
    margin: 0;
  }

  a {
    color: inherit;
    cursor: pointer;
    text-decoration: underline;
    &:hover {
      text-decoration: underline;
    }
  }

  blockquote {
    border-left: 3px solid rgba(#000, 0.1);
    color: rgba(#000, 0.8);
    padding-left: 0.8rem;
    font-style: italic;

    p {
      margin: 0;
    }
  }

  img {
    max-width: 100%;
    border-radius: 3px;
  }

  table {
    border-collapse: collapse;
    table-layout: fixed;
    width: 100%;
    margin: 0;
    overflow: hidden;

    td, th {
      min-width: 1em;
      border: 2px solid #ddd;
      padding: 3px 5px;
      vertical-align: middle;
      box-sizing: border-box;
      position: relative;
      > * {
        margin-top: 0;
        margin-bottom: 0;
        vertical-align: middle;
      }
    }

    th {
      background: #e7e7e7;
    }

    .selectedCell:after {
      z-index: 2;
      position: absolute;
      content: "";
      left: 0; right: 0; top: 0; bottom: 0;
      background: rgba(200, 200, 255, 0.4);
      pointer-events: none;
    }

    .column-resize-handle {
      position: absolute;
      right: -2px; top: 0; bottom: 0;
      width: 4px;
      z-index: 20;
      background-color: #adf;
      pointer-events: none;
    }
  }

  .tableWrapper {
    margin: 1em 0;
    overflow-x: auto;
  }

  &.readonly {
    :focus {
      outline: none;
    }
  }
}
</style>
