import React from "react";
import JobCard from "../components/JobCard";

export default function JobsPage(props) {
  const {
    addJob,
    title,
    setTitle,
    service,
    setService,
    location,
    setLocation,
    desc,
    setDesc,
    budgetMin,
    setBudgetMin,
    budgetMax,
    setBudgetMax,
    jobImage,
    setJobImage,
    postedBy,
    setPostedBy,
    aiInput,
    setAiInput,
    aiResult,
    recommendService,
    search,
    setSearch,
    filterService,
    setFilterService,
    filterLocation,
    setFilterLocation,
    services,
    filteredJobs,
    favorites,
    toggleFavorite,
    setSelectedJob,
  } = props;

  return (
    <div className="card">
      <h3>Post a Job</h3>

      <div className="two-col">
        <div>
          <label className="small">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="AC repair at home"
          />
        </div>

        <div>
          <label className="small">Service</label>
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            style={{
              padding: 10,
              borderRadius: 8,
              marginTop: 8,
              width: "100%",
            }}
          >
            {services.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <label className="small">Location</label>
      <input
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Bhopal, MP"
      />

      <label className="small">Description</label>
      <textarea
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        placeholder="Describe the service required"
        rows="3"
      />

      <div className="price-row">
        <div>
          <label className="small">Min Budget ₹</label>
          <input
            type="number"
            value={budgetMin}
            onChange={(e) => setBudgetMin(e.target.value)}
            placeholder="500"
          />
        </div>

        <div>
          <label className="small">Max Budget ₹</label>
          <input
            type="number"
            value={budgetMax}
            onChange={(e) => setBudgetMax(e.target.value)}
            placeholder="2000"
          />
        </div>
      </div>

      <label className="small">
        Service Image (optional)
      </label>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const f = e.target.files?.[0];

          if (f) {
            const r = new FileReader();

            r.onload = () => setJobImage(r.result);
            r.readAsDataURL(f);
          }
        }}
      />

      {jobImage && (
        <img
          src={jobImage}
          className="image-preview"
        />
      )}

      <label className="small">Posted By</label>

      <input
        value={postedBy}
        onChange={(e) => setPostedBy(e.target.value)}
      />

      <div className="action-row">
        <button
          className="btn"
          onClick={addJob}
        >
          Post Job
        </button>

        <button
          className="btn ghost"
          onClick={() => {
            setTitle("");
            setDesc("");
            setLocation("");
            setBudgetMin("");
            setBudgetMax("");
            setJobImage("");
          }}
        >
          Clear
        </button>
      </div>

      <div className="ai-box">
        <h4>🤖 AI Service Finder</h4>

        <div className="small">
          Describe your problem and JobPilot will
          suggest a service.
        </div>

        <div className="action-row">
          <input
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            placeholder="e.g. My fan is not working"
          />

          <button
            className="btn"
            onClick={recommendService}
          >
            Recommend
          </button>
        </div>

        {aiResult && (
          <div style={{ marginTop: 8 }}>
            Recommended:{" "}
            <strong>{aiResult}</strong>
          </div>
        )}
      </div>

      <h4>Find Jobs</h4>

      <div className="toolbar">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔎 Search jobs, services, location..."
        />

        <select
          value={filterService}
          onChange={(e) =>
            setFilterService(e.target.value)
          }
          style={{
            padding: 10,
            borderRadius: 8,
          }}
        >
          <option>All</option>

          {services.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <input
          value={filterLocation}
          onChange={(e) =>
            setFilterLocation(e.target.value)
          }
          placeholder="Filter location"
        />
      </div>

      <h4>
        Available Jobs ({filteredJobs.length})
      </h4>

      {filteredJobs.length === 0 && (
        <div className="small">
          No matching jobs found.
        </div>
      )}

      {filteredJobs.map((j) => (
        <JobCard
          key={j.id}
          job={j}
          favorite={favorites.includes(j.id)}
          onFavorite={toggleFavorite}
          onView={setSelectedJob}
        />
      ))}
    </div>
  );
}

////////

// import React, { useEffect } from "react";
// import JobCard from "../components/JobCard";

// const API_URL = "http://localhost:3500";

// export default function JobsPage(props) {
//   const {
//     addJob,
//     title,
//     setTitle,
//     service,
//     setService,
//     location,
//     setLocation,
//     desc,
//     setDesc,
//     budgetMin,
//     setBudgetMin,
//     budgetMax,
//     setBudgetMax,
//     jobImage,
//     setJobImage,
//     postedBy,

//     aiInput,
//     setAiInput,
//     aiResult,
//     recommendService,

//     search,
//     setSearch,
//     filterService,
//     setFilterService,
//     filterLocation,
//     setFilterLocation,
//     services,

//     filteredJobs,
//     favorites,
//     toggleFavorite,
//     setSelectedJob,

//     jobs,
//     setJobs,
//   } = props;

//   // ==================== GET ALL JOBS ====================
//   useEffect(() => {
//     const fetchJobs = async () => {
//       try {
//         const token = localStorage.getItem("token");

//         const response = await fetch(`${API_URL}/jobs`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const data = await response.json();

//         if (response.ok && data.status === 1) {
//           setJobs(data.jobs || []);
//         } else {
//           alert(data.msg || "Failed to fetch jobs");
//         }
//       } catch (error) {
//         console.error("Fetch jobs error:", error);
//         alert("Server connection error");
//       }
//     };

//     fetchJobs();
//   }, [setJobs]);

//   // ==================== CREATE JOB ====================
//   const handleAddJob = async () => {
//     if (!title.trim()) {
//       return alert("Title is required");
//     }

//     if (!location.trim()) {
//       return alert("Location is required");
//     }

//     if (!desc.trim()) {
//       return alert("Description is required");
//     }

//     if (budgetMin === "" || budgetMax === "") {
//       return alert("Min and Max budget are required");
//     }

//     if (Number(budgetMin) > Number(budgetMax)) {
//       return alert("Min budget cannot be greater than Max budget");
//     }

//     try {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         return alert("Please login first");
//       }

//       const response = await fetch(`${API_URL}/jobs`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           title: title.trim(),
//           service,
//           location: location.trim(),
//           description: desc.trim(),
//           budgetMin: Number(budgetMin),
//           budgetMax: Number(budgetMax),
//           jobImage: jobImage || "",
//         }),
//       });

//       const data = await response.json();

//       if (response.ok && data.status === 1) {
//         alert("Job posted successfully!");

//         // New job ko frontend list me add karo
//         setJobs((prev) => [data.job, ...prev]);

//         // Form clear
//         setTitle("");
//         setDesc("");
//         setLocation("");
//         setBudgetMin("");
//         setBudgetMax("");
//         setJobImage("");
//       } else {
//         alert(data.msg || "Failed to post job");
//       }
//     } catch (error) {
//       console.error("Create job error:", error);
//       alert("Server connection error");
//     }
//   };

//   // ==================== FILTER JOBS ====================
//   const jobsToShow = jobs.filter((j) => {
//     const q = search.toLowerCase();

//     const jobService = j.service || "";
//     const jobLocation = j.location || "";
//     const jobTitle = j.title || "";
//     const jobDescription = j.description || "";

//     return (
//       (!q ||
//         `${jobTitle} ${jobDescription} ${jobService} ${jobLocation}`
//           .toLowerCase()
//           .includes(q)) &&
//       (filterService === "All" || jobService === filterService) &&
//       (!filterLocation ||
//         jobLocation
//           .toLowerCase()
//           .includes(filterLocation.toLowerCase()))
//     );
//   });

//   return (
//     <div className="card">
//       <h3>Post a Job</h3>

//       <div className="two-col">
//         <div>
//           <label className="small">Title</label>

//           <input
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             placeholder="AC repair at home"
//           />
//         </div>

//         <div>
//           <label className="small">Service</label>

//           <select
//             value={service}
//             onChange={(e) => setService(e.target.value)}
//             style={{
//               padding: 10,
//               borderRadius: 8,
//               marginTop: 8,
//               width: "100%",
//             }}
//           >
//             {services.map((s) => (
//               <option key={s}>{s}</option>
//             ))}
//           </select>
//         </div>
//       </div>

//       <label className="small">Location</label>

//       <input
//         value={location}
//         onChange={(e) => setLocation(e.target.value)}
//         placeholder="Bhopal, MP"
//       />

//       <label className="small">Description</label>

//       <textarea
//         value={desc}
//         onChange={(e) => setDesc(e.target.value)}
//         placeholder="Describe the service required"
//         rows="3"
//       />

//       <div className="price-row">
//         <div>
//           <label className="small">Min Budget ₹</label>

//           <input
//             type="number"
//             value={budgetMin}
//             onChange={(e) => setBudgetMin(e.target.value)}
//             placeholder="500"
//           />
//         </div>

//         <div>
//           <label className="small">Max Budget ₹</label>

//           <input
//             type="number"
//             value={budgetMax}
//             onChange={(e) => setBudgetMax(e.target.value)}
//             placeholder="2000"
//           />
//         </div>
//       </div>

//       <label className="small">
//         Service Image (optional)
//       </label>

//       <input
//         type="file"
//         accept="image/*"
//         onChange={(e) => {
//           const f = e.target.files?.[0];

//           if (f) {
//             const r = new FileReader();

//             r.onload = () => setJobImage(r.result);

//             r.readAsDataURL(f);
//           }
//         }}
//       />

//       {jobImage && (
//         <img
//           src={jobImage}
//           className="image-preview"
//           alt="Job preview"
//         />
//       )}

//       <label className="small">Posted By</label>

//       <input
//         value={postedBy}
//         readOnly
//       />

//       <div className="action-row">
//         <button
//           className="btn"
//           onClick={handleAddJob}
//         >
//           Post Job
//         </button>

//         <button
//           className="btn ghost"
//           onClick={() => {
//             setTitle("");
//             setDesc("");
//             setLocation("");
//             setBudgetMin("");
//             setBudgetMax("");
//             setJobImage("");
//           }}
//         >
//           Clear
//         </button>
//       </div>

//       <div className="ai-box">
//         <h4>🤖 AI Service Finder</h4>

//         <div className="small">
//           Describe your problem and JobPilot will
//           suggest a service.
//         </div>

//         <div className="action-row">
//           <input
//             value={aiInput}
//             onChange={(e) => setAiInput(e.target.value)}
//             placeholder="e.g. My fan is not working"
//           />

//           <button
//             className="btn"
//             onClick={recommendService}
//           >
//             Recommend
//           </button>
//         </div>

//         {aiResult && (
//           <div style={{ marginTop: 8 }}>
//             Recommended:{" "}
//             <strong>{aiResult}</strong>
//           </div>
//         )}
//       </div>

//       <h4>Find Jobs</h4>

//       <div className="toolbar">
//         <input
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           placeholder="🔎 Search jobs, services, location..."
//         />

//         <select
//           value={filterService}
//           onChange={(e) =>
//             setFilterService(e.target.value)
//           }
//           style={{
//             padding: 10,
//             borderRadius: 8,
//           }}
//         >
//           <option>All</option>

//           {services.map((s) => (
//             <option key={s}>{s}</option>
//           ))}
//         </select>

//         <input
//           value={filterLocation}
//           onChange={(e) =>
//             setFilterLocation(e.target.value)
//           }
//           placeholder="Filter location"
//         />
//       </div>

//       <h4>
//         Available Jobs ({jobsToShow.length})
//       </h4>

//       {jobsToShow.length === 0 && (
//         <div className="small">
//           No matching jobs found.
//         </div>
//       )}

//       {jobsToShow.map((j) => (
//         <JobCard
//           key={j._id || j.id}
//           job={{
//             ...j,
//             id: j._id || j.id,
//             image: j.jobImage || j.image || "",
//             postedBy:
//               typeof j.postedBy === "object"
//                 ? j.postedBy?.name || j.postedBy?.email || ""
//                 : j.postedBy || "",
//           }}
//           favorite={favorites.includes(j._id || j.id)}
//           onFavorite={toggleFavorite}
//           onView={setSelectedJob}
//         />
//       ))}
//     </div>
//   );
// }