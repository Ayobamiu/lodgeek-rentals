import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
// import Editor from "@draft-js-plugins/editor";
import { EditorState, convertToRaw } from "draft-js";

const TextEditor = () => {
  const [value, setValue] = useState<EditorState | undefined>(
    EditorState.createEmpty()
  );

  const editState = (val: EditorState) => {
    setValue(val);
  };

  return (
    <Editor
      editorState={value}
      toolbarClassName="toolbarClassName"
      wrapperClassName="wrapperClassName border-2 border-gray-200 rounded"
      editorClassName="editorClassName px-4"
      onEditorStateChange={editState}
      //   onChange={editState}
      placeholder="Type the tenant agreement"
      toolbar={{
        inline: { inDropdown: true },
        list: { inDropdown: true },
        textAlign: { inDropdown: true },
        link: { inDropdown: true },
        history: { inDropdown: true },
        emoji: { inDropdown: true },
      }}
    />
  );
};

export default TextEditor;
