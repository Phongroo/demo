import React, { useEffect, useState } from "react";
import Pagetitle from "../../../shared/ui/page-title/Pagetitle";
import request from "../../../utils/request";
import api from "../../../utils/api";
import {
  Button,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import Select from "react-select";

const ExportReportManagement = () => {
  const breadcrumbItems = [
    { label: "Home page", path: "/home-page" },
    { label: "Báo cáo", path: "" },
    {
      label: "Xuất báo cáo",
      path: "/report/export-report",
      active: true,
    },
  ];

  const [listData, setlistData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  //const [reportConfigs, setReportConfigs] = useState([]);
  const [item, setItem] = useState();
  const [title, settitle] = useState();
  const [listParamByTemplate, setlistParamByTemplate] = useState([]);
  const [template, settemplate] = useState();
  const listFieldType = [
    {
      code: "1",
      name: "Ẩn / hiện",
    },
    {
      code: "2",
      name: "Ô nhập",
    },
  ];
  const toggle = () => setOpenModal(!openModal);
  const listTemplate = [
    {
      name: "Mẫu báo cáo LC-Online",
      template: "templates/reportDemo1.jasper",
    },
  ];
  const listAction = [
    { label: "Hiện", value: true },
    { label: "Ẩn", value: false },
  ];

  useEffect(() => {
    getReportManagementByCondition();
  }, []);

  function getParamByTemplate(item) {
    if (!item) {
      return;
    }
    setItem(item);
    settitle(item?.name);
    settemplate(item?.template);
    const payload = {
      template: item?.template,
    };
    request.post(api.GET_PARAM_BY_REPORT, payload).then((res) => {
      if (res?.data) {
        setlistParamByTemplate(res?.data);
      }
    });
  }

  function getReportManagementByCondition() {
    request.post(api.GET_REPORT_MANAGEMENT_BY_CONDITION, {}).then((res) => {
      if (res?.data) {
        setlistData(res?.data);
        setTotalRecords(res?.totalRecord);
      }
    });
  }

  function exportReport() {
    const payload = {
      params: listParamByTemplate,
    };
    request
      .postToExport(api.EXPORT_REPORT_UPDATE_VALUE, payload)
      .then((res) => {
        const blob = new Blob([res], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const a = document.createElement("a");

        a.href = window.URL.createObjectURL(blob);
        a.download = "LC_ONLINE_" + new Date().toDateString() + ".xlsx";
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
      });
  }

  return (
    <>
      <div className="container-fluid">
        <Pagetitle
          breadcrumbItems={breadcrumbItems}
          title={"Danh sách báo cáo"}
        ></Pagetitle>
        <div className="row card-box">
          <div className="col-4">
            <div className="table-responsive">
              <table className="table table-bordered table-sm table-hover m-w-tabble">
                <thead>
                  <tr className="m-header-table">
                    <th className="text-center align-middle mw-100">
                      Tên báo cáo
                    </th>
                    <th className="text-center align-middle mw-200">
                      File template
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {listTemplate.map((element, i) => {
                    return (
                      <tr key={i}>
                        <td
                          className="text-left align-middle m-cursor"
                          onClick={() => {
                            getParamByTemplate(element);
                          }}
                        >
                          {element?.name}
                        </td>
                        <td className="text-left align-middle">
                          <a href="javascript:void(0);">{element?.template}</a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="col-8">
            <div className="table-responsive">
              <table className="table table-bordered table-sm table-hover m-w-tabble">
                <thead>
                  <tr className="m-header-table">
                    <th className="text-center align-middle mw-200">Mô tả</th>
                    <th className="text-center align-middle mw-200">Tham số</th>
                    <th className="text-center align-middle mw-200">
                      Kiểu tham số
                    </th>
                    <th className="text-center align-middle mw-200">
                      Giá trị mặc định
                    </th>
                  </tr>
                </thead>
                <tbody hidden={title}>
                  <tr>
                    <td className="text-left align-middle" colspan="4">
                      <i className="fas fa-angle-double-right"></i>{" "}
                      <i className="fas fa-angle-double-right"></i> Vui lòng
                      nhấn chọn mẫu báo cáo
                    </td>
                  </tr>
                </tbody>
                <tbody hidden={!title}>
                  <tr>
                    <td colspan="4">
                      <h4>
                        {title}{" "}
                        <i
                          className="fas fa-download text-primary m-cursor"
                          onClick={() => {
                            exportReport();
                          }}
                        ></i>
                      </h4>
                    </td>
                  </tr>
                  {listParamByTemplate.map((element, i) => {
                    return (
                      <tr key={i}>
                        <td className="text-left align-middle">
                          {element?.description}
                        </td>
                        <td className="text-left align-middle">
                          {element?.name}
                        </td>
                        <td className="text-left align-middle">
                          {element?.valueClassName}
                        </td>
                        <td className="text-left align-middle">
                          {element?.valueClassName === "java.lang.Boolean" && (
                            <Select
                              placeholder="Chọn giá trị"
                              defaultValue={listAction[0]}
                              options={listAction}
                              onChange={(val) => {
                                element.value = val?.value;
                              }}
                            ></Select>
                          )}
                          {element?.valueClassName === "java.lang.String" && (
                            <Input
                              placeholder="Nhập giá trị"
                              onChange={(val) => {
                                console.log(val);
                                if (val.target.value === "") {
                                  element.value = null;
                                } else {
                                  element.value = val.target.value;
                                }
                              }}
                            ></Input>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExportReportManagement;
