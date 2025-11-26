import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
// Mantenemos solo los iconos sociales del header, quitamos el lápiz
import { FaLinkedinIn, FaGithub, FaWhatsapp, FaEnvelope, FaFileDownload } from 'react-icons/fa'
import '../App.css'

function Home() {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [authHeader, setAuthHeader] = useState(null)

  // URL DEL BACKEND
  const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:8080/api'
    : 'https://portfolio-backend-h9y2.onrender.com/api';

  // Datos
  const [persona, setPersona] = useState(null)
  const [projects, setProjects] = useState([])
  const [certificates, setCertificates] = useState([])

  // Estados de Edición
  const [editingCertId, setEditingCertId] = useState(null)
  const [editingProjId, setEditingProjId] = useState(null)

  // Estados Persona
  const [editNombre, setEditNombre] = useState(""); const [editTitulo, setEditTitulo] = useState(""); 
  const [editSobreMi, setEditSobreMi] = useState(""); const [editFoto, setEditFoto] = useState("");

  // Estados Proyectos
  const [pTitulo, setPTitulo] = useState(""); const [pDesc, setPDesc] = useState(""); const [pImg, setPImg] = useState(""); const [pRepo, setPRepo] = useState(""); const [pDemo, setPDemo] = useState("");
  
  // Estados Certificados
  const [cTitulo, setCTitulo] = useState(""); const [cInst, setCInst] = useState(""); const [cImg, setCImg] = useState(""); const [cDesc, setCDesc] = useState("");

  const [modalImage, setModalImage] = useState(null)

  const loadData = () => {
    fetch(`${API_URL}/persona`).then(r=>r.json()).then(d => {
        setPersona(d); if(d){setEditNombre(d.nombre); setEditTitulo(d.titulo); setEditSobreMi(d.sobreMi); setEditFoto(d.fotoUrl)}
    }).catch(console.error)
    fetch(`${API_URL}/projects`).then(r=>r.json()).then(setProjects).catch(console.error)
    fetch(`${API_URL}/certificados`).then(r=>r.json()).then(setCertificates).catch(console.error)
  }

  useEffect(() => {
    const token = sessionStorage.getItem('adminToken')
    if (token) { setIsLoggedIn(true); setAuthHeader(token); }
    loadData()
  }, [])

  const handleLogout = () => { sessionStorage.removeItem('adminToken'); setIsLoggedIn(false); setAuthHeader(null); window.location.reload(); }

  const uploadImage = async (e, setUrlState) => {
    const file = e.target.files[0]; if (!file) return;
    const data = new FormData(); data.append("file", file); data.append("upload_preset", "portfolio_preset");
    try {
      alert("Subiendo imagen...");
      const res = await fetch("https://api.cloudinary.com/v1_1/dvyvijqmy/image/upload", { method: "POST", body: data });
      const fileData = await res.json(); setUrlState(fileData.secure_url); alert("Imagen cargada ✅");
    } catch { alert("Error al subir imagen ❌"); }
  };

  // Guardar Perfil
  const handleSaveProfile = (e) => {
    e.preventDefault()
    fetch(`${API_URL}/persona`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': authHeader },
        body: JSON.stringify({ nombre: editNombre, titulo: editTitulo, sobreMi: editSobreMi, fotoUrl: editFoto })
    }).then(r=>r.json()).then(d => { setPersona(d); alert("Perfil actualizado"); })
  }

  // Guardar Certificado
  const handleSaveCert = (e) => {
    e.preventDefault()
    const method = editingCertId ? 'PUT' : 'POST'
    const url = editingCertId ? `${API_URL}/certificados/${editingCertId}` : `${API_URL}/certificados`
    
    fetch(url, {
        method: method, headers: { 'Content-Type': 'application/json', 'Authorization': authHeader },
        body: JSON.stringify({ titulo: cTitulo, institucion: cInst, imagenUrl: cImg, descripcion: cDesc })
    }).then(r => r.ok ? r.json() : Promise.reject()).then(() => {
        loadData(); alert(editingCertId ? "Certificado editado!" : "Certificado creado!");
        setCTitulo(""); setCInst(""); setCImg(""); setCDesc(""); setEditingCertId(null);
    }).catch(() => alert("Error al guardar"))
  }

  const loadCertForEdit = (cert) => {
    setEditingCertId(cert.id)
    setCTitulo(cert.titulo); setCInst(cert.institucion); setCImg(cert.imagenUrl); setCDesc(cert.descripcion);
    window.scrollTo(0, 600);
  }

  // Guardar Proyecto
  const handleSaveProject = (e) => {
    e.preventDefault()
    const method = editingProjId ? 'PUT' : 'POST'
    const url = editingProjId ? `${API_URL}/projects/${editingProjId}` : `${API_URL}/projects`

    fetch(url, {
        method: method, headers: { 'Content-Type': 'application/json', 'Authorization': authHeader },
        body: JSON.stringify({ name: pTitulo, description: pDesc, imageUrl: pImg, repoUrl: pRepo, demoUrl: pDemo })
    }).then(r => r.ok ? r.json() : Promise.reject()).then(() => {
        loadData(); alert(editingProjId ? "Proyecto editado!" : "Proyecto creado!");
        setPTitulo(""); setPDesc(""); setPImg(""); setPRepo(""); setPDemo(""); setEditingProjId(null);
    }).catch(() => alert("Error al guardar"))
  }

  const loadProjForEdit = (proj) => {
    setEditingProjId(proj.id)
    setPTitulo(proj.name); setPDesc(proj.description); setPImg(proj.imageUrl); setPRepo(proj.repoUrl); setPDemo(proj.demoUrl);
    window.scrollTo(0, 1200);
  }

  const deleteItem = (url, id) => {
    if(!window.confirm("¿Borrar?")) return;
    fetch(`${url}/${id}`, { method: 'DELETE', headers: { 'Authorization': authHeader } })
    .then(r => r.ok && loadData())
  }

  return (
    <div className="app-container">
      {modalImage && <div className="modal-overlay" onClick={() => setModalImage(null)}><div className="modal-content"><img src={modalImage} alt="Zoom" /><button onClick={() => setModalImage(null)}>Cerrar</button></div></div>}

      <header className="hero">
        <nav className="navbar">
            <div className="nav-links"><a href="#portfolio">Proyectos</a><a href="#education">Formación</a></div>
            <div className="admin-trigger-nav">{!isLoggedIn ? <button onClick={() => navigate('/login')} className="btn-login-nav">Login</button> : <button onClick={handleLogout} className="btn-login-nav">Salir</button>}</div>
        </nav>
        <div className="hero-content">
            {/* Foto de perfil */}
            {persona?.fotoUrl && <img src={persona.fotoUrl} alt="Perfil" className="profile-pic" />}
            
            {/* Nombre y Título */}
            <h1>{persona ? persona.nombre : "Cargando..."}</h1>
            <h2>{persona ? persona.titulo : "..."}</h2>
            
            {/* 3. BOTONES SOCIALES (Dentro del contenido) */}
            <div className="social-actions">
                <div className="social-icons">
                    <a href="https://www.linkedin.com/in/fede-gonzalez" target="_blank" rel="noreferrer" className="icon-link"><FaLinkedinIn /></a>
                    <a href="https://github.com/fedeglz" target="_blank" rel="noreferrer" className="icon-link"><FaGithub /></a>
                    <a href="https://wa.me/5493886410137" target="_blank" rel="noreferrer" className="icon-link"><FaWhatsapp /></a>
                    <a 
                        href="https://mail.google.com/mail/?view=cm&fs=1&to=fedegonzalez.dev@gmail.com" 
                        target="_blank" 
                        rel="noreferrer" 
                        className="icon-link"
                    >
                        <FaEnvelope />
                    </a>
                </div>
                <a href="/CV_FG.pdf" download="CV_Federico_Gonzalez.pdf" className="btn-cv">Descargar CV <FaFileDownload style={{marginLeft:'8px'}}/></a>
                </div>                         
        </div>
      </header>

      {isLoggedIn && (
        <section className="section admin-panel">
            <h3> Editar Perfil</h3>
            <form onSubmit={handleSaveProfile} className="admin-form">
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
                    <input type="text" placeholder="Nombre" value={editNombre} onChange={e => setEditNombre(e.target.value)} />
                    <input type="text" placeholder="Título" value={editTitulo} onChange={e => setEditTitulo(e.target.value)} />
                </div>
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
                <h4>{editingCertId ? "✏️ Editando Certificado" : "+ Agregar Certificado"}</h4>
                <form onSubmit={handleSaveCert} className="admin-form">
                    <input type="text" placeholder="Título" value={cTitulo} onChange={e => setCTitulo(e.target.value)} />
                    <input type="text" placeholder="Institución" value={cInst} onChange={e => setCInst(e.target.value)} />
                    <input type="file" accept="image/*" onChange={(e) => uploadImage(e, setCImg)} style={{marginBottom:'5px'}} />
                    <input type="text" placeholder="URL Img" value={cImg} readOnly style={{backgroundColor:'#e9ecef'}} />
                    <input type="text" placeholder="Descripción" value={cDesc} onChange={e => setCDesc(e.target.value)} />
                    <div style={{display:'flex', gap:'10px'}}>
                        <button type="submit" className="btn-success">{editingCertId ? "Actualizar" : "Guardar"}</button>
                        {editingCertId && <button type="button" onClick={()=>{setEditingCertId(null); setCTitulo(""); setCInst(""); setCImg(""); setCDesc("")}} className="btn-outline" style={{color:'#333'}}>Cancelar</button>}
                    </div>
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
                    {/* BOTONES DE ADMIN (CERTIFICADOS) */}
                    {isLoggedIn && (
                        <div className="card-actions" style={{padding: '0 20px 20px'}}>
                            <button 
                                onClick={(e) => { e.stopPropagation(); loadCertForEdit(cert); }} 
                                className="btn-outline" 
                                style={{color:'#3b82f6', borderColor:'#3b82f6'}}>
                                Editar
                            </button>
                            
                            <button 
                                onClick={(e) => { e.stopPropagation(); deleteItem(`${API_URL}/certificados`, cert.id); }} 
                                className="btn-danger">
                                Eliminar
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
      </section>

      <section id="portfolio" className="section portfolio">
        <h3>Mis Proyectos</h3>
        {isLoggedIn && (
            <div className="admin-panel">
                <h4>{editingProjId ? "✏️ Editando Proyecto" : "+ Agregar Proyecto"}</h4>
                <form onSubmit={handleSaveProject} className="admin-form">
                    <input type="text" placeholder="Título" value={pTitulo} onChange={e => setPTitulo(e.target.value)} />
                    <input type="file" accept="image/*" onChange={(e) => uploadImage(e, setPImg)} style={{marginBottom:'5px'}} />
                    <input type="text" placeholder="URL Img" value={pImg} readOnly style={{backgroundColor:'#e9ecef'}} />
                    <input type="text" placeholder="Repo URL" value={pRepo} onChange={e => setPRepo(e.target.value)} />
                    <input type="text" placeholder="Demo URL" value={pDemo} onChange={e => setPDemo(e.target.value)} />
                    <textarea placeholder="Descripción" value={pDesc} onChange={e => setPDesc(e.target.value)} />
                    <div style={{display:'flex', gap:'10px'}}>
                        <button type="submit" className="btn-success">{editingProjId ? "Actualizar" : "Guardar"}</button>
                        {editingProjId && <button type="button" onClick={()=>{setEditingProjId(null); setPTitulo(""); setPDesc(""); setPImg(""); setPRepo(""); setPDemo("")}} className="btn-outline" style={{color:'#333'}}>Cancelar</button>}
                    </div>
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
                            
                            {/* BOTONES DE PROYECTO CON TEXTO */}
                            {isLoggedIn && <>
                                <button onClick={() => loadProjForEdit(proj)} className="btn-outline" style={{color:'#3b82f6', borderColor:'#3b82f6', flex:1, fontSize:'0.9rem'}}>Editar</button>
                                <button onClick={() => deleteItem(`${API_URL}/projects`, proj.id)} className="btn-danger" style={{flex:1, fontSize:'0.9rem'}}>Eliminar</button>
                            </>}
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