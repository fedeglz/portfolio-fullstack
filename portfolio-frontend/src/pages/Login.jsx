import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("") // Para mostrar si falló la clave
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("") // Limpiamos errores previos

    // 1. Preparamos la "carta" con las credenciales para Java
    const credentials = btoa(`${email}:${password}`)
    const authHeader = `Basic ${credentials}`

    try {
      // 2. Enviamos la carta al Backend (endpoint de prueba)
      // Si Java responde OK, es que la contraseña es real.
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Authorization': authHeader
        }
      })

      if (response.ok) {
        // 3. ¡ÉXITO! Java nos dejó pasar.
        // Guardamos el permiso en el navegador y entramos.
        sessionStorage.setItem('adminToken', authHeader)
        alert("¡Acceso concedido! Bienvenido.")
        navigate('/') 
      } else {
        // 4. FALLO: Java dijo "Unauthorized" (401)
        setError("Usuario o contraseña incorrectos.")
      }
    } catch (err) {
      setError("Error de conexión. ¿El servidor está prendido?")
    }
  }

  return (
    <div className="app-container" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f1f5f9'}}>
      <div className="admin-panel" style={{width: '400px', textAlign: 'center'}}>
        <h3 style={{color: '#0f172a'}}>Acceso Administrador</h3>
        <p style={{marginBottom: '20px', color: '#64748b'}}>Seguridad gestionada por Spring Security</p>
        
        <form onSubmit={handleLogin} className="admin-form">
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Contraseña" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
          
          {/* Mensaje de error en rojo */}
          {error && <p style={{color: '#ef4444', fontSize: '0.9rem', fontWeight: 'bold'}}>{error}</p>}
          
          <button type="submit" className="btn-success">Ingresar</button>
        </form>
        
        <button 
            onClick={() => navigate('/')} 
            className="btn-outline" 
            style={{marginTop: '20px', width: '100%', color: '#3b82f6', borderColor: '#3b82f6'}}
        >
            Volver al Portafolio
        </button>
      </div>
    </div>
  )
}

export default Login