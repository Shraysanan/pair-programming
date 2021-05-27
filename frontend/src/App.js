import './App.css';
import TextEditor from './components/TextEditor'
import {BrowserRouter, Route} from 'react-router-dom'
import {Provider} from 'react-redux'
import login from './components/Login'
import Register from './components/Register'
import Profile from './components/Profile'
import store from './store'
import PrivateRoute from './components/routing/PrivateRoute'

// import Ide from './components/Ide'
function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <BrowserRouter>
          {/* <Ide/> */}
          <Route path='/' component={login}/>
          <Route path='/Register' component={Register}/>
          <Route path='/Profile' component={Profile}/>
          <PrivateRoute path='/texteditor' component={TextEditor}/>
          {/* // <TextEditor/>  */}
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
