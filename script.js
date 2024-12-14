async function getData() {
  const url = "https://data.gov.bh/api/explore/v2.1/catalog/datasets/01-statistics-of-students-nationalities_updated/records?where=colleges%20like%20%22IT%22%20AND%20the_programs%20like%20%22bachelor%22&limit=100";

  try {
    const response = await fetch(url);

   
    console.log("Response OK:", response.ok);
    console.log("Status Code:", response.status);
    console.log("Status Text:", response.statusText);

   
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }


    const data = await response.json();

    
    console.log("Fetched Data:", data);

 
    populateTable(data.records);

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}


function populateTable(records) {
  const tableBody = document.getElementById("tbody");

  
  tableBody.innerHTML = "";

  
  records.forEach(record => {
    const fields = record.record.fields;


    const row = document.createElement("tr");

   
    row.innerHTML = `
      <td>${fields.year || "N/A"}</td>
      <td>${fields.semester || "N/A"}</td>
      <td>${fields.the_programs || "N/A"}</td>
      <td>${fields.nationality || "N/A"}</td>
      <td>${fields.colleges || "N/A"}</td>
      <td>${fields.number_of_students || "N/A"}</td>
    `;


    tableBody.appendChild(row);
  });
}


document.addEventListener("DOMContentLoaded", getData);
