import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [projects, setProjects] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [password, setPassword] = useState("")
  // NUEVO: Aquí guardaremos la "llave" para entrar a Java
  const [authHeader, setAuthHeader] = useState(null)

  // Estados del formulario
  const [titulo, setTitulo] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [urlImagen, setUrlImagen] = useState("")
  const [urlRepo, setUrlRepo] = useState("")
  const [urlDemo, setUrlDemo] = useState("")

  useEffect(() => {
    fetch('http://localhost:8080/api/projects')
      .then(response => response.json())
      .then(data => setProjects(data))
      .catch(error => console.error("Error cargando proyectos:", error))
  }, [])

  // FUNCIÓN DE LOGIN CON SEGURIDAD REAL
  const handleLogin = (e) => {
    e.preventDefault()
    
    // Creamos la credencial Basic Auth (admin:tu_contraseña)
    // btoa() convierte texto a Base64, que es el formato que pide Java
    const credentials = btoa(`admin:${password}`)
    const validHeader = `Basic ${credentials}`

    // Verificamos localmente si es la contraseña correcta antes de guardarla
    if (password === "admin123") {
      setIsLoggedIn(true)
      setAuthHeader(validHeader) // Guardamos la llave
      setPassword("")
    } else {
      alert("Contraseña incorrecta")
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const nuevoProyecto = {
      name: titulo, description: descripcion, imageUrl: urlImagen, repoUrl: urlRepo, demoUrl: urlDemo
    }

    fetch('http://localhost:8080/api/projects', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': authHeader // <--- ¡AQUÍ MOSTRAMOS EL PASAPORTE!
      },
      body: JSON.stringify(nuevoProyecto)
    })
    .then(response => {
        if (response.ok) return response.json();
        else throw new Error("No autorizado");
    })
    .then(data => {
      setProjects([...projects, data])
      setTitulo(""); setDescripcion(""); setUrlImagen(""); setUrlRepo(""); setUrlDemo("");
      alert("¡Proyecto creado con éxito!")
    })
    .catch(error => alert("Error al crear: " + error.message))
  }

  const handleDelete = (id) => {
    if (!window.confirm("¿Borrar proyecto?")) return;

    fetch(`http://localhost:8080/api/projects/${id}`, { 
      method: 'DELETE',
      headers: {
        'Authorization': authHeader // <--- ¡AQUÍ TAMBIÉN!
      }
    })
    .then(response => {
      if (response.ok) {
        setProjects(projects.filter(p => p.id !== id));
      } else {
        alert("No tienes permiso para borrar esto.");
      }
    })
  }

  return (
    <div className="app-container">
      <header className="profile-section">
        <div className="profile-content">
          <h1>Federico González</h1>
          <h2>Desarrollador Full Stack Java</h2>
          <p>Transformo ideas en soluciones digitales robustas usando Java, Spring Boot y React.</p>
          <div className="social-links">
             <a href="#" className="btn-outline">LinkedIn</a>
             <a href="#" className="btn-outline">GitHub</a>
          </div>
        </div>
      </header>

      <div className="admin-bar">
        {!isLoggedIn ? (
          <form onSubmit={handleLogin} style={{display: 'inline-flex', gap: '10px'}}>
            <input 
              type="password" placeholder="Acceso Admin" value={password} 
              onChange={e => setPassword(e.target.value)} style={{padding: '5px', width: '120px'}}
            />
            <button type="submit" className="btn">Entrar</button>
          </form>
        ) : (
          <button onClick={() => { setIsLoggedIn(false); setAuthHeader(null); }} className="btn btn-danger">Salir</button>
        )}
      </div>

      {isLoggedIn && (
        <div className="form-container">
          <h3>Panel de Administración</h3>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Título" value={titulo} onChange={e => setTitulo(e.target.value)} required />
            <input type="text" placeholder="URL Imagen" value={urlImagen} onChange={e => setUrlImagen(e.target.value)} />
            <input type="text" placeholder="URL Repo" value={urlRepo} onChange={e => setUrlRepo(e.target.value)} />
            <input type="text" placeholder="URL Demo" value={urlDemo} onChange={e => setUrlDemo(e.target.value)} />
            <textarea placeholder="Descripción" value={descripcion} onChange={e => setDescripcion(e.target.value)} required />
            <button type="submit" className="btn btn-success">Guardar Proyecto</button>
          </form>
        </div>
      )}

      <div className="grid-container">
        {projects.map(project => (
          <div key={project.id} className="card">
            <img src={project.imageUrl || "https://via.placeholder.com/300"} alt={project.name} className="card-img" />
            <div className="card-body">
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              
              {/* --- AQUÍ ESTÁ LA LÓGICA NUEVA DE BOTONES --- */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                
                {/* 1. Si NO soy Admin (Público) -> Muestro "Ver Demostración" */}
                {!isLoggedIn && project.demoUrl && (
                    <a href={project.demoUrl} target="_blank" rel="noreferrer" className="btn btn-demo">
                      Ver Demostración
                    </a>
                )}

                {/* 2. Si SÍ soy Admin -> Muestro "Ver Código" y "Eliminar" */}
                {isLoggedIn && (
                  <>
                    <a href={project.repoUrl} target="_blank" rel="noreferrer" className="btn">
                      Ver Código
                    </a>
                    <button onClick={() => handleDelete(project.id)} className="btn btn-danger">
                      Eliminar
                    </button>
                  </>
                )}
              </div>
              {/* --------------------------------------------- */}
              
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
