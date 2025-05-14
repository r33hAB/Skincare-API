import React, { useEffect, useState } from 'react'
import axios from 'axios'

const KNOWN_API_URL = 'http://localhost:8080/api/known-ingredients'

function KnownIngredientAdmin() {
  const [knownIngredients, setKnownIngredients] = useState([])
  const [newName, setNewName] = useState('')
  const [newGroup, setNewGroup] = useState('')

  const fetchIngredients = () => {
    axios.get(KNOWN_API_URL).then(res => setKnownIngredients(res.data))
  }

  const addIngredient = () => {
    if (newName && newGroup) {
      axios.post(KNOWN_API_URL, {
        name: newName,
        groupName: newGroup
      }).then(() => {
        setNewName('')
        setNewGroup('')
        fetchIngredients()
      })
    }
  }

  const deleteIngredient = (id) => {
    axios.delete(\`\${KNOWN_API_URL}/\${id}\`).then(() => fetchIngredients())
  }

  useEffect(() => {
    fetchIngredients()
  }, [])

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>📚 Administrer kjente ingredienser</h3>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <input
          placeholder="Ingrediensnavn"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          style={{ flex: 1, padding: '0.5rem' }}
        />
        <input
          placeholder="Gruppe"
          value={newGroup}
          onChange={e => setNewGroup(e.target.value)}
          style={{ flex: 1, padding: '0.5rem' }}
        />
        <button onClick={addIngredient} style={{ padding: '0.5rem 1rem' }}>Legg til</button>
      </div>
      <table border="1" cellPadding="8" style={{ width: '100%', backgroundColor: '#fff' }}>
        <thead style={{ backgroundColor: '#ddd' }}>
          <tr>
            <th>ID</th>
            <th>Navn</th>
            <th>Gruppe</th>
            <th>Handling</th>
          </tr>
        </thead>
        <tbody>
          {knownIngredients.map(ki => (
            <tr key={ki.id}>
              <td>{ki.id}</td>
              <td>{ki.name}</td>
              <td>{ki.groupName}</td>
              <td>
                <button onClick={() => deleteIngredient(ki.id)} style={{ color: 'red' }}>Slett</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default KnownIngredientAdmin