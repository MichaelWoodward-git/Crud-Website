const errorArea = document.getElementById("errorMessage");
errorArea.hidden = true;

let arrayCount = 0;

document.getElementById("submitButton").addEventListener("click", () => {
  const fileUpload = document.querySelector('input[type="file"]');

  let destinyFormData = new FormData();

  destinyFormData.append('willing', document.getElementById('willing').value);
  destinyFormData.append('heroic', document.getElementById('heroic').value);
  destinyFormData.append('fname', document.getElementById('fname').value);
  destinyFormData.append('quantity', document.getElementById('quantity').value);
  destinyFormData.append('grind', document.getElementById('grind').value);
  destinyFormData.append("myfile", fileUpload.files[0]);

  let fetchSettings = {
    method: "POST",
    body: destinyFormData
  };

  fetch("http://localhost", fetchSettings)
  .then((response) => {
    return new Promise((resolve) => response.json()
      .then((json) => resolve({
        status: response.status,
        json
      }))
    );
  })
  .then(({status, json}) => {
    const errorNotif = document.getElementsByClassName("text-mad");
    errorArea.hidden = true;
    for (htmlElement of errorNotif) {
      htmlElement.innerHTML = "&nbsp;";
    }
    if (status === 400) {
      errorArea.style.color = "red";
      errorArea.innerText = "Please correct form errors.";
      errorArea.hidden = false;
      for(error of json.errors) {
        console.log(error);
        const errorId = error.path + '-Error';
        
        document.getElementById(errorId).innerHTML = error.msg;
      }
    } else {
      errorArea.innerText = "Form submitted.";
      errorArea.hidden = false;
      errorArea.style.color = "green";

      for(items of json.sentData) {
        console.log(items);
      }
      DataTable(json.sentData);

    }
  })
  .catch(error => {
    console.error("not again.", error);
  });
return;
});

const DataTable = (props) => {
  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";

  for(dataRows of props) {
    const row = document.createElement("tr");
    for(data of dataRows) {
      if(data !== dataRows[6]) {
        let info = document.createElement("td");
        info.classList.add("col-1");
        info.textContent = data;
        row.appendChild(info);
      } else {
        let info = document.createElement("td");
        info.classList.add("col-5");
        info.innerHTML = "<img src='Server/"+data+"' class='img-fluid'/>"
        row.appendChild(info);
      }
    }
    tableBody.appendChild(row);
  }
}