import React from "react";

export default function Navbar({user,setUser,dark,setDark,usingFirebase}) {
  const logout = async () => {
    if (usingFirebase) await window.firebase.auth().signOut();
    else localStorage.removeItem("jp_demo_local_user");
    setUser(null);
  };
  return <div className="app-header">
    <div><h1>JobPilot</h1><div className="small">Find jobs, hire providers, and book services.</div></div>
    <div className="right-controls">
      {user && <div className="small">Hi, <strong>{user.email}</strong></div>}
      <div className="toggle" title="Toggle dark mode" onClick={()=>setDark(d=>!d)}>{dark?"🌙 Dark":"☀️ Light"}</div>
      {user && <button className="btn logout" onClick={logout}>Logout</button>}
    </div>
  </div>;
}
