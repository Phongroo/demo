export function downloadFile(blob, type, fileName) {
	const url = window.URL.createObjectURL(blob); // Create a temporary URL for the Blob

	const link = document.createElement("a");
	link.href = url;
	link.download = appendExtension(fileName, type); // Set the desired filename
	link.style.display = "none";
	document.body.appendChild(link);
	link.click(); // Simulate a click to trigger download

	// Revoke the temporary URL after download (optional)
	window.URL.revokeObjectURL(url);
}

export function appendExtension(name, type) {
	switch (type) {
		case "application/pdf":
			return name.concat(".").concat("pdf");
		case "application/vnd.ms-excel":
			return name.concat(".").concat("xls");
		case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
			return name.concat(".").concat("xlsx");
	}
}

export function createFileType(e) {
	let fileType = "";
	if (e === "pdf") {
		fileType = `application/${e}`;
	} else if (e === "docx") {
		fileType = "application/msword";
	} else if (e === "xls") {
		fileType = "application/vnd.ms-excel";
	} else if (e === "xlsx") {
		fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
	}

	return fileType;
}
