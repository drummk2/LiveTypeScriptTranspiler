/* Import TypeScript compiler (assuming it's available globally) */
declare const ts: typeof import('typescript');

/* Import sample TypeScript code */
import { sampleTypeScript } from './sample.js';

/* DOM element references */
const tsInput = document.getElementById('ts-input') as HTMLTextAreaElement;
const jsOutput = document.getElementById('js-output') as HTMLPreElement;
const diagnosticsOutput = document.getElementById('diagnostics') as HTMLPreElement;
const copyBtn = document.getElementById('copy-js') as HTMLButtonElement;
const insertSampleBtn = document.getElementById('insert-sample') as HTMLButtonElement;

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
    if (!tsInput || !jsOutput) return;

    const source = tsInput.value;
    if (!source.trim()) {
        jsOutput.textContent = '';
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
        jsOutput.textContent = result.outputText || '';

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
        jsOutput.textContent = '/* Transpilation failed. See diagnostics below. */';
        setDiagnostics(String(err));
    }
}

/* Debouncing means delaying the execution of a function until after a specified period has passed since the last time it was invoked.
   This prevents rapid, repeated execution (for example, on every keystroke) and improves performance. */
function scheduleTranspile(): void {
    if (debounceTimer) window.clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(transpileAndShow, 220);
}

/* Set up event listeners */
if (tsInput) {
    tsInput.addEventListener('input', scheduleTranspile);
}

if (insertSampleBtn) {
    insertSampleBtn.addEventListener('click', () => {
        if (tsInput) {
            tsInput.value = sampleTypeScript;
            scheduleTranspile(); /* Immediately transpile the sample code */
            tsInput.focus(); /* Focus the textarea for immediate editing */
        }
    });
}

if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(jsOutput.textContent || '');
            copyBtn.textContent = 'Copied!';
            setTimeout(() => (copyBtn.textContent = 'Copy'), 1200);
        } catch (e) {
            setDiagnostics('Copy failed: ' + String(e));
        }
    });
}

/* Run initial transpilation if input has content */
if (tsInput && tsInput.value) {
    scheduleTranspile();
}
