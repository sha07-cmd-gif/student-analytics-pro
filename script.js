// ===== DATA =====
const SUBJECTS = ['OS','TOC','AIML','DBMS','Algorithms','ESS'];
const STUDENTS_DB = {
  '312521205001':{name:'Sha',marks:[78,82,91,76,88,74],iat1:[45,48,54,42,51,40],iat2:[50,52,55,46,53,44],att:[85,90,88,92,87,80],cgpa:8.9,rank:1},
  '312521205002':{name:'San',marks:[72,68,75,80,65,70],iat1:[40,38,44,46,36,39],iat2:[44,42,47,50,40,43],att:[78,82,75,88,80,72],cgpa:8.1,rank:3},
  '312521205003':{name:'Seema',marks:[85,79,88,83,90,77],iat1:[50,46,52,48,55,44],iat2:[53,49,55,51,57,47],att:[92,88,91,95,89,84],cgpa:9.1,rank:1},
  '312521205004':{name:'Aditya',marks:[65,70,68,72,60,66],iat1:[36,40,38,43,32,37],iat2:[40,44,42,47,36,41],att:[75,80,72,78,70,68],cgpa:7.8,rank:5},
  '312521205005':{name:'Iniya',marks:[80,84,77,86,82,79],iat1:[47,50,44,52,48,46],iat2:[51,53,48,55,51,50],att:[88,91,86,93,90,85],cgpa:8.7,rank:2},
  '312521205006':{name:'Hari',marks:[70,65,72,68,74,67],iat1:[41,37,43,39,44,38],iat2:[44,41,47,43,48,42],att:[80,74,82,77,83,72],cgpa:8.0,rank:4},
  '312521205007':{name:'Indhu',marks:[76,80,74,85,78,73],iat1:[44,47,43,50,46,42],iat2:[48,51,47,54,50,46],att:[84,88,82,90,86,80],cgpa:8.5,rank:3},
  '312521205008':{name:'Rahul',marks:[62,66,70,64,58,63],iat1:[34,38,41,36,30,35],iat2:[38,42,45,40,34,39],att:[72,76,80,70,68,74],cgpa:7.5,rank:6}
};
const LEADERBOARD = [
  {name:'Seema',cgpa:9.1,avg:83.7,rank:1},
  {name:'Sha',cgpa:8.9,avg:81.5,rank:2},
  {name:'Iniya',cgpa:8.7,avg:81.3,rank:3},
  {name:'Indhu',cgpa:8.5,avg:79.3,rank:4},
  {name:'San',cgpa:8.1,avg:71.7,rank:5}
];
const SEMESTER_TREND = {
  'Sha':[7.2,7.5,7.9,8.2,8.6,8.9],
  'San':[7.0,7.2,7.5,7.8,8.0,8.1],
  'Seema':[7.8,8.1,8.4,8.7,9.0,9.1],
  'Aditya':[6.5,6.8,7.1,7.4,7.6,7.8],
  'Iniya':[7.5,7.7,8.0,8.3,8.5,8.7],
  'Hari':[7.0,7.2,7.5,7.7,7.9,8.0],
  'Indhu':[7.3,7.6,7.9,8.1,8.3,8.5],
  'Rahul':[6.2,6.5,6.8,7.0,7.2,7.5]
};
const CHART_COLORS = ['#1e90ff','#00e5a0','#ff6b35','#a855f7','#f7c59f','#ff4d6d'];
let currentSection = 'dashboard', chartsInit = {}, currentStudent = null;

// ===== INIT =====
window.onload = () => {
  const reg = localStorage.getItem('loggedStudent');
  if (!reg || !STUDENTS_DB[reg]) { window.location.href = 'index.html'; return; }
  currentStudent = { reg, ...STUDENTS_DB[reg] };
  document.getElementById('welcomeText').textContent = `Welcome, ${currentStudent.name}!`;
  document.getElementById('sidebarName').textContent = currentStudent.name;
  document.getElementById('sidebarReg').textContent = reg;
  showSection('dashboard');
};

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

function logout() {
  if(confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('loggedStudent');
    window.location.href = 'index.html';
  }
}

function showSection(name) {
  document.querySelectorAll('.section-content').forEach(s => s.classList.add('hidden'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById(`sec-${name}`).classList.remove('hidden');
  document.querySelectorAll('.nav-item').forEach(n => { if(n.textContent.toLowerCase().includes(name.toLowerCase().slice(0,4))) n.classList.add('active'); });
  const titles = {dashboard:'📊 Dashboard',students:'👥 Students',classes:'📚 Classes',performance:'📈 Performance',attendance:'🗓️ Attendance Analytics',assessments:'📝 Assessments',reports:'📄 Reports',notifications:'🔔 Notifications',achievements:'🏆 Achievements',leaderboard:'🥇 Leaderboard'};
  document.getElementById('topbarTitle').textContent = titles[name] || name;
  currentSection = name;
  if (document.getElementById('sidebar').classList.contains('open')) toggleSidebar();
  if (!chartsInit[name]) { chartsInit[name] = true; setTimeout(() => renderSection(name), 50); }
}

function renderSection(name) {
  const s = currentStudent;
  if (name === 'dashboard') renderDashboard(s);
  else if (name === 'students') renderStudents(s);
  else if (name === 'classes') renderClasses(s);
  else if (name === 'performance') renderPerformance(s);
  else if (name === 'attendance') renderAttendance(s);
  else if (name === 'assessments') renderAssessments(s);
  else if (name === 'reports') renderReports(s);
  else if (name === 'notifications') renderNotifications(s);
  else if (name === 'achievements') renderAchievements(s);
  else if (name === 'leaderboard') renderLeaderboard();
}

function renderDashboard(s) {
  const avgScore = (s.marks.reduce((a,b)=>a+b,0)/s.marks.length).toFixed(1);
  const overallAtt = (s.att.reduce((a,b)=>a+b,0)/s.att.length).toFixed(1);
  const cards = [
    {label:'Current Semester',value:'VI',sub:'B.E. CSE',icon:'🎓',accent:'#1e90ff'},
    {label:'CGPA',value:s.cgpa,sub:'Out of 10.0',icon:'⭐',accent:'#00e5a0'},
    {label:'Attendance',value:overallAtt+'%',sub:'Overall',icon:'📅',accent:'#a855f7'},
    {label:'Avg Score',value:avgScore,sub:'All Subjects',icon:'📊',accent:'#ff6b35'},
    {label:'Dept Rank',value:'#'+s.rank,sub:'CSE Department',icon:'🏆',accent:'#f7c59f'}
  ];
  document.getElementById('dashCards').innerHTML = cards.map(c=>`
    <div class="stat-card" style="--card-accent:${c.accent}">
      <div class="stat-icon">${c.icon}</div>
      <div class="stat-label">${c.label}</div>
      <div class="stat-value counter-anim" data-val="${c.value}">${c.value}</div>
      <div class="stat-sub">${c.sub}</div>
    </div>`).join('');
}

function renderStudents(s) {
  const allS = Object.entries(STUDENTS_DB).map(([r,d])=>({...d,reg:r,avg:(d.marks.reduce((a,b)=>a+b,0)/d.marks.length).toFixed(1)})).sort((a,b)=>b.cgpa-a.cgpa);
  document.querySelector('#studentsTable tbody').innerHTML = allS.map((st,i)=>`
    <tr class="${st.name===s.name?'rank-1':''}">
      <td><span class="badge ${i===0?'badge-green':i<3?'badge-blue':'badge-orange'}">#${i+1}</span></td>
      <td style="font-weight:700">${st.name} ${st.name===s.name?'<span class="badge badge-green">You</span>':''}</td>
      <td>${st.avg}</td>
      <td style="color:var(--accent2);font-family:Orbitron,sans-serif">${st.cgpa}</td>
      <td><span class="badge ${st.cgpa>=8.5?'badge-green':st.cgpa>=8.0?'badge-blue':'badge-orange'}">${st.cgpa>=8.5?'Excellent':st.cgpa>=8.0?'Good':'Average'}</span></td>
    </tr>`).join('');
}

function renderClasses(s) {
  const rows = SUBJECTS.map((sub,i)=>{
    const att=s.att[i],total=60,notAtt=total-Math.round(total*att/100),attended=Math.round(total*att/100);
    return `<tr><td>${sub}</td><td style="color:var(--accent2)">${attended}</td><td>${total}</td><td style="color:#e74c3c">${notAtt}</td>
      <td><div style="display:flex;align-items:center;gap:8px"><div class="progress-bar" style="flex:1;height:6px"><div class="progress-fill" style="width:${att}%;background:${att>=75?'var(--accent2)':'#e74c3c'}"></div></div><span style="min-width:40px;font-size:0.8rem">${att}%</span></div></td>
      <td><span class="badge ${att>=75?'badge-green':'badge-orange'}">${att>=75?'✅ OK':'⚠️ Low'}</span></td></tr>`;
  }).join('');
  document.querySelector('#classesTable tbody').innerHTML = rows;
  if (!chartsInit['classesChart']) {
    chartsInit['classesChart'] = true;
    new Chart(document.getElementById('attendanceOverallChart'), {
      type:'bar', data:{labels:SUBJECTS,datasets:[{label:'Attendance %',data:s.att,backgroundColor:SUBJECTS.map((_,i)=>CHART_COLORS[i]+'cc'),borderColor:CHART_COLORS,borderWidth:2,borderRadius:8}]},
      options:{...chartOpts(), scales:{y:{beginAtZero:true,max:100,grid:{color:'rgba(100,160,255,0.08)'},ticks:{color:'#8ba4d4'}},x:{grid:{color:'rgba(100,160,255,0.06)'},ticks:{color:'#8ba4d4'}}}}
    });
  }
}

function renderPerformance(s) {
  new Chart(document.getElementById('subjectMarksChart'), {
    type:'bar', data:{labels:SUBJECTS,datasets:[{label:'Marks (out of 100)',data:s.marks,backgroundColor:CHART_COLORS.map(c=>c+'bb'),borderColor:CHART_COLORS,borderWidth:2,borderRadius:10}]},
    options:{...chartOpts(),scales:{y:{beginAtZero:true,max:100,grid:{color:'rgba(100,160,255,0.08)'},ticks:{color:'#8ba4d4'}},x:{grid:{display:false},ticks:{color:'#8ba4d4'}}}}
  });
  new Chart(document.getElementById('trendChart'), {
    type:'line', data:{labels:['Sem 1','Sem 2','Sem 3','Sem 4','Sem 5','Sem 6'],datasets:[{label:'CGPA Trend',data:SEMESTER_TREND[s.name],borderColor:'#00e5a0',backgroundColor:'rgba(0,229,160,0.1)',borderWidth:3,pointBackgroundColor:'#00e5a0',pointRadius:6,tension:0.4,fill:true}]},
    options:{...chartOpts(),scales:{y:{min:6,max:10,grid:{color:'rgba(100,160,255,0.08)'},ticks:{color:'#8ba4d4'}},x:{grid:{color:'rgba(100,160,255,0.05)'},ticks:{color:'#8ba4d4'}}}}
  });
}

function renderAttendance(s) {
  const total=360,present=s.att.reduce((sum,a)=>sum+Math.round(60*a/100),0),absent=total-present-12-6;
  document.getElementById('smartGrid').innerHTML = `
    <div class="smart-card smart-present"><div class="sc-num">${present}</div><div class="sc-label">✅ Present</div></div>
    <div class="smart-card smart-absent"><div class="sc-num">${absent}</div><div class="sc-label">❌ Absent</div></div>
    <div class="smart-card smart-od"><div class="sc-num">12</div><div class="sc-label">📋 OD</div></div>
    <div class="smart-card smart-leave"><div class="sc-num">6</div><div class="sc-label">🏖️ Leave</div></div>
    <div class="smart-card smart-total"><div class="sc-num">${total}</div><div class="sc-label">📆 Total Days</div></div>`;
  const health = Math.round((present/total)*100*0.7 + parseFloat((s.marks.reduce((a,b)=>a+b,0)/s.marks.length/100)*30));
  document.getElementById('healthScore').textContent = health + '/100';
  new Chart(document.getElementById('healthChart'), {
    type:'doughnut', data:{labels:['Health','Remaining'],datasets:[{data:[health,100-health],backgroundColor:['#00e5a0','rgba(30,144,255,0.1)'],borderWidth:0}]},
    options:{cutout:'75%',plugins:{legend:{display:false},tooltip:{enabled:false}}}
  });
  new Chart(document.getElementById('monthlyAttChart'), {
    type:'line', data:{labels:['Jul','Aug','Sep','Oct','Nov','Dec'],datasets:[{label:'Attendance %',data:s.att.map((a,i)=>Math.max(65,a+[-3,2,-1,4,-2,1][i])),borderColor:'#a855f7',backgroundColor:'rgba(168,85,247,0.1)',borderWidth:3,fill:true,tension:0.4,pointBackgroundColor:'#a855f7',pointRadius:5}]},
    options:{...chartOpts(),scales:{y:{min:60,max:100,grid:{color:'rgba(100,160,255,0.08)'},ticks:{color:'#8ba4d4'}},x:{grid:{display:false},ticks:{color:'#8ba4d4'}}}}
  });
}

function renderAssessments(s) {
  const rows = SUBJECTS.map((sub,i)=>{
    const i1=s.iat1[i],i2=s.iat2[i],conv1=Math.round(i1*40/60),conv2=Math.round(i2*40/60),best=Math.max(conv1,conv2);
    return `<tr><td style="font-weight:700">${sub}</td><td>${i1}/60</td><td style="color:var(--accent)">${conv1}/40</td><td>${i2}/60</td><td style="color:var(--accent2)">${conv2}/40</td><td style="color:var(--accent3);font-family:Orbitron,sans-serif">${best}/40</td></tr>`;
  }).join('');
  document.querySelector('#iatTable tbody').innerHTML = rows;
  new Chart(document.getElementById('iatChart'), {
    type:'bar', data:{labels:SUBJECTS,datasets:[
      {label:'IAT 1 /60',data:s.iat1,backgroundColor:'rgba(30,144,255,0.7)',borderColor:'#1e90ff',borderWidth:2,borderRadius:6},
      {label:'IAT 2 /60',data:s.iat2,backgroundColor:'rgba(0,229,160,0.7)',borderColor:'#00e5a0',borderWidth:2,borderRadius:6}
    ]},
    options:{...chartOpts(),scales:{y:{beginAtZero:true,max:60,grid:{color:'rgba(100,160,255,0.08)'},ticks:{color:'#8ba4d4'}},x:{grid:{display:false},ticks:{color:'#8ba4d4'}}}}
  });
}

function renderReports(s) {
  const avg=(s.marks.reduce((a,b)=>a+b,0)/s.marks.length).toFixed(1);
  const attAvg=(s.att.reduce((a,b)=>a+b,0)/s.att.length).toFixed(1);
  document.getElementById('reportBody').innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px">
      <div style="padding:16px;background:rgba(30,144,255,0.08);border-radius:12px;border:1px solid var(--border)">
        <div style="color:var(--text2);font-size:0.75rem;letter-spacing:1px;margin-bottom:12px">STUDENT INFORMATION</div>
        <div style="margin-bottom:8px"><span style="color:var(--text2)">Name:</span> <strong>${s.name}</strong></div>
        <div style="margin-bottom:8px"><span style="color:var(--text2)">Reg No:</span> <strong>${s.reg}</strong></div>
        <div style="margin-bottom:8px"><span style="color:var(--text2)">Department:</span> <strong>B.E. CSE</strong></div>
        <div><span style="color:var(--text2)">Semester:</span> <strong>VI</strong></div>
      </div>
      <div style="padding:16px;background:rgba(0,229,160,0.08);border-radius:12px;border:1px solid var(--border)">
        <div style="color:var(--text2);font-size:0.75rem;letter-spacing:1px;margin-bottom:12px">ACADEMIC SUMMARY</div>
        <div style="margin-bottom:8px"><span style="color:var(--text2)">CGPA:</span> <strong style="color:var(--accent2)">${s.cgpa} / 10.0</strong></div>
        <div style="margin-bottom:8px"><span style="color:var(--text2)">Avg Score:</span> <strong>${avg} / 100</strong></div>
        <div style="margin-bottom:8px"><span style="color:var(--text2)">Attendance:</span> <strong>${attAvg}%</strong></div>
        <div><span style="color:var(--text2)">Dept Rank:</span> <strong style="color:var(--accent3)">#${s.rank}</strong></div>
      </div>
    </div>
    <div style="margin-bottom:16px"><div style="font-family:Orbitron,sans-serif;font-size:0.8rem;color:var(--accent);margin-bottom:10px">SUBJECT-WISE PERFORMANCE</div>
    ${SUBJECTS.map((sub,i)=>`<div class="progress-item"><div class="progress-label"><span>${sub}</span><span>${s.marks[i]}/100</span></div><div class="progress-bar"><div class="progress-fill" style="width:${s.marks[i]}%"></div></div></div>`).join('')}</div>
    <div style="padding:14px;background:rgba(168,85,247,0.08);border-radius:12px;border:1px solid rgba(168,85,247,0.2)"><strong style="color:var(--accent4)">📋 Remarks:</strong><span style="color:var(--text2);margin-left:8px">${s.cgpa>=9?'Outstanding performance. Keep up the excellent work!':s.cgpa>=8.5?'Very good academic performance. Consistent and dedicated.':s.cgpa>=8?'Good performance. Maintain focus and improve weak subjects.':'Average performance. Needs improvement in multiple subjects.'}</span></div>`;
}

function renderNotifications(s) {
  const aiPreds = [
    {title:'📈 Performance Prediction',body:`Based on your trend, CGPA is projected to reach ${(parseFloat(s.cgpa)+0.1).toFixed(1)} next semester with consistent study.`,type:'ai'},
    {title:'⚠️ Attendance Alert',body:`Your OS attendance (${s.att[0]}%) may affect exam eligibility. Attend ${s.att[0]<75?'more classes':'steadily'}.`,type:s.att[0]<75?'alert':'ai'},
    {title:'🔮 Subject Strength',body:`AIML is your predicted strongest subject. Consider pursuing research or projects in this domain.`,type:'ai'},
    {title:'📊 Rank Forecast',body:`Maintaining current scores, you can achieve Rank #${Math.max(1,s.rank-1)} by end of semester.`,type:'ai'},
    {title:'🎯 Goal Suggestion',body:`Target 85+ in Algorithms to boost your CGPA above ${(parseFloat(s.cgpa)+0.2).toFixed(1)}.`,type:'ai'}
  ];
  const smartAlerts = [
    {title:'⚡ IAT 2 Upcoming',body:'IAT 2 exams scheduled in 2 weeks. Review DS, OS, and AIML topics.',type:'alert'},
    {title:'📅 Assignment Deadline',body:'DBMS lab record submission due this Friday. Ensure completion.',type:'alert'},
    {title:'✅ Attendance Goal Met',body:`You've maintained above 75% in ${s.att.filter(a=>a>=75).length}/6 subjects. Great!`,type:'success'},
    {title:'🏆 Top Performer Alert',body:`You are ranked #${s.rank} in department. Keep performing!`,type:s.rank<=3?'success':'alert'},
    {title:'📚 Revision Reminder',body:'Semester exams in 6 weeks. Create a revision timetable now.',type:'alert'}
  ];
  document.getElementById('aiNotifs').innerHTML = aiPreds.map(n=>`<div class="notif-item ${n.type}"><div class="notif-title">${n.title}</div><div class="notif-body">${n.body}</div></div>`).join('');
  document.getElementById('smartAlerts').innerHTML = smartAlerts.map(n=>`<div class="notif-item ${n.type}"><div class="notif-title">${n.title}</div><div class="notif-body">${n.body}</div></div>`).join('');
}

function renderAchievements(s) {
  const avg = s.marks.reduce((a,b)=>a+b,0)/s.marks.length;
  const badges = [
    {icon:'🏅',name:'Top Scorer',sub:'90+ avg score',earned:avg>=85},
    {icon:'📖',name:'Bookworm',sub:'Consistent high marks',earned:s.marks.filter(m=>m>=75).length>=5},
    {icon:'🎯',name:'Consistent',sub:'No drops in scores',earned:Math.max(...s.marks)-Math.min(...s.marks)<25},
    {icon:'💎',name:'Perfectionist',sub:'CGPA above 8.5',earned:s.cgpa>=8.5},
    {icon:'⭐',name:'Star Student',sub:'Dept Rank Top 3',earned:s.rank<=3},
    {icon:'🎓',name:'Scholar',sub:'CGPA above 9.0',earned:s.cgpa>=9.0},
    {icon:'💻',name:'Hackathon Win',sub:'Participated & Won',earned:['Sha','Seema','Iniya'].includes(s.name)}
  ];
  const eca = [
    {icon:'🌱',name:'NSS',sub:'National Service',earned:['Sha','San','Indhu','Iniya'].includes(s.name)},
    {icon:'📢',name:'English-LDS',sub:'Language Dev Society',earned:['Sha','Seema','Rahul'].includes(s.name)},
    {icon:'👨‍💻',name:'Code Club',sub:'Programming Society',earned:['Sha','Aditya','Hari','Seema'].includes(s.name)},
    {icon:'⚽',name:'Sports',sub:'Inter-dept Competitions',earned:['San','Hari','Rahul','Iniya'].includes(s.name)}
  ];
  document.getElementById('achievGrid').innerHTML = badges.map(b=>`
    <div class="achiev-card ${b.earned?'earned':'not-earned'}">
      <span class="a-icon">${b.icon}</span>
      <div class="a-name">${b.name}</div>
      <div class="a-sub">${b.earned?'✅ Earned':'🔒 '+b.sub}</div>
    </div>`).join('');
  document.getElementById('ecaGrid').innerHTML = eca.map(e=>`
    <div class="achiev-card ${e.earned?'earned':'not-earned'}">
      <span class="a-icon">${e.icon}</span>
      <div class="a-name">${e.name}</div>
      <div class="a-sub">${e.earned?'✅ Active Member':'Not Enrolled'}</div>
    </div>`).join('');
}

function renderLeaderboard() {
  const medals = ['🥇','🥈','🥉','4️⃣','5️⃣'];
  document.getElementById('lbList').innerHTML = LEADERBOARD.map((st,i)=>`
    <div class="leaderboard-item" style="animation-delay:${i*0.1}s">
      <div class="lb-rank">${medals[i]}</div>
      <div class="lb-info">
        <div class="lb-name">${st.name} ${st.name===currentStudent.name?'<span class="badge badge-green">You</span>':''}</div>
        <div class="lb-score">Avg Score: ${st.avg} | B.E. CSE - Sem VI</div>
      </div>
      <div class="lb-cgpa">${st.cgpa}</div>
    </div>`).join('');
  new Chart(document.getElementById('lbChart'), {
    type:'bar', data:{labels:LEADERBOARD.map(s=>s.name),datasets:[{label:'CGPA',data:LEADERBOARD.map(s=>s.cgpa),backgroundColor:['#ffd700bb','#c0c0c0bb','#cd7f32bb','rgba(30,144,255,0.6)','rgba(168,85,247,0.6)'],borderColor:['#ffd700','#c0c0c0','#cd7f32','#1e90ff','#a855f7'],borderWidth:2,borderRadius:10}]},
    options:{...chartOpts(),scales:{y:{min:7,max:10,grid:{color:'rgba(100,160,255,0.08)'},ticks:{color:'#8ba4d4'}},x:{grid:{display:false},ticks:{color:'#8ba4d4'}}}}
  });
}

function chartOpts() {
  return {responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{color:'#8ba4d4',font:{family:'Exo 2'}}},tooltip:{backgroundColor:'rgba(20,35,70,0.95)',borderColor:'rgba(100,160,255,0.3)',borderWidth:1,titleColor:'#e8f0ff',bodyColor:'#8ba4d4'}}};
}

function exportPDF() {
  const s = currentStudent;
  const w = window.open('','_blank');
  const avg=(s.marks.reduce((a,b)=>a+b,0)/s.marks.length).toFixed(1);
  const attAvg=(s.att.reduce((a,b)=>a+b,0)/s.att.length).toFixed(1);
  w.document.write(`<html><head><title>Academic Report - ${s.name}</title><style>body{font-family:Arial;padding:30px;color:#222}h1{color:#1e3a6e;border-bottom:2px solid #1e90ff;padding-bottom:10px}table{width:100%;border-collapse:collapse;margin:16px 0}th{background:#1e3a6e;color:#fff;padding:10px}td{padding:9px;border:1px solid #ddd}.header{display:flex;justify-content:space-between}.info-box{background:#f0f4ff;padding:14px;border-radius:8px;margin:10px 0}.footer{margin-top:30px;text-align:center;color:#666;font-size:12px}</style></head><body>
  <h1>🎓 Anna University - Academic Report</h1>
  <div class="header"><div class="info-box"><b>Name:</b> ${s.name}<br><b>Reg No:</b> ${s.reg}<br><b>Dept:</b> B.E. CSE | Sem VI</div><div class="info-box"><b>CGPA:</b> ${s.cgpa}/10<br><b>Avg Score:</b> ${avg}/100<br><b>Attendance:</b> ${attAvg}% | <b>Rank:</b> #${s.rank}</div></div>
  <h3>Subject-wise Marks</h3><table><tr><th>Subject</th><th>Marks</th><th>IAT 1</th><th>IAT 2</th><th>Attendance</th></tr>${SUBJECTS.map((sub,i)=>`<tr><td>${sub}</td><td>${s.marks[i]}/100</td><td>${s.iat1[i]}/60</td><td>${s.iat2[i]}/60</td><td>${s.att[i]}%</td></tr>`).join('')}</table>
  <div class="footer">Developed by CSE Department | Powered by JavaScript Analytics Engine<br>Anna University, Chennai - Generated ${new Date().toLocaleDateString()}</div>
  </body></html>`);
  w.document.close(); setTimeout(()=>w.print(),500);
}
