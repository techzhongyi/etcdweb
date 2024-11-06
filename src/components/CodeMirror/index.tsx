import React, { useRef, useEffect } from 'react';
import CodeMirror, { EditorFromTextArea } from 'codemirror';
import 'codemirror/lib/codemirror.css';

// 导入需要的语言模式和样式主题
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/css/css';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/theme/material.css'; // 加载的样式主题 https://codemirror.net/5/theme/
// 代码折叠
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/foldcode.js';
import 'codemirror/addon/fold/foldgutter.js';
import 'codemirror/addon/fold/brace-fold.js';
import 'codemirror/addon/fold/comment-fold.js';
// 定义组件属性类型
interface CodeMirrorEditorProps {
  value: string;
  language: string;
  theme?: string;
  height?: Number;
  width?: Number;
  isChange?: Number;
  onChange: (value: string) => void;
  onBeforeChange?: (value: string) => void;
  onShiftEnter?: () => void;
  onBlur?: (value: string) => void;
  onChangeLine?: () => void;
}

const CodeMirrorEditorModal: React.FC<CodeMirrorEditorProps> = (props) => {
  const { language, value, isChange } = props;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editorRef = useRef<EditorFromTextArea>();

  // 注册JavaScript代码提示
  const registerHelp = () => {
    CodeMirror.registerHelper('hint', 'javascript', (editor, options) => {
      const cursor = editor.getCursor();
      const token = editor.getTokenAt(cursor);
      const word = token.string;

      // 假设你的关键字列表存储在keywords数组中
      const keywords = ['if', 'else', 'for', 'while', 'function', 'class'];

      const list = keywords.filter((keyword) => keyword.startsWith(word));

      return {
        list,
        from: CodeMirror.Pos(cursor.line, token.start),
        to: CodeMirror.Pos(cursor.line, token.end),
      };
    });
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    registerHelp(); // 注册代码提示
    initCodeMirror();
    return () => {
      // 清理和销毁编辑器实例
      editorRef.current?.toTextArea();
    };
  }, []);
  useEffect(() => {
    if(isChange != 2){
      editorRef.current?.setValue(value || '');
    }
  },[value])

  const initCodeMirror = () => {
    const editorConfig = {
      tabSize: 2, // 制表符的宽度。默认为 4。
      fontSize: '16px', // 字体大小
      autoCloseBrackets: true, // 在键入时自动关闭括号和引号
      showCursorWhenSelecting: true, // 当选择处于活动状态时是否应绘制光标。默认为 false。这里设置成自动补全
      lineWrapping: true, // ，CodeMirror 是否应该滚动或换行。默认为false(滚动)。这里设置成换行
      lineNumbers: true, // 是否在编辑器左侧显示行号
      fullScreen: true, //当设置为 时true，将使编辑器全屏显示（如占据整个浏览器窗口）。
      mode: language, // 使用模式
      autofous: false, // 禁止自动聚焦
      theme: 'material', // 编辑器样式的主题 必须确保.cm-s-[name] 加载定义相应样式的 CSS 文件。默认值为"default"，颜色包含在 中codemirror.css。可以一次使用多个主题类，例如将和类"foo bar"都分配给编辑器。cm-s-foocm-s-bar
    };

    editorRef.current = CodeMirror.fromTextArea(
      textareaRef.current!,
      editorConfig,
    );
    // 监听编辑器内容变化事件
    editorRef.current.on('change', codemirrorValueChange);
    editorRef.current.on('keydown', keydown);
    editorRef.current.on('blur', blur);
    const { value, width, height } = props;
    editorRef.current.setValue(value || '');
    if (width || height) {
      editorRef.current.setSize(width, height);
    }
  };

  /** 失焦 */
  const blur = (instance: any) => {
    if (props.onBlur) {
      props.onBlur(instance.doc.getValue());
    }
  };

  /** 键盘按键按下 */
  const keydown = (_: any, change: any) => {
    if (change.shiftKey === true && change.keyCode === 13) {
      if (props.onShiftEnter) {
        props.onShiftEnter();
      }
      change.preventDefault();
    }
  };

  /** 编辑内容变化 */
  const codemirrorValueChange = (doc: any, change: any) => {
    doc.eachLine((line: any) => {
      if (line.text.startsWith('//') || line.text.startsWith('#')) {
        doc.addLineClass(line, 'wrap', 'notes');
      } else if (line.wrapClass === 'notes') {
        doc.removeLineClass(line, 'wrap', 'notes');
      }
    });
    // // 判断是输入择匹配出提示代码
    // // if (change.origin === '+input') {
    // //     CodeMirror.commands.autocomplete(editorRef.current, undefined, {
    // //         completeSingle: false,
    // //     });
    // // }
    if (change.origin !== 'setValue') {
      if (props.onChange) {
        props.onChange(doc.getValue());
      }
    }
  };

  return <textarea ref={textareaRef} />;
};

export default CodeMirrorEditorModal;
