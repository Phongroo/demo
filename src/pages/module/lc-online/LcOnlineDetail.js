import {
  getLabelByIdInArray,
  parseDate,
  Toast,
  TypeToast,
} from "../../../utils/app.util";
import { createFileType, downloadFile } from "../../../utils/exportFile";
import React from "react";
import request from "../../../utils/request";
import api from "../../../utils/api";

export const LcOnlineDetail = (props) => {
  const { lcDetail, baseBrList, passEntry } = props;
  const showFileList = [];

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 card-box">
          <h5>
            Trạng thái / Status:
            <span class="text-primary"></span>
          </h5>

          <div class="row">
            <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <div class="row">
                <div class="col-xl-5 col-lg-6 col-md-5 col-sm-5 col-xs-12">
                  <label className="col-form-label ml-4">
                    Số giao dịch / <i>Transaction No.</i>
                  </label>
                </div>
                <div class="col-1 col-form-label">:</div>
                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                  <label className="col-form-label font-weight-bold">
                    {lcDetail?.contractId}
                  </label>
                </div>
              </div>
              <div class="row">
                <div class="col-xl-5 col-lg-6 col-md-5 col-sm-5 col-xs-12">
                  <label className="col-form-label ml-4">
                    Tại Eximbank / <i>At Eximbank</i>{" "}
                  </label>
                </div>
                <div class="col-1 col-form-label">:</div>
                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                  <label className="col-form-label font-weight-bold">
                    {getLabelByIdInArray(
                      lcDetail?.branchId,
                      baseBrList,
                      "code",
                      "branchName"
                    )}
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/*A - DANG KY LC*/}

          <div className="row">
            {lcDetail?.isCompact === "Y" ? (
              <>
                <div class="col-12 border-bottom-dotted pt-2  mb-2 p-0">
                  <span class="text-uppercase  m-font-600  theme-color">
                    Phương thức thanh toán / <i>Payment methods</i>{" "}
                  </span>
                </div>

                <div class="row">
                  <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <div class="row">
                      <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11">
                        <label class="col-form-label ml-4">
                          Thanh toán / <i>Payment</i>
                        </label>
                      </div>
                      <div class="col-1 col-form-label">:</div>
                      <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                        <label class="col-form-label font-weight-bold">
                          {lcDetail?.pay === "true" &&
                            !(
                              lcDetail?.pay === "true" &&
                              lcDetail?.pay2 === "true"
                            ) && <p>AT SIGHT</p>}
                          {lcDetail?.pay2 === "true" &&
                            !(
                              lcDetail?.pay === "true" &&
                              lcDetail?.pay2 === "true"
                            ) && <p>USANCE / DEFFERED</p>}
                          {lcDetail?.pay === "true" &&
                            lcDetail?.pay2 === "true" && <p>MIXED PAYMENT</p>}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-12 border-bottom-dotted pt-2  mb-2 p-0">
                  <span class="text-uppercase  m-font-600  theme-color">
                    Thông tin khách hàng / <i>Customer information</i>{" "}
                  </span>
                </div>

                <div class="row">
                  <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <div class="row">
                      <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11">
                        <label class="col-form-label ml-4">
                          Tên khách hàng / <i>Customer's name</i>
                        </label>
                      </div>
                      <div class="col-1 col-form-label">:</div>
                      <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                        <label class="col-form-label font-weight-bold text-uppercase break-word">
                          {lcDetail?.custName}
                        </label>
                      </div>
                      <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11">
                        <label class="col-form-label ml-4">
                          Mã số khách hàng / <i>CIF</i>
                        </label>
                      </div>
                      <div class="col-1 col-form-label">:</div>
                      <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                        <label class="col-form-label font-weight-bold text-uppercase break-word">
                          {lcDetail?.cifCode}
                        </label>
                      </div>
                      <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11">
                        <label class="col-form-label ml-4">
                          Địa chỉ / <i>Address</i>
                        </label>
                      </div>
                      <div class="col-1 col-form-label">:</div>
                      <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                        <label class="col-form-label font-weight-bold text-uppercase break-word">
                          {lcDetail?.custAddress}
                        </label>
                      </div>
                      <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11">
                        <label class="col-form-label ml-4">
                          Số điện thoại / <i>Tel No.</i>
                        </label>
                      </div>
                      <div class="col-1 col-form-label">:</div>
                      <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                        <label class="col-form-label font-weight-bold text-uppercase break-word">
                          {lcDetail?.custTel}
                        </label>
                      </div>
                      <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11">
                        <label class="col-form-label ml-4">
                          Họ tên người đại diện khách hàng đề nghị bảo lãnh /
                          <i>
                            Name of the representative applying for guarantee
                          </i>
                        </label>
                      </div>
                      <div class="col-1 col-form-label">:</div>
                      <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                        <label class="col-form-label font-weight-bold text-uppercase break-word">
                          {lcDetail?.representativeName}
                        </label>
                      </div>
                      <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11">
                        <label class="col-form-label ml-4">
                          Chức vụ / <i>Position</i>
                        </label>
                      </div>
                      <div class="col-1 col-form-label">:</div>
                      <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                        <label class="col-form-label font-weight-bold text-uppercase break-word">
                          {lcDetail?.representativeJob}
                        </label>
                      </div>
                      <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11">
                        <label class="col-form-label ml-4">
                          Tài khoản VND / <i>VND account</i>
                        </label>
                      </div>
                      <div class="col-1 col-form-label">:</div>
                      <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                        <label class="col-form-label font-weight-bold text-uppercase break-word">
                          {lcDetail?.vndAccount}
                        </label>
                      </div>
                      <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11">
                        <label class="col-form-label ml-4">
                          Tài khoản ngoại tệ / <i>Foreign currency account</i>
                        </label>
                      </div>
                      <div class="col-1 col-form-label">:</div>
                      <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                        <label class="col-form-label font-weight-bold text-uppercase break-word">
                          {lcDetail?.fcAccount !== null
                            ? lcDetail?.fcAccount
                            : "-"}
                        </label>
                      </div>
                      <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11">
                        <label class="col-form-label ml-4">
                          Hồ sơ kèm theo / <i>Supporting documents</i>
                        </label>
                      </div>
                      <div class="col-1 col-form-label">:</div>
                      <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                        <label class="col-form-label font-weight-bold text-uppercase break-word">
                          {lcDetail?.salesContract || "-"}
                        </label>
                      </div>
                      <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11">
                        <label class="col-form-label ml-4">File</label>
                      </div>
                      <div class="col-1 col-form-label">:</div>
                      <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 col-form-label">
                        <span class="break-word">
                          {lcDetail?.documents?.map((item) => {
                            return (
                              <p>
                                <a
                                  onClick={downloadFile(
                                    item?.contractId,
                                    item?.docId,
                                    item?.fileType,
                                    item?.docName,
                                    "LCCreate"
                                  )}
                                >
                                  <span class="font-weight-bold">
                                    {item?.docName}
                                  </span>{" "}
                                  {"\n"}
                                  <i class="text-secondary font-13">
                                    {item?.sha256}
                                  </i>
                                </a>
                              </p>
                            );
                          })}
                        </span>
                        {showFileList?.length === 0 && (
                          <span class="font-weight-bold">-</span>
                        )}
                      </div>
                      <div class="col-11 mt-2 ml-4">
                        <i>
                          Với mọi trách nhiệm thuộc về mình, chúng tôi đề nghị
                          Eximbank phát hành một thư tín dụng không hủy ngang
                          với nội dung sau (vui lòng điền thông tin thích hợp) /
                          With all responsibilities on our sides, we hereby
                          request Eximbank to issue an irrevocable Letter of
                          Credit with the following content (Please fill in the
                          appropriate information)
                        </i>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-12 border-bottom-dotted pt-2  mb-2 p-0">
                  <span class="text-uppercase  m-font-600  theme-color">
                    THÔNG TIN LC / <i>LC INFORMATION</i>
                  </span>
                </div>

                <div class="row">
                  <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11">
                    <label class="col-form-label ml-4">
                      Đơn vị đề nghị / <i>Applicant</i>
                    </label>
                  </div>
                  <div class="col-1 col-form-label">:</div>
                  <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <label class="col-form-label font-weight-bold text-uppercase break-word">
                      {lcDetail?.applicant1 && <p>{lcDetail?.applicant1}</p>}
                      {lcDetail?.applicant2 && <p>{lcDetail?.applicant2}</p>}
                      {lcDetail?.applicant3 && <p>{lcDetail?.applicant3}</p>}
                      {lcDetail?.applicant4 && <p>{lcDetail?.applicant4}</p>}
                    </label>
                  </div>
                  <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11">
                    <label class="col-form-label ml-4">
                      Đơn vị thụ hưởng / <i>Beneficiary</i>
                    </label>
                  </div>
                  <div class="col-1 col-form-label">:</div>
                  <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <label class="col-form-label font-weight-bold text-uppercase break-word">
                      {lcDetail?.beneficiary1 && (
                        <p>{lcDetail?.beneficiary1}</p>
                      )}
                      {lcDetail?.beneficiary2 && (
                        <p>{lcDetail?.beneficiary2}</p>
                      )}
                      {lcDetail?.beneficiary3 && (
                        <p>{lcDetail?.beneficiary3}</p>
                      )}
                      {lcDetail?.beneficiary4 && (
                        <p>{lcDetail?.beneficiary4}</p>
                      )}
                    </label>
                  </div>
                  <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11">
                    <label class="col-form-label ml-4">
                      Loại tiền/Trị giá LC / <i>Currency/LC amount</i>{" "}
                    </label>
                  </div>
                  <div class="col-1 col-form-label">:</div>
                  <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <label class="col-form-label font-weight-bold text-uppercase break-word">
                      {lcDetail?.currency}
                      {lcDetail?.currency === "VND" ||
                      lcDetail?.currency === "JPY"
                        ? lcDetail?.amount
                        : lcDetail?.amount + " USD"}
                    </label>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div class="col-12 border-bottom-dotted pt-2  mb-2 p-0">
                  <span class="text-uppercase  m-font-600  theme-color">
                    Phương thức thanh toán / <i>Payment methods</i>{" "}
                  </span>
                </div>

                <div class="row">
                  <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <div class="row">
                      <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11">
                        <label class="col-form-label ml-4">
                          Ký quỹ mở LC / <i>Margin deposit</i>
                        </label>
                      </div>
                      <div class="col-1 col-form-label">:</div>
                      <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                        <label class="col-form-label font-weight-bold text-uppercase">
                          {lcDetail?.guaranteeAmount === "WHOLLY" && (
                            <p>{lcDetail?.guaranteeAmount} </p>
                          )}
                          {lcDetail?.settlementInstruc1 === "AMOUNT" && (
                            <p>
                              {lcDetail?.guaranteeAmount}
                              {lcDetail?.settlementInstruc1 === "AMOUNT" && (
                                <span>
                                  - {lcDetail?.settlementInstruc1}:
                                  {lcDetail?.guaranteeCurrency}
                                  {lcDetail?.guaranteeCurrency === "VND" ||
                                  lcDetail?.guaranteeCurrency === "JPY"
                                    ? lcDetail?.inputCurrency
                                    : lcDetail?.inputCurrency + " USD"}
                                </span>
                              )}
                            </p>
                          )}
                          {lcDetail?.settlementInstruc1 === "RATE" && (
                            <p>
                              {lcDetail?.guaranteeAmount}
                              {lcDetail?.settlementInstruc1 === "RATE" && (
                                <span>
                                  {" "}
                                  - {lcDetail?.settlementInstruc1}:{" "}
                                  {lcDetail?.guaranteePercent} %{" "}
                                </span>
                              )}
                            </p>
                          )}
                        </label>
                      </div>
                      <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11">
                        <label class="col-form-label ml-4">
                          Thanh toán / <i>Payment</i>{" "}
                        </label>
                      </div>
                      <div class="col-1 col-form-label">:</div>
                      <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                        <label class="col-form-label font-weight-bold text-uppercase">
                          {lcDetail?.pay === "true" &&
                            !(
                              lcDetail?.pay === "true" &&
                              lcDetail?.pay2 === "true"
                            ) && <p>AT SIGHT</p>}
                          {lcDetail?.pay2 === "true" &&
                            !(
                              lcDetail?.pay === "true" &&
                              lcDetail?.pay2 === "true"
                            ) && <p>USANCE / DEFFERED</p>}
                          {lcDetail?.pay === "true" &&
                            lcDetail?.pay2 === "true" && <p>MIXED PAYMENT</p>}
                        </label>
                      </div>
                      <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11">
                        <label class="col-form-label ml-4">
                          Hợp đồng tín dụng / <i>Credit Agreement</i>
                        </label>
                      </div>
                      <div class="col-1 col-form-label">:</div>
                      <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                        <label class="col-form-label font-weight-bold text-uppercase break-word">
                          <p>{lcDetail?.creditAgreementNumber || "-"} </p>
                        </label>
                      </div>
                      <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11">
                        <label class="col-form-label ml-4">
                          Ngày cấp hợp đồng / <i>Credit agreenment date</i>{" "}
                        </label>
                      </div>
                      <div class="col-1 col-form-label">:</div>
                      <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                        <label class="col-form-label font-weight-bold text-uppercase">
                          <p>
                            {parseDate(
                              lcDetail?.creditAgreementDate,
                              "dd/MM/yyyy"
                            ) || "-"}
                          </p>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-12 border-bottom-dotted pt-2  mb-2 p-0">
                  <span class="text-uppercase  m-font-600  theme-color">
                    Thông tin khách hàng / <i>Customer information</i>{" "}
                  </span>
                </div>

                <div class="row">
                  <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <div class="row">
                      <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11  ">
                        <label class="col-form-label ml-4">
                          Tên khách hàng / <i>Customer's name</i>{" "}
                        </label>
                      </div>
                      <div class="col-1 col-form-label">:</div>
                      <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                        <label class="col-form-label font-weight-bold text-uppercase break-word">
                          {lcDetail?.custName}
                        </label>
                      </div>
                      <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11  ">
                        <label class="col-form-label ml-4">
                          Mã khách hàng / <i>CIF</i>{" "}
                        </label>
                      </div>
                      <div class="col-1 col-form-label">:</div>
                      <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                        <label class="col-form-label font-weight-bold text-uppercase break-word">
                          {lcDetail?.cifCode}
                        </label>
                      </div>
                      <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11  ">
                        <label class="col-form-label ml-4">
                          Địa chỉ / <i>Address</i>{" "}
                        </label>
                      </div>
                      <div class="col-1 col-form-label">:</div>
                      <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                        <label class="col-form-label font-weight-bold text-uppercase break-word">
                          {lcDetail?.custAddress}
                        </label>
                      </div>
                      <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11  ">
                        <label class="col-form-label ml-4">
                          Số điện thoại / <i>Tel No.</i>
                        </label>
                      </div>
                      <div class="col-1 col-form-label">:</div>
                      <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                        <label class="col-form-label font-weight-bold text-uppercase break-word">
                          {lcDetail?.custTel}
                        </label>
                      </div>
                      <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11  ">
                        <label class="col-form-label ml-4">
                          Họ tên người đại diện khách hàng đề nghị bảo lãnh /
                          <i>
                            Name of the representative applying for guarantee
                          </i>{" "}
                        </label>
                      </div>
                      <div class="col-1 col-form-label">:</div>
                      <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                        <label class="col-form-label font-weight-bold text-uppercase break-word">
                          {lcDetail?.representativeName}
                        </label>
                      </div>
                      <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11  ">
                        <label class="col-form-label ml-4">
                          Chức vụ / <i>Position</i>{" "}
                        </label>
                      </div>
                      <div class="col-1 col-form-label">:</div>
                      <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                        <label class="col-form-label font-weight-bold text-uppercase break-word">
                          {lcDetail?.representativeJob}
                        </label>
                      </div>
                      <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11   ">
                        <label class="col-form-label ml-4">
                          Tài khoản VND / <i>VND account</i>
                        </label>
                      </div>
                      <div class="col-1 col-form-label">:</div>
                      <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                        <label class="col-form-label font-weight-bold text-uppercase break-word">
                          {lcDetail?.vndAccount}
                        </label>
                      </div>
                      <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11  ">
                        <label class="col-form-label ml-4">
                          Tài khoản ngoại tệ / <i>Foreign currency account</i>{" "}
                        </label>
                      </div>
                      <div class="col-1 col-form-label">:</div>
                      <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                        <label class="col-form-label font-weight-bold text-uppercase break-word">
                          {lcDetail?.fcAccount !== null
                            ? lcDetail?.fcAccount
                            : "-"}
                        </label>
                      </div>
                      <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11  ">
                        <label class="col-form-label ml-4">
                          Hồ sơ kèm theo / <i>Supporting documents</i>{" "}
                        </label>
                      </div>
                      <div class="col-1 col-form-label">:</div>
                      <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                        <label class="col-form-label font-weight-bold text-uppercase break-word">
                          {lcDetail?.salesContract || "-"}
                        </label>
                      </div>
                      <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11  ">
                        <label class="col-form-label ml-4">File</label>
                      </div>
                      <div class="col-1 col-form-label">:</div>
                      <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 col-form-label">
                        <span class="break-word">
                          {lcDetail?.documents?.map((item) => {
                            return (
                              <p>
                                <a
                                  onClick={downloadFile(
                                    item?.contractId,
                                    item?.docId,
                                    item?.fileType,
                                    item?.docName,
                                    "LCCreate"
                                  )}
                                >
                                  <span class="font-weight-bold">
                                    {item?.docName}
                                  </span>{" "}
                                  {"\n"}
                                  <i class="text-secondary font-13">
                                    {item?.sha256}
                                  </i>
                                </a>
                              </p>
                            );
                          })}
                        </span>
                        {showFileList?.length === 0 && (
                          <span class="font-weight-bold">-</span>
                        )}
                      </div>
                      <div
                        class="col-11 mt-2 ml-4"
                        style={{ textAlign: "start" }}
                      >
                        <i>
                          Với mọi trách nhiệm thuộc về mình, chúng tôi đề nghị
                          Eximbank phát hành một thư tín dụng không hủy ngang
                          với nội dung sau (vui lòng điền thông tin thích hợp) /
                          With all responsibilities on our sides, we hereby
                          request Eximbank to issue an irrevocable Letter of
                          Credit with the following content (Please fill in the
                          appropriate information)
                        </i>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-12 border-bottom-dotted pt-2  mb-2 p-0">
                  <span class="text-uppercase  m-font-600  theme-color">
                    THÔNG TIN LC / <i>LC INFORMATION</i>{" "}
                  </span>
                </div>

                <div class="row">
                  <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11  ">
                    <label class="col-form-label ml-4">
                      1. Ngân hàng thông báo / <i>Advising bank</i>
                    </label>
                  </div>
                  <div class="col-1 col-form-label">:</div>
                  <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <label class="col-form-label font-weight-bold text-uppercase break-word">
                      {lcDetail?.advisingBank1 && (
                        <p>{lcDetail?.advisingBank1}</p>
                      )}
                      {lcDetail?.advisingBank2 && (
                        <p>{lcDetail?.advisingBank2}</p>
                      )}
                      {lcDetail?.advisingBank3 && (
                        <p>{lcDetail?.advisingBank3}</p>
                      )}
                      {lcDetail?.advisingBank4 && (
                        <p>{lcDetail?.advisingBank4}</p>
                      )}
                    </label>
                  </div>
                  <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11  ">
                    <label class="col-form-label ml-4">
                      Mã SWIFT / <i>SWIFT code</i>{" "}
                    </label>
                  </div>
                  <div class="col-1 col-form-label">:</div>
                  <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <label class="col-form-label font-weight-bold text-uppercase break-word">
                      {lcDetail?.advisingBankSwiftCode || "-"}
                    </label>
                  </div>
                  <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11  ">
                    <label class="col-form-label ml-4">
                      2. Loại LC / <i>Form of LC</i>{" "}
                    </label>
                  </div>
                  <div class="col-1 col-form-label">:</div>
                  <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <label class="col-form-label font-weight-bold text-uppercase break-word">
                      {lcDetail?.invoiceValue && (
                        <p>{lcDetail?.invoiceValue || "-"}</p>
                      )}
                      {lcDetail?.invoiceValue2 && (
                        <p>{lcDetail?.invoiceValue2}</p>
                      )}
                      {!(lcDetail?.typeLc1 === "Select - if required") && (
                        <p>{lcDetail?.typeLc1}</p>
                      )}
                    </label>
                  </div>
                  <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11  ">
                    <label class="col-form-label ml-4">
                      Luật áp dụng / <i>Applicable Rules</i>
                    </label>
                  </div>
                  <div class="col-1 col-form-label">:</div>
                  <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <label class="col-form-label font-weight-bold text-uppercase break-word">
                      {!(lcDetail?.typeLc2 === "OTHERS") && (
                        <p>{lcDetail?.typeLc2}</p>
                      )}
                      <p innerText={lcDetail?.typeLc2Khac}></p>
                    </label>
                  </div>
                  <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11  ">
                    <label class="col-form-label ml-4">
                      3. Ngày hết hiệu lực / <i>Expiry date</i>
                    </label>
                  </div>
                  <div class="col-1 col-form-label">:</div>
                  <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <label class="col-form-label font-weight-bold">
                      {parseDate(lcDetail?.expiryDate, "dd/MM/yyyy")}
                    </label>
                  </div>
                  <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11  ">
                    <label class="col-form-label ml-4">
                      Địa điểm hết hiệu lực / <i>Expired place</i>
                    </label>
                  </div>
                  <div class="col-1 col-form-label">:</div>
                  <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <label class="col-form-label font-weight-bold text-uppercase break-word">
                      {!(lcDetail?.expiryPlace === "Others") && (
                        <p>{lcDetail?.expiryPlace}</p>
                      )}
                      <p innerText={lcDetail?.expiryPlaceOthers}></p>
                    </label>
                  </div>
                  <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11  ">
                    <label class="col-form-label ml-4">
                      4 .Đơn vị đề nghị / <i>Applicant</i>{" "}
                    </label>
                  </div>
                  <div class="col-1 col-form-label">:</div>
                  <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <label class="col-form-label font-weight-bold text-uppercase break-word">
                      {lcDetail?.applicant1 && <p>{lcDetail?.applicant1}</p>}
                      {lcDetail?.applicant2 && <p>{lcDetail?.applicant2}</p>}
                      {lcDetail?.applicant3 && <p>{lcDetail?.applicant3}</p>}
                      {lcDetail?.applicant4 && <p>{lcDetail?.applicant4}</p>}
                    </label>
                  </div>
                  <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11  ">
                    <label class="col-form-label ml-4">
                      5. Đơn vị thụ hưởng / <i>Beneficiary</i>
                    </label>
                  </div>
                  <div class="col-1 col-form-label">:</div>
                  <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <label class="col-form-label font-weight-bold text-uppercase break-word">
                      {lcDetail?.beneficiary1 && (
                        <p>{lcDetail?.beneficiary1}</p>
                      )}
                      {lcDetail?.beneficiary2 && (
                        <p>{lcDetail?.beneficiary2}</p>
                      )}
                      {lcDetail?.beneficiary3 && (
                        <p>{lcDetail?.beneficiary3}</p>
                      )}
                      {lcDetail?.beneficiary4 && (
                        <p>{lcDetail?.beneficiary4}</p>
                      )}
                    </label>
                  </div>
                </div>

                <div class="row">
                  <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11  ">
                    <label className="col-form-label ml-4">
                      6. Loại tiền/Trị giá LC / <i>Currency/LC amount</i>
                    </label>
                  </div>
                  <div class="col-1 col-form-label">:</div>
                  <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <label className="col-form-label font-weight-bold text-uppercase">
                      {lcDetail?.currency}
                      {lcDetail?.currency === "VND" ||
                      lcDetail?.currency === "JPY"
                        ? lcDetail?.amount
                        : lcDetail?.amount + " USD"}
                    </label>
                  </div>
                  <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11  ">
                    <label className="col-form-label ml-4">
                      Dung sai / <i>Tolerance</i>
                    </label>
                  </div>
                  <div class="col-1 col-form-label">:</div>
                  <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <label class="col-form-label font-weight-bold text-uppercase">
                      {(lcDetail?.tolerance1 ||
                        lcDetail?.tolerance2 ||
                        lcDetail?.tolerance1 === 0 ||
                        lcDetail?.tolerance2 === 0) && (
                        <>
                          <span>{lcDetail?.tolerance1 || "-"}</span>
                          {(lcDetail?.tolerance1 ||
                            lcDetail?.tolerance2 ||
                            lcDetail?.tolerance1 === 0 ||
                            lcDetail?.tolerance2 === 0) && <span>/</span>}

                          <span> {lcDetail?.tolerance2 || "-"}</span>
                          {lcDetail?.tolerance1?.value === null &&
                            lcDetail?.tolerance2 === null && <span>- / -</span>}
                        </>
                      )}
                    </label>
                  </div>
                  <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11  ">
                    <label className="col-form-label ml-4">
                      7. LC có giá trị thanh toán tại /{" "}
                      <i>The LC is available with</i>
                    </label>
                  </div>
                  <div class="col-1 col-form-label">:</div>
                  <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <label class="col-form-label font-weight-bold text-uppercase break-word">
                      {!(lcDetail?.availableWith === "Others bank") && (
                        <p>{lcDetail?.availableWith || "-"}</p>
                      )}
                      {lcDetail?.nganHangKhac && (
                        <span>{lcDetail?.nganHangKhac}</span>
                      )}
                    </label>
                  </div>
                  <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11  ">
                    <label class="col-form-label ml-4">
                      Bằng hình thức / <i>By</i>
                    </label>
                  </div>
                  <div class="col-1 col-form-label">:</div>
                  <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <label className="col-form-label font-weight-bold text-uppercase break-word">
                      <p>{lcDetail?.paymentBy}</p>
                    </label>
                  </div>

                  {lcDetail?.pay === "true" && lcDetail?.pay2 === "true" && (
                    <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11">
                      <label class="col-form-label ml-4">
                        Chi tiết Thanh toán Hỗn hợp /{" "}
                        <i>Mixed payment details</i>
                      </label>
                    </div>
                  )}
                  {lcDetail?.pay === "true" && lcDetail?.pay2 === "true" && (
                    <div class="col-form-label col-1">:</div>
                  )}

                  {lcDetail?.pay === "true" && lcDetail?.pay2 === "true" && (
                    <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                      <label className="col-form-label font-weight-bold text-uppercase break-word">
                        {lcDetail?.documentsMust3 && (
                          <p innerText={lcDetail?.documentsMust3}></p>
                        )}
                      </label>
                    </div>
                  )}
                  {(lcDetail?.pay === "true" || lcDetail?.pay2 === "false") &&
                    lcDetail?.paymentBy === "DEFERRED PAYMENT" &&
                    !(
                      lcDetail?.pay === "true" && lcDetail?.pay2 === "true"
                    ) && (
                      <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11">
                        <label className="col-form-label ml-4">
                          Chi tiết Thanh toán Hỗn hợp /{" "}
                          <i>Mixed payment details</i>
                        </label>
                      </div>
                    )}
                  {(lcDetail?.pay === "true" || lcDetail?.pay2 === "false") &&
                    lcDetail?.paymentBy === "DEFERRED PAYMENT" &&
                    !(
                      lcDetail?.pay === "true" && lcDetail?.pay2 === "true"
                    ) && <div class="col-form-label col-1"> :</div>}
                  {(lcDetail?.pay === "true" || lcDetail?.pay2 === "false") &&
                    lcDetail?.paymentBy === "DEFERRED PAYMENT" &&
                    !(
                      lcDetail?.pay === "true" && lcDetail?.pay2 === "true"
                    ) && (
                      <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                        <label className="col-form-label font-weight-bold text-uppercase break-word">
                          {lcDetail?.paymentByMIXED && (
                            <p innerText={lcDetail?.paymentByMIXED}></p>
                          )}
                        </label>
                      </div>
                    )}
                  {lcDetail.paymentBy === "DEFERRED PAYMENT" &&
                    !(
                      lcDetail?.pay === "true" && lcDetail?.pay2 === "true"
                    ) && (
                      <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11">
                        <label className="col-form-label ml-4">
                          Chi tiết Thanh toán trả chậm /{" "}
                          <i>Deffered payment details</i>
                        </label>
                      </div>
                    )}
                  {lcDetail.paymentBy === "DEFERRED PAYMENT" &&
                    !(
                      lcDetail?.pay === "true" && lcDetail?.pay2 === "true"
                    ) && <div class="col-form-label col-1">:</div>}
                  {lcDetail.paymentBy === "DEFERRED PAYMENT" &&
                    !(
                      lcDetail?.pay === "true" && lcDetail?.pay2 === "true"
                    ) && (
                      <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                        <label class="col-form-label font-weight-bold text-uppercase break-word">
                          {lcDetail?.paymentByDeffered && (
                            <p innerText={lcDetail?.paymentByDeffered}></p>
                          )}
                        </label>
                      </div>
                    )}
                  {!(lcDetail?.pay === "true" && lcDetail?.pay2 === "true") &&
                    !(lcDetail?.paymentBy === "DEFERRED PAYMENT") &&
                    !(lcDetail?.paymentBy === "MIXED PAYMENT") && (
                      <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11">
                        <label class="col-form-label ml-4">
                          8. Điều kiện thanh toán của hối phiếu /{" "}
                          <i>Draft at</i>{" "}
                        </label>
                      </div>
                    )}
                  {!(lcDetail?.pay === "true" && lcDetail?.pay2 === "true") &&
                    !(lcDetail?.paymentBy === "DEFERRED PAYMENT") &&
                    !(lcDetail?.paymentBy === "MIXED PAYMENT") && (
                      <div class="col-1 col-form-label">:</div>
                    )}
                  {!(lcDetail?.pay === "true" && lcDetail?.pay2 === "true") &&
                    !(lcDetail?.paymentBy === "DEFERRED PAYMENT") &&
                    !(lcDetail?.paymentBy === "MIXED PAYMENT") && (
                      <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                        <label class="col-form-label font-weight-bold text-uppercase break-word">
                          {!(lcDetail?.draftAt1 === "OTHERS") &&
                            !(
                              lcDetail?.draftAt1 ===
                              "DAYS AFTER BILL OF LADING DATE/AIR WAYBILL DATE"
                            ) && <p>{lcDetail?.draftAt1}</p>}
                          {lcDetail?.draftAt1 ===
                            "DAYS AFTER BILL OF LADING DATE/AIR WAYBILL DATE" && (
                            <p>{lcDetail?.draftAt1Number}</p>
                          )}
                          <p innerText={lcDetail?.draftAt1Others}></p>
                        </label>
                      </div>
                    )}
                  {!(lcDetail?.pay === "true" && lcDetail?.pay2 === "true") &&
                    !(lcDetail?.paymentBy === "DEFERRED PAYMENT") &&
                    !(lcDetail?.paymentBy === "MIXED PAYMENT") && (
                      <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11">
                        <label class="col-form-label ml-4">
                          Bằng / <i>For</i>{" "}
                        </label>
                      </div>
                    )}
                  {!(lcDetail?.pay === "true" && lcDetail?.pay2 === "true") &&
                    !(lcDetail?.paymentBy === "DEFERRED PAYMENT") &&
                    !(lcDetail?.paymentBy === "MIXED PAYMENT") && (
                      <div class="col-1 col-form-label">:</div>
                    )}
                  {!(lcDetail?.pay === "true" && lcDetail?.pay2 === "true") &&
                    !(lcDetail?.paymentBy === "DEFERRED PAYMENT") &&
                    !(lcDetail?.paymentBy === "MIXED PAYMENT") && (
                      <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                        <label class="col-form-label font-weight-bold text-uppercase break-word">
                          <p>
                            {lcDetail?.draftAt2Others &&
                              !(
                                lcDetail?.draftAt2 === "100% INVOICE VALUE"
                              ) && (
                                <span>
                                  {lcDetail?.draftAt2Others} % INVOICE VALUE
                                </span>
                              )}
                            {!(lcDetail?.draftAt2 === "% INVOICE VALUE") && (
                              <span> {lcDetail?.draftAt2}</span>
                            )}
                          </p>
                        </label>
                      </div>
                    )}
                  {!(lcDetail?.pay === "true" && lcDetail?.pay2 === "true") &&
                    !(lcDetail?.paymentBy === "DEFERRED PAYMENT") &&
                    !(lcDetail?.paymentBy === "MIXED PAYMENT") && (
                      <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11">
                        <label class="col-form-label ml-4">
                          9. Đơn vị trả tiền / <i>Drawee</i>
                        </label>
                      </div>
                    )}
                  {!(lcDetail?.pay === "true" && lcDetail?.pay2 === "true") &&
                    !(lcDetail?.paymentBy === "DEFERRED PAYMENT") &&
                    !(lcDetail?.paymentBy === "MIXED PAYMENT") && (
                      <div class="col-1 col-form-label">:</div>
                    )}
                  {!(lcDetail?.pay === "true" && lcDetail?.pay2 === "true") &&
                    !(lcDetail?.paymentBy === "DEFERRED PAYMENT") &&
                    !(lcDetail?.paymentBy === "MIXED PAYMENT") && (
                      <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                        <label class="col-form-label font-weight-bold text-uppercase break-word">
                          {lcDetail?.draweeOthers &&
                            !(lcDetail?.drawee === "VIETNAM EXIMBANK") && (
                              <span innerText={lcDetail?.draweeOthers}></span>
                            )}
                          {!(lcDetail?.drawee === "Others bank") && (
                            <span> {lcDetail?.drawee}</span>
                          )}
                        </label>
                      </div>
                    )}
                </div>
                <div class="row">
                  {!(lcDetail?.latestDate === "SHIPMENT PERIOD") && (
                    <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11">
                      <label className="col-form-label ml-4">
                        10. Ngày giao hàng chậm nhất /{" "}
                        <i>Latest date of shipment</i>{" "}
                      </label>
                    </div>
                  )}
                  {!(lcDetail?.latestDate === "SHIPMENT PERIOD") && (
                    <div class="col-form-label col-1">:</div>
                  )}
                  {!(lcDetail?.latestDate === "SHIPMENT PERIOD") && (
                    <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                      <label class="col-form-label font-weight-bold text-uppercase break-word">
                        {!(lcDetail?.latestDate === "SHIPMENT PERIOD") && (
                          <p>
                            {lcDetail?.latestDateDay &&
                              !(lcDetail?.latestDate === "SHIPMENT PERIOD") && (
                                <span>
                                  {parseDate(
                                    lcDetail?.latestDateDay,
                                    "dd/MM/yyyy"
                                  )}
                                </span>
                              )}
                          </p>
                        )}
                      </label>
                    </div>
                  )}

                  {lcDetail?.latestDateOthers &&
                    !(lcDetail?.latestDate === "LATEST DATE OF SHIPMENT") && (
                      <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11">
                        <label className="col-form-label ml-4">
                          10. Thời gian giao hàng / <i>Shipment period</i>{" "}
                        </label>
                      </div>
                    )}
                  {lcDetail?.latestDateOthers &&
                    !(lcDetail?.latestDate === "LATEST DATE OF SHIPMENT") && (
                      <div class="col-form-label col-1">:</div>
                    )}
                  {lcDetail?.latestDateOthers &&
                    !(lcDetail?.latestDate === "LATEST DATE OF SHIPMENT") && (
                      <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                        <label class="col-form-label font-weight-bold text-uppercase break-word">
                          {lcDetail?.latestDateOthers &&
                            !(
                              lcDetail?.latestDate === "LATEST DATE OF SHIPMENT"
                            ) && <p innerText={lcDetail?.latestDateOthers}></p>}
                        </label>
                      </div>
                    )}

                  <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11  ">
                    <label class="col-form-label ml-4">
                      11 .Giao hàng từng phần / <i>Partial shipment</i>{" "}
                    </label>
                  </div>
                  <div class="col-1 col-form-label">:</div>
                  <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <label class="col-form-label font-weight-bold text-uppercase break-word">
                      {lcDetail?.partialShipment}
                    </label>
                  </div>
                  <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11  ">
                    <label class="col-form-label ml-4">
                      12. Chuyển tải / <i>Transhipment</i>{" "}
                    </label>
                  </div>
                  <div class="col-1 col-form-label">:</div>
                  <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12 ">
                    <label class="col-form-label font-weight-bold text-uppercase break-word">
                      {lcDetail?.transhipment}
                    </label>
                  </div>
                  <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11  ">
                    <label class="col-form-label ml-4">13. Incoterms</label>
                  </div>
                  <div class="col-1 col-form-label">:</div>
                  <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <label class="col-form-label font-weight-bold text-uppercase break-word">
                      {!(lcDetail?.incoterms === "Others") && (
                        <p>{lcDetail?.incoterms || "-"}</p>
                      )}
                      {lcDetail?.incotermsOthers && (
                        <p innerText={lcDetail?.incotermsOthers}></p>
                      )}
                    </label>
                  </div>
                  <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11  ">
                    <label class="col-form-label ml-4">
                      Điều kiện vận chuyển / <i>Shipping terms</i>
                    </label>
                  </div>
                  <div class="col-1 col-form-label">:</div>
                  <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <label class="col-form-label font-weight-bold text-uppercase break-word">
                      {!(lcDetail?.shippingTerm === "Others") && (
                        <p>{lcDetail?.shippingTerm || "-"}</p>
                      )}
                      {lcDetail?.shippingTermsOthers && (
                        <p innerText={lcDetail?.shippingTermsOthers}></p>
                      )}
                    </label>
                  </div>
                  <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11  ">
                    <label class="col-form-label ml-4">
                      Địa điểm / <i>Place</i>{" "}
                    </label>
                  </div>
                  <div class="col-1 col-form-label">:</div>
                  <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <label class="col-form-label font-weight-bold text-uppercase break-word">
                      {lcDetail?.place || "-"}
                    </label>
                  </div>
                  <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11  ">
                    <label class="col-form-label ml-4">
                      14. Nơi gửi hàng/nơi nhận hàng / <br />
                      <i>
                        Place of taking in charge/Dispatch from/Place of receipt
                      </i>{" "}
                    </label>
                  </div>
                  <div class="col-1 col-form-label">:</div>
                  <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <label class="col-form-label font-weight-bold text-uppercase break-word">
                      {lcDetail?.receiptPlace || "-"}
                    </label>
                  </div>
                  <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11  ">
                    <label class="col-form-label ml-4">
                      Cảng bốc hàng/Sân bay khởi hành / <br />{" "}
                      <i>Port of loading/Airport of departure</i>{" "}
                    </label>
                  </div>
                  <div class="col-1 col-form-label">:</div>
                  <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <label class="col-form-label font-weight-bold text-uppercase break-word">
                      {lcDetail?.loadingPort || "-"}
                    </label>
                  </div>
                  <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11  ">
                    <label class="col-form-label ml-4">
                      Cảng dỡ hàng/Sân bay đến / <br />{" "}
                      <i>Port of discharge/Airport of destination</i>{" "}
                    </label>
                  </div>
                  <div class="col-1 col-form-label">:</div>
                  <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <label class="col-form-label font-weight-bold text-uppercase break-word">
                      {lcDetail?.dischargePort || "-"}
                    </label>
                  </div>
                  <div class="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-xs-11  ">
                    <label class="col-form-label ml-4">
                      Nơi đến cuối cùng/ Nơi giao hàng / <br />{" "}
                      <i>Place of final destination/Place of delivery</i>{" "}
                    </label>
                  </div>
                  <div class="col-1 col-form-label">:</div>
                  <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <label class="col-form-label font-weight-bold text-uppercase break-word">
                      {lcDetail?.finalPlace || "-"}
                    </label>
                  </div>
                </div>
                <div class="col-12 border-bottom-dotted pt-2 mb-2 p-0">
                  <span class="text-uppercase m-font-600 text-dark ml-4">
                    15.MÔ TẢ HÀNG HÓA VÀ/HOẶC DỊCH VỤ /{" "}
                    <i>DESCRIPTION OF GOODS AND/OR SERVICES</i>{" "}
                  </span>
                </div>
                <div class="row ml-4">
                  <div class="col-xl-11 col-lg-11 col-md-11 col-sm-11 col-xs-12">
                    <div
                      class="col-form-label text-uppercase break-word"
                      innerText={lcDetail?.goodsDescription || "-"}
                    ></div>
                  </div>
                </div>
                <div class="col-12 border-bottom-dotted pt-2  mb-2 p-0">
                  <span class="text-uppercase m-font-600 text-dark ml-4">
                    16.CHỨNG TỪ YÊU CẦU XUẤT TRÌNH / <i>DOCUMENTS REQUIRED</i>
                  </span>
                </div>
                <div class="row ml-4">
                  <div class="col-xl-11 col-lg-11 col-md-11 col-sm-11 col-xs-12 mt-1">
                    <div
                      class="col-form-label text-uppercase break-word"
                      innerText={lcDetail?.documentsRequired || "-"}
                    ></div>
                  </div>
                </div>
                <div class="col-12 border-bottom-dotted pt-2  mb-2 p-0">
                  <span class="text-uppercase  m-font-600 text-dark ml-4">
                    17.CÁC ĐIỀU KIỆN KHÁC / <i>ADDITIONAL CONDITIONS</i>
                  </span>
                </div>
                <div class="row ml-4">
                  <div class="col-xl-11 col-lg-11 col-md-11 col-sm-11 col-xs-12">
                    <div class="col-form-label text-uppercase ">
                      + Insurance is covered by: {lcDetail?.insuranceCovered}
                    </div>
                  </div>
                  <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div class="col-form-label text-uppercase break-word">
                      {lcDetail?.beneficiaryCharge === "true" && (
                        <p>
                          + REMITTANCE CHARGES ARE FOR BENEFICIARY’S ACCOUNT
                        </p>
                      )}
                      {lcDetail?.mustLcNo === "true" && (
                        <p>+ ALL DOCUMENTS MUST INDICATED LC NO.</p>
                      )}
                      {lcDetail?.additionalCondition4 === "true" && (
                        <p style={{ textAlign: "start" }}>
                          + WE UNDERTAKE NO OBLIGATION TO MAKE ANY PAYMENT
                          UNDER, OR OTHERWISE TO IMPLEMENT, THIS LETTER OF
                          CREDIT IF THE UNDERLYING TRANSACTIONS HAVE ANY
                          INVOLVEMENT TO COUNTRIES, TERRITORIES, ENTITIES OR
                          VESSELS UNDER THE SANCTIONS LISTS OF VIETNAM, UNITED
                          NATIONS, UNITED STATES OF AMERICA, EUROPEAN UNION,
                          UNITED KINGDOM AND COMPETENT GOVERNMENTS AND
                          ORGANIZATIONS (BINDING TO US ACCORDING TO
                          INTERNATIONAL PRACTICE).
                        </p>
                      )}
                      {lcDetail?.presentationType === "true" && (
                        <p style={{ textAlign: "start" }}>
                          + ONE ADDITIONAL SET OF PHOTOCOPY OF REQUIRED
                          DOCUMENTS IN FIELD 46A FOR ISSUING BANK FILES AND WILL
                          NOT BE RETURNED EVEN DOCUMENTS ARE FINALLY REFUSED.
                        </p>
                      )}
                      {lcDetail?.settlementInstruc2 && (
                        <p style={{ textAlign: "start" }} class="word-wrap">
                          +{" "}
                          <span
                            innerText={lcDetail?.settlementInstruc2}
                            class="text-uppercase"
                          ></span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div class="col-12 border-bottom-dotted pt-2  mb-2 p-0">
                  <span class="text-uppercase  m-font-600 text-dark ml-4">
                    18. CÁC LỆ PHÍ / <i>Charges</i>{" "}
                  </span>
                </div>
                <div class="row ml-4">
                  <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div class="col-form-label text-uppercase break-word">
                      {!(lcDetail?.otherCharges === "Others") && (
                        <p>{lcDetail?.otherCharges} </p>
                      )}
                      <p
                        innerText={lcDetail?.charges}
                        style={{ textAlign: "start" }}
                      ></p>
                    </div>
                  </div>
                </div>
                <div class="col-12 border-bottom-dotted pt-2  mb-2 p-0">
                  <span class="text-uppercase  m-font-600 text-dark ml-4">
                    19.THỜI HẠN XUẤT TRÌNH CHỨNG TỪ /{" "}
                    <i>Period of Presentation</i>{" "}
                  </span>
                </div>
                <div class="row ml-4">
                  {lcDetail?.presentationTypeKhac === null && (
                    <div class="col-xl-11 col-lg-11 col-md-11 col-sm-11 col-xs-12">
                      <div class="text-uppercase">
                        <span class="col-form-label">
                          Documents must be presented within
                        </span>
                        <span class="col-form-label text-uppercase">
                          {" "}
                          {lcDetail?.presentationDays}
                        </span>{" "}
                        days after shipment date
                      </div>
                    </div>
                  )}
                  {lcDetail?.presentationTypeKhac != null &&
                    lcDetail?.presentationDays === null && (
                      <div class="col-xl-11 col-lg-11 col-md-11 col-sm-11 col-xs-12">
                        <label>
                          <span
                            class="col-form-label text-uppercase break-word"
                            innerText={lcDetail?.presentationTypeKhac}
                          ></span>
                        </label>
                      </div>
                    )}
                </div>
                <div class="row border-bottom-dotted pt-2  mb-2 p-0">
                  <div class="col-xl-5 col-lg-7 col-md-7 col-sm-7 col-xs-12">
                    <span class="text-uppercase  m-font-600 text-dark ml-4">
                      20. CHỈ THỊ XÁC NHẬN / <i>CONFIRMATION INSTRUCTIONS</i>
                    </span>
                  </div>
                  <div class="p-0">:</div>
                  <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-xs-12">
                    <div class="text-uppercase">
                      {lcDetail?.confInstruc && (
                        <span> {lcDetail?.confInstruc}</span>
                      )}
                    </div>
                  </div>
                </div>
                {lcDetail.confInstruc === "MAY ADD" ||
                  (lcDetail.confInstruc === "CONFIRM" && (
                    <div class="row">
                      <div class="col-xl-5 col-lg-7 col-md-7 col-sm-7 col-xs-12">
                        <div class="col-form-label ml-4">
                          <span class="ml-2">Confirming bank</span>
                        </div>
                      </div>
                      <div class="col-form-label">:</div>
                      <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-xs-12">
                        <div class="col-form-label text-uppercase break-word">
                          {lcDetail?.confInstrucDetail && (
                            <p>{lcDetail?.confInstrucDetail}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                {!(lcDetail?.confInstruc === "WITHOUT") && (
                  <div class="row">
                    <div class="col-xl-5 col-lg-7 col-md-7 col-sm-7 col-xs-12">
                      <div class="col-form-label ml-4">
                        <span class="ml-2">Confirmation fees are for</span>
                      </div>
                    </div>
                    <div class="col-form-label">:</div>
                    <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-xs-12">
                      <div class="col-form-label text-uppercase">
                        {lcDetail?.confFees && <p>{lcDetail?.confFees}</p>}
                      </div>
                    </div>
                  </div>
                )}
                <div class="col-12 border-bottom-dotted pt-2 mb-2 pl-0 ml-4">
                  <span class="text-uppercase m-font-600 text-dark">
                    21. CHỈ THỊ ĐỐI VỚI NGÂN HÀNG THANH TOÁN/NGÂN HÀNG CHẤP
                    NHẬN/NGÂN HÀNG THƯƠNG LƯỢNG /{" "}
                    <i>Instructions to paying / accepting / negotiating bank</i>
                  </span>
                </div>
                <div class="row ml-4">
                  <div class="col-xl-11 col-lg-11 col-md-11 col-sm-11 col-xs-12 margin-custom-left12">
                    <span class="col-form-label text-uppercase">
                      Documents must be presented thru a bank only to the
                      issuing bank at{" "}
                    </span>
                    <span class="col-form-label text-uppercase break-word">
                      {lcDetail?.documentsMust1}
                    </span>
                    <span class="col-form-label text-uppercase">in </span>
                    <span class="col-form-label text-uppercase">
                      {lcDetail?.documentsMust1option}
                    </span>{" "}
                    <span class="col-form-label text-uppercase">
                      {" "}
                      lot(s) by{" "}
                    </span>
                    {!(lcDetail?.documentsMust2 === "Others") && (
                      <span class="col-form-label text-uppercase break-word">
                        {" "}
                        {lcDetail?.documentsMust2}
                      </span>
                    )}
                    <span
                      class="col-form-label text-uppercase break-word"
                      innerText={lcDetail?.documentsMust2khac}
                    ></span>
                  </div>
                </div>
                <div class="col-xl-11 col-lg-11 col-md-11 col-sm-11 col-xs-12 mt-2 ">
                  <div class="text-uppercase ml-4">Settlement instruction:</div>
                </div>
                {!(lcDetail?.pay === "true" && lcDetail?.pay2 === "true") && (
                  <div>
                    {lcDetail?.pay === "true" && (
                      <div class="col-xl-11 col-lg-11 col-md-11 col-sm-11 col-xs-12">
                        {lcDetail?.pay === "true" &&
                          !(lcDetail?.otherCondittionsKhac != null) && (
                            <div class="col-form-label ml-4 text-uppercase break-word">
                              <span>{lcDetail?.camKet1} </span>
                              <span>{lcDetail?.fcAccountCurrency}</span>
                            </div>
                          )}
                      </div>
                    )}
                    {lcDetail?.pay2 === "true" &&
                      !(lcDetail?.otherPeriodForPresentation != null) && (
                        <div class="col-xl-11 col-lg-11 col-md-11 col-sm-11 col-xs-12">
                          <div class="col-form-label ml-4 text-uppercase break-word">
                            <p>
                              On draft(s) maturity we shall remit cover as
                              required based on our receipt of documents
                              including time draft(s) in compliance with LC
                              terms and conditions.
                            </p>
                          </div>
                        </div>
                      )}
                  </div>
                )}
                {lcDetail?.pay === "true" && (
                  <div class="col-xl-11 col-lg-11 col-md-11 col-sm-11 col-xs-12">
                    <div class="text-uppercase ml-4 break-word">
                      <p innerText={lcDetail?.otherCondittionsKhac}></p>
                    </div>
                  </div>
                )}
                {lcDetail?.pay2 === "true" && (
                  <div class="col-xl-11 col-lg-11 col-md-11 col-sm-11 col-xs-12">
                    <div class="text-uppercase ml-4 break-word">
                      <p innerText={lcDetail?.otherPeriodForPresentation}></p>
                    </div>
                  </div>
                )}
                {lcDetail?.pay2 === "true" && lcDetail?.pay === "true" && (
                  <div class="col-xl-11 col-lg-11 col-md-11 col-sm-11 col-xs-12">
                    <div class="col-form-label ml-4 text-uppercase break-word">
                      <p innerText={lcDetail?.payKhacText}></p>
                    </div>
                  </div>
                )}
                <div class="col-xl-11 col-lg-11 col-md-11 col-sm-11 col-xs-12">
                  <div class="text-uppercase ml-4">
                    USD66 - Will be deducted from the proceeds for each set of
                    documents bearing discrepancy(ies) presented under the L/C.
                  </div>
                </div>
                <div class="col-xl-11 col-lg-11 col-md-11 col-sm-11 col-xs-12 mt-1">
                  <div class="text-uppercase ml-4">
                    USD11 - An extra fee for the supplementary presentation of
                    documents will be charged to the proceeds upon payment.
                  </div>
                </div>
                {lcDetail?.obligation === "true" && (
                  <div class="col-xl-11 col-lg-11 col-md-11 col-sm-11 col-xs-12 mt-1">
                    <div
                      class="text-uppercase ml-4"
                      style={{ textAlign: "start" }}
                    >
                      We undertake no obligation to make any payment under, or
                      otherwise to implement, this letter of credit if the
                      underlying transactions have any involvement to countries,
                      territories, entities or vessels under the sanctions lists
                      of United Nations, United States of America, European
                      Union, United Kingdom and competent governments and
                      organizations (binding to us according to international
                      practice).
                    </div>
                  </div>
                )}
                <div class="col-xl-11 col-lg-11 col-md-11 col-sm-11 col-xs-12 mt-1">
                  <div
                    class="text-uppercase ml-4"
                    style={{ textAlign: "start" }}
                  >
                    This letter of credit subject to Uniform customs and
                    practice for documentary letter of credit, ICC publication
                    (UCP latest version).
                  </div>
                </div>
                <div class="col-12 border-bottom-dotted pt-2  mb-2 p-0">
                  {/*HERE*/}
                </div>
                <div>
                  <div class="row">
                    <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12  ">
                      <div class="form-check form-group">
                        <label class="form-check-label" for="dongY">
                          <span class="text-uppercase  m-font-600  theme-color">
                            CAM KẾT CỦA NGƯỜI ĐỀ NGHỊ PHÁT HÀNH THƯ TÍN DỤNG /
                            <i>UNDERTAKINGS OF THE APPLICANT</i>{" "}
                          </span>{" "}
                          {"\n"}
                        </label>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 mt-2">
                      <div class="form-check form-group">
                        <div
                          class="form-check-label"
                          style={{ textAlign: "start" }}
                        >
                          <span class="ml-4">
                            1) Chúng tôi hoàn toàn chịu trách nhiệm pháp lý về
                            tính chính xác và hợp pháp của hợp đồng ngoại thương
                            liên quan. Chúng tôi cam kết việc nhập khẩu hàng hóa
                            theo đề nghị phát hành Thư tín dụng này hoàn toàn
                            phù hợp với các quy định của pháp luật về xuất nhập
                            khẩu và quy định về quản lý ngoại hối của Nhà nước
                            Việt Nam/{" "}
                            <i>
                              We fully take legal responsibilities for the
                              related sales contract. We undertake that the
                              importation of goods under this letter of credit
                              application fully complies with the legal
                              regulations on import and export and those on FX
                              Control of Vietnam’s Government.
                            </i>
                          </span>
                        </div>
                      </div>
                      <div class="form-check form-group">
                        <div
                          class="form-check-label"
                          style={{ textAlign: "start" }}
                        >
                          <span class="ml-4">
                            2) Mức ký quỹ đề nghị/{" "}
                            <i>Proposed security deposit:</i>
                          </span>
                        </div>
                      </div>
                      <div class="form-check form-group">
                        <span class="form-check-label ml-4">
                          <span class="">
                            <input
                              type="checkbox"
                              class="m-cursor"
                              id="check1"
                              checked="true"
                            />
                            <label class="m-cursor" for="check1">
                              &nbsp; Ký quỹ/ <i>deposit</i>,
                            </label>
                          </span>
                        </span>
                        {"\n"}
                        <div class="form-check-label">
                          {lcDetail?.guaranteeAmount === "WHOLLY" && (
                            <span class="ml-4">
                              Tỷ lệ/ <i>Rate</i> : 100%
                            </span>
                          )}
                          {lcDetail?.settlementInstruc1 === "RATE" && (
                            <span class="ml-4">
                              Tỷ lệ/ <i>Rate</i> : {lcDetail?.guaranteePercent}%
                            </span>
                          )}
                          {lcDetail?.settlementInstruc1 === "AMOUNT" && (
                            <span class="ml-4">
                              Số tiền/ <i>Amount</i> :
                              {!(
                                lcDetail?.guaranteeCurrency === "VND" ||
                                lcDetail?.guaranteeCurrency === "JPY"
                              ) && (
                                <span>
                                  {lcDetail?.inputCurrency +
                                    " " +
                                    lcDetail?.guaranteeCurrency}
                                </span>
                              )}
                              {lcDetail?.guaranteeCurrency === "VND" ||
                                (lcDetail?.guaranteeCurrency === "JPY" && (
                                  <span>
                                    {lcDetail?.inputCurrency +
                                      " " +
                                      lcDetail?.guaranteeCurrency}
                                  </span>
                                ))}
                            </span>
                          )}
                        </div>
                      </div>
                      <div class="form-check form-group d-none">
                        <span class="form-check-label ml-4">
                          <span class="">
                            <input
                              type="checkbox"
                              className="m-cursor"
                              id="check2"
                              checked={
                                lcDetail?.settlementInstruc1 === "RATE" ||
                                lcDetail?.settlementInstruc1 === "AMOUNT"
                              }
                            />
                            <label className="m-cursor" htmlFor="check2">
                              &nbsp; Sử dụng hạn mức tín dụng Eximbank đã cấp
                              cho chúng tôi/{" "}
                              <i>
                                Using the Credit Limit that Eximbank has granted
                                for us.
                              </i>
                            </label>
                          </span>
                        </span>
                      </div>
                      <div class="form-check form-group">
                        <div
                          class="form-check-label"
                          style={{ textAlign: "start" }}
                        >
                          <span class="ml-4">
                            3) Thanh toán L/C/ <i>L/C payment</i>
                          </span>
                          <br />
                          <span class="ml-4">
                            Chúng tôi cam kết thanh toán vô điều kiện và đúng
                            hạn trị giá bộ chứng từ đòi tiền khi nhận thông báo
                            của Quý ngân hàng về bộ chứng từ hoàn toàn phù hợp
                            với điều kiện/điều khoản của L/C hoặc khi L/C cho
                            phép đòi tiền bằng điện và nhận được điện xác thực
                            của ngân hàng xuất trình xác nhận bộ chứng từ hoàn
                            toàn phù hợp với điều kiện/điều khoản của L/C cùng
                            với tất cả các chi phí phát sinh và các bộ chứng từ
                            đã được Eximbank ký hậu B/L/ AWB/ phát hành ủy
                            quyền/ bảo lãnh nhận hàng cùng với tất cả các chi
                            phí phát sinh/{" "}
                            <i>
                              We undertake to pay unconditionally and on time
                              the value of documents that is fully complied with
                              all terms/conditions under this L/C or when this
                              L/C allows to claim by SWIFT and receive
                              authenticated SWIFT by the presenting bank
                              confirming that documents fully comply with all
                              terms/conditions under this L/C together with all
                              costs incurred.
                            </i>
                          </span>
                        </div>
                      </div>
                      <div class="form-check form-group d-none">
                        <div
                          class="form-check-label"
                          style={{ textAlign: "start" }}
                        >
                          <span class="ml-4">
                            1. Trong trường hợp L/C được thanh toán một phần
                            hoặc toàn bộ bằng nguồn vốn vay từ Eximbank, chúng
                            tôi chịu trách nhiệm thực hiện theo các thỏa thuận
                            tại Hợp đồng tín dụng số{" "}
                            {lcDetail?.creditAgreementNumber || "..."} đã ký với
                            Eximbank ngày{" "}
                            {parseDate(
                              lcDetail?.creditAgreementDate,
                              "dd/MM/yyyy"
                            ) || "..."}
                            <i>
                              In the case that L/C is partially or fully paid by
                              loans from Eximbank, we undertake to be
                              responsible for complying with the agreements in
                              the Credit Agreement No.{" "}
                              {lcDetail?.creditAgreementNumber || "..."} signed
                              with Eximbank on{" "}
                              {parseDate(
                                lcDetail?.creditAgreementDate,
                                "dd/MM/yyyy"
                              ) || "..."}
                            </i>
                          </span>
                        </div>
                      </div>
                      <div class="form-check form-group">
                        <div
                          class="form-check-label"
                          style={{ textAlign: "start" }}
                        >
                          <span class="ml-4 d-none">
                            2. Trong trường hợp L/C được thanh toán một phần
                            hoặc toàn bộ nguồn vốn do chúng tôi tự cân đối,
                            chúng tôi cam kết/{" "}
                            <i>
                              In case the L/C is partially or fully paid by our
                              own fund, we undertake:
                            </i>
                          </span>

                          <span class="ml-4">
                            a. Chúng tôi đảm bảo có đủ ngoại tệ, cho phép trích
                            một phần hoặc toàn bộ nguồn vốn của chúng tôi
                            và/hoặc từ hạn mức tín dụng Eximbank đã cấp cho
                            chúng tôi để thanh toán L/C này và các chi phí phát
                            sinh liên quan bao gồm nghĩa vụ với Eximbank và các
                            bên thứ ba liên quan ngay khi nhận được thông báo
                            thanh toán của Quý Ngân hàng. Đồng thời bằng văn bản
                            này, chúng tôi đồng ý ủy quyền cho Eximbank được tự
                            động trích nợ tất cả các tài khoản của chúng tôi tại
                            Eximbank để thanh toán trong trường hợp các khoản
                            cam kết ban đầu không đủ tiền để thanh toán/{" "}
                            <i>
                              We hereby confirm that we maintain sufficient
                              foreign currency reserves, permitting partial or
                              full deductions from our funds and/or from the
                              credit limit granted to us by Eximbank for the
                              payment of this Letter of Credit and its
                              associated expenses, including obligations to
                              Eximbank and third parties, immediately upon
                              receipt of payment advice from your Bank. We
                              hereby grant Eximbank the authority to debit all
                              our accounts held with Eximbank to facilitate the
                              payment should the initial commitments not hold
                              adequate funds for settlement.
                            </i>
                          </span>
                          <br />
                          <span class="ml-4 d-none">
                            b. Bằng văn bản này, Chúng tôi đồng ý ủy quyền cho
                            Eximbank được tự động trích nợ tất cả các tài khoản
                            của chúng tôi tại Eximbank để thanh toán L/C này,
                            thu nợ (gốc, lãi) và các chi phí phát sinh liên quan
                            bao gồm nghĩa vụ với Eximbank và các bên thứ ba liên
                            quan, .../{" "}
                            <i>
                              By this application, We agree to authorize
                              Eximbank to debit all our accounts at Eximbank for
                              payment under this L/C, debt collection
                              (principal, interest) and all related charges
                              incurred, …
                            </i>
                          </span>
                          <br />
                          <span class="ml-4">
                            b. Nếu tài khoản chúng tôi không đủ số dư để thanh
                            toán, chúng tôi đồng ý vô điều kiện thực hiện theo
                            quyết định của Eximbank như sau/{" "}
                            <i>
                              In case our accounts are not enough for payment,
                              we unconditionally agree to fulfil Eximbank’s
                              decisions as follows:
                            </i>
                          </span>
                          <br />
                          <span class="ml-4">
                            - Nhận nợ vay bắt buộc bằng VNĐ hay ngoại tệ của L/C
                            tùy theo quyết định của Eximbank với mức lãi suất
                            bằng 150% lãi suất cho vay thông thường theo biểu
                            lãi suất Eximbank công bố đang áp dụng cho khoản vay
                            có thời hạn, tài sản đảm bảo tương ứng tại thời điểm
                            nhận nợ/{" "}
                            <i>
                              We acknowledge and accept Eximbank's authority to
                              enforce compulsory lending, which may be in
                              Vietnamese Dong (VND) or L/C currency, depending
                              on Eximbank's decision. We understand that the
                              penalty interest rate will be set at 150% of the
                              normal lending interest rate applied by Eximbank
                              for similar tenor and secured assets on the
                              disbursement date.
                            </i>
                          </span>
                          <br />
                          <span class="ml-4">
                            - Khi đó, toàn bộ lô hàng được nhập khẩu theo L/C
                            này đương nhiên trở thành tài sản bảo đảm cho việc
                            phát hành L/C. Theo đó chúng tôi đồng ý vô điều
                            kiện, không hủy ngang cho Eximbank được toàn quyền
                            xử lý lô hàng này và/hoặc tài sản khác mà chúng tôi
                            đã cầm cố, thế chấp hoặc bên thứ ba dùng để đảm bảo
                            cho khoản tín dụng của chúng tôi tại Eximbank để
                            Eximbank tự chủ thanh toán L/C, thu nợ (gốc, lãi) và
                            các chi phí phát sinh liên quan bao gồm nghĩa vụ với
                            Eximbank và các bên thứ ba liên quan mà không cần
                            thông báo cho chúng tôi. Trường hợp số tiền thu được
                            từ việc xử lý các tài sản này không đủ để thanh toán
                            nợ gốc, lãi và các chi phí phát sinh có liên quan
                            và/hoặc Eximbank không xử lý được các tài sản này,
                            chúng tôi chịu trách nhiệm thanh toán hết phần còn
                            thiếu hoặc dùng tài sản khác để thanh toán cho
                            Eximbank/{" "}
                            <i>
                              At that time, all shipments under this L/C shall
                              automatically serve as collateral. Accordingly, we
                              irrevocably and unconditionally agree that
                              Eximbank has the full right to manage these
                              shipments and/or any other assets that we have
                              pledged, mortgaged, or third parties have used to
                              secure our loan at Eximbank. Eximbank may
                              independently utilize these assets for L/C’s
                              payments, debt collection (principal and
                              interest), and all associated charges, including
                              obligations to Eximbank and related third parties,
                              without prior notification to us.In the event that
                              the proceeds from the disposal of these assets are
                              insufficient to cover the principal, interest, and
                              related expenses, and/or Eximbank is unable to
                              manage these assets, we undertake the
                              responsibility to settle the outstanding balance
                              or use alternative assets to satisfy our
                              obligations to Eximbank.
                            </i>
                          </span>
                        </div>
                      </div>
                      <div class="form-check form-group">
                        <div
                          class="form-check-label"
                          style={{ textAlign: "start" }}
                        >
                          <span class="ml-4">
                            4) Đề nghị Eximbank thông báo ngay cho chúng tôi nếu
                            chứng từ không phù hợp. Nếu quá thời hạn 4 ngày làm
                            việc kể từ ngày Eximbank gửi thông báo mà chưa nhận
                            được ý kiến bằng văn bản của chúng tôi, Eximbank
                            được phép hoàn trả chứng từ cho ngân hàng nước
                            ngoài. Chúng tôi tuân thủ quyết định của Eximbank và
                            không có khiếu nại, khởi kiện gì sau này đồng thời,
                            chịu mọi thiệt hại và chi phí liên quan./{" "}
                            <i>
                              Request Eximbank to immediately notify us if the
                              documents are not suitable. If beyond 04 working
                              days from the date of notice by Eximbank without
                              receiving our written opinion, Eximbank is allowed
                              to return the documents to the foreign bank. We
                              comply with Eximbank's decision and have no
                              complaints or lawsuits in the future and bear all
                              related losses and expenses.
                            </i>
                          </span>
                        </div>
                      </div>
                      <div class="form-check form-group">
                        <div
                          class="form-check-label"
                          style={{ textAlign: "start" }}
                        >
                          <span class="ml-4">
                            5) Chúng tôi đồng ý ủy quyền vô điều kiện, không hủy
                            ngang cho Eximbank được toàn quyền nhận số tiền được
                            bồi thường từ Hợp đồng bảo hiểm lô hàng nhập khẩu
                            được thanh toán bằng thư tín dụng này khi xảy ra sự
                            kiện bảo hiểm/{" "}
                            <i>
                              We irrevocably and unconditionally agree to
                              authorize Eximbank to have full right to receive
                              the indemnity from Insurance Policy for the import
                              shipment paid under this letter of credit upon
                              occurrence of insurance event.
                            </i>
                          </span>
                        </div>
                      </div>
                      <div class="form-check form-group">
                        <div
                          class="form-check-label"
                          style={{ textAlign: "start" }}
                        >
                          <span class="ml-4">
                            6) Trường hợp phí thông báo Thư tín dụng, phí xác
                            nhận Thư tín dụng và các phí khác (nếu có) không
                            được người thụ hưởng thanh toán cho ngân hàng nước
                            ngoài, chúng tôi sẽ chịu trách nhiệm thanh toán (kể
                            cả trong trường hợp Thư tín dụng hết hiệu lực mà
                            không được sử dụng)./{" "}
                            <i>
                              In case L/C notification fee, L/C confirmation fee
                              and other fees (if any) are not paid by the
                              beneficiary to the foreign bank, we will be
                              responsible for payment (including in case the L/C
                              expires without being used).
                            </i>
                          </span>
                        </div>
                      </div>
                      <div class="form-check form-group">
                        <div
                          class="form-check-label"
                          style={{ textAlign: "start" }}
                        >
                          <span class="ml-4">
                            7) Trong trường hợp đề nghị mở L/C yêu cầu 1/3
                            ORIGINAL B/L gửi trực tiếp đến chúng tôi, khi có
                            phát sinh chứng từ không phù hợp nhưng chúng tôi
                            chưa chấp nhận thanh toán trong trường hợp mà ngân
                            hàng nước ngoài yêu cầu hoàn lại chứng từ, chúng tôi
                            cam kết hoàn trả lại đầy đủ chứng từ trong thời hạn
                            yêu cầu của Eximbank để Eximbank hoàn trả cho ngân
                            hàng nước ngoài./{" "}
                            <i>
                              In case of request for issuing L/C, 1/3 ORIGINAL
                              B/L is sent directly to us, when there are
                              inappropriate documents but we have not yet
                              accepted payment in the case that the foreigner
                              bank requests to return documents, we commit to
                              return all documents for Eximbank in due time to
                              return to foreign bank.
                            </i>
                          </span>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12  ">
                          <div
                            class="form-check form-group"
                            style={{ textAlign: "start" }}
                          >
                            <label class="form-check-label" for="value5">
                              <span class="text-danger">
                                Chúng tôi cam kết những thông tin cung cấp là
                                đúng và đầy đủ, đồng thời chịu trách nhiệm về
                                tính xác thực của các chứng từ đính kèm trong đề
                                nghị này / We undertake that the above
                                information provided by us is true and correct,
                                contemporary responsibility for the authenticity
                                of the documents attached to this request.
                              </span>
                              {"\n"}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="row ">
            <div className="col-12 text-center">
              <button
                onClick={() => {
                  passEntry();
                }}
                className="btn btn-secondary mr-3"
                type="button"
              >
                <i className="fas fa-undo-alt mr-1"></i>
                <span className="text-button">Quay lại</span>
              </button>
              <button
                onClick={() => {
                  request
                    .postToExport(api.EXPORT_M700, {
                      contractId: lcDetail?.contractId,
                    })
                    .then((res) => {
                      if (res) {
                        Toast("Xuất MT700 thành công", TypeToast.SUCCESS);
                        downloadFile(
                          res,
                          createFileType("text/plain"),
                          "MT700"
                        );
                      }
                    })
                    .catch((e) => {
                      console.log(e);
                      Toast("Xuất MT700 thất bại", TypeToast.ERROR);
                    });
                }}
                className="btn btn-info"
                type="button"
              >
                <i className="fas fa-cloud-download-alt mr-1"></i>
                <span className="text-button">Xuất MT700</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LcOnlineDetail;
