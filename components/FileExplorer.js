import React, { useState } from 'react'

export default function FileExplorer({ files = {}, activeFile, onCreate, onDelete, onSelect }) {
  const [newName, setNewName] = useState('App')

  function handleCreate() {
    if (!newName.trim()) return
    let name = newName.trim()
    if (!name.endsWith('.js')) name = `${name}.js`
    onCreate(name)
    setNewName('')
  }

  return (
    <div style={{ padding: 12 }}>
      <h3>Files</h3>
      <div className="file-list">
        {Object.keys(files).map((path) => (
          <div
            key={path}
            className={`file-item ${path === activeFile ? 'active' : ''}`}
            onClick={() => onSelect(path)}
            style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', cursor: 'pointer' }}
          >
            <span>{path.replace(/\//, '')}</span>
            <button onClick={(e) => { e.stopPropagation(); onDelete(path) }}>Delete</button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12 }}>
        <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="New file name (no extension)" />
        <button onClick={handleCreate} style={{ marginLeft: 8 }}>Create</button>
      </div>
    </div>
  )
}
