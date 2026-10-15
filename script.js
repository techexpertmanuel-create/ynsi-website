/* YNSI static starter. The local admin editor is a demonstration only. Do not use it to store real member data. */
const WHATSAPP = "233550564384";
const STORAGE_KEY = "ynsi_demo_opportunities_v1";
const starterOpportunities = [
  {id:"sample-1",type:"job",title:"Example: Entry-level customer support role",org:"Replace with verified employer",location:"Africa / Remote",deadline:"Verify deadline",description:"Illustrative listing only. Replace this card with a verified opportunity and an official application link.",url:"https://example.com"},
  {id:"sample-2",type:"scholarship",title:"Example: Undergraduate scholarship notice",org:"Replace with official scholarship provider",location:"Check eligibility",deadline:"Verify deadline",description:"Illustrative listing only. Confirm eligibility, funding details and deadline with the official provider.",url:"https://example.com"},
  {id:"sample-3",type:"internship",title:"Example: Graduate internship programme",org:"Replace with verified organization",location:"Africa / Hybrid",deadline:"Verify deadline",description:"Illustrative listing only. Add the official programme details and application instructions before publishing.",url:"https://example.com"}
];
let activeFilter = "all";
let toastTimer;
const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
function toast(message){const node=$("#toast");node.textContent=message;node.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>node.classList.remove("show"),3500);}
function getOpportunities(){try{const saved=localStorage.getItem(STORAGE_KEY);return saved?JSON.parse(saved):starterOpportunities;}catch{return starterOpportunities;}}
function saveOpportunities(items){localStorage.setItem(STORAGE_KEY,JSON.stringify(items));}
function safeText(value){return String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function renderOpportunities(){
  const query=($("#opportunitySearch")?.value||"").trim().toLowerCase();
  const items=getOpportunities().filter(item=>(activeFilter==="all"||item.type===activeFilter)&&[item.title,item.org,item.location,item.description].join(" ").toLowerCase().includes(query));
  const root=$("#opportunityList");
  if(!items.length){root.innerHTML='<div class="empty-result">No matching opportunities. Try another search.</div>';return;}
  root.innerHTML=items.map(item=>`<article class="opportunity-card"><div class="card-topline"><span class="type-tag ${safeText(item.type)}">${safeText(item.type)}</span><span class="deadline">${safeText(item.deadline||"Check details")}</span></div><h3>${safeText(item.title)}</h3><p>${safeText(item.description)}</p><div class="card-footer"><span>${safeText(item.location||item.org||"See details")}</span><a href="${safeText(validUrl(item.url))}" target="_blank" rel="noopener">View details ↗</a></div></article>`).join("");
}
function validUrl(url){try{const parsed=new URL(url);return ["https:","http:"].includes(parsed.protocol)?parsed.href:"#contact";}catch{return "#contact";}}
function openDialog(id){const dialog=$("#"+id);if(dialog?.showModal)dialog.showModal();else toast("Your browser does not support this form. Please update your browser.");}
function closeDialog(dialog){dialog?.close();}
function formObject(form){return Object.fromEntries(new FormData(form).entries());}
function sendWhatsApp(message){window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`,"_blank","noopener,noreferrer");}
function openMembership(plan){const form=$("#membershipForm");form.reset();form.elements.plan.value=plan;$("#membershipTitle").textContent=plan==="Free"?"Apply for free membership":"Enquire about supporting membership";openDialog("membershipDialog");}
function openTraining(course){const form=$("#trainingForm");form.reset();form.elements.course.value=course;$("#trainingDescription").textContent=`Register interest in: ${course}. YNSI will confirm programme dates and availability.`;openDialog("trainingDialog");}
function renderAdminPanel(){
  const panel=$("#adminPanel");
  panel.hidden=false;
  $("#adminLoginForm").hidden=true;
  const items=getOpportunities();
  panel.innerHTML=`<button type="button" class="modal-close" id="adminLogout">×</button><span class="eyebrow">BROWSER-ONLY CONTENT EDITOR</span><h2>Opportunity editor</h2><p>This preview saves listings in this browser's local storage only. It is not connected to a secure shared database and changes will not appear on other devices.</p>
    <form id="adminOpportunityForm" class="admin-tools"><div class="admin-grid">
      <label>Type<select name="type"><option value="job">Job</option><option value="scholarship">Scholarship</option><option value="internship">Internship</option></select></label>
      <label>Deadline / status<input name="deadline" required maxlength="80" placeholder="e.g. 30 Nov 2026"></label>
      <label class="wide">Opportunity title<input name="title" required maxlength="160"></label>
      <label>Organization<input name="org" required maxlength="140"></label><label>Location<input name="location" required maxlength="100"></label>
      <label class="wide">Description<textarea name="description" required maxlength="600"></textarea></label>
      <label class="wide">Official details URL<input name="url" type="url" required placeholder="https://..."></label>
      </div><button class="button button-red" type="submit">Save listing</button></form>
      <h3 style="margin-top:25px">Saved listings (${items.length})</h3><div class="admin-list">${items.map(item=>`<div class="admin-item"><b>${safeText(item.title)}</b><br><small>${safeText(item.type)} · ${safeText(item.location)}</small><br><button type="button" class="button button-outline-dark" data-delete="${safeText(item.id)}">Delete listing</button></div>`).join("")}</div>
      <button type="button" class="button button-outline-dark" id="resetDemo">Reset sample data</button>
      <p class="form-hint">Before launch, replace this with server-side authentication, a database, role permissions, audit logs and backups.</p>`;
  $("#adminLogout").addEventListener("click",()=>{panel.hidden=true;$("#adminLoginForm").hidden=false;closeDialog($("#adminDialog"));});
  $("#adminOpportunityForm").addEventListener("submit",e=>{e.preventDefault();const data=formObject(e.currentTarget);if(!/^https?:\/\//i.test(data.url)){toast("Enter a valid http or https URL.");return;}const list=getOpportunities();list.unshift({...data,id:"ynsi-"+Date.now()});saveOpportunities(list);renderOpportunities();renderAdminPanel();toast("Saved in this browser only.");});
  $$("[data-delete]",panel).forEach(button=>button.addEventListener("click",()=>{saveOpportunities(getOpportunities().filter(item=>item.id!==button.dataset.delete));renderOpportunities();renderAdminPanel();toast("Listing deleted from this browser.");}));
  $("#resetDemo").addEventListener("click",()=>{saveOpportunities(starterOpportunities);renderOpportunities();renderAdminPanel();toast("Sample listings restored.");});
}
$("#year").textContent=new Date().getFullYear();
renderOpportunities();
$("#opportunitySearch").addEventListener("input",renderOpportunities);
$$(".filter").forEach(button=>button.addEventListener("click",()=>{activeFilter=button.dataset.filter;$$(".filter").forEach(b=>b.classList.toggle("active",b===button));renderOpportunities();}));
$("#menuToggle").addEventListener("click",()=>{const nav=$("#mainNav");const open=nav.classList.toggle("open");$("#menuToggle").setAttribute("aria-expanded",String(open));});
$$('#mainNav a').forEach(a=>a.addEventListener("click",()=>{$("#mainNav").classList.remove("open");$("#menuToggle").setAttribute("aria-expanded","false");}));
$$(".join-button").forEach(button=>button.addEventListener("click",()=>openMembership(button.dataset.plan)));
$$(".register-training").forEach(button=>button.addEventListener("click",()=>openTraining(button.dataset.course)));
$$("[data-close]").forEach(button=>button.addEventListener("click",()=>closeDialog(button.closest("dialog"))));
$("#membershipForm").addEventListener("submit",e=>{e.preventDefault();const d=formObject(e.currentTarget);const consent=e.currentTarget.elements.directoryConsent.checked?"Yes, I consent to be considered for an approved public directory profile.":"No public directory consent.";const plan=d.plan==="Supporting"?"Supporting member (please confirm benefits and fees)":"Free member";const message=`YNSI MEMBERSHIP REQUEST\nPlan: ${plan}\nName: ${d.name}\nEmail: ${d.email}\nPhone: ${d.phone}\nCountry: ${d.country}\nSkills/interests: ${d.interests||"Not specified"}\nDirectory consent: ${consent}\n\nPlease confirm next steps.`;closeDialog($("#membershipDialog"));sendWhatsApp(message);toast("WhatsApp opened with your request. Review and send it there.");});
$("#trainingForm").addEventListener("submit",e=>{e.preventDefault();const d=formObject(e.currentTarget);const message=`YNSI TRAINING INTEREST\nProgramme: ${d.course}\nName: ${d.name}\nContact: ${d.contact}\nCountry: ${d.country}\nLearning goals: ${d.goals||"Not specified"}\n\nPlease share dates and registration details.`;closeDialog($("#trainingDialog"));sendWhatsApp(message);toast("WhatsApp opened with your training request.");});
$("#contactForm").addEventListener("submit",e=>{e.preventDefault();const d=formObject(e.currentTarget);sendWhatsApp(`YNSI WEBSITE ENQUIRY\nName: ${d.name}\nContact: ${d.contact}\nType: ${d.type}\nMessage: ${d.message}`);toast("WhatsApp opened with your enquiry. Review and send it there.");});
$("#donateButton").addEventListener("click",()=>{sendWhatsApp("Hello YNSI, I would like information about donations, sponsorship and supporting youth programmes.");toast("WhatsApp opened with your sponsorship enquiry.");});
$("#adminShortcut").addEventListener("click",()=>openDialog("adminDialog"));
$("#adminLoginForm").addEventListener("submit",e=>{e.preventDefault();if(e.currentTarget.elements.password.value!=="ynsi-demo"){toast("Incorrect demo passphrase.");return;}renderAdminPanel();});
