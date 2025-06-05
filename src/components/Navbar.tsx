'use client';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar fixed z-10 w-screen">
      <img src="/images/logo.png" alt="SkyTrack" className="w-[100px] mx-auto pt-[30px] pb-[20px]"/>
    </nav>
  );
}