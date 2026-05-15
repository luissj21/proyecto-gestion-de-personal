const KpiCard = ({ title, value, icon, color }) => {
  return (
    <div
      style={{
        background: "#1e1e2f",
        borderRadius: "16px",
        padding: "20px",
        color: "white",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        transition: "0.2s",
      }}
    >
      <span style={{ fontSize: "14px", opacity: 0.7 }}>{title}</span>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2 style={{ margin: 0 }}>{value}</h2>
        <span style={{ fontSize: "24px" }}>{icon}</span>
      </div>

      <div
        style={{
          height: "4px",
          background: color,
          borderRadius: "4px",
          width: "40%",
        }}
      />
    </div>
  );
};

export default KpiCard;
