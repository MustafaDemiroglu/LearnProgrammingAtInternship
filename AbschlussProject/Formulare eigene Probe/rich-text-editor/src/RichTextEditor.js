import React, { useState } from 'react';
import { EditorState, RichUtils, AtomicBlockUtils } from 'draft-js';
import 'draft-js/dist/Draft.css';
import Editor from '@draft-js-plugins/editor';
import createImagePlugin from '@draft-js-plugins/image';
import '@draft-js-plugins/image/lib/plugin.css';

const imagePlugin = createImagePlugin();
const plugins = [imagePlugin];

const RichTextEditor = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const onBoldClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
  };

  const onItalicClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'ITALIC'));
  };

  const onUnderlineClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'UNDERLINE'));
  };

  const onStrikeThroughClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'STRIKETHROUGH'));
  };

  const onOrderedListClick = () => {
    setEditorState(RichUtils.toggleBlockType(editorState, 'ordered-list-item'));
  };

  const onUnorderedListClick = () => {
    setEditorState(RichUtils.toggleBlockType(editorState, 'unordered-list-item'));
  };

  const onAddImage = () => {
    const url = window.prompt('Enter the URL of the image:');
    if (url) {
      const contentState = editorState.getCurrentContent();
      const contentStateWithEntity = contentState.createEntity('IMAGE', 'IMMUTABLE', { src: url });
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
      const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
      setEditorState(
        AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' ')
      );
    }
  };

  const onAddLink = () => {
    const url = window.prompt('Enter the URL of the link:');
    if (url) {
      const contentState = editorState.getCurrentContent();
      const contentStateWithEntity = contentState.createEntity('LINK', 'MUTABLE', { url });
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
      const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
      setEditorState(RichUtils.toggleLink(newEditorState, newEditorState.getSelection(), entityKey));
    }
  };

  return (
    <div>
      <button onClick={onBoldClick}>Bold</button>
      <button onClick={onItalicClick}>Italic</button>
      <button onClick={onUnderlineClick}>Underline</button>
      <button onClick={onStrikeThroughClick}>Strikethrough</button>
      <button onClick={onOrderedListClick}>Ordered List</button>
      <button onClick={onUnorderedListClick}>Unordered List</button>
      <button onClick={onAddImage}>Add Image</button>
      <button onClick={onAddLink}>Add Link</button>
      <div style={{ border: '1px solid black', minHeight: '6em', padding: '10px' }}>
        <Editor
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          onChange={setEditorState}
          plugins={plugins}
        />
      </div>
    </div>
  );
};

export default RichTextEditor;
