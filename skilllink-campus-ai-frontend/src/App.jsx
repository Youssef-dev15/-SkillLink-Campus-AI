import Home from "./home"
import './home.css'
import { Routes, Route } from "react-router-dom";
import Acceuil from "./acceuil";
import Login from "./login";
import Features from "./features";
import HowItWorks from "./howitworks";
import InscriptionProfil from "./signup";
import VerifySuccess from "./VerifySuccess";
import VerifyFailed from "./VerifyFailed";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "./Dashboard";
import Profile from "./profile";
import Dash from "./dash";
import Daily from "./dailyplan";
import Match from "./Smartmatch";
import Messages from "./Messages";
import AiAssistant from "./Aiassistant";
import CreerFit from "./careerfit";
import EventsView from "./Event";
import QuizView from "./Aiquiz";
function App() {
 
 return (<>
 <Routes>
    <Route element={<Home/>}>
        <Route path="/" element={<Acceuil />} />
          <Route path="/login" element={<Login />} />
          <Route path="/features" element={<Features/>}/>
          <Route path="/how-it-works" element={<HowItWorks/>} />
          <Route path="/signup" element={<InscriptionProfil/>} />
          <Route path="/verify-success" element={<VerifySuccess />} />
          <Route path="/verify-failed" element={<VerifyFailed />} />
          </Route>
    <Route element={ <ProtectedRoute><Dashboard></Dashboard></ProtectedRoute>}>
    <Route path="/dashboard" element={<Dash />} />
     <Route path="/Profile" element={<Profile />} />
     <Route path="/Daily-plan" element={<Daily/>} />
     <Route path="/Smart-Matching" element={<Match/>} />
     <Route path="/Ai-assistant" element={<AiAssistant/>} />
     <Route path="/Messages" element={<Messages/>} />
     <Route path="/Career-Fit" element={<CreerFit/>} />
     <Route path="/Quiz" element={<QuizView/>} />
     <Route path="/Event" element={<EventsView/>} />
     
     
    </Route>
    
 </Routes>
 

 </> 

)}

export default App
