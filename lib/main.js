'use babel';

import { shell } from 'electron';
import InputDialog from '@aki77/atom-input-dialog';

export default {

  subscription: null,

  activate() {
    this.subscription = atom.commands.add('atom-text-editor', {
      'github-search:toggle': () => this.toggle(),
    });
  },

  deactivate() {
    this.subscription.dispose();
    this.subscription = null;
  },

  toggle() {
    if (this.dialog) {
      this.dialog.close();
    } else {
      this.open();
    }
  },

  open() {
    const options = Object.assign({
      callback: this.openBrowser,
      prompt: 'Enter a word',
      detached: () => {
        this.dialog = null;
      },
    }, this.buildOptions());
    this.dialog = new InputDialog(options);
    this.dialog.attach();
  },

  buildOptions() {
    const editor = atom.workspace.getActiveTextEditor();
    const text = editor.getSelectedText();
    const lang = this.langForGrammar(editor.getGrammar());
    const defaultText = `${lang} ${text}`;
    return {
      defaultText,
      selectedRange: [[0, lang.length + 1], [0, defaultText.length]],
    };
  },

  openBrowser(term) {
    shell.openExternal(`https://github.com/search?type=Code&q=${term}`);
  },

  langForGrammar(grammar) {
    const mappings = atom.config.get('github-search.grammarLanguageMappings');
    const mapping = mappings.find(({ name }) => name === grammar.name);
    const lang = mapping ? mapping.language : grammar.name;
    return `language:${lang}`;
  },
};
