import React from "react";
import "./style.css"
import AppRouter from "./components/appRouter/AppRouter";
import Header from "./components/ui/Header"
import Footer from "./components/ui/Footer"

function App() {
  return (
    <div className="App">
      <Header/>
      <AppRouter/>
      <Footer/>
    </div>
  );
}

export default App;
