import React from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import config from 'config'
import CodeEditor from './CodeEditor'
import HtmlEditor from './HtmlEditor'
import MarkDownEditor from './MarkDownEditor'
import UnknownEditor from 'components/Editor/components/UnknownEditor'
import ImageEditor from 'components/Editor/components/ImageEditor'
import pluginStore from '../../Plugins/store'

const editorSet = [
  {
    editorType: 'htmlEditor',
    editor: HtmlEditor,
  },
  {
    editorType: 'markdownEditor',
    editor: MarkDownEditor,
  },
  {
    editorType: 'imageEditor',
    editor: ImageEditor,
  },
  {
    editorType: 'textEditor',
    editor: CodeEditor,
  },
  {
    editorType: 'unknownEditor',
    editor: UnknownEditor,
  },
];

function matchEditorByContentType(editorType, contentType) {
  for (let i = 0, n = editorSet.length; i < n; i++) {
    const set = editorSet[i];
    if (set.editorType) {
      if (set.editorType === editorType) {
        return set.editor;
      }
    } else if (set.mime) {
      if (set.mime.includes(contentType)) {
        return set.editor;
      }
    }
  }
  return UnknownEditor;
}

const EditorWrapper = observer(({ tab, active }) => {
  // loading
  if (tab.file && tab.file.isEditorLoading) {
    return (
      <div className="editor-spinner">
        <i className="fa fa-spinner fa-pulse"></i>
      </div>
    )
  }
  const { editor, editorInfo } = tab;
  //const editorType = editorInfo.editorType || 'default';
  const file = editor.file || {};
  // 编辑器插件
  const pluginArray = pluginStore.plugins.values().filter(plugin => plugin.label.editorType)
  const viewEntries = pluginStore.views;
  const viewKeys = Object.keys(viewEntries);
  let pluginViews = [];
  for (let i = 0, n = pluginArray.length; i < n; i++) {
    const plugin = pluginArray[i];
    viewKeys.forEach(key => {
      if (key === plugin.viewId) {
        pluginViews.push(viewEntries[key]);
      }
    });
  }
  // key is crutial here, it decides whether
  // the component should re-construct or
  // keep using the existing instance.
  const key = `editor_${file.path}`;
  const editorElement = matchEditorByContentType(editorInfo.editorType, editorInfo.contentType);
  return React.createElement(editorElement, { editor, editorInfo, key, tab, active, language: config.mainLanguage, path: file.path, size: file.size });
  // switch (editorType) {
  //   case 'htmlEditor':
  //     return React.createElement(HtmlEditor, { editor, editorInfo, key, tab, active, language: '' })
  //   case 'textEditor':
  //     return React.createElement(CodeEditor, { editor, editorInfo, key, tab, active, language: config.mainLanguage })
  //   case 'markdownEditor':
  //     return React.createElement(MarkDownEditor, { editor, editorInfo, key, tab, active, language: config.mainLanguage })
  //   case 'imageEditor':
  //     return React.createElement(ImageEditor, { path: file.path, key, tab, active })
  //   case 'unknownEditor':
  //     return React.createElement(UnknownEditor, { path: file.path, size: file.size, key, tab, active })
  //   default:
  //     return React.createElement(UnknownEditor, { path: file.path, size: file.size, key, tab, active })
  // }
})

EditorWrapper.propTypes = {
  tab: PropTypes.object
}

EditorWrapper.contextTypes = {
  i18n: PropTypes.func
}

export default EditorWrapper

export {
  CodeEditor,
}
