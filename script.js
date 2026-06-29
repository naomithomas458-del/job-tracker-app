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


    if (!company || !jobTitle || !dateApplied || !status || !location || !employmentType || !interviewDate) {
        alert("Please fill in all fields");
        return;
    }

    // Push to array
    jobs.push({
        company: company,
        jobTitle: jobTitle,
        dateApplied: dateApplied,
        status: status,
        location: location,
        employmentType: employmentType,
        interviewDate: interviewDate
    });

    alert("Job added!");

    // 🔥 REMOVE the form completely
    document.getElementById("dynamicForm").remove();
}

function showArray() {
    document.getElementById("output").textContent =
        JSON.stringify(jobs, null, 2);
}

// EVENT LISTENER

addBtn.addEventListener("click", addJob);

searchInput.addEventListener("input",handleSearchAndFilter);

filterStatus.addEventListener("change",handleSearchAndFilter);

darkModeBtn.addEventListener("click",() => {
        document.body.classList.toggle(
            "dark-mode");
    });

themeSelector.addEventListener("change", () => {

    document.body.classList.remove(
        "theme-blue",
        "theme-green",
        "theme-purple"
    );

    document.body.classList.add(
        `theme-${themeSelector.value}`
    );
});

// DISPLAY SAVED JOBS

displayJobs();
updateDashboard();
createStatusChart();
createMonthlyChart();

// ADD JOB

function addJob() {

    const company = companyInput.value.trim();
    const role = roleInput.value.trim();
    const status = statusInput.value;
    const date = dateInput.value;
    const notes = notesInput.value.trim();

    const location = document.getElementById("location").value.trim();
    const employmentType = document.getElementById("employmentType").value;
    const interviewDate = document.getElementById("interviewDate").value;
    const jobLink = document.getElementById("jobLink").value.trim();

  // CONDITIONAL STATEMENT

    if(company === "" ||
         role === "" ||
         dateInput.value ==="" ||
         status === "" ||
         location === "" ||
         employmentType === "" ||
         interviewDate === ""
      ) {
        alert("Please fill in all fields");
        return;
    }

    // OBJECT

    const newJob = {
        id: Date.now(),
        company,
        role,
        status,
        date,
        location,
        employmentType,
        interviewDate,
        jobLink,
        notes
    };

    jobs.push(newJob);

    saveJobs();
    displayJobs();
    updateDashboard();

    companyInput.value = "";
    roleInput.value = "";
    dateInput.value ="";
    notesInput.value ="";
}

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

    companyInput.value = job.company;
    roleInput.value = job.role;
    statusInput.value = job.status;
    dateInput.value = job.date;

    document.getElementById("location").value = job.location;
    document.getElementById("employmentType").value = job.employmentType;
    document.getElementById("interviewDate").value = job.interviewDate;
    document.getElementById("jobLink").value = job.jobLink;

    notesInput.value = job.notes;

    editingJobId = id;

    addButton.textContent = "Save Changes";
}

// DELETE JOB

function deleteJob(id){

    jobs = jobs.filter(job => job.id !== id);

    saveJobs();

   handleSearchAndFilter();
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
function searchJobs() {

    const searchTerm =
    searchInput.value.trim().toLowerCase();

     return  jobs.filter(job =>
        job.company.toLowerCase().includes(searchTerm) ||
        job.role.toLowerCase().includes(searchTerm) ||
        job.status.toLowerCase().includes(searchTerm) ||
        job.location.toLowerCase().includes(searchTerm) ||
        job.employmentType.toLowerCase().includes(searchTerm) ||
        job.notes.toLowerCase().includes(searchTerm)
    );

    displayFilteredJobs(filteredJobs);
}

// Filter
function filterJobs(jobList) {

     const selectedStatus = document.getElementById("filterStatus").value;
     const selectedEmployment = document.getElementById("employment").value;

     const filtered = jobs.filter(job => {
        return(selectedStatus === "All" || job.status == selectedStatus) &&
               (selectedEmployment == "All" || job.employmentType == selectedEmployment);
     });
          displayFilteredJobs(filtered);
    
    }

    function handleSearchAndFilter(){
        const searchResults = searchJobs();
        const finalResults = filterJobs(searchResults);

        displayFilteredJobs(finalResults);
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

        if (!job.dateApplied) return;

        // Convert "2026-06-15" into "Jun 2026"
        const date = new Date(job.dateApplied);

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

