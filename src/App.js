import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Show3 from './components/show3';
import Task1 from './components/task1';
import Home from './components/singlePage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ProSidebarProvider } from 'react-pro-sidebar';



const App = () => {
  return (
    <>
        <ToastContainer />
        {/* <Provider store={store}> */}
          <ProSidebarProvider>
            <BrowserRouter>
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/task/1' element={<Task1 />} />
                <Route path='/task/3' element={<Show3 />} />
               </Routes>
            </BrowserRouter>
          </ProSidebarProvider>
        {/* </Provider> */}
        
    </>
  );
}

export default App;
