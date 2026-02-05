import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import TaskWeek from "./pages/TaskWeek";
import FocusSession from "./pages/FocusSession";
import TaskDetail from "./pages/TaskDetail";
import WeekGoals from "./pages/WeekGoals";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/taskweek" element={<TaskWeek />} />
        <Route path="/focussession" element={<FocusSession />} />
        <Route path="/task/:listId/:taskId" element={<TaskDetail />} />
        <Route path="/task/new" element={<TaskDetail />} />
        <Route path="/weekgoals" element={<WeekGoals />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

