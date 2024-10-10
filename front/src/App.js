import Router from './Router'
import './App.css'
import 'react-activity/dist/Spinner.css'
import FullScreen from './theme/FullScreen/FullScreen'

const App = () => {
    return (
        <div className="maxheight">
            <Router />
            <FullScreen />
        </div>
    )
}

export default App
