import Header from "@/components/Header";
import UserDashboard from "@/components/UserDashboard"; // The component we made earlier

const Dashboard = () => {
  return (
    <>
      <Header />
      {/* Add padding-top so content doesn't hide behind fixed header */}
      <main className="pt-16"> 
        <UserDashboard />
      </main>
    </>
  );
};

export default Dashboard;