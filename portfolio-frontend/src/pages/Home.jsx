import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
// Importamos los iconos (LinkedIn, GitHub, WhatsApp, Email, Descarga)
import { FaLinkedinIn, FaGithub, FaWhatsapp, FaEnvelope, FaFileDownload } from 'react-icons/fa'
import '../App.css'

function Home() {
  const navigate = useNavigate()
  
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [authHeader, setAuthHeader] = useState(null)

  // Datos de la Base de Datos
  const [persona, setPersona] = useState(null)
  const [projects, setProjects] = useState([])
  const [certificates, setCertificates] = useState([])

  // Estados para Editar
  const [editNombre, setEditNombre] = useState(""); const [editTitulo, setEditTitulo] = useState(""); 
  const [editSobreMi, setEditSobreMi] = useState(""); const [editFoto, setEditFoto] = useState("");

  // Estados Formularios
  const [pTitulo, setPTitulo] = useState(""); const [pDesc, setPDesc] = useState(""); const [pImg, setPImg] = useState(""); const [pRepo, setPRepo] = useState(""); const [pDemo, setPDemo] = useState("");
  const [cTitulo, setCTitulo] = useState(""); const [cInst, setCInst] = useState(""); const [cImg, setCImg] = useState(""); const [cDesc, setCDesc] = useState("");

  const [modalImage, setModalImage] = useState(null)

  useEffect(() => {
    const token = sessionStorage.getItem('adminToken')
    if (token) { setIsLoggedIn(true); setAuthHeader(token); }

    fetch('http://localhost:8080/api/persona').then(r => r.json()).then(data => {
        setPersona(data)
        if(data) { setEditNombre(data.nombre); setEditTitulo(data.titulo); setEditSobreMi(data.sobreMi); setEditFoto(data.fotoUrl); }
    }).catch(console.error)

    fetch('http://localhost:8080/api/projects').then(r => r.json()).then(setProjects).catch(console.error)
    fetch('http://localhost:8080/api/certificados').then(r => r.json()).then(setCertificates).catch(console.error)
  }, [])

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken'); setIsLoggedIn(false); setAuthHeader(null); window.location.reload();
  }

  // Función auxiliar para subir imagen a Cloudinary
  const uploadImage = async (e, setUrlState) => {
    const file = e.target.files[0]; if (!file) return;
    const data = new FormData(); data.append("file", file); data.append("upload_preset", "portfolio_preset");
    try {
      alert("Subiendo imagen...");
      const res = await fetch("https://api.cloudinary.com/v1_1/dvyvijqmy/image/upload", { method: "POST", body: data });
      const fileData = await res.json(); setUrlState(fileData.secure_url); alert("Imagen cargada ✅");
    } catch (error) { console.error(error); alert("Error al subir imagen ❌"); }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault()
    fetch('http://localhost:8080/api/persona', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': authHeader },
        body: JSON.stringify({ nombre: editNombre, titulo: editTitulo, sobreMi: editSobreMi, fotoUrl: editFoto })
    }).then(r => r.json()).then(data => { setPersona(data); alert("Perfil actualizado"); })
  }

  const createItem = (url, data, setList, list, resetFields) => {
    fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': authHeader }, body: JSON.stringify(data) })
    .then(r => r.ok ? r.json() : Promise.reject()).then(newItem => { setList([...list, newItem]); alert("Creado!"); resetFields(); })
  }

  const deleteItem = (url, id, setList, list) => {
    if(!window.confirm("¿Borrar?")) return;
    fetch(`${url}/${id}`, { method: 'DELETE', headers: { 'Authorization': authHeader } })
    .then(r => r.ok && setList(list.filter(i => i.id !== id)))
  }

  return (
    <div className="app-container">
      {modalImage && <div className="modal-overlay" onClick={() => setModalImage(null)}><div className="modal-content"><img src={modalImage} alt="Zoom" /><button onClick={() => setModalImage(null)}>Cerrar</button></div></div>}

      <header className="hero">
        {/* BARRA DE NAVEGACIÓN SUPERIOR (SUTIL) */}
        <nav className="navbar">
            <div className="nav-links">
                <a href="#portfolio">Proyectos</a>
                <a href="#education">Formación</a>
            </div>
            <div className="admin-trigger-nav">
                {!isLoggedIn ? (
                    <button onClick={() => navigate('/login')} className="btn-login-nav">Login</button>
                ) : (
                    <button onClick={handleLogout} className="btn-login-nav">Salir</button>
                )}
            </div>
        </nav>

        <div className="hero-content">
            {persona?.fotoUrl && <img src={persona.fotoUrl} alt="Perfil" className="profile-pic" />}
            
            <h1>{persona ? persona.nombre : "Cargando nombre..."}</h1>
            <h2>{persona ? persona.titulo : "Cargando título..."}</h2>
            
            {/* NUEVA SECCIÓN DE CONTACTO Y CV */}
            <div className="social-actions">
                <div className="social-icons">
                    {/* Reemplaza los href con tus links reales */}
                    <a href="https://www.linkedin.com/in/fede-gonzalez" target="_blank" rel="noreferrer" className="icon-link"><FaLinkedinIn /></a>
                    <a href="https://github.com/fedeglz" target="_blank" rel="noreferrer" className="icon-link"><FaGithub /></a>
                    <a href="https://wa.me/+5493886410137" target="_blank" rel="noreferrer" className="icon-link"><FaWhatsapp /></a>
                    <a href="https://fedegonzalez.dev@gmail.com" className="icon-link"><FaEnvelope /></a>
                </div>
                
                {/* Botón de descarga de CV */}
                <a href="/CV_FG.pdf" download="CV_Federico_Gonzalez.pdf" className="btn-cv">
                    Descargar CV <FaFileDownload style={{marginLeft: '8px'}}/>
                </a>
            </div>
        </div>
      </header>

      {/* PANEL ADMIN */}
      {isLoggedIn && (
        <section className="section admin-panel">
            <h3>✏️ Editar Mi Perfil</h3>
            <form onSubmit={handleSaveProfile} className="admin-form">
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
                    <input type="text" placeholder="Nombre" value={editNombre} onChange={e => setEditNombre(e.target.value)} />
                    <input type="text" placeholder="Título" value={editTitulo} onChange={e => setEditTitulo(e.target.value)} />
                </div>
                {/* Input Foto Perfil Cloudinary */}
                <input type="file" accept="image/*" onChange={(e) => uploadImage(e, setEditFoto)} style={{marginBottom:'5px'}} />
                <input type="text" placeholder="URL Foto" value={editFoto} readOnly style={{backgroundColor:'#e9ecef'}} />
                
                <textarea placeholder="Sobre Mí" value={editSobreMi} onChange={e => setEditSobreMi(e.target.value)} rows="4" />
                <button type="submit" className="btn-success">Actualizar Perfil</button>
            </form>
        </section>
      )}

      <section className="section about">
        <h3>Sobre Mí</h3>
        <p>{persona ? persona.sobreMi : "Cargando..."}</p>
      </section>

      <section id="education" className="section education">
        <h3>Formación Profesional</h3>
        {isLoggedIn && (
            <div className="admin-panel">
                <h4>+ Agregar Certificado</h4>
                <form onSubmit={(e) => { e.preventDefault(); createItem('http://localhost:8080/api/certificados', {titulo: cTitulo, institucion: cInst, imagenUrl: cImg, descripcion: cDesc}, setCertificates, certificates, () => { setCTitulo(""); setCInst(""); setCImg(""); setCDesc(""); }) }} className="admin-form">
                    <input type="text" placeholder="Título" value={cTitulo} onChange={e => setCTitulo(e.target.value)} />
                    <input type="text" placeholder="Institución" value={cInst} onChange={e => setCInst(e.target.value)} />
                    <input type="file" accept="image/*" onChange={(e) => uploadImage(e, setCImg)} style={{marginBottom:'5px'}} />
                    <input type="text" placeholder="URL Img" value={cImg} readOnly style={{backgroundColor:'#e9ecef'}} />
                    <input type="text" placeholder="Descripción" value={cDesc} onChange={e => setCDesc(e.target.value)} />
                    <button type="submit" className="btn-success">Guardar</button>
                </form>
            </div>
        )}
        <div className="education-grid">
            {certificates.map(cert => (
                <div key={cert.id} className="edu-card" onClick={() => setModalImage(cert.imagenUrl)}>
                    {cert.imagenUrl && <img src={cert.imagenUrl} alt={cert.titulo} />}
                    <h4>{cert.titulo}</h4>
                    <span>{cert.institucion}</span>
                    <p>{cert.descripcion}</p>
                    {isLoggedIn && <button onClick={(e)=>{e.stopPropagation(); deleteItem('http://localhost:8080/api/certificados', cert.id, setCertificates, certificates)}} className="btn-danger">Eliminar</button>}
                </div>
            ))}
        </div>
      </section>

      <section id="portfolio" className="section portfolio">
        <h3>Mis Proyectos</h3>
        {isLoggedIn && (
            <div className="admin-panel">
                <h4>+ Agregar Proyecto</h4>
                <form onSubmit={(e) => { e.preventDefault(); createItem('http://localhost:8080/api/projects', {name: pTitulo, description: pDesc, imageUrl: pImg, repoUrl: pRepo, demoUrl: pDemo}, setProjects, projects, () => { setPTitulo(""); setPDesc(""); setPImg(""); setPRepo(""); setPDemo(""); }) }} className="admin-form">
                    <input type="text" placeholder="Título" value={pTitulo} onChange={e => setPTitulo(e.target.value)} />
                    <input type="file" accept="image/*" onChange={(e) => uploadImage(e, setPImg)} style={{marginBottom:'5px'}} />
                    <input type="text" placeholder="URL Img" value={pImg} readOnly style={{backgroundColor:'#e9ecef'}} />
                    <input type="text" placeholder="Repo URL" value={pRepo} onChange={e => setPRepo(e.target.value)} />
                    <input type="text" placeholder="Demo URL" value={pDemo} onChange={e => setPDemo(e.target.value)} />
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
                            {isLoggedIn && <><a href={proj.repoUrl} className="btn-outline">Repo</a> <button onClick={() => deleteItem('http://localhost:8080/api/projects', proj.id, setProjects, projects)} className="btn-danger">Eliminar</button></>}
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