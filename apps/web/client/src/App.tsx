import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProjectList } from './components/ProjectsList';
import './App.tsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProjectList />} />
      </Routes>
    </BrowserRouter>
  );
}