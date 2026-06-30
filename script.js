// VARIABLES


const companyInput = document.getElementById("company");
const roleInput = document.getElementById("role");
const statusInput = document.getElementById("status");
const addBtn = document.getElementById("addBtn");
const jobList = document.getElementById("jobList");
const searchInput = document.getElementById("searchInput");
const dateInput = document.getElementById("dateApplied");
const notesInput = document.getElementById("notes");
const filterStatus = document.getElementById("filterStatus");
const darkModeBtn = document.getElementById("darkModeBtn");
const themeSelector = document.getElementById("themeSelector");
const locationInput = document.getElementById("location");
const jobLinkInput = document.getElementById("jobLink");
const addButton = document.getElementById("addButton");
const scheduleBtn = document.getElementById("scheduleBtn");


let statusChart;
let monthlyChart;
let editingJobId = null;





// ARRAY

let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
//let dataArray = [];

// CREATE DYNAMIC FORM AND VALIDATE
function createForm() {
    const container = document.getElementById("formContainer");

    // Prevent duplicate form creation
    if (document.getElementById("dynamicForm")) return;

    const form = document.createElement("div");
    form.className = "form-box";
    form.id = "dynamicForm";

    form.innerHTML = `
        <h3>Dynamic Form</h3>
        <input type="text" id="company" placeholder="Enter company name">
        <input type="text" id="jobTitle" placeholder="Enter job title">
        <input type="date" id="dateApplied" placeholder="Enter date applied">

        <select id="status">
            <option value="">Select Status</option>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
        </select>

        <input type="text" id="location" placeholder="Location (Cape Town, Remote...)">

        <select id="employmentType">
            <option value="">Employment Type</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
        </select>

        <input type="date" id="interviewDate" placeholder="Interview Date (if applicable)">
    
        <button onclick="submitForm()">Submit</button>
    `;

    container.appendChild(form);
}

function submitForm() {
    const company = document.getElementById("company").value;
    const jobTitle = document.getElementById("jobTitle").value;
    const dateApplied = document.getElementById("dateApplied").value;
    const status = document.getElementById("status").value;
    const location = document.getElementById("location").value;
    const employmentType = document.getElementById("employmentType").value;
    const interviewDate = document.getElementById("interviewDate").value;
    const isEdit = editingJobId !== null;

    if (!company || !jobTitle || !dateApplied || !status || !location || !employmentType || !interviewDate) {
        alert("Please fill in all fields");
        return;
    }
//edit mode
if(editingJobId !== null) {

    jobs = jobs.map(job => {
        if(job.id === editingJobId) {
            return {
                ...job,
                company:company,
                role:jobTitle,
                date:dateApplied,
                status:status,
                loaction:location,
                employmentType:employmentType,
                interviewDate:interviewDate

            };
        }
        return jobs;
    });
    editingJobId = null;
}

// add mode 
else{ 
     jobs.push({
        id:Date.now(),
        company: company,
        role: jobTitle,
        date: dateApplied,
        status: status,
        location: location,
        employmentType: employmentType,
        interviewDate: interviewDate,
        notes:""
    });
}
   
saveJobs();

//update Ui
displayJobs();
updateDashboard();
createStatusChart();
createMonthlyChart();
createRejectionInterviewChart();

    alert(editingJobId ? "Job added!" : "Job added!");

    // 🔥 REMOVE the form completely
    document.getElementById("dynamicForm").remove();

    editingJobId = null;
}




function showArray() {
    document.getElementById("output").textContent =
        JSON.stringify(jobs, null, 2);
}

// Create table. Displayed in the Applications tab.
function createTable() {
    const content = document.querySelector(".content");

    if (jobs.length === 0) {
        content.innerHTML = "<p>No data available</p>";
        return;
    }

    let tableHTML = `
        <table border="1" cellpadding="10" cellspacing="0">
            <tr>
                <th>Company</th>
                <th>Job Title</th>
                <th>Status</th>
                <th>Date Applied</th>
                <th>Location</th>
                <th>Employment Type</th>
                <th>Interview Date</th>
            </tr>
    `;

    jobs.forEach(job => {
        tableHTML += `
            <tr>
                <td>${job.company}</td>
                <td>${job.jobTitle}</td>
                <td>${job.status}</td>
                <td>${job.dateApplied}</td>
                <td>${job.location}</td>
                <td>${job.employmentType}</td>
                <td>${job.interviewDate}</td>
            </tr>
        `;
    });

    tableHTML += "</table>";

    content.innerHTML = tableHTML;
}




if(searchInput) {
    searchInput.addEventListener("input",handleSearchAndFilter);
}

if(filterStatus){
filterStatus.addEventListener("change",handleSearchAndFilter);
}


darkModeBtn.addEventListener("click",() => {
        document.body.classList.toggle(
            "dark-mode");
    });

    scheduleBtn.addEventListener("click", addReminder);



// DISPLAY SAVED JOBS

displayJobs();
updateDashboard();
createStatusChart();
createMonthlyChart();

// ADD JOB



// DISPLAY JOBS

function getStatusClass(status) {
    if (status === "Applied") {
        return "status-applied";
    }
    if (status === "Interview") {
        return "status-interview";
    }
    if (status === "Offer") {
        return "status-offer";
    }
    return "status-rejected";
}

function displayJobs() {
    displayFilteredJobs(jobs);
}

function displayFilteredJobs(filteredJobs) {
    jobList.innerHTML = "";

    filteredJobs.forEach((job, index) => {
        const statusClass = getStatusClass(job.status);

        jobList.innerHTML += `
        <tr>
            <td>${job.date}</td>
            <td>${job.company}</td>
            <td>${job.role}</td>

            <td class="${statusClass}">
                ${job.status}
            </td>

            <td>
            ${job.location || ""}<br>
              ${job.employmentType}
            </td>
            <td>${job.notes || ""}</td>
    <td>
    <div class="action-buttons">
   
        <button class="update-btn" onclick="updateJob(${job.id})">Update</button>

        <button class="delete-btn" onclick="deleteJob(${job.id})">Delete</button>
        
    </div>
</td>
<td><a href="${job.jobLink}" target="_blank">🔗View</a></td>

        </tr>
        `;
    });

    updateDashboard();
}

// update appliaction

function updateJob(id) {

    const job = jobs.find(job => job.id === id);

    if(!job) return;

    document.getElementById("company").value = job.company || "";
    document.getElementById("jobTitle").value = job.role|| "";
    document.getElementById("status").value = job.status || "";
    document.getElementById("dateApplied").value = job.date || "";
    document.getElementById("location").value = job.location || "";
    document.getElementById("employment").value = job.employmentType || "";
    document.getElementById("interviewDate").value = job.interviewDate || "";
    document.getElementById("jobLink").value = job.jobLink || "";
    document.getElementById("notes").value = job.notes || "";

    editingJobId = id;

    const btn = document.getElementById("addBtn");
    if(btn) btn.textContent = "Save Changes";
    
}

// DELETE JOB

function deleteJob(id){

    jobs = jobs.filter(job => job.id !== id);

    saveJobs();

   handleSearchAndFilter();
   createRejectionInterviewChart();
}

// SAVE TO LOCAL STORAGE

function saveJobs(){

    localStorage.setItem(
        "jobs",
        JSON.stringify(jobs)
    );
}

// DASHBOARD COUNTS

function updateDashboard() {

    const totalApplications = jobs.length;

    const interviews = jobs.filter(job =>
        job.status === "Interview"
    ).length;

    const offers = jobs.filter(job =>
        job.status === "Offer"
    ).length;

    const rejections = jobs.filter(job =>
        job.status === "Rejected"
    ).length;

    document.getElementById("totalJobs").textContent = totalApplications;

    document.getElementById("interviews").textContent = interviews;

    document.getElementById("offers").textContent = offers;

    document.getElementById("rejections").textContent = rejections;

    const successRate = totalApplications > 0
        ? ((offers / totalApplications) * 100).toFixed(1)
        : 0;

    document.getElementById("successRate").textContent =
        successRate + "%";

}

// search
function searchJobs(lists) {

    const searchTerm =
    searchInput.value.trim().toLowerCase();

     return  jobs.filter(job => {
        return ( 
            (job.company || "").toLowerCase().includes(searchTerm) ||
        (job.role || job.jobTitle || "").toLowerCase().includes(searchTerm) ||
        (job.status || "").toLowerCase().includes(searchTerm) ||
        (job.location ||"").toLowerCase().includes(searchTerm) ||
        (job.employmentType || "").toLowerCase().includes(searchTerm) ||
        (job.notes || "").toLowerCase().includes(searchTerm)
    );
      });
 }
        

  

// Filter
function filterJobs(jobArray) {

    const selectedStatus = filterStatus.value;
    
    if(selectedStatus == "All") {
        return jobArray;
    }
    return jobArray.filter(job => job.status == selectedStatus);
}

    function handleSearchAndFilter(){

        let filteredJobs = jobs;

        //search
        const searchTerm = searchInput.value.trim().toLowerCase();

        if(searchTerm !== "") {

            filteredJobs = filterJobs.filter(job => 
            (job.company || "").toLowerCase().includes(searchTerm) ||
            (job.role || "").toLowerCase().includes(searchTerm)
            );
        }
        //status filter
        const selectedStatus = filterStatus.value;

        if(selectedStatus !== "All") {
            filteredJobs = filteredJobs.filter(job => 
                job.status == selectedStatus
            );
        }
        displayFilteredJobs(filteredJobs);
    }
 
    
// CHART

    function createStatusChart() {

    const applied =
        jobs.filter(job => job.status === "Applied").length;

    const interview =
        jobs.filter(job => job.status === "Interview").length;

    const offer =
        jobs.filter(job => job.status === "Offer").length;

    const rejected =
        jobs.filter(job => job.status === "Rejected").length;


   const ctx = document.getElementById("statusChart");

// Destroy the old chart if it already exists
if (statusChart) {
    statusChart.destroy();
}

statusChart = new Chart(ctx, {

    type: "pie",

    data: {

        labels: [
            "Applied",
            "Interview",
            "Offer",
            "Rejected"
        ],

        datasets: [{

            data: [
                applied,
                interview,
                offer,
                rejected
            ]

        }]

    },

    options: {

        responsive: true,

        plugins: {

            legend: {
                position: "bottom"
            }

        }

    }

});
    }

    //chart

   function createMonthlyChart() {

    const monthCounts = {};

    jobs.forEach(job => {

        if (!job.date) return;

        // Convert "2026-06-15" into "Jun 2026"
        const date = new Date(job.date);

        const month = date.toLocaleString("default", {
            month: "short",
            year: "numeric"
        });

        monthCounts[month] = (monthCounts[month] || 0) + 1;

    });

    const labels = Object.keys(monthCounts);
    const data = Object.values(monthCounts);

    const ctx = document.getElementById("monthlyChart");

    if (monthlyChart) {
        monthlyChart.destroy();
    }

    monthlyChart = new Chart(ctx, {

        type: "bar",

        data: {

            labels: labels,

            datasets: [{

                label: "Applications",

                data: data,

                backgroundColor: "#4f46e5",
                borderRadius: 8

            }]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {
                    display: false
                }

            },

            scales: {

                y: {

                    beginAtZero: true,

                    ticks: {
                        stepSize: 1
                    }

                }

            }

        }

    });

}

function renderRejectionChart(data) {

    const ctx = document.getElementById("rejectionChart").getContext("2d");

    new Chart(ctx, {
        type: "pie",
        data: {
            labels: data.map(d => d.name),
            datasets: [{
                data: data.map(d => d.value),
                backgroundColor: ["red", "green"]
            }]
        }
    });
}

let reminder = JSON.parse(localStorage.getItem("reminder")) || [];

function addReminder() {

    const company = document.getElementById("interviewCompany").value;
    const date = document.getElementById("interviewDate").value;
    const time = document.getElementById("interviewTime").value;

    if(!company || !date || !time) {
        alert("Please complete all feilds.");
    }

    reminder.push({
        company,
        date,time
    });

    localStorage.setItem("reminder", JSON.stringify(reminder));

    displayReminder();
}

function displayReminder() {

    const reminderList = document.getElementById("reminderList");

    reminderList.innerHTML = "";

    reminder.forEach((item,index)=> {

        reminderList.innerHTML += `

        <div class="reminder-card">
        
        <h4>${item.company}</h4>

       <p>${item.date}</p>

       <p>${item.time}</p>
        
        <button onclick="deleteReminder(${index})">

        Delete

        </button>
       
        </div>
        `;
          
    });
}

function deleteReminder(index){

    reminder.splice(index, 1);

    localStorage.setItem("reminder", JSON.stringify(reminder));

    displayReminder();
}







