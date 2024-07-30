import Pagetitle from "../../../../shared/ui/page-title/Pagetitle";
import React, { useEffect, useState } from "react";
import {
  checkPermission,
  getLabelByIdInArray,
  ListPage,
  Toast,
  TypeToast,
} from "../../../../utils/app.util";
import request from "../../../../utils/request";
import api from "../../../../utils/api";
import { Button, Form } from "reactstrap";
import { AvField, AvForm } from "availity-reactstrap-validation";
import UserAction from "./UserAction";
import moment from "moment/moment";
import Pagination from "react-js-pagination";
import Select from "react-select";
import { listStatus, listStatusAll } from "./User.provider";
import SelectComponent from "../../../../shared/component/select/SelectComponent";
import InputComponent from "../../../../shared/component/input/InputComponent";
import { CREATE, UPDATE, VIEW } from "../../../../constants/permissionTypes";
import { createFileType } from "../../../../utils/exportFile";

const UserManagement = (props) => {
  const breadcrumbItems = [
    { label: "Home page", path: "/NWF/home-page" },
    {
      label: "User Management",
      path: "/NWF/administration/user-management",
      active: true,
    },
  ];
  const [listDepartment, setListDepartment] = useState([]);
  const [listRole, setListRole] = useState([]);
  const [listJobtitle, setListJobtitle] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [mode, setMode] = useState("TABLE");

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [maxSize, setMaxSize] = useState(5);
  const [totalRecords, setTotalRecords] = useState(0);

  const [list, setList] = useState([]);
  const [listMenu, setListMenu] = useState([]);
  const [listMenuParent, setListMenuParent] = useState([]);
  const [listPage, setListPage] = useState(ListPage);
  const [item, setItem] = useState();

  // form
  const [searchForm, setSearchForm] = useState();
  const [code, setCode] = useState();
  const [fullName, setFullName] = useState();
  const [departmentCode, setDepartmentCode] = useState();
  const [jobTitle, setJobTitle] = useState();
  const [status, setStatus] = useState();

  const language = "vi";

  useEffect(() => {
    setSearchForm({
      code,
      fullName,
      departmentCode,
      status,
    });
  }, [code, fullName, departmentCode, status, totalRecords]);

  //   useEffect(() => {
  //     getAllByCondition(1, 10);
  //   }, [searchForm]);

  useEffect(() => {
    initForm();
    // getAllByCondition();
    getDataInit();
  }, []);

  const getDataInit = () => {
    request
      .post(api.GET_DEPARTMENT_PAGING, {
        limit: 0,
      })
      .then((res) => {
        let listDepartmentTemp = res?.data.map((item) => {
          item.value = item?.code;
          item.label = item?.value;
          return item;
        });
        setListDepartment(listDepartmentTemp);
      });

    request
      .post(api.GET_ROLE_BY_CONDITION, {
        status: -1,
      })
      .then((res) => {
        setListRole(res.data);
      });
  };

  const downloadFile = () => {
    window.open("http://10.86.144.195:3000/files/giay_de_nghi_LcOnline.pdf");
    // request
    //   .get("../../../../../public/files/giay_de_nghi_LcOnline.pdf")
    //   .then((res) => {
    //     console.log("res", res);
    //     downloadFile(res, createFileType("pdf"), "CustomerList");
    //   });
  };

  const initForm = (isReset = false) => {
    setCode("");
    setFullName("");
    setDepartmentCode("");
    setStatus(-1);
    setLoading(true);
    const json = {
      limit: 10,
      page: 1,
      status: -1,
    };
    request.post(api.GET_USER_PAGING, json).then((res) => {
      setLoading(false);
      if (res?.data) {
        setList([]);
        setList(res.data);
        setTotalRecords(res.totalRecord);
      } else if (res.errorCode === "1") {
        Toast(res.errorDesc, TypeToast.ERROR);
      } else {
        Toast("Get data failed", TypeToast.ERROR);
      }
    });
  };

  function onPageChange(pageNum) {
    setPage(pageNum);
    getAllByCondition(pageNum, limit);
  }

  function changeLimit() {
    getAllByCondition();
  }

  function onUpdate(item) {
    setMode("ACTION");
    setItem(item);
  }

  const search = (event) => {
    setLimit(10);
    setPage(1);
    getAllByCondition(1, 10);
  };

  const getAllByCondition = (pageNum = page, pageSize = limit) => {
    setLoading(true);

    const json = {
      limit: pageSize,
      page: pageNum,
      code: code,
      userName: fullName,
      departmentCode: departmentCode,
      status: status === "" ? -1 : status,
    };
    request.post(api.GET_USER_PAGING, json).then((res) => {
      setLoading(false);
      if (res?.data) {
        setList([]);
        setList(res.data);
        setTotalRecords(res.totalRecord);
      } else if (res.errorCode === "1") {
        Toast(res.errorDesc, TypeToast.ERROR);
      } else {
        Toast("Get data failed", TypeToast.ERROR);
      }
    });
  };

  return (
    <div className="container-fluid">
      <Pagetitle
        breadcrumbItems={breadcrumbItems}
        title={"Quản lý người dùng"}
      ></Pagetitle>
      {mode === "TABLE" ? (
        <div className="row">
          <div className="col-12 card-box">
            <fieldset>
              <legend>
                <a
                  onClick={() => {
                    setIsCollapsed(!isCollapsed);
                  }}
                >
                  Tìm kiếm thông tin
                  <i
                    aria-hidden="true"
                    className={
                      (isCollapsed ? "fas fa-minus" : "fas fa-plus") + " ml-1"
                    }
                  ></i>
                </a>
              </legend>
              <Form>
                <div className="row">
                  <div className="col-6">
                    <InputComponent
                      name="fullName"
                      title={"Mã nhân viên"}
                      value={code}
                      onChange={(val) => {
                        setCode(val);
                      }}
                    />
                  </div>
                  <div className="col-6">
                    {/* <AvField
                      name="userName"
                      label="Tên nhân viên"
                      value={userName}
                    /> */}
                    <InputComponent
                      name="fullName"
                      title={"Họ và tên nhân viên"}
                      value={fullName}
                      onChange={(val) => {
                        setFullName(val);
                      }}
                    />
                  </div>

                  {/* <div className="col-6">
                    <AvField
                      type="select"
                      name="departmentCode"
                      label="Phòng ban"
                      value={departmentCode}
                    >
                      <option key={"*" + new Date()} value={""}></option>
                      {listMenuParent?.map((x, i) => {
                        return (
                          <option key={x?.id} value={x?.id}>
                            {x?.name}
                          </option>
                        );
                      })}
                    </AvField>
                  </div> */}
                  <div className="col-6">
                    {/* <label>
                      <span className="required-label">Phòng ban</span>
                    </label>
                    <Select
                      placeholder="Chọn phòng ban"
                      value={departmentCode}
                      isClearable={true}
                      onChange={(val) => {
                        setDepartmentCode(val);
                        getAllByCondition(1, 10);
                      }}
                      options={listDepartment}
                    ></Select> */}
                    <SelectComponent
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
                  <div className="col-6">
                    <SelectComponent
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
                    {/* <label>
                      <span className="required-label">Trạng thái</span>
                    </label>
                    <Select
                      placeholder="Chọn trạng thái"
                      value={status}
                      onChange={(val) => {
                        setStatus(val);
                      }}
                      options={listStatusAll}
                    ></Select> */}
                  </div>
                </div>

                <div className="row">
                  <div className="col-6">
                    <button
                      hidden={!checkPermission(CREATE)}
                      onClick={() => {
                        setMode("ACTION");
                      }}
                      className="btn btn-primary"
                      type="button"
                    >
                      <i className="fas fa-plus mr-1"></i>
                      <span className="text-button">Tạo mới</span>
                    </button>
                    {/* <button
                      onClick={() => {
                        downloadFile();
                      }}
                      className="btn btn-primary"
                      type="button"
                    >
                      <i className="fas fa-plus mr-1"></i>
                      <span className="text-button">Tạo mới</span>
                    </button> */}
                  </div>
                  <div className="col-6 text-right">
                    <button
                      onClick={() => initForm(true)}
                      className="btn btn-secondary"
                      type="button"
                    >
                      <i className="fas fa-undo-alt mr-1"></i>
                      <span className="text-button">Làm mới</span>
                    </button>
                    <button
                      onClick={() => search(searchForm)}
                      className="btn btn-primary ml-1"
                      type="button"
                    >
                      <i className="fas fa-search mr-1"></i>
                      <span className="text-button">Tìm kiếm</span>
                    </button>
                  </div>
                </div>
              </Form>
            </fieldset>

            <div className="col-12 border-bottom-dotted pb-0 p-0 mb-2 mt-3">
              <span className="font-weight-medium theme-color">
                Danh sách Người Dùng
              </span>
            </div>

            <div className="table-responsive">
              <table className="table table-bordered table-sm table-hover m-w-tabble">
                <thead>
                  <tr className="m-header-table">
                    <th className="text-center align-middle mw-50">STT</th>
                    <th className="text-center align-middle mw-100 ">
                      Mã Nhân Viên
                    </th>
                    <th className="text-center align-middle mw-200">
                      Tên Nhân Viên
                    </th>
                    <th className="text-center align-middle mw-100">
                      Phòng Ban
                    </th>
                    <th className="text-center align-middle mw-100">Chức Vụ</th>
                    <th className="text-center align-middle mw-100">Email</th>
                    <th className="text-center align-middle mw-100">
                      Trạng Thái
                    </th>
                    <th className="text-center align-middle mw-100">
                      Thao tác
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {(!list || list.length <= 0) && (
                    <tr>
                      <td className="text-center align-middle" colSpan="10">
                        Không có dữ liệu
                      </td>
                    </tr>
                  )}
                  {list?.map((item, i) => {
                    return (
                      <tr key={item?.id}>
                        <td className="align-middle text-center">
                          {limit * (page - 1) + i + 1}
                        </td>
                        <td
                          className="align-middle  text-center text-primary m-cursor"
                          onClick={() => {
                            setMode("VIEW");
                            setItem(item);
                          }}
                        >
                          {item?.code}
                        </td>
                        <td className="align-middle text-left">
                          {item?.fullName}
                        </td>
                        <td className="align-middle  text-left">
                          {getLabelByIdInArray(
                            item.departmentCode,
                            listDepartment,
                            "code",
                            language === "vi" ? "name" : "nameEn"
                          )}
                        </td>
                        <td className="align-middle text-left">
                          {item?.chucVu}
                        </td>
                        <td className="align-middle text-left">
                          {item?.email}
                        </td>
                        <td className="align-middle text-center ">
                          {item?.status == 1 ? "Hoạt động" : "Không hoạt động"}
                        </td>
                        <td className="align-middle text-center">
                          <span
                            hidden={!checkPermission(UPDATE)}
                            onClick={() => onUpdate(item)}
                            className="text-info m-cursor"
                          >
                            <i className="fas fa-pencil-alt"></i>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="float-right">
              <Pagination
                itemClass="page-item"
                linkClass="page-link"
                activePage={page}
                itemsCountPerPage={limit}
                totalItemsCount={totalRecords}
                pageRangeDisplayed={5}
                onChange={(pageNum) => onPageChange(pageNum)}
              />
            </div>
          </div>
        </div>
      ) : (
        <UserAction
          item={item}
          listDepartment={listDepartment}
          listRole={listRole}
          mode={mode}
          passEntry={(res) => {
            getAllByCondition();
            // findAll();
            setMode("TABLE");
            setItem(null);
          }}
        ></UserAction>
      )}
    </div>
  );
};

export default UserManagement;
