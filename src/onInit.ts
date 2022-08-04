import * as XLSX from "xlsx";
import "./style.css";

async function downloadFile() {
  const url = "https://sheetjs.com/executive.json";
  const res = await fetch(url);
  const raw_data = await res.json();

  /* filter for the Presidents */
  const prez = raw_data.filter((row) =>
    row.terms.some((term) => term.type === "prez")
  );

  /* flatten objects */
  const rows = prez.map((row) => ({
    name: row.name.first + " " + row.name.last,
    birthday: row.bio.birthday,
  }));

  /* generate worksheet and workbook */
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Dates");

  /* fix headers */
  XLSX.utils.sheet_add_aoa(worksheet, [["Name", "Birthday"]], { origin: "A1" });

  /* calculate column width */
  const max_width = rows.reduce((w, r) => Math.max(w, r.name.length), 10);
  worksheet["!cols"] = [{ wch: max_width }];

  /* create an XLSX file and try to save to Presidents.xlsx */
  XLSX.writeFile(workbook, "Presidents.xlsx");
}

const btn = htmlNode.querySelector("button");
btn?.addEventListener("click", downloadFile);
