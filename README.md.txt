#  Portafolio Profesional Full Stack

Este proyecto es una plataforma web integral desarrollada para gestionar y exhibir mi perfil profesional, proyectos y certificaciones. Fue diseñada con una arquitectura distribuida y moderna, separando completamente el Frontend del Backend, e integrando servicios en la nube para un despliegue profesional.

 **Demo en vivo:** [https://portfolio-fullstack-wine.vercel.app](https://portfolio-fullstack-wine.vercel.app)

---

##  Tecnologías Utilizadas

El proyecto integra un stack tecnológico robusto para asegurar escalabilidad, seguridad y rendimiento:

### **Backend (API REST)**
* **Lenguaje:** Java 17
* **Framework:** Spring Boot 3
* **Seguridad:** Spring Security (Autenticación basada en roles y protección de endpoints).
* **Persistencia:** JPA / Hibernate.
* **Base de Datos:** MySQL (Alojada en la nube).
* **Herramientas:** Maven, Postman.

### **Frontend (SPA)**
* **Framework:** React.js (Vite).
* **Estilos:** CSS3 Moderno (Diseño responsivo, Neumorfismo, Modo Oscuro).
* **Navegación:** React Router DOM.
* **Gestión de Estado:** Hooks (useState, useEffect).
* **Integraciones:** React Icons.

### **Servicios en la Nube & Despliegue**
* **Frontend:** Vercel (CI/CD automático).
* **Backend:** Render (Container Docker).
* **Base de Datos:** Railway / Aiven (MySQL Cloud).
* **Almacenamiento de Imágenes:** Cloudinary (Gestión de medios).

---

##  Funcionalidades Principales

El sistema cuenta con dos vistas diferenciadas según el rol del usuario:

###  Modo Público (Cliente/Reclutador)
* **Visualización de Perfil:** Información personal dinámica cargada desde la BD.
* **Galería de Proyectos:** Listado de trabajos con imagen, descripción y enlaces a Demo/Repo.
* **Certificaciones:** Visualización de logros académicos con modal para ver credenciales en detalle.
* **Contacto:** Integración directa con WhatsApp, Email y LinkedIn.
* **Descarga de CV:** Acceso directo al Currículum en PDF.

###  Modo Administrador (CMS Privado)
* **Login Seguro:** Sistema de autenticación protegido contra accesos no autorizados.
* **Gestión de Contenido (CRUD):**
    * **Crear:** Nuevos proyectos o certificaciones subiendo imágenes directamente a Cloudinary.
    * **Editar:** Modificar textos, títulos o imágenes en tiempo real.
    * **Eliminar:** Borrar registros obsoletos de la base de datos.
    * **Perfil:** Actualizar foto de perfil y descripción "Sobre Mí" al instante.
* **Interfaz Adaptativa:** El panel de administración solo es visible tras un login exitoso.

---

##  Instalación y Ejecución Local

Si deseas correr este proyecto en tu máquina local:

### Prerrequisitos
* Java JDK 17
* Node.js & NPM
* MySQL Workbench

### 1. Configuración del Backend
```bash
cd backend
# Configurar las variables de entorno en application.properties o en tu IDE:
# DB_URL, DB_USER, DB_PASSWORD, ADMIN_EMAIL, ADMIN_PASSWORD
mvn spring-boot:run