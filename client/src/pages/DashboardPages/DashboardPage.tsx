import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import UserCard from '../../components/dashboard/UserCard';
import FeatureChecklist from '../../components/dashboard/FeautureChecklist';
import TechStack from '../../components/dashboard/TechStack';
import AuthFlows from '../../components/dashboard/AuthFlows';
import { Header } from '../../components/ui/Header';
import { Footer } from '../../components/ui/Footer';

export default function DashboardPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* TOP NAV */}
      <Header handleLogout={handleLogout} />

      {/* PAGE */}
      <main className="max-w-5xl mx-auto px-6 py-8 space-y-10">
 
        <section><UserCard /></section>
 
        <div className="border-t border-slate-200" />
 
        <section><TechStack /></section>
 
        <div className="border-t border-slate-200" />
 
        <section><AuthFlows /></section>

        <div className="border-t border-slate-200" />
 
        <section><FeatureChecklist /></section>
 
        <Footer/>
      </main>
    </div>
  );
}