/* ==========================================================================
   CONTROLADOR DE SISTEMAS DEL JARDÍN DIGITAL (synergy.js)
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
    const menuLinks = document.querySelectorAll(".menu-link");
    const container = document.getElementById("dynamic-tab-content");

    /**
     * Función asíncrona encargada de la carga dinámica de componentes HTML
     * @param {string} tabName - Nombre de la pestaña a cargar (corresponde al nombre de archivo)
     */
    async function fetchTabComponent(tabName) {
        try {
            // Fase 1: Animación de salida (Sutil desvanecimiento)
            container.style.opacity = "0";
            container.style.transform = "translateY(8px)";
            container.style.transition = "opacity 0.15s ease, transform 0.15s ease";

            // Fase 2: Petición asíncrona al módulo correspondiente
            const response = await fetch(`tabs/${tabName}.html`);
            if (!response.ok) {
                throw new Error(`Código de estado HTTP: ${response.status}`);
            }
            const htmlContent = await response.text();

            // Fase 3: Inyección del contenido y animación de entrada
            setTimeout(() => {
                container.innerHTML = htmlContent;

                // Capturamos el elemento inyectado para forzar la activación de la animación CSS (.active-tab)
                const targetSection = container.querySelector(".tab-section");
                if (targetSection) {
                    // Un pequeño truco de renderizado: forzamos lectura de offsetHeight para que el DOM registre la mutación
                    targetSection.offsetHeight; 
                    targetSection.classList.add("active-tab");
                }

                // Restauramos la opacidad del contenedor maestro
                container.style.opacity = "1";
                container.style.transform = "translateY(0)";
            }, 150); // Tiempo óptimo para ocultar el switch de datos

        } catch (error) {
            // Manejador de excepciones visual para depuración rápida (Fallback)
            console.error(`Error de interconexión modular: ${error}`);
            container.innerHTML = `
                <section class="tab-section active-tab">
                    <header class="content-header">
                        <h1>Módulo no encontrado</h1>
                        <p class="subtitle">[ Error de Enrutamiento ]</p>
                    </header>
                    <article class="content-body">
                        <p>No se pudo inicializar la pestaña modular <code>tabs/${tabName}.html</code>.</p>
                        <p>Verifica que el archivo exista en la raíz correcta y que estés ejecutando el entorno a través de un servidor local (Live Server).</p>
                    </article>
                </section>
            `;
            container.style.opacity = "1";
            container.style.transform = "translateY(0)";
        }
    }

    // Configuración del Listener del menú de navegacion
    menuLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();

            const targetTab = link.getAttribute("data-target");

            // Gestión del estado activo de los botones en la interfaz lateral
            menuLinks.forEach(item => item.classList.remove("active"));
            link.classList.add("active");

            // Disparar carga del módulo solicitado
            fetchTabComponent(targetTab);
        });
    });

    // Carga inicial automatizada por defecto (Módulo: About)
    fetchTabComponent("about");
});