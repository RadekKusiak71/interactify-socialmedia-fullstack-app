import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import './App.css';
import PrivateRoutes from './utils/PrivateRoutes';
import { AuthProvider } from './context/AuthContext';
import { PostProvider } from './context/PostContext';
import HeaderDisplay from './utils/HeaderDisplay';
import Groups from './components/Groups/Groups';
import Profile from './components/Profile/Profile';
import PostCommentPage from './pages/PostCommentPage';
import SavedPosts from './components/Profile/SavedPosts';
import SharedPosts from './components/Profile/SharedPosts';
import ProfileHeaderDisplays from './utils/ProfileHeaderDisplays';

function App() {
  return (
    <Router>
      <AuthProvider>
        <PostProvider>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route element={<PrivateRoutes />}>
              <Route element={<HeaderDisplay />}>
                <Route exact path='/' element={<HomePage />} />
                <Route path="/groups" element={<Groups />} />
                <Route element={<ProfileHeaderDisplays />}>
                  <Route path="/account/:username/" element={<Profile />} />
                  <Route path="/account/:username/saved/" element={<SavedPosts />} />
                  <Route path="/account/:username/shared/" element={<SharedPosts />} />
                </Route>
              </Route>
              <Route path='/:postID/comments' element={<PostCommentPage />} />
            </Route>
          </Routes>
        </PostProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
