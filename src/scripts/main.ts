/* main.ts — wiring for UI and in-browser TypeScript transpilation */

/* Import TypeScript compiler (assuming it's available globally) */
declare const ts: typeof import('typescript');

/* Import sample TypeScript code */
import { sampleTypeScript } from './sample.js';

/* Import CodeMirror editors */
import { createTypeScriptEditor, createJavaScriptEditor } from './editor.js';

/* DOM element references */
const tsInputContainer = document.getElementById('ts-input') as HTMLElement;
const jsOutputContainer = document.getElementById('js-output') as HTMLElement;
const diagnosticsOutput = document.getElementById('diagnostics') as HTMLPreElement;
const copyBtn = document.getElementById('copy-js') as HTMLButtonElement;
const insertSampleBtn = document.getElementById('insert-sample') as HTMLButtonElement;

/* CodeMirror editor instances */
let tsEditor: any;
let jsEditor: any;

/* Debounce timer for transpilation */
let debounceTimer: number | null = null;

/* Set diagnostics text in the output area */
function setDiagnostics(text: string): void {
    if (diagnosticsOutput) {
        diagnosticsOutput.textContent = text;
    }
}

/* Transpile TypeScript to JavaScript and display results */
function transpileAndShow(): void {
    if (!tsEditor || !jsEditor) return;

    const source = tsEditor.state.doc.toString();
    if (!source.trim()) {
        jsEditor.dispatch({
            changes: { from: 0, to: jsEditor.state.doc.length, insert: '' },
        });
        setDiagnostics('');
        return;
    }

    try {
        const result = ts.transpileModule(source, {
            compilerOptions: {
                target: ts.ScriptTarget.ES2020,
                module: ts.ModuleKind.ESNext,
                strict: true,
                esModuleInterop: true,
                jsx: ts.JsxEmit.React,
            },
            reportDiagnostics: true,
        });

        /* Display transpiled JavaScript */
        jsEditor.dispatch({
            changes: { from: 0, to: jsEditor.state.doc.length, insert: result.outputText || '' },
        });

        /* Display diagnostics if any */
        if (result.diagnostics && result.diagnostics.length > 0) {
            const msgs = result.diagnostics.map((d: any) => {
                const text =
                    typeof d.messageText === 'string'
                        ? d.messageText
                        : JSON.stringify(d.messageText);
                return `TS${d.code}: ${text}`;
            });
            setDiagnostics(msgs.join('\n'));
        } else {
            setDiagnostics('');
        }
    } catch (err) {
        jsEditor.dispatch({
            changes: {
                from: 0,
                to: jsEditor.state.doc.length,
                insert: '/* Transpilation failed. See diagnostics below. */',
            },
        });
        setDiagnostics(String(err));
    }
}

/* Debouncing means delaying the execution of a function until after a specified period has passed since the last time it was invoked.
   This prevents rapid, repeated execution (for example, on every keystroke) and improves performance. */
function scheduleTranspile(): void {
    if (debounceTimer) window.clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(transpileAndShow, 220);
}

/* Initialize editors and set up event listeners */
function initializeApp(): void {
    /* Create CodeMirror editors */
    if (tsInputContainer) {
        tsEditor = createTypeScriptEditor(tsInputContainer, '', scheduleTranspile);
    }

    if (jsOutputContainer) {
        jsEditor = createJavaScriptEditor(jsOutputContainer, '');
    }

    /* Set up Insert Sample button */
    if (insertSampleBtn) {
        insertSampleBtn.addEventListener('click', () => {
            if (tsEditor) {
                tsEditor.dispatch({
                    changes: { from: 0, to: tsEditor.state.doc.length, insert: sampleTypeScript },
                });
                scheduleTranspile(); /* Immediately transpile the sample code */
                tsEditor.focus(); /* Focus the editor for immediate editing */
            }
        });
    }

    /* Set up Copy button */
    if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
            try {
                const jsCode = jsEditor?.state.doc.toString() || '';
                await navigator.clipboard.writeText(jsCode);
                copyBtn.textContent = 'Copied!';
                setTimeout(() => (copyBtn.textContent = 'Copy'), 1200);
            } catch (e) {
                setDiagnostics('Copy failed: ' + String(e));
            }
        });
    }
}

/* Initialize the application */
initializeApp();
