import React, { useEffect, useState } from 'react'
import axios from 'axios'


const API_URL = 'http://localhost:8080/api/admin/products'
const CHECK_URL = 'http://localhost:8080/api/check-interactions'
const KNOWN_API_URL = 'http://localhost:8080/api/known-ingredients'

function App() {
  const [productName, setProductName] = useState('')
  const [ingredientsInput, setIngredientsInput] = useState('')
  const [inciInput, setInciInput] = useState('')
  const [knownIngredients, setKnownIngredients] = useState([])
  const [detectedIngredients, setDetectedIngredients] = useState([])
  const [data, setData] = useState([])
  const [conflicts, setConflicts] = useState([])
  const [filterText, setFilterText] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')

  const fetchData = () => {
    axios.get(API_URL).then(res => {
      setData(res.data)
    })
  }

  const fetchKnownIngredients = () => {
    axios.get(KNOWN_API_URL).then(res => {
      setKnownIngredients(res.data)
    })
  }

  const addMultipleIngredients = (product, ingredients) => {
    const requests = ingredients.map(ingredient => {
      return axios.post(API_URL, {
        productName: product,
        ingredient: ingredient.trim()
      })
    })
    Promise.all(requests).then(() => {
      fetchData()
      setProductName('')
      setIngredientsInput('')
      setDetectedIngredients([])
      setInciInput('')
    })
  }

  const addEntry = () => {
    if (productName && ingredientsInput) {
      const ingredients = ingredientsInput.split(',').map(i => i.trim()).filter(Boolean)
      addMultipleIngredients(productName, ingredients)
    }
  }

  const deleteEntry = (id) => {
    axios.delete(`${API_URL}/${id}`).then(() => fetchData())
  }

  const handleCSVUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const lines = e.target.result.split('\n')
      lines.forEach(line => {
        const [product, ingredientsStr] = line.split(',')
        if (product && ingredientsStr) {
          const ingredients = ingredientsStr.split(';').map(i => i.trim()).filter(Boolean)
          addMultipleIngredients(product.trim(), ingredients)
        }
      })
    }
    reader.readAsText(file)
  }

  const checkConflicts = () => {
    const ingredients = ingredientsInput.split(',').map(i => i.trim()).filter(Boolean)
    if (ingredients.length >= 2) {
      axios.post(CHECK_URL, ingredients).then(res => {
        setConflicts(res.data)
      })
    } else {
      setConflicts([])
    }
  }

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + data.map(d => `${d.productName},${d.ingredient}`).join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "product_ingredients_export.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const parseINCI = () => {
    const parsed = inciInput
      .split(',')
      .map(i => i.trim())
      .filter(i => knownIngredients.some(k => i.toLowerCase().includes(k.name.toLowerCase())))
    setDetectedIngredients(parsed)
  }

  const addDetected = () => {
    if (productName && detectedIngredients.length > 0) {
      addMultipleIngredients(productName, detectedIngredients)
    }
  }

  const filteredData = data.filter(entry =>
    entry.productName.toLowerCase().includes(filterText.toLowerCase()) ||
    entry.ingredient.toLowerCase().includes(filterText.toLowerCase())
  )

  useEffect(() => {
    if (isLoggedIn) {
      fetchData()
      fetchKnownIngredients()
    }
  }, [isLoggedIn])

  useEffect(() => {
    checkConflicts()
  }, [ingredientsInput])

  const handleLogin = () => {
    if (passwordInput === "admin123") {
      setIsLoggedIn(true)
    } else {
      alert("Feil passord")
    }
  }

  if (!isLoggedIn) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        height: '100vh', fontFamily: 'Arial'
      }}>
        <h2>🔐 Adminpålogging</h2>
        <input
          type="password"
          placeholder="Passord"
          value={passwordInput}
          onChange={e => setPasswordInput(e.target.value)}
          style={{ padding: '0.5rem', marginBottom: '1rem' }}
        />
        <button onClick={handleLogin} style={{ padding: '0.5rem 1rem' }}>Logg inn</button>
      </div>
    )
  }

  const handleJsonUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target.result);
  
        for (const product of data) {
          const payload = {
            name: product.name,
            brand: product.brand,
            ewgScore: product.ewg_score,
            concerns: product.concerns,
            ewgUrl: product.ewg_url,
            ingredients: product.ingredients.map(i => ({ ingredient: i }))
          };
  
          await axios.post("http://localhost:8080/api/products", payload);
        }
  
        alert("Import fullført!");
      } catch (err) {
        console.error("Feil ved import:", err);
        alert("Noe gikk galt ved opplasting av filen.");
      }
    };
    reader.readAsText(file);
  };
  

  return (
    <div style={{
      padding: '2rem',
      fontFamily: 'Arial',
      maxWidth: '1000px',
      margin: '0 auto',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ marginBottom: '1rem' }}>🧴 Skincare Adminpanel</h2>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <input
          placeholder="Produktnavn"
          value={productName}
          onChange={e => setProductName(e.target.value)}
          style={{ flex: 1, padding: '0.5rem' }}
        />
        <input
          placeholder="Ingredienser (komma-separert)"
          value={ingredientsInput}
          onChange={e => setIngredientsInput(e.target.value)}
          style={{ flex: 2, padding: '0.5rem' }}
        />
        <button onClick={addEntry} style={{ padding: '0.5rem 1rem' }}>Legg til</button>
      </div>

      {conflicts.length > 0 && (
        <div style={{ backgroundColor: '#fff3cd', padding: '1rem', borderRadius: '6px', marginBottom: '1rem' }}>
          <h4>⚠️ Mulige konflikter oppdaget:</h4>
          <ul>
            {conflicts.map((c, idx) => (
              <li key={idx}>
                <strong>{c.ingredient1}</strong> og <strong>{c.ingredient2}</strong>: {c.warningMessage}
              </li>
            ))}
          </ul>
        </div>

        
      )}

<div style={{ marginBottom: "1rem" }}>
  <label style={{ fontWeight: "bold" }}>Importer produkter fra EWG:</label>
  <input
    type="file"
    accept=".json"
    onChange={handleJsonUpload}
    style={{ marginLeft: "1rem" }}
  />
</div>

      <div style={{ marginBottom: '1rem' }}>
        <textarea
          placeholder="Lim inn full INCI-tekst her (kommaseparert)"
          value={inciInput}
          onChange={e => setInciInput(e.target.value)}
          rows="3"
          style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
        />
        <button onClick={parseINCI} style={{ marginRight: '1rem' }}>🔍 Finn kjente ingredienser</button>
        <button onClick={addDetected}>➕ Legg til funn</button>
        {detectedIngredients.length > 0 && (
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
            Funnet: {detectedIngredients.map(i => {
              const match = knownIngredients.find(k => i.toLowerCase().includes(k.name.toLowerCase()))
              return match ? `${match.name} (${match.groupName})` : i
            }).join(', ')}
          </p>
        )}
      </div>

      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <input type="file" accept=".csv" onChange={handleCSVUpload} />
          <p style={{ fontSize: '0.9rem', color: '#555' }}>
            CSV-format: <code>Produkt,"Ingrediens1; Ingrediens2"</code>
          </p>
        </div>
        <div>
          <button onClick={handleExport}>📥 Eksporter CSV</button>
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <input
          placeholder="Søk produkt eller ingrediens..."
          value={filterText}
          onChange={e => setFilterText(e.target.value)}
          style={{ width: '100%', padding: '0.5rem' }}
        />
      </div>

      <table border="1" cellPadding="8" style={{ width: '100%', backgroundColor: 'white' }}>
        <thead style={{ backgroundColor: '#ddd' }}>
          <tr>
            <th>Produkt</th>
            <th>Ingrediens</th>
            <th>Handling</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map(entry => (
            <tr key={entry.id}>
              <td>{entry.productName}</td>
              <td>{entry.ingredient}</td>
              <td>
                <button onClick={() => deleteEntry(entry.id)} style={{ color: 'red' }}>Slett</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App