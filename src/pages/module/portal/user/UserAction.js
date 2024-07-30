import React, { useEffect, useState } from "react";
import { AvForm } from "availity-reactstrap-validation";
import { Button, Form } from "reactstrap";
import { authUser } from "../../../../helpers/authUtils";
import request from "../../../../utils/request";
import api from "../../../../utils/api";
import { Toast, TypeToast, checkPermission } from "../../../../utils/app.util";
import { Gender, ListCountry, listStatus } from "./User.provider";
import { emailRegex } from "../../../../utils/regex";
import Select from "react-select";
import InputComponent from "../../../../shared/component/input/InputComponent";
import SelectComponent from "../../../../shared/component/select/SelectComponent";
import moment from "moment";
import { UPDATE } from "../../../../constants/permissionTypes";
// import SelectMultiple from "../../../../shared/component/SelectMultiple";

const UserAction = (props) => {
  const { passEntry, item, mode } = props;
  let { listRole } = props;
  let { listDepartment } = props;
  //fortmat lại list để hiển thị giá trị ra ngoài
  // listRole = listRole.map((item) => {
  //   item.value = item?.code;
  //   item.label = item?.value;
  //   return item;
  // });

  const [title, setTitle] = useState(props?.title);
  const [listMenu, setListMenu] = useState(props?.listMenu);

  const [loading, setLoading] = useState(false);
  const [newitem, setNewitem] = useState();

  // form
  const [code, setCode] = useState();
  const [fullName, setFullName] = useState();
  const [departmentCode, setDepartmentCode] = useState([]);
  const [departmentCodeOther, setDepartmentCodeOther] = useState();
  const [jobTitle, setJobTitle] = useState();
  const [chucVu, setChucVu] = useState();
  const [roleCode, setRoleCode] = useState();
  const [sex, setSex] = useState();
  const [nation, setNation] = useState();
  const [cccd, setCccd] = useState();
  const [locationCccd, setLocationCccd] = useState();
  const [dateCccd, setDateCccd] = useState();
  const [phoneNo, setPhoneNo] = useState();
  const [email, setEmail] = useState();
  const [birthday, setBirthday] = useState();
  const [status, setStatus] = useState(1);
  const creater = authUser().id;
  const createdDate = new Date();
  const [searchForm, setSearchForm] = useState();
  const [isSubmit, setIsSubmit] = useState(false);
  useEffect(() => {
    const searchForm = {
      code,
      fullName,
      departmentCode,
      departmentCodeOther,
      chucVu,
      roleCode,
      sex,
      nation,
      cccd,
      locationCccd,
      dateCccd,
      phoneNo,
      email,
      birthday,
      status,
      creater,
    };

    setSearchForm(searchForm);
  }, [
    code,
    fullName,
    departmentCode,
    departmentCodeOther,
    chucVu,
    roleCode,
    sex,
    nation,
    cccd,
    locationCccd,
    dateCccd,
    phoneNo,
    email,
    birthday,
    status,
    creater,
  ]);

  useEffect(() => {
    if (item) {
      setCode(item?.code);
      setFullName(item?.fullName);
      setDepartmentCode(item?.departmentCode);
      setRoleCode(item?.roleCode?.split(","));
      setSex(item?.sex);
      setNation(item?.nation);
      //   setJobTitle(item?.jobTitle);
      setChucVu(item?.chucVu);
      setCccd(item?.cccd);
      setLocationCccd(item?.locationCccd);
      setDateCccd(moment(item?.dateCccd).format("YYYY-MM-DD"));
      setPhoneNo(item?.phoneNo);
      setEmail(item?.email);
      setBirthday(moment(item?.birthday).format("YYYY-MM-DD"));
      setStatus(item?.status);
    }
  }, []);

  const onSubmit = (values) => {
    setIsSubmit(true);
    if (item) {
      update(values);
    } else {
      create(values);
    }
  };

  const checkValidate = () => {
    if (
      !fullName ||
      !departmentCode ||
      !chucVu ||
      !roleCode?.length > 0 ||
      ![0, 1].includes(sex) ||
      !nation ||
      !cccd ||
      !locationCccd ||
      //   !dateCccd||
      !phoneNo ||
      !email ||
      //   birthday||
      !status
    ) {
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
      roleCode: roleCode.toString(),
    };

    console.log("json", json);
    request
      .post(api.CREATE_USER, json)
      .then((res) => {
        setLoading(false);
        if (res.errorCode === "1") {
          Toast("Tạo thành công", TypeToast?.SUCCESS);
          passEntry();
        } else if (res.errorCode === "0") {
          Toast("Tạo thất bại", TypeToast?.ERROR);
        } else {
          Toast(res?.errorDesc, TypeToast?.ERROR);
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
      id: item.id,
      code: item?.code,
      roleCode: roleCode.toString(),
    };
    request
      .post(api.UPDATE_USER, json)
      .then((res) => {
        setLoading(false);
        if (res.errorCode === "0") {
          Toast("update success", TypeToast?.SUCCESS);
          passEntry();
        } else if (res.errorCode === "1") {
          Toast(res.errorDesc, TypeToast?.ERROR);
        } else {
          Toast("update failed", TypeToast?.ERROR);
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
              Thông tin Người dùng
            </span>
          </div>
          <Form>
            <div className="row">
              <div className="col-4">
                <InputComponent
                  isSubmit={isSubmit}
                  disabled
                  name="code"
                  title={"Mã nhân viên"}
                  value={code}
                />
              </div>
              <div className="col-4">
                <InputComponent
                  isSubmit={isSubmit}
                  disabled={mode === "VIEW"}
                  name="fullName"
                  title={"Họ và tên nhân viên"}
                  value={fullName}
                  required
                  onChange={(val) => {
                    setFullName(val);
                  }}
                />
              </div>

              <div className="col-4">
                <SelectComponent
                  required
                  isSubmit={isSubmit}
                  disabled={mode === "VIEW"}
                  name={"departmentCode"}
                  title={"Phòng ban"}
                  isClearable={true}
                  list={listDepartment}
                  bindLabel={"name"}
                  bindValue={"code"}
                  value={departmentCode}
                  onChange={(val) => {
                    setDepartmentCode(val?.value);
                  }}
                ></SelectComponent>
              </div>

              <div className="col-4">
                <InputComponent
                  isSubmit={isSubmit}
                  disabled={mode === "VIEW"}
                  name="chucVu"
                  value={chucVu}
                  title={"Chức vụ"}
                  required
                  onChange={(val) => {
                    setChucVu(val);
                  }}
                />
              </div>

              <div className="col-4">
                {/* <label>
                  <span className="required-label">Quốc tịch</span>
                </label> */}
                {/* <Select
                  placeholder="Chọn quốc tịch"
                  value={nation}
                  isClearable={true}
                  onChange={(val) => {
                    setNation(val);
                  }}
                  options={ListCountry}
                ></Select> */}

                <SelectComponent
                  required
                  isSubmit={isSubmit}
                  disabled={mode === "VIEW"}
                  name={"nation"}
                  title={"Quốc tịch"}
                  isClearable={true}
                  list={ListCountry}
                  bindLabel={"label"}
                  bindValue={"value"}
                  value={nation}
                  onChange={(val) => {
                    setNation(val?.value);
                  }}
                ></SelectComponent>
              </div>
              <div className="col-4">
                {/* <label>
                  <span className="required-label">Giới tính</span>
                </label>
                <Select
                  placeholder="Chọn giới tính"
                  value={sex}
                  isClearable={true}
                  onChange={(val) => {
                    setSex(val);
                  }}
                  options={Gender}
                ></Select> */}

                <SelectComponent
                  required
                  isSubmit={isSubmit}
                  disabled={mode === "VIEW"}
                  name={"sex"}
                  value={sex}
                  title={"Giới tính"}
                  isClearable={true}
                  list={Gender}
                  bindLabel={"label"}
                  bindValue={"value"}
                  onChange={(val) => {
                    console.log("val", val?.value);
                    setSex(val?.value);
                  }}
                ></SelectComponent>
              </div>

              <div className="col-4">
                <InputComponent
                  isSubmit={isSubmit}
                  disabled={mode === "VIEW"}
                  name="cccd"
                  title={"CMND/CCCD hiện tại"}
                  value={cccd}
                  required
                  onChange={(val) => {
                    setCccd(val);
                  }}
                />
              </div>
              <div className="col-4">
                <InputComponent
                  isSubmit={isSubmit}
                  disabled={mode === "VIEW"}
                  name="locationCccd"
                  placeholder="Nhập nơi cấp"
                  title={"Nơi cấp"}
                  value={locationCccd}
                  required
                  onChange={(val) => {
                    setLocationCccd(val);
                  }}
                />
              </div>
              <div className="col-4">
                <InputComponent
                  isSubmit={isSubmit}
                  disabled={mode === "VIEW"}
                  name="dateCccd"
                  title={"Ngày cấp"}
                  value={dateCccd}
                  //   required
                  type="date"
                  onChange={(val) => {
                    setDateCccd(val);
                  }}
                />
              </div>
              <div className="col-4">
                <InputComponent
                  isSubmit={isSubmit}
                  disabled={mode === "VIEW"}
                  name="phoneNo"
                  title={"Điện thoại"}
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
                  name="email"
                  title={"E-mail"}
                  value={email}
                  required
                  validate={{
                    required: {
                      value: true,
                      errorMessage: "Vui lòng điền đúng định dạng abc@gmail.co",
                    },
                    // pattern: {
                    //   value: emailRegex,
                    //   errorMessage:
                    //     "Vui lòng điền đúng định dạng abc@gmail.com",
                    // },
                  }}
                  onChange={(val) => {
                    setEmail(val);
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
                  //   required
                  type="date"
                  onChange={(val) => {
                    setBirthday(val);
                  }}
                />
              </div>
              <div className="col-4">
                <SelectComponent
                  isSubmit={isSubmit}
                  required
                  disabled={mode === "VIEW"}
                  name={"roleCode"}
                  isMulti
                  title={"Vai trò"}
                  isClearable={true}
                  list={listRole}
                  bindLabel={"name"}
                  bindValue={"code"}
                  defaultValue={item?.roleCode?.split(",")}
                  onChange={(values) => {
                    const roleCodes = values?.map((x) => x.code);
                    setRoleCode(roleCodes);
                  }}
                ></SelectComponent>
                {/* <label>
                  <span className="required-label">Vai trò</span>
                </label>
                <Select
                  isDisabled={mode === "VIEW"}
                  value={roleCode}
                  isMulti
                  onChange={(val) => {
                    setRoleCode(val);
                  }}
                  options={listRole}
                ></Select> */}

                {/* <SelectMultiple
                  list={listRole}
                  value={departmentCode}
                  bindValue="code"
                  bindLabel="name"
                  onChange={(val) => {
                    console.log("val ngoài", departmentCode);
                    setDepartmentCode(val);
                  }}
                ></SelectMultiple> */}
              </div>
              <div className="col-4">
                {/* <InputComponent
                  type="select"
                  name="status"
                  label={<span className="required-label">Trạng thái</span>}
                  value={status}
                >
                  <option value={1}>Hoạt động</option>
                  <option value={0}>Không hoạt động</option>
                </InputComponent> */}
                {/* <label>
                  <span className="required-label">Trạng thái</span>
                </label>
                <Select
                  placeholder="Chọn trạng thái"
                  value={status}
                  onChange={(val) => {
                    setStatus(val);
                  }}
                  options={listStatus}
                ></Select> */}

                <SelectComponent
                  isSubmit={isSubmit}
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
                  hidden={!checkPermission(UPDATE)}
                  onClick={() => onSubmit(searchForm)}
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
export default UserAction;
