import { Form } from "reactstrap";
import { ListPage, getLabelByIdInArray } from "../../../../utils/app.util";
import SelectComponent from "../../../../shared/component/select/SelectComponent";
import { useEffect, useState } from "react";
import request from "../../../../utils/request";
import api from "../../../../utils/api";
import Pagetitle from "../../../../shared/ui/page-title/Pagetitle";
import InputComponent from "../../../../shared/component/input/InputComponent";
import { CustTypeList } from "../customer.provider";
import CustomerAction from "./CustomerAction";
import Pagination from "react-js-pagination";
import { Toast, TypeToast } from "../../../../utils/app.util";
import { createFileType, downloadFile } from "../../../../utils/exportFile";

const CustomerManagement = () => {
  const breadcrumbItems = [
    { label: "Home page", path: "/NWF/home-page" },
    {
      label: "Customer Management",
      path: "/NWF/customer/customer-management",
      active: true,
    },
  ];
  const [listDepartment, setListDepartment] = useState([]);
  const [listRole, setListRole] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [mode, setMode] = useState("TABLE");

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [maxSize, setMaxSize] = useState(5);
  const [totalRecords, setTotalRecords] = useState(100);

  const [list, setList] = useState([]);
  const [listMenu, setListMenu] = useState([]);
  const [listMenuParent, setListMenuParent] = useState([]);
  const [listPage, setListPage] = useState(ListPage);
  const [item, setItem] = useState();

  // form
  const [searchForm, setSearchForm] = useState();
  const [cifCode, setCifCode] = useState();
  const [custName, setCustName] = useState();
  const [phoneNo, setPhoneNo] = useState();
  const [licenseNo, setLicenseNo] = useState();
  const [custType, setCustType] = useState();

  const language = "vi";

  useEffect(() => {
    setSearchForm({
      cifCode,
      custName,
      phoneNo,
      licenseNo,
      custType,
    });
  }, [cifCode, custName, phoneNo, licenseNo, custType, totalRecords]);

  // useEffect(() => {
  //   getAllByCondition(1, 10);
  // }, [searchForm]);

  useEffect(() => {
    initForm();
    // getAllByCondition();
  }, []);

  const initForm = (isReset = false) => {
    setCifCode("");
    setCustName("");
    setPhoneNo("");
    setLicenseNo("");
    setCustType("");
    let form = {
      status: -1,
    };
    getAllByCondition(page, limit, form);
  };

  function onPageChange(pageNum: number) {
    setPage(pageNum);
    getAllByCondition(pageNum, limit);
  }

  function changeLimit() {
    getAllByCondition();
  }

  function onUpdate(item: any) {
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
      cifCode,
      custName,
      phoneNo,
      licenseNo,
      custType,
    };
    request.post(api.GET_CUSTOMER, json).then((res) => {
      setLoading(false);
      if (res?.data) {
        setList(res.data);
        setTotalRecords(res.totalRecord);
      } else if (res.errorCode === "1") {
        Toast(res.errorDesc);
      } else {
        Toast("Get data failed", TypeToast.ERROR);
      }
    });
  };

  const exportFile = (type) => {
    const payload = {
      fileType: type,
    };
    request.postToExport(api.EXPORT_CUSTOMER, payload).then(
      (res) => {
        if (res) {
          Toast("Export success", TypeToast.SUCCESS);

          downloadFile(res, createFileType(type), "CustomerList");
        }
      },
      (error) => {
        Toast("Export fail", TypeToast.ERROR);
      }
    );
  };

  return (
    <div className="container-fluid">
      <Pagetitle
        breadcrumbItems={breadcrumbItems}
        title={"Quản lý danh sách khách hàng"}
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
                      name="cifCode"
                      title={"Số CIF"}
                      value={cifCode}
                      onChange={(val) => {
                        setCifCode(val);
                      }}
                    />
                  </div>
                  <div className="col-6">
                    <InputComponent
                      name="custName"
                      title={"Tên khách hàng"}
                      value={custName}
                      onChange={(val) => {
                        setCustName(val);
                      }}
                    />
                  </div>

                  <div className="col-6">
                    <InputComponent
                      name="phoneNo"
                      title={"Số điện thoại"}
                      value={phoneNo}
                      onChange={(val) => {
                        setPhoneNo(val);
                      }}
                    />
                  </div>
                  <div className="col-6">
                    <InputComponent
                      name="fullName"
                      title={"Số chứng minh/ Hộ chiếu"}
                      value={licenseNo}
                      onChange={(val) => {
                        setLicenseNo(val);
                      }}
                    />
                  </div>
                  <div className="col-6">
                    <SelectComponent
                      name={"custType"}
                      title={"Loại khách hàng:"}
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
                </div>

                <div className="row">
                  <div className="col-6">
                    <button
                      onClick={() => {
                        setMode("ACTION");
                      }}
                      className="btn btn-primary"
                      type="button"
                    >
                      <i className="fas fa-plus mr-1"></i>
                      <span className="text-button">Tạo mới</span>
                    </button>
                    <button
                      onClick={() => {
                        exportFile("xlsx");
                      }}
                      className="btn btn-success ml-2"
                      type="button"
                    >
                      <i className="fas fa-file-excel  mr-1"></i>
                      <span className="text-button">Xuất</span>
                    </button>
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
                Danh sách Khách hàng
              </span>
            </div>

            <div className="table-responsive">
              <table className="table table-bordered table-sm table-hover m-w-tabble">
                <thead>
                  <tr className="m-header-table">
                    <th className="text-center align-middle mw-50">STT</th>
                    <th className="text-center align-middle mw-100 ">Số CIF</th>
                    <th className="text-center align-middle mw-200">
                      Tên khách hàng
                    </th>
                    <th className="text-center align-middle mw-100">
                      Số điện thoại
                    </th>
                    <th className="text-center align-middle mw-100">
                      Số chứng minh
                    </th>
                    <th className="text-center align-middle mw-100">
                      Loại khách hàng
                    </th>
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
                        <td className="align-middle  text-center text-primary m-cursor">
                          <p
                            onClick={() => {
                              setMode("VIEW");
                              setItem(item);
                            }}
                          >
                            {item?.cifCode}
                          </p>
                        </td>
                        <td className="align-middle text-left">
                          {item?.custName}
                        </td>
                        <td className="align-middle text-left">
                          {item?.phoneNo}
                        </td>
                        <td className="align-middle text-left">
                          {item?.licenseNo}
                        </td>
                        <td className="align-middle text-left">
                          {getLabelByIdInArray(
                            item.custType,
                            CustTypeList,
                            "value",
                            language === "vi" ? "label" : "label"
                          )}
                        </td>
                        <td className="align-middle text-center text-lefttext-left">
                          {item?.status == 1 ? "Hoạt động" : "Không hoạt động"}
                        </td>
                        <td className="align-middle text-center">
                          <span
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
        <CustomerAction
          item={item}
          mode={mode}
          passEntry={(res) => {
            getAllByCondition();
            setMode("TABLE");
            setItem(null);
          }}
        ></CustomerAction>
      )}
    </div>
  );
};

export default CustomerManagement;
