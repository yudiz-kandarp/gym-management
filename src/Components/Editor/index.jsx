import React from 'react'
import { Editor } from '@tinymce/tinymce-react'
import PropTypes from 'prop-types'

const InterviewEditor = ({ defaultContent, setDesc }) => {
  function handleChange(e) {
    setDesc(e.level.content)
  }
  return (
    <div>
      <Editor
        onChange={handleChange}
        // value={defaultContent}
        initialValue={defaultContent}
        apiKey="xhsskfone7ljgh2p85qq6zr8dx6spq42ojouxpmmur9n10qr"
        init={{
          height: 300,
          menubar: 'file view insert tools format table',
          toolbar1: 'undo redo | blocks | quickimage | bold italic blockquote underline | bullist numlist outdent indent ',
          plugins:
            'lists link code preview charmap image media wordcount anchor fullscreen autolink autoresize autosave bbcode codesample directionality emoticons fullpage help hr image imagetools importcss insertdatetime legacyoutput nonbreaking noneditable pagebreak paste print quickbars searchreplace spellchecker tabfocus template textpattern toc visualblocks visualchars table',
          branding: false,
          // toolbar_mode: 'wrap',
        }}
      />
      {/* <input type="file" onChange={changeFiles} />
      <iframe src={previewImage || ''} width="100%" height="500px" /> */}
      {/* <img src={previewImage || ''} alt="" /> */}
    </div>
  )
}
InterviewEditor.propTypes = {
  defaultContent: PropTypes.string,
  setDesc: PropTypes.func,
}

export default InterviewEditor
