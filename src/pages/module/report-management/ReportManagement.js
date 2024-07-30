import { useEffect, useState } from "react";
import Pagetitle from "../../../shared/ui/page-title/Pagetitle";
import {
  Button,
  Form,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import InputComponent from "../../../shared/component/input/InputComponent";
import { Toast, TypeToast, checkPermission } from "../../../utils/app.util";
import { CREATE, UPDATE } from "../../../constants/permissionTypes";
import request from "../../../utils/request";
import api from "../../../utils/api";
import { authUser } from "../../../helpers/authUtils";
import moment from "moment";
import SelectComponent from "../../../shared/component/select/SelectComponent";
import { useRef } from "react";
import Pagination from "react-js-pagination";

const ReportManagement = (props) => {
  const breadcrumbItems = [
    { label: "Home page", path: "/home-page" },
    { label: "Báo cáo", path: "" },
    {
      label: "Danh sách báo cáo",
      path: "/report/report-management",
      active: true,
    },
  ];
  const userCode = authUser()?.code;
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  // Payload dùng để search
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filterReportCode, setfilterReportCode] = useState('');
  const [filterReportName, setfilterReportName] = useState('');
  // Payload dùng để tạo ticket
  const [reportCode, setreportCode] = useState(null);
  const [reportName, setReportName] = useState(null);
  const [reportConfigs, setReportConfigs] = useState([]);
  const [reportFile, setReportFile] = useState(null);
  // Array
  const [listData, setlistData] = useState([]);
  // Object Item
  const [item, setItem] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const fileRef = useRef(null);
  const toggle = () => setOpenModal(!openModal);
  const [totalRecords, setTotalRecords] = useState(0);



  const [searchForm, setSearchForm] = useState({
    filterReportCode,
    filterReportName,
  });

  const listDataType = [
    { code: "string", name: "Chuỗi" },
    { code: "int", name: "Số" },
    { code: "date", name: "Ngày tháng" },
    // { code: "tc", name: "Tham chiếu" },

  ];

  const listFieldType = [
    {
      code: "1", name: "Ẩn / hiện"
    },
    {
      code: "2", name: "Ô nhập"
    }
  ]


  useEffect(() => {
    initForm();
    //console.log(authUser());
    //getReportManagementByCondition();
  }, []);

  useEffect(() => {
    const searchForm = {
      filterReportCode,
      filterReportName,
    };

    setSearchForm(searchForm);
}, [filterReportCode, filterReportName]);

  const initForm = (isReset = false) => {
    const form = {
      ...searchForm,
    };

    if (isReset) {
      setfilterReportCode("");
      setfilterReportName("");

      form.filterReportCode = "";
      form.filterReportName = "";
    }

    search(form);
  };

  function search(form) {
    setLimit(10);
    setPage(1);
    getAllByCondition(1, 10, form);
  }

  useEffect(() => {
    if (!openModal) {
      setReportName(null);
      setreportCode(null);
      setReportConfigs([]);
      setItem(null)
      setIsUpdate(false);
      setReportFile(null)
    }
  }, [openModal])

  function refresh() {
    setfilterReportCode("");
    setfilterReportName("");
    setPage(1);
    setLimit(10);
    getReportManagementByCondition();
  }


  function getReportManagementByCondition() {
    console.log("click")
    const payload = {
      reportCode: filterReportCode,
      reportName: filterReportName,
      limit,
      page,
    };
    request
      .post(api.GET_REPORT_MANAGEMENT_BY_CONDITION, payload)
      .then((res) => {
        if (res?.data) {
          setlistData(res?.data);
          console.log(res?.totalRecord);
          setTotalRecords(res?.totalRecord);
        }
      });
  }

  function onPageChange(pageNum) {
    setPage(pageNum);
    getAllByCondition(pageNum, limit);
  }

  const getAllByCondition = (pageNum = page, pageSize = limit, values) => {
    const json = {
      limit: pageSize,
      page: pageNum,
      reportCode: values?.filterReportCode,
      reportName: values?.filterReportName,
    };

    request.post(api.GET_REPORT_MANAGEMENT_BY_CONDITION, json).then((res) => {
      if (res.data) {
        setlistData(res?.data);
        setTotalRecords(res?.totalRecord);
      } else if (res.errorCode === "1") {
        Toast(res.errorDesc, TypeToast.ERROR);
      } else {
        Toast("Get data failed", TypeToast.ERROR);
      }
    });
  };

  function createReport() {
    if (reportFile == null) {
      Toast("Vui lòng chọn file", TypeToast.WARNING);
      return;
    }

    if (!reportCode || !reportName) {
      Toast("Vui lòng điền đầy đủ trường bắt buộc", TypeToast.WARNING);
      return;
    }
    const data = new FormData();
    data.append("file", reportFile);
    reportConfigs.forEach(x => {
      x.reportCode = reportCode;
    })
    const payload = {
      reportCode,
      reportName,
      reportConfigs,
      creator: userCode,
    };
    console.log(payload);
    data.append("info", new Blob([JSON.stringify(payload)], { type: "application/json" }));

    request.postFormData(api.CREATE_REPORT, data).then((res) => {
      if (res?.errorCode === "OK") {
        Toast(res?.errorDesc, TypeToast.SUCCESS);
        setOpenModal(!openModal);
        setIsUpdate(false);
        getReportManagementByCondition();
      } else {
        Toast(res.errorDesc, TypeToast.ERROR);
      }
    });
  }

  function updateReport() {
    const data = new FormData();
    data.append("file", reportFile);
    const payload = {
      reportCode,
      reportName,
      reportConfigs,
      editor: userCode,
    };
    data.append("info", new Blob([JSON.stringify(payload)], { type: "application/json" }));
    request.postFormData(api.UPDATE_REPORT, data).then((res) => {
      if (res?.errorCode === "OK") {
        Toast(res?.errorDesc, TypeToast.SUCCESS);
        setOpenModal(!openModal);
        setIsUpdate(false);
        getReportManagementByCondition();
      } else {
        Toast(res.errorDesc, TypeToast.ERROR);
      }
    });

  }

  function handleAddRow() {
    const item = {
      reportCode: reportCode,
      reportHeader: "",
      reportValue: null,
      reportValueType: listDataType[0].code,
      reportValueDefault: "",
      reportNumber: reportConfigs.length + 1,
      reportDescriptionHeader: "",
      reportFieldType: listFieldType[0].code
    }
    const updateList = [...reportConfigs, item];
    setReportConfigs(updateList);
  }

  function handleRemoveRow(index) {
    const tempList = [...reportConfigs];
    tempList.splice(index, 1);
    setReportConfigs(tempList);
  }

  function handleChange(index, val, field, isSelect = false) {
    console.log("index " + index + "val " + val + "field " + field);
    console.log(reportConfigs);
    const tempList = JSON.parse(JSON.stringify(reportConfigs));
    tempList[index] = {
      ...tempList[index],
      [field]: isSelect ? val.code : val
    }
    console.log(JSON.stringify(tempList))
    setReportConfigs(tempList);
    if (isSelect) {
      resetValueDefault(index, tempList);

      showInputByDataType(val, index);
    }

  }

  function openModalUpdate(item) {
    setIsUpdate(true);
    setOpenModal(!openModal);
    setItem(item);
    if (item) {
      console.log(item);
      setreportCode(item?.reportCode);
      setReportName(item?.reportName);
      setReportConfigs(item?.reportConfigs);
    }
  }

  function resetValueDefault(index, list) {
    const tempList = JSON.parse(JSON.stringify(list));
    tempList[index] = {
      ...tempList[index],
      "reportValueDefault": ''
    }
    console.log(JSON.stringify(tempList))
    setReportConfigs(tempList);
  }
  function handleChangeFile(e) {
    if (!e.target.files) {
      return;
    }
    setReportFile(e.target.files[0]);
  }

  function showInputByDataType(val, index) {


    switch (val) {
      case listDataType[0].code:
        return <InputComponent
          title=""
          name={reportConfigs[index].reportValueDefault}
          value={reportConfigs[index].reportValueDefault}
          onChange={(val) => { handleChange(index, val, "reportValueDefault") }}
        ></InputComponent>
      case listDataType[1].code:
        return <InputComponent type='number'
          title=""
          name={reportConfigs[index].reportValueDefault}
          value={reportConfigs[index].reportValueDefault}
          onChange={(val) => { handleChange(index, val, "reportValueDefault") }}
        ></InputComponent>
      case listDataType[2].code:
        return <InputComponent
          name="reportConfigs[index].reportValueDefault"
          title={""}
          value={reportConfigs[index].reportValueDefault}
          type="date"
          onChange={(val) => {
            handleChange(index, val, "reportValueDefault")
          }}
        />
      default:
        return <InputComponent
          title=""
          name={reportConfigs[index].reportValueDefault}
          value={reportConfigs[index].reportValueDefault}
          onChange={(val) => { handleChange(index, val, "reportValueDefault") }}
        ></InputComponent>
    }
  }

  return (
    <>
      <div className="container-fluid">
        <Pagetitle
          breadcrumbItems={breadcrumbItems}
          title={"Danh sách báo cáo"}
        ></Pagetitle>
      </div>
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
                    name="filterReportCode"
                    title="Mã báo cáo"
                    value={filterReportCode}
                    onChange={(val) => {
                      setfilterReportCode(val);
                    }}
                  />
                </div>
                <div className="col-6">
                  <InputComponent
                    name="filterReportName"
                    title="Tên báo cáo"
                    value={filterReportName}
                    onChange={(val) => {
                      setfilterReportName(val);
                    }}
                  />
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-6">
                  <button
                    onClick={() => {
                      setOpenModal(!openModal);
                    }}
                    className="btn btn-primary"
                    type="button"
                    hidden={!checkPermission(CREATE)}
                  >
                    <i className="fas fa-plus mr-1"></i>
                    <span className="text-button">Tạo mới</span>
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
                  <button className="btn btn-primary ml-1" type="button" onClick={() => search(searchForm)}>
                    <i className="fas fa-search mr-1"></i>
                    <span className="text-button">Tìm kiếm</span>
                  </button>
                </div>
              </div>
            </Form>
          </fieldset>
          <div className="col-12 border-bottom-dotted pb-0 p-0 mb-2 mt-3">
            <span className="font-weight-medium theme-color">
              Danh sách báo cáo
            </span>
          </div>
          <div className="table-responsive">
            <table className="table table-bordered table-sm table-hover m-w-tabble">
              <thead>
                <tr className="m-header-table">
                  <th className="text-center align-middle mw-50">Mã báo cáo</th>
                  <th className="text-center align-middle mw-200">
                    Tên báo cáo
                  </th>
                  <th className="text-center align-middle mw-50">Ngày tạo</th>
                  <th className="text-center align-middle mw-50">Người tạo</th>
                  <th className="text-center align-middle mw-50">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {(!listData || listData.length <= 0) && (
                  <tr>
                    <td className="text-center align-middle" colSpan="5">
                      Không có dữ liệu
                    </td>
                  </tr>
                )}
                {listData?.map((item, i) => {
                  return (
                    <tr key={item?.reportCode}>
                      <td className="align-middle">
                        <span className="text-primary m-cursor">
                          {item?.reportCode}
                        </span>
                      </td>
                      <td className="align-middle">
                        <span>{item?.reportName}</span>
                      </td>
                      <td className="align-middle">
                        <span>
                          {moment(item?.createDate).format("DD/MM/YYYY")}
                        </span>
                      </td>
                      <td className="align-middle">
                        <span>{item?.creator}</span>
                      </td>
                      <td className="align-middle text-center">
                        <span hidden={!checkPermission(UPDATE)}
                          onClick={() => {

                            openModalUpdate(item);
                          }} className="text-info m-cursor mr-1">
                          <i className="fas fa-pencil-alt"></i>
                        </span>

                        {/* <span hidden={!checkPermission(UPDATE)}
                          onClick={() => {

                            exportReport(item);
                          }} className="text-info m-cursor">
                          <i class="fas fa-download"></i>
                        </span> */}
                      </td>
                    </tr>);
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
      {/* Modal action */}
      <div>
        <Modal
          scrollable={true}
          isOpen={openModal}
          toggle={toggle}
          backdrop={"static"}
          size={"xl"}
          centered={true}
        >
          <ModalHeader toggle={toggle}>Tạo báo cáo</ModalHeader>
          <ModalBody>
            <Form>
              <div className="row">
                <div className="col-4">
                  <InputComponent
                    disabled={isUpdate}
                    required
                    value={reportCode}
                    name="reportCode"
                    title="Mã báo cáo"
                    onChange={(val) => {
                      setreportCode(val);
                    }}
                  ></InputComponent>
                </div>
                <div className="col-4">
                  <InputComponent
                    required
                    value={reportName}
                    name="reportName"
                    title="Tên báo cáo"
                    onChange={(val) => {
                      setReportName(val);
                    }}
                  ></InputComponent>
                </div>
                <div className="col-4">
                  {/* <InputComponent
                    type='file'
                    required
                    
                    title="File báo cáo"
                    onChange={
                      handleChangeFile}
                  ></InputComponent> */}
                  <label htmlFor="reportFile">
                    File báo cáo : {isUpdate && <span>{`${reportCode}.jasper`}</span>}
                  </label>
                  <input className="form-control-file" ref={fileRef}
                    id="reportFile" type="file" onChange={handleChangeFile}></input>
                </div>
              </div>
              <div className="table-responsive">
                <table className="table table-bordered table-sm table-hover m-w-tabble">
                  <thead>
                    <tr className="m-header-table">
                      <th className="text-center align-middle">
                        <span onClick={() => { handleAddRow() }}>
                          <i className="fas fa-plus mr-1"></i>
                        </span>
                      </th>
                      <th className="text-center align-middle mw-200">Mô tả tham số</th>
                      <th className="text-center align-middle mw-200">Tham số</th>
                      <th className="text-center align-middle mw-200">Kiểu cột</th>
                      {/* <th className="text-center align-middle mw-100">Kiểu dữ liệu</th>
                      <th className="text-center align-middle mw-100">Mặc định/Tham chiếu</th> */}
                      <th className="text-center align-middle mw-100">Thứ tự</th>
                    </tr>
                  </thead>

                  <tbody>
                    {(!reportConfigs || reportConfigs.length <= 0) && (
                      <tr>
                        <td className="text-center align-middle" colSpan="6">
                          Không có dữ liệu
                        </td>
                      </tr>
                    )}
                    {reportConfigs?.map((item, i) => {
                      return (
                        <tr key={i}>
                          <td className='align-middle text-center'>
                            <span onClick={() => { handleRemoveRow(i) }}>
                              <i className="fas fa-trash mr-1"></i>
                            </span>
                          </td>
                          <td className="align-middle">
                            <InputComponent
                              title=""
                              name={reportConfigs[i].reportDescriptionHeader}
                              value={reportConfigs[i].reportDescriptionHeader}
                              onChange={(val) => {
                                handleChange(i, val, "reportDescriptionHeader")
                              }}
                            ></InputComponent>
                          </td>
                          <td className="align-middle">
                            <InputComponent
                              title=""
                              name={reportConfigs[i].reportHeader}
                              value={reportConfigs[i].reportHeader}
                              onChange={(val) => {
                                handleChange(i, val, "reportHeader")
                              }}
                            ></InputComponent>
                          </td>
                          <td className="align-middle">
                            <SelectComponent
                              isIntable={true}
                              notFirstDefault
                              name={reportConfigs[i].reportFieldType}
                              title=""
                              list={listFieldType}
                              bindLabel={"name"}
                              bindValue={"code"}
                              value={reportConfigs[i].reportFieldType}
                              onChange={(val) => {
                                handleChange(i, val, "reportFieldType", true)
                              }}></SelectComponent>
                            {/* <SelectComponent
                              isIntable={true}
                              notFirstDefault
                              name={reportConfigs[i].reportValueType}
                              title=""
                              list={listDataType}
                              bindLabel={"name"}
                              bindValue={"code"}
                              value={reportConfigs[i].reportValueType}
                              onChange={(val) => {
                                handleChange(i, val, "reportValueType", true)
                              }}></SelectComponent> */}
                            {/* <InputComponent
                              title=""
                              name={reportConfigs[i].reportValue}
                              value={reportConfigs[i].reportValue}
                              onChange={(val) => {
                                handleChange(i, val, "reportValue")
                              }}
                            ></InputComponent> */}
                            {/* <SelectComponent
                              isIntable={true}
                              notFirstDefault
                              name={"reportConfigs[i].reportValue"}
                              title=""
                              list={[
                                { code: "Y", name: "Hiện" },
                                { code: "N", name: "Ẩn" }
                              ]}
                              bindLabel={"name"}
                              bindValue={"code"}
                              value={reportConfigs[i].reportValue}
                              onChange={(val) => {
                                if (!val) {
                                  val = 'Y';
                                }
                                handleChange(i, val, "reportValue", true)
                              }}></SelectComponent> */}
                          </td>
                          {/* <td className="align-middle text-center">
                            <SelectComponent
                              isIntable={true}
                              notFirstDefault
                              name={"reportConfigs[i].reportValueType"}
                              title=""
                              list={listDataType}
                              bindLabel={"name"}
                              bindValue={"code"}
                              value={reportConfigs[i].reportValueType}
                              onChange={(val) => {
                                handleChange(i, val, "reportValueType", true)
                              }}></SelectComponent>
                          </td>
                          <td className="align-middle text-center">
                            {showInputByDataType(reportConfigs[i].reportValueType, i)}
                          </td> */}
                          <td className="align-middle text-center">
                            {reportConfigs[i]?.reportNumber}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

            </Form>
          </ModalBody>
          <ModalFooter>
            {!item && (
              <Button hidden={!checkPermission(CREATE)} color="primary" onClick={() => { createReport() }}>
                <i className="fas fa-save mr-1"></i>
                Tạo mới
              </Button>
            )}
            {item !== null && (
              <Button hidden={!checkPermission(UPDATE)} color="primary" onClick={() => { updateReport() }}>
                <i className="fas fa-save mr-1"></i>
                Cập nhật
              </Button>
            )}
            <Button
              color="secondary"
              onClick={() => {
                //openModalUpdate(item);
                setOpenModal(!openModal);
              }}
            >
              <i className="fas fa-times mr-1"></i>
              Đóng
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </>
  );
};
export default ReportManagement;
