import React, { useEffect, useState } from "react";
import { Form } from "reactstrap";
import { authUser } from "../../../../helpers/authUtils";
import request from "../../../../utils/request";
import api from "../../../../utils/api";
import { Toast, TypeToast, checkPermission } from "../../../../utils/app.util";
import InputComponent from "../../../../shared/component/input/InputComponent";
import SelectComponent from "../../../../shared/component/select/SelectComponent";
import moment from "moment";
import { CustTypeList, YesNoOption } from "../customer.provider";
import {
  Gender,
  ListCountry,
  listStatus,
} from "../../portal/user/User.provider";
import { UPDATE } from "../../../../constants/permissionTypes";
// import SelectMultiple from "../../../../shared/component/SelectMultiple";

const CustomerAction = (props) => {
  const { passEntry, item, mode } = props;
  const [loading, setLoading] = useState(false);
  // form
  const [custId, setCustId] = useState();
  const [cifCode, setCifCode] = useState();
  const [custName, setCustName] = useState();
  const [birthday, setBirthday] = useState();
  const [sex, setSex] = useState();
  const [phoneNo, setPhoneNo] = useState();
  const [email, setEmail] = useState();
  const [licenseNo, setlicenseNo] = useState();
  const [issueDate, setIssueDate] = useState();
  const [issuePlace, setIssuePlace] = useState();
  const [orgnation, setOrgnation] = useState();
  const [national, setNational] = useState();
  const [staff, setStaff] = useState();
  const [custType, setCustType] = useState();
  const [status, setStatus] = useState();
  const [address, setAddress] = useState();
  const [mobile, setMobile] = useState();
  const [shortName, setShortName] = useState();
  const [job, setJob] = useState();
  const [brithPlace, setBrithPlace] = useState();
  const [entityNumber, setEntityNumber] = useState();
  const creater = authUser().id;
  const createdDate = new Date();
  const [searchForm, setSearchForm] = useState();
  const [isSubmit, setIsSubmit] = useState();

  useEffect(() => {
    const searchForm = {
      custId,
      entityNumber,
      cifCode,
      custName,
      birthday,
      sex,
      phoneNo,
      email,
      licenseNo,
      issueDate,
      issuePlace,
      orgnation,
      national,
      staff,
      custType,
      status,
      address,
      mobile,
      shortName,
      job,
      brithPlace,
      creater,
    };

    setSearchForm(searchForm);
  }, [
    custId,
    cifCode,
    entityNumber,
    custName,
    birthday,
    sex,
    phoneNo,
    email,
    licenseNo,
    issueDate,
    issuePlace,
    orgnation,
    national,
    staff,
    custType,
    status,
    address,
    mobile,
    shortName,
    job,
    brithPlace,
    creater,
  ]);

  useEffect(() => {
    if (item) {
      setCustId(item?.custId);
      setCifCode(item?.cifCode);
      setEntityNumber(item?.entityNumber);
      setCustName(item?.custName);
      setBirthday(moment(item?.birthday).format("YYYY-MM-DD"));
      setSex(item?.sex);
      setPhoneNo(item?.phoneNo);
      setEmail(item?.email);
      setlicenseNo(item?.licenseNo);
      setIssueDate(moment(item?.issueDate).format("YYYY-MM-DD"));
      setIssuePlace(item?.issuePlace);
      setOrgnation(item?.orgnation);
      setNational(item?.national);
      setStaff(item?.staff);
      setCustType(item?.custType);
      setAddress(item?.address);
      setMobile(item?.mobile);
      setShortName(item?.shortName);
      setJob(item?.job);
      setBrithPlace(item?.brithPlace);
      setStatus(item?.status);
    }
  }, []);

  const onSubmit = (values) => {
    if (item) {
      update(values);
    } else {
      create(values);
    }
  };

  const checkValidate = () => {
    if (
      !cifCode ||
      !entityNumber ||
      !custName ||
      !birthday ||
      !sex ||
      !phoneNo ||
      !email ||
      !licenseNo ||
      !issueDate ||
      !issuePlace ||
      !orgnation ||
      !national ||
      !staff ||
      !custType ||
      !status ||
      !address ||
      !mobile ||
      !shortName ||
      !job ||
      !brithPlace
    ) {
      console.log("form", searchForm);
      Toast("Vui lòng điền đầy đủ thông tin", TypeToast.WARNING);
      return false;
    }
    return true;
  };
  function create(form) {
    setLoading(true);
    if (!checkValidate()) {
      return;
    }
    let json = {
      ...form,
      creater,
      createdDate,
    };

    console.log("json", json);
    request
      .post(api.CREATE_CUSTOMER, json)
      .then((res) => {
        setLoading(false);
        if (res.errorCode === "1") {
          Toast("Tạo thành công", TypeToast.SUCCESS);
          passEntry();
        } else if (res.errorCode === "0") {
          Toast("Tạo thất bại", TypeToast.ERROR);
        } else {
          Toast(res?.errorDesc, TypeToast.ERROR);
        }
      })
      .catch((err) => setLoading(false));
  }

  function update(form) {
    if (!checkValidate()) {
      return;
    }
    setLoading(true);
    const json = {
      ...form,
      id: item?.id,
      custId: item?.custId,
    };
    request
      .post(api.UPDATE_CUSTOMER, json)
      .then((res) => {
        setLoading(false);
        if (res.errorCode === "1") {
          Toast("update success", TypeToast.SUCCESS);
          passEntry();
        } else if (res.errorCode === "0") {
          Toast(res.errorDesc, TypeToast.ERROR);
        } else {
          Toast("update failed", TypeToast.ERROR);
        }
      })
      .catch((err) => setLoading(false));
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 card-box">
          <div className="col-12 border-bottom-dotted mb-2 p-0">
            <span className="font-weight-medium theme-color">
              Thông tin Khách hàng
            </span>
          </div>
          <Form>
            <div className="row">
              <div className="col-4">
                <InputComponent
                  isSubmit={isSubmit}
                  disabled
                  name="custId"
                  title={"ID khách hàng"}
                  required
                  value={custId}
                />
              </div>
              <div className="col-4">
                <InputComponent
                  isSubmit={isSubmit}
                  disabled={mode === "VIEW"}
                  name="cifCode"
                  title={"Cif code"}
                  required
                  value={cifCode}
                  onChange={(val) => {
                    setCifCode(val);
                  }}
                />
              </div>
              <div className="col-4">
                <InputComponent
                  isSubmit={isSubmit}
                  disabled={mode === "VIEW"}
                  name="entityNumber"
                  title={"Mã số khách hàng (entityNumber)"}
                  required
                  value={entityNumber}
                  onChange={(val) => {
                    setEntityNumber(val);
                  }}
                />
              </div>
              <div className="col-4">
                <InputComponent
                  isSubmit={isSubmit}
                  disabled={mode === "VIEW"}
                  name="custName"
                  title={"Họ và tên khách hàng"}
                  value={custName}
                  required
                  onChange={(val) => {
                    setCustName(val);
                  }}
                />
              </div>
              <div className="col-4">
                <InputComponent
                  isSubmit={isSubmit}
                  disabled={mode === "VIEW"}
                  name="shortName"
                  title={"Tên viết tắt"}
                  value={shortName}
                  required
                  onChange={(val) => {
                    setShortName(val);
                  }}
                />
              </div>
              <div className="col-4">
                <InputComponent
                  isSubmit={isSubmit}
                  disabled={mode === "VIEW"}
                  name="birthday"
                  title={"Ngày sinh"}
                  value={birthday}
                  type="date"
                  required
                  onChange={(val) => {
                    setBirthday(val);
                  }}
                />
              </div>
              <div className="col-4">
                <InputComponent
                  isSubmit={isSubmit}
                  disabled={mode === "VIEW"}
                  name="brithPlace"
                  title={"Nơi sinh"}
                  value={brithPlace}
                  required
                  onChange={(val) => {
                    setBrithPlace(val);
                  }}
                />
              </div>

              <div className="col-4">
                <SelectComponent
                  isSubmit={isSubmit}
                  required
                  disabled={mode === "VIEW"}
                  name={"sex"}
                  value={sex}
                  title={"Giới tính"}
                  list={Gender}
                  bindLabel={"label"}
                  bindValue={"value"}
                  onChange={(val) => {
                    setSex(val?.value);
                  }}
                ></SelectComponent>
              </div>

              <div className="col-4">
                <InputComponent
                  isSubmit={isSubmit}
                  disabled={mode === "VIEW"}
                  name="phoneNo"
                  title={"Số điện thoại"}
                  value={phoneNo}
                  required
                  onChange={(val) => {
                    setPhoneNo(val);
                  }}
                />
              </div>

              <div className="col-4">
                <InputComponent
                  isSubmit={isSubmit}
                  disabled={mode === "VIEW"}
                  name="mobile"
                  title={"Số điện thoại phụ"}
                  value={mobile}
                  required
                  onChange={(val) => {
                    setMobile(val);
                  }}
                />
              </div>

              <div className="col-4">
                <InputComponent
                  isSubmit={isSubmit}
                  disabled={mode === "VIEW"}
                  name="email"
                  title={"Email"}
                  value={email}
                  required
                  onChange={(val) => {
                    setEmail(val);
                  }}
                />
              </div>
              <div className="col-4">
                <InputComponent
                  isSubmit={isSubmit}
                  disabled={mode === "VIEW"}
                  name="licenseNo"
                  title={"Cccd/cmnd"}
                  value={licenseNo}
                  required
                  onChange={(val) => {
                    setlicenseNo(val);
                  }}
                />
              </div>
              <div className="col-4">
                <InputComponent
                  isSubmit={isSubmit}
                  disabled={mode === "VIEW"}
                  name="issueDate"
                  title={"Ngày cấp"}
                  value={issueDate}
                  type="date"
                  required
                  onChange={(val) => {
                    setIssueDate(val);
                  }}
                />
              </div>
              <div className="col-4">
                <InputComponent
                  isSubmit={isSubmit}
                  disabled={mode === "VIEW"}
                  name="issueDate"
                  title={"Nơi cấp"}
                  value={issuePlace}
                  required
                  onChange={(val) => {
                    setIssuePlace(val);
                  }}
                />
              </div>
              <div className="col-4">
                <InputComponent
                  isSubmit={isSubmit}
                  disabled={mode === "VIEW"}
                  name="orgnation"
                  title={"Tổ chức"}
                  value={orgnation}
                  required
                  onChange={(val) => {
                    setOrgnation(val);
                  }}
                />
              </div>
              <div className="col-4">
                <SelectComponent
                  isSubmit={isSubmit}
                  required
                  disabled={mode === "VIEW"}
                  name={"national"}
                  title={"Quốc tịch"}
                  isClearable={true}
                  list={ListCountry}
                  bindLabel={"label"}
                  bindValue={"value"}
                  value={national}
                  onChange={(val) => {
                    setNational(val?.value);
                  }}
                ></SelectComponent>
              </div>
              <div className="col-4">
                <SelectComponent
                  isSubmit={isSubmit}
                  required
                  disabled={mode === "VIEW"}
                  name={"staff"}
                  title={"Nhân viên"}
                  isClearable={true}
                  list={YesNoOption}
                  bindLabel={"label"}
                  bindValue={"value"}
                  value={staff}
                  onChange={(val) => {
                    setStaff(val?.value);
                  }}
                ></SelectComponent>
              </div>
              <div className="col-4">
                <SelectComponent
                  isSubmit={isSubmit}
                  required
                  disabled={mode === "VIEW"}
                  name={"custType"}
                  title={"Loại khách hàng"}
                  isClearable={true}
                  list={CustTypeList}
                  bindLabel={"label"}
                  bindValue={"value"}
                  value={custType}
                  onChange={(val) => {
                    setCustType(val?.value);
                  }}
                ></SelectComponent>
              </div>
              <div className="col-4">
                <SelectComponent
                  isSubmit={isSubmit}
                  required
                  disabled={mode === "VIEW"}
                  name={"status"}
                  value={status}
                  title={"Trạng thái"}
                  isClearable={true}
                  list={listStatus}
                  bindLabel={"label"}
                  bindValue={"value"}
                  onChange={(val) => {
                    setStatus(val?.value);
                  }}
                ></SelectComponent>
              </div>
              <div className="col-4">
                <InputComponent
                  isSubmit={isSubmit}
                  disabled={mode === "VIEW"}
                  name="address"
                  title={"Địa chỉ"}
                  value={address}
                  required
                  onChange={(val) => {
                    setAddress(val);
                  }}
                />
              </div>

              <div className="col-4">
                <InputComponent
                  isSubmit={isSubmit}
                  disabled={mode === "VIEW"}
                  name="job"
                  title={"Công việc"}
                  value={job}
                  required
                  onChange={(val) => {
                    setJob(val);
                  }}
                />
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-12 text-center">
                <button
                  onClick={() => {
                    passEntry();
                  }}
                  className="btn btn-secondary"
                  type="button"
                >
                  <i className="fas fa-undo-alt mr-1"></i>
                  <span className="text-button">Quay lại</span>
                </button>

                <button
                  hidden={!checkPermission(UPDATE) || mode == "VIEW"}
                  onClick={() => {
                    setIsSubmit(true);
                    onSubmit(searchForm);
                  }}
                  className="btn btn-primary ml-1"
                  type="button"
                >
                  <i
                    className={(item ? "fa-edit" : "fa-plus") + " fas mr-1"}
                  ></i>
                  <span className="text-button">
                    {item ? "Cập nhật" : "Tạo mới"}
                  </span>
                </button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};
export default CustomerAction;
