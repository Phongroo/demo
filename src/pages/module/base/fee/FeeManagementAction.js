import React, { useEffect, useState } from "react";
import { authUser } from "../../../../helpers/authUtils";
import { Form } from "reactstrap";
import InputComponent from "../../../../shared/component/input/InputComponent";
import SelectComponent from "../../../../shared/component/select/SelectComponent";
import request from "../../../../utils/request";
import api from "../../../../utils/api";
import { Toast, TypeToast, checkPermission } from "../../../../utils/app.util";
import {
  CONFIRM,
  CREATE,
  REJECT,
  UPDATE,
} from "../../../../constants/permissionTypes";

const FeeManagementAction = (props) => {
  const { passEntry, sysCCYs, laders, item, mode } = props;
  const [loading, setLoading] = useState(false);

  // form
  const creator = authUser()?.code;
  const [feeId, setFeeId] = useState(null);
  const [feeName, setFeeName] = useState(null);
  const [isLader, setIsLader] = useState(null);
  const [ccyId, setCcyId] = useState(null);
  const [description, setDescription] = useState(null);
  const [fixAmount, setFixAmount] = useState(0);
  const [countNumber, setCountNumber] = useState(false);
  const [countTimes, setCountTimes] = useState(false);
  const [amountParam, setAmountParam] = useState(false);
  const [percentYear, setPercentYear] = useState(0);
  const [minAmountFee, setMinAmountFee] = useState(0);
  const [maxAmountFee, setMaxAmountFee] = useState(0);
  const [listFeeDetail, setListFeeDetail] = useState([]);
  const listYesNo = [
    {label: "Có", value: true},
    {label: "Không", value: false}
  ];
  // Form Detail
  const [fromLimit, setfromLimit] = useState(0);
  const [toLimit, settoLimit] = useState(0);
  const [maxAmount, setmaxAmount] = useState(0);
  const [minAmount, setminAmount] = useState(0);
  const [laderex, setladerex] = useState(0);
  const [rate, setrate] = useState(0);
  const [note, setnote] = useState();
  useEffect(() => {
    if (item) {
      console.log(item);
      setFeeId(item?.feeId);
      setFeeName(item?.feeName);
      setIsLader(item?.isLader);
      setCcyId(item?.ccyId);
      setDescription(item?.description);
      setFixAmount(item?.fixAmount);
      setCountNumber(item?.countNumber);
      setCountTimes(item?.countTimes);
      setPercentYear(item?.percentYear);
      setMinAmountFee(item?.minAmount);
      setMaxAmountFee(item?.maxAmount);
      setAmountParam(item?.amountParam);
      setListFeeDetail(item?.feeDetails);
    }
  }, []);

  const onSubmit = () => {
    if (item) {
      if (mode === "APPROVE") {
        process(item, "APP");
      } else {
        checkTran();
      }
    } else {
      checkTran();
    }
  };

  function checkTran() {
    if (
      !feeId ||
      feeId === "" ||
      !feeName ||
      feeName === "" ||
      !isLader ||
      isLader === "" ||
      !ccyId ||
      ccyId === "" ||
      !fixAmount
    ) {
      Toast("Vui lòng điền đầy đủ các thông tin bắt buộc", TypeToast.WARNING);
      return;
    }

    const payload = {
      feeId,
      feeName,
      isLader,
      ccyId,
      description,
      fixAmount,
      countNumber,
      countTimes,
      percentYear,
      minAmount: minAmountFee,
      maxAmount: maxAmountFee,
      amountParam,
      userCreate: creator,
      userModify: creator,
      tranCode: mode === "UPDATE" ? "EBA_FEE2" : "EBA_FEE1", // Them moi
      feeDetails: listFeeDetail || [],
    };
    request.post(api.CHECK_TRAN, payload).then((res) => {
      if (res?.errorCode === "0") {
        Toast(res?.errorDes_VI, TypeToast.SUCCESS);
        passEntry();
      } else {
        Toast(res?.errorDes_VI, TypeToast.ERROR);
      }
    });
  }

  function process(item, actionType) {
    const payload = {
      feeId: item?.feeId,
      note,
      actionType,
      userCode: creator,
    };
    request.post(api.PROCESS_FEE, payload).then((res) => {
      if (res?.errorCode === "0") {
        Toast(res?.errorDes_VI, TypeToast.SUCCESS);
        passEntry();
      } else {
        Toast(res?.errorDes_VI, TypeToast.ERROR);
      }
    });
  }

  return (
    <div className="container-fluid">
      <div className="card-box">
        <div className="row">
          <div className="col-12">
            <Form>
              <div className="row">
                <div className="col-6">
                  <InputComponent
                    value={feeId}
                    name="feeId"
                    title="Mã biểu phí"
                    required
                    disabled={item != null}
                    onChange={(val) => {
                      setFeeId(val);
                    }}
                  ></InputComponent>
                </div>
                <div className="col-6">
                  <InputComponent
                    name="feeName"
                    value={feeName}
                    title="Tên biểu phí"
                    required
                    disabled={mode === "APPROVE"}
                    onChange={(val) => setFeeName(val)}
                  ></InputComponent>
                </div>
                <div className="col-3">
                  <SelectComponent
                    notFirstDefault
                    required
                    title="Loại tiền"
                    name={"ccyId"}
                    list={sysCCYs}
                    bindLabel={"label"}
                    bindValue={"value"}
                    value={ccyId}
                    disabled={mode === "APPROVE"}
                    onChange={(val) => {
                      setCcyId(val?.value);
                    }}
                  ></SelectComponent>
                </div>
                <div className="col-3">
                  <SelectComponent
                    notFirstDefault
                    required
                    title="Loại phí"
                    name={"isLader"}
                    list={laders}
                    bindLabel={"label"}
                    bindValue={"value"}
                    value={isLader}
                    disabled={mode === "APPROVE"}
                    onChange={(val) => {
                      setIsLader(val?.value);
                    }}
                  ></SelectComponent>
                </div>
                <div className="col-6">
                  <InputComponent
                    name="fixAmount"
                    value={fixAmount}
                    title="Phí cố định"
                    type="number"
                    required
                    disabled={mode === "APPROVE"}
                    onChange={(val) => setFixAmount(val)}
                  ></InputComponent>
                </div>
                <div className="col-3">
                <SelectComponent
                    notFirstDefault
                    required
                    title="Lấy theo giá trị"
                    name={"numberOfDays"}
                    list={listYesNo}
                    bindLabel={"label"}
                    bindValue={"value"}
                    value={amountParam}
                    disabled={mode === "APPROVE"}
                    onChange={(val) => {
                      setAmountParam(val?.value);
                    }}
                  ></SelectComponent>
                </div>
                <div className="col-3">
                <SelectComponent
                    notFirstDefault
                    required
                    title="Tính theo số lần"
                    name={"countNumber"}
                    list={listYesNo}
                    bindLabel={"label"}
                    bindValue={"value"}
                    value={countNumber}
                    disabled={mode === "APPROVE"}
                    onChange={(val) => {
                      setCountNumber(val?.value);
                    }}
                  ></SelectComponent>
                </div>
                <div className="col-3">
                <SelectComponent
                    notFirstDefault
                    required
                    title="Tính theo số ngày"
                    name={"countTimes"}
                    list={listYesNo}
                    bindLabel={"label"}
                    bindValue={"value"}
                    value={countTimes}
                    disabled={mode === "APPROVE"}
                    onChange={(val) => {
                      setCountTimes(val?.value);
                    }}
                  ></SelectComponent>
                </div>
                <div className="col-3">
                  <InputComponent
                    name="percentYear"
                    value={percentYear}
                    title="% Phí"
                    type="number"
                    disabled={mode === "APPROVE"}
                    onChange={(val) => setPercentYear(val)}
                  ></InputComponent>
                </div>
                <div className="col-3">
                  <InputComponent
                    name="minAmount"
                    value={minAmountFee}
                    title="Số tiền tối thiểu"
                    type="number"
                    disabled={mode === "APPROVE"}
                    onChange={(val) => setMinAmountFee(val)}
                  ></InputComponent>
                </div>
                <div className="col-3">
                  <InputComponent
                    name="maxAmount"
                    value={maxAmountFee}
                    title="Số tiền tối đa"
                    type="number"
                    disabled={mode === "APPROVE"}
                    onChange={(val) => setMaxAmountFee(val)}
                  ></InputComponent>
                </div>
                <div className="col-12">
                  <InputComponent
                    name="description"
                    value={description}
                    title="Diễn giải"
                    type="textarea"
                    rows="5"
                    disabled={mode === "APPROVE"}
                    onChange={(val) => setDescription(val)}
                  ></InputComponent>
                </div>
                {isLader === "Y" && (
                  <>
                    <div className="col-12 border-bottom-dotted pb-0 p-0 mb-2 mt-3">
                      <span className="font-weight-medium theme-color">
                        Phí bậc thang
                      </span>
                    </div>
                    <div class="col-6 mt-1">
                      <InputComponent
                        name="fromLimit"
                        value={fromLimit}
                        title="Từ số tiền"
                        type="number"
                        required
                        disabled={mode === "APPROVE"}
                        onChange={(val) => setfromLimit(val)}
                      ></InputComponent>
                    </div>
                    <div class="col-6 mt-1">
                      <InputComponent
                        name="toLimit"
                        value={toLimit}
                        title="Đến số tiền"
                        type="number"
                        required
                        disabled={mode === "APPROVE"}
                        onChange={(val) => settoLimit(val)}
                      ></InputComponent>
                    </div>
                    <div class="col-6 mt-1">
                      <InputComponent
                        name="rate"
                        value={rate}
                        title="Phí (%)"
                        type="number"
                        required
                        disabled={mode === "APPROVE"}
                        onChange={(val) => setrate(val)}
                      ></InputComponent>
                    </div>
                    <div class="col-6 mt-1">
                      <InputComponent
                        name="laderex"
                        value={laderex}
                        title="Phí cố định"
                        type="number"
                        required
                        disabled={mode === "APPROVE"}
                        onChange={(val) => setladerex(val)}
                      ></InputComponent>
                    </div>
                    <div class="col-6 mt-1">
                      <InputComponent
                        name="minAmount"
                        value={minAmount}
                        title="Tối thiểu"
                        type="number"
                        required
                        disabled={mode === "APPROVE"}
                        onChange={(val) => setminAmount(val)}
                      ></InputComponent>
                    </div>
                    <div class="col-6 mt-1">
                      <InputComponent
                        name="maxAmount"
                        value={maxAmount}
                        title="Tối đa"
                        type="number"
                        required
                        disabled={mode === "APPROVE"}
                        onChange={(val) => setmaxAmount(val)}
                      ></InputComponent>
                    </div>
                    <div className="col-12 text-right">
                      <button
                        hidden={mode === "APPROVE"}
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                          setListFeeDetail([
                            ...listFeeDetail,
                            {
                              id: new Date().getTime(),
                              fromLimit,
                              toLimit,
                              maxAmount,
                              minAmount,
                              laderex,
                              rate,
                            },
                          ]);
                        }}
                      >
                        <i className="fas fa-save mr-1"></i>
                        <span className="text-button">
                          Tạo mới phí bậc thang
                        </span>
                      </button>
                    </div>
                    <div className="col-12 border-bottom-dotted">
                      <span className="font-weight-medium theme-color">
                        Danh sách phí bậc thang
                      </span>
                    </div>
                    <div className="col-12 table-responsive">
                      <table className="table table-bordered table-sm table-hover m-w-tabble">
                        <thead>
                          <tr className="m-header-table">
                            <th className="text-center align-middle mw-100">
                              Từ số tiền
                            </th>
                            <th className="text-center align-middle mw-100">
                              Đến số tiền
                            </th>
                            <th className="text-center align-middle mw-50">
                              Phí (%)
                            </th>
                            <th className="text-center align-middle mw-100">
                              Phí cố định
                            </th>
                            <th className="text-center align-middle mw-100">
                              Tối thiểu
                            </th>
                            <th className="text-center align-middle mw-100">
                              Tối đa
                            </th>
                            <th
                              className="text-center align-middle mw-50"
                              hidden={mode === "APPROVE"}
                            >
                              Xoá
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {(!listFeeDetail || listFeeDetail.length <= 0) && (
                            <tr>
                              <td
                                className="text-center align-middle"
                                colSpan="7"
                              >
                                Không có dữ liệu
                              </td>
                            </tr>
                          )}
                          {listFeeDetail?.map((item, i) => {
                            return (
                              <tr key={item?.id}>
                                <td className="align-middle">
                                  <span>{item?.fromLimit}</span>
                                </td>
                                <td className="align-middle">
                                  <span>{item?.toLimit}</span>
                                </td>
                                <td className="align-middle">
                                  <span>{item?.rate}</span>
                                </td>
                                <td className="align-middle">
                                  <span>{item?.laderex}</span>
                                </td>
                                <td className="align-middle">
                                  <span>{item?.minAmount}</span>
                                </td>
                                <td className="align-middle">
                                  <span>{item?.maxAmount}</span>
                                </td>
                                <td
                                  className="align-middle text-center"
                                  hidden={mode === "APPROVE"}
                                >
                                  <i
                                    className="fas fa-trash-alt text-danger fa-lg m-cursor"
                                    onClick={() => {
                                      // Delete item index
                                      setListFeeDetail(
                                        listFeeDetail.filter(
                                          (a) => a.id !== item.id
                                        )
                                      );
                                    }}
                                  ></i>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
                {mode === "APPROVE" && (
                  <div className="col-12">
                    <InputComponent
                      name="note"
                      value={note}
                      title="Ghi chú nguyên nhân không duyệt"
                      type="textarea"
                      rows="7"
                      onChange={(val) => setnote(val)}
                    ></InputComponent>
                  </div>
                )}
              </div>

              <div className="row mt-2">
                <div className="col-12 text-right">
                  <button
                    onClick={() => {
                      passEntry();
                    }}
                    className="btn btn-secondary"
                  >
                    <i className="fas fa-undo-alt mr-1"></i>
                    Quay lại
                  </button>
                  {mode === "APPROVE" ? (
                    <>
                      <button
                        type="button"
                        className="btn btn-success ml-1"
                        onClick={() => {
                          onSubmit();
                        }}
                        hidden={!checkPermission(CONFIRM)}
                      >
                        <i className="fas fa-check-circle"></i>
                        <span className="text-button"> Phê duyệt</span>
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger ml-1"
                        onClick={() => {
                          onSubmit();
                        }}
                        hidden={!checkPermission(REJECT)}
                      >
                        <i className="fas fa-times-circle"></i>
                        <span className="text-button"> Từ chối</span>
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-primary ml-1"
                      onClick={() => {
                        onSubmit();
                      }}
                      hidden={!checkPermission(UPDATE)}
                    >
                      <i
                        className={(item ? "fa-edit" : "fa-save") + " fas mr-1"}
                      ></i>
                      <span className="text-button">
                        {item ? "Cập nhật" : "Tạo mới"}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeManagementAction;
