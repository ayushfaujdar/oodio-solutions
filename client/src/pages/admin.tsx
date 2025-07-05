import { useEffect } from "react";
import { useLocation } from "wouter";
import AdminModal from "@/components/admin-modal";
import { useAdmin } from "@/hooks/use-admin";

export default function AdminPage() {
  const [, navigate] = useLocation();
  const { showAdminModal, setShowAdminModal } = useAdmin();

  useEffect(() => {
    setShowAdminModal(true);
  }, [setShowAdminModal]);

  const handleClose = () => {
    setShowAdminModal(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <AdminModal 
        isOpen={showAdminModal} 
        onClose={handleClose} 
      />
    </div>
  );
}
