/**
 * @format
 */
import { AppRegistry, I18nManager } from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { QuizProvider } from './QuizContext'; // Import the QuizProvider

I18nManager.forceRTL(true);
I18nManager.allowRTL(true);
I18nManager.isRTL = true;

function Main() {
    return (
        <QuizProvider>
            <App />
        </QuizProvider>
    )
}

AppRegistry.registerComponent(appName, () => Main);
