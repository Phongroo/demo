import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Row, Tooltip } from "reactstrap";

import nextStep from "../../../../assets/images/next-step.png";

import * as CurrencyFormat from "react-currency-format";

import {
  currencyList,
  typeLc2List,
  typeLc1List,
  expiryPlaceList,
  availableWithList,
  listPayment,
  shippingTermList,
  productType,
  subProductType2,
  listPCentre,
  listApplicantRule,
  listAdviceType,
  listAvailableType,
  documentsInformation,
  DocumentsInformation,
  listAdditionalConditions,
  ConfirmationInstructions,
  reasonAddittionalAmount,
  listBoxSeq,
  listXuatNhapKhau,
  productList,
} from "./lc-online";
import { uniqBy } from "lodash/array";
import {
  AppValidator,
  Toast,
  TypeToast,
  formatNumber,
} from "../../../../utils/app.util";
import SelectComponent from "../../../../shared/component/select/SelectComponent";
import InputComponent from "../../../../shared/component/input/InputComponent";
import api from "../../../../utils/api";
import request from "../../../../utils/request";
import { ListCountry } from "../../portal/user/User.provider";
import { authUser } from "../../../../helpers/authUtils";
import Swal from "sweetalert2";
import moment from "moment";

const LCOnline = (props) => {
  const htmlText = `DOCUMENTS MUST BE PRESENTED IN TRIPLICATE IN ENGLISH UNLESS OTHERWISE STATED:
1. SIGNED COMMERCIAL INVOICE
2. (.../...) SET ORIGINALS OF SIGNED CLEAN SHIPPED ON BOARD OCEAN BILL OF LADING:
MADE OUT TO ORDER OF VIETNAM ACB,......BRANCH
MADE OUT TO ORDER BLANK ENDORSED
CONSIGNED TO THE APPLICANT
ORIGINAL SIGNED AIRWAY BILL SHOWING FLIGHT NUMBER AND DATE CONSIGNED TO
VIETNAM ACB,.......BRANCH
APPLICANT
SHOWING LC NUMBER, MARKED FREIGHT PREPAID FREIGHT TO COLLECT AND NOTIFY THE APPLICANT (WITH NAME AND FULL ADDRESS STATED)
3. QUALITY CERTIFICATE ISSUED BY......(FULL NAME OF GOODS STATED)
4. QUANTITY AND WEIGHT CERTIFICATE ISSUED BY.......(FULL NAME OF GOODS STATED)
5. CERTIFICATE OF ORIGIN ISSUED BY.......
6. DETAILED PACKING LIST
7. FULL SET OF ORIGINALS OF INSURANCE POLICY/ CERTIFICATE COVERING ALL RISKS OTHER......FOR 110 PERCENT OF
INVOICE VALUE BLANK ENDORSED INDICATING CLAIM PAYABLE BY A SETTLEMENT AGENT (WITH NAME AND FULL ADDRESS STATED) IN......,VIET NAM AND NUMBER OF ORIGINAL FOLDS TO BE ISSUED.
8. COPY OF FAX ADVISING APPLICANT AND VIETNAM ACB (FAX NO......) OF PARTICULARS OF SHIPMENT: B/L/AWB NO.,
SHIPMENT DATE, ETA, VESSEL NAME/FLIGHT NO., QUANTITY OF GOODS, NAME OF COMMODITIES, INVOICE VALUE AND LC NUMBER
WITHIN.......DAYS AFTER SHIPMENT.
9. BENEFICIARY'S CERTIFICATE CERTIFYING THAT ONE SET OF NON-NEGOTIABLE DOCUMENTS PLUS  (.../...) ORIGINAL BILL OF
LADING OTHER.......HAVE BEEN SENT TO THE APPLICANT WITHIN.......DAYS AFTER SHIPMENT DATE BY DHL / AN INTERNATIONAL
EXPRESS COURIER (COURIER'S RECEIPT TO PROVE THIS ACTION TO BE PRESENTED)
10. OTHER DOCUMENTS:.......
  `;
  const htmlTextDraftAt1Number = `days after Bill of lading date / Air waybill date`;
  const {
    item,
    customerList,
    listDepartment,
    mode,
    branches,
    passEntry,
    listAllCodeLC,
    timeStartCreate,
    itemParent,
  } = props;
  const [listSubBranch, setListSubBranch] = useState(branches);
  const [isLoading, setIsLoading] = useState(false);
  console.log("customerList", customerList);
  const [isUpdate, setIsUpdate] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);
  const fileRef = useRef(null);
  const [showFileList, setShowFileList] = useState([]);
  const [listFile, setListFile] = useState([]);
  const [indexStep, setIndexStep] = useState(10);
  const [sha256s, setSha256s] = useState([]);
  const [accountsVND, setAccountsVND] = useState([]);
  const [accountsUSD, setAccountsUSD] = useState([]);
  const [chonPhuongThuc, setChonPhuongThuc] = useState(true);
  const [guaranteeAmount, setGuaranteeAmount] = useState(1);
  const [guaranteeCurrency, setGuaranteeCurrency] = useState(1);
  const [inputCurrency, setInputCurrency] = useState(1);
  const [percentValue, setPercentValue] = useState(1);
  const [registerLC, setRegisterLC] = useState("Y");
  const [currentUser, setCurrentUser] = useState({});

  const [swifts, setSwifts] = useState([]);
  const [reportCode, setreportCode] = useState(null);
  const [reportFile, setReportFile] = useState(null);
  const [listFee, setListFee] = useState([]);
  const [f, setF] = useState({
    // ĐĂNG KÝ PHÁT HÀNH LC
    registrationForm: null,
    reference: null, // Validators.required
    transferable: null,
    isCompact: "",
    draftAtSub: "...days after bill of lading date/air waybill date",
    redClause: "Available with any bank",
    contractId: null,
    adviceType: "SWIFT",

    // PHƯƠNG THỨC THANH TOÁN
    guaranteeAmount: "WHOLLY",
    guaranteePercent: null,
    settlementInstruc1: null,
    guaranteeCurrency: null,
    inputCurrency: null,
    creditAgreementNumber: null,
    creditAgreementDate: null,
    pay: false,
    pay2: false,
    //Biến tạm
    custName: null,
    cifCode: null,
    //Câu cam kết màu chữ đỏ step 2 3
    // THÔNG TIN KHÁCH HÀNG
    userId: currentUser?.userId,
    custAddress: null, // Validators.required
    custTel: null, // Validators.required
    representativeName: null, // Validators.required
    representativeJob: null, // Validators.required
    vndAccount: null, // Validators.required
    fcAccount: null,
    // fcAccountCurrency: null,
    salesContract: null,

    // THÔNG TIN LC
    advisingBank1: null, // Validators.required
    advisingBank2: null,
    advisingBank3: null,
    advisingBank4: null,
    advisingBankSwiftCode: null,
    invoiceValue: "IRREVOCABLE",
    typeLc1: null,
    typeLc2: null, // Validators.required
    typeLc2Khac: "",
    expiryDate: null, // Validators.required
    expiryPlace: "AT ISSUING BANK",
    expiryPlaceOthers: null,
    applicant1: null, // Validators.required
    applicant2: null,
    applicant3: null,
    applicant4: null,
    beneficiary1: null, // Validators.required
    beneficiary2: null,
    beneficiary3: null,
    beneficiary4: null,
    currency: null, // Validators.required
    amount: 0, // Validators.required
    tolerance1: null, // [Validators.max(99), Validators.min(0), Validators.maxLength(2)]],
    tolerance2: null, // [Validators.max(99), Validators.min(0), Validators.maxLength(2)]],

    availableWith: "ISSUING BANK",
    nganHangKhac: "",
    paymentBy: "NEGOTIATION",
    paymentByMix: "",
    paymentByDeffered: "",
    draftAt1: "SIGHT",
    draftAt1Number: "...DAYS AFTER BILL OF LADING DATE/AIR WAYBILL DATE",
    draftAt1Others: null,
    draftAt2: "100% INVOICE VALUE",
    draftAt2Others: "",
    drawee: "VIETNAM ACB",
    draweeOthers: "",
    latestDate: "LATEST DATE OF SHIPMENT",
    latestDateDay: null, // Validators.required
    latestDateOthers: null,
    shipmentPeriod: null,
    partialShipment: "ALLOWED",
    transhipment: "ALLOWED",
    incoterms: "",
    incotermsOthers: null,
    shippingTerm: "EXW",
    shippingTermCheck: false,
    shippingTermsOthers: null,
    place: null,
    receiptPlace: null,
    loadingPort: null,
    dischargePort: null,
    finalPlace: null,
    documentsMust3: null,
    // 15. MÔ TẢ HÀNG HÓA VÀ/HOẶC DỊCH VỤ / DESCRIPTION OF GOODS AND/OR SERVICES*:
    goodsDescription: "", // [Validators.required, Validators.pattern('^[-A-Za-z0-9 … . , @ # % & ( ) _ + - = : ; < > \' / ‘ " ‘ ’ “ ” – \t \n]+$')]],

    // 16. CHỨNG TỪ YÊU CẦU XUẤT TRÌNH / DOCUMENTS REQUIRED:
    documentsRequired: null, // [Validators.required, Validators.pattern('^[-A-Za-z0-9 … . , @ # % & ( ) _ + - = : ; < > \' / ‘ " ‘ ’ “ ” – \t \n]+$')]],

    // 17. CÁC ĐIỀU KIỆN KHÁC / ADDITIONAL CONDITIONS:
    baoHiem: "INSURANCE COVERED BY",
    insuranceCovered: "APPLICANT",
    beneficiaryCharge: "true",
    mustLcNo: "true",
    additionalCondition4: "true",
    obligation: true,
    presentationType: "true",
    otherCondittions: false,
    settlementInstruc2: null,

    // 18. CÁC LỆ PHÍ / CHARGES
    otherCharges:
      "ALL BANKING CHARGES OUSTSIDE VIETNAM INCLUDING ADVISING, NEGOTIATING, DISCOUNTING, REIMBURSING COMMISSION AND AMENDMENT CHARGES AT BENEFICIARY’S ACCOUNTS. ADVISING/AMENDMENT CHARGES MUST BE COLLECTED BEFORE RELEASE OF LC/AMENDMENT.",
    charges: null,
    otherChargesKhac: false,

    // 19. THỜI HẠN XUẤT TRÌNH CHỨNG TỪ / PERIOD FOR PRESENTATION:
    presentationCheck: "presentationCheck1",
    presentationDays:
      "Documents must be presented within........... days after shipment date but within the validity of the credit.",
    presentationTypeCheck: false,
    presentationTypeKhac: null,
    otherPeriodFor2: false,

    // 20. CHỈ THỊ XÁC NHẬN / CONFIRMATION INSTRUCTIONS:
    confInstruc: "WITHOUT",
    confInstrucDetail: null,
    confFees: "BENEFICIARY ACCOUNT",

    // 21. CHỈ THỊ ĐỐI VỚI NGÂN HÀNG THANH TOÁN/NGÂN HÀNG CHẤP NHẬN/NGÂN HÀNG THƯƠNG
    // LƯỢNG / INSTRUCTIONS TO PAYING/ACCEPTING/NEGOTIATING BANK:
    documentsMust1: "", // [Validators.required, Validators.pattern('^[-a-zA-Z0-9 \' : - + ‘ / ( ) … . , ‘ ‘ ’ – \t ]+$')]],
    documentsMust1option: "1",
    documentsMust2: "DHL",
    documentsMust2khac: null,
    camKet1:
      "We shall reimburse you according to your instructions in the currency of the credit within 05 banking days after our receipt of",
    fcAccountCurrency:
      "Set of documents fully compliant with L/C terms and conditions.",
    camKet2: "true",
    payKhac: false,
    payKhac2: false,
    payKhacText: null,
    otherCondittionsKhac: "",
    // CAM KẾT CỦA NGƯỜI DÙNG
    undertakingsOfTheApplication: false,
    otherPeriodForPresentation: "",

    // Don't Know
    tranCode: "IBSR1010",

    value5: true,
  });

  useEffect(() => {
    getListSwifts();
    // getListAccounts();
    // getCustomerInfo();
    patchValue();
  }, []);

  useEffect(() => {
    console.log("f", f);
  }, [f]);

  const patchValue = () => {
    if (item) {
      //patchValue vào;
      if (item?.bankToBankInfo) {
        item.bankToBankInfo = item?.bankToBankInfo
          ? item?.bankToBankInfo?.split(",")
          : null;
      }
      item.instrTOpayingBank = item?.instrTOpayingBank
        ? item?.instrTOpayingBank?.split(",")
        : null;
      item.reasonAddittionalAmount = item?.reasonAddittionalAmount
        ? item?.reasonAddittionalAmount?.split(",")
        : null;
      item.docDate = item?.docDate
        ? moment(item?.docDate).format("YYYY-MM-DD")
        : null;
      item.enterDate = item?.enterDate
        ? moment(item?.enterDate).format("YYYY-MM-DD")
        : null;
      item.expiryDate = item?.expiryDate
        ? moment(item?.expiryDate).format("YYYY-MM-DD")
        : null;
      item.preadvDate = item?.preadvDate
        ? moment(item?.preadvDate).format("YYYY-MM-DD")
        : null;
      if (item?.listFee) {
        item.listFee = JSON.parse(item?.listFee);
      }
      setF(item);
    } else {
      //xử lý tạo mới form:
      setFByKey("pCentre", "NONE");
    }
  };

  function getCustomerInfo(cifCode) {
    request
      .post(api.GET_CUSTOMER_INFO, { cifCode: cifCode })
      .then((res) => {
        if (res && res?.data) {
          console.log("getCustomerInfo", res?.data);
          setFByKey("custName", res.data.custName);
          setFByKey("cifCode", res.data.cifCode);
          setFByKey("custAddress", res.data.address);
          setFByKey("custTel", res.data.phoneNo);
          console.log(res.data.address);
        }
      })
      .catch((e) => e);
  }

  function getListSwifts() {
    request
      .post(api.GET_ALL_SWIFT, {})
      .then((res) => {
        if (res && res?.length > 0) {
          setSwifts(res);
        }
      })
      .catch((e) => e);
  }

  function getListAccounts() {
    request
      .post(api.GET_LIST_ACCOUNTS_BY_CUSTOMER, {
        entityNumber: "123123",
      })
      .then((res) => {
        console.log(res);
        if (res && res?.responseCode === "00000000") {
          const accs = uniqBy(res?.responseBody, "account");
          accs.forEach((el) => {
            el.showLabel = el.account + " (" + el.currency + ")";
          });
          console.log(accs);
          setAccountsVND(accs);
        }
      })
      .catch((e) => e);
  }

  function OnChangesLC(value) {
    console.log(value, value === "WHOLLY");
    setGuaranteeAmount(f?.guaranteeAmount);
    setF({ ...f, guaranteeAmount: value });

    if (value === "WHOLLY") {
      const rsData = {
        ...f,
        guaranteeAmount: value,
        settlementInstruc1: "",
        guaranteeCurrency: "",
        guaranteePercent: "",
        inputCurrency: "",
        creditAgreementNumber: "",
        creditAgreementDate: "",
      };
      console.log(rsData);
      setF(rsData);
    }
  }

  useEffect(() => {
    console.log("useEffect LOc");
    console.log("f", f);
  }, [f.custName]);

  function setFByKey(prop, value) {
    const newData = { ...f };
    newData[prop] = value;
    setF(newData);

    // console.log(f[prop]);
  }

  function getDocument() {
    setFByKey("documentsRequired", htmlText);
  }

  function uploadFile($event) {
    let files = $event.target.files[0];
    if (!files || files.length < 1) {
      return;
    }

    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        if (!AppValidator.checkUploadFileExcelAndPdfAndWord(files[i])) {
          Toast(
            "Quý khách vui lòng chỉ nhập file PDF, Word hoặc Excel",
            TypeToast.WARNING
          );
          return;
        }
      }
    }

    if (listFile.length < 1 && files[0].size / 1024 / 1024 > 30) {
      if (!AppValidator.checkUploadFileExcelAndPdfAndWord(files[0])) {
        Toast(
          "File đính kèm phải có dung lượng nhỏ hơn" +
            AppValidator.MAX_SIZE_FILES_UPLOAD_LC +
            AppValidator.CAPACITY,
          TypeToast.WARNING
        );
        return;
      }
    }

    let fileSizes = 0;
    if (listFile.length > 0) {
      listFile.forEach((x) => {
        fileSizes += x.size;
      });
    }

    for (let i = 0; i < files.length; i++) {
      if (listFile?.length >= 20) {
        Toast(
          "Số lượng file đính kèm tối đa là 20 tập tin" +
            AppValidator.MAX_SIZE_FILES_UPLOAD_LC +
            AppValidator.CAPACITY,
          TypeToast.WARNING
        );
        return;
      }
      fileSizes += files[i].size;
      if (fileSizes / 1024 / 1024 > 30) {
        Toast(
          "File đính kèm phải có dung lượng nhỏ hơn" +
            AppValidator.MAX_SIZE_FILES_UPLOAD_LC +
            AppValidator.CAPACITY,
          TypeToast.WARNING
        );
        return;
      }
    }
  }

  function onSubmitLcOnline() {
    console.log(f);
    createContract();
  }

  function createContract() {
    // if (reportFile == null) {
    //   Toast("Vui lòng chọn file", TypeToast.WARNING);
    //   return;
    // }
    const payload = { ...f };
    console.log("f", f);
    payload.isCompact = chonPhuongThuc ? "N" : "Y";
    payload.amount = f?.amount?.toString()?.replace(/,/g, "");
    payload.sightAmy = f?.sightAmy?.toString()?.replace(/,/g, "");
    payload.sightAtm = f?.sightAtm?.toString()?.replace(/,/g, "");
    payload.additionalAmount = f?.additionalAmount
      ?.toString()
      ?.replace(/,/g, "");
    payload.redClause = f?.redClause?.toString()?.replace(/,/g, "");
    payload.bankToBankInfo = f?.bankToBankInfo?.toString()?.toString();
    payload.instrTOpayingBank = f?.instrTOpayingBank?.toString();
    payload.reasonAddittionalAmount = f?.reasonAddittionalAmount?.toString();
    payload.invoicevalueDraftAtValue = f?.invoicevalueDraftAtValue?.replace(
      /,/g,
      ""
    );

    payload.userId = authUser()?.id;
    payload.cifCode = "CIF001";
    console.log("payload", payload);
    payload.listFee = JSON.stringify(f?.listFee);
    payload.timeStartCreate = timeStartCreate;
    if (f.creditAgreementDate) {
      payload.creditAgreementDate = new Date(f.creditAgreementDate);
    }
    if (f.expiryDate) {
      payload.expiryDate = new Date(f.expiryDate);
    }
    if (f.latestDateDay) {
      payload.latestDateDay = new Date(f.latestDateDay);
    }
    console.log(payload);
    const formData = new FormData();
    formData.append("file", reportFile);
    formData.append(
      "info",
      new Blob([JSON.stringify(payload)], { type: "application/json" })
    );
    request
      .postFormData(api.NVTTT_CREATE_LC_CONTRACT, formData)
      .then((res) => {
        if (res?.errorCode == "1") {
          Toast(
            "Yêu cầu đã lưu thành công và chờ KSV xử lý",
            TypeToast.SUCCESS
          );
          passEntry();
        } else {
          Toast("Tạo mới thất bại", TypeToast.ERROR);
        }
      })
      .catch((e) => e);
  }

  const selectCustomer = (item) => {
    getCustomerInfo(item?.cifCode);
  };

  function onApprove(action) {
    console.log("action", action);
    setIsLoading(true);
    Swal.fire({
      icon: "question",
      title: "Phê duyệt thông tin",
      backdrop: true,
      allowOutsideClick: false,
      input: "file",
      inputAttributes: {
        "aria-label": "Upload your profile picture",
      },
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
      showLoaderOnConfirm: true,
    }).then((result) => {
      console.log("result", result);
      if (result.isConfirmed) {
        const json = {
          // ...item,
          contractId: item?.contractId,
          action: action,
        };
        const file = result?.value;
        // Nếu có file
        if (file) {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function () {
            json.attachedFile = reader.result;
            json.attachedFileName = file.name;

            // Để trong này vì nó bất đồng bộ
            approveTicket(json, action);
          };
        } else {
          approveTicket(json, action);
        }
      }
    });
  }

  const approveTicket = (json, action) => {
    request.post(api.GET_LC_ONLINE_APPROVE_V2, json).then((res) => {
      if (res?.errorCode == "1") {
        if (action === "approve") {
          if (["Activity_1"].includes(itemParent?.stepId)) {
            Toast("Nộp lại thành công", TypeToast.SUCCESS);
          } else {
            Toast("Phê duyệt thành công", TypeToast.SUCCESS);
          }
        } else {
          Toast("Trả về thành công", TypeToast.SUCCESS);
        }
        passEntry();
      } else {
        Toast(res?.errorDesc, TypeToast.ERROR);
      }
    });
  };

  const getBalance = () => {
    if (!f?.applicant) {
      Toast("Vui lòng điền STK muốn tìm kiếm", TypeToast.WARNING);
      return;
    }
    // ---
    request
      .post(api.GET_BALANCE_CUSTOMER, {
        accountNo: f?.applicant,
      })
      .then((res) => {
        const json = JSON?.parse(res?.data);
        if (json?.responseBody?.availableBalance) {
          console.log("json1", json);
          if (!json?.responseBody) {
            Toast("Call Api thất bại", TypeToast.ERROR);
            return;
          }
          // -----
          request
            .post(api.GET_CORE_ACCOUNT_INQUIRY_CUSTOMER, {
              accountNo: f?.applicant,
            })
            .then((res2) => {
              if (!res2?.data) {
                Toast("Call Api thất bại", TypeToast.ERROR);
                return;
              }
              const jsonAccountInfo = JSON?.parse(res2?.data);
              console.log("json2", jsonAccountInfo);
              request
                ?.post(api.GET_CORE_INFO_ACCOUNT, {
                  fakeResponse: "true",
                  organization: jsonAccountInfo?.responseBody?.ownerNumber,
                })
                .then((res3) => {
                  if (!res3?.data) {
                    Toast("Call Api thất bại", TypeToast.ERROR);
                    return;
                  }
                  const jsonOrganization = JSON?.parse(res3?.data);
                  setF({
                    ...f,
                    ...{
                      custName:
                        jsonOrganization?.responseBody?.organizationName,
                      custAddress: jsonOrganization?.responseBody?.address,
                      balance: json?.responseBody?.availableBalance,
                      custCurrency: jsonAccountInfo?.responseBody?.currency,
                    },
                  });
                  console.log(
                    "custCurrency",
                    jsonAccountInfo?.responseBody?.currency
                  );
                });
            });
        } else {
          Toast("STK Khách Hàng không chính xác", TypeToast.WARNING);
        }
      });
  };

  const getAdvisingBankBySearch = () => {};

  const onSelectRegistrationForm = (contractId) => {
    request
      .post(api.GET_LC_ONLINE_DETAIL, {
        contractId: contractId,
      })
      .then((res) => {
        if (res?.errorCode === "1") {
          console.log("res?.data", res?.data);
          //patchValue vào;
          const itemTemp = res?.data;
          if (itemTemp?.bankToBankInfo?.length > 0) {
            itemTemp.bankToBankInfo = itemTemp?.bankToBankInfo?.split(",");
          }
          if (itemTemp?.instrTOpayingBank?.length > 0) {
            itemTemp.instrTOpayingBank =
              itemTemp?.instrTOpayingBank?.split(",");
          }
          if (itemTemp?.reasonAddittionalAmount?.length > 0) {
            itemTemp.reasonAddittionalAmount = item?.reasonAddittionalAmount
              ? item?.reasonAddittionalAmount?.split(",")
              : [];
          }

          if (itemTemp?.bankToBankInfo?.length == 0) {
            itemTemp.bankToBankInfo = null;
          }
          if (itemTemp?.instrTOpayingBank?.length == 0) {
            itemTemp.instrTOpayingBank = null;
          }
          if (itemTemp?.reasonAddittionalAmount?.length == 0) {
            itemTemp.reasonAddittionalAmount = null;
          }

          itemTemp.docDate = itemTemp?.docDate
            ? moment(itemTemp?.issueDate).format("YYYY-MM-DD")
            : null;
          itemTemp.enterDate = itemTemp?.enterDate
            ? moment(itemTemp?.docDate).format("YYYY-MM-DD")
            : null;
          itemTemp.expiryDate = itemTemp?.expiryDate
            ? moment(itemTemp?.expiryDate).format("YYYY-MM-DD")
            : null;
          itemTemp.preadvDate = itemTemp?.preadvDate
            ? moment(itemTemp?.preadvDate).format("YYYY-MM-DD")
            : null;

          itemTemp.registrationForm = contractId;
          if (itemTemp?.listFee) {
            itemTemp.listFee = JSON.parse(itemTemp?.listFee);
          }
          itemTemp.reference = null;
          setF({ ...f, ...itemTemp });
          getChargesDetail(itemTemp);
        }
      });
  };

  function downloadFile(fileId) {
    const payload = {
      attachedFile: fileId,
    };
    console.log("fileId", fileId);
    request.postToExport(api.DOWNLOAD_FILE_LCONLINE, payload).then((res) => {
      // const arr = new Uint8Array(res);
      //   const blob = new Blob([arr], {type: 'application/xlsx'});
      //   const a = document.createElement('a');
      //   a.href = window.URL.createObjectURL(blob);
      //   a.download = "abc" + '.xlsx';
      //   a.style.display = 'none';
      //   document.body.appendChild(a);
      //   a.click();

      const blob = new Blob([res], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const a = document.createElement("a");

      a.href = window.URL.createObjectURL(blob);
      a.download =
        item?.attachedFileName +
        "_" +
        new Date().toDateString() +
        item.filetype;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
    });
  }

  function handleChangeFile(e) {
    if (!e.target.files) {
      return;
    }
    setReportFile(e.target.files[0]);
  }

  const get_day_of_time = (d1, d2) => {
    let ms1 = d1.getTime();
    let ms2 = d2.getTime();
    return Math.ceil((ms2 - ms1) / (24 * 60 * 60 * 1000));
  };

  const getChargesDetail = (itemTemp) => {
    // http://10.86.144.142:8122/api/portal/managementFee/checkFeeAndTranCode
    // console.log("f?.amount", f?.amount);
    // console.log("f?.amountDeposit", f?.amountDeposit);
    let charges;
    if (itemTemp) {
      charges = itemTemp;
    } else {
      charges = f;
    }
    if (
      !charges?.enterDate ||
      !charges?.expiryDate ||
      !charges?.seqCharges ||
      !charges?.marginDeposit
    ) {
      Toast(
        "Vui lòng điền enter Date và expiryDate, seq Charges ",
        TypeToast.WARNING
      );
      return;
    }
    let sumDay = get_day_of_time(
      new Date(charges?.enterDate),
      new Date(charges?.expiryDate)
    );

    let amountNew =
      charges?.marginDeposit === "1" ? charges?.amount : charges?.amountDeposit;
    amountNew = amountNew?.toString().replace(/,/g, "");
    const json = {
      amount: amountNew,
      tranCode: charges?.serviceType,
      day: sumDay,
      time: charges?.seqCharges ? charges?.seqCharges * 1.0 : 0,
    };

    request.post(api.CALL_CHARGES_FEE, json).then((res) => {
      // setFByKey("listFee", res?.data);
      setF({
        ...charges,
        ...{
          listFee: res?.data,
          finalTotal: 0,
        },
      });
    });
  };

  const tinhToanFinalTotal = () => {
    let sumAmount = 0;
    for (let i = 0; i < f?.listFee?.length; i++) {
      var item = f?.listFee?.[i];
      if (item?.check == true) {
        if (item?.gLTitle) {
          sumAmount = sumAmount + item?.gLTitle;
        } else {
          sumAmount = sumAmount + item?.amountFee;
        }
      }
    }
    setFByKey("finalTotal", sumAmount);
  };
  return (
    <React.Fragment>
      <div className="content mt-2">
        {/*{props.loading && <Loader/>}*/}
        <Row id="stepper1" className="bs-stepper col-12">
          {/* <div className="bs-stepper-header">
            <div className="step col-4 text-center" data-target="#test-l-1">
              <button className="step-trigger">
                <span className="bs-stepper-circle bg-step-sucess">1</span>
                <span className="bs-stepper-label d-none-xs color-step-sucess">
                  Tạo mới
                </span>
              </button>
              <img
                src={nextStep}
                alt="user-image"
                className="image-next-step"
              />
            </div>
            <div className="step col-4 text-center" data-target="#test-l-2">
              <button className="step-trigger">
                <span className="bs-stepper-circle {{indexStep > 1 ? 'bg-step-sucess' : '' }}">
                  2
                </span>
                <span className="bs-stepper-label d-none-xs {{indexStep > 1 ? 'color-step-sucess' : '' }}">
                  Xác thực
                </span>
              </button>
              <img
                src={nextStep}
                alt="user-image"
                className="image-next-step"
              />
            </div>
            <div className="step col-4 text-center" data-target="#test-l-3">
              <button className="step-trigger">
                <span className="bs-stepper-circle">3</span>
                <span className="bs-stepper-label d-none-xs">Hoàn thành</span>
              </button>
            </div>
          </div> */}
          <div className="bs-stepper-content mt-2">
            <div className="">
              <div className="col-12 border-bottom-dotted pt-2  mb-2 p-0"></div>
              <div>
                <div className="col-12 border-bottom-dotted pt-2  mb-2 p-0">
                  <span className="text-uppercase  m-font-600  theme-color">
                    APPLICATION FOR LC ISSUANCE
                  </span>
                </div>
                <div className="row">
                  <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <div className="row">
                      <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12  ">
                        <label className="col-form-label ml-4">
                          Application form
                        </label>
                      </div>
                      <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 z-index-12">
                        <SelectComponent
                          notFirstDefault
                          name={"status"}
                          list={listAllCodeLC}
                          bindLabel="label"
                          bindValue="value"
                          value={f?.registrationForm}
                          onChange={(item) => {
                            onSelectRegistrationForm(item?.value);
                          }}
                        />
                      </div>
                      <div className="col-xl-2 col-lg-2 col-md-2"></div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <div className="row">
                      <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12  ">
                        <label className="col-form-label ml-4">
                          Service Type
                        </label>
                      </div>

                      <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 z-index-11">
                        <SelectComponent
                          notFirstDefault
                          name={"status"}
                          list={listXuatNhapKhau}
                          bindLabel="label"
                          bindValue="value"
                          value={f?.serviceType}
                          onChange={(item) => {
                            setFByKey("serviceType", item.value);
                          }}
                        />
                      </div>
                      <div className="col-xl-2 col-lg-2 col-md-2"></div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <div className="row">
                      <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12  ">
                        <label className="col-form-label ml-4">Reference</label>
                        <span className="text-danger">*</span>:
                      </div>
                      <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 z-index-8">
                        <InputComponent
                          disabled
                          value={f?.reference}
                          onChange={(item) =>
                            setFByKey("reference", item.value)
                          }
                        ></InputComponent>
                      </div>
                      <div className="col-xl-2 col-lg-2 col-md-2"></div>
                    </div>
                  </div>
                </div>

                <form className="form-horizontal">
                  <div className="col-12 border-bottom-dotted pt-2  mb-2 p-0">
                    <span className="text-uppercase  m-font-600  theme-color">
                      Payment methods
                    </span>
                  </div>
                  <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                      <div className="row">
                        <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12 ">
                          <label className="col-form-label ml-4">
                            Product Type:
                          </label>
                        </div>
                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 z-index-10 ">
                          <SelectComponent
                            notFirstDefault
                            required
                            bindLabel={"label"}
                            bindValue={"value"}
                            list={productType}
                            value={f?.productType}
                            onChange={(item) => {
                              setFByKey("productType", item.value);
                            }}
                          ></SelectComponent>
                        </div>
                        <div className="col-xl-2 col-lg-2 col-md-2"></div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                      <div className="row">
                        <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12  ">
                          <label className="col-form-label ml-4">
                            Sub Product Type:
                            <span className="text-danger">*</span>:
                          </label>
                        </div>
                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 z-index-9">
                          <SelectComponent
                            notFirstDefault
                            required
                            bindLabel={"label"}
                            bindValue={"value"}
                            value={f?.subProductType2}
                            list={subProductType2}
                            onChange={(item) => {
                              setFByKey("subProductType2", item.value);
                            }}
                          ></SelectComponent>
                        </div>
                        <div className="col-xl-2 col-lg-2 col-md-2"></div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 mt-2">
                      <div className="row">
                        <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12  ">
                          <label className="col-form-label ml-4">
                            Branch
                            <span className="text-danger">*</span>:
                          </label>
                        </div>
                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 z-index-8">
                          <SelectComponent
                            notFirstDefault
                            required
                            name={"branch"}
                            list={branches}
                            bindLabel={"branchName"}
                            bindValue={"brId"}
                            value={f.branchId}
                            onChange={(item) => {
                              setFByKey("branchId", item.value);
                              console.log("item", item);
                              console.log("branches", branches);
                              const list = branches?.filter(
                                (t) => t.parentBr === item?.brId
                              );
                              console.log("list", list);
                              setListSubBranch(
                                branches?.filter(
                                  (t) => t.parentBr === item?.brId
                                )
                              );
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 mt-2">
                      <div className="row">
                        <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12  ">
                          <label className="col-form-label ml-4">
                            Sub Branch
                            <span className="text-danger">*</span>:
                          </label>
                        </div>
                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 z-index-7">
                          <SelectComponent
                            notFirstDefault
                            required
                            name={"branch"}
                            list={listSubBranch}
                            bindLabel={"branchName"}
                            bindValue={"brId"}
                            value={f.subBranch}
                            onChange={(item) =>
                              setFByKey("subBranch", item.value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 mt-2">
                      <div className="row">
                        <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12  ">
                          <label className="col-form-label ml-4">
                            PCentre(Profit Centre)
                            <span className="text-danger">*</span>:
                          </label>
                        </div>
                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 z-index-5">
                          <SelectComponent
                            notFirstDefault
                            required
                            name={"pCentre"}
                            bindLabel={"label"}
                            bindValue={"value"}
                            list={listPCentre}
                            value={f.pCentre}
                            onChange={(item) =>
                              setFByKey("pCentre", item?.value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 mt-2">
                      <div className="row">
                        <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12  ">
                          <label className="col-form-label ml-4">
                            Doc Date
                            <span className="text-danger">*</span>:
                          </label>
                        </div>
                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                          <InputComponent
                            type="date"
                            value={f?.docDate}
                            onChange={(value) => {
                              setFByKey("docDate", value);
                            }}
                          ></InputComponent>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    {/*Thông tin khách hàng*/}
                    <div className="col-12 border-bottom-dotted pt-2  mb-2 p-0">
                      <span className="text-uppercase  m-font-600  theme-color">
                        Customer information:
                      </span>
                    </div>
                    <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12  ">
                      <label className="col-form-label ml-3">Applicant</label>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                      <div className="input-group">
                        <input
                          className="form-control"
                          maxLength="100"
                          placeholder="Enter applicant"
                          name="applicant"
                          value={f?.applicant}
                          onChange={($event) =>
                            setFByKey("applicant", $event.target.value)
                          }
                        />
                        <Button
                          className="btn btn-primary ml-2"
                          onClick={() => {
                            console.log("call API");
                            getBalance();
                          }}
                        >
                          Kiểm tra
                        </Button>
                      </div>

                      {/* <SelectComponent
                        name={""}
                        
                        list={customerList}
                        bindLabel={"custName"}
                        bindValue={"custId"}
                        value={f.applicant}
                        onChange={(item) => {
                          console.log("item", item);
                          const newF = {
                            ...f,
                            ...{
                              applicant: item?.value,
                              custName: item?.custName,
                              custAddress: item?.address,
                            },
                          };
                          setF(newF);
                        }}
                      /> */}
                    </div>

                    <div className="row">
                      <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12   mt-2">
                        <label className="col-form-label ml-4">
                          Customer's name
                          <span className="text-danger">*</span>:
                        </label>
                      </div>

                      <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-sm-2">
                        <input
                          className="form-control text-uppercase"
                          type="text"
                          value={f?.custName}
                          placeholder="Enter customer name"
                          name={"custName"}
                          onChange={($event) =>
                            setFByKey("custName", $event.target.value)
                          }
                        />
                      </div>

                      <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12   mt-2">
                        <label className="col-form-label ml-4">
                          Balance
                          <span className="text-danger">*</span>:
                        </label>
                      </div>
                      <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-sm-2">
                        <CurrencyFormat
                          className="form-control"
                          min="0"
                          maxLength="2"
                          max="99"
                          allowNegative={true}
                          thousandSeparator={true}
                          value={f?.balance || 0}
                          onChange={($event) => {
                            setFByKey("balance", $event.target.value);
                          }}
                        />
                      </div>
                      <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12   mt-2">
                        <label className="col-form-label ml-4">
                          Currency
                          <span className="text-danger">*</span>:
                        </label>
                      </div>
                      <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-sm-2">
                        <input
                          pattern="'^[-a-zA-Z0-9 \' : - + ‘ / ( ) … . , ? \‘ \’ \t –]+$'"
                          className="form-control text-uppercase"
                          maxLength="255"
                          type="text"
                          onChange={($event) =>
                            setFByKey("custCurrency", $event.target.value)
                          }
                          placeholder="Enter currency"
                          value={f?.custCurrency}
                        />
                      </div>
                      <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12   mt-2">
                        <label className="col-form-label ml-4">
                          Address
                          <span className="text-danger">*</span>:
                        </label>
                      </div>
                      <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-sm-2">
                        <input
                          pattern="'^[-a-zA-Z0-9 \' : - + ‘ / ( ) … . , ? \‘ \’ \t –]+$'"
                          className="form-control text-uppercase"
                          maxLength="255"
                          type="text"
                          onChange={($event) =>
                            setFByKey("custAddress", $event.target.value)
                          }
                          placeholder="Enter address"
                          value={f?.custAddress}
                        />
                      </div>

                      <div className="col-12 border-bottom-dotted pt-2  mb-2 p-0 ml-2">
                        <span className="text-uppercase  m-font-600  theme-color">
                          LETTER OF CREDIT - LC
                        </span>
                      </div>
                      <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12   mt-2">
                        <label className="col-form-label ml-4">
                          Applicant Bank:
                        </label>
                      </div>
                      <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-2 z-index-10">
                        <SelectComponent
                          notFirstDefault
                          name={""}
                          list={swifts}
                          bindLabel={"unqBankIdentifier"}
                          bindValue={"unqBankIdentifier"}
                          value={f.advisingBankSwiftCode}
                          onChange={(item) =>
                            setFByKey("advisingBankSwiftCode", item.value)
                          }
                        />
                      </div>
                      <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12   mt-2">
                        <label className="col-form-label ml-4">
                          Enter Date
                          <span className="text-danger">*</span>:
                        </label>
                      </div>
                      <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-sm-2">
                        <input
                          className="form-control text-uppercase"
                          maxLength="255"
                          type="date"
                          onChange={($event) =>
                            setFByKey("enterDate", $event.target.value)
                          }
                          value={f.enterDate}
                        />
                      </div>
                      <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12   mt-2">
                        <label className="col-form-label ml-4">
                          Expiry Date:
                          <span className="text-danger">*</span>:
                        </label>
                      </div>
                      <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-sm-2">
                        <input
                          className="form-control text-uppercase"
                          maxLength="255"
                          type="date"
                          onChange={($event) =>
                            setFByKey("expiryDate", $event.target.value)
                          }
                          value={f.expiryDate}
                        />
                      </div>
                      {/* <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12   mt-2">
                        <label className="col-form-label ml-4">
                          Expired place:
                        </label>
                      </div>
                      <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-2 z-index-8">
                        <SelectComponent
                          notFirstDefault
                          name={""}
                          list={swifts}
                          bindLabel={"label"}
                          bindValue={"value"}
                          value={f.expiredPlace}
                          onChange={(item) =>
                            setFByKey("expiredPlace", item.value)
                          }
                        />
                      </div> */}
                      <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12   mt-2">
                        <label className="col-form-label ml-4">Location:</label>
                      </div>
                      <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-2 ">
                        <input
                          className="form-control text-uppercase"
                          maxLength="255"
                          type="text"
                          placeholder="IN + Country"
                          onChange={($event) =>
                            setFByKey("location", $event.target.value)
                          }
                          value={f.location}
                        />
                      </div>
                      <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12   mt-2">
                        <label className="col-form-label ml-4">
                          Applicable Rules:
                        </label>
                      </div>
                      <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-2 z-index-7">
                        <SelectComponent
                          notFirstDefault
                          name={""}
                          list={listApplicantRule}
                          bindLabel={"label"}
                          bindValue={"value"}
                          value={f.applicantRule}
                          onChange={(item) =>
                            setFByKey("applicantRule", item.value)
                          }
                        />
                      </div>
                      {f?.applicantRule === "OTHERS" && (
                        <>
                          <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12   mt-2">
                            <label className="col-form-label ml-4">
                              Enter other applicant rule:
                            </label>
                          </div>
                          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-2 ">
                            <input
                              className="form-control text-uppercase"
                              maxLength="255"
                              type="text"
                              onChange={($event) =>
                                setFByKey(
                                  "applicantRulOther",
                                  $event.target.value
                                )
                              }
                              value={f.applicantRulOther}
                            />
                          </div>
                        </>
                      )}
                      <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12   mt-2">
                        <label className="col-form-label ml-4">
                          Currency
                          <span className="text-danger">*</span>:
                        </label>
                      </div>
                      <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-2 z-index-6 ">
                        <SelectComponent
                          notFirstDefault
                          name={"currency"}
                          list={currencyList}
                          bindLabel={"label"}
                          bindValue={"value"}
                          value={f.currency}
                          onChange={(item) => setFByKey("currency", item.value)}
                        />
                      </div>
                      <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12   mt-2">
                        <label className="col-form-label ml-4">Amount :</label>
                      </div>
                      <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-2 ">
                        <CurrencyFormat
                          className="form-control text-uppercase"
                          allowNegative={true}
                          thousandSeparator={true}
                          value={f?.amount || 0}
                          type="text"
                          placeholder="Nhập số tiền"
                          onChange={($event) =>
                            setFByKey("amount", $event.target.value)
                          }
                          pattern="^[0-9]*[1-9][0-9]*$"
                        />
                      </div>
                      {f.productType === "LCNKHH" && (
                        <div className="row col-12">
                          <div
                            className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12   mt-2"
                            hidden={f.productType !== "LCNKHH"}
                          >
                            <label className="col-form-label ml-4">
                              S/U Amt (Sight/Usance Amount)
                            </label>
                          </div>

                          <div className="row  col-12 ">
                            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12   mt-2">
                              <label className="col-form-label ml-4">
                                Sight Amount
                              </label>
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-2 ml-2">
                              <CurrencyFormat
                                className="form-control text-uppercase"
                                allowNegative={true}
                                thousandSpacing={"0"}
                                thousandSeparator={true}
                                value={f.sightAmy || 0}
                                type="text"
                                placeholder="Nhập số tiền"
                                onChange={($event) =>
                                  setFByKey("sightAmy", $event.target.value)
                                }
                                pattern="^[0-9]*[1-9][0-9]*$"
                              />
                            </div>
                          </div>
                          <div className="row col-12 mt-2">
                            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12   ">
                              <label className="col-form-label ml-4">
                                Usance Amount
                              </label>
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12  ">
                              <CurrencyFormat
                                className="form-control text-uppercase ml-2"
                                allowNegative={true}
                                thousandSpacing={"0"}
                                thousandSeparator={true}
                                value={f.sightAtm || 0}
                                type="text"
                                placeholder="Nhập số tiền"
                                onChange={($event) =>
                                  setFByKey("sightAtm", $event.target.value)
                                }
                                pattern="^[0-9]*[1-9][0-9]*$"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12   mt-2">
                        <label className="col-form-label ml-4">
                          Tolerance (if any):
                        </label>
                      </div>
                      <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-sm-2">
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="fas fa-plus fa-lg text-primary"></i>
                          </span>
                          <input
                            className="form-control"
                            value={f.tolerance1}
                            min="0"
                            maxLength="2"
                            type="number"
                            max="99"
                            onChange={($event) =>
                              setFByKey("tolerance1", $event.target.value)
                            }
                          />
                          <span className="input-group-text alert-light">
                            <i className="fa-lg">/</i>
                          </span>
                          <span className="input-group-text">
                            <i className="fas fa-minus fa-lg text-primary"></i>
                          </span>
                          <input
                            className="form-control"
                            value={f.tolerance2}
                            maxLength="2"
                            type="number"
                            min="0"
                            max="99"
                            onChange={($event) =>
                              setFByKey("tolerance2", $event.target.value)
                            }
                          />
                        </div>
                      </div>

                      <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12  mt-2">
                        <label className="col-form-label ml-4">
                          Additional Amount Covered:
                        </label>
                      </div>
                      <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-2 z-index-5">
                        <div className="">
                          <SelectComponent
                            required
                            notFirstDefault
                            name={"reasonAddittionalAmount"}
                            isMulti
                            list={reasonAddittionalAmount}
                            bindLabel={"label"}
                            bindValue={"value"}
                            value={f?.reasonAddittionalAmount}
                            onChange={(val) => {
                              console.log("");
                              setFByKey(
                                "reasonAddittionalAmount",
                                val?.map((t) => t?.value)
                              );
                            }}
                          ></SelectComponent>
                        </div>

                        {f?.reasonAddittionalAmount?.includes("khac") && (
                          <div className="mt-2">
                            <input
                              placeholder="Nhập tên loại tiền khác"
                              className="form-control"
                              value={f.reasonAddittionalAmountOther}
                              type="text"
                              onChange={($event) =>
                                setFByKey(
                                  "reasonAddittionalAmountOther",
                                  $event.target.value
                                )
                              }
                            />
                          </div>
                        )}

                        <div className="mt-2 ">
                          <CurrencyFormat
                            className="form-control text-uppercase "
                            allowNegative={true}
                            thousandSpacing={"0"}
                            thousandSeparator={true}
                            value={f?.additionalAmount || 0}
                            type="text"
                            placeholder="Nhập số tiền"
                            onChange={($event) =>
                              setFByKey("additionalAmount", $event.target.value)
                            }
                            pattern="^[0-9]*[1-9][0-9]*$"
                          />
                        </div>
                      </div>

                      <div className="row  col-12">
                        <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12   mt-2">
                          <label className="col-form-label ml-4">
                            Transferable:
                          </label>
                        </div>
                        <div className="col-xl-8 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                          <div className="mt-1 mb-2 ml-1">
                            <div className="custom-control custom-radio d-inline mr-4">
                              <input
                                type="radio"
                                id="Transferable1"
                                checked={f.transferable === "true"}
                                onChange={($event) => {
                                  console.log(
                                    "transferable",
                                    $event.target.value
                                  );
                                  setFByKey(
                                    "transferable",
                                    $event.target.value
                                  );
                                }}
                                name="transferable"
                                className="custom-control-input m-cursor"
                                value={true}
                              />
                              <label
                                className="custom-control-label m-cursor"
                                htmlFor="Transferable1"
                              >
                                LC allows transfer
                              </label>
                            </div>
                            <div className="custom-control custom-radio d-inline">
                              <input
                                type="radio"
                                id="Transferable2"
                                checked={f.transferable === "false"}
                                onChange={($event) => {
                                  console.log(
                                    "transferable",
                                    $event.target.value
                                  );
                                  setFByKey(
                                    "transferable",
                                    $event.target.value
                                  );
                                }}
                                name="transferable"
                                className="custom-control-input m-cursor"
                                value={false}
                              />
                              <label
                                className="custom-control-label m-cursor"
                                htmlFor="Transferable2"
                              >
                                LC not transferable
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                        <div className="row">
                          <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12  ">
                            <label className="col-form-label ml-4">
                              Revolving L/C:
                            </label>
                          </div>

                          <div className="col-xl-8 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                            <div className="mt-1 mb-2">
                              <div className="custom-control custom-radio d-inline mr-4">
                                <input
                                  type="radio"
                                  id="guaranteeAmount3"
                                  value="true"
                                  checked={f.revolvingLC === "true"}
                                  onChange={($event) => {
                                    console.log(
                                      "revolvingLC",
                                      $event.target.value
                                    );
                                    setFByKey(
                                      "revolvingLC",
                                      $event.target.value
                                    );
                                  }}
                                  name="revolvingLC"
                                  className="custom-control-input m-cursor"
                                />
                                <label
                                  className="custom-control-label m-cursor"
                                  htmlFor="guaranteeAmount3"
                                >
                                  Revolving L/C
                                </label>
                              </div>
                              <div className="custom-control custom-radio d-inline">
                                <input
                                  type="radio"
                                  id="guaranteeAmount4"
                                  value="false"
                                  checked={f.revolvingLC === "false"}
                                  onChange={($event) => {
                                    console.log(
                                      "revolvingLC",
                                      $event.target.value
                                    );
                                    setFByKey(
                                      "revolvingLC",
                                      $event.target.value
                                    );
                                  }}
                                  name="revolvingLC"
                                  className="custom-control-input m-cursor"
                                />
                                <label
                                  className="custom-control-label m-cursor"
                                  htmlFor="guaranteeAmount4"
                                >
                                  Not a revolving L/C
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12   mt-2">
                            <label className="col-form-label ml-4">
                              Back to Back:
                            </label>
                          </div>
                          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-2 ">
                            <input
                              className="form-control text-uppercase"
                              maxLength="255"
                              type="text"
                              onChange={($event) =>
                                setFByKey("backToBack", $event.target.value)
                              }
                              value={f.backToBack}
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12   mt-2">
                            <label className="col-form-label ml-4">
                              Red clause:
                            </label>
                          </div>
                          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-2 ">
                            <CurrencyFormat
                              className="form-control text-uppercase"
                              allowNegative={true}
                              thousandSpacing={"0"}
                              thousandSeparator={true}
                              value={f?.redClause || 0}
                              onChange={($event) =>
                                setFByKey("redClause", $event.target.value)
                              }
                              pattern="^[0-9]*[1-9][0-9]*$"
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12   mt-2">
                            <label className="col-form-label ml-4">
                              Restrict:
                            </label>
                          </div>
                          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-2 z-index-12 ">
                            {/* <input
                              className="form-control text-uppercase"
                              maxLength="255"
                              type="text"
                              onChange={($event) =>
                                setFByKey("restrict", $event.target.value)
                              }
                              value={f.restrict}
                            /> */}
                            <SelectComponent
                              notFirstDefault
                              name={""}
                              list={swifts}
                              bindLabel={"unqBankIdentifier"}
                              bindValue={"unqBankIdentifier"}
                              value={f.restrict}
                              onChange={(item) => {
                                setFByKey("restrict", item.value);
                              }}
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12   mt-2">
                            <label className="col-form-label ml-4">
                              Beneficiary
                              <span className="text-danger">*</span>:
                            </label>
                          </div>
                          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-sm-2">
                            <input
                              className="form-control text-uppercase"
                              pattern="'^[-a-zA-Z0-9 \' : - + ‘ / ( ) … . , \‘ \’ \t –]+$'"
                              onChange={($event) =>
                                setFByKey("beneficiary1", $event.target.value)
                              }
                              value={f.beneficiary1}
                              type="text"
                              placeholder="Enter name and address"
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12   mt-2">
                            <label className="col-form-label ml-4">
                              Country
                              <span className="text-danger">*</span>:
                            </label>
                          </div>
                          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-sm-2 z-index-11">
                            <SelectComponent
                              notFirstDefault
                              required
                              name={"nation"}
                              list={ListCountry}
                              bindLabel={"label"}
                              bindValue={"value"}
                              value={f.nation}
                              onChange={(val) => {
                                console.log("");
                                setFByKey("nation", val.value);
                              }}
                            ></SelectComponent>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12   mt-2">
                            <label className="col-form-label ml-4">
                              Advising bank
                              <span className="text-danger">*</span>:
                            </label>
                          </div>
                          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-sm-2 z-index-10">
                            {/* <div className="input-group"> */}
                            {/* <input
                                className="form-control"
                                maxLength="100"
                                placeholder="Nhập SWIFT CODE"
                                name="applicant"
                                value={f?.advisingBankSearch}
                                onChange={($event) =>
                                  setFByKey(
                                    "advisingBankSearch",
                                    $event.target.value
                                  )
                                }
                              /> */}
                            <SelectComponent
                              notFirstDefault
                              name={""}
                              list={swifts}
                              bindLabel={"unqBankIdentifier"}
                              bindValue={"unqBankIdentifier"}
                              value={f?.advisingBankSearch}
                              onChange={(item) => {
                                const swift = swifts.find(
                                  (t) => t.unqBankIdentifier === item.value
                                );
                                if (!swift) {
                                  Toast(
                                    "Không tìm thấy thông tin vui nhập lại lại",
                                    TypeToast.WARNING
                                  );
                                } else {
                                  setF({
                                    ...f,
                                    ...{
                                      advisingBank1:
                                        "Name:" +
                                        swift?.institueName +
                                        "\n" +
                                        "Address: " +
                                        swift?.address,
                                      advisingBankSearch: item.value,
                                    },
                                  });
                                  // setFByKey(
                                  //   "advisingBank1",
                                  //   "Name: " +
                                  //     swift?.institueName +
                                  //     "\n" +
                                  //     "Address: " +
                                  //     swift?.address
                                  // );
                                }
                              }}
                            />
                            {/* <Button
                                className="btn btn-primary ml-2"
                                onClick={() => {
                                  console.log("call API");
                                  const swift = swifts.find(
                                    (t) =>
                                      t.unqBankIdentifier ===
                                      f?.advisingBankSearch
                                  );
                                  if (!swift) {
                                    Toast(
                                      "Không tìm thấy thông tin vui nhập lại lại",
                                      TypeToast.WARNING
                                    );
                                  } else {
                                    setFByKey(
                                      "advisingBank1",
                                      "Name: " +
                                        swift?.institueName +
                                        "\n" +
                                        "Address: " +
                                        swift?.address
                                    );
                                  }

                                  getAdvisingBankBySearch();
                                }}
                              >
                                Tìm kiếm
                              </Button> */}
                            {/* </div> */}
                            <textarea
                              className="form-control text-uppercase mt-2"
                              pattern="'^[-a-zA-Z0-9 \' : - + ‘ / ( ) … . , ‘ \‘ \’ \t –]+$'"
                              maxLength="35"
                              type="text"
                              value={f.advisingBank1}
                              placeholder="Enter name and address"
                              onChange={($event) =>
                                setFByKey("advisingBank1", $event.target.value)
                              }
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12   mt-2">
                            <label className="col-form-label ml-4">
                              Reimbursing bank:
                            </label>
                          </div>
                          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-2 z-index-8">
                            <SelectComponent
                              notFirstDefault
                              name={""}
                              list={swifts}
                              bindLabel={"institueName"}
                              bindValue={"unqBankIdentifier"}
                              value={f.reimbursingBank}
                              onChange={(item) =>
                                setFByKey("reimbursingBank", item.value)
                              }
                            />
                          </div>
                        </div>
                        <div className="row">
                          {/*10. Ngày giao hàng chậm nhất/Thời gian giao hàng*/}
                          <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12  mt-2">
                            <label className="col-form-label ml-4">
                              Latest date of shipment/Shipment period:
                            </label>
                          </div>
                          <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-sm-2 align-items-center d-flex">
                            <div className="custom-control custom-radio d-inline mr-4">
                              <input
                                type="radio"
                                id="latest"
                                value="LATEST DATE OF SHIPMENT"
                                name="latestDate"
                                className="custom-control-input m-cursor"
                                checked={
                                  f.latestDate === "LATEST DATE OF SHIPMENT"
                                }
                                onChange={($event) =>
                                  setFByKey("latestDate", $event.target.value)
                                }
                              />
                              <label
                                className="custom-control-label m-cursor"
                                htmlFor="latest"
                              >
                                Latest date of shipment
                              </label>
                            </div>
                          </div>

                          {f.latestDate === "LATEST DATE OF SHIPMENT" && (
                            <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-sm-2 align-items-center">
                              <InputComponent
                                name="latestDateDay"
                                value={f.latestDateDay}
                                type="date"
                                onChange={(val) =>
                                  setFByKey("latestDateDay", val)
                                }
                              />
                            </div>
                          )}

                          {f?.latestDate === "SHIPMENT PERIOD" && (
                            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12">
                              <label className="col-form-label"></label>
                            </div>
                          )}

                          <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12  ">
                            <label className="col-form-label"></label>
                          </div>

                          <div className="col-xl-5 col-lg-6 col-md-6 col-sm-6 col-xs-12 align-items-center d-flex">
                            <div className="custom-control custom-radio d-inline mr-4">
                              <input
                                type="radio"
                                id="period"
                                value="SHIPMENT PERIOD"
                                name="latestDate"
                                className="custom-control-input m-cursor"
                                checked={f.latestDate === "SHIPMENT PERIOD"}
                                onChange={($event) =>
                                  setFByKey("latestDate", $event.target.value)
                                }
                              />
                              <label
                                className="custom-control-label m-cursor"
                                htmlFor="period"
                              >
                                Shipment period
                                {f?.latestDate?.value === "SHIPMENT PERIOD" && (
                                  <span className="text-danger">*</span>
                                )}
                              </label>
                            </div>
                          </div>

                          {f?.latestDate === "SHIPMENT PERIOD" && (
                            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12 ">
                              <label className="col-form-label"></label>
                            </div>
                          )}

                          {f?.latestDate === "SHIPMENT PERIOD" && (
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-2">
                              <textarea
                                maxLength="300"
                                className="form-control text-uppercase"
                                onChange={($event) =>
                                  setFByKey(
                                    "latestDateOthers",
                                    $event.target.value
                                  )
                                }
                              ></textarea>
                            </div>
                          )}

                          {f?.latestDate === "SHIPMENT PERIOD" && (
                            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12  ">
                              <label className="col-form-label"></label>
                            </div>
                          )}
                        </div>

                        <div className="row">
                          <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12   mt-2">
                            <label className="col-form-label ml-4">
                              Preadv No:
                            </label>
                          </div>
                          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-sm-2">
                            <input
                              className="form-control text-uppercase"
                              type="text"
                              value={f.preadvNo}
                              onChange={($event) =>
                                setFByKey("preadvNo", $event.target.value)
                              }
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12   mt-2">
                            <label className="col-form-label ml-4">
                              Preadv Date:
                            </label>
                          </div>
                          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-sm-2">
                            <input
                              className="form-control text-uppercase"
                              type="date"
                              value={f.preadvDate}
                              onChange={($event) =>
                                setFByKey("preadvDate", $event.target.value)
                              }
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12   mt-2">
                            <label className="col-form-label ml-4">
                              Advice Type:
                            </label>
                          </div>
                          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-2 z-index-8">
                            <SelectComponent
                              notFirstDefault
                              name={""}
                              list={listAdviceType}
                              bindLabel={"label"}
                              bindValue={"value"}
                              value={f.adviceType}
                              onChange={(item) =>
                                setFByKey("adviceType", item.value)
                              }
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12   mt-2">
                            <label className="col-form-label ml-4">
                              Available type:
                            </label>
                          </div>
                          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-2 z-index-7">
                            <SelectComponent
                              notFirstDefault
                              name={""}
                              list={listAvailableType}
                              bindLabel={"label"}
                              bindValue={"value"}
                              value={f.paymentBy}
                              onChange={(item) => {
                                console.log("paymentBy", item.value);
                                setFByKey("paymentBy", item.value);
                              }}
                            />
                          </div>
                        </div>
                        {
                          f.paymentBy === "BYDEFERREDPAYMENT" && (
                            // !(f?.pay && f?.pay2) && (
                            <div className="col-12">
                              <div className="row">
                                <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12   mt-2">
                                  <label className="col-form-label ml-3">
                                    Deferred payment details
                                  </label>
                                </div>
                                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-sm-2">
                                  <div className="input-group">
                                    <textarea
                                      maxLength="140"
                                      value={f.paymentByDeffered}
                                      className="form-control text-uppercase"
                                      onChange={($event) =>
                                        setFByKey(
                                          "paymentByDeffered",
                                          $event.target.value
                                        )
                                      }
                                    ></textarea>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )

                          // )
                        }
                        {
                          f?.paymentBy === "BYMIXEDPAYMENT" && (
                            // !(f?.pay && f?.pay2) && (
                            <div className="col-12">
                              <div className="row">
                                <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12   mt-2">
                                  <label className="col-form-label ml-3">
                                    Mixed payment details:
                                  </label>
                                </div>
                                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-sm-2">
                                  <div className="input-group">
                                    <textarea
                                      value={f.paymentByMix}
                                      className="form-control text-uppercase"
                                      maxLength="6500"
                                      onChange={($event) =>
                                        setFByKey(
                                          "paymentByMix",
                                          $event.target.value
                                        )
                                      }
                                    ></textarea>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                          // )
                        }
                        {!["BYMIXEDPAYMENT", "BYDEFERREDPAYMENT"].includes(
                          f?.paymentBy
                        ) && (
                          <div className="col-12">
                            <div className="row">
                              <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12   mt-2">
                                <label className="col-form-label ml-3">
                                  Draft at:
                                </label>
                              </div>
                              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-sm-2 z-index-6">
                                <SelectComponent
                                  notFirstDefault
                                  name={""}
                                  list={[
                                    {
                                      label: "Sight",
                                      value: "Sight",
                                    },
                                  ]}
                                  bindLabel={"label"}
                                  bindValue={"value"}
                                  value={f.draftAt}
                                  onChange={(item) => {
                                    console.log("draftAt", item.value);
                                    setFByKey("draftAt", item.value);
                                  }}
                                />
                              </div>
                            </div>
                            {f?.draftAt && (
                              <div className="row">
                                <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12   mt-2"></div>{" "}
                                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-sm-2">
                                  <textarea
                                    value={f.draftAtSub}
                                    className="form-control text-uppercase"
                                    maxLength="6500"
                                    onChange={($event) =>
                                      setFByKey(
                                        "draftAtSub",
                                        $event.target.value
                                      )
                                    }
                                  ></textarea>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        <div className="row  col-12">
                          <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12   mt-2">
                            <label className="col-form-label ml-3">For</label>
                          </div>
                          <div className="col-xl-8 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                            <div className="mt-1 mb-2">
                              <div className="custom-control custom-radio d-inline mr-4">
                                <input
                                  type="radio"
                                  id="invoicevalue1"
                                  value="true"
                                  checked={f.invoicevalueDraftAt === "true"}
                                  onChange={($event) => {
                                    setFByKey("invoiceValue", "100");
                                    setFByKey(
                                      "invoicevalueDraftAt",
                                      $event.target.value
                                    );
                                  }}
                                  name="invoicevalueDraftAt"
                                  className="custom-control-input m-cursor"
                                />
                                <label
                                  className="custom-control-label m-cursor"
                                  htmlFor="invoicevalue1"
                                >
                                  100% invoice value
                                </label>
                              </div>
                              <div className="custom-control custom-radio d-inline">
                                <input
                                  type="radio"
                                  id="invoicevalue2"
                                  value="false"
                                  checked={f.invoicevalueDraftAt === "false"}
                                  onChange={($event) => {
                                    setFByKey(
                                      "invoicevalueDraftAt",
                                      $event.target.value
                                    );
                                  }}
                                  name="invoicevalueDraftAt"
                                  className="custom-control-input m-cursor"
                                />
                                <label
                                  className="custom-control-label m-cursor"
                                  htmlFor="invoicevalue2"
                                >
                                  % invoice value
                                </label>
                                {f.invoicevalueDraftAt == "false" && (
                                  <CurrencyFormat
                                    className="form-control text-uppercase"
                                    allowNegative={true}
                                    thousandSpacing={"0"}
                                    thousandSeparator={true}
                                    value={f?.invoicevalueDraftAtValue || 0}
                                    type="text"
                                    onChange={($event) =>
                                      setFByKey(
                                        "invoicevalueDraftAtValue",
                                        $event.target.value
                                      )
                                    }
                                    pattern="^[0-9]*[1-9][0-9]*$"
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        {!["BYMIXEDPAYMENT", "BYDEFERREDPAYMENT"].includes(
                          f?.paymentBy
                        ) && (
                          <div className="col-12 p-0">
                            <div className="row">
                              <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12   mt-2">
                                <label className="col-form-label ml-4">
                                  Drawn on
                                </label>
                              </div>
                              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-sm-2 align-items-center d-flex">
                                <div className="custom-control custom-radio d-inline mr-4">
                                  <input
                                    type="radio"
                                    id="vietnamacb"
                                    value="VIETNAM ACB"
                                    name="drawee"
                                    className="custom-control-input m-cursor"
                                    checked={f.drawee === "VIETNAM ACB"}
                                    onChange={($event) =>
                                      setFByKey("drawee", $event.target.value)
                                    }
                                  />
                                  <label
                                    className="custom-control-label m-cursor"
                                    htmlFor="vietnamacb"
                                  >
                                    Vietnam ACB
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12   mt-2">
                                <label className="col-form-label"></label>
                              </div>
                              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-sm-2 align-items-center d-flex">
                                <div className="custom-control custom-radio d-inline mr-4">
                                  <input
                                    type="radio"
                                    id="otherbank"
                                    value={"Others bank"}
                                    name="drawee"
                                    className="custom-control-input m-cursor"
                                    checked={f.drawee === "Others bank"}
                                    onChange={($event) =>
                                      setFByKey("drawee", $event.target.value)
                                    }
                                  />
                                  <label
                                    className="custom-control-label m-cursor"
                                    htmlFor="otherbank"
                                  >
                                    Other bank
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              {f.drawee === "Others bank" && (
                                <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12   mt-2">
                                  <label className="col-form-label"></label>
                                </div>
                              )}
                              {f.drawee === "Others bank" && (
                                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-sm-2">
                                  <textarea
                                    className="form-control text-uppercase"
                                    value={f.draweeOthers}
                                    placeholder="Enter addres Swift Code"
                                    maxLength="255"
                                    onChange={($event) =>
                                      setFByKey(
                                        "draweeOthers",
                                        $event.target.value
                                      )
                                    }
                                  ></textarea>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        <div className="row">
                          <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12   mt-2">
                            <label className="col-form-label ml-4">
                              Shipping terms
                              <span className="text-danger">*</span>:
                            </label>
                          </div>
                          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-2 z-index-5">
                            <SelectComponent
                              notFirstDefault
                              name={"shippingTerm"}
                              list={shippingTermList}
                              bindLabel={"label"}
                              bindValue={"value"}
                              value={f?.shippingTerm}
                              onChange={(item) => {
                                setFByKey("shippingTerm", item.value);
                              }}
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12  mt-2">
                            <label className="col-form-label ml-4">
                              Partial shipment
                              <span className="text-danger">*</span>:
                            </label>
                          </div>
                          <div className="col-xl-8 col-lg-8 col-md-8 col-sm-8 col-xs-12 mt-sm-2">
                            <div className="mt-1 mb-2">
                              <div className="custom-control custom-radio d-inline mr-4">
                                <input
                                  type="radio"
                                  id="allowed"
                                  value="ALLOWED"
                                  checked={f.partialShipment === "ALLOWED"}
                                  name="partialShipment"
                                  className="custom-control-input m-cursor"
                                  onChange={($event) =>
                                    setFByKey(
                                      "partialShipment",
                                      $event.target.value
                                    )
                                  }
                                />
                                <label
                                  className="custom-control-label m-cursor"
                                  htmlFor="allowed"
                                >
                                  Allowed
                                </label>
                              </div>
                              <div className="custom-control custom-radio d-inline mr-4">
                                <input
                                  type="radio"
                                  id="notallowed"
                                  value="NOT ALLOWED"
                                  name="partialShipment"
                                  checked={f.partialShipment === "NOT ALLOWED"}
                                  className="custom-control-input m-cursor"
                                  onChange={($event) =>
                                    setFByKey(
                                      "partialShipment",
                                      $event.target.value
                                    )
                                  }
                                />
                                <label
                                  className="custom-control-label m-cursor"
                                  htmlFor="notallowed"
                                >
                                  Not Allowed
                                </label>
                              </div>
                              <div className="custom-control custom-radio d-inline mr-4">
                                <input
                                  type="radio"
                                  id="notallowed3"
                                  value="PLS SEE FIELD 44D"
                                  name="partialShipment"
                                  checked={
                                    f.partialShipment === "PLS SEE FIELD 44D"
                                  }
                                  className="custom-control-input m-cursor"
                                  onChange={($event) =>
                                    setFByKey(
                                      "partialShipment",
                                      $event.target.value
                                    )
                                  }
                                />
                                <label
                                  className="custom-control-label m-cursor"
                                  htmlFor="notallowed3"
                                >
                                  PLS SEE FIELD 44D
                                </label>
                                {f.partialShipment === "PLS SEE FIELD 44D" && (
                                  <textarea
                                    className="form-control text-uppercase"
                                    value={f.draweeOthers}
                                    placeholder="Enter describe"
                                    onChange={($event) =>
                                      setFByKey(
                                        "partialShipmentDetail",
                                        $event.target.value
                                      )
                                    }
                                  ></textarea>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12   mt-2">
                            <label className="col-form-label ml-4">
                              Transhipment
                              <span className="text-danger">*</span>:
                            </label>
                          </div>
                          <div className="col-xl-8 col-lg-8 col-md-8 col-sm-8 col-xs-12 mt-sm-2">
                            <div className="mt-1 mb-2">
                              <div className="custom-control custom-radio d-inline mr-4">
                                <input
                                  type="radio"
                                  id="transhipmentallowed"
                                  value="ALLOWED"
                                  checked={f.transhipment === "ALLOWED"}
                                  onChange={($event) =>
                                    setFByKey(
                                      "transhipment",
                                      $event.target.value
                                    )
                                  }
                                  name="transhipment"
                                  className="custom-control-input m-cursor"
                                />
                                <label
                                  className="custom-control-label m-cursor"
                                  htmlFor="transhipmentallowed"
                                >
                                  Allowed
                                </label>
                              </div>
                              <div className="custom-control custom-radio d-inline mr-4">
                                <input
                                  type="radio"
                                  id="transhipmentnotallowed"
                                  value="NOT ALLOWED"
                                  name="transhipment"
                                  checked={f.transhipment === "NOT ALLOWED"}
                                  onChange={($event) =>
                                    setFByKey(
                                      "transhipment",
                                      $event.target.value
                                    )
                                  }
                                  className="custom-control-input m-cursor"
                                />
                                <label
                                  className="custom-control-label m-cursor"
                                  htmlFor="transhipmentnotallowed"
                                >
                                  Not Allowed
                                </label>
                              </div>
                              <div className="custom-control custom-radio d-inline mr-4">
                                <input
                                  type="radio"
                                  id="transhipmentnotallowed3"
                                  value="CONDITIONAL"
                                  name="transhipment"
                                  checked={f.transhipment === "CONDITIONAL"}
                                  onChange={($event) =>
                                    setFByKey(
                                      "transhipment",
                                      $event.target.value
                                    )
                                  }
                                  className="custom-control-input m-cursor"
                                />
                                <label
                                  className="custom-control-label m-cursor"
                                  htmlFor="transhipmentnotallowed3"
                                >
                                  CONDITIONAL
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12   mt-2">
                            <label className="col-form-label ml-4">
                              Place From:
                            </label>
                          </div>
                          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-sm-2">
                            <input
                              className="form-control text-uppercase"
                              pattern="'^[-a-zA-Z0-9 \' : - + ‘ / ( ) … . , \‘ \’ \t –]+$'"
                              maxLength="65"
                              onChange={($event) =>
                                setFByKey("receiptPlace", $event.target.value)
                              }
                              value={f.receiptPlace}
                              type="text"
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12   mt-2">
                            <label className="col-form-label ml-4">
                              Place to:
                            </label>
                          </div>
                          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-sm-2">
                            <input
                              className="form-control text-uppercase"
                              onChange={($event) =>
                                setFByKey("finalPlace", $event.target.value)
                              }
                              value={f.finalPlace}
                              type="text"
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12   mt-2">
                            <label className="col-form-label ml-4">
                              Port From:
                            </label>
                          </div>
                          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-sm-2">
                            <input
                              className="form-control text-uppercase"
                              pattern="'^[-a-zA-Z0-9 \' : - + ‘ / ( ) … . , \‘ \’ \t –]+$'"
                              maxLength="65"
                              onChange={($event) =>
                                setFByKey("loadingPort", $event.target.value)
                              }
                              value={f.loadingPort}
                              type="text"
                            />
                          </div>
                          <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12   mt-2">
                            <label className="col-form-label ml-4">
                              Port to:
                            </label>
                          </div>
                          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-sm-2">
                            <input
                              className="form-control text-uppercase"
                              pattern="'^[-a-zA-Z0-9 \' : - + ‘ / ( ) … . , \‘ \’ \t –]+$'"
                              maxLength="65"
                              onChange={($event) =>
                                setFByKey("dischargePort", $event.target.value)
                              }
                              value={f.dischargePort}
                              type="text"
                            />
                          </div>
                        </div>
                        <div className="row">
                          {/*15. Mô tả hàng hóa*/}
                          <div className="col-12 border-bottom-dotted pt-2 mb-2 p-0">
                            <span className="text-uppercase m-font-600   ml-4">
                              Description of goods and/or services:
                            </span>
                          </div>
                          <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12   mt-2">
                            <label className="col-form-label ml-4">
                              Good list:
                            </label>
                          </div>
                          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-2 z-index-10">
                            <SelectComponent
                              notFirstDefault
                              name={"goodsDescription"}
                              list={productList}
                              bindLabel={"label"}
                              bindValue={"value"}
                              value={f?.goodsDescription}
                              onChange={(item) => {
                                setFByKey("goodsDescription", item.value);
                              }}
                            />
                          </div>
                          <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12   mt-2">
                            <label className="col-form-label ml-4">
                              Percentage:
                            </label>
                          </div>
                          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-2 ">
                            <InputComponent
                              name={"shippingTerm"}
                              type="number"
                              value={f.percentageGoodsDescription}
                              onChange={(item) => {
                                setFByKey(
                                  "percentageGoodsDescription",
                                  item.value
                                );
                              }}
                            />
                          </div>
                        </div>
                        {/*16. Chứng từ yêu cầu xuất trình*/}
                        <div className="col-12 border-bottom-dotted pt-2 mb-2 p-0">
                          <span className="text-uppercase m-font-600 theme-color ml-4">
                            Documents Information
                            <span className="text-danger">*</span>:
                          </span>
                        </div>
                        <div className="row ">
                          <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12   mt-2">
                            <label className="col-form-label ml-4">Code:</label>
                          </div>
                          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-2 z-index-7">
                            <SelectComponent
                              notFirstDefault
                              name={"shippingTerm"}
                              list={DocumentsInformation}
                              bindLabel={"label"}
                              bindValue={"value"}
                              value={f.documentsRequiredCode}
                              onChange={(item) => {
                                setF({
                                  ...f,
                                  ...{
                                    documentsRequiredCode: item.label,
                                    documentsRequired: item.value,
                                  },
                                });
                                setFByKey("documentsRequiredCode", item.label);
                                setFByKey("documentsRequired", item.value);
                              }}
                            />
                          </div>

                          <div className="col-xl-11 col-lg-11 col-md-11 col-sm-11 col-xs-12 mt-1">
                            <textarea
                              className="form-control text-uppercase"
                              cols="65"
                              rows="6"
                              name="documentsRequired"
                              value={f.documentsRequired}
                              maxLength="52000"
                              onChange={($event) =>
                                setFByKey(
                                  "documentsRequired",
                                  $event.target.value
                                )
                              }
                              placeholder="Nhập dữ liệu"
                            ></textarea>
                          </div>
                        </div>
                        <br />
                        {/*17. Các điều kiện khác*/}
                        <div className="col-12 border-bottom-dotted pt-2  mb-2 p-0">
                          <span className="text-uppercase m-font-600 theme-color ml-4">
                            Additional conditions:
                          </span>
                        </div>
                        <div className="row ">
                          <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12   mt-2">
                            <label className="col-form-label ml-4">Code:</label>
                          </div>
                          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-2 z-index-6">
                            <SelectComponent
                              notFirstDefault
                              name={"shippingTerm"}
                              list={listAdditionalConditions}
                              bindLabel={"label"}
                              bindValue={"value"}
                              value={f.additionalConditionsCode}
                              onChange={(item) => {
                                setFByKey(
                                  "additionalConditionsCode",
                                  item.label
                                );
                                setFByKey("additionalConditions", item.value);
                              }}
                            />
                          </div>
                          <div className="col-xl-11 col-lg-11 col-md-11 col-sm-11 col-xs-12 mt-1">
                            <textarea
                              className="form-control text-uppercase"
                              cols="65"
                              rows="6"
                              name="additionalConditions"
                              value={f.additionalConditions}
                              maxLength="52000"
                              onChange={($event) =>
                                setFByKey(
                                  "additionalConditions",
                                  $event.target.value
                                )
                              }
                              placeholder="Nhập dữ liệu"
                            ></textarea>
                          </div>
                        </div>
                        <div className="row ">
                          <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12   mt-2">
                            <label className="col-form-label ml-4">
                              Confirmation Instructions:
                            </label>
                          </div>
                          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-2 z-index-5">
                            <SelectComponent
                              notFirstDefault
                              name={"shippingTerm"}
                              list={ConfirmationInstructions}
                              bindLabel={"label"}
                              bindValue={"value"}
                              value={f.confirmationInstructions}
                              onChange={(item) => {
                                setFByKey(
                                  "confirmationInstructions",
                                  item.value
                                );
                              }}
                            />
                          </div>
                        </div>
                        <div className="row m-1">
                          <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12   mt-sm-2">
                            <label className="col-form-label ml-2">
                              Advise Through Bank
                            </label>
                          </div>
                          <div
                            className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12"
                            style={{ marginTop: 18 + "px" }}
                          >
                            <div className="custom-control custom-radio d-inline mr-4">
                              <input
                                type="radio"
                                id="advise571"
                                value="57A"
                                checked={f.advise57 == "57A"}
                                name="advise57A"
                                className="custom-control-input m-cursor"
                                onChange={($event) =>
                                  setFByKey("advise57", $event.target.value)
                                }
                              />
                              <label
                                className="custom-control-label m-cursor"
                                htmlFor="advise571"
                              >
                                57A
                              </label>
                            </div>
                            <div className="custom-control custom-radio d-inline mr-4">
                              <input
                                type="radio"
                                id="advise572"
                                value="57B"
                                checked={f.advise57 == "57B"}
                                name="advise57A"
                                className="custom-control-input m-cursor"
                                onChange={($event) =>
                                  setFByKey("advise57", $event.target.value)
                                }
                              />
                              <label
                                className="custom-control-label m-cursor"
                                htmlFor="advise572"
                              >
                                57B
                              </label>
                            </div>
                            <div className="custom-control custom-radio d-inline mr-4">
                              <input
                                type="radio"
                                id="advise573"
                                value="57D"
                                checked={f.advise57 == "57D"}
                                name="advise57A"
                                className="custom-control-input m-cursor"
                                onChange={($event) => {
                                  console.log("advise57", $event.target.value);
                                  setFByKey("advise57", $event.target.value);
                                }}
                              />
                              <label
                                className="custom-control-label m-cursor"
                                htmlFor="advise573"
                              >
                                57D
                              </label>
                            </div>
                          </div>
                        </div>
                        {["57B", "57D"]?.includes(f?.advise57) && (
                          <div className="row">
                            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12   mt-2">
                              <label className="col-form-label ml-4"></label>
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-sm-2">
                              <input
                                name="adviseDetail"
                                className="form-control text-uppercase"
                                onChange={($event) =>
                                  setFByKey("adviseDetail", $event.target.value)
                                }
                                value={f?.adviseDetail}
                                type="text"
                                placeholder="Nhập thông tin"
                              />
                            </div>
                          </div>
                        )}
                        <div className="row">
                          {/*19. Thời hạn xuất trình chứng từ*/}
                          <div className="col-12 border-bottom-dotted pt-2  mb-2 p-0">
                            <span className="text-uppercase  m-font-600 theme-color ml-4">
                              Period for Presentation in Days
                            </span>
                          </div>
                          <div className="row col-12 ml-2">
                            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12   mt-2">
                              <div className="form-check form-group ">
                                <input
                                  className="form-check-input m-cursor"
                                  type="radio"
                                  name="presentationCheck"
                                  id="presentationCheck1"
                                  value="Days"
                                  checked={f.presentationCheck === "Days"}
                                  onChange={($event) =>
                                    setFByKey(
                                      "presentationCheck",
                                      $event.target.value
                                    )
                                  }
                                />
                                <label
                                  className="form-check-label m-cursor"
                                  htmlFor="presentationCheck1"
                                >
                                  Days
                                </label>
                              </div>
                            </div>
                            {f.presentationCheck === "Days" && (
                              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-sm-2">
                                <input
                                  name="adviseDetail"
                                  className="form-control text-uppercase"
                                  onChange={($event) =>
                                    setFByKey(
                                      "adviseDetail",
                                      $event.target.value
                                    )
                                  }
                                  value={f?.adviseDetail}
                                  type="text"
                                  placeholder="Nhập thông tin"
                                />
                              </div>
                            )}
                          </div>

                          <div className="row col-12 ml-2">
                            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12">
                              <div className="form-check form-group">
                                <input
                                  className="form-check-input m-cursor"
                                  type="radio"
                                  name="presentationCheck"
                                  id="presentationCheck2"
                                  value="presentationCheck2"
                                  checked={
                                    f.presentationCheck === "presentationCheck2"
                                  }
                                  onChange={($event) =>
                                    setFByKey(
                                      "presentationCheck",
                                      $event.target.value
                                    )
                                  }
                                />
                                {/*value={f.presentationCheck} />*/}
                                <label
                                  className="form-check-label m-cursor"
                                  htmlFor="presentationCheck2"
                                >
                                  Others
                                  {f?.presentationCheck ===
                                    "presentationCheck2" && (
                                    <span className="text-danger">*</span>
                                  )}
                                </label>
                              </div>
                            </div>

                            {f.presentationCheck === "presentationCheck2" && (
                              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-sm-2">
                                <input
                                  name="presentationTypeKhac"
                                  className="form-control"
                                  onChange={($event) =>
                                    setFByKey(
                                      "presentationTypeKhac",
                                      $event.target.value
                                    )
                                  }
                                  value={f?.presentationTypeKhac}
                                  type="text"
                                  placeholder="Nhập thông tin"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-12 border-bottom-dotted pt-2  mb-2 p-0">
                            <span className="text-uppercase  m-font-600 theme-color ml-4">
                              Charge
                            </span>
                          </div>
                          <div className="row col-12">
                            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12">
                              <label className="col-form-label ml-4">
                                All charges outside Vietnam are for account of
                              </label>
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-sm-2">
                              <div className="form-check form-group ">
                                <input
                                  className="form-check-input m-cursor"
                                  type="radio"
                                  name="charge"
                                  id="chargea"
                                  value="1"
                                  checked={f.charge1 === "1"}
                                  onChange={($event) =>
                                    setFByKey("charge1", $event.target.value)
                                  }
                                />
                                <label
                                  className="form-check-label m-cursor"
                                  htmlFor="chargea"
                                >
                                  Applicant’s account
                                </label>
                              </div>
                              <div className="form-check form-group ">
                                <input
                                  className="form-check-input m-cursor"
                                  type="radio"
                                  name="charge1"
                                  id="chargeb"
                                  value="2"
                                  checked={f.charge1 === "2"}
                                  onChange={($event) =>
                                    setFByKey("charge1", $event.target.value)
                                  }
                                />
                                <label
                                  className="form-check-label m-cursor"
                                  htmlFor="chargeb"
                                >
                                  Beneficiary’s account
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="row col-12">
                            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12">
                              <label className="col-form-label ml-4">
                                Confirming charges are for account of (for
                                confirmed L/C )
                              </label>
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-sm-2">
                              <div className="form-check form-group ">
                                <input
                                  className="form-check-input m-cursor"
                                  type="radio"
                                  name="charge2"
                                  id="chargea2"
                                  value="1"
                                  checked={f.charge2 === "1"}
                                  onChange={($event) =>
                                    setFByKey("charge2", $event.target.value)
                                  }
                                />
                                <label
                                  className="form-check-label m-cursor"
                                  htmlFor="chargea2"
                                >
                                  Applicant’s account
                                </label>
                              </div>
                              <div className="form-check form-group ">
                                <input
                                  className="form-check-input m-cursor"
                                  type="radio"
                                  name="charge2"
                                  id="chargeb2"
                                  value="2"
                                  checked={f.charge2 === "2"}
                                  onChange={($event) =>
                                    setFByKey("charge2", $event.target.value)
                                  }
                                />
                                <label
                                  className="form-check-label m-cursor"
                                  htmlFor="chargeb2"
                                >
                                  Beneficiary’s account
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="row col-12">
                            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12">
                              <label className="col-form-label ml-4">
                                Handling fee is for account of
                              </label>
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-sm-2">
                              <div className="form-check form-group ">
                                <input
                                  className="form-check-input m-cursor"
                                  type="radio"
                                  name="charge3"
                                  id="chargea3"
                                  value="1"
                                  checked={f.charge3 === "1"}
                                  onChange={($event) =>
                                    setFByKey("charge3", $event.target.value)
                                  }
                                />
                                <label
                                  className="form-check-label m-cursor"
                                  htmlFor="chargea3"
                                >
                                  Applicant’s account
                                </label>
                              </div>
                              <div className="form-check form-group ">
                                <input
                                  className="form-check-input m-cursor"
                                  type="radio"
                                  name="charge3"
                                  id="chargeb3"
                                  value="2"
                                  checked={f.charge3 === "2"}
                                  onChange={($event) =>
                                    setFByKey("charge3", $event.target.value)
                                  }
                                />
                                <label
                                  className="form-check-label m-cursor"
                                  htmlFor="chargeb3"
                                >
                                  Beneficiary’s account
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="row col-12">
                            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12">
                              <label className="col-form-label ml-4">
                                Acceptance fee is for account of
                              </label>
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-sm-2">
                              <div className="form-check form-group ">
                                <input
                                  className="form-check-input m-cursor"
                                  type="radio"
                                  name="charge4"
                                  id="chargea4"
                                  value="1"
                                  checked={f.charge4 === "1"}
                                  onChange={($event) =>
                                    setFByKey("charge4", $event.target.value)
                                  }
                                />
                                <label
                                  className="form-check-label m-cursor"
                                  htmlFor="chargea4"
                                >
                                  Applicant’s account
                                </label>
                              </div>
                              <div className="form-check form-group ">
                                <input
                                  className="form-check-input m-cursor"
                                  type="radio"
                                  name="charge4"
                                  id="chargeb4"
                                  value="2"
                                  checked={f.charge4 === "2"}
                                  onChange={($event) =>
                                    setFByKey("charge4", $event.target.value)
                                  }
                                />
                                <label
                                  className="form-check-label m-cursor"
                                  htmlFor="chargeb4"
                                >
                                  Beneficiary’s account
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="row col-12">
                            {/* <div className="col-12 border-bottom-dotted pt-2  mb-2 p-0">
                              <span className="text-uppercase  m-font-600 text-dark ml-4">
                                INFO
                              </span>
                            </div> */}

                            <div className="row col-12">
                              <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12">
                                <label className="col-form-label ml-4">
                                  Bank to Bank Information
                                </label>
                              </div>
                              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-sm-2">
                                <SelectComponent
                                  notFirstDefault
                                  isMulti
                                  name={"bankToBankInfo"}
                                  list={swifts}
                                  bindLabel={"institueName"}
                                  bindValue={"unqBankIdentifier"}
                                  value={f?.bankToBankInfo}
                                  onChange={(item) => {
                                    setFByKey(
                                      "bankToBankInfo",
                                      item?.map((t) => t.value)
                                    );
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="row col-12">
                            {/* <div className="col-12 border-bottom-dotted pt-2  mb-2 p-0">
                              <span className="text-uppercase  m-font-600 text-dark ml-4">
                                INFO
                              </span>
                            </div> */}

                            <div className="row col-12">
                              <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12">
                                <label className="col-form-label ml-4">
                                  Instr to Paying Bank:
                                </label>
                              </div>
                              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-sm-2">
                                <SelectComponent
                                  notFirstDefault
                                  isMulti
                                  name={"instrTOpayingBank"}
                                  list={swifts}
                                  bindLabel={"institueName"}
                                  bindValue={"unqBankIdentifier"}
                                  value={f.instrTOpayingBank}
                                  onChange={(item) => {
                                    setFByKey(
                                      "instrTOpayingBank",
                                      item.map((t) => t.value)
                                    );
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="row col-12">
                            <div className="row col-12">
                              <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12">
                                <label className="col-form-label ml-4">
                                  Attached file :
                                </label>
                              </div>
                              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-sm-2">
                                {mode == "CONFIRM" || mode == "VIEW" ? (
                                  <span className="text-primary">
                                    {item?.attachedFileName}
                                    <i
                                      className="fa fa-download text-success ml-2 m-cursor"
                                      onClick={() => {
                                        downloadFile(item?.attachedFile);
                                      }}
                                    ></i>
                                  </span>
                                ) : (
                                  <input
                                    className="form-control-file"
                                    ref={fileRef}
                                    id="reportFile"
                                    type="file"
                                    placeholder="Choose file"
                                    onChange={handleChangeFile}
                                  ></input>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="row col-12">
                            {/* <div className="col-12 border-bottom-dotted pt-2  mb-2 p-0">
                                <span className="text-uppercase  m-font-600 text-dark ml-4">
                                  INFO
                                </span>
                              </div> */}

                            <div className="row col-12">
                              <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12">
                                <label className="col-form-label ml-4">
                                  Insurance condition
                                </label>
                              </div>
                              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-sm-2">
                                <div className="form-check form-group ">
                                  <input
                                    className="form-check-input m-cursor"
                                    type="checkbox"
                                    name="insuranceCondition"
                                    id="insuranceCondition1"
                                    onChange={($event) => {
                                      console.log(
                                        "$event",
                                        $event.target.value
                                      );
                                      setFByKey(
                                        "insuranceCondition",
                                        $event.target.value ? "true" : "false"
                                      );
                                    }}
                                    checked={f?.insuranceCondition === "true"}
                                  />
                                  <label
                                    className="form-check-label m-cursor"
                                    htmlFor="insuranceCondition1"
                                  >
                                    We will submit the insurance policy/deed Get
                                    insurance for ACB before release L/C.
                                  </label>
                                </div>
                                <div className="form-check form-group ">
                                  <input
                                    className="form-check-input m-cursor"
                                    type="checkbox"
                                    name="insuranceCondition2"
                                    id="insuranceCondition2"
                                    onChange={($event) =>
                                      setFByKey(
                                        "insuranceCondition2",
                                        $event.target.value ? "true" : "false"
                                      )
                                    }
                                    checked={f?.insuranceCondition2 === "true"}
                                  />
                                  <label
                                    className="form-check-label m-cursor"
                                    htmlFor="insuranceCondition2"
                                  >
                                    Ask the bank to buy insurance instead us and
                                    are authorized to debit your account us to
                                    pay the insurance premium.
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row col-12">
                            <div className="col-12 border-bottom-dotted pt-2  mb-2 p-0">
                              <span className="text-uppercase  m-font-600 theme-color ml-4">
                                Margin deposit
                              </span>
                            </div>
                            <div className="row col-4 ml-4">
                              <div className="col-6">
                                <input
                                  className="form-check-input m-cursor"
                                  type="radio"
                                  name="marginDepositxx"
                                  id="marginDeposit1"
                                  value="1"
                                  checked={f?.marginDeposit === "1"}
                                  onChange={($event) =>
                                    setFByKey(
                                      "marginDeposit",
                                      $event.target.value
                                    )
                                  }
                                />
                                <label
                                  className="form-check-label m-cursor"
                                  htmlFor="marginDeposit1"
                                >
                                  Whoolly
                                </label>
                              </div>
                              <div className="col-6">
                                <input
                                  className="form-check-input m-cursor"
                                  type="radio"
                                  name="marginDepositxx"
                                  id="marginDeposit2"
                                  value="2"
                                  checked={f?.marginDeposit === "2"}
                                  onChange={($event) =>
                                    setFByKey(
                                      "marginDeposit",
                                      $event.target.value
                                    )
                                  }
                                />
                                <label
                                  className="form-check-label m-cursor"
                                  htmlFor="marginDeposit2"
                                >
                                  A part
                                </label>
                              </div>
                            </div>
                            <div className="row col-6"></div>

                            {f?.marginDeposit === "2" && (
                              <>
                                <div className="row col-12 ml-3">
                                  <div className="col-2">
                                    <label className="col-form-label ">
                                      Percentage(%):
                                    </label>
                                  </div>
                                  <div className="col-3 z-index-8">
                                    <input
                                      className="form-control m-cursor"
                                      type="number"
                                      maxLength="2"
                                      name="marginDepositPercentage"
                                      value={f?.marginDepositPercentage}
                                      onChange={($event) => {
                                        if (
                                          $event.target.value > 0 &&
                                          $event.target.value < 100
                                        ) {
                                          setF({
                                            ...f,
                                            ...{
                                              marginDepositPercentage:
                                                $event.target.value,
                                              amountDeposit:
                                                (f?.amount
                                                  ?.toString()
                                                  ?.replace(/,/g, "") *
                                                  $event.target.value) /
                                                100,
                                            },
                                          });
                                        } else if ($event.target.value > 99) {
                                          console.log(
                                            "marginDepositPercentage",
                                            $event.target.value
                                          );
                                          setFByKey(
                                            "marginDepositPercentage",
                                            99
                                          );
                                        } else {
                                          setFByKey(
                                            "marginDepositPercentage",
                                            $event.target.value
                                          );
                                        }
                                      }}
                                    />
                                  </div>

                                  <div className="col-2">
                                    <label className="col-form-label ml-4">
                                      Amount:
                                    </label>
                                  </div>
                                  <div className="col-3 z-index-8 ml-1">
                                    <div className="row">
                                      <CurrencyFormat
                                        disabled
                                        className="form-control text-uppercase col-6"
                                        allowNegative={true}
                                        thousandSpacing={"0"}
                                        thousandSeparator={true}
                                        value={f?.amountDeposit || 0}
                                        type="text"
                                        pattern="^[0-9]*[1-9][0-9]*$"
                                      />
                                      <div className="col-6">
                                        <SelectComponent
                                          disabled
                                          notFirstDefault
                                          name={"currency"}
                                          list={currencyList}
                                          bindLabel={"label"}
                                          bindValue={"value"}
                                          value={f?.currency}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                            <div className="row col-2 ml-4">
                              <label className="col-form-label ">
                                Margin Acct
                              </label>
                            </div>

                            <div className="row col-3 ml-1 ">
                              <input
                                disabled
                                className="form-control m-cursor"
                                type="text"
                                name="amountMarginAcct"
                                id="amountMarginAcct"
                                value={f?.applicant}
                              />
                            </div>
                          </div>
                          <div className="row col-12">
                            <div className="col-12 border-bottom-dotted pt-2  mb-2 p-0">
                              <span className="text-uppercase  m-font-600 theme-color ml-4">
                                Charge Amt
                              </span>
                            </div>
                            {/* <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12  mt-2">
                              <label className="col-form-label ml-4">
                                Additional Amount Covered:
                              </label>
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 mt-2 z-index-5"></div> */}

                            <div className="row col-12 ml-3">
                              <div className="col-2">
                                <label className="col-form-label">
                                  Seq Event:
                                </label>
                              </div>
                              <div className="col-3 z-index-8">
                                <SelectComponent
                                  notFirstDefault
                                  name="seqEvent"
                                  list={listBoxSeq}
                                  bindLabel={"label"}
                                  bindValue={"value"}
                                  value={f?.seqEvent}
                                  onChange={(item) => {
                                    setFByKey("seqEvent", item?.value);
                                  }}
                                />
                              </div>
                              <div className="col-2">
                                <label className="col-form-label ml-4">
                                  Seq Charges:
                                </label>
                              </div>
                              <div className="col-3 z-index-8">
                                <SelectComponent
                                  notFirstDefault
                                  name="seqCharges"
                                  list={listBoxSeq}
                                  bindLabel={"label"}
                                  bindValue={"value"}
                                  value={f?.seqCharges}
                                  onChange={(item) => {
                                    setFByKey("seqCharges", item?.value);
                                  }}
                                />
                              </div>
                            </div>
                            <div className="row col-12 ml-3">
                              <div className="col-2">
                                <label className="col-form-label">
                                  Exchange:
                                </label>
                              </div>
                              <div className="col-3">
                                <CurrencyFormat
                                  className="form-control"
                                  allowNegative={true}
                                  thousandSpacing={"0"}
                                  thousandSeparator={true}
                                  value={f?.exchange || 0}
                                  pattern="^[0-9]*[1-9][0-9]*$.[0]"
                                  onChange={($event) =>
                                    setFByKey("exchange", $event.target.value)
                                  }
                                />
                              </div>
                              <div className="col-2">
                                <label className="col-form-label ml-4">
                                  Currency:
                                </label>
                              </div>
                              <div className="col-3">
                                <input
                                  disabled
                                  className="form-control m-cursor"
                                  type="text"
                                  value={f?.currency}
                                />
                              </div>
                            </div>
                            <div className="row col-12 ml-3 mt-2">
                              <div className="col-4">
                                <label className="col-form-label">
                                  CHARGES DETAILS
                                </label>
                                <Button
                                  className="btn btn-primary ml-3"
                                  onClick={() => {
                                    console.log("call API");
                                    getChargesDetail();
                                  }}
                                >
                                  <i class="fas fa-search text-white"></i> Call
                                </Button>
                              </div>
                            </div>
                            <div className="row col-12 ml-3 mt-1">
                              <div className="table-responsive">
                                <table className="table table-bordered table-sm table-hover m-w-tabble">
                                  <thead>
                                    <tr className="m-header-table">
                                      <th className="text-center align-middle mw-100">
                                        Y/N
                                      </th>
                                      <th className="text-center align-middle mw-100">
                                        Fee Type
                                      </th>
                                      <th className="text-center align-middle mw-100">
                                        Amt
                                      </th>

                                      <th className="text-center align-middle mw-100">
                                        Adjust
                                      </th>
                                      <th className="text-center align-middle mw-100">
                                        Total
                                      </th>
                                      <th className="text-center align-middle mw-100">
                                        Currency
                                      </th>
                                    </tr>
                                  </thead>

                                  <tbody>
                                    {(!f?.listFee ||
                                      f?.listFee?.length <= 0) && (
                                      <tr>
                                        <td
                                          className="text-center align-middle"
                                          colSpan="10"
                                        >
                                          No. data
                                        </td>
                                      </tr>
                                    )}
                                    {f?.listFee?.map((item, i) => {
                                      return (
                                        <tr key={item?.id}>
                                          <td className="text-center align-center ">
                                            <input
                                              className="form-check-input m-cursor text-center align-middle "
                                              type="checkbox"
                                              // value={true}
                                              checked={item?.check === true}
                                              onChange={() => {
                                                // item.check = !item?.check;
                                                const listFeeTemp = f?.listFee;
                                                console.log(
                                                  "listFeeTemp",
                                                  listFeeTemp
                                                );
                                                listFeeTemp[i].check =
                                                  listFeeTemp[i]?.check === true
                                                    ? false
                                                    : true;
                                                setFByKey(
                                                  "listFee",
                                                  listFeeTemp
                                                );
                                                tinhToanFinalTotal();
                                              }}
                                            />
                                          </td>
                                          <td className="text-center align-middle">
                                            <span>{item?.feeName}</span>
                                          </td>
                                          <td className="text-center align-middle">
                                            <span>{item?.amountFee}</span>
                                          </td>
                                          <td className="text-center align-middle">
                                            <span>
                                              {item?.check && (
                                                <>
                                                  <CurrencyFormat
                                                    className="form-control"
                                                    allowNegative={true}
                                                    thousandSpacing={"0"}
                                                    thousandSeparator={true}
                                                    value={item?.adJust || 0}
                                                    pattern="^[0-9]*[1-9][0-9]*$.[0]"
                                                    onChange={($event) => {
                                                      console.log(
                                                        " $event.target.value",
                                                        $event.target.value
                                                      );

                                                      const listFeeTemp =
                                                        f?.listFee;
                                                      listFeeTemp[i].adJust =
                                                        $event.target.value;

                                                      const value =
                                                        $event.target.value
                                                          ?.toString()
                                                          ?.replace(/,/g, "") *
                                                        1.0;

                                                      listFeeTemp[i].gLTitle =
                                                        value +
                                                        item?.amountFee * 1.0;

                                                      setF({
                                                        ...f,
                                                        ...{
                                                          listFee: listFeeTemp,
                                                          // finalTotal: sumAmount,
                                                        },
                                                      });
                                                      tinhToanFinalTotal();
                                                    }}
                                                  />
                                                </>
                                              )}
                                            </span>
                                          </td>
                                          <td className="text-center align-middle">
                                            <span>
                                              {formatNumber(
                                                item?.gLTitle || item?.amountFee
                                              )}
                                            </span>
                                          </td>
                                          <td className="text-center align-middle">
                                            <span>{item?.ccyId}</span>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            <div className="row col-12 ml-3">
                              <div div className="col-2">
                                <label className="col-form-label">
                                  Final total:
                                  {/* <Button
                                    name="tinhToans"
                                    className="btn btn-primary ml-2"
                                    onChange={() => {
                                      let sumAmount = 0;
                                      const listFeeTemp = f?.listFee;
                                      listFeeTemp.forEach((sub) => {
                                        sumAmount = sumAmount + sub?.gLTitle;
                                        console.log(
                                          " sub?.gLTitle",
                                          sub?.gLTitle
                                        );
                                      });
                                    }}
                                  >
                                    Tính toán
                                  </Button> */}
                                  {/* <Button
                                    className="btn btn-primary ml-3"
                                    onClick={() => {
                                      tinhToanFinalTotal();
                                    }}
                                  >
                                    <i class="fas fa-search text-white"></i>{" "}
                                    Tính toán
                                  </Button> */}
                                </label>
                              </div>
                              <div className="col-4">
                                <CurrencyFormat
                                  disabled
                                  className="form-control"
                                  allowNegative={true}
                                  thousandSpacing={"0"}
                                  thousandSeparator={true}
                                  value={f?.finalTotal || 0}
                                  pattern="^[0-9]*[1-9][0-9]*$.[0]"
                                  // onChange={($event) =>
                                  //   setFByKey("exchange", $event.target.value)
                                  // }
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="row col-12 mt-3 text-center">
            <div className="col-12 text-center">
              <button
                onClick={() => {
                  passEntry();
                }}
                className="btn btn-secondary mr-2"
                type="button"
              >
                <i className="fas fa-arrow-left   mr-1"></i>
                <span className="text-button">Back</span>
              </button>
              {mode === "CONFIRM" ? (
                <button
                  hidden={mode === "VIEW"}
                  onClick={() => {
                    // setIsSubmit(true);
                    onApprove("approve");
                  }}
                  className="btn btn-primary ml-1"
                  type="button"
                >
                  <i
                    className={(item ? "fa-edit" : "fa-plus") + " fas mr-1"}
                  ></i>
                  <span className="text-button">
                    {["Activity_1"].includes(itemParent?.stepId)
                      ? "Resubmit"
                      : "Approve"}
                  </span>
                </button>
              ) : mode === "RETURN" ? (
                <button
                  onClick={() => {
                    // setIsSubmit(true);
                    onApprove("return");
                  }}
                  className="btn btn-warning ml-1"
                  type="button"
                >
                  <i className={"fas fa-undo "}></i>
                  <span className="text-button ml-2">{"Return"}</span>
                </button>
              ) : (
                <button
                  hidden={mode === "VIEW"}
                  onClick={() => {
                    // setIsSubmit(true);
                    onSubmitLcOnline();
                  }}
                  className="btn btn-primary ml-1"
                  type="button"
                >
                  <i
                    className={(item ? "fa-edit" : "fa-plus") + " fas mr-1"}
                  ></i>
                  <span className="text-button">
                    {mode !== "CREATE" ? "Update" : "Create"}
                  </span>
                </button>
              )}
            </div>
          </div>
        </Row>
      </div>
    </React.Fragment>
  );
};
export default LCOnline;
