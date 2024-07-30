export const currencyList = [
  { label: "VND", value: "VND" },
  { label: "USD", value: "USD" },
  { label: "GBP", value: "GBP" },
  { label: "HKD", value: "HKD" },
  { label: "CHF", value: "CHF" },
  { label: "JPY", value: "JPY" },
  { label: "AUD", value: "AUD" },
  { label: "CAD", value: "CAD" },
  { label: "SGD", value: "SGD" },
  { label: "EUR", value: "EUR" },
  { label: "NZD", value: "NZD" },
  { label: "THB", value: "THB" },
  { label: "CNY", value: "CNY" },
  { label: "KRW", value: "KRW" },
  { label: "NOK", value: "NOK" },
  { label: "FRF", value: "FRF" },
];
export const currencyListUSD = [
  "USD",
  "GBP",
  "HKD",
  "CHF",
  "JPY",
  "AUD",
  "CAD",
  "SGD",
  "EUR",
  "NZD",
  "THB",
  "CNY",
  "KRW",
  "NOK",
  "FRF",
];

export const typeLc1List = [
  { label: "TRANSFERABLE", value: "TRANSFERABLE" },
  { label: "REVOLVING", value: "REVOLVING" },
];

export const typeLc2List = [
  { label: "UCP LATEST VERSION", value: "UCP LATEST VERSION" },
  { label: "UCPURR LATEST VERSION", value: "UCPURR LATEST VERSION" },
  { label: "OTHERS", value: "OTHERS" },
];

export const expiryPlaceList = [
  {
    label: "Tại ngân hàng phát hành / At issuing bank",
    value: "AT ISSUING BANK",
  },
  {
    label: "Tại ngân hàng thương lượng / At negotiating bank",
    value: "AT NEGOTIATING BANK",
  },
  { label: "Khác / Others", value: "Others" },
];

export const availableWithList = [
  { label: "ISSUING BANK", value: "ISSUING BANK" },
  { label: "CONFIRMING BANK", value: "CONFIRMING BANK" },
  { label: "Others bank", value: "Others bank" },
];

export const listPayment = [
  { value: "NEGOTIATION", label: "Thương lượng / Negotiation" },
  { value: "PAYMENT", label: "Thanh toán / Payment" },
  { value: "ACCEPTANCE", label: "Chấp nhận / Acceptance" },
  { value: "DEFERRED PAYMENT", label: "Trả chậm / Deferred payment" },
  { value: "MIXED PAYMENT", label: "Thanh toán hỗn hợp / Mixed payment" },
];

export const shippingTermList = [
  { label: "EXW", value: "EXW" },
  { label: "FCA", value: "FCA" },
  { label: "FAS", value: "FAS" },
  { label: "FOB", value: "FOB" },
  { label: "CFR", value: "CFR" },
  { label: "CIF", value: "CIF" },
  { label: "CPT", value: "CPT" },
  { label: "CIP", value: "CIP" },
  { label: "DPU", value: "DPU" },
  { label: "DAP", value: "DAP" },
  { label: "DDP", value: "DDP" },
  { label: "Other terms", value: "Other" },
];
export const productList = [
  { label: "Tiền chất công nghiệp", value: "TienChatCongNghiep" },
  { label: "Khoáng sản", value: "KhoangSan" },
  {
    label: "Tiền chất thuốc nổ, vật liệu nổ công nghiệp",
    value: "chatNoVatLieuNoCongNghiep",
  },
];

export const productType = [
  { label: "LC NK HON HOP", value: "LCNKHH" },
  { label: "LC NK TRA CHAM", value: "LCNKTC" },
  { label: "LC NK TRA NGAY", value: "LCNKTN" },
  { label: "LC NK TRA CHAM - TT TRA NGAY", value: "LCNKTCTN" },
];
export const subProductType2 = [
  { label: "CONFIRM", value: "CONFIRM" },
  { label: "MAY ADD", value: "MAYADD" },
  { label: "WITHOUT", value: "WITHOUT" },
];
export const listPCentre = [{ label: "NONE", value: "NONE" }];

export const listExpiredPlace = [
  { label: "Trong nước", value: "in" },
  { label: "Ngoài nước", value: "out" },
];

export const listApplicantRule = [
  { label: "UCP LATEST VERSION", value: "UCPLV" },
  { label: "ISP LATEST VERSION", value: "ILV" },
  { label: "UCPURR LATEST VERSION", value: "ULV" },
  { label: "OTHERS", value: "OTHERS" },
];

export const listAvailableType = [
  { label: "BY NEGOTIATION", value: "BYNEGOTIATION" },
  { label: "BY SIGHT PAYMENT", value: "BYSIGHTPAYMENT" },
  { label: "BY ACCEPTANCE", value: "BYACCEPTANCE" },
  { label: "BY DEFERRED PAYMENT ", value: "BYDEFERREDPAYMENT" },
  { label: "BY MIXED PAYMENT", value: "BYMIXEDPAYMENT" },
];

export const listAdviceType = [{ label: "SWIFT", value: "SWIFT" }];

export const lisShippingTern = [
  { label: "EXW", value: "EXW" },
  { label: "FCA", value: "FCA" },
  { label: "FAS", value: "FAS" },
  { label: "FOB", value: "FOB" },
  { label: "CFR", value: "CFR" },
  { label: "CIF", value: "CIF" },
  { label: "CPT", value: "CPT" },
  { label: "CIP", value: "CIP" },
  { label: "DAT", value: "DAT" },
  { label: "DAF", value: "DAF" },
  { label: "DEQ", value: "DEQ" },
  { label: "DES", value: "DES" },
  { label: "DDU", value: "DDU" },
  { label: "DAP", value: "DAP" },
  { label: "DDP", value: "DDP" },
  { label: "DAP", value: "DAP" },
];

export const DocumentsInformation = [
  {
    label: "Invoice",
    value: "Signed Commercial Invoice(s) in ………original(s)./ ………. copy (ies)",
  },
  {
    label: "Bill of Lading",
    value:
      " .......set of original clean shipped on board Marine/Ocean Bill of Lading covering port to port shipment, made out  to order of Asia Commercial Bank,………………. ...................branch  to order, blank endorsed, marked “Freight  Prepaid  Collect, notify Applicant with full name and address, showing name,address, telephone of agent of Carrier in Viet Nam.",
  },
  {
    label: "Air Waybill",
    value:
      "One original Air Waybill (for shipper/consignor), showing goods consigned  to Asia Commercial Bank,………………….…….branch  to Applicant, marked “Freight  Prepaid  Collect, and notify Applicant with full name and address. Multimodal transport document: Multimodal transport document made out  to order of Asia Commercial Bank,……………………………………… branch  to order, blank endorsed, marked “Freight  Prepaid  Collect, notify Applicant with full name and address, showing name, address, telephone of agent of Carrier in VietNam.",
  },
  {
    label: "Multimodal transport document",
    value:
      "Multimodal transport document made out  to order of Asia Commercial Bank,……………………………………… branch  to order, blank endorsed, marked “Freight  Prepaid  Collect, notify Applicant with full name and address, showing name, address, telephone of agent of Carrier in VietNam.",
  },
  {
    label: "Delivery order",
    value: `One original Delivery order issued by beneficiary, showing goods consigned to Asia Commercial Bank, ..................................... branch and notify applicant with full name and address. Delivery order must show issuing date and this date will be considered as shipment date.
Cargo receipt in ………original(s). ………. copy (ies) signed and stamped by  beneficiary,  applicant,  showing commodity and quantity of goods delivered  showing applicant with full name and address. Cargo receipt must show issuing date and this date will be considered as shipment date.
 Other transport documents:………………………………………………………………………………………………………………………............`,
  },
  {
    label: "Insurance Policy/Insurance Certificate",
    value: ` Insurance Policy/Insurance Certificate in full set, for not less than the CIF/CIP value plus 10%, blank endorsed, showing claim payable at destination by an agent (with full name and address in Vietnam) and covering risks under the following Institute Cargo Clauses  1/1/82  1/1/09, showing number of original(s) issued:

   Institute Cargo Clauses (A)  Institute Cargo Clauses (Air)  Clause B  Clause C  War risk

  Extention and/or other clauses:……............………………

Insurance Policy/Insurance Certificate must not show applicant as the insured / assured party.

 Signed detailed Packing List(s) in ………original( s) ……….copy (ies) issued by .......................................................................................

 Certificate of Origin in ………original(s) ………. copy (ies) issued by ........................................................................................................

 Certificate of Analysis in ………original(s) ………. copy(ies) issued by...............................................................................................................

 Certificate of Quality and Quantity in ………original(s) ………. copy (ies) issued by.................................................................................`,
  },
  {
    label: "BEN’s Certificate:",
    value:
      "Ben's Certificate in one original, certifying that  1/3 set of original Bill of Lading made out to order of Asia Commercial Bank, ................ branch and  one set of non-negotiable documents sent directly to the Applicant within ……................. working days after shipment date by courier service.  Original courier receipt to this effect must be presented and must show name and address of receiver as applicant indicated above, pick up date within the above mentioned period.",
  },
  {
    label: "Copy of fax:",
    value: `Copy of fax advising applicant of particulars of shipment: commodity name, L/C No., Invoice value, ETD, ETA, applicant's name and

 For shipment by sea:  Vessel name and voyage no.,  B/L no. and date, port of loading, port of discharge within............ days after shipment date

 For shipment by air:  Flight no.,  Air Waybill no. and date, airport of departure, airport of destination within............ days after shipment date

 Fax report with successful result must be presented and must show the fax date within the above mentioned period.`,
  },
];

export const listAdditionalConditions = [
  {
    label: "ACB’s Condition",
    value: `All documents including drafts must indicate L/C no.

Unless otherwise stated in this L/C, all documents and drafts must be issued in English including the name of a person or entity, any stamps,

legalization, endorsements or similar, and the pre-printed shown on a document, such as, but not limited to, field headings.

All documents and drafts must be issued in English.

Shipment date prior to L/C issuing date not acceptable.

All documents including drafts must be titled as required by the credit.

All original documents must be signed by handwriting by the issuer.`,
  },
  {
    label: "Others condition",
    value: `Tolerance ……. PCT in quantity and amount of each item  total quantity and total amount  other: ……………………..

 Certificate of  Quality  Analysis  Inspection other documents: ……… must show actual results with specific number within the limit of all specifications stated above.

 Result of test report showing on Certificate of  Quality  Analysis  Inspection other documents (if any) must be within the limit which has been indicated in the test report itself.

 The goods must be shipped in … shipments separately. Partial shipment within each shipment schedule is not allowed.

 TTR (Telegraphic Transfer Reimbursement) allowed.  Reimbursing bank:………………………………………………………….

 Confirming bank:………………………………………………………………………………………………………………………..

 Transferring bank:………………………………………………………………………………………………………………………..`,
  },
];
export const ConfirmationInstructions = [
  {
    label: "CONFIRM",
    value: "CONFIRM",
  },
  {
    label: "MAYADD",
    value: "MAYADD",
  },
  {
    label: "WITHOUT",
    value: "WITHOUT",
  },
];
export const reasonAddittionalAmount = [
  {
    label: "Lãi suất",
    value: "laisuat",
  },
  {
    label: "Bảo hiểm",
    value: "baohiem",
  },
  {
    label: "Cước vận chuyển",
    value: "cuocvanchuyen",
  },
  {
    label: "Khác",
    value: "khac",
  },
];
export const listBoxSeq = [
  {
    label: "1",
    value: "1",
  },
  {
    label: "2",
    value: "2",
  },
  {
    label: "3",
    value: "3",
  },
  {
    label: "4",
    value: "4",
  },
  {
    label: "5",
    value: "5",
  },
  {
    label: "6",
    value: "6",
  },
  {
    label: "7",
    value: "7",
  },
  {
    label: "8",
    value: "8",
  },
  {
    label: "9",
    value: "9",
  },
  {
    label: "10",
    value: "10",
  },
];

export const listXuatNhapKhau = [
  {
    label: "L/C Nhập Khẩu - Phát hành L/C",
    value: "LCNHAPKHAU",
  },
  {
    label: "L/C Nhập Khẩu - Tu chỉnh L/C",
    value: "LCXUATKHAU",
  },
];
