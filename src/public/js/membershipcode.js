// * Site Languages :
var siteLang,
  aq_lang = localStorage.getItem("aq-apps-language"),
  en = {
    titleCard: "Watan Membership Codes:",
    descCard:
      "Get your membership code now for free for the first year and increase your profits and customers",
    Create: "Create",
    Delete: "Delete",
    Renew: "Renew",
    agent_email_label: "Agent email :",
    agent_businessName_label: "Agent business name :",
    agent_language_select_label: "Choose the message language :",
    agent_language_select_option_1: "English",
    agent_language_select_option_2: "Arabic",
    agent_language_select_option_3: "Kurdish",
    agent_language_select_option_4: "Turkish",
    agent_membership_label: "Agent Membership code :",
    agent_renew_label: "Renew Duration (/year) :",
    agent_submit_btn: "Submit",
    agent_createSuccess:
      "(When you order for the first time, you will get a free membership code for one year)",
    agent_deleteWarning:
      "(Warning: Deleting the current membership code means deleting your work data records on the application. Please make sure before doing this process)",
    agent_createInfo:
      "(The cost of renewing for one year is $100, but if you renew for two years you will get a 25% discount, meaning the cost becomes $150 for two years)",

    Change_site_language: "Change site language",
  },
  ar = {
    titleCard: "رموز عضوية وطن:",
    descCard: "احصل الآن على رمز عضويتك مجاناً للسنة الأولى وزد أرباحك وعملائك",
    Create: "انشاء",
    Delete: "حذف",
    Renew: "تجديد",
    agent_email_label: "أيميل الوكيل :",
    agent_businessName_label: "اسم عمل الوكيل :",
    agent_language_select_label: "أختر لغة الرسالة :",
    agent_language_select_option_1: "الأنكليزية",
    agent_language_select_option_2: "العربية",
    agent_language_select_option_3: "الكردية",
    agent_language_select_option_4: "التركية",
    agent_membership_label: "رمز عضوية الوكيل :",
    agent_renew_label: "مدة التجديد (/سنة) :",
    agent_submit_btn: "أرسال",
    agent_createSuccess:
      "(عند الطلب لأول مرة سوف تحصل على رمز العضوية مجاناً لمدة سنة)",
    agent_deleteWarning:
      "( تحذير : حذفك لكود العضوية الحالي يعني حذف سجلات بيانات عملك على تطبيق يرجى التأكد قبل القيام بهذه العملية)",
    agent_createInfo:
      "(تكلفة التجديد لمدة سنة هي 100 دولار، ولكن إذا جددت لمدة عامين ستحصل على خصم 25%، أي أن التكلفة تصبح 150 دولار لمدة عامين)",
    Change_site_language: "تغيير لغة الموقع",
  },
  trKeyList = Object.keys(en);
if (aq_lang == null) {
  aq_lang = localStorage.setItem("aq-apps-language", "en");
  siteLang = en;
} else {
  if (aq_lang == "ar") {
    document.body.dir = "rtl";
    siteLang = ar;
  } else {
    siteLang = en;
  }
}
trKeyList.forEach((className, index) => {
  var elements = document.querySelectorAll("." + className);
  elements.forEach((el) => {
    el.innerText = siteLang[className];
  });
});

// * Variables :
var formMC = document.querySelector("#formMC"),
  formData = document.querySelectorAll(".data"),
  formDeleteMC = document.querySelector("#formDeleteMC"),
  formRenewMC = document.querySelector("#formRenewMC"),
  formRenewMCData = document.querySelectorAll(".renewdata"),
  formDeleteMCData = document.querySelectorAll(".deldata"),
  send_progress = document.querySelector("#send-progress"),
  links = document.querySelectorAll(".nav-link"),
  site_lang_select = document.querySelector("#site-lang"),
  sections = document.querySelectorAll(".nav-section");

// * Classes :
class Nav {
  constructor(links, sections) {
    this.launchNav(links, sections);
    this.enableNav(links, sections);
  }
  linksOff(links) {
    links.forEach((link) => {
      link.classList.add("text-white");
    });
  }
  sectionsOff(sections) {
    sections.forEach((section) => {
      section.classList.add("d-none");
    });
  }
  enableNav(links, sections) {
    links.forEach((link, index) => {
      link.addEventListener("click", () => {
        this.linksOff(links);
        links[index].classList.remove("text-white");
        this.sectionsOff(sections);
        sections[index].classList.remove("d-none");
      });
    });
  }
  launchNav(links, sections) {
    this.sectionsOff(sections);
    sections[0].classList.remove("d-none");
    this.linksOff(links);
    links[0].classList.remove("text-white");
  }
}

// * Functions :
function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
}

// * Events :
window.addEventListener("load", () => {
  send_progress.style.transitionDuration = "3s";
  send_progress.parentElement.style.transitionDuration = "1.5s";
  new Nav(links, sections);
});
formMC.addEventListener("submit", (e) => {
  e.preventDefault();
  send_progress.parentElement.style.display = "block";
  send_progress.parentElement.style.opacity = "1";
  setTimeout(() => {
    send_progress.style.width = "100%";
  }, 200);
  var res,
    data,
    headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body = {
      email: formData[0].value,
      businessName: formData[1].value,
      language: formData[2].value,
    };
  setTimeout(async () => {
    res = await fetch("/app/mc/create", {
      headers,
      method: "POST",
      body: JSON.stringify(body),
    });
    data = await res.json();
    var alert = document.querySelector(".msgData"),
      decoded = parseJwt(data.token);
    console.log(decoded);
    if (decoded.success) {
      alert.classList.remove("alert-danger");
      alert.classList.add("alert-success");
    } else {
      alert.classList.remove("alert-success");
      alert.classList.add("alert-danger");
    }
    alert.innerHTML = decoded.msg;
    send_progress.parentElement.style.opacity = "0";
    setTimeout(() => {
      send_progress.parentElement.style.display = "none";
      send_progress.style.width = "0%";
      alert.classList.remove("d-none");
    }, 500);
  }, 2500);
});
console.log(formRenewMCData);
formRenewMC.addEventListener("submit", (e) => {
  e.preventDefault();
  send_progress.parentElement.style.display = "block";
  send_progress.parentElement.style.opacity = "1";
  setTimeout(() => {
    send_progress.style.width = "100%";
  }, 200);
  var res,
    data,
    headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body = {
      email: formRenewMCData[0].value,
      MC: formRenewMCData[1].value,
      duration: formRenewMCData[2].value,
      language: formRenewMCData[3].value,
    };
  setTimeout(async () => {
    res = await fetch("/app/mc/renew", {
      headers,
      method: "POST",
      body: JSON.stringify(body),
    });
    data = await res.json();
    var alert = document.querySelector(".msgData"),
      decoded = parseJwt(data.token);
    console.log(decoded);
    if (decoded.success) {
      alert.classList.remove("alert-danger");
      alert.classList.add("alert-success");
    } else {
      alert.classList.remove("alert-success");
      alert.classList.add("alert-danger");
    }
    alert.innerHTML = decoded.msg;
    send_progress.parentElement.style.opacity = "0";
    setTimeout(() => {
      send_progress.parentElement.style.display = "none";
      send_progress.style.width = "0%";
      alert.classList.remove("d-none");
    }, 500);
  }, 2500);
});
formDeleteMC.addEventListener("submit", (e) => {
  e.preventDefault();
  send_progress.parentElement.style.display = "block";
  send_progress.parentElement.style.opacity = "1";
  setTimeout(() => {
    send_progress.style.width = "100%";
  }, 200);
  var res,
    data,
    headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body = {
      email: formDeleteMCData[0].value,
      MC: formDeleteMCData[1].value,
      businessName: formDeleteMCData[2].value,
      language: formDeleteMCData[3].value,
    };
  setTimeout(async () => {
    res = await fetch("/app/mc/delete", {
      headers,
      method: "POST",
      body: JSON.stringify(body),
    });
    data = await res.json();
    var alert = document.querySelector(".msgData"),
      decoded = parseJwt(data);
    console.log(data);
    if (decoded.success) {
      alert.classList.remove("alert-danger");
      alert.classList.add("alert-success");
    } else {
      alert.classList.remove("alert-success");
      alert.classList.add("alert-danger");
    }
    alert.innerHTML = decoded.msg;
    send_progress.parentElement.style.opacity = "0";
    setTimeout(() => {
      alert.classList.remove("d-none");
      send_progress.parentElement.style.display = "none";
      send_progress.style.width = "0%";
    }, 500);
  }, 2500);
});
site_lang_select.addEventListener("change", () => {
  if (site_lang_select.value != "not") {
    console.log(site_lang_select.value);
    aq_lang = localStorage.setItem("aq-apps-language", site_lang_select.value);
    window.location.reload();
  }
});
