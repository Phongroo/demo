import Pagetitle from "../../../../shared/ui/page-title/Pagetitle";
import React, { useEffect, useState } from "react";

import request from "../../../../utils/request";
import api from "../../../../utils/api";
import {
  ListPage,
  checkPermission,
  getLabelByIdInArray,
  parseDate,
} from "../../../../utils/app.util";
import { AvField, AvForm } from "availity-reactstrap-validation";
import { Button, Toast, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import ConfigProcess from "./ConfigProcess";
import Pagination from "react-js-pagination";
import ProcessDiagram from "../../../../shared/component/process/ProcessDiagram";
import TimeLine from "../../../../shared/component/process/TimeLine";
import moment from "moment/moment";

const ListBPMN = (props) => {

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  const breadcrumbItems = [
    { label: "Home page", path: "/NWF/home-page" },
    {
      label: "Process Management",
      path: "/NWF/administration/menu-management",
      active: true,
    },
    {
      label: "Process Config",
      path: "/NWF/administration/menu-management",
      active: true,
    },
  ];

  const [loading, setLoading] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [mode, setMode] = useState("TABLE");
  const [item, setItem] = useState();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [maxSize, setMaxSize] = useState(5);
  const [totalRecord, setTotalRecord] = useState(0);

  //List
  const [listUser, setListUser] = useState([]);
  const [listProcess, setListProcess] = useState([]);
  const [listPage, setListPage] = useState(ListPage);
  const statusList = [
    { value: "ALL", name: "Tất cả" },
    { value: "A", name: "Hoạt động" },
    { value: "D", name: "Ngưng hoạt động" },
  ];

  // search form
  const [searchForm, setSearchForm] = useState();
  const [processName, setProcessName] = useState();
  const [status, setStatus] = useState("ALL");

  const language = "vi";

  useEffect(() => {
    getAllUser();
    initForm();
  }, []);

  const getAllUser = () => {
    request
      .post(api.SEARCH_USER_COMPACT, {})
      .then((res) => {
        setListUser(res.data);
      })
      .catch((err) => null);
  };

  const initForm = (isReset = false) => {
    if (isReset) {
      setProcessName("");
      setStatus("ALL");
    }
    const searchForm = {
      processName,
      status,
    };

    findByCondition(page, limit, searchForm);
  };

  const search = (event, values) => {
    setLimit(10);
    setPage(1);
    findByCondition(values);
  };

  const findByCondition = (pageNum = page, pageSize = limit, values) => {
    setLoading(true);

    const json = {
      processName: values?.processName,
      status: values?.status === "ALL" ? null : values?.status,
      limit: pageSize,
      page: pageNum,
    };
    request
      .post(api.GET_LIST_PROCESS, json)
      .then((res) => {
        if (res) {
          setListProcess(res?.data);
          setTotalRecord(res.totalRecord);
        } else {
          Toast(res.errorDesc);
          setListProcess([]);
        }
      })
      .catch((e) => console.log(e));
  };

  function onPageChange(pageNum) {
    setPage(pageNum);
    findByCondition(pageNum, limit);
  }

  function changeLimit() {
    findByCondition();
  }

  // Đổi màn hình thao tác
  function onUpdate(item) {
    setMode("ACTION");
    setItem(item);
  }

  function onEditProcess(item) {
    props.history?.push("/bpmn/draw-flow", { processId: item?.processId });
  }

  function openModal(item) {
    setItem(item);
    setModal(true)
  }

  return (
    <div className="container-fluid">
      <Pagetitle
        breadcrumbItems={breadcrumbItems}
        title={"Cấu hình quy trình"}
      ></Pagetitle>

      {mode === "TABLE" ? (
        <div className="row">
          <div className="col-12 card-box">
            <fieldset>
              <legend>
                <a onClick={() => { setIsCollapsed(!isCollapsed); }}>
                  Tìm kiếm thông tin
                  <i className={(isCollapsed ? "fas fa-minus" : "fas fa-plus") + " ml-1"}
                  ></i>
                </a>
              </legend>

              <AvForm onValidSubmit={search}>
                <div className="row">
                  <div className="col-6">
                    <AvField
                      name="processName"
                      label="Tên quy trình"
                      value={processName}
                    />
                  </div>

                  <div className="col-6">
                    <AvField
                      type="select"
                      name="status"
                      label="Trạng thái"
                      value={status}
                    >
                      <option value={"ALL"}>Tất cả</option>
                      <option value={"A"}>Hoạt động</option>
                      <option value={"D"}>Không hoạt động</option>
                    </AvField>
                  </div>
                </div>

                <div className="row">
                  <div className="col-6 text-left">
                  </div>
                  <div className="col-6 text-right">
                    <button onClick={() => initForm(true)}
                      className="btn btn-secondary" type="button">
                      <i className="fas fa-undo-alt mr-1"></i>
                      <span className="text-button">Làm mới</span>
                    </button>
                    <button onClick={() => search(searchForm)}
                      className="btn btn-primary ml-1" type="button">
                      <i className="fas fa-search mr-1"></i>
                      <span className="text-button">Tìm kiếm</span>
                    </button>
                  </div>
                </div>
              </AvForm>
            </fieldset>

            <div className="col-12 border-bottom-dotted pb-0 p-0 mb-2 mt-3">
              <span className="font-weight-medium theme-color">
                Danh sách quy trình
              </span>
            </div>

            <div className="table-responsive">
              <table className="table table-bordered table-sm table-hover m-w-tabble">
                <thead>
                  <tr className="m-header-table">
                    <th className="text-center align-middle">Quy trình</th>
                    <th className="text-center align-middle">Người tạo</th>
                    <th className="text-center align-middle">Ngày tạo</th>
                    <th className="text-center align-middle">Trạng thái</th>
                    <th className="text-center align-middle">Thao tác</th>
                  </tr>
                </thead>

                <tbody>
                  {(!listProcess || listProcess.length <= 0) && (
                    <tr>
                      <td className="text-center align-middle" colSpan="10">
                        Không có dữ liệu
                      </td>
                    </tr>
                  )}
                  {listProcess?.map((item, i) => {
                    return (
                      <tr key={item?.id}>
                        <td className="align-middle text-info">
                          {/* <span onClick={toggle}> */}
                          <span onClick={() => openModal(item)}>
                            {item?.processName}
                          </span>
                        </td>
                        <td className="align-middle">
                          {getLabelByIdInArray( item.creator, listUser, "id", "fullName") || "N/A"} -
                           {getLabelByIdInArray( item.creator, listUser, "id", "code") || "N/A"}
                        </td>
                        <td className="align-middle text-center">
                          {parseDate(item?.createDate)}
                        </td>
                        <td className="align-middle text-center">
                          {getLabelByIdInArray(item.status, statusList, "value", "name")}
                        </td>
                        <td className="align-middle text-center">
                          <span onClick={() => onEditProcess(item)} className="text-info m-cursor" title="Chỉnh sửa quy trình">
                            <i className="fas fa-pencil-alt"></i>
                          </span>
                          <span onClick={() => onUpdate(item)} className="text-info m-cursor ml-1" title="Cấu hình quy trình">
                            <i class="fas fa-cog"></i>
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
                totalItemsCount={totalRecord}
                pageRangeDisplayed={5}
                onChange={(pageNum) => onPageChange(pageNum)}
              />
            </div>
          </div>
        </div>
      ) : (
        <ConfigProcess
          item={item}
          passEntry={(res) => {
            findByCondition();
            setMode("TABLE");
            setItem(null);
          }}
        ></ConfigProcess>
      )}

      <div>
      <Modal isOpen={modal} toggle={toggle} centered className={'modal-xlxx'}>
          <ModalHeader toggle={toggle}>
            Thông tin quy trình
          </ModalHeader>
          <ModalBody>
            <ProcessDiagram processDefinitionId={item?.processDefinitionId} viewTotalActives={true}></ProcessDiagram> :
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>


  );
};

export default ListBPMN;
