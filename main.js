const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow () {
  // Crear la ventana del navegador
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, 'assets/icono medico.ico'), // Agregada la ruta del icono
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  // Cargar el archivo HTML principal de tu aplicación
  mainWindow.loadFile('index.html')
  
  // Opcional: abrir las herramientas de desarrollo
  // mainWindow.webContents.openDevTools()
}

// Cuando la aplicación está lista, crear la ventana
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Cerrar la aplicación cuando todas las ventanas estén cerradas
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})