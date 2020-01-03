import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import DataProvider from './DataProvider'
import registerServiceWorker from './registerServiceWorker'

ReactDOM.render(<DataProvider />, document.getElementById('root'))
registerServiceWorker()
