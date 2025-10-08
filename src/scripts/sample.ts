/* Sample TypeScript code for the transpiler demo */
export const sampleTypeScript = `/* Welcome to the Live TypeScript Transpiler! */
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
console.log('Booleans:', booleans);`;
