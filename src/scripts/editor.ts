/* CodeMirror editor setup for syntax highlighting */

import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';

/* Create TypeScript input editor */
export function createTypeScriptEditor(
    parent: HTMLElement,
    initialValue: string = '',
    onChange?: (value: string) => void
) {
    const state = EditorState.create({
        doc: initialValue,
        extensions: [
            basicSetup,
            javascript({ typescript: true }),
            EditorView.updateListener.of((update) => {
                if (update.docChanged && onChange) {
                    onChange(update.state.doc.toString());
                }
            }),
            EditorView.theme({
                '&': { height: '100%' },
                '.cm-scroller': {
                    fontFamily:
                        'ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", "Courier New", monospace',
                },
                '.cm-editor': { height: '100%' },
                '.cm-focused': { outline: 'none' },
            }),
        ],
    });

    const view = new EditorView({
        state,
        parent,
    });

    return view;
}

/* Create JavaScript output editor (read-only) */
export function createJavaScriptEditor(parent: HTMLElement, initialValue: string = '') {
    const state = EditorState.create({
        doc: initialValue,
        extensions: [
            basicSetup,
            javascript(),
            oneDark,
            EditorState.readOnly.of(true),
            EditorView.theme({
                '&': { height: '100%' },
                '.cm-scroller': {
                    fontFamily:
                        'ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", "Courier New", monospace',
                },
                '.cm-editor': { height: '100%' },
                '.cm-focused': { outline: 'none' },
            }),
        ],
    });

    const view = new EditorView({
        state,
        parent,
    });

    return view;
}
