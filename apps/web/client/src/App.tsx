import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProjectList } from './components/ProjectsList';
import './App.tsx';

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<ProjectList />} />
      </Routes>
    </BrowserRouter>
  );
}