import React, { useEffect, useState } from "react";
import { AvField, AvForm } from "availity-reactstrap-validation";
import { Button } from "reactstrap";
import { authUser } from "../../../../helpers/authUtils";
import request from "../../../../utils/request";
import api from "../../../../utils/api";
import { Toast, TypeToast } from "../../../../utils/app.util";
import SelectComponent from "../../../../shared/component/select/SelectComponent";
import Select from "react-select";
import { TranTypeList } from "../../../../utils/data.util";

const ConfigProcess = (props) => {
  const { passEntry, item } = props;
  const [title, setTitle] = useState(props?.title);

  const [loading, setLoading] = useState(false);

  //List
  // const [listMenu, setListMenu] = useState([]);
  const [listStep, setListStep] = useState([]);
  const [listRole, setListRole] = useState([]);

  // form
  const [tranCodes, setTranCodes] = useState();

  const status = "Y";
  

  useEffect(() => {
    findAllRole();
  }, []);


  const findAllRole = () => {
    request
      .post(api.GET_ROLE_BY_CONDITION, {})
      .then((res) => {
        setListRole(res.data);

        // Có list role mới gọi hàm lấy list cấu hình
        if (item) {
          findStepByProcessId();
          if (item?.tranCodes) {
            setTranCodes(item?.tranCodes);
          }
        }
      })
      .catch((err) => null);
  };

  const findStepByProcessId = () => {
    const json = { processId: item?.processId };
    request
      .post(api.GET_STEPS_BY_PROCESS_ID, json)
      .then((res) => {
        setListStep(res.data);
      })
      .catch((err) => {
        setListStep([]);
      });
  };

  function onAssignToProcess() {
    if (!tranCodes) {
      Toast("Vui lòng chọn loại giao dịch", TypeToast.WARNING);
      return;
    }
    setLoading(true);
    const json = {
      id: item?.id,
      processId: item?.processId,
      tranCodes: tranCodes,
    };
    
    request
      .post(api.ASSIGN_PROCESS_TO_TRANSFER_TYPE, json)
      .then((res) => {
        setLoading(false);
        if (res) {
          Toast(res.errorDesc);
        }
      })
      .catch((err) => setLoading(false));
  }

  function saveAllConfig() {
    const listToSave = [...listStep];
    listToSave.forEach(x => {
      if (x.role) {
        x.role = x.role.toString();
      }

    })
    const json = {
      requestList: listToSave
    }
    
    setLoading(true);
    request.post(api.UPDATE_CONFIG_STEP, json)
      .then((res) => {
        if (res?.data) {
          Toast('Cập nhật thành công');
        } else {
          Toast(res?.errorDesc, TypeToast.WARNING);
        }
      }).catch((err) => {
        Toast('Lỗi cập nhật thông tin');
      });
  };

  function saveConfigStep(item) {
    if (!item?.role || item?.role?.length < 1) {
      Toast('Vui lòng chọn ít nhất một role', 'Thông báo');
      return;
    }

    const json = {
      id: item.id,
      processId: item?.processId,
      stepId: item?.stepId,
      departmentCode: item?.departmentCode,
      role: item?.role?.toString(),
      stepBeforeEnd: item?.stepBeforeEnd,
    }

    request.post(api.UPDATE_CONFIG_STEP, json)
      .then((res) => {
        if (res?.data) {
          Toast('Cập nhật thành công');
        } else {
          Toast(res?.errorDesc, TypeToast.WARNING);
        }
      }).catch((err) => {
        Toast('Lỗi cập nhật thông tin');
      });
  }

  // HTML
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 card-box">
          {/* Loại giao dịch sử dụng quy trình */}
          <div className="row">
            <div className="col-12 border-bottom-dotted mb-2">
              <span className="font-weight-medium theme-color">
                Loại giao dịch sử dụng quy trình
              </span>
            </div>
            <div className="col-12">
              <div className="row">
                <div className="col-6">
                  <SelectComponent
                    clearable="false"
                    notFirstDefault="true"
                    name={"menuItem"}
                    // title={"Loại giao dịch"}
                    list={TranTypeList}
                    bindLabel={"label"}
                    bindValue={"value"}
                    value={tranCodes}
                    onChange={(val) => { setTranCodes(val?.value); }}></SelectComponent>
                </div>
                <div className="col-sm-6 col-md-2">
                  <button onClick={() => onAssignToProcess()} className="btn btn-success" type="button">
                    <i className="fas fa-save"></i>
                    <span className="text-button ml-1">Cập nhật</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 border-bottom-dotted mb-2 mt-2">
              <div className="row">
                <div className="col-6">
                  <span className="font-weight-medium theme-color">
                    Danh sách step
                  </span>
                </div>
                <div className="col-6 text-right">
                  <Button color="success" onClick={() => { saveAllConfig(); }} >
                    <i className="fas fa-check-double"></i> Lưu thay đổi
                  </Button>
                </div>
                <div className="col-12 mt-1">
                  <div className="table-responsive">
                    <table className="table table-bordered table-sm table-hover m-w-tabble">
                      <caption></caption>
                      <thead>
                        <tr className="m-header-table">
                          <th className="text-center align-middle">Step Id</th>
                          <th className="text-center align-middle">
                            Step Name
                          </th>
                          <th className="text-center align-middle">Vai trò</th>
                          <th className="text-center align-middle">
                            Hoàn thành
                          </th>
                          <th className="text-center align-middle">
                            Hành động
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(!listStep || listStep.length <= 0) && (
                          <tr>
                            <td className="text-center align-middle" colSpan="8">
                              Không có dữ liệu
                            </td>
                          </tr>
                        )}
                        {listStep?.map((item, i) => {
                          return (
                            <tr key={item?.id}>
                              <td className="align-middle">{item?.stepId}</td>
                              <td className="align-middle">{item?.stepName}</td>
                              <td className="align-middle" style={{ maxWidth: 150 + "px" }}>

                                <SelectComponent
                                  notFirstDefault
                                  name={"item?.role"}
                                  isMulti="true"
                                  list={listRole}
                                  bindLabel={"name"}
                                  bindValue={"code"}
                                  defaultValue={item?.role?.split(",")}
                                  onChange={(values) => {
                                    const roleCodes = values?.map(x => x.code);
                                    item.role = roleCodes;
                                  }}
                                >

                                </SelectComponent>
                              </td>
                              <td className="align-middle text-center">
                                <div className="custom-control custom-checkbox text-center align-middle">
                                  <input className="custom-control-input m-cursor" id={item?.id}
                                    type="checkbox"
                                    onChange={(event) => {
                                      item.stepBeforeEnd = event.target.checked;
                                    }}
                                    defaultChecked={item?.stepBeforeEnd}
                                  />
                                  <label className="custom-control-label m-cursor" htmlFor={item?.id}></label>
                                </div>
                              </td>
                              <td className="align-middle text-center">
                                <button onClick={() => saveConfigStep(item)} className="btn btn-success" type="button">
                                  <i className="fas fa-check"></i>
                                  <span className="text-button ml-1">Cập nhật</span>
                                </button>
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
          </div>

          <div className="row">
            <div className="col-10"></div>
            <div className="col-2">
              <button onClick={() => { passEntry(); }} className="btn btn-secondary float-right" type="button">
                <i className="fas fa-arrow-left"></i>
                <span className="text-button ml-1">Quay lại</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ConfigProcess;
