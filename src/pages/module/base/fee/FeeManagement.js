import React, { useEffect, useState } from "react";
import request from "../../../../utils/request";
import api from "../../../../utils/api";
import Pagetitle from "../../../../shared/ui/page-title/Pagetitle";
import Pagination from "react-js-pagination";
import FeeManagementAction from "./FeeManagementAction";
import { Form } from "reactstrap";
import SelectComponent from "../../../../shared/component/select/SelectComponent";
import InputComponent from "../../../../shared/component/input/InputComponent";
import { Toast, TypeToast, checkPermission } from "../../../../utils/app.util";
import { CONFIRM, CREATE, UPDATE } from "../../../../constants/permissionTypes";

const FeeManagement = (props) => {
  const breadcrumbItems = [
    { label: "Home page", path: "/home-page" },
    { label: "Quản lý biểu phí", path: "/fee/fee-management", active: true },
  ];

  const [isCollapsed, setIsCollapsed] = useState(true);
  const [mode, setMode] = useState("TABLE");

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  const [sysCCYs, setSysCCYs] = useState([]);
  const laders = [
    { label: "Bậc thang", value: "Y" },
    { label: "Cố định", value: "N" },
  ];
  const [listFee, setListFee] = useState([]);
  const [item, setItem] = useState();

  // form
  const [feeId, setFeeId] = useState(null);
  const [feeName, setFeeName] = useState(null);
  const [ccyId, setCcyId] = useState(null);
  const [isLader, setIsLader] = useState(null);
  const [searchForm, setSearchForm] = useState({
    feeId,
    feeName,
    ccyId,
    isLader,
  });

  // Payload
  const language = "vi";

   // initForm
   useEffect(() => {
    const searchForm = {
      feeId,
      feeName,
      ccyId,
      isLader,
    };

    setSearchForm(searchForm);
  }, [feeId, feeName, ccyId, isLader]);

  useEffect(() => {
    initForm();
    fetchSysCCYAll();
  }, []);

  const initForm = (isReset = false) => {
    const form = {
      ...searchForm,
    };

    if (isReset) {
      setFeeId("");
      setFeeName("");
      setCcyId("");
      setIsLader("");

      form.feeId = "";
      form.feeName = "";
      form.ccyId = "";
      form.isLader = "";
    }

    fetchFeeByCondition(page, limit, form);
  };

  function fetchFeeByCondition(pageNum = page, pageSize = limit, form) {
    let payload = {
      limit: pageSize,
      page: pageNum,
    };

    payload = {
      ...payload,
      feeId: form?.feeId,
      feeName: form?.feeName,
      ccyId: form?.ccyId,
      isLader: form?.isLader,
    };

    setLoading(true);
    request
      .post(api.SEARCH_BY_FEE, payload)
      .then((res) => {
        if (res?.content) {
          setLoading(false);
          setListFee(res.content);
          setTotalRecords(res.totalElements);
        } else {
          setLoading(false);
        }
      })
      .catch((e) => e);
  }

  function fetchSysCCYAll() {
    request.post(api.FIND_SYS_CCY_ALL, {}).then((res) => {
      if (res.content) {
        const arrRes = res.content;
        const arrNew = [];
        arrRes.forEach((el) => {
          const obj = {
            label: el?.ccyId,
            value: el?.ccyId,
          };
          arrNew.push(obj);
        });
        setSysCCYs(arrNew);
      }
    });
  }

  function onPageChange(pageNum) {
    setPage(pageNum);
    fetchFeeByCondition(pageNum, limit);
  }

  function onUpdate(item, mode) {
    setMode(mode);
    setItem(item);
  }

  const search = () => {
    setLimit(10);
    setPage(1);
    fetchFeeByCondition(page, limit, searchForm);
  };

  return (
    <div className="container-fluid">
      <Pagetitle
        breadcrumbItems={breadcrumbItems}
        title={"Quản lý biểu phí"}
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
                  <div className="row">
                    <div className="col-4">
                      <InputComponent
                        name="feeId"
                        title="Mã biểu phí"
                        value={feeId}
                        onChange={(val) => setFeeId(val)}
                      />
                    </div>

                    <div className="col-4">
                      <InputComponent
                        name="feeName"
                        title="Tên biểu phí"
                        value={feeName}
                        onChange={(val) => setFeeName(val)}
                      />
                    </div>

                    <div className="col-4">
                      <SelectComponent
                        notFirstDefault
                        name={"isLader"}
                        title={"Loại phí"}
                        list={laders}
                        bindLabel={"label"}
                        bindValue={"value"}
                        options={laders}
                        value={isLader}
                        onChange={(val) => {
                          setIsLader(val?.value);
                        }}
                      ></SelectComponent>
                    </div>

                    <div className="col-4">
                      <SelectComponent
                        notFirstDefault
                        title="Loại tiền tệ"
                        closeMenuOnSelect={false}
                        name={"ccyId"}
                        list={sysCCYs}
                        isClearable={true}
                        bindLabel={"label"}
                        bindValue={"value"}
                        value={ccyId}
                        onChange={(val) => {
                          setCcyId(val?.value);
                        }}
                      ></SelectComponent>
                      {/* <option key={"*"} value={""}>
                          Tất cả
                        </option>
                        {sysCCYs?.map((x, i) => {
                          return (
                            <option key={i} value={x?.ccyId}>
                              {x?.ccycd}
                            </option>
                          );
                        })} */}
                    </div>
                  </div>

                  <div className="row mt-2">
                    <div className="col-6">
                      <button
                        onClick={() => {
                          setMode("CREATE");
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
                      <button
                        className="btn btn-primary ml-1"
                        type="button"
                        onClick={search}
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
                    <th className="text-center align-middle mw-300">
                      Tên biểu phí
                    </th>
                    <th className="text-center align-middle mw-100">
                      Trạng thái
                    </th>
                    <th className="text-center align-middle mw-100">
                      Loại tiền
                    </th>
                    <th className="text-center align-middle mw-100">
                      Loại phí
                    </th>
                    <th className="text-center align-middle mw-100">
                      Thao tác
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {(!listFee || listFee.length <= 0) && (
                    <tr>
                      <td className="text-center align-middle" colSpan="10">
                        Không có dữ liệu
                      </td>
                    </tr>
                  )}
                  {listFee?.map((item, i) => {
                    return (
                      <tr key={item?.id}>
                        <td className="align-middle">
                          <span>{item?.feeId}</span>
                        </td>
                        <td className="align-middle">{item?.feeName}</td>
                        <td className="align-middle text-center">
                          <span
                            class={
                              item?.status === "A"
                                ? "badge badge-success"
                                : "badge badge-warning"
                            }
                          >
                            {item?.statusName}
                          </span>
                        </td>
                        <td className="align-middle">{item?.ccyId}</td>
                        <td className="align-middle">
                          {item?.isLader === "Y" ? "Bậc thang" : "Cố định"}
                        </td>

                        <td className="align-middle text-center">
                          <i
                            hidden={item?.status !== "A" || !checkPermission(UPDATE)}
                            className="fas fa-edit fa-lg m-cursor text-info"
                            onClick={() => onUpdate(item, "UPDATE")}
                          ></i>
                          <i
                            hidden={item?.status === "A" || !checkPermission(CONFIRM)}
                            className="fas fa-check-circle fa-lg m-cursor text-success"
                            onClick={() => onUpdate(item, "APPROVE")}
                          ></i>
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
        <FeeManagementAction
          item={item}
          laders={laders}
          sysCCYs={sysCCYs}
          mode={mode}
          // listMenuParent={listMenuParent}
          passEntry={(res) => {
            initForm(true);
            // findAll();
            setMode("TABLE");
            setItem(null);
          }}
        ></FeeManagementAction>
      )}
    </div>
  );
};
export default FeeManagement;
