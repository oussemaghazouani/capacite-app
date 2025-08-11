export const buttonStyle = {
  padding: "12px 20px",
  borderRadius: 10,
  border: "none",
  background: "linear-gradient(135deg, #fda3d7 0%, #7fb3f5 100%)",
  color: "#fff",
  fontWeight: "600",
  fontSize: 16,
  cursor: "pointer",
  boxShadow: "0 4px 10px rgba(127, 179, 245, 0.4)",
  transition: "transform 0.3s",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
};

export const toolbarButtonStyle = {
  padding: "10px 20px",
  height: "45px",
  minWidth: "150px",
  borderRadius: "10px",
  border: "none",
  background: "linear-gradient(135deg, #fda3d7 0%, #7fb3f5 100%)",
  color: "#fff",
  fontWeight: "600",
  fontSize: "15px",
  cursor: "pointer",
  boxShadow: "0 4px 10px rgba(127, 179, 245, 0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "transform 0.3s",
};

export const inputStyle = {
  padding: 12,
  borderRadius: 8,
  border: "1px solid #ccc",
  fontSize: 16,
};

export const fadeInStyle = {
  animation: "fadeIn 1s ease forwards",
  opacity: 0,
};

export const keyframes = `
  @keyframes fadeIn {
    to { opacity: 1; }
  }
`;
