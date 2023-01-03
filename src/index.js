import { createRoot } from 'react-dom/client';
import App from './App';
import * as serviceWorkerReg from "./serviceWorkerRegistration";

createRoot(document.getElementById('root')).render(<App />);

serviceWorkerReg.register();
