var testModel = [
  {
    MC: "1",
    agent_id: "11",
    email: "a@a.com",
    name: "alaa",
    expireIn: {
      y: 2023,
      m: 12,
      d: 22,
    }
  },
  {
    MC: "2",
    agent_id: "12",
    email: "b@b.com",
    name: "ali",
    expireIn: {
      y: 2023,
      m: 12,
      d: 22,
    }
  },
  {
    MC: "3",
    agent_id: "13",
    email: "c@c.com",
    name: "qutfa",
    expireIn: {
      y: 2023,
      m: 12,
      d: 22,
    }
  },
  {
    MC: "1",
    agent_id: "11",
    email: "a@a.com",
    name: "alaa",
    expireIn: {
      y: 2023,
      m: 12,
      d: 22,
    }
  },
  {
    MC: "2",
    agent_id: "12",
    email: "b@b.com",
    name: "ali",
    expireIn: {
      y: 2023,
      m: 12,
      d: 22,
    }
  },
  {
    MC: "3",
    agent_id: "13",
    email: "c@c.com",
    name: "qutfa",
    expireIn: {
      y: 2023,
      m: 12,
      d: 22,
    }
  },
  {
    MC: "1",
    agent_id: "11",
    email: "a@a.com",
    name: "alaa",
    expireIn: {
      y: 2023,
      m: 12,
      d: 22,
    }
  },
  {
    MC: "2",
    agent_id: "12",
    email: "b@b.com",
    name: "ali",
    expireIn: {
      y: 2023,
      m: 12,
      d: 22,
    }
  },
  {
    MC: "3",
    agent_id: "13",
    email: "c@c.com",
    name: "qutfa",
    expireIn: {
      y: 2023,
      m: 12,
      d: 22,
    }
  },
  {
    MC: "1",
    agent_id: "11",
    email: "a@a.com",
    name: "alaa",
    expireIn: {
      y: 2023,
      m: 12,
      d: 22,
    }
  },
  {
    MC: "2",
    agent_id: "12",
    email: "b@b.com",
    name: "ali",
    expireIn: {
      y: 2023,
      m: 12,
      d: 22,
    }
  },
  {
    MC: "3",
    agent_id: "13",
    email: "c@c.com",
    name: "qutfa",
    expireIn: {
      y: 2023,
      m: 12,
      d: 22,
    }
  },
];
//? Admin Auth Router :
var fileNameList = ["register", "login", "forgot"],
  url = location.pathname,
  index, fileName;
fileNameList.forEach((val) => {
  if (url.includes(val)) {
    fileName = val;
  }
});
// ? Classes :
class WatanNav {
  constructor(links, sections) {
    this.launchNav(links, sections);
    this.enableNav(links, sections);
  }
  linksOff(links) {
    links.forEach((link) => {
      link.classList.remove("active");
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
        links[index].classList.add("active");
        this.sectionsOff(sections);
        sections[index].classList.remove("d-none");
      });
    });
  }
  launchNav(links, sections) {
    this.sectionsOff(sections);
    sections[0].classList.remove("d-none");
    this.linksOff(links);
    links[0].classList.add("active");
  }
}
class WatanDarkNav {
  constructor(links, sections) {
    this.launchNav(links, sections);
    this.enableNav(links, sections);
  }
  linksOff(links) {
    links.forEach((link) => {
      link.classList.add("text-white");
      link.classList.remove("active");
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
        links[index].classList.add("active");
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
    links[0].classList.add("active");
  }
}
class Pagination {
  constructor(place, dataList, name) {
    var keys = Object.keys(dataList[0]),
      keysCount = keys.length,
      dataCount = dataList.length;
    this.generate(place, name, keys, keysCount, dataList, dataCount);
  }
  generate(place, name, keys, keysCount, dataList, dataCount) {
    var tableElement = `
    <table id="${name}Table" class="table">
      <thead>
        <tr>
          <th colspan="${keysCount + 1}">
            <button type="button" id="${name}LightBtn" class="btn btn-light m-1">Light</button>
            <button type="button" id="${name}DarkBtn" class="btn btn-dark m-1">Dark</button>
          </th>
        </tr>
        <tr id="${name}TableHeadPlace"></tr>
      </thead>
      <tbody id="${name}TableBodyPlace"></tbody>
      <tfoot>
        <th id="${name}TableFootPlace" colspan="${keysCount + 1}"></th>
      </tfoot>
    </table>
    `;
    place.innerHTML = tableElement;
    var table = document.getElementById(`${name}Table`),
      thead = document.getElementById(`${name}TableHeadPlace`),
      lightBtn = document.getElementById(`${name}LightBtn`),
      darkBtn = document.getElementById(`${name}DarkBtn`),
      tbody = document.getElementById(`${name}TableBodyPlace`),
      tfoot = document.getElementById(`${name}TableFootPlace`),
      paginationElement = `<nav id="${name}Nav" aria-label="Page navigation"></nav>`
      ;
    this.editMood(table, lightBtn, "L");
    this.editMood(table, darkBtn, "D");
    keys.forEach((key) => {
      var el = `<th scope="col">${key}</th>`;
      thead.innerHTML += el;
    });
    thead.innerHTML += `<th scope="col">Options</th>`;
    // * Add Pagination Element :
    tfoot.innerHTML = paginationElement;
    var nav = document.getElementById(`${name}Nav`);
    this.generateNav(name, nav, dataCount, dataList, tbody, keys);
  }
  editMood(table, btn, type) {
    btn.addEventListener("click", () => {
      if (type == "L") {
        table.classList.remove("table-dark");
      } else {
        table.classList.add("table-dark");
      }
    });
  }
  generateNav(name, nav, dataCount, dataList, tbody, keys) {
    var paginationList = `
        <ul id="${name}List" class="pagination justify-content-center">
          <li id="${name}Previous" class="page-item disabled">
            <a class="page-link" tabindex="-1" aria-disabled="true">Previous</a>
          </li>
          <li id="${name}Next" class="page-item">
            <a class="page-link">Next</a>
          </li>
        </ul>
      `;
    nav.innerHTML = paginationList;
    var list = document.getElementById(`${name}List`),
      startGenerate = this.checkCount(dataCount),
      previousBtn = document.getElementById(`${name}Previous`),
      nextBtn = document.getElementById(`${name}Next`);
    var count = this.createNavItem(startGenerate, name, dataCount, list);
    this.createBodyGroup(count, name, dataList, tbody, keys);
  }
  checkCount(dataCount) {
    if (dataCount > 50) {
      return true;
    }
    return false;
  }
  createNavItem(start, name, dataCount, list) {
    var count;
    if (start) {
      count = Math.ceil(dataCount / 50);
      for (var c = 0; c < count; c++) {
        const newNode = document.createElement("li");
        newNode.id = `${name}PaginationGroup${c}`;
        newNode.classList = `${name}PaginationItem page-item`;
        const pageLink = document.createElement("a");
        pageLink.classList = "page-link";
        const textNode = document.createTextNode(`${c}`);
        pageLink.appendChild(textNode);
        newNode.appendChild(pageLink);
        var length = list.children.length,
          listLastChild = length - 1;
        list.insertBefore(newNode, list.children[listLastChild]);
      }
    } else {
      count = 1;
      const newNode = document.createElement("li");
      newNode.id = `${name}PaginationGroup${count}`;
      newNode.classList = `${name}PaginationItem page-item`;
      const pageLink = document.createElement("a");
      pageLink.classList = "page-link";
      const textNode = document.createTextNode(`${count}`);
      pageLink.appendChild(textNode);
      newNode.appendChild(pageLink);
      var length = list.children.length,
        listLastChild = length - 1;
      list.insertBefore(newNode, list.children[listLastChild]);
    }
    return count;
  }
  createBodyGroup(count, name, data, body, keys) {
    var staticName = `${name}PaginationGroup`;
    for (var c = 0; c < count; c++) {
      var x = c + 1,
        range = x * 10,
        i = range - 10;
      if (range > data.length) {
        var exist = body.children.length;
        range = data.length - exist;
        i = 0;
      }
      for (i; i < range; i++) {
        var currentObjectExpireDate = data[i][keys[4]]["y"] + "-" + data[i][keys[4]]["m"] + "-" + data[i][keys[4]]["d"];
        body.innerHTML += `
        <tr class="${staticName} ${staticName}${c}">
          <th scope="row">${data[i][keys[0]]}</th>
          <td>${data[i][keys[1]]}</td>
          <td>${data[i][keys[2]]}</td>
          <td>${data[i][keys[3]]}</td>
          <td>${currentObjectExpireDate}</td>
          <td>
            <button type="button" class="${data[i][keys[0]]}_Edit btn btn-warning m-1">Edit</button>
            <button type="button" class="${data[i][keys[0]]}_Delete btn btn-danger m-1">Delete</button>
          </td>
        </tr>
        `;
      }
    }
    this.launchNav(name);
  }
  launchNav(name) {
    var paginationLink = document.querySelectorAll(`.${name}PaginationItem`),
      previousBtn = document.querySelector(`#${name}Previous`),
      nextBtn = document.querySelector(`#${name}Next`);
    this.linksAndSectionsOff(paginationLink);
    this.activeateNavFirst(paginationLink);
    this.activeateNavEvents(name, paginationLink, previousBtn, nextBtn);
  }
  linksAndSectionsOff(links) {
    links.forEach(el => {
      el.classList.remove("active");
      var sections = document.querySelectorAll(`.${el.id}`);
      sections.forEach(section => {
        section.classList.add("d-none");
      });
    });
  }
  activeateNavFirst(links) {
    links[0].classList.add("active");
    var activeSections = document.querySelectorAll(`.${links[0].id}`);
    activeSections.forEach(active => {
      active.classList.remove("d-none");
    });
  }
  activeateNavEvents(name, links, previous, next) {
    links.forEach(link => {
      var sections = document.querySelectorAll(`.${link.id}`);
      link.addEventListener("click", () => {
        this.linksAndSectionsOff(links);
        link.classList.add("active");
        sections.forEach(section => {
          section.classList.remove("d-none");
        });
      });
    });
    previous.addEventListener("click", () => {
      links.forEach(link => {
        var classNames = link.classList.value;
        if (classNames.includes("active")) {
          var nextElement = link.previousSibling;
          if (nextElement.classList.value.includes(`${name}PaginationItem`)) {
            nextElement.click();
          }
        }
      });
    });
    next.addEventListener("click", () => {
      links.forEach(link => {
        var classNames = link.classList.value;
        if (classNames.includes("active")) {
          var nextElement = link.nextSibling;
          if (nextElement.classList.value.includes(`${name}PaginationItem`)) {
            nextElement.click();
          }
        }
      });
    });
  }
}
// ? Functions :
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
function validateInput(el, type) {
  if (type == "s") {
    el.style.border = "1px solid green";
    el.style.boxShadow = "0 0 5px green";
  } else {
    el.style.border = "1px solid red";
    el.style.boxShadow = "0 0 5px red";
  }
}
if (fileName == fileNameList[0]) {
  // * Site Languages :

  // * Variables :
  var send = [false, false, false, false], register_form = document.querySelector("#register-form"),
    register_data = document.querySelectorAll(".register-data"),
    register_alert = document.querySelectorAll(".alert");
  // * Functions :

  // * Events :
  register_data[0].addEventListener("input", async () => {
    var point = 0, value = register_data[0].value;
    if (value.length > 2) {
      point = 1;
    } else {
      validateInput(register_data[0], "e");
    }
    if (point == 1) {
      var filter1,
        filter2;
      for (var i = 1; i <= value.length; i++) {
        filter1 = value.replaceAll(" ", "");
        filter2 = filter1.replaceAll("-", "_");
      }
      register_data[0].value = filter2;
      point = 2;
    }
    if (point == 2) {
      var res,
        data,
        headers = {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body = {
          user: register_data[0].value,
          language: register_data[3].value == "not" ? "en" : register_data[3].value,
        };
      res = await fetch("/app/admin/exist", {
        headers,
        method: "POST",
        body: JSON.stringify(body),
      });
      data = await res.json();
      var decoded = parseJwt(data.token);
      if (decoded.success) {
        validateInput(register_data[0], "s");
        register_alert[0].classList.add("d-none");
        send[0] = true;
      } else {
        send[0] = false;
        validateInput(register_data[0], "e");
        register_alert[0].innerText = decoded.msg;
        register_alert[0].classList.remove("d-none");
      }
    }
  });
  register_data[1].addEventListener("input", () => {
    var value = register_data[1].value;
    if (value.length < 8) {
      validateInput(register_data[1], "e");
      register_alert[1].innerText = "يجب أن تكون كلمة المرور أكثر من 8 أحرف على الاقل";
      register_alert[1].classList.remove("d-none");
      send[1] = false;
    } else {
      validateInput(register_data[1], "s");
      register_alert[1].classList.add("d-none");
      send[1] = true;
    }
  });
  register_data[2].addEventListener("input", () => {
    var value = register_data[2].value;
    if (value != register_data[1].value) {
      validateInput(register_data[2], "e");
      register_alert[2].innerText = "يجب أن تكون كلمات المرور متساوية";
      register_alert[2].classList.remove("d-none");
      send[2] = false;
    } else {
      validateInput(register_data[2], "s");
      register_alert[2].classList.add("d-none");
      send[2] = true;
    }
  });
  register_data[3].addEventListener("change", () => {
    var value = register_data[3].value;
    if (value == "not") {
      validateInput(register_data[3], "e");
      register_alert[3].innerText = "يرجى أختيار اللغة";
      register_alert[3].classList.remove("d-none");
      send[3] = false;
    } else {
      validateInput(register_data[3], "s");
      register_alert[3].classList.add("d-none");
      send[3] = true;
    }
  });
  register_form.addEventListener("submit", (e) => {
    e.preventDefault();
    var successData = false;
    if (send.includes(false)) {
      send.forEach((bool, index) => {
        if (bool == false) {
          validateInput(register_data[index], "e");
        }
      });
    } else {
      successData = true;
    }
    if (successData) {
      var res,
        data,
        headers = {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body = {
          user: register_data[0].value,
          password: register_data[1].value,
          vpassword: register_data[2].value,
          language: register_data[3].value == "not" ? "en" : register_data[3].value,
        };
      setTimeout(async () => {
        res = await fetch("/app/admin/register", {
          headers,
          method: "POST",
          body: JSON.stringify(body),
        });
        data = await res.json();
        var decoded = parseJwt(data.token);
        if (decoded.success) {
          register_alert[4].classList.remove("d-none");
          register_alert[4].classList.remove("alert-danger");
          register_alert[4].classList.add("alert-success");
          register_alert[4].innerHTML = `<a href="${decoded["url"]}">Log in</a>`;
          window.location = decoded["url"];
        } else {
          register_alert[4].classList.remove("d-none");
          register_alert[4].classList.remove("alert-success");
          register_alert[4].classList.add("alert-danger");
          register_alert[4].innerText = decoded["msg"];
        }
      }, 2500);
    }
  });
} else if (fileName == fileNameList[1]) {
  var u = location.pathname;
  let i = u.lastIndexOf("/") + 1;
  let fn = u.substring(i);
  // * Site Languages :
  // * Variables :
  var send = [false, false, false], login_form = document.querySelector("#login-form"),
    login_data = document.querySelectorAll(".login-data"),
    login_alert = document.querySelectorAll(".alert");
  // * Events :
  window.addEventListener("load", () => {
    if (localStorage.getItem("watan0login")) {
      var decoded = parseJwt(localStorage.getItem("watan0login")),
        ul = decoded["url"],
        il = ul.lastIndexOf("/") + 1,
        fnl = ul.substring(il);
      if (fn == fnl && fn == localStorage.getItem("watan0name")) {
        window.location = decoded["url"];
      }
    }
    login_data[0].value = fn;
    if (login_data[0].value == fn) {
      send[0] = true;
    }
    if (login_data[2].value != "not") {
      send[2] = true;
    }
  });
  login_data[1].addEventListener("input", () => {
    var value = login_data[1].value;
    if (value.length < 8) {
      validateInput(login_data[1], "e");
      login_alert[1].innerText = "يجب أن تكون كلمة المرور أكثر من 8 أحرف على الاقل";
      login_alert[1].classList.remove("d-none");
      send[1] = false;
    } else {
      validateInput(login_data[1], "s");
      login_alert[1].classList.add("d-none");
      send[1] = true;
    }
  });
  login_data[2].addEventListener("change", () => {
    var value = login_data[2].value;
    if (value == "not") {
      validateInput(login_data[2], "e");
      login_alert[2].innerText = "يرجى أختيار اللغة";
      login_alert[2].classList.remove("d-none");
      send[2] = false;
    } else {
      validateInput(login_data[2], "s");
      login_alert[2].classList.add("d-none");
      send[2] = true;
    }
  });
  login_form.addEventListener("submit", (e) => {
    e.preventDefault();
    var successData = false;
    if (send.includes(false)) {
      send.forEach((bool, index) => {
        if (bool == false) {
          validateInput(login_data[index], "e");
        }
      });
    } else {
      successData = true;
    }
    if (successData) {
      var res,
        data,
        headers = {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body = {
          user: login_data[0].value,
          password: login_data[1].value,
          language: login_data[2].value == "not" ? "en" : login_data[2].value,
        };
      setTimeout(async () => {
        res = await fetch("/app/admin/login", {
          headers,
          method: "POST",
          body: JSON.stringify(body),
        });
        data = await res.json();
        var decoded = parseJwt(data.token);
        if (decoded.success) {
          localStorage.setItem("watan0login", data.token);
          login_alert[3].classList.remove("d-none");
          login_alert[3].classList.remove("alert-danger");
          login_alert[3].classList.add("alert-success");
          login_alert[3].innerHTML = `<a href="${decoded["url"]}">Log in</a>`;
          window.location = decoded["url"];
        } else {
          login_alert[3].classList.remove("d-none");
          login_alert[3].classList.remove("alert-success");
          login_alert[3].classList.add("alert-danger");
          login_alert[3].innerText = decoded["msg"];
        }
      }, 2500);
    }
  });
} else if (fileName == fileNameList[2]) {
  var u = location.pathname;
  let i = u.lastIndexOf("/") + 1;
  let fn = u.substring(i);
  // * Site Languages :

  // * Variables :
  var send = [false, false, false], forgot_form = document.querySelector("#forgot-form"),
    forgot_data = document.querySelectorAll(".forgot-data"),
    forgot_alert = document.querySelectorAll(".alert");
  // * Functions :

  // * Events :
  window.addEventListener("load", () => {
    forgot_data[0].value = fn;
    if (forgot_data[0].value == fn) {
      send[0] = true;
    }
    if (forgot_data[3].value != "not") {
      send[3] = true;
    }
  });
  forgot_data[1].addEventListener("input", () => {
    var value = forgot_data[1].value;
    if (value.length < 8) {
      validateInput(forgot_data[1], "e");
      forgot_alert[1].innerText = "يجب أن تكون كلمة المرور أكثر من 8 أحرف على الاقل";
      forgot_alert[1].classList.remove("d-none");
      send[1] = false;
    } else {
      validateInput(forgot_data[1], "s");
      forgot_alert[1].classList.add("d-none");
      send[1] = true;
    }
  });
  forgot_data[2].addEventListener("input", () => {
    var value = forgot_data[2].value;
    if (value != forgot_data[1].value) {
      validateInput(forgot_data[2], "e");
      forgot_alert[2].innerText = "يجب أن تكون كلمات المرور متساوية";
      forgot_alert[2].classList.remove("d-none");
      send[2] = false;
    } else {
      validateInput(forgot_data[2], "s");
      forgot_alert[2].classList.add("d-none");
      send[2] = true;
    }
  });
  forgot_data[3].addEventListener("change", () => {
    var value = forgot_data[3].value;
    if (value == "not") {
      validateInput(forgot_data[3], "e");
      forgot_alert[3].innerText = "يرجى أختيار اللغة";
      forgot_alert[3].classList.remove("d-none");
      send[3] = false;
    } else {
      validateInput(forgot_data[3], "s");
      forgot_alert[3].classList.add("d-none");
      send[3] = true;
    }
  });
  forgot_form.addEventListener("submit", (e) => {
    e.preventDefault();
    var successData = false;
    if (send.includes(false)) {
      send.forEach((bool, index) => {
        if (bool == false) {
          validateInput(forgot_data[index], "e");
        }
      });
    } else {
      successData = true;
    }
    if (successData) {
      var res,
        data,
        headers = {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body = {
          user: forgot_data[0].value,
          password: forgot_data[1].value,
          vpassword: forgot_data[2].value,
          language: forgot_data[3].value == "not" ? "en" : forgot_data[3].value,
        };
      setTimeout(async () => {
        res = await fetch("/app/admin/forgot", {
          headers,
          method: "POST",
          body: JSON.stringify(body),
        });
        data = await res.json();
        var decoded = parseJwt(data.token);
        if (decoded.success) {
          forgot_alert[4].classList.remove("d-none");
          forgot_alert[4].classList.remove("alert-danger");
          forgot_alert[4].classList.add("alert-success");
          forgot_alert[4].innerHTML = `<a href="${decoded["url"]}">Log in</a>`;
          window.location = decoded["url"];
        } else {
          forgot_alert[4].classList.remove("d-none");
          forgot_alert[4].classList.remove("alert-success");
          forgot_alert[4].classList.add("alert-danger");
          forgot_alert[4].innerText = decoded["msg"];
        }
      }, 2500);
    }
  });
} else {
  var u = location.pathname,
    i = u.lastIndexOf("/") + 1,
    fn = u.substring(i);
  if (!localStorage.getItem("watan0name")) {
    localStorage.setItem("watan0name", fn);
  }
  // * Site Languages :
  // * Variables :
  var nav = document.querySelectorAll(".nav-link-watan"),
    main = document.querySelectorAll(".main-section"),
    homeNav = document.querySelectorAll(".link-watan-home"),
    homeMain = document.querySelectorAll(".section-watan-home"),
    adminNav = document.querySelectorAll(".link-watan-admin"),
    adminMain = document.querySelectorAll(".section-watan-admin"),
    agentNav = document.querySelectorAll(".link-watan-agent"),
    agentMain = document.querySelectorAll(".section-watan-agent"),
    agentDeleteOrdersBtn = document.getElementById("agentDeleteOrdersBtn"),
    agentDeleteOrdersDiv = document.getElementById("agentDeleteOrdersDiv"),
    lists = [homeNav, adminNav, agentNav],
    sections = [homeMain, adminMain, agentMain],
    info,
    user = localStorage.getItem("watan0name"),
    adminlanguage = document.getElementById("language"),
    earningsForm = document.getElementById("earningsForm"),
    earningBadge = document.querySelector(".badge-earning-value"),
    dollarForm = document.getElementById("dollarForm"),
    dollarBadge = document.querySelector(".badge-dollar-value");
  // * Functions :
  async function getInfo() {
    var res,
      data,
      headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body = {
        user: user,
        language: "en",
      };
    res = await fetch("/app/admin/info", {
      headers,
      method: "POST",
      body: JSON.stringify(body),
    });
    data = await res.json();
    var decoded = parseJwt(data.token);
    if (decoded.success) {
      info = decoded.data;
      document.getElementById("userName").innerText = info.user;
    } else {
      alert(decoded["msg"]);
      window.location = "/";
    }
  }
  async function getDollar() {
    var selectDollar = dollarForm[1].value != "not" ? dollarForm[1].value : "IQD";
    dollarValue = await fetch(`/app/cashing/${selectDollar}`),
      value = await dollarValue.json();
    if (value) {
      if (dollarForm[1].value != "not") {
        dollarBadge.innerText = `${value.data} / ${selectDollar}`;
      } else {
        dollarBadge.innerText = `Default ${value.data} / ${selectDollar}`;
      }
    }
  }
  async function editDollar() {
    var res,
      data,
      headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body = {
        user,
        password: dollarForm[0].value,
        cu: dollarForm[1].value != "not" ? dollarForm[1].value : "IQD",
        value: dollarForm[2].value,
        language: adminlanguage.value == "not" ? "en" : adminlanguage.value,
      };
    res = await fetch("/app/cashing/edit", {
      headers,
      method: "POST",
      body: JSON.stringify(body),
    });
    data = await res.json();
    var decoded = parseJwt(data.token),
      oneInputAlert = document.querySelector(".one-input-alert-currency");
    if (decoded.success) {
      oneInputAlert.classList.remove("d-none");
      oneInputAlert.classList.remove("alert-danger");
      oneInputAlert.classList.add("alert-success");
      oneInputAlert.innerText = decoded.msg;
      dollarBadge.innerText = decoded.value;
    } else {
      oneInputAlert.classList.remove("d-none");
      oneInputAlert.classList.remove("alert-success");
      oneInputAlert.classList.add("alert-danger");
      oneInputAlert.innerText = decoded.msg;
    }
    setTimeout(() => { oneInputAlert.classList.add("d-none"); }, 8000);
  }
  async function getEarnings() {
    var earningValue = await fetch("/app/cashing/earning"),
      value = await earningValue.json();
    if (value) {
      earningBadge.innerText = value.data;
    }
  }
  async function editEarnings() {
    var res,
      data,
      headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body = {
        user,
        password: earningsForm[0].value,
        value: earningsForm[1].value,
        language: adminlanguage.value == "not" ? "en" : adminlanguage.value,
      };
    res = await fetch("/app/cashing/earning", {
      headers,
      method: "POST",
      body: JSON.stringify(body),
    });
    data = await res.json();
    var decoded = parseJwt(data.token),
      oneInputAlert = document.querySelector(".one-input-alert");
    if (decoded.success) {
      oneInputAlert.classList.remove("d-none");
      oneInputAlert.classList.remove("alert-danger");
      oneInputAlert.classList.add("alert-success");
      oneInputAlert.innerText = decoded.msg;
      earningBadge.innerText = decoded.value;
    } else {
      oneInputAlert.classList.remove("d-none");
      oneInputAlert.classList.remove("alert-success");
      oneInputAlert.classList.add("alert-danger");
      oneInputAlert.innerText = decoded.msg;
    }
    setTimeout(() => { oneInputAlert.classList.add("d-none"); }, 8000);
  }
  // * Events :
  window.addEventListener("load", () => {
    new WatanNav(nav, main);
    lists.forEach((list, index) => {
      new WatanDarkNav(list, sections[index]);
    });
    if (user) { getInfo(); }
    getDollar();
    getEarnings();
  });
  earningsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    setTimeout(async () => { await editEarnings(); }, 2500);
  });
  dollarForm[1].addEventListener("change", () => getDollar());
  dollarForm.addEventListener("submit", (e) => {
    e.preventDefault();
    setTimeout(async () => { await editDollar(); }, 2500);
  });
  agentDeleteOrdersBtn.addEventListener("click", () => {
    new Pagination(agentDeleteOrdersDiv, testModel, "agentDeleteOrdersData");
  });
}