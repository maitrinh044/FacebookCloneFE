// src/Layout/MainLayout.jsx
import Header from "../components/Header";

export default function MainLayout({ children }) {
  return (
    <>
      <Header />
      <div className="pt-16">
        {children}
      </div>
    </>
  );
}
