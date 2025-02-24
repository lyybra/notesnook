const { addPluginToPluginManager } = require("../utils");

const TAGNAME = "CODE";

function register(editor) {
  editor.ui.registry.addToggleButton("inlinecode", {
    icon: "sourcecode",
    tooltip: "Inline code",
    onAction: function () {
      return toggleInlineCode(editor);
    },
    onSetup: function (api) {
      var nodeChangeHandler = function (e) {
        if (
          e.element.tagName === TAGNAME &&
          !e.element.innerHTML.trim().length
        ) {
          e.element.remove();
        }
        api.setActive(e.element.tagName === TAGNAME);
      };

      editor.on("NodeChange", nodeChangeHandler);
      return function () {
        return editor.off("NodeChange", nodeChangeHandler);
      };
    },
  });

  editor.addCommand("mceInsertInlineCode", function () {
    toggleInlineCode(editor);
  });
}

function toggleInlineCode(editor) {
  editor.undoManager.transact(() => {
    editor.focus();
    const range = editor.selection.getRng();
    const node = editor.selection.getNode();

    if (node.tagName !== TAGNAME && range.startOffset === range.endOffset) {
      editor.selection.setContent(`<code spellcheck="false">&#xFEFF;</code>`);
    } else {
      const content = editor.selection.getContent();
      editor.selection.setContent(`<code spellcheck="false">${content}</code>`);
    }
  });
}

(function init() {
  addPluginToPluginManager("inlinecode", register);
})();
