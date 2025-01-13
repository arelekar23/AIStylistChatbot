import "./App.css";
import UploadImage from "./components/UploadImage";

function App() {
  return (
    <>
      <div className="header">
        <h1>AI Stylist Chatbot</h1>
        <h3>Helping You Look Fabulous, One Chat at a Time!</h3>
      </div>

      <div className="main-content">
        <UploadImage />
      </div>
    </>
  );
}

export default App;
