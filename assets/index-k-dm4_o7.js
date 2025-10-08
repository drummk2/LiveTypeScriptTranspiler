(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const u of t.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&r(u)}).observe(document,{childList:!0,subtree:!0});function c(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function r(e){if(e.ep)return;e.ep=!0;const t=c(e);fetch(e.href,t)}})();const f=`/* Welcome to the Live TypeScript Transpiler! */
/* Try editing this code to see real-time transpilation */

interface Person {
    name: string;
    age: number;
    email?: string;
}

class Developer implements Person {
    name: string;
    age: number;
    email?: string;
    skills: string[] = [];

    constructor(name: string, age: number, email?: string) {
        this.name = name;
        this.age = age;
        this.email = email;
    }

    addSkill(skill: string): void {
        this.skills.push(skill);
    }

    introduce(): string {
        const skillsList = this.skills.length > 0
            ? \`I know \${this.skills.join(', ')}\`
            : 'I am still learning';

        return \`Hi! I'm \${this.name}, a \${this.age}-year-old developer. \${skillsList}.\`;
    }
}

/* Create a new developer */
const dev = new Developer('Alex', 28, 'alex@example.com');
dev.addSkill('TypeScript');
dev.addSkill('React');
dev.addSkill('Node.js');

console.log(dev.introduce());

/* Utility function with type annotations */
function createArray(length: number, value: string): string[];
function createArray(length: number, value: number): number[];
function createArray(length: number, value: boolean): boolean[];
function createArray(length: number, value: any): any[] {
    return Array(length).fill(value);
}

/* Type-safe usage examples */
const numbers = createArray(5, 42);
const strings = createArray(3, 'Hello');
const booleans = createArray(4, true);

console.log('Numbers:', numbers);
console.log('Strings:', strings);
console.log('Booleans:', booleans);`,s=document.getElementById("ts-input"),o=document.getElementById("js-output"),g=document.getElementById("diagnostics"),a=document.getElementById("copy-js"),p=document.getElementById("insert-sample");let d=null;function l(i){g&&(g.textContent=i)}function y(){if(!s||!o)return;const i=s.value;if(!i.trim()){o.textContent="",l("");return}try{const n=ts.transpileModule(i,{compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.ESNext,strict:!0,esModuleInterop:!0,jsx:ts.JsxEmit.React},reportDiagnostics:!0});if(o.textContent=n.outputText||"",n.diagnostics&&n.diagnostics.length>0){const c=n.diagnostics.map(r=>{const e=typeof r.messageText=="string"?r.messageText:JSON.stringify(r.messageText);return`TS${r.code}: ${e}`});l(c.join(`
`))}else l("")}catch(n){o.textContent="/* Transpilation failed. See diagnostics below. */",l(String(n))}}function m(){d&&window.clearTimeout(d),d=window.setTimeout(y,220)}s&&s.addEventListener("input",m);p&&p.addEventListener("click",()=>{s&&(s.value=f,m(),s.focus())});a&&a.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(o.textContent||""),a.textContent="Copied!",setTimeout(()=>a.textContent="Copy",1200)}catch(i){l("Copy failed: "+String(i))}});s&&s.value&&m();
