import * as XLSX from "xlsx/xlsx.mjs";

import FileSaver from "file-saver";

const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const fileExtension = ".xlsx";

export const exportToCSV = (
	csvData: Array<Object>,
	Heading: Array<Object>,
	header: string[],
	fileName: string,
	wscols: Array<Object>
) => {
	const ws = XLSX.utils.json_to_sheet(Heading, {
		header,
		skipHeader: true,
		origin: 0, //ok
	});
	ws["!cols"] = wscols;
	XLSX.utils.sheet_add_json(ws, csvData, {
		header,
		skipHeader: true,
		origin: -1, //ok
	});
	const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
	const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
	const data = new Blob([excelBuffer], { type: fileType });
	FileSaver.saveAs(data, fileName + fileExtension);
};
