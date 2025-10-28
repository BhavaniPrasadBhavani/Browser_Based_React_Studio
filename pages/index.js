import React, { useState, useEffect } from 'react'
import { SandpackProvider, SandpackLayout, SandpackCodeEditor, SandpackPreview } from '@codesandbox/sandpack-react'
import FileExplorer from '../components/FileExplorer'

const DEFAULT_CODE = `import React from 'react'
import ReactDOM from 'react-dom'

export default function App() {
  return (
    <div style={{fontFamily: 'Inter, Arial', padding: 20}}>
      <h1>Welcome to CipherStudio</h1>
      <p>Edit this file and see the live preview.</p>
    </div>
  )
}
`

const INDEX_CODE = `import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

const root = createRoot(document.getElementById('root'))
root.render(<App />)
`

export default function Home() {
  // files is an object where keys are file paths for Sandpack (e.g. '/App.js')
  const [files, setFiles] = useState({ '/App.js': { code: DEFAULT_CODE }, '/index.js': { code: INDEX_CODE } })
  const [activeFile, setActiveFile] = useState('/App.js')
  const [projectId, setProjectId] = useState('')
  // theme (dark / light) — start as null to avoid SSR hydration mismatch
  const [theme, setTheme] = useState(null)

  // Initialize theme on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cipherstudio:theme')
      const initial = saved || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      setTheme(initial)
    } catch (e) {
      setTheme('light')
    }
  }, [])

  // Apply theme attribute when theme is known
  useEffect(() => {
    if (!theme) return
    try {
      document.documentElement.setAttribute('data-theme', theme)
      localStorage.setItem('cipherstudio:theme', theme)
    } catch (e) {}
  }, [theme])

  function toggleTheme() {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'))
  }

  useEffect(() => {
    // try to load last autosaved project id
    const last = localStorage.getItem('cipherstudio:lastProject')
    if (last) {
      const p = JSON.parse(last)
      if (p && p.id) {
        setProjectId(p.id)
      }
    }
  }, [])

  function createFile(name) {
    // name may come as 'App' or 'App.js' or '/App.js'
    let path = name.startsWith('/') ? name : `/${name}`
    if (!path.endsWith('.js')) {
      // ensure .js extension
      path = `${path}.js`
    }
    if (files[path]) return
    setFiles(prev => ({ ...prev, [path]: { code: DEFAULT_CODE } }))
    setActiveFile(path)
  }

  function deleteFile(path) {
    const clone = { ...files }
    delete clone[path]
    setFiles(clone)
    // choose another file as active
    const keys = Object.keys(clone)
    setActiveFile(keys.length ? keys[0] : '')
  }

  function updateFile(path, code) {
    setFiles(prev => ({ ...prev, [path]: { code } }))
  }

  function saveProject() {
    const id = `proj_${Date.now()}`
    localStorage.setItem(`cipherstudio:project:${id}`, JSON.stringify(files))
    setProjectId(id)
    localStorage.setItem('cipherstudio:lastProject', JSON.stringify({ id }))
    alert(`Saved project id: ${id}`)
  }

  function loadProject(id) {
    const raw = localStorage.getItem(`cipherstudio:project:${id}`)
    if (!raw) {
      alert('Project not found')
      return
    }
    const parsed = JSON.parse(raw)
    setFiles(parsed)
    const keys = Object.keys(parsed)
    setActiveFile(keys[0])
    setProjectId(id)
  }

  return (
    <div className="app-shell">
      <div className="topbar">
        <h2>CipherStudio (MVP)</h2>
        <div className="top-actions">
          <button onClick={saveProject}>Save Project</button>
          <input
            placeholder="project id to load"
            value={projectId}
            onChange={e => setProjectId(e.target.value)}
          />
          <button onClick={() => loadProject(projectId)}>Load</button>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme" disabled={!theme}>
            {theme ? (theme === 'dark' ? '☀️ Light' : '🌙 Dark') : 'Theme'}
          </button>
        </div>
      </div>

      <div className="three-col">
        <div className="col explorer">
          <div className="pane-header">Files</div>
          <div className="pane-body">
            <FileExplorer
              files={files}
              activeFile={activeFile}
              onCreate={createFile}
              onDelete={deleteFile}
              onSelect={setActiveFile}
            />
          </div>
        </div>

        {/* Single SandpackProvider for both editor and preview so they share the same runtime */}
        <SandpackProvider template="react" files={files} options={{ activePath: activeFile }}>
          <div className="col editor">
            <div className="pane-header">Editor</div>
            <div className="pane-body">
              <SandpackCodeEditor
                showLineNumbers
                wrapContent
                style={{ height: '100%' }}
                onChange={(code) => updateFile(activeFile, code)}
              />
            </div>
          </div>

          <div className="col preview">
            <div className="pane-header">Live Preview</div>
            <div className="pane-body preview-box">
              <SandpackPreview />
            </div>
          </div>
        </SandpackProvider>
      </div>
    </div>
  )
}
