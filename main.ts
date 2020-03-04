import { BrowserWindow, ipcMain } from 'electron';
import { init } from '@sentry/electron';
import { Dedupe } from '@sentry/integrations';

export default class Main {
    static mainWindow: Electron.BrowserWindow;
    static application: Electron.App;
    static BrowserWindow;

    private static initSentry(){
        init({
            dsn: 'https://580b3451931a4b72bf78f0ea0f4a43af@sentry.io/3483440',
            defaultIntegrations: false,
            integrations: [
                new Dedupe()
            ]
        });
    }

    private static onWindowAllClosed() {
        if (process.platform !== 'darwin') {
            Main.application.quit();
        }
    }

    private static onClose() {
        // Dereference the window object. 
        Main.mainWindow = null;
    }

    private static onReady() {
        Main.mainWindow = new Main.BrowserWindow({ 
            width: 800, 
            height: 600,  
            webPreferences: {
                nodeIntegration: true
            } 
        });

        Main.mainWindow
            .loadFile('./index.html');

            // Open the DevTools.
        Main.mainWindow.webContents.openDevTools()

        Main.mainWindow.on('closed', Main.onClose);

        // The IPC handlers below trigger errors in the here (main process) when
        // the user clicks on corresponding buttons in the UI (renderer).
        // JAVASCRIPT
        ipcMain.on('demo.error', () => {
            console.log('Error triggered in main processes');
            throw new Error('Error triggered in main processes');
        });
    }

    static main(app: Electron.App, browserWindow: typeof BrowserWindow) {
        Main.initSentry();
        // we pass the Electron.App object and the  
        // Electron.BrowserWindow into this function 
        // so this class has no dependencies. This 
        // makes the code easier to write tests for 
        Main.BrowserWindow = browserWindow;
        Main.application = app;
        Main.application.on('window-all-closed', Main.onWindowAllClosed);
        Main.application.on('ready', Main.onReady);
    }
}
