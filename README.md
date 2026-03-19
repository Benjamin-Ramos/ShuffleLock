# 🎰 ShuffleLock

**ShuffleLock** es una aplicación interactiva desarrollada con **React 18** y **Vite** que recrea la emocionante experiencia de apertura de cajas al estilo CS:GO. Permite a los usuarios cargar sus propias imágenes y ponerlas a prueba en una ruleta de desplazamiento infinito con físicas suaves y efectos de sonido inmersivos.

🌐 **Demo en vivo:** [shuffle-lock.vercel.app](https://shuffle-lock.vercel.app)

---

## 📸 Imágenes de Prueba

Para facilitar el testeo de la aplicación, el repositorio incluye una carpeta llamada `CardsTest`. 
Dentro encontrarás una colección de **imágenes optimizadas** que puedes arrastrar y soltar directamente en la demo para ver la ruleta en acción al instante.

---

## ✨ Características Principales

* **Carga Dinámica:** Sube tus propias imágenes para personalizar las opciones de la ruleta.
* **Ruleta Estilo CS:GO:** Animación horizontal con una línea central indicadora para determinar el ganador.
* **Scroll Infinito:** Gracias a una combinación de librerías de físicas, la ruleta se siente fluida, natural y alcanza los 60 FPS estables.
* **Experiencia Sonora Inmersiva:** Incluye efectos de sonido (SFX) inspirados en las aperturas de Valve:
    * Sonido de confirmación al cargar imágenes.
    * Sonido de inicio al activar el giro.
    * *Clicks* rítmicos sincronizados cada vez que una opción cruza el marcador central.
* **Celebración Final:** Efecto de confeti dinámico mediante `canvas-confetti` al detenerse la ruleta.

---

## 🛠️ Stack Tecnológico

El proyecto utiliza herramientas modernas de animación para garantizar una respuesta táctil y visual óptima:

* **Core:** React 18 + Vite
* **Animaciones de UI:** [Framer Motion](https://www.framer.com/motion/)
* **Físicas y Resortes:** [React Spring](https://www.react-spring.dev/) & [Tiny Spring](https://github.com/pqina/tiny-spring)
* **Efectos Visuales:** [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)

---

## 🚀 Instalación y Configuración

Si deseas ejecutar este proyecto localmente, sigue estos pasos:

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/Benjamin-Ramos/ShuffleLock.git
    cd ShuffleLock
    ```

2.  **Instala las dependencias:**
    ```bash
    npm install
    # o si usas pnpm
    pnpm install
    ```

3.  **Inicia el servidor de desarrollo:**
    ```bash
    npm run dev
    ```

---

## 📄 Licencia
Este proyecto es de código abierto bajo la licencia [MIT](LICENSE).

---

**Desarrollado por [Benjamin Ramos](https://github.com/Benjamin-Ramos)**

    
