import { useState } from 'react'

function Compiler() {
  const [code, setCode] = useState(`// Welcome to the JavaScript Compiler!
// Try writing some code and click "Run" to see the output.

function greet(name) {
  return \`Hello, \${name}! Welcome to JS Academy.\`;
}

console.log(greet("Developer"));
console.log("2 + 2 =", 2 + 2);

// You can write any JavaScript code here
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log("Original:", numbers);
console.log("Doubled:", doubled);`)
  
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const runCode = () => {
    setOutput('')
    setError('')
    
    try {
      const originalLog = console.log
      const logs = []
      
      console.log = (...args) => {
        logs.push(args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '))
      }
      
      // Create a safe execution context
      const func = new Function(code)
      func()
      
      console.log = originalLog
      setOutput(logs.join('\n'))
    } catch (err) {
      setError(err.toString())
    }
  }

  const clearCode = () => {
    setCode('')
    setOutput('')
    setError('')
  }

  const loadExample = (example) => {
    const examples = {
      basic: `// Basic JavaScript
let name = "World";
console.log("Hello, " + name + "!");`,
      functions: `// Functions
function calculateArea(radius) {
  return Math.PI * radius * radius;
}

const area = calculateArea(5);
console.log("Area of circle with radius 5:", area.toFixed(2));`,
      arrays: `// Array Methods
const fruits = ["apple", "banana", "orange"];
console.log("Original:", fruits);
console.log("Reversed:", fruits.reverse());
console.log("Joined:", fruits.join(" - "));`,
      objects: `// Objects
const person = {
  name: "Alice",
  age: 30,
  greet: function() {
    return \`Hi, I'm \${this.name} and I'm \${this.age} years old.\`;
  }
};

console.log(person.greet());`
    }
    setCode(examples[example])
    setOutput('')
    setError('')
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-10">
      <header className="space-y-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-js-text-soft">JS Academy Lab</p>
        <h1 className="text-4xl font-semibold text-js-text">JavaScript Compiler</h1>
        <p className="text-base text-js-text-muted">
          Run any snippet instantly inside your browser. Clear typography, minimal UI, no distractions.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[240px,1fr]">
        <aside className="surface-card h-min p-6">
          <h3 className="text-sm font-semibold text-js-text">Quick Examples</h3>
          <p className="mt-1 text-xs text-js-text-muted">Load a template to get started faster.</p>
          <div className="mt-4 flex flex-col gap-2">
            {[
              { key: 'basic', label: 'Basics' },
              { key: 'functions', label: 'Functions' },
              { key: 'arrays', label: 'Arrays' },
              { key: 'objects', label: 'Objects' }
            ].map(item => (
              <button
                key={item.key}
                type="button"
                onClick={() => loadExample(item.key)}
                className="rounded-full border border-gray-200 px-4 py-2 text-left text-sm text-js-text transition hover:border-js-blue hover:text-js-blue"
              >
                {item.label}
              </button>
            ))}
          </div>
        </aside>

        <section className="flex flex-col gap-6">
          <div className="surface-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-js-text-soft">
              <span>Editor</span>
              <div className="flex items-center gap-2 text-[11px] font-medium tracking-[0.2em]">
                <button type="button" className="rounded-full border border-gray-200 px-4 py-1 text-js-text-muted transition hover:text-js-text" onClick={clearCode}>
                  Clear
                </button>
                <button type="button" className="rounded-full border border-js-blue/50 bg-white px-4 py-1 text-js-blue transition hover:border-js-blue" onClick={runCode}>
                  Run
                </button>
              </div>
            </div>
            <textarea
              className="h-80 w-full resize-none bg-transparent px-6 py-6 text-sm text-js-text outline-none"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Write your JavaScript code here..."
              spellCheck={false}
            />
          </div>

          <div className="surface-card">
            <div className="border-b border-gray-100 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-js-text-soft">
              Console Output
            </div>
            <div className="px-6 py-6">
              {error ? (
                <div className="rounded-lg border border-red-200 bg-red-50/70 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              ) : output ? (
                <pre className="text-sm text-js-blue/90">{output}</pre>
              ) : (
                <p className="text-sm text-js-text-muted">Output will appear after you run your code.</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Compiler

