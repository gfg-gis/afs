export const removeAccents = (str: string): string => {
	return str
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/đ/g, "d")
		.replace(/Đ/g, "D")
		.toLowerCase();
};

export const formatUrlGoogleMap = (
	street_name: string,
	ward: string,
	district: string,
	province: string
): string => {
	const URL = "https://www.google.com/maps/place";

	street_name = street_name.replace(/\//g, "%2F");
	street_name = street_name.replace(/\s/g, "+");
	ward = ward.replace(/\s/g, "+");
	district = district.replace(/\s/g, "+");
	province = province.replace(/\s/g, "+");

	const arr = ["01", "02", "03", "04", "05", "06", "07", "08", "09"];

	arr.forEach((value: string, index: number) => (ward = ward.replace(value, (++index).toString())));

	// return `${URL}/${street_name}+${ward}+${district}+${province}`;
	return `${URL}/${ward}+${district}+${province}`;
};

export const calDuration = (second: number): string => {
	// second = 1.518 * 24 * 60 * 60;

	function pad(num: number): string {
		return `${num}`.slice(-2);
	}

	let minutes = Math.floor(second / 60);

	second = second % 60;

	let hours = Math.floor(minutes / 60);

	minutes = minutes % 60;

	let day = Math.floor(hours / 24);

	hours = hours % 24;

	// return `${pad(day)}d : ${pad(hours)}h : ${pad(minutes)}m : ${pad(second)}s`;
	return `${pad(day)} ${day > 1 ? "days" : "day"}`;
};
