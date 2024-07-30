import { toast } from "react-toastify";
import Global from "./global";
import moment from "moment";

export const TypeToast = {
  INFO: "info",
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "error",
  DEFAULT: "default",
};

export const Toast = (message, type = TypeToast.DEFAULT) => {
  // option= {  'info' | 'success' | 'warning' | 'error' | 'default';
  //type:"success",
  // position: "top-right",
  // autoClose: 5000,
  // hideProgressBar: false,
  // closeOnClick: true,
  // pauseOnHover: true,
  // draggable: true,
  // progress: undefined,
  // theme: "light",
  // transition: Bounce,
  // }

  return toast(message, { type });
};

export const getLabelByIdInArray = (value, list, keyValue, keyName) => {
  if (
    typeof value !== "undefined" &&
    value !== null &&
    typeof list !== "undefined" &&
    list !== null
  ) {
    const item = list?.find((elem) => elem[keyValue] === value);
    return item ? item[keyName] : "";
  }
  return "";
};

export const checkPermission = (permission, checkMore = false) => {
  const obj = Global.getPermission();
  if (checkMore) {
    return obj[permission] === "Y" && checkMore;
  }
  return obj[permission] === "Y";
};

export const ListPage = [5, 10, 50, 100];

export const parseDate = (data, format = "DD/MM/YYYY HH:mm:ss") => {
  if (data) {
    return moment(data).format(format);
  }
  return data;
};

export function removeVietNameCharacter(str) {
  // remove accents
  const from =
      "àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ",
    to =
      "aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy";
  for (const i = 0, l = from.length; i < l; i++) {
    str = str.replace(RegExp(from[i], "gi"), to[i]);
  }

  str = str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\-]/g, "-")
    .replace(/-+/g, "-");

  return str;
}

export function milisecondToHMS(time) {
  let days, hours, minutes, seconds, total_hours, total_minutes, total_seconds;

  total_seconds = parseInt(Math.floor(time / 1000));
  total_minutes = parseInt(Math.floor(total_seconds / 60));
  total_hours = parseInt(Math.floor(total_minutes / 60));
  days = parseInt(Math.floor(total_hours / 24));

  seconds = parseInt(total_seconds % 60);
  minutes = parseInt(total_minutes % 60);
  hours = parseInt(total_hours % 24);

  let result = seconds + "s";
  if (minutes) {
    result = minutes + "m" + result;
  }
  if (hours) {
    result = hours + "h" + result;
  }
  if (days) {
    result = days + "d" + result;
  }
  return result;
}

export const AppValidator = {
  CAPACITY: "MB",

  /*Kích thước file cho phép upload*/
  MAX_SIZE_FILE_UPLOAD: 50, // MB

  /*Kích thước tổng các file cho phép upload LC*/
  MAX_SIZE_FILES_UPLOAD_LC: 50, // MB

  /*Kích thước tổng các file cho phép upload TTR*/
  MAX_SIZE_FILES_UPLOAD_TTR: 50, // MB

  /*Kích thước file cho phép upload kho tài liệu*/
  MAX_SIZE_FILE_UPLOAD_ADMIN: 100, // MB

  /*Kích thước file cho phép upload*/
  MAX_SIZE_IMAGE_UPLOAD: 10, // MB

  /*độ dài tối da input code*/
  CODE_MAXLENGTH: 32,

  /*độ dài tối da input text*/
  TEXT_MAXLENGTH: 256,

  /*file chấp nhận trên fontend*/
  ACCEPT_EXCEL: ".xlsx, .xls",

  /*file chấp nhận trên fontend*/
  ACCEPT_IMAGE: "image/*",

  /*file chấp nhận trên fontend*/
  ACCEPT_WORD: ".doc, .docx",

  ACCEPT_ADMIN_DOC:
    ".zip,.rar,.7zip,.xlsx,.xls,.doc,.docx,.ppt,.pptx,.pdf,image/*,.xml,text/plain",

  /*fortmat so nguyen(, => 10,000,000)*/
  PATTERN_NUMBER: "1.0",

  /*fortmat so le(, => 10,000,000.10)*/
  PATTERN_NUMBER_DECIMAL: "1.2-2",

  /*fortmat tien(10,000,000 đ)*/
  CURRENCY: "VND",
  LOCALE: "vi",

  MAX_CALL_BACK: 300,

  ACCEPT_OFFICE: ".xlsx,.xls,.doc,.docx,.ppt,.pptx,.pdf,image/*",

  ACCEPT_EXCEL_AND_PDF: ".xlsx,.xls,.ppt,.pptx,.pdf",

  ACCEPT_EXCEL_AND_PDF_WORD: ".xlsx,.xls,.ppt,.pdf,.doc,.docx",

  checkExcelFile(file) {
    return (
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ===
        file.type || "application/vnd.ms-excel" === file.type
    );
  },

  checkExcelFileWithExtension(file) {
    if (
      [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ].some((elem) => elem === file.type)
    ) {
      return true;
    }
    // Cover trường hợp sử dụng excel file của các office khác như Libre Office
    const fileExtension = file.name.split(".");
    const extension = fileExtension[fileExtension.length - 1];
    return ["xlsx", "xls"].some((elem) => elem === extension);
  },

  checkUploadFile(file) {
    const dots = file.name.split(".");
    const fileType = "." + dots[dots.length - 1];
    const type = [
      ".zip",
      ".rar",
      ".7zip",
      ".xlsx",
      ".xls",
      ".doc",
      ".docx",
      ".ppt",
      ".pptx",
      ".pdf",
      ".jpg",
      ".png",
      ".xml",
      ".txt",
    ];
    return type.indexOf(fileType) > -1;
  },

  checkSizeFileUpload(file) {
    return file.size / 1024 / 1024 < this.MAX_SIZE_FILE_UPLOAD;
  },

  checkUploadFileOffice(file) {
    const dots = file.name.split(".");
    const fileType = "." + dots[dots.length - 1];
    const type = [
      ".xlsx",
      ".xls",
      ".doc",
      ".docx",
      ".ppt",
      ".pptx",
      ".pdf",
      ".jpg",
      ".png",
    ];
    return type.indexOf(fileType) > -1;
  },

  checkUploadFileExcelAndPdf(file) {
    const dots = file.name.split(".");
    const fileType = "." + dots[dots.length - 1];
    const type = [".xlsx", ".xls", ".ppt", ".pptx", ".pdf"];
    return type.indexOf(fileType) > -1;
  },

  checkUploadFileExcelAndPdfAndWord(file) {
    const dots = file.name.split(".");
    const fileType = "." + dots[dots.length - 1];
    const type = [".xlsx", ".xls", ".ppt", ".pptx", ".pdf", ".doc", ".docx"];
    return type.indexOf(fileType) > -1;
  },

  checkTotalSizeFileUploadLC(files) {
    let filesSize = 0;
    for (let i = 0; i < files.length; i++) {
      filesSize = filesSize + files[i].size;
    }
    return filesSize / 1024 / 1024 < this.MAX_SIZE_FILES_UPLOAD_LC;
  },
};

export const formatNumber = (number) => {
  if (number > 0) {
    let formattedNumber = number.toLocaleString("en-US", {
      maximumFractionDigits: 2,
    });
    return formattedNumber;
  }
};
