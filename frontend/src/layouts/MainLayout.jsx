import Navbar from "../components/Navbar";

const MainLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <div style={{ padding: "20px" }}>{children}</div>
    </div>
  );
};

export default MainLayout;
