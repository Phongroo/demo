import nextStep from "../../../../assets/images/next-step.png";
import { useEffect, useState } from "react";
import "./StylesEdit.scss";
import { Input } from "reactstrap";
import moment from "moment";
import { uniqBy } from "lodash";
import SelectComponent from "../../../../shared/component/select/SelectComponent";
import api from "../../../../utils/api";
import request from "../../../../utils/request";
const EditLCOnline = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [branches, setBranches] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [indexStep, setIndexStep] = useState(1);
  const [isSubmit, setIsSubmit] = useState(false);
  const [isTuChinhRutGon, setIsTuChinhRutGon] = useState(false);
  const [inInvalidLCEForm, setInInvalidLCEForm] = useState();
  const [showFileList, setShowFileList] = useState([]);
  const [listFile, setListFile] = useState([]);
  const [isAmendment, setIsAmendment] = useState(false);
  const [checkValidDate, setCheckValidDate] = useState();
  const [invalidExpiryDate, setInvalidExpiryDate] = useState(false);
  const [invalidDate, setInvalidDate] = useState();

  const [chiuPhiPhatHanh, setChiuPhiPhatHanh] = useState("DV_PHAT_HANH");
  const [chiuPhiThongBao, setChiuPhiThongBao] = useState("DV_PHAT_HANH");
  const [chiuPhiSuaDoi, setChiuPhiSuaDoi] = useState("DV_PHAT_HANH");
  const [nguonVon, setNguonVon] = useState("UY_QUYEN");

  const [fTC, setFTC] = useState({
    branchId: "",
    cifCode: "",
    cifName: "",
    issueDate: "",
    amount: "",
    changedAmount: "",
    newAmount: "",
    ccyId: "",
    changedCcyId: "",
    newCcyId: "",
    isAmendToAmount: false,
    isAmendToBeneficiary: false,
    isAmendToGoodsOrServices: false,

    isAmendToExpiredDate: false,
    expiredDate: "",

    isAmendToLatestDateOfShipment: false,
    latestDate: "",

    isAmendToRequiredDocument: false,
    requiredDocuments: "",

    isAmendToOthers: false,
    amendmentNo: "",
    amendToAmountType: 1,
    beneficiary1: "",
    beneficiary2: "",
    beneficiary3: "",
    beneficiary4: "",

    isOtherFeeInfor: false,
    feeInfor: "",

    lcId: {},
    amountCurrency: {},
    annexNo: {},
    amountChangeCurrency: "VND",
    amendmentAmount: {},
    amountChange: {},
    newAmountCurrency: {},

    isBeneficiary: {},
  });

  useEffect(() => {
    request
      .post(api.GET_ALL_BRANCH)
      .then((res) => {
        setBranches(res);
      })
      .catch((err) => {
        console.log(err);
      });

    request
      .post(api.GET_LIST_ACCOUNTS_BY_CUSTOMER, {
        entityNumber: "123123",
      })
      .then((res) => {
        if (res?.responseCode === "00000000") {
          setAccounts(uniqBy(res?.responseBody, "account"));

          console.log(res.responseBody);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const changeValueForm = ($event) => {
    setFTC({
      ...fTC,
      [$event.target.name]: $event.target.value,
    });
  };
  const changeValueFormWithProp = (propertyName, value) => {
    setFTC({
      ...fTC,
      [propertyName]: value,
    });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div
          id="stepper1"
          className="bs-stepper col-12"
          style={{ paddingBottom: 40 }}
        >
          <div className="bs-stepper-header" style={{ marginTop: 15 }}>
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
          </div>

          <div className="bs-stepper-content mt-2">
            {/* <div id="tuChinhThuTinDung-s-1" className="content break-word"> */}
            <div className="col-12 border-bottom-dotted pt-2  mb-2 p-0"></div>
            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <div className="row">
                  <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12">
                    <label className="col-form-label ml-4">
                      Tại ACB / <i>At ACB</i>
                      <span className="text-danger">*</span>:
                    </label>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <SelectComponent
                      notFirstDefault
                      name={"branchId"}
                      placeholder={"Chọn Chi nhánh/ Phòng giao dịch"}
                      list={branches}
                      bindLabel={"branchName"}
                      bindValue={"brId"}
                      value={fTC.branchId}
                      onChange={(val) => {
                        setFTC({
                          ...fTC,
                          branchId: val.brId,
                        });
                      }}
                    />

                    {isSubmit && !fTC.branchId && (
                      <div className="invalid-feedback">
                        <div>{"Chọn chi nhánh"}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 border-bottom-dotted pt-2  mb-2 p-0">
              <span className="text-uppercase  m-font-600  theme-color">
                Thông tin khách hàng / <i>Customer information</i>
              </span>
            </div>
            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <div className="row">
                  <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12">
                    <label className="col-form-label ml-4">
                      Tên khách hàng / <i>Customer's name</i>
                      <span className="text-danger">*</span>:
                    </label>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <div className="input-group">
                      <Input disabled name="custName" value={fTC.custName} />
                    </div>
                    <div className="col-xl-2 col-lg-2 col-md-2"></div>
                  </div>
                </div>
                <div className="row mt-1">
                  <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12">
                    <label className="col-form-label ml-4">
                      Mã số khách hàng / <i>CIF</i>
                      <span className="text-danger">*</span>:
                    </label>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <div className="input-group">
                      <Input disabled name="cifCode" value={fTC.cifCode} />
                    </div>
                  </div>
                  <div className="col-xl-2 col-lg-2 col-md-2"></div>
                </div>
                <div className="row mt-1">
                  <div className="col-12">
                    <label className="col-form-label ml-4">
                      Với mọi trách nhiệm thuộc về phần mình, chúng tôi đề nghị
                      ACB như sau /
                      <i>
                        With all responsibilities on our side, we hereby request
                        ACB as follows:
                      </i>
                    </label>
                  </div>
                </div>
              </div>
              {/* </div> */}
            </div>

            <div className="col-12 border-bottom-dotted pt-2  mb-2 p-0">
              <span className="text-uppercase  m-font-600  theme-color">
                Thông tin yêu cầu / <i>DETAILS OF REQUEST</i>
              </span>
            </div>
            <ng-template>
              <div className="row mt-2">
                <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12">
                  <label className="col-form-label ml-4">
                    Quý khách vui lòng chọn 1 trong 2 phương thức sau /
                    <i>Please choose either of the followings</i>
                    <span className="text-danger">*</span>:{" "}
                  </label>
                </div>
                <div className="col-xl-8 col-lg-8 col-md-8 col-sm-6 col-xs-12">
                  <div className="row mt-1">
                    <div className="col-6">
                      <div className="custom-control custom-radio">
                        <input
                          type="radio"
                          id="NhapTuChinh"
                          name="isTuChinhRutGon"
                          className="custom-control-input m-cursor"
                          checked={!isTuChinhRutGon}
                          value={false}
                          onChange={($event) => {
                            setIsTuChinhRutGon(false);
                          }}
                        />
                        <label
                          htmlFor="NhapTuChinh"
                          className="custom-control-label m-cursor"
                        >
                          Nhập thông tin đề nghị tu chỉnh LC/ <br />
                          <i>Input the required information</i>
                        </label>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="custom-control custom-radio">
                        <input
                          type="radio"
                          id="DinhKemTuChinh"
                          name="isTuChinhRutGon"
                          value={true}
                          className="custom-control-input m-cursor"
                          checked={isTuChinhRutGon}
                          onChange={($event) => {
                            setIsTuChinhRutGon(true);
                          }}
                        />
                        <label
                          htmlFor="DinhKemTuChinh"
                          className="custom-control-label m-cursor"
                        >
                          Đính kèm đề nghị tu chỉnh LC / <br />
                          <i>Attach the application</i>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <form className="form-horizontal break-word">
                <div className="row mt-2">
                  <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12">
                    <label className="col-form-label ml-4">
                      Số LC / <i>LC No.</i>
                      <span className="text-danger">*</span>:
                    </label>
                  </div>

                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <div className="input-group">
                      <Input
                        type="text"
                        className={`form-control  ${
                          isSubmit && fTC?.lcId ? "is-invalid" : ""
                        }`}
                        placeholder="Nhập số LC"
                        name="lcId"
                        maxLength="16"
                        minlength="16"
                        //   style={{ "text-transform": "uppercase" }}
                      />
                    </div>
                    {isSubmit && fTC?.lcId && (
                      <div className="invalid-feedback">
                        {isSubmit && fTC?.lcId && (
                          <div>
                            {"international_payment_label.vui_long_nhap_so_lc"}
                          </div>
                        )}
                      </div>
                    )}
                    {/* {fTC?.lcId?.errors?.pattern && (
                        <div className="invalid-feedback">
                          {
                            "international_payment_label.chi_duoc_nhap_ky_tu_hoa_va_so"
                          }
                        </div>
                      )} */}
                    <div>
                      <i>
                        (Vui lòng nhập đủ 16 ký tự / Input all 16 characters)
                      </i>
                    </div>
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12">
                    <label className="col-form-label ml-4">
                      Trị giá LC / <i>LC amount</i>
                      <span className="text-danger">*</span>:
                    </label>
                  </div>

                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <div className="row">
                      <div className="col-6">
                        <SelectComponent
                          name="ccyId"
                          placeholder={"Chọn loại tiền"}
                          notFirstDefault
                          list={currencyList.map((item) => {
                            return {
                              label: item,
                              value: item,
                            };
                          })}
                          value={fTC.ccyId}
                          bindLabel={"label"}
                          bindValue={"value"}
                          onChange={(item) => {
                            setFTC({
                              ...fTC,
                              ccyId: item.value,
                            });
                          }}
                        />

                        {isSubmit && fTC?.ccyId && (
                          <div className="invalid-feedback">
                            <div>
                              {
                                "international_payment_label.vui_long_chon_loai_tien"
                              }
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="col-6">
                        {["VND", "JPY"].includes(fTC?.amountCurrency?.value) ? (
                          <Input
                            name="amount"
                            value={fTC.amount}
                            onChange={changeValueForm}
                            onlyPositive
                            type="text"
                            allowNegativeNumbers={true}
                            mask="separator.0"
                            thousandSeparator=","
                            className={`form-control ${
                              isSubmit && fTC?.amount ? "is-invalid" : ""
                            }`}
                            placeholder="Nhập số tiền"
                            pattern="^[0-9]*[1-9][0-9]*$"
                          />
                        ) : (
                          <Input
                            name="amount"
                            value={fTC.amount}
                            onChange={changeValueForm}
                            onlyPositive
                            type="text"
                            allowNegativeNumbers={true}
                            mask="separator.2"
                            thousandSeparator=","
                            className={`form-control ${
                              isSubmit && (fTC?.amount || fTC?.amount <= 0)
                                ? "is-invalid"
                                : ""
                            }`}
                            placeholder="Nhập số tiền"
                            pattern="^[0-9]*[1-9][0-9]*$"
                          />
                        )}

                        <div className="invalid-feedback">
                          {fTC?.amount && fTC?.amount <= 0 && (
                            <div>
                              {
                                "international_payment_label.vui_long_nhap_tri_gia_lon_hon"
                              }
                              0
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12">
                    <label className="col-form-label ml-4">
                      Ngày phát hành LC / <i>LC issue date</i>{" "}
                      <span className="text-danger">*</span>:
                    </label>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <div className="input-group">
                      <InputComponent
                        name="issueDate"
                        type="date"
                        value={fTC.issueDate}
                        placeholder={"Nhập ngày hợp đồng tín dụng"}
                        onChange={(val) => {
                          changeValueFormWithProp("issueDate", val);
                        }}
                      />
                    </div>

                    {isSubmit && fTC?.issueDate && (
                      <div className="invalid-feedback">
                        {fTC?.issueDate && (
                          <div>
                            {
                              "international_payment_label.vui_long_chon_ngay_phat_hanh_lc"
                            }
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12">
                    <label className="col-form-label ml-4">
                      Tu chỉnh lần thứ / <i>Amendment No</i>
                      <span className="text-danger">*</span>:
                    </label>
                  </div>
                  <div className="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-xs-12">
                    <div className="input-group">
                      <Input
                        type="text"
                        placeholder="Nhập số lần số đổi"
                        min={1}
                        maxLength={999}
                        value={fTC.amendmentNo}
                        name="amendmentNo"
                        onChange={changeValueForm}
                        className={`form-control ${
                          isSubmit && fTC.amendmentNo ? "is-invalid" : ""
                        }`}
                        mask="separator.0"
                      />
                    </div>

                    {isSubmit && fTC.amendmentNo && (
                      <div className="invalid-feedback">
                        {fTC.amendmentNo && (
                          <div>
                            {
                              "international_payment_label.vui_long_nhap_tu_chinh_lan_thu"
                            }
                          </div>
                        )}
                        {fTC.amendmentNo && (
                          <div>
                            {"international_payment_label.lon_nhat_la_999"}
                          </div>
                        )}
                        {fTC.amendmentNo && (
                          <div>
                            {"international_payment_label.nho_nhat_la_1"}{" "}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-12">
                    <div className="input-group ml-4">
                      Ghi chú: Đối với tu chỉnh trị giá LC (tăng / giảm), tên
                      đơn vị thụ hưởng, hàng hóa, khách hàng đính kèm phụ lục
                      hợp đồng ở đây /
                      <i>
                        Note: In case of amendment to LC amount
                        (increase/decrease), Beneficiary's name, description of
                        goods/services, the contract appendix should be attached
                        hereto
                      </i>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-xs-12">
                    <label className="col-form-label ml-4">
                      Hồ sơ kèm theo / <i>Supporting documents</i>
                      {(isTuChinhRutGon ||
                        fTC.isAmendToAmount ||
                        fTC.isAmendToBeneficiary ||
                        fTC.isAmendToGoodsOrServices) && (
                        <span className="text-danger">*</span>
                      )}
                      :
                    </label>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <div className="input-group">
                      <Input
                        className={`form-control mr-1 ${
                          (isSubmit && fTC?.annexNo) || fTC?.annexN
                            ? "is-invalid"
                            : ""
                        }`}
                        type="text"
                        placeholder="Số phụ lục hợp đồng"
                        maxLength={256}
                        name="annexNo"
                        onChange={($event) => {
                          setFTC({
                            ...fTC,
                            annexNo: $event.target.value?.toUpperCase(),
                          });
                        }}
                      />
                      <Input
                        type="text"
                        placeholder="Hồ sơ kèm theo"
                        className={`form-control bg-white ${
                          isSubmit && inInvalidLCEForm ? "is-invalid" : ""
                        }`}
                        value={listFile?.length + " " + "tệp được chọn"}
                        readOnly
                      />
                      <div className="input-group-append input-group-append-custom">
                        <label for="upload">
                          <span>
                            <i className="m-cursor fas fa-cloud-upload-alt text-white pt-1"></i>
                          </span>
                          <Input
                            onChange={() => {
                              // uploadFile()
                            }}
                            type="file"
                            style={{ display: "none" }}
                            multiple="multiple"
                            id="upload"
                            accept="{{validationUtil.ACCEPT_EXCEL_AND_PDF_WORD}}"
                          />
                        </label>
                      </div>
                    </div>
                    <div className="mt-1 row">
                      <div className="col-12">
                        <i>{"Số lượng tệp đính kèm tối đa là 20"}</i>
                        <div>
                          {isSubmit && inInvalidLCEForm && (
                            <span className="invalid-feedback text-right">
                              {"Vui lòng đính kèm tệp"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {showFileList?.length > 0 && (
                      <div className="mt-1 text-right">
                        {/* <p *ngFor="let item of showFileList; let i = index">
            <span className="font-weight-bold text-info">{{item?.file?.name}}
              <span className="text-danger ml-1 m-cursor" (click)="removeFile(i)">
                <i className="far fa-trash-alt"></i>
              </span>
            </span> <br/>
            <i className="text-secondary font-13">{{item?.sha256}}</i>
          </p> */}
                      </div>
                    )}
                    {/* <div *ngIf="isSubmit && fTC?.annexNo?.errors" className="invalid-feedback">
          <div *ngIf="fTC?.annexNo?.errors?.maxLength">{{'international_payment_label.toi_da_255_ky_tu' | translate}}
          </div>
        </div> */}
                  </div>
                  <div className="col-xl-2 col-lg-2 col-md-2 mt-2">
                    <span className="font-17 text-info ml-2 mt-1">
                      <i
                        className="fas fa-info-circle m-cursor"
                        ngbTooltip="{{'international_payment_label.khach_hang_cung_cap_phu_luc_hop_dong_etc' | translate}}"
                      ></i>
                    </span>
                  </div>
                </div>
                {!isTuChinhRutGon && (
                  <>
                    <div className="row mt-2">
                      <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12">
                        <label className="col-form-label ml-4"></label>
                      </div>
                      <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                        <div className="custom-control custom-checkbox d-inline mr-4">
                          <input
                            type="checkbox"
                            id="isAmendToAmount"
                            name="isAmendToAmount"
                            className="custom-control-input m-cursor"
                            onChange={($event) => {
                              setFTC({
                                ...fTC,
                                isAmendToAmount: $event.target.checked,
                              });
                            }}
                          />
                          <label
                            className="custom-control-label m-cursor"
                            htmlFor="isAmendToAmount"
                          >
                            Sửa đổi trị giá LC / <i>Amendment to LC amount</i>
                            {fTC?.isAmendToAmount === true && (
                              <span className="text-danger">*</span>
                            )}
                          </label>
                          <span className="font-17 text-info ml-2">
                            <i
                              className="fas fa-info-circle m-cursor"
                              ngbTooltip={
                                "Khách hàng cung cấp phụ lục hợp đồng"
                              }
                            ></i>
                          </span>
                        </div>
                      </div>

                      {fTC.isAmendToAmount && (
                        <div className="col-12 mt-1">
                          <div className="row">
                            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12"></div>
                            <div className="col-xl-8 col-lg-8 col-md-8 col-sm-12 col-xs-12">
                              <div className="mt-1">
                                <div className="row">
                                  <div className="col-5">
                                    <SelectComponent
                                      notFirstDefault
                                      name="amendToAmountType"
                                      list={[
                                        {
                                          label: "Tăng trị giá/ Increased by",
                                          value: 1,
                                        },
                                        {
                                          label: "Giảm trị giá/ Decreased by",
                                          value: 2,
                                        },
                                      ]}
                                      value={fTC.amendToAmountType}
                                      bindLabel={"label"}
                                      bindValue={"value"}
                                      onChange={(item) => {
                                        setFTC({
                                          ...fTC,
                                          amendToAmountType: item.value,
                                          changedCcyId: "",
                                          changedAmount: "",
                                        });
                                      }}
                                    />
                                  </div>
                                  <div className="col-3">
                                    <div>
                                      <SelectComponent
                                        name="changedCcyId"
                                        placeholder={"Chọn loại tiền"}
                                        notFirstDefault
                                        list={currencyList.map((item) => {
                                          return {
                                            label: item,
                                            value: item,
                                          };
                                        })}
                                        value={fTC.changedCcyId}
                                        bindLabel={"label"}
                                        bindValue={"value"}
                                        onChange={(item) => {
                                          setFTC({
                                            ...fTC,
                                            changedCcyId: item.value,
                                            changedAmount: "",
                                          });
                                        }}
                                      />
                                      {isSubmit && fTC?.changedCcyId && (
                                        <div className="invalid-feedback">
                                          <div>{"Vui lòng chọn loại tiền"}</div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-3">
                                    <input
                                      onlyPositive
                                      type="text"
                                      allowNegativeNumbers={true}
                                      mask="separator.0"
                                      thousandSeparator=","
                                      placeholder="Nhập số tiền"
                                      name="changedAmount"
                                      value={fTC.changedAmount}
                                      onChange={changeValueForm}
                                      className={`form-control 
                                        ${
                                          isSubmit && fTC.changedAmount
                                            ? "is-invalid"
                                            : ""
                                        }`}
                                    />
                                  </div>
                                </div>
                                <div className="row mt-1"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {fTC.isAmendToAmount && (
                        <div className="col-12 mt-1 mb-1">
                          <div className="row">
                            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12"></div>
                            <div className="col-xl-8 col-lg-8 col-md-8 col-sm-12 col-xs-12">
                              <div className="row">
                                <div className="col-5">
                                  <label className="col-form-label ml-3">
                                    Trị giá LC mới / <i>Amended LC amount</i>
                                    <span className="text-danger">*</span>:
                                  </label>
                                </div>
                                <div className="col-3">
                                  <SelectComponent
                                    name="newCcyId"
                                    placeholder={"Chọn loại tiền"}
                                    notFirstDefault
                                    list={currencyList.map((item) => {
                                      return {
                                        label: item,
                                        value: item,
                                      };
                                    })}
                                    value={fTC.newCcyId}
                                    bindLabel={"label"}
                                    bindValue={"value"}
                                    onChange={(item) => {
                                      setFTC({
                                        ...fTC,
                                        newCcyId: item.value,
                                        newAmount: "",
                                      });
                                    }}
                                  />
                                  {isSubmit && fTC.newCcyId && (
                                    <div className="invalid-feedback">
                                      <div>
                                        {
                                          "international_payment_label.vui_long_chon_loai_tien"
                                        }
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div className="col-3">
                                  <input
                                    onlyPositive
                                    type="text"
                                    allowNegativeNumbers={true}
                                    mask="separator.0"
                                    thousandSeparator=","
                                    placeholder="Nhập số tiền"
                                    name="newAmount"
                                    value={fTC.newAmount}
                                    onChange={changeValueForm}
                                    className={`form-control 
                                        ${
                                          isSubmit && fTC.newAmount
                                            ? "is-invalid"
                                            : ""
                                        }`}
                                  />

                                  {/* {!isSubmit &&
                                    (fTC?.newAmount.errors ||
                                      (fTC?.newAmountCurrency?.value &&
                                        fTC?.newAmount?.value &&
                                        fTC?.newAmount?.value <= 0)) && (
                                      <div className="invalid-feedback">
                                        {fTC?.newAmountCurrency?.value &&
                                          fTC?.newAmount?.value &&
                                          fTC?.newAmount?.value <= 0 && (
                                            <div className="invalid-feedback">
                                              {
                                                "international_payment_label.vui_long_nhap_tri_gia_lon_hon"
                                              }{" "}
                                              0
                                            </div>
                                          )}
                                      </div>
                                    )} */}
                                  {/* {isSubmit && fTC?.newAmount.errors && (
                                    <div className="invalid-feedback">
                                      {
                                        "international_payment_label.vui_long_nhap_so_tien"
                                      }
                                    </div>
                                  )} */}
                                  {/* {isSubmit &&
                                    fTC?.newAmountCurrency?.value &&
                                    fTC?.newAmount?.value &&
                                    fTC?.newAmount?.value <= 0 && (
                                      <div className="invalid-feedback">
                                        {fTC?.newAmountCurrency?.value &&
                                          fTC?.newAmount?.value &&
                                          fTC?.newAmount?.value <= 0 && (
                                            <div className="invalid-feedback">
                                              {
                                                "international_payment_label.vui_long_nhap_tri_gia_lon_hon"
                                              }{" "}
                                              0
                                            </div>
                                          )}
                                      </div>
                                    )} */}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="row mt-2">
                      <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12">
                        <label className="col-form-label ml-4"></label>
                      </div>
                      <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                        <div className="custom-control custom-checkbox d-inline mr-4">
                          <input
                            type="checkbox"
                            id="isAmendToBeneficiary"
                            name="isAmendToBeneficiary"
                            className="custom-control-input m-cursor"
                            onChange={($event) => {
                              setFTC({
                                ...fTC,
                                isAmendToBeneficiary: $event.target.checked,
                              });
                            }}
                          />
                          <label
                            className="custom-control-label m-cursor"
                            htmlFor="isAmendToBeneficiary"
                          >
                            Đơn vị thụ hưởng mới / <i>Amended Beneficiary</i>
                            {fTC?.isAmendToBeneficiary === true && (
                              <span className="text-danger">*</span>
                            )}
                          </label>
                          <span className="font-17 text-info ml-2">
                            <i
                              className="fas fa-info-circle m-cursor"
                              ngbTooltip=" {{'international_payment_label.khach_hang_cung_cap_phu_luc_hop_dong' | translate}}"
                            ></i>
                          </span>
                        </div>
                      </div>

                      {fTC?.isAmendToBeneficiary && (
                        <div className="col-12 mt-1">
                          <div className="row">
                            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12"></div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                              <div className="mt-1 mb-2">
                                <div className="input-group mt-1">
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Nhập tên và địa chỉ"
                                    maxLength="35"
                                    name="beneficiary1"
                                    value={fTC.beneficiary1}
                                    onChange={($event) => {
                                      setFTC({
                                        ...fTC,
                                        beneficiary1:
                                          $event.target.value?.toUpperCase(),
                                      });
                                    }}
                                  />
                                </div>
                                {isSubmit && !fTC.beneficiary1 && (
                                  <div>
                                    <div className="invalid-feedback">
                                      {
                                        "Vui lòng nhập thông tin đơn vị thụ hưởng"
                                      }
                                    </div>
                                  </div>
                                )}
                                {/* <div *ngIf="fTC?.beneficiary1?.errors?.pattern" className="invalid-feedback">
                {{'international_payment_label.chi_duoc_nhap_ky_tu_hoa_etc' | translate}} - + : ‘ / ( ) . ,
              </div> */}
                                <div className="input-group mt-1">
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Nhập tên và địa chỉ"
                                    maxLength="35"
                                    name="beneficiary2"
                                    value={fTC.beneficiary2}
                                    onChange={($event) => {
                                      setFTC({
                                        ...fTC,
                                        beneficiary2:
                                          $event.target.value?.toUpperCase(),
                                      });
                                    }}
                                  />
                                </div>
                                {isSubmit && !fTC.beneficiary2 && (
                                  <div>
                                    <div className="invalid-feedback">
                                      {
                                        "Vui lòng nhập thông tin đơn vị thụ hưởng"
                                      }
                                    </div>
                                  </div>
                                )}
                                <div className="input-group mt-1">
                                  <input
                                    className="form-control "
                                    type="text"
                                    placeholder="Nhập tên và địa chỉ"
                                    maxLength="35"
                                    name="beneficiary3"
                                    value={fTC.beneficiary3}
                                    onChange={($event) => {
                                      setFTC({
                                        ...fTC,
                                        beneficiary3:
                                          $event.target.value?.toUpperCase(),
                                      });
                                    }}
                                  />
                                </div>
                                {isSubmit && !fTC.beneficiary3 && (
                                  <div>
                                    <div className="invalid-feedback">
                                      {
                                        "Vui lòng nhập thông tin đơn vị thụ hưởng"
                                      }
                                    </div>
                                  </div>
                                )}

                                <div className="input-group mt-1">
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Nhập tên và địa chỉ"
                                    maxLength="35"
                                    name="beneficiary4"
                                    value={fTC.beneficiary4}
                                    onChange={($event) => {
                                      setFTC({
                                        ...fTC,
                                        beneficiary4:
                                          $event.target.value?.toUpperCase(),
                                      });
                                    }}
                                  />
                                </div>
                                {isSubmit && !fTC.beneficiary4 && (
                                  <div>
                                    <div className="invalid-feedback">
                                      {
                                        "Vui lòng nhập thông tin đơn vị thụ hưởng"
                                      }
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="row mt-2">
                      <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12">
                        <label className="col-form-label ml-4"></label>
                      </div>
                      <div className="col-xl-8 col-lg-8 col-md-8 col-sm-6 col-xs-12">
                        <div className="custom-control custom-checkbox d-inline">
                          <input
                            type="checkbox"
                            id="isAmendToGoodsOrServices"
                            name="isAmendToGoodsOrServices"
                            className="custom-control-input m-cursor"
                            onChange={($event) => {
                              setFTC({
                                ...fTC,
                                isAmendToGoodsOrServices: $event.target.checked,
                              });
                            }}
                          />
                          <label
                            className="custom-control-label m-cursor"
                            htmlFor="isAmendToGoodsOrServices"
                          >
                            Mô tả hàng hóa và/hoặc dịch vụ mới /{" "}
                            <i>Amended description of goods and/or services</i>
                            {fTC?.isAmendToGoodsOrServices && (
                              <span className="text-danger">*</span>
                            )}
                          </label>
                          <span className="font-17 text-info ml-2">
                            <i
                              className="fas fa-info-circle m-cursor"
                              ngbTooltip=" {{'international_payment_label.khach_hang_cung_cap_phu_luc_hop_dong' | translate}}"
                            ></i>
                          </span>
                        </div>
                      </div>

                      {fTC?.isAmendToGoodsOrServices && (
                        <div className="col-12 mt-1">
                          <div className="row">
                            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12"></div>
                            <div className="col-xl-7 col-lg-7 col-md-7 col-sm-6 col-xs-12">
                              <div className="mt-1 mb-2">
                                <div className="mt-1">
                                  <textarea
                                    className="form-control"
                                    type="text"
                                    rows="5"
                                    name="goodsDescription"
                                    value={fTC.goodsDescription}
                                    onChange={($event) => {
                                      setFTC({
                                        ...fTC,
                                        goodsDescription:
                                          $event.target.value?.toUpperCase(),
                                      });
                                    }}
                                    placeholder="Nhập thông tin"
                                    maxLength="52000"
                                  ></textarea>
                                </div>
                                {isSubmit && fTC?.goodsDescription && (
                                  <div className="invalid-feedback">
                                    {fTC?.goodsDescription?.errors.required && (
                                      <div>{"Vui lòng nhập thông tin"}</div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="row mt-2">
                      <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12">
                        <label className="col-form-label ml-4"></label>
                      </div>
                      <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                        <div className="custom-control custom-checkbox d-inline">
                          <input
                            type="checkbox"
                            id="isAmendToExpiredDate"
                            name="isAmendToExpiredDate"
                            className="custom-control-input m-cursor"
                            onChange={($event) => {
                              setFTC({
                                ...fTC,
                                isAmendToExpiredDate: $event.target.checked,
                              });
                            }}
                          />
                          <label
                            className="custom-control-label m-cursor"
                            htmlFor="isAmendToExpiredDate"
                          >
                            Ngày hết hiệu lực mới / <i>Amended expiry date</i>
                            {fTC?.isAmendToExpiredDate && (
                              <span className="text-danger">*</span>
                            )}
                          </label>
                        </div>
                      </div>
                      {fTC?.isAmendToExpiredDate && (
                        <div className="col-12 mt-1 mb-1">
                          <div className="row">
                            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12"></div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                              <div className="input-group">
                                <InputComponent
                                  name="expiredDate"
                                  type="date"
                                  value={fTC.expiredDate}
                                  onChange={(val) => {
                                    changeValueFormWithProp("expiredDate", val);
                                  }}
                                />
                              </div>

                              {isSubmit && fTC?.expiredDate && (
                                <div className="invalid-feedback">
                                  {"Vui lòng chọn ngày hết hiệu lực mới"}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="row mt-2">
                      <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12">
                        <label className="col-form-label ml-4"></label>
                      </div>
                      <div className="col-xl-8 col-lg-8 col-md-8 col-sm-8 col-xs-12">
                        <div className="custom-control custom-checkbox d-inline">
                          <input
                            type="checkbox"
                            id="isAmendToLatestDateOfShipment"
                            name="isAmendToLatestDateOfShipment"
                            className="custom-control-input m-cursor"
                            onChange={($event) => {
                              setFTC({
                                ...fTC,
                                isAmendToLatestDateOfShipment:
                                  $event.target.checked,
                              });
                            }}
                          />
                          <label
                            className="custom-control-label m-cursor"
                            htmlFor="isAmendToLatestDateOfShipment"
                          >
                            Ngày giao hàng chậm nhất mới /{" "}
                            <i>Amended latest date of shipment</i>
                            {fTC?.isAmendToLatestDateOfShipment && (
                              <span className="text-danger">*</span>
                            )}
                          </label>
                        </div>
                      </div>
                      {fTC?.isAmendToLatestDateOfShipment && (
                        <div className="col-12 mt-1 mb-1">
                          <div className="row">
                            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12"></div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                              <div className="input-group">
                                <InputComponent
                                  name="expiredDate"
                                  type="date"
                                  value={fTC.latestDate}
                                  onChange={(val) => {
                                    changeValueFormWithProp("latestDate", val);
                                  }}
                                />
                              </div>

                              {isSubmit && fTC?.lastestDate && (
                                <div className="invalid-feedback">
                                  {"Vui lòng chọn ngày giao hàng chậm nhất mới"}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="row mt-2">
                      <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12">
                        <label className="col-form-label ml-4"></label>
                      </div>
                      <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                        <div className="custom-control custom-checkbox d-inline mr-4">
                          <input
                            type="checkbox"
                            id="isAmendToRequiredDocument"
                            name="isAmendToRequiredDocument"
                            className="custom-control-input m-cursor"
                            onChange={($event) => {
                              setFTC({
                                ...fTC,
                                isAmendToRequiredDocument:
                                  $event.target.checked,
                              });
                            }}
                          />
                          <label
                            className="custom-control-label m-cursor"
                            htmlFor="isAmendToRequiredDocument"
                          >
                            Chứng từ yêu cầu mới /{" "}
                            <i>Amended documents required</i>
                            {fTC?.isAmendToRequiredDocument && (
                              <span className="text-danger">*</span>
                            )}
                          </label>
                        </div>
                      </div>

                      {fTC?.isAmendToRequiredDocument && (
                        <div className="col-12 mt-1">
                          <div className="row">
                            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12"></div>
                            <div className="col-xl-7 col-lg-7 col-md-7 col-sm-6 col-xs-12">
                              <div className="mt-1 mb-2">
                                <div className="mt-1">
                                  <textarea
                                    className={`form-control ${
                                      (isSubmit &&
                                        fTC?.documentsRequied.errors) ||
                                      fTC?.documentsRequied?.errors?.pattern
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                    type="text"
                                    rows="5"
                                    placeholder="Nhập thông tin"
                                    name="requiredDocuments"
                                    value={fTC.requiredDocuments}
                                    onChange={($event) => {
                                      setFTC({
                                        ...fTC,
                                        requiredDocuments:
                                          $event.target.value?.toUpperCase(),
                                      });
                                    }}
                                    maxLength="52000"
                                  ></textarea>
                                </div>
                                {isSubmit && fTC?.requiredDocuments && (
                                  <div className="invalid-feedback">
                                    {"Vui lòng nhập chứng từ yêu cầu"}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="row mt-2">
                      <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12">
                        <label className="col-form-label ml-4"></label>
                      </div>
                      <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                        <div className="custom-control custom-checkbox d-inline mr-4">
                          <input
                            type="checkbox"
                            id="isAmendToOthers"
                            name="isAmendToOthers"
                            className="custom-control-input m-cursor"
                            onChange={($event) => {
                              setFTC({
                                ...fTC,
                                isAmendToOthers: $event.target.checked,
                              });
                            }}
                          />
                          <label
                            className="custom-control-label m-cursor"
                            htmlFor="isAmendToOthers"
                          >
                            Các sửa đổi khác / <i>Others</i>
                            {fTC?.isAmendToOthers && (
                              <span className="text-danger">*</span>
                            )}
                          </label>
                        </div>
                      </div>
                      {fTC?.isAmendToOthers && (
                        <div className="col-12 mt-1 mb-1">
                          <div className="row">
                            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12"></div>
                            <div className="col-xl-7 col-lg-7 col-md-7 col-sm-6 col-xs-12">
                              <div className="input-group">
                                <textarea
                                  className={`form-control text-uppercase ${
                                    isSubmit && fTC?.otherAmendments
                                  } ? "is-invalid: "}`}
                                  rows="5"
                                  value={fTC.otherAmendments}
                                  onChange={($event) => {
                                    setFTC({
                                      ...fTC,
                                      otherAmendments:
                                        $event.target.value?.toUpperCase(),
                                    });
                                  }}
                                  placeholder="Nhập thông tin"
                                  name="otherAmendments"
                                  maxLength="52000"
                                />
                              </div>
                              {isSubmit && fTC?.otherAmendments && (
                                <div className="invalid-feedback">
                                  {"Vui lòng nhập các sửa đổi khác"}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="row mt-2 mr-2">
                      <div className="col-12">
                        <label className="col-form-label ml-4">
                          Các điều khoản và điều kiện khác không thay đổi /{" "}
                          <i>All other terms and conditions remain unchanged</i>
                        </label>
                      </div>
                    </div>
                    <div className="col-12 border-bottom-dotted pt-2  mb-2 p-0">
                      <span className="text-uppercase  m-font-600  theme-color">
                        Thông tin phí / <i>FEES</i>
                      </span>
                    </div>
                    <div className="row">
                      <div className="col-12 mt-1">
                        <div className="row">
                          <div className="col-12 mt-1">
                            <div className="row">
                              <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12">
                                <label className="col-form-label ml-4">
                                  {" "}
                                  Phí sửa đổi / <i>Amendment fee</i>
                                </label>
                              </div>
                              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12"></div>
                              <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12">
                                <label className="col-form-label ml-4">
                                  {" "}
                                  của ngân hàng phát hành LC do / <br />
                                  <i>charged by Issuing bank is for</i>
                                </label>
                              </div>
                              <div className="col-xl-7 col-lg-7 col-md-7 col-sm-7 col-xs-12">
                                <div className="mt-1 mb-2 row">
                                  <div className="col-6">
                                    <div className="custom-control custom-radio d-inline">
                                      <input
                                        type="radio"
                                        id="sd-nganHangPhatHanhDeNghi"
                                        name="chiuPhiPhatHanh"
                                        className="custom-control-input m-cursor"
                                        value={"DV_PHAT_HANH"}
                                        checked={
                                          chiuPhiPhatHanh === "DV_PHAT_HANH"
                                        }
                                        onChange={($event) => {
                                          setChiuPhiPhatHanh("DV_PHAT_HANH");
                                        }}
                                      />
                                      <label
                                        className="custom-control-label m-cursor"
                                        for="sd-nganHangPhatHanhDeNghi"
                                      >
                                        Đơn vị đề nghị chịu/ <br />
                                        <i>Applicant’s account</i>
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-6 pl-0">
                                    <div className="custom-control custom-radio d-inline">
                                      <input
                                        type="radio"
                                        id="sd-nganHangPhatHanhThuHuong"
                                        name="chiuPhiPhatHanh"
                                        className="custom-control-input m-cursor"
                                        value={"DV_THU_HUONG"}
                                        checked={
                                          chiuPhiPhatHanh === "DV_THU_HUONG"
                                        }
                                        onChange={($event) => {
                                          setChiuPhiPhatHanh("DV_THU_HUONG");
                                        }}
                                      />
                                      <label
                                        className="custom-control-label m-cursor"
                                        for="sd-nganHangPhatHanhThuHuong"
                                      >
                                        Đơn vị thụ hưởng chịu/ <br />
                                        <i>Beneficiary’s account </i>
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-12 mt-1">
                            <div className="row">
                              <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12">
                                <label className="col-form-label ml-4">
                                  của ngân hàng thông báo LC do/
                                  <br />
                                  <i>charged by Advising bank is for</i>{" "}
                                </label>
                              </div>
                              <div className="col-xl-7 col-lg-7 col-md-7 col-sm-7 col-xs-12">
                                <div className="mt-1 mb-2 row">
                                  <div className="col-6">
                                    <div className="custom-control custom-radio d-inline">
                                      <input
                                        type="radio"
                                        id="sd-nganHangThongBaoDeNghi"
                                        name="chiuPhiThongBao"
                                        className="custom-control-input m-cursor"
                                        value={"DV_PHAT_HANH"}
                                        checked={
                                          chiuPhiThongBao === "DV_PHAT_HANH"
                                        }
                                        onChange={($event) => {
                                          setChiuPhiThongBao("DV_PHAT_HANH");
                                        }}
                                      />
                                      <label
                                        className="custom-control-label m-cursor"
                                        for="sd-nganHangThongBaoDeNghi"
                                      >
                                        Đơn vị đề nghị chịu/ <br />
                                        <i>Applicant’s account</i>
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-6  pl-0">
                                    <div className="custom-control custom-radio d-inline">
                                      <input
                                        type="radio"
                                        id="sd-nganHangThongBaoThuHuong"
                                        name="chiuPhiThongBao"
                                        className="custom-control-input m-cursor"
                                        value={"DV_THU_HUONG"}
                                        checked={
                                          chiuPhiThongBao === "DV_THU_HUONG"
                                        }
                                        onChange={($event) => {
                                          setChiuPhiThongBao("DV_THU_HUONG");
                                        }}
                                      />
                                      <label
                                        className="custom-control-label m-cursor"
                                        for="sd-nganHangThongBaoThuHuong"
                                      >
                                        Đơn vị thụ hưởng chịu/ <br />
                                        <i>Beneficiary’s account </i>
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-12 mt-1">
                        <div className="row">
                          <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12">
                            <div className="custom-control custom-checkbox d-inline ml-4">
                              <Input
                                type="checkbox"
                                id="tc_phiKhac"
                                name="isOtherFeeInfor"
                                onChange={($event) => {
                                  setFTC({
                                    ...fTC,
                                    isOtherFeeInfor: $event.target.checked,
                                  });
                                }}
                                className="custom-control-input m-cursor"
                              />
                              <label
                                className="custom-control-label col-form-label m-cursor"
                                for="tc_phiKhac"
                              >
                                Phí khác / <i>Others</i>
                                {fTC?.isOtherFeeInfor && (
                                  <span className="text-danger">*</span>
                                )}
                              </label>
                            </div>
                          </div>
                          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                            {fTC?.isOtherFeeInfor && (
                              <textarea
                                maxLength={255}
                                className={`form-control  mb-2  ${
                                  isSubmit && fTC.feeInfor ? "is-invalid" : ""
                                }`}
                                rows={5}
                                placeholder="Phí khác"
                                name="feeInfor"
                                onChange={($event) => {
                                  setFTC({
                                    ...fTC,
                                    feeInfor:
                                      $event.target.value?.toUpperCase(),
                                  });
                                }}
                              />
                            )}
                            {isSubmit && fTC.feeInfor && (
                              <div className="invalid-feedback">
                                {"Vui lòng nhập đầy đủ thông tin"}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="row mt-1">
                          <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12">
                            <label className="col-form-label ml-4">
                              {" "}
                              Tài khoản thu phí / <br />
                              <i>Account for fee collection</i>{" "}
                              <span className="text-danger">*</span>:
                            </label>
                          </div>
                          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                            <SelectComponent
                              notFirstDefault
                              name="accountFee"
                              placeholder={"Chọn tài khoản"}
                              list={accounts}
                              bindLabel={"account"}
                              bindValue={"account"}
                              value={fTC.accountFee}
                              onChange={(val) => {
                                setFTC({
                                  ...fTC,
                                  accountFee: val.account,
                                });
                              }}
                            />
                            {/* <ng-select className="mr-2" clearable={false}
              placeholder="{{'international_payment_label.chon_tai_khoan' | translate}}" [items]="accountList"
              bindLabel="accDisplay" bindValue="accountNo" name="accountFees">
            </ng-select> */}
                            {isSubmit && fTC.accountFee && (
                              <div className="invalid-feedback">
                                {"Vui lòng chọn tài khoản thu phí"}
                              </div>
                            )}
                          </div>
                        </div>
                        {fTC?.isAmendToAmount &&
                          fTC?.amendToAmountType === 1 && (
                            <div className="row">
                              <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12">
                                <label className="col-form-label ml-4">
                                  Đơn vị chịu phí sửa đổi tăng giá trị (nếu có)
                                  / <br />{" "}
                                  <i>
                                    Amendment fee for amount increase (if any)
                                    is for
                                  </i>
                                </label>
                              </div>
                              <div className="col-xl-7 col-lg-7 col-md-7 col-sm-7 col-xs-12">
                                <div className="mt-1 mb-2 row">
                                  <div className="col-6">
                                    <div className="custom-control custom-radio d-inline">
                                      <input
                                        type="radio"
                                        id="sd-chiuPhiTangGiaTriDeNghi"
                                        name="chiuPhiSuaDoi"
                                        className="custom-control-input m-cursor"
                                        value={"DV_PHAT_HANH"}
                                        checked={
                                          chiuPhiSuaDoi === "DV_PHAT_HANH"
                                        }
                                        onChange={($event) => {
                                          setChiuPhiSuaDoi("DV_PHAT_HANH");
                                        }}
                                      />
                                      <label
                                        className="custom-control-label m-cursor"
                                        for="sd-chiuPhiTangGiaTriDeNghi"
                                      >
                                        Đơn vị đề nghị chịu/ <br />
                                        <i>Applicant’s account</i>
                                      </label>
                                    </div>
                                  </div>
                                  <div className="col-6  pl-0">
                                    <div className="custom-control custom-radio d-inline">
                                      <input
                                        type="radio"
                                        id="sd-chiuPhiTangGiaTriThuHuong"
                                        name="chiuPhiSuaDoi"
                                        className="custom-control-input m-cursor"
                                        value={"DV_THU_HUONG"}
                                        checked={
                                          chiuPhiSuaDoi === "DV_THU_HUONG"
                                        }
                                        onChange={($event) => {
                                          setChiuPhiSuaDoi("DV_THU_HUONG");
                                        }}
                                      />
                                      <label
                                        className="custom-control-label m-cursor"
                                        for="sd-chiuPhiTangGiaTriThuHuong"
                                      >
                                        Đơn vị thụ hưởng chịu/ <br />
                                        <i>Beneficiary’s account</i>
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        {fTC?.isAmendToAmount &&
                          fTC?.amendToAmountType === 1 &&
                          chiuPhiSuaDoi === "DV_PHAT_HANH" && (
                            <div>
                              <div className="row">
                                <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12"></div>
                                <div className="col-xl-8 col-lg-8 col-md-8 col-sm-6 col-xs-12">
                                  <span className="theme-color mr-2">
                                    Nguồn vốn thanh toán phần trị giá Thư tín
                                    dụng tăng thêm (nếu có) /{" "}
                                    <i>
                                      Funds covering the increased LC amount (if
                                      any)
                                    </i>
                                  </span>
                                  <i
                                    className="fas fa-info-circle m-cursor text-info"
                                    ngbTooltip="{{'international_payment_label.nguon_von_thanh_toan' | translate}}"
                                  ></i>
                                </div>
                              </div>

                              <div>
                                <div className="row">
                                  <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12"></div>
                                  <div className="col-xl-8 col-lg-8 col-md-8 col-sm-6 col-xs-12">
                                    <div className="mt-1 mb-2">
                                      <div className="custom-control custom-radio">
                                        <input
                                          type="radio"
                                          id="uyQuyen"
                                          name="nguonVon"
                                          className="custom-control-input m-cursor"
                                          value={"UY_QUYEN"}
                                          checked={nguonVon === "UY_QUYEN"}
                                          onChange={($event) => {
                                            setNguonVon("UY_QUYEN");
                                          }}
                                        />
                                        <label
                                          className="custom-control-label m-cursor"
                                          for="uyQuyen"
                                        >
                                          Chúng tôi ủy quyền cho ACB ghi nợ tài
                                          khoản của chúng tôi số tiền là /
                                          <i>
                                            We authorize ACB to debit our
                                            account for
                                          </i>
                                        </label>
                                      </div>
                                      <div className="row">
                                        <div className="mb-1 mt-1 col-5">
                                          <SelectComponent
                                            disabled={nguonVon !== "UY_QUYEN"}
                                            notFirstDefault
                                            name="accountNguonVon"
                                            placeholder={"Chọn tài khoản"}
                                            list={accounts}
                                            bindLabel={"account"}
                                            bindValue={"account"}
                                            value={fTC.accountNguonVon}
                                            onChange={(val) => {
                                              setFTC({
                                                ...fTC,
                                                accountNguonVon: val.account,
                                              });
                                            }}
                                          />

                                          {isSubmit && fTC?.accountNguonVon && (
                                            <div className="invalid-feedback">
                                              {"Vui lòng chọn tài khoản"}
                                            </div>
                                          )}
                                        </div>
                                        <div className="mb-1 mt-1 col-3">
                                          <SelectComponent
                                            disabled={nguonVon !== "UY_QUYEN"}
                                            name="nguonVonCcyId"
                                            placeholder={"Chọn loại tiền"}
                                            notFirstDefault
                                            list={currencyList.map((item) => {
                                              return {
                                                label: item,
                                                value: item,
                                              };
                                            })}
                                            value={fTC.nguonVonCcyId}
                                            bindLabel={"label"}
                                            bindValue={"value"}
                                            onChange={(item) => {
                                              setFTC({
                                                ...fTC,
                                                nguonVonCcyId: item.value,
                                              });
                                            }}
                                          />

                                          {isSubmit && fTC?.nguonVonCcyId && (
                                            <div className="invalid-feedback">
                                              {"Vui lòng chọn loại tiền"}
                                            </div>
                                          )}
                                        </div>

                                        <div className="mb-1 mt-1 col-3">
                                          <input
                                            disabled={nguonVon !== "UY_QUYEN"}
                                            onlyPositive
                                            type="text"
                                            allowNegativeNumbers={true}
                                            mask="separator.0"
                                            thousandSeparator=","
                                            placeholder="Nhập số tiền"
                                            name="nguonVondAmount"
                                            value={fTC.nguonVondAmount}
                                            onChange={changeValueForm}
                                            className={`form-control 
                                        ${
                                          isSubmit && fTC.nguonVondAmount
                                            ? "is-invalid"
                                            : ""
                                        }`}
                                          />
                                          {isSubmit && fTC?.nguonVondAmount && (
                                            <div className="invalid-feedback">
                                              {"Vui lòng nhập số tiền"}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <div>
                                        <label>
                                          tại ACB để ký quỹ cho trị giá Thư tín
                                          dụng tăng thêm /
                                          <i>
                                            at ACB as the margin deposit for the
                                            LC amount increase.
                                          </i>
                                          {fTC?.isFundsToPay?.value && (
                                            <span className="text-danger">
                                              *
                                            </span>
                                          )}
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12"></div>
                                  <div className="col-xl-8 col-lg-8 col-md-8 col-sm-6 col-xs-12">
                                    <div className="mt-1 mb-2">
                                      <div className="custom-control custom-radio d-inline mr-4">
                                        <input
                                          type="radio"
                                          id="khac"
                                          name="nguonVon"
                                          value={"NGUON_VON_KHAC"}
                                          checked={
                                            nguonVon === "NGUON_VON_KHAC"
                                          }
                                          onChange={($event) => {
                                            setNguonVon("NGUON_VON_KHAC");
                                          }}
                                          className="custom-control-input m-cursor"
                                        />
                                        <label
                                          className="custom-control-label m-cursor"
                                          for="khac"
                                        >
                                          Khác / <i>Others</i>
                                          {nguonVon === "NGUON_VON_KHAC" && (
                                            <span className="text-danger">
                                              *
                                            </span>
                                          )}
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                  {nguonVon === "NGUON_VON_KHAC" && (
                                    <div className="col-12 mt-1 mb-1">
                                      <div className="row">
                                        <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-xs-12"></div>
                                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                          <div className="input-group">
                                            <textarea
                                              className="form-control"
                                              rows="5"
                                              placeholder="Nhập nội dung"
                                              name="nguonVonKhacInfo"
                                              maxLength="255"
                                              onChange={($event) => {
                                                setFTC({
                                                  ...fTC,
                                                  nguonVonKhacInfo:
                                                    $event.target.value?.toUpperCase(),
                                                });
                                              }}
                                            ></textarea>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                        <div className="row mt-1">
                          <div className="col-12">
                            <label className="col-form-label break-word ml-4">
                              Trường hợp phí sửa đổi LC không được người thụ
                              hưởng thanh toán cho ACB và NHNNg, chúng tôi cam
                              kết sẽ thanh toán thay /
                              <i>
                                Should the LC amendment fee be not paid to ACB
                                and the foreign bank, we shall pay on
                                Beneficiary’s behalf
                              </i>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </form>
            </ng-template>
          </div>
        </div>
      </div>
    </div>
  );
};

export const currencyList = [
  "VND",
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

export default EditLCOnline;
