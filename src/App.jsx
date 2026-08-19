import React, { useState, useEffect } from 'react';



    /***** CONFIG: Replace these values with your Firebase project's config for real auth *****/
    const firebaseConfig = {
      apiKey: "",         // <-- put your values here
      authDomain: "",
      projectId: "",
      storageBucket: "",
      messagingSenderId: "",
      appId: ""
    };
    /***** End config *****/

    // Helper: detect if firebase config appears valid (very basic)
    const hasFirebaseConfig = firebaseConfig && firebaseConfig.apiKey && firebaseConfig.authDomain;
    const firebaseApi = () => window.firebase;

    // Try init firebase if config present
    if (hasFirebaseConfig) {
      try {
        window.firebase.initializeApp(firebaseConfig);
        // window.firebase.auth() available (compat)
      } catch (e) {
        console.warn("Firebase init error:", e);
      }
    }

    // Local fallback auth keys used if firebase not configured
    const LOCAL_USER_KEY = "jp_demo_local_user";

    function useDarkMode() {
      const [dark, setDark] = useState(() => localStorage.getItem('jp_dark') === '1');
      useEffect(() => {
        document.body.classList.toggle('dark', dark);
        localStorage.setItem('jp_dark', dark ? '1' : '0');
      }, [dark]);
      return [dark, setDark];
    }

    function RootApp(){
      const [dark, setDark] = useDarkMode();

      // auth state: if firebase configured, use firebase auth; else use localStorage simple auth
      const [user, setUser] = useState(null); // user: {email}
      const [usingFirebase] = useState(hasFirebaseConfig && window.firebase && window.firebase.auth);

      // initialize auth listener if firebase
      useEffect(() => {
        if (usingFirebase) {
          const unsub = window.firebase.auth().onAuthStateChanged(u => {
            if (u) setUser({ email: u.email, uid: u.uid });
            else setUser(null);
          });
          return () => unsub();
        } else {
          // fallback: check localStorage
          const local = localStorage.getItem(LOCAL_USER_KEY);
          if (local) {
            setUser({ email: local });
          }
        }
      }, [usingFirebase]);

      return (
        <>
          <HeaderControls user={user} setUser={setUser} dark={dark} setDark={setDark} usingFirebase={usingFirebase} />
          {user ? <ProtectedApp user={user} usingFirebase={usingFirebase} /> : <AuthScreen usingFirebase={usingFirebase} />}
        </>
      );
    }

    // Header controls (logout, dark toggle, greeting)
    function HeaderControls({ user, setUser, dark, setDark, usingFirebase }) {
      const logout = async () => {
        if (usingFirebase) {
          await window.firebase.auth().signOut();
        } else {
          localStorage.removeItem(LOCAL_USER_KEY);
        }
        setUser(null);
      };

      return (
        <div style={{display:'flex', gap:10, alignItems:'center'}}>
          {user && <div className="small">Hi, <strong>{user.email}</strong></div>}
          <div className="toggle" title="Toggle dark mode" onClick={() => setDark(d => !d)}>
            {dark ? "🌙 Dark" : "☀️ Light"}
          </div>
          {user ? <button className="btn logout" onClick={logout}>Logout</button> : null}
        </div>
      );
    }

    // Authentication screen (signup/login). Supports Firebase when configured, else local fallback.
    function AuthScreen({ usingFirebase }) {
      const [isSignup, setIsSignup] = useState(false);
      const [email, setEmail] = useState('');
      const [pass, setPass] = useState('');
      const [loading, setLoading] = useState(false);

      const handleSignup = async () => {
        if (!email || !pass) return alert("Enter email & password");
        setLoading(true);
        try {
          if (usingFirebase) {
            await window.firebase.auth().createUserWithEmailAndPassword(email, pass);
            alert("Signup successful (Firebase)");
          } else {
            // local fallback: store user email/password (demo only)
            localStorage.setItem(LOCAL_USER_KEY, email);
            localStorage.setItem('jp_demo_pass', pass);
            alert("Signup saved locally (demo)");
            // trigger UI refresh by setting location (simple)
            location.reload();
          }
        } catch (e) {
          alert("Signup error: " + e.message);
        } finally { setLoading(false); }
      };

      const handleLogin = async () => {
        if (!email || !pass) return alert("Enter email & password");
        setLoading(true);
        try {
          if (usingFirebase) {
            await window.firebase.auth().signInWithEmailAndPassword(email, pass);
            alert("Login successful (Firebase)");
          } else {
            const saved = localStorage.getItem(LOCAL_USER_KEY);
            const sp = localStorage.getItem('jp_demo_pass');
            if (saved === email && sp === pass) {
              alert("Local login successful");
              location.reload();
            } else {
              alert("Invalid local credentials");
            }
          }
        } catch (e) {
          alert("Login error: " + e.message);
        } finally { setLoading(false); }
      };

      return (
        <div className="login-container">
          <h2 style={{margin:0, textAlign:'center'}}>Welcome to JobPilot</h2>
          <p className="muted" style={{textAlign:'center', marginTop:8}}>
            {usingFirebase ? "Login / Sign up with Email (Firebase)" : "Demo Login (local). For real auth add Firebase config in file."}
          </p>

          <label>Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />

          <label>Password</label>
          <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" />

          <button className="btn" style={{width:"100%",marginTop:16}} onClick={isSignup ? handleSignup : handleLogin} disabled={loading}>
            {isSignup ? (loading ? "Signing up..." : "Sign up") : (loading ? "Logging in..." : "Login")}
          </button>

          <div style={{textAlign:'center', marginTop:12}}>
            <a href="#" style={{color:'#fff', opacity:0.85}} onClick={(e)=>{e.preventDefault(); setIsSignup(s=>!s);}}>
              {isSignup ? "Have an account? Login" : "Create a new account"}
            </a>
          </div>

          {!usingFirebase && <div style={{marginTop:12}} className="muted small">
            Tip: This demo stores credentials locally (not secure). Replace firebaseConfig with your Firebase project config for real authentication.
          </div>}
        </div>
      );
    }

    // Protected App (after login)
    function ProtectedApp({ user, usingFirebase }) {
      const [tab, setTab] = useState('jobs');
      const [jobs, setJobs] = useState(() => JSON.parse(localStorage.getItem('jp_jobs') || '[]'));
      const [providers, setProviders] = useState(() => JSON.parse(localStorage.getItem('jp_providers') || '[]'));
      const [bookings, setBookings] = useState(() => JSON.parse(localStorage.getItem('jp_bookings') || '[]'));
      const [applications, setApplications] = useState(() => JSON.parse(localStorage.getItem('jp_apps') || '[]'));
      const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('jp_favorites') || '[]'));
      const [notifications, setNotifications] = useState(() => JSON.parse(localStorage.getItem('jp_notifications') || '[]'));
      const [chats, setChats] = useState(() => JSON.parse(localStorage.getItem('jp_chats') || '[]'));

      const [title, setTitle] = useState('');
      const [service, setService] = useState('Home Repair');
      const [desc, setDesc] = useState('');
      const [location, setLocation] = useState('');
      const [postedBy, setPostedBy] = useState(user.email || '');
      const [budgetMin, setBudgetMin] = useState('');
      const [budgetMax, setBudgetMax] = useState('');
      const [jobImage, setJobImage] = useState('');

      const [pname, setPname] = useState('');
      const [pskills, setPskills] = useState('');
      const [pexperience, setPexperience] = useState('');
      const [pbio, setPbio] = useState('');
      const [pavailable, setPavailable] = useState('Available');

      const [search, setSearch] = useState('');
      const [filterService, setFilterService] = useState('All');
      const [filterLocation, setFilterLocation] = useState('');
      const [selectedJob, setSelectedJob] = useState(null);
      const [selectedProvider, setSelectedProvider] = useState(null);
      const [chatProvider, setChatProvider] = useState(null);
      const [chatText, setChatText] = useState('');
      const [aiInput, setAiInput] = useState('');
      const [aiResult, setAiResult] = useState('');
      const [bookingDate, setBookingDate] = useState('');
      const [bookingTime, setBookingTime] = useState('');
      const [proposedPrice, setProposedPrice] = useState('');

      useEffect(() => localStorage.setItem('jp_jobs', JSON.stringify(jobs)), [jobs]);
      useEffect(() => localStorage.setItem('jp_providers', JSON.stringify(providers)), [providers]);
      useEffect(() => localStorage.setItem('jp_bookings', JSON.stringify(bookings)), [bookings]);
      useEffect(() => localStorage.setItem('jp_apps', JSON.stringify(applications)), [applications]);
      useEffect(() => localStorage.setItem('jp_favorites', JSON.stringify(favorites)), [favorites]);
      useEffect(() => localStorage.setItem('jp_notifications', JSON.stringify(notifications)), [notifications]);
      useEffect(() => localStorage.setItem('jp_chats', JSON.stringify(chats)), [chats]);

      const services = ['Home Repair','Carpentry','Electrician','Plumbing','Vehicle Repair','Cleaning','AC Repair','Painting'];

      const notify = (message) => setNotifications(prev => [{id:Date.now()+Math.random(),message,read:false,createdAt:Date.now()},...prev].slice(0,30));

      const addJob = () => {
        if (!title.trim() || !location.trim()) return alert('Title and location are required');
        const j = {id:Date.now(),title:title.trim(),service,description:desc.trim(),location:location.trim(),postedBy,budgetMin:Number(budgetMin)||0,budgetMax:Number(budgetMax)||0,image:jobImage,createdAt:Date.now()};
        setJobs(prev=>[j,...prev]); notify(`New job posted: ${j.title}`);
        setTitle('');setDesc('');setLocation('');setBudgetMin('');setBudgetMax('');setJobImage('');
        alert('Job posted successfully!');
      };

      const addProvider = () => {
        if (!pname.trim() || !pskills.trim()) return alert('Provider name & skills required');
        const p={id:Date.now(),name:pname.trim(),skills:pskills.split(',').map(s=>s.trim()).filter(Boolean),experience:pexperience||'1+ year',rating:4.5,reviews:0,bio:pbio.trim(),availability:pavailable,verified:true};
        setProviders(prev=>[p,...prev]); notify(`Provider ${p.name} joined JobPilot`);
        setPname('');setPskills('');setPexperience('');setPbio('');setPavailable('Available'); alert('Provider registered successfully!');
      };

      const applyToJob = (jobId,providerId,price='') => {
        if (applications.some(a=>a.jobId===jobId&&a.providerId===providerId)) return alert('Already applied');
        const job=jobs.find(j=>j.id===jobId), provider=providers.find(p=>p.id===providerId);
        const a={appId:Date.now(),jobId,providerId,status:'pending',proposedPrice:Number(price)||0,appliedAt:Date.now()};
        setApplications(prev=>[a,...prev]); notify(`${provider?.name||'Provider'} applied for ${job?.title||'your job'}`); alert('Application submitted!');
      };
      const updateApplication=(appId,status)=>{const a=applications.find(x=>x.appId===appId);setApplications(prev=>prev.map(x=>x.appId===appId?{...x,status}:x));if(a){notify(`Application ${status}: ${jobs.find(j=>j.id===a.jobId)?.title||'Job'}`);}};

      const createBooking=({jobId,providerId})=>{
        if(!bookingDate||!bookingTime)return alert('Please select booking date and time');
        const b={bookingId:Date.now(),jobId,providerId,userName:postedBy,date:bookingDate,time:bookingTime,status:'booked',rating:null,price:Number(proposedPrice)||0,createdAt:Date.now()};
        setBookings(prev=>[b,...prev]);notify(`Booking scheduled for ${bookingDate} at ${bookingTime}`);setBookingDate('');setBookingTime('');setProposedPrice('');alert('Booking created successfully!');
      };
      const markComplete=id=>{setBookings(prev=>prev.map(b=>b.bookingId===id?{...b,status:'completed'}:b));notify('Booking marked completed');};
      const rateBooking=(id,rating)=>{setBookings(prev=>prev.map(b=>b.bookingId===id?{...b,rating:Number(rating)}:b));const b=bookings.find(x=>x.bookingId===id);if(b)setProviders(prev=>prev.map(p=>p.id===b.providerId?{...p,rating:Math.min(5,Number(((p.rating+Number(rating))/2).toFixed(1))),reviews:(p.reviews||0)+1}:p));notify(`Thanks! You rated the provider ${rating}/5`);};

      const toggleFavorite=id=>setFavorites(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);
      const filteredJobs=jobs.filter(j=>{const q=search.toLowerCase();return(!q||`${j.title} ${j.description} ${j.service} ${j.location}`.toLowerCase().includes(q))&&(filterService==='All'||j.service===filterService)&&(!filterLocation||j.location.toLowerCase().includes(filterLocation.toLowerCase()));});
      const jobApplications=id=>applications.filter(a=>a.jobId===id); const providerName=id=>(providers.find(p=>p.id===id)||{}).name||'Unknown provider';
      const unread=notifications.filter(n=>!n.read).length;

      const sendChat=()=>{if(!chatText.trim()||!chatProvider)return;setChats(prev=>[...prev,{id:Date.now(),providerId:chatProvider.id,sender:'me',text:chatText.trim(),time:Date.now()}]);setChatText('');};
      const chatMessages=chatProvider?chats.filter(c=>c.providerId===chatProvider.id):[];

      const recommendService=()=>{
        const x=aiInput.toLowerCase();
        let result='General Home Service';
        if(x.includes('fan')||x.includes('wire')||x.includes('light')||x.includes('switch')||x.includes('electric'))result='Electrician ⚡';
        else if(x.includes('pipe')||x.includes('tap')||x.includes('water')||x.includes('leak'))result='Plumbing 🔧';
        else if(x.includes('ac')||x.includes('cooling')||x.includes('air conditioner'))result='AC Repair ❄️';
        else if(x.includes('car')||x.includes('bike')||x.includes('vehicle'))result='Vehicle Repair 🚗';
        else if(x.includes('clean')||x.includes('dust'))result='Cleaning 🧹';
        else if(x.includes('paint')||x.includes('wall'))result='Painting 🎨';
        setAiResult(result);setTab('jobs');setSearch(result.replace(/[^a-zA-Z ]/g,'').trim());
      };

      return <div>
        <div className="tabs" role="tablist">
          {['jobs','providers','applications','booking','dashboard','favorites','chat','notifications'].map(t=><div key={t} className={`tab ${t===tab?'active':''}`} onClick={()=>setTab(t)} role="tab">{t==='favorites'?'❤️':t==='chat'?'💬':t==='notifications'?`🔔 ${unread}`:t.toUpperCase()}</div>)}
        </div>

        <div className="grid"><main>
          {tab==='jobs'&&<div className="card">
            <h3>Post a Job</h3>
            <div className="two-col"><div><label className="small">Title</label><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="AC repair at home"/></div><div><label className="small">Service</label><select value={service} onChange={e=>setService(e.target.value)} style={{padding:10,borderRadius:8,marginTop:8,width:'100%'}}>{services.map(s=><option key={s}>{s}</option>)}</select></div></div>
            <label className="small">Location</label><input value={location} onChange={e=>setLocation(e.target.value)} placeholder="Bhopal, MP"/>
            <label className="small">Description</label><textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Describe the service required" rows="3"/>
            <div className="price-row"><div><label className="small">Min Budget ₹</label><input type="number" value={budgetMin} onChange={e=>setBudgetMin(e.target.value)} placeholder="500"/></div><div><label className="small">Max Budget ₹</label><input type="number" value={budgetMax} onChange={e=>setBudgetMax(e.target.value)} placeholder="2000"/></div></div>
            <label className="small">Service Image (optional)</label><input type="file" accept="image/*" onChange={e=>{const f=e.target.files?.[0];if(f){const r=new FileReader();r.onload=()=>setJobImage(r.result);r.readAsDataURL(f)}}}/>{jobImage&&<img src={jobImage} className="image-preview"/>}
            <label className="small">Posted By</label><input value={postedBy} onChange={e=>setPostedBy(e.target.value)}/>
            <div className="action-row"><button className="btn" onClick={addJob}>Post Job</button><button className="btn ghost" onClick={()=>{setTitle('');setDesc('');setLocation('');setBudgetMin('');setBudgetMax('');setJobImage('')}}>Clear</button></div>

            <div className="ai-box"><h4>🤖 AI Service Finder</h4><div className="small">Describe your problem and JobPilot will suggest a service.</div><div className="action-row"><input value={aiInput} onChange={e=>setAiInput(e.target.value)} placeholder="e.g. My fan is not working"/><button className="btn" onClick={recommendService}>Recommend</button></div>{aiResult&&<div style={{marginTop:8}}>Recommended: <strong>{aiResult}</strong></div>}</div>

            <h4>Find Jobs</h4><div className="toolbar"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔎 Search jobs, services, location..."/><select value={filterService} onChange={e=>setFilterService(e.target.value)} style={{padding:10,borderRadius:8}}><option>All</option>{services.map(s=><option key={s}>{s}</option>)}</select><input value={filterLocation} onChange={e=>setFilterLocation(e.target.value)} placeholder="Filter location"/></div>
            <h4>Available Jobs ({filteredJobs.length})</h4>
            {filteredJobs.length===0&&<div className="small">No matching jobs found.</div>}
            {filteredJobs.map(j=><div key={j.id} className="list-item"><div>{j.image&&<img src={j.image} className="image-preview"/>}<strong>{j.title}</strong><div className="small">{j.service} • 📍 {j.location}</div><div className="small">💰 {j.budgetMin||j.budgetMax?`₹${j.budgetMin||0} - ₹${j.budgetMax||j.budgetMin}`:'Budget not specified'} • {jobApplications(j.id).length} application(s)</div></div><div className="action-row"><button className="favorite" title="Favorite" onClick={()=>toggleFavorite(j.id)}>{favorites.includes(j.id)?'❤️':'🤍'}</button><button className="btn" onClick={()=>setSelectedJob(j)}>Details</button></div></div>)}
          </div>}

          {tab==='providers'&&<div className="card"><h3>Register Service Provider</h3><div className="two-col"><div><label className="small">Name</label><input value={pname} onChange={e=>setPname(e.target.value)} placeholder="Ajay Electrician"/></div><div><label className="small">Experience</label><input value={pexperience} onChange={e=>setPexperience(e.target.value)} placeholder="3 years"/></div></div><label className="small">Skills (comma separated)</label><input value={pskills} onChange={e=>setPskills(e.target.value)} placeholder="Electrician, AC Repair"/><label className="small">About</label><textarea value={pbio} onChange={e=>setPbio(e.target.value)} placeholder="Short professional bio" rows="3"/><label className="small">Availability</label><select value={pavailable} onChange={e=>setPavailable(e.target.value)} style={{padding:10,borderRadius:8,width:'100%'}}><option>Available</option><option>Busy</option><option>Offline</option></select><div className="action-row"><button className="btn" onClick={addProvider}>Register Provider</button></div><h4>Providers</h4>{providers.length===0&&<div className="small">No providers yet.</div>}{providers.map(p=><div key={p.id} className="list-item"><div><strong>👤 {p.name}</strong>{p.verified&&<span className="verified">✓ Verified</span>}<div className="small">🛠 {p.skills.join(', ')}</div><div className="small">⭐ {p.rating} • {p.experience} • {p.reviews||0} reviews • <span className="pill">{p.availability}</span></div></div><div className="action-row"><button className="btn" onClick={()=>setSelectedProvider(p)}>Profile</button><button className="btn" onClick={()=>setChatProvider(p)}>💬 Chat</button></div></div>)}</div>}

          {tab==='applications'&&<div className="card"><h3>Application Management</h3>{applications.length===0&&<div className="small">No applications yet.</div>}{applications.map(a=>{const job=jobs.find(j=>j.id===a.jobId);return <div className="list-item" key={a.appId}><div><strong>{job?job.title:'Job removed'}</strong><div className="small">Provider: {providerName(a.providerId)} • Proposed: {a.proposedPrice?`₹${a.proposedPrice}`:'Not specified'}</div><span className={`badge ${a.status}`}>{a.status.toUpperCase()}</span></div><div className="action-row">{a.status==='pending'&&<><button className="btn" onClick={()=>updateApplication(a.appId,'accepted')}>Accept</button><button className="btn ghost" onClick={()=>updateApplication(a.appId,'rejected')}>Reject</button></>}</div></div>})}</div>}

          {tab==='booking'&&<div className="card"><h3>Booking Management</h3><label className="small">Select Job</label><select id="selJob" style={{padding:10,width:'100%',borderRadius:8}}>{jobs.map(j=><option value={j.id} key={j.id}>{j.title}</option>)}</select><label className="small">Select Provider</label><select id="selProv" style={{padding:10,width:'100%',borderRadius:8}}>{providers.map(p=><option value={p.id} key={p.id}>{p.name}</option>)}</select><div className="two-col"><div><label className="small">Date</label><input type="date" value={bookingDate} onChange={e=>setBookingDate(e.target.value)}/></div><div><label className="small">Time</label><input type="time" value={bookingTime} onChange={e=>setBookingTime(e.target.value)}/></div></div><label className="small">Agreed Price ₹</label><input type="number" value={proposedPrice} onChange={e=>setProposedPrice(e.target.value)} placeholder="1500"/><div className="action-row"><button className="btn" onClick={()=>{const jobId=Number(document.getElementById('selJob').value);const providerId=Number(document.getElementById('selProv').value);if(!jobId||!providerId)return alert('Choose both');createBooking({jobId,providerId})}}>Create Booking</button></div><h4>Bookings</h4>{bookings.length===0&&<div className="small">No bookings yet.</div>}{bookings.map(b=>{const job=jobs.find(j=>j.id===b.jobId)||{title:'Job removed'};const prov=providers.find(p=>p.id===b.providerId)||{name:'Provider removed'};return <div className="list-item" key={b.bookingId}><div><strong>{prov.name}</strong> — {job.title}<div className="small">📅 {b.date} • ⏰ {b.time} • 💰 ₹{b.price||0}</div><span className={`badge ${b.status}`}>{b.status.toUpperCase()}</span>{b.rating&&<div className="small">Rating: {'⭐'.repeat(b.rating)}</div>}</div><div className="action-row">{b.status!=='completed'&&<button className="btn" onClick={()=>markComplete(b.bookingId)}>Complete</button>}{b.status==='completed'&&!b.rating&&<select onChange={e=>rateBooking(b.bookingId,e.target.value)} defaultValue="" style={{padding:8,borderRadius:8}}><option value="" disabled>Rate ⭐</option><option value="5">⭐⭐⭐⭐⭐</option><option value="4">⭐⭐⭐⭐</option><option value="3">⭐⭐⭐</option><option value="2">⭐⭐</option><option value="1">⭐</option></select>}</div></div>})}</div>}

          {tab==='dashboard'&&<div className="card"><h3>JobPilot Dashboard</h3><div className="stats-grid"><div className="stat">Jobs<strong>{jobs.length}</strong></div><div className="stat">Providers<strong>{providers.length}</strong></div><div className="stat">Applications<strong>{applications.length}</strong></div></div><div className="stats-grid"><div className="stat">Bookings<strong>{bookings.length}</strong></div><div className="stat">Completed<strong>{bookings.filter(b=>b.status==='completed').length}</strong></div><div className="stat">Favorites<strong>{favorites.length}</strong></div></div><h4>Recent Jobs</h4>{jobs.slice(0,5).map(j=><div className="list-item" key={j.id}><strong>{j.title}</strong><span className="small">{j.service} • {j.location}</span></div>)}</div>}

          {tab==='favorites'&&<div className="card"><h3>❤️ Saved Jobs</h3>{favorites.length===0&&<div className="small">No favorite jobs yet. Tap 🤍 on a job.</div>}{jobs.filter(j=>favorites.includes(j.id)).map(j=><div className="list-item" key={j.id}><div><strong>{j.title}</strong><div className="small">{j.service} • 📍 {j.location}</div></div><button className="btn" onClick={()=>setSelectedJob(j)}>View</button></div>)}</div>}

          {tab==='notifications'&&<div className="card"><h3>🔔 Notifications</h3>{notifications.length===0&&<div className="small">No notifications.</div>}{notifications.map(n=><div className="notice" key={n.id} onClick={()=>setNotifications(prev=>prev.map(x=>x.id===n.id?{...x,read:true}:x))}>{!n.read?'🟡':'⚪'} {n.message}<div className="small">{new Date(n.createdAt).toLocaleString()}</div></div>)}<button className="btn ghost" onClick={()=>setNotifications([])}>Clear Notifications</button></div>}

          {tab==='chat'&&<div className="card"><h3>💬 Provider Chat</h3><div className="toolbar">{providers.map(p=><button key={p.id} className="btn" onClick={()=>setChatProvider(p)}>{p.name}</button>)}</div>{!chatProvider?<div className="small">Select a provider to start chatting.</div>:<><h4>Chat with {chatProvider.name}</h4><div className="chat-box">{chatMessages.length===0&&<div className="small">Start the conversation...</div>}{chatMessages.map(m=><div className={`chat-msg ${m.sender==='me'?'me':''}`} key={m.id}>{m.text}<div className="small">{new Date(m.time).toLocaleTimeString()}</div></div>)}</div><div className="action-row"><input value={chatText} onChange={e=>setChatText(e.target.value)} placeholder="Type a message..." onKeyDown={e=>{if(e.key==='Enter')sendChat()}}/><button className="btn" onClick={sendChat}>Send</button></div></>}</div>}
        </main>

        <aside><div className="card"><h4>Quick Actions</h4><div style={{display:'flex',flexDirection:'column',gap:8}}><button className="btn" onClick={()=>setTab('jobs')}>🔎 Find Jobs</button><button className="btn" onClick={()=>setTab('providers')}>👨‍🔧 Providers</button><button className="btn" onClick={()=>setTab('favorites')}>❤️ Saved Jobs ({favorites.length})</button><button className="btn" onClick={()=>setTab('chat')}>💬 Chat</button><button className="btn" onClick={()=>setTab('notifications')}>🔔 Notifications ({unread})</button><button className="btn" onClick={()=>setTab('booking')}>📅 Book Service</button><button className="btn" onClick={()=>setTab('dashboard')}>📊 Dashboard</button></div></div><div className="card"><h4>Live Stats</h4><div className="small">Jobs: {jobs.length}</div><div className="small">Providers: {providers.length}</div><div className="small">Applications: {applications.length}</div><div className="small">Bookings: {bookings.length}</div><div className="small">Saved: {favorites.length}</div></div><div className="card"><h4>Reset Demo</h4><button className="btn ghost" onClick={()=>{if(!confirm('Clear all JobPilot demo data?'))return;setJobs([]);setProviders([]);setBookings([]);setApplications([]);setFavorites([]);setNotifications([]);setChats([]);['jp_jobs','jp_providers','jp_bookings','jp_apps','jp_favorites','jp_notifications','jp_chats'].forEach(k=>localStorage.removeItem(k));}}>Reset Demo Data</button></div></aside></div>

        {selectedJob&&<div className="modal-backdrop" onClick={()=>setSelectedJob(null)}><div className="modal" onClick={e=>e.stopPropagation()}><h2>{selectedJob.title}</h2>{selectedJob.image&&<img src={selectedJob.image} style={{width:'100%',maxHeight:220,objectFit:'cover',borderRadius:12}}/>}<div className="small">🛠 {selectedJob.service} • 📍 {selectedJob.location}</div><p>{selectedJob.description||'No description provided.'}</p><div className="small">💰 Budget: {selectedJob.budgetMin||selectedJob.budgetMax?`₹${selectedJob.budgetMin||0} - ₹${selectedJob.budgetMax||selectedJob.budgetMin}`:'Not specified'}</div><div className="small">Posted by: {selectedJob.postedBy}</div><h4>Apply with proposed price</h4><input type="number" placeholder="Your price ₹" value={proposedPrice} onChange={e=>setProposedPrice(e.target.value)}/><div className="action-row">{providers.map(p=><button className="btn" key={p.id} disabled={p.availability==='Offline'} onClick={()=>{applyToJob(selectedJob.id,p.id,proposedPrice);setProposedPrice('')}}>Apply as {p.name}</button>)}<button className="btn ghost" onClick={()=>setSelectedJob(null)}>Close</button></div></div></div>}

        {selectedProvider&&<div className="modal-backdrop" onClick={()=>setSelectedProvider(null)}><div className="modal" onClick={e=>e.stopPropagation()}><h2>👤 {selectedProvider.name}{selectedProvider.verified&&<span className="verified">✓ Verified</span>}</h2><p className="small">⭐ {selectedProvider.rating} • {selectedProvider.experience} • {selectedProvider.reviews||0} reviews • {selectedProvider.availability}</p><h4>Skills</h4><p>{selectedProvider.skills.map(s=><span className="pill" key={s}>{s}</span>)}</p><h4>About</h4><p>{selectedProvider.bio||'Professional local service provider.'}</p><button className="btn" onClick={()=>{setChatProvider(selectedProvider);setSelectedProvider(null);setTab('chat')}}>💬 Start Chat</button> <button className="btn ghost" onClick={()=>setSelectedProvider(null)}>Close</button></div></div>}
      </div>;
    }

    

export default RootApp;
