import { useEffect } from "react";
import Pagetitle from "../../../../shared/ui/page-title/Pagetitle";
import { useState } from "react";
import {
  Button,
  Form,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import InputComponent from "../../../../shared/component/input/InputComponent";
import SelectComponent from "../../../../shared/component/select/SelectComponent";
import request from "../../../../utils/request";
import api from "../../../../utils/api";
import { authUser } from "../../../../helpers/authUtils";
import {
  checkPermission,
  getLabelByIdInArray,
} from "../../../../utils/app.util";
import { Toast, TypeToast } from "../../../../utils/app.util";
import moment from "moment";
import { CREATE, UPDATE } from "../../../../constants/permissionTypes";

const ManageFeeToTranCode = (props) => {
  const userCode = authUser()?.code;

  const breadcrumbItems = [
    { label: "Home page", path: "/home-page" },
    { label: "Phí", path: "" },
    {
      label: "Quản lý gán biểu phí cho gói dịch vụ",
      path: "/fee/manage-fee-to-tran-code",
      active: true,
    },
  ];
  const tranCodes = [
    { value: "IBST0002", label: "CK trong hệ thống" },
    { value: "IBST0003", label: "CK ngoài hệ thống" },
    { value: "IBSR1010", label: "LC online - Phát hành (KH)" },
    { value: "IBSR1011", label: "LC online - Phát hành (Maker)" },
    { value: "IBSR1016", label: "LC online - Tu chỉnh" },
    { value: "IBST0039", label: "Chuyển tiền nước ngoài T/T" },
    {
      label: "L/C Nhập Khẩu - Phát hành L/C",
      value: "LCNHAPKHAU",
    },
    {
      label: "L/C Nhập Khẩu - Tu chỉnh L/C",
      value: "LCXUATKHAU",
    },
  ];
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Param filter
  const [filterFeeId, setfilterFeeId] = useState(null);
  const [filterCcyId, setfilterCcyId] = useState(null);
  const [filterTranCode, setfilterTranCode] = useState(null);
  const [filterBeginDate, setfilterBeginDate] = useState(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  const [item, setItem] = useState(null);
  const [searchForm, setSearchForm] = useState({
    filterFeeId,
    filterCcyId,
    filterTranCode,
    filterBeginDate,
  });

  // Param
  const [feeId, setFeeId] = useState(null);
  const [feeName, setFeeName] = useState(null);
  const [ccyId, setCcyId] = useState(null);
  const [tranCode, setTranCode] = useState(null);
  const [beginDate, setBeginDate] = useState(null);
  const [expDate, setExpDate] = useState(null);
  const [description, setDescription] = useState(null);

  // List
  const [sysCCYs, setsysCCYs] = useState([]);
  const [fees, setfees] = useState([]);
  const [listData, setListData] = useState([]);

  const [modal, setModal] = useState(false);
  const [tableCols, settableCols] = useState([
    {
      name: "Mã biểu phí",
      hidden: false,
      td: "feeId",
    },
    {
      name: "Tên biểu phí",
      hidden: false,
      td: "feeName",
    },
    {
      name: "Tên dịch vụ",
      hidden: false,
      td: "tranCode",
    },
    {
      name: "Loại tiền",
      hidden: false,
      td: "ccyId",
    },
    {
      name: "Ngày áp dụng",
      hidden: false,
      td: "beginDate",
    },
  ]);

  const toggle = () => setModal(!modal);

  useEffect(() => {
    initForm();
    fetchSysCCYAll();
    fetchFeeByCondition();
    tranCodeFeeSearch();
  }, []);

  // initForm
  useEffect(() => {
    const searchForm = {
      filterFeeId,
      filterCcyId,
      filterTranCode,
      filterBeginDate,
    };

    setSearchForm(searchForm);
  }, [filterFeeId, filterCcyId, filterTranCode, filterBeginDate]);

  const initForm = (isReset = false) => {
    const form = {
      ...searchForm,
    };

    console.log("initForm", isReset);
    if (isReset) {
      setFeeId("");
      setCcyId("");
      setTranCode("");
      setBeginDate("");
      setExpDate("");
      setDescription("");
      setFeeName("");
      setfilterFeeId("");
      setfilterCcyId("");
      setfilterTranCode("");
      setfilterBeginDate("");
      form.filterFeeId = "";
      form.filterCcyId = "";
      form.filterTranCode = "";
      form.filterBeginDate = "";
    }

    tranCodeFeeSearch(page, limit, form);
  };

  function tranCodeFeeSearch(pageNum = page, pageSize = limit, form) {
    let payload = {
      limit: pageSize,
      page: pageNum,
    };

    payload = {
      ...payload,
      feeId: form?.filterFeeId,
      ccyId: form?.filterCcyId,
      tranCode: form?.filterTranCode,
      beginDate: form?.filterBeginDate,
    };
    request.post(api.SEARCH_TRAN_CODE_FEE, payload).then((res) => {
      if (res?.data) {
        setListData(res.data);
        setTotalRecords(res.totalRecord);
      }
    });
  }

  function fetchFeeByCondition() {
    request.post(api.SEARCH_BY_FEE, { status: "A" }).then((res) => {
      if (res.content) {
        setfees(res.content);
      }
    });
  }

  function fetchSysCCYAll() {
    request.post(api.FIND_SYS_CCY_ALL, {}).then((res) => {
      if (res.content) {
        setsysCCYs(res.content);
      }
    });
  }

  const search = () => {
    setLimit(10);
    setPage(1);
    tranCodeFeeSearch(page, limit, searchForm);
  };

  function add(payload) {
    if (!payload) {
      return;
    }
    request.post(api.ADD_TRAN_CODE_FEE, payload).then((res) => {
      if (res?.errorCode === "0") {
        Toast(res?.errorDesc, TypeToast.SUCCESS);
        setModal(!modal);
        initForm(true);
      } else {
        Toast(res?.errorDesc, TypeToast.ERROR);
      }
    });
  }

  function update(payload) {
    if (!payload) {
      return;
    }
    request.post(api.UPDATE_TRAN_CODE_FEE, payload).then((res) => {
      if (res?.errorCode === "0") {
        Toast(res?.errorDesc, TypeToast.SUCCESS);
        setModal(!modal);
        initForm(true);
      } else {
        Toast(res?.errorDesc, TypeToast.ERROR);
      }
    });
  }

  const openModalByItem = (item) => {
    setModal(!modal);
    setItem(item);
    if (item) {
      setFeeId(item?.feeId);
      setCcyId(item?.ccyId);
      setTranCode(item?.tranCode);
      setFeeName(fees.find((el) => el?.feeId === item?.feeId)?.feeName);
      setBeginDate(moment(item?.beginDate).format("YYYY-MM-DD"));
      setExpDate(moment(item?.expDate).format("YYYY-MM-DD"));
      setDescription(item?.description);
    }
  };

  return (
    <>
      <div className="container-fluid">
        <Pagetitle
          breadcrumbItems={breadcrumbItems}
          title={"Quản lý gán biểu phí cho gói dịch vụ"}
        ></Pagetitle>
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
                      name="filterFeeId"
                      title="Mã biểu phí"
                      value={filterFeeId}
                      onChange={(val) => {
                        setfilterFeeId(val);
                      }}
                    />
                  </div>
                  <div className="col-6">
                    <SelectComponent
                      name={"filterTranCode"}
                      title={"Loại giao dịch"}
                      list={tranCodes}
                      bindLabel={"label"}
                      bindValue={"value"}
                      value={filterTranCode}
                      onChange={(val) => {
                        setfilterTranCode(val?.value);
                      }}
                    ></SelectComponent>
                  </div>
                  <div className="col-6">
                    <InputComponent
                      name="filterBeginDate"
                      title="Ngày áp dụng"
                      value={filterBeginDate}
                      type="date"
                      onChange={(val) => setfilterBeginDate(val)}
                    />
                  </div>
                  <div className="col-6">
                    <SelectComponent
                      name={"filterCcyId"}
                      title={"Loại tiền"}
                      list={sysCCYs}
                      bindLabel={"ccyId"}
                      bindValue={"ccyId"}
                      value={filterCcyId}
                      onChange={(val) => {
                        setfilterCcyId(val?.value);
                      }}
                    ></SelectComponent>
                  </div>
                </div>

                <div className="row mt-2">
                  <div className="col-6">
                    <button
                      onClick={toggle}
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
                      onClick={() => {
                        initForm(true);
                      }}
                      className="btn btn-secondary"
                      type="button"
                    >
                      <i className="fas fa-undo-alt mr-1"></i>
                      <span className="text-button">Làm mới</span>
                    </button>
                    <button
                      className="btn btn-primary ml-1"
                      type="button"
                      onClick={() => {
                        search();
                      }}
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
                Danh sách biểu phí
              </span>
            </div>
            <div className="table-responsive">
              <table className="table table-bordered table-sm table-hover m-w-tabble">
                <thead>
                  <tr className="m-header-table">
                    <th className="text-center align-middle mw-50">
                      Mã biểu phí
                    </th>
                    <th className="text-center align-middle mw-200">
                      Tên biểu phí
                    </th>
                    <th className="text-center align-middle mw-200">
                      Tên dịch vụ
                    </th>
                    <th className="text-center align-middle mw-50">
                      Loại tiền
                    </th>
                    <th className="text-center align-middle mw-50">
                      Ngày áp dụng
                    </th>
                    <th className="text-center align-middle mw-100">
                      Thao tác
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {(!listData || listData.length <= 0) && (
                    <tr>
                      <td className="text-center align-middle" colSpan="10">
                        Không có dữ liệu
                      </td>
                    </tr>
                  )}
                  {listData?.map((item, i) => {
                    return (
                      <tr key={item?.id}>
                        <td className="align-middle">
                          <span
                            className="text-primary m-cursor"
                            onClick={() => {
                              openModalByItem(item);
                            }}
                          >
                            {item?.feeId}
                          </span>
                        </td>
                        <td className="align-middle">{item?.feeName}</td>
                        <td className="align-middle">
                          {getLabelByIdInArray(
                            item?.tranCode,
                            tranCodes,
                            "value",
                            "label"
                          )}
                        </td>
                        <td className="align-middle text-center">
                          {item?.ccyId}
                        </td>
                        <td className="align-middle text-center">
                          {moment(item?.beginDate).format("DD/MM/YYYY")}
                        </td>
                        <td className="align-middle text-center">
                          <i
                            className="fas fa-edit fa-lg m-cursor text-info"
                            onClick={() => {
                              openModalByItem(item);
                            }}
                          ></i>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Modal action */}
        <div>
          <Modal
            isOpen={modal}
            toggle={toggle}
            backdrop={"static"}
            size={"xl"}
            centered={true}
          >
            <ModalHeader toggle={toggle}>
              Gán biểu phí cho gói dịch vụ
            </ModalHeader>
            <ModalBody>
              <Form>
                <div className="row">
                  <div className="col-6">
                    <label>
                      Mã biểu phí <span className="text-danger">*</span>
                    </label>
                    <SelectComponent
                      notFirstDefault
                      required
                      name={"feeId"}
                      list={fees}
                      bindLabel={"feeId"}
                      bindValue={"feeId"}
                      value={feeId}
                      onChange={(val) => {
                        setFeeId(val?.value);
                        if (!val?.value || val?.value === "") {
                          setFeeName(null);
                        } else {
                          setFeeName(
                            fees.find((el) => el?.feeId === val?.value)?.feeName
                          );
                        }
                      }}
                    ></SelectComponent>
                  </div>
                  <div className="col-6">
                    <InputComponent
                      required
                      value={feeName}
                      name="feeName"
                      title="Tên biểu phí"
                      disabled={true}
                    ></InputComponent>
                  </div>
                  <div className="col-6">
                    <label>
                      Loại phí <span className="text-danger">*</span>
                    </label>
                    <SelectComponent
                      notFirstDefault
                      required
                      name={"ccyId"}
                      list={sysCCYs}
                      bindLabel={"ccyId"}
                      bindValue={"ccyId"}
                      value={ccyId}
                      onChange={(val) => {
                        setCcyId(val?.value);
                      }}
                    ></SelectComponent>
                  </div>
                  <div className="col-6">
                    <label>
                      Loại giao dịch <span className="text-danger">*</span>
                    </label>
                    <SelectComponent
                      notFirstDefault
                      required
                      name={"tranCode"}
                      list={tranCodes}
                      bindLabel={"label"}
                      bindValue={"value"}
                      value={tranCode}
                      onChange={(val) => {
                        setTranCode(val?.value);
                      }}
                    ></SelectComponent>
                  </div>
                  <div className="col-6">
                    <InputComponent
                      required
                      value={beginDate}
                      name="beginDate"
                      title="Ngày áp dụng"
                      type="date"
                      onChange={(val) => {
                        setBeginDate(val);
                      }}
                    ></InputComponent>
                  </div>
                  <div className="col-6">
                    <InputComponent
                      required
                      value={expDate}
                      name="expDate"
                      title="Ngày hết hạn"
                      type="date"
                      onChange={(val) => {
                        setExpDate(val);
                      }}
                    ></InputComponent>
                  </div>
                  <div className="col-12">
                    <InputComponent
                      required
                      value={description}
                      name="description"
                      title="Diễn giải"
                      type="textarea"
                      rows="5"
                      onChange={(val) => {
                        setDescription(val);
                      }}
                    ></InputComponent>
                  </div>
                </div>
              </Form>
            </ModalBody>
            <ModalFooter>
              {!item && (
                <Button
                  hidden={!checkPermission(CREATE)}
                  color="primary"
                  onClick={() => {
                    const payload = {
                      feeId,
                      feeName,
                      ccyId,
                      tranCode,
                      beginDate,
                      expDate,
                      description,
                      userCreate: userCode,
                    };
                    add(payload);
                  }}
                >
                  <i class="fas fa-save mr-1"></i>
                  Tạo mới
                </Button>
              )}
              {item !== null && (
                <Button
                  hidden={!checkPermission(UPDATE)}
                  color="primary"
                  onClick={() => {
                    const payload = {
                      id: item?.id,
                      feeId,
                      feeName,
                      ccyId,
                      tranCode,
                      beginDate,
                      expDate,
                      description,
                      userCreate: userCode,
                    };
                    update(payload);
                  }}
                >
                  <i class="fas fa-save mr-1"></i>
                  Cập nhật
                </Button>
              )}
              <Button
                color="secondary"
                onClick={() => {
                  setModal(!modal);
                  setItem(null);
                  initForm(true);
                }}
              >
                <i class="fas fa-times mr-1"></i>
                Đóng
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      </div>
    </>
  );
};
export default ManageFeeToTranCode;
