import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./Routes";

function App() {
  const location = useLocation();
  const hideNavAndFooter = ["/register", "/login"].includes(location.pathname);
  return (
    <div className="flex flex-col min-h-screen">
      {!hideNavAndFooter && <Navbar />}
      <main className="flex-grow">
        <AppRoutes/>
      </main>
      {!hideNavAndFooter && <Footer />}
    </div>
  );
}

export default App;


