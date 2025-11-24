import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'

function Home() {
  const navigate = useNavigate()
  
  // --- ESTADOS ---
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [authHeader, setAuthHeader] = useState(null)

  // Datos de la Base de Datos
  const [persona, setPersona] = useState(null) // Tu Perfil
  const [projects, setProjects] = useState([])
  const [certificates, setCertificates] = useState([])

  // Estados para Editar Perfil (Solo Admin)
  const [editNombre, setEditNombre] = useState("")
  const [editTitulo, setEditTitulo] = useState("")
  const [editSobreMi, setEditSobreMi] = useState("")
  const [editFoto, setEditFoto] = useState("")

  // Estados para Proyectos y Certificados (Formularios)
  const [pTitulo, setPTitulo] = useState(""); const [pDesc, setPDesc] = useState(""); const [pImg, setPImg] = useState(""); const [pRepo, setPRepo] = useState(""); const [pDemo, setPDemo] = useState("");
  const [cTitulo, setCTitulo] = useState(""); const [cInst, setCInst] = useState(""); const [cImg, setCImg] = useState(""); const [cDesc, setCDesc] = useState("");

  const [modalImage, setModalImage] = useState(null)

  // --- CARGA INICIAL ---
  useEffect(() => {
    // 1. Verificar si hay sesión guardada
    const token = sessionStorage.getItem('adminToken')
    if (token) {
      setIsLoggedIn(true)
      setAuthHeader(token)
    }

    // 2. Cargar Datos Públicos
    fetch('http://localhost:8080/api/persona').then(r => r.json()).then(data => {
        setPersona(data)
        // Precargar formulario de edición
        if(data) { setEditNombre(data.nombre); setEditTitulo(data.titulo); setEditSobreMi(data.sobreMi); setEditFoto(data.fotoUrl); }
    }).catch(console.error)

    fetch('http://localhost:8080/api/projects').then(r => r.json()).then(setProjects).catch(console.error)
    fetch('http://localhost:8080/api/certificados').then(r => r.json()).then(setCertificates).catch(console.error)
  }, [])

  // --- FUNCIONES DE LOGOUT ---
  const handleLogout = () => {
    sessionStorage.removeItem('adminToken')
    setIsLoggedIn(false)
    setAuthHeader(null)
    window.location.reload() // Recargar para limpiar
  }

  // --- GUARDAR PERFIL (PERSONA) ---
  const handleSaveProfile = (e) => {
    e.preventDefault()
    const newProfile = { nombre: editNombre, titulo: editTitulo, sobreMi: editSobreMi, fotoUrl: editFoto }
    
    fetch('http://localhost:8080/api/persona', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': authHeader },
        body: JSON.stringify(newProfile)
    }).then(r => r.json()).then(data => {
        setPersona(data)
        alert("Perfil actualizado correctamente")
    }).catch(() => alert("Error al guardar perfil"))
  }

  // --- HELPERS CRUD ---
  const createItem = (url, data, setList, list, resetFields) => {
    fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': authHeader }, body: JSON.stringify(data) })
    .then(r => r.ok ? r.json() : Promise.reject()).then(newItem => { setList([...list, newItem]); alert("Creado!"); resetFields(); })
    .catch(() => alert("Error creando item"))
  }

  const deleteItem = (url, id, setList, list) => {
    if(!window.confirm("¿Borrar?")) return;
    fetch(`${url}/${id}`, { method: 'DELETE', headers: { 'Authorization': authHeader } })
    .then(r => r.ok && setList(list.filter(i => i.id !== id)))
  }

  return (
    <div className="app-container">
      
      {/* MODAL IMAGEN */}
      {modalImage && (
        <div className="modal-overlay" onClick={() => setModalImage(null)}>
          <div className="modal-content">
            <img src={modalImage} alt="Zoom" />
            <button onClick={() => setModalImage(null)}>Cerrar</button>
          </div>
        </div>
      )}

      {/* --- HEADER --- */}
      <header className="hero">
        <div className="admin-trigger" style={{top: '10px', right: '10px'}}>
          {!isLoggedIn ? (
            <button onClick={() => navigate('/login')} className="btn-primary" style={{fontSize: '0.9rem'}}>
              Login Admin
            </button>
          ) : (
            <button onClick={handleLogout} className="btn-logout">Cerrar Sesión</button>
          )}
        </div>

        <div className="hero-content">
            {/* Si hay foto de perfil, la mostramos */}
            {persona?.fotoUrl && <img src={persona.fotoUrl} alt="Perfil" style={{width:'150px', height:'150px', borderRadius:'50%', objectFit:'cover', border:'4px solid white', marginBottom:'20px'}} />}
            
            <h1>{persona ? persona.nombre : "Cargando nombre..."}</h1>
            <h2>{persona ? persona.titulo : "Cargando título..."}</h2>
            
            <div className="social-links">
                <a href="#portfolio" className="btn-primary">Proyectos</a>
                <a href="#education" className="btn-outline">Certificados</a>
            </div>
        </div>
      </header>

      {/* --- PANEL DE EDICIÓN DE PERFIL (SOLO ADMIN) --- */}
      {isLoggedIn && (
        <section className="section admin-panel">
            <h3>✏️ Editar Mi Perfil</h3>
            <form onSubmit={handleSaveProfile} className="admin-form">
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
                    <input type="text" placeholder="Nombre Completo" value={editNombre} onChange={e => setEditNombre(e.target.value)} />
                    <input type="text" placeholder="Título Profesional" value={editTitulo} onChange={e => setEditTitulo(e.target.value)} />
                </div>
                <input type="text" placeholder="URL Foto de Perfil" value={editFoto} onChange={e => setEditFoto(e.target.value)} />
                <textarea placeholder="Sobre Mí (Descripción)" value={editSobreMi} onChange={e => setEditSobreMi(e.target.value)} rows="4" />
                <button type="submit" className="btn-success">Actualizar Información Personal</button>
            </form>
        </section>
      )}

      {/* --- SOBRE MÍ --- */}
      <section className="section about">
        <h3>Sobre Mí</h3>
        <p>{persona ? persona.sobreMi : "Cargando descripción..."}</p>
      </section>

      {/* --- CERTIFICADOS --- */}
      <section id="education" className="section education">
        <h3>Formación Profesional</h3>
        {isLoggedIn && (
            <div className="admin-panel">
                <h4>+ Agregar Certificado</h4>
                <form onSubmit={(e) => { e.preventDefault(); createItem('http://localhost:8080/api/certificados', {titulo: cTitulo, institucion: cInst, imagenUrl: cImg, descripcion: cDesc}, setCertificates, certificates, () => { setCTitulo(""); setCInst(""); setCImg(""); setCDesc(""); }) }} className="admin-form">
                    <input type="text" placeholder="Título" value={cTitulo} onChange={e => setCTitulo(e.target.value)} />
                    <input type="text" placeholder="Institución" value={cInst} onChange={e => setCInst(e.target.value)} />
                    <input type="text" placeholder="URL Imagen" value={cImg} onChange={e => setCImg(e.target.value)} />
                    <input type="text" placeholder="Descripción" value={cDesc} onChange={e => setCDesc(e.target.value)} />
                    <button type="submit" className="btn-success">Guardar</button>
                </form>
            </div>
        )}
        <div className="education-grid">
            {certificates.map(cert => (
                <div key={cert.id} className="edu-card" onClick={() => setModalImage(cert.imagenUrl)}>
                    <h4>{cert.titulo}</h4>
                    <span>{cert.institucion}</span>
                    <p>{cert.descripcion}</p>
                    {isLoggedIn && <button onClick={(e)=>{e.stopPropagation(); deleteItem('http://localhost:8080/api/certificados', cert.id, setCertificates, certificates)}} className="btn-danger">X</button>}
                </div>
            ))}
        </div>
      </section>

      {/* --- PROYECTOS --- */}
      <section id="portfolio" className="section portfolio">
        <h3>Mis Proyectos</h3>
        {isLoggedIn && (
            <div className="admin-panel">
                <h4>+ Agregar Proyecto</h4>
                <form onSubmit={(e) => { e.preventDefault(); createItem('http://localhost:8080/api/projects', {name: pTitulo, description: pDesc, imageUrl: pImg, repoUrl: pRepo, demoUrl: pDemo}, setProjects, projects, () => { setPTitulo(""); setPDesc(""); setPImg(""); setPRepo(""); setPDemo(""); }) }} className="admin-form">
                    <input type="text" placeholder="Título" value={pTitulo} onChange={e => setPTitulo(e.target.value)} />
                    <input type="text" placeholder="URL Imagen" value={pImg} onChange={e => setPImg(e.target.value)} />
                    <input type="text" placeholder="URL Repo" value={pRepo} onChange={e => setPRepo(e.target.value)} />
                    <input type="text" placeholder="URL Demo" value={pDemo} onChange={e => setPDemo(e.target.value)} />
                    <textarea placeholder="Descripción" value={pDesc} onChange={e => setPDesc(e.target.value)} />
                    <button type="submit" className="btn-success">Guardar</button>
                </form>
            </div>
        )}
        <div className="grid-container">
            {projects.map(proj => (
                <div key={proj.id} className="card">
                    <img src={proj.imageUrl || "https://via.placeholder.com/300"} className="card-img"/>
                    <div className="card-body">
                        <h4>{proj.name}</h4>
                        <p>{proj.description}</p>
                        <div className="card-actions">
                            {!isLoggedIn && proj.demoUrl && <a href={proj.demoUrl} target="_blank" className="btn-demo">Demo</a>}
                            {isLoggedIn && <><a href={proj.repoUrl} className="btn-outline">Repo</a> <button onClick={() => deleteItem('http://localhost:8080/api/projects', proj.id, setProjects, projects)} className="btn-danger">X</button></>}
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </section>

      <footer className="footer"><p>© 2025 Federico González</p></footer>
    </div>
  )
}

export default Home