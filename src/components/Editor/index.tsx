import React from 'react';
// 引入编辑器组件
import BraftEditor from 'braft-editor';
// 引入编辑器样式
import 'braft-editor/dist/index.css';
import './index.less';
import AliyunOSSUpload from '../AliYunOSSupload';
import { ContentUtils } from 'braft-utils';

export default class Editor extends React.Component {
  state = {
    // 创建一个空的editorState作为初始值
    editorState: BraftEditor.createEditorState(null),
  };

  // async componentDidMount () {
  //     // 假设此处从服务端获取html格式的编辑器内容
  //     const htmlContent = await fetchEditorContent()
  //     // 使用BraftEditor.createEditorState将html字符串转换为编辑器需要的editorStat
  //     this.setState({
  //         editorState: BraftEditor.createEditorState(htmlContent)
  //     })
  // }

  // submitContent = async () => {
  //     // 在编辑器获得焦点时按下ctrl+s会执行此方法
  //     // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
  //     const htmlContent = this.state.editorState.toHTML()
  //     const result = await saveEditorContent(htmlContent)
  // }

  handleEditorChange = (editorState: any) => {
    this.setState({ editorState });
    if (!editorState.isEmpty()) {
      const content = editorState.toHTML();
      this.props.setDetails(content);
    } else {
      this.props.setDetails('');
    }
  };
  InsertImage = (url: any) => {
    this.setState({
      editorState: ContentUtils.insertMedias(this.state.editorState, [
        {
          type: 'IMAGE',
          url,
        },
      ]),
    });
  };

  render() {
    const extendControls = [
      {
        key: 'antd-uploader',
        type: 'component',
        component: (
          <AliyunOSSUpload isShowUploadList={false} setSrc={this.InsertImage}>
            <button
              type="button"
              className="control-item button upload-button"
              data-title="插入图片"
            >
              插入图片
              {/* <Icon type="picture" theme="filled" /> */}
            </button>
          </AliyunOSSUpload>
        ),
      },
    ];
    const { editorState } = this.state;
    return (
      <div className="my-editor">
        <BraftEditor
          value={editorState}
          onChange={this.handleEditorChange}
          extendControls={extendControls}
        />
      </div>
    );
  }
}
