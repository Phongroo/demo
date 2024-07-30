import {
  Button,
  Form,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Toast,
} from "reactstrap";
import Pagination from "react-js-pagination";
import React, { useEffect, useState } from "react";
import {
  TypeToast,
  checkPermission,
  getLabelByIdInArray,
  parseDate,
} from "../../../utils/app.util";
import request from "../../../utils/request";
import api from "../../../utils/api";
import Pagetitle from "../../../shared/ui/page-title/Pagetitle";
import InputComponent from "../../../shared/component/input/InputComponent";
import SelectComponent from "../../../shared/component/select/SelectComponent";
import { CONFIRM, CREATE } from "../../../constants/permissionTypes";
import LcOnlineDetail from "./LcOnlineDetail";
import TimeLine from "../../../shared/component/process/TimeLine";
import LCOnline from "./lc-action/LCOnline";
import {
  listXuatNhapKhau,
  productType,
  subProductType2,
} from "./lc-action/lc-online";
import { createFileType, downloadFile } from "../../../utils/exportFile";

const LcOnlineManagement = () => {
  const breadcrumbItems = [
    { label: "Home page", path: "/home-page" },
    {
      label: "LC Online",
      path: "/lconline/lconline-update",
      active: true,
    },
  ];
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [mode, setMode] = useState("TABLE");

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  const [list, setList] = useState([]);
  const [item, setItem] = useState();
  const [timeStartCreate, setTimeStartCreate] = useState(new Date());
  const [listBranch, setListBranch] = useState([]);
  const listLCType = [
    {
      value: "A",
      label: "LC online - Phát hành",
    },
    {
      value: "E",
      label: "LC online - Tu chỉnh",
    },
    {
      value: "C",
      label: "LC online - Hủy",
    },
  ];
  const [customerList, setCustomerList] = useState([]);
  // form
  const [contractId, setContractId] = useState();
  const [contractType, setContractType] = useState();
  const [beneficiaryName, setBeneficiaryName] = useState();
  const [branch, setBranch] = useState();
  const [cifCode, setCifCode] = useState();
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [stepId, setStepId] = useState();

  const [itemParent, setItemParent] = useState();
  const [lcDetail, setLcDetail] = useState();

  const [listDepartment, setListDepartment] = useState([]);
  const [searchForm, setSearchForm] = useState({
    contractId,
    contractType,
    beneficiaryName,
    branch,
    cifCode,
    fromDate,
    toDate,
    stepId,
  });
  const [modal, setModal] = useState(false);
  const toggleModal = () => setModal(!modal);
  const [branches, setBranches] = useState([]);
  const language = "vi";
  const [listAllCodeLC, setListAllCodeLC] = useState([]);
  useEffect(() => {
    initForm();
    getListBranch();
    getAllCustomer();
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
      .post(api.GET_ALL_BRANCH, {})
      .then((res) => {
        if (res && res?.length > 0) {
          setBranches(res);
        }
      })
      .catch((e) => e);

    request
      .post(api.GET_ALL_CODE_LCONLINE, {})
      .then((res) => {
        if (res && res?.data?.length > 0) {
          let listNew = [];
          res?.data.forEach((t) => {
            listNew.push({
              label: t,
              value: t,
            });
          });
          console.log("listNew", listNew);
          setListAllCodeLC(listNew);
        }
      })
      .catch((e) => e);
  };

  const getAllCustomer = () => {
    setLoading(true);
    const json = {
      limit: 0,
    };
    request.post(api.GET_CUSTOMER, json).then((res) => {
      setLoading(false);
      if (res?.data) {
        setCustomerList(res.data);
      } else if (res.errorCode === "1") {
        Toast(res.errorDesc);
      } else {
        Toast("Get data failed", TypeToast.ERROR);
      }
    });
  };

  function getListBranch() {
    request
      .post(api.GET_LIST_BRANCH_PARENT, {})
      .then((res) => {
        if (res?.errorCode === "1") {
          setListBranch(res?.data);
        } else {
          setListBranch([]);
        }
      })
      .catch((e) => setListBranch([]));
  }

  // initForm
  useEffect(() => {
    const searchForm = {
      contractId,
      contractType,
      beneficiaryName,
      branch,
      cifCode,
      fromDate,
      toDate,
      stepId,
    };

    setSearchForm(searchForm);
  }, [
    contractId,
    contractType,
    beneficiaryName,
    branch,
    cifCode,
    fromDate,
    toDate,
    stepId,
  ]);

  const initForm = (isReset = false) => {
    const form = {
      ...searchForm,
    };

    if (isReset) {
      setContractId("");
      setContractType(null);
      setBeneficiaryName("");
      setBranch("");
      setCifCode("");
      setFromDate(null);
      setToDate(null);
      setStepId(null);

      form.contractId = null;
      form.contractType = null;
      form.beneficiaryName = null;
      form.branch = null;
      form.cifCode = null;
      form.fromDate = null;
      form.toDate = null;
      form.stepId = null;
    }

    search(form);
  };

  function onPageChange(pageNum) {
    setPage(pageNum);
    getAllByCondition(pageNum, limit);
  }

  function changeLimit() {
    getAllByCondition();
  }

  function onApprove(item) {
    request
      .post(api.GET_LC_ONLINE_APPROVE_V2, {
        contractId: item?.contractId,
        action: "approve",
      })
      .then((res) => {});
  }

  const search = (form) => {
    setLimit(10);
    setPage(1);
    getAllByCondition(1, 10, form);
  };

  const getAllByCondition = (pageNum = page, pageSize = limit, values) => {
    setLoading(true);

    const json = {
      limit: pageSize,
      page: pageNum,
      ...values,
      // name: values?.name,
      // parentId: values?.parentId,
      // status: values?.status === 'ALL' ? null : values?.status,
    };

    request.post(api.GET_LC_ONLINE, json).then((res) => {
      setLoading(false);
      if (res?.errorCode === "1") {
        setList(res.data);
        setTotalRecords(res.totalRecord);
      } else if (res.errorCode === "1") {
        Toast(res.errorDesc);
      } else {
        Toast("Get data failed");
      }
    });
  };

  function openModal(item) {
    setItem(item);
    toggleModal();
  }

  const openModalAction = (item, action) => {
    setItemParent(item);
    request
      .post(api.GET_LC_ONLINE_DETAIL, {
        contractId: item?.contractId,
      })
      .then((res) => {
        if (res?.errorCode === "1") {
          setLcDetail(res?.data);
          setMode(action);
          setTimeStartCreate(new Date());
        }
      });
  };

  const exportFileMT700V1 = (item, type) => {
    const payload = {
      contractId: item?.contractId,
    };
    request.postToExport(api.EXPORT_MT700V1, payload).then((res) => {
      const blob = new Blob([res], { type: "text/plain" });
      const a = document.createElement("a");

      a.href = window.URL.createObjectURL(blob);
      a.download = item?.contractId + "_" + new Date().toDateString() + ".txt";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
    });
  };
  const exportFileLCOnline = (item, type) => {
    const payload = {
      contractId: item?.contractId,
    };
    request.postToExport(api.EXPORT_LC_ONLINE, payload).then((res) => {
      const blob = new Blob([res], { type: "application/pdf" });
      const a = document.createElement("a");

      a.href = window.URL.createObjectURL(blob);
      a.download = item?.contractId + "_" + new Date().toDateString() + ".pdf";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
    });
  };

  const exportFileLCOnlineMT700BYCUSOMER = (item, type) => {
    const payload = {
      contractId: item?.contractId,
    };
    request.postToExport(api.EXPORT_LCMT700_BYCUSTOMER, payload).then((res) => {
      const blob = new Blob([res], { type: "application/pdf" });
      const a = document.createElement("a");

      a.href = window.URL.createObjectURL(blob);
      a.download = item?.contractId + "_" + new Date().toDateString() + ".pdf";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
    });
  };

  return (
    <div className="container-fluid">
      <Pagetitle
        breadcrumbItems={breadcrumbItems}
        title={"Truy vấn thông tin LC"}
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

              {isCollapsed && (
                <Form>
                  <div className="row mb-2">
                    <div className="col-4">
                      <InputComponent
                        title={"Số tham chiếu"}
                        name="contractId"
                        value={contractId}
                        onChange={(val) => setContractId(val)}
                      ></InputComponent>
                    </div>

                    <div className="col-4">
                      <InputComponent
                        title={"Người thụ hưởng"}
                        name="beneficiaryName"
                        value={beneficiaryName}
                        onChange={(val) => setBeneficiaryName(val)}
                      ></InputComponent>
                    </div>

                    <div className="col-4">
                      <SelectComponent
                        name={"branch"}
                        title={"Chi nhánh"}
                        list={listBranch}
                        bindLabel={"branchName"}
                        bindValue={"code"}
                        value={branch}
                        onChange={(val) => {
                          setBranch(val?.value);
                        }}
                      ></SelectComponent>
                    </div>

                    <div className="col-4">
                      <SelectComponent
                        name={"contractType"}
                        title={"Loại giao dịch"}
                        list={listXuatNhapKhau}
                        bindLabel={"label"}
                        bindValue={"value"}
                        value={contractType}
                        onChange={(val) => {
                          setContractType(val?.value);
                        }}
                      ></SelectComponent>
                    </div>

                    <div className="col-4">
                      <SelectComponent
                        name={"stepId"}
                        title={"Trạng thái"}
                        list={[
                          {
                            label: "Trả về",
                            value: "Activity_1",
                          },
                          {
                            label: "Tạo mới",
                            value: "Activity_2",
                          },
                        ]}
                        bindLabel={"label"}
                        bindValue={"value"}
                        value={stepId}
                        onChange={(val) => {
                          setStepId(val?.value);
                        }}
                      ></SelectComponent>
                    </div>

                    <div className="col-4">
                      <InputComponent
                        name="fromDate"
                        title="Từ ngày"
                        value={fromDate}
                        type="date"
                        onChange={(val) => setFromDate(val)}
                      />
                    </div>

                    <div className="col-4">
                      <InputComponent
                        name="toDate"
                        title="Đến ngày"
                        value={toDate}
                        type="date"
                        onChange={(val) => setToDate(val)}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-6">
                      <div className="col-6">
                        <button
                          hidden={!checkPermission(CREATE)}
                          onClick={() => {
                            setMode("CREATE");
                          }}
                          className="btn btn-primary"
                          type="button"
                        >
                          <i className="fas fa-plus mr-1"></i>
                          <span className="text-button">Tạo mới</span>
                        </button>
                      </div>
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
              )}
            </fieldset>

            <div className="col-12 border-bottom-dotted pb-0 p-0 mb-2 mt-3">
              <span className="font-weight-medium theme-color">
                Danh sách LC Online
              </span>
            </div>

            <div className="table-responsive">
              <table className="table table-bordered table-sm table-hover m-w-tabble">
                <thead>
                  <tr className="m-header-table">
                    <th className="text-center align-middle mw-200">
                      Số tham chiếu
                    </th>
                    <th className="text-center align-middle mw-200">
                      Số ref LC
                    </th>
                    <th className="text-center align-middle mw-200">
                      Product Type
                    </th>
                    <th className="text-center align-middle mw-200">
                      Sub Product Type
                    </th>
                    <th className="text-center align-middle mw-200">Branch</th>
                    <th className="text-center align-middle mw-200">
                      Sub Branch
                    </th>
                    <th className="text-center align-middle mw-200">
                      Ngày giao dịch
                    </th>
                    <th className="text-center align-middle mw-200">
                      Ngày xử lý
                    </th>
                    <th className="text-center align-middle mw-200">
                      Đơn vị thụ hưởng
                    </th>
                    <th className="text-center align-middle mw-200">
                      Trạng thái
                    </th>
                    <th className="text-center align-middle mw-200">
                      Xuất export
                    </th>
                    {/* <th className="text-center align-middle mw-200">
                      Trạng thái gọi FinCore
                    </th> */}
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
                        <td className="text-center align-middle text-primary">
                          <span
                            className="m-cursor"
                            onClick={() => {
                              openModalAction(item, "VIEW");
                            }}
                          >
                            {item?.contractId}
                          </span>
                        </td>
                        <td className="text-center align-middle">
                          <span>{item?.lcRefNumber || item?.reference}</span>
                        </td>
                        <td className="text-center align-middle">
                          <span>
                            {getLabelByIdInArray(
                              item?.productType,
                              productType,
                              "value",
                              "label"
                            )}
                          </span>
                        </td>
                        <td className="text-center align-middle">
                          <span>
                            {getLabelByIdInArray(
                              item?.subProductType2,
                              subProductType2,
                              "value",
                              "label"
                            )}
                          </span>
                        </td>
                        <td className="text-center align-middle">
                          <span>
                            {getLabelByIdInArray(
                              item?.branchId,
                              branches,
                              "brId",
                              "branchName"
                            )}
                          </span>
                        </td>
                        <td className="text-center align-middle">
                          <span>
                            {getLabelByIdInArray(
                              item?.subBranch,
                              branches,
                              "brId",
                              "branchName"
                            )}
                          </span>
                        </td>

                        <td className="text-center align-middle">
                          <span>{parseDate(item?.excuteDate)}</span>
                        </td>
                        <td className="text-center align-middle">
                          <span>{parseDate(item?.createDate)}</span>
                        </td>
                        <td className="align-middle">
                          <span>{item?.beneficiary1}</span>
                        </td>
                        <td className="text-center align-middle m-cursor">
                          <span
                            onClick={() => openModal(item)}
                            class={
                              item?.statusName !== "Trả về"
                                ? "badge badge-success"
                                : "badge badge-warning"
                            }
                          >
                            {item?.stepId ? item?.statusName : "Hoàn thành"}
                          </span>
                        </td>
                        <td className="align-middle text-left">
                          <a
                            className="underline m-cursor"
                            title="MT700.DOS"
                            onClick={() => {
                              exportFileMT700V1(item, "txt");
                            }}
                          >
                            MT700.DOS
                            {/* <i class="fas fa-file-download text-primary ml-2"></i> */}
                          </a>
                          <br />
                          <a
                            className="underline m-cursor"
                            title="Phát hành thư tín dụng"
                            onClick={() => {
                              exportFileLCOnline(item, "pdf");
                            }}
                          >
                            Phát hành thư tín dụng
                            {/* <i class="fas fa-file-download text-primary ml-2"></i> */}
                          </a>
                          <br />
                          <a
                            className="underline m-cursor"
                            title="MT700.KH"
                            onClick={() => {
                              exportFileLCOnlineMT700BYCUSOMER(item, "pdf");
                            }}
                          >
                            MT700.KH
                            {/* <i class="fas fa-file-download text-primary ml-2"></i> */}
                          </a>
                        </td>

                        {/* <td className="align-middle">
                          <span>
                            {item?.fincorestatus === "PARSE_RESPONSE_SUCCESS"
                              ? "Gửi dữ liệu Fincore thành công"
                              : ""}
                          </span>
                        </td> */}

                        <td className="align-middle text-center">
                          <span
                            title="Phê duyệt"
                            hidden={
                              !checkPermission(CONFIRM) ||
                              item?.endProcess ||
                              !item?.stepId
                            }
                            onClick={() => {
                              openModalAction(item, "CONFIRM");
                            }}
                            className="text-success m-cursor"
                          >
                            <i className="fas fa-check"></i>
                          </span>
                          <span
                            title="Trả về"
                            hidden={
                              !checkPermission(CONFIRM) ||
                              item?.endProcess ||
                              item?.stepId != "Activity_2"
                            }
                            onClick={() => {
                              openModalAction(item, "RETURN");
                            }}
                            className="text-warning m-cursor ml-2"
                          >
                            <i className="fas fa-undo"></i>
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
        <LCOnline
          mode={mode}
          itemParent={itemParent}
          listAllCodeLC={listAllCodeLC}
          timeStartCreate={timeStartCreate}
          item={lcDetail}
          branches={branches}
          customerList={customerList}
          listDepartment={listDepartment}
          lcDetail={lcDetail}
          baseBrList={listBranch}
          passEntry={() => {
            setLcDetail({});
            setMode("TABLE");
            search();
          }}
        ></LCOnline>
      )}

      <Modal isOpen={modal} toggle={toggleModal} centered>
        <ModalHeader toggle={toggleModal}>Thông tin thao tác</ModalHeader>
        <ModalBody>
          <TimeLine
            item={{
              ...item,
              ticketId: item?.contractId,
              endEventId: "End_event",
            }}
            processId={item?.processId}
          ></TimeLine>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};
export default LcOnlineManagement;
