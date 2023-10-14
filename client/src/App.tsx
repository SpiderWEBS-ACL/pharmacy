import AdminLayout from "./layouts/adminLayout";
import PharmacistLayout from "./layouts/pharmaLayout";
import PatientLayout from "./layouts/patientLayout";
import RegLog from "./pages/RegLog";


const App: React.FC = () => {
    const currentPath = window.location.pathname;
    if(currentPath.includes('/patient/register')){
        return <RegLog />
    }else
    if (currentPath.includes('/admin')) {
            return <AdminLayout />
    }else  
    if (currentPath.includes('/pharmacist')) {
        return <PharmacistLayout />}
    else if(currentPath.includes('/patient')){
        return <PatientLayout />}
    
}

export default App;
