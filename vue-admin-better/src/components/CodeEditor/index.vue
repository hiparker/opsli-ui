<template>
  <div class="code-editor">
    <label>
      <textarea ref="textarea" />
    </label>
  </div>
</template>

<script>
  import CodeMirror from "codemirror";
  import "codemirror/addon/lint/lint.css";
  import "codemirror/lib/codemirror.css";
  import "codemirror/theme/pastel-on-dark.css";

  import "codemirror/mode/css/css.js";
  import "codemirror/mode/javascript/javascript";
  import "codemirror/mode/xml/xml.js";

  import "codemirror/addon/lint/lint";
  import "codemirror/addon/lint/json-lint";
  import "codemirror/addon/hint/javascript-hint.js";
  import "codemirror/addon/hint/xml-hint.js";
  import "codemirror/addon/hint/css-hint.js";
  import "codemirror/addon/hint/html-hint.js";
  import "codemirror/addon/hint/sql-hint.js";
  import "codemirror/addon/display/autorefresh";

  require("script-loader!jsonlint");

  export default {
    name: "CodeEditor",
    props: {
      value: {
        type: String,
        default: () => {
          return "";
        },
      },
    },
    data() {
      return {
        codeEditor: false,
      };
    },
    mounted() {
      this.codeEditor = CodeMirror.fromTextArea(this.$refs.textarea, {
        autofocus: true,
        styleActiveLine: true, // 高亮选中行
        lineNumbers: true, // 显示行号
        mode: "xml",
        theme: "pastel-on-dark", // 主题
        // 可以用于为编辑器指定额外的键绑定，以及keyMap定义的键绑定
        extraKeys: { Ctrl: "autocomplete" },
        gutters: [
          "CodeMirror-lint-markers",
          "CodeMirror-linenumbers",
          "CodeMirror-foldgutter",
        ],
        lint: true,
        matchTags: { bothTags: true },
        matchBrackets: true,
        styleSelectedText: true,
        autoRefresh: true,
        lineWrapping: true,
      });

      this.codeEditor.setValue(this.value);
      this.codeEditor.on("change", (cm) => {
        this.$emit("change", cm.getValue());
      });
    },
    methods: {
      refresh() {
        this.codeEditor.refresh();
      },
      getValue() {
        return this.codeEditor.getValue();
      },
    },
  };
</script>

<style scoped>
  .code-editor {
    position: relative;
    height: 100%;
  }

  .code-editor >>> .CodeMirror {
    height: auto;
    min-height: calc(100vh - 220px);
  }

  .code-editor >>> .CodeMirror-scroll {
    min-height: calc(100vh - 220px);
  }

  .code-editor >>> .cm-s-rubyblue span.cm-string {
    color: #f08047;
  }

  .code-editor >>> .cm-s-rubyblue .CodeMirror-gutters {
    padding-right: 10px;

    /* background: transparent; */
    border-right: 1px solid #fff;
  }

  .code-editor >>> .cm-s-rubyblue.CodeMirror {
    /* background: #08233e; */
    color: white;
  }
</style>
