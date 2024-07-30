import React, { useEffect, useState } from 'react'
import request from '../../../../utils/request';
import api from '../../../../utils/api';
import { Toast, TypeToast, checkPermission } from '../../../../utils/app.util';
import Pagetitle from '../../../../shared/ui/page-title/Pagetitle';
import { Form } from 'reactstrap';
import InputComponent from '../../../../shared/component/input/InputComponent';
import SelectComponent from '../../../../shared/component/select/SelectComponent';
import { CREATE, UPDATE } from '../../../../constants/permissionTypes';
import ConfigColorManagementAction from './ConfigColorManagementAction';

const ConfigColorManagement = () => {

  const breadcrumbItems = [
    { label: "Home page", path: "/home-page" },
    { label: "Cấu hình màu sắc", path: "/category/config-color", active: true },
  ];

  const [isCollapsed, setIsCollapsed] = useState(true);
  const [mode, setMode] = useState("TABLE");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [list, setList] = useState([]);



  const [item, setItem] = useState();

  // form
  const [code, setCode] = useState('');
  const [status, setStatus] = useState("ALL");

  const [searchForm, setSearchForm] = useState({
    code,
    status,
  });

  const language = "vi";

  useEffect(() => {
    initForm();
  }, []);

  useEffect(() => {
    const searchForm = {
        code,
        status
    };

    setSearchForm(searchForm);
}, [code, status]);

  const initForm = (isReset = false) => {
    const form = {
      ...searchForm,
    };

    if (isReset) {
      setCode("");
      setStatus("ALL");
      form.code = null;
      form.status = "ALL";
    }

    search(form);
  };

  const search = (form) => {
    setLimit(10);
    setPage(1);
    getAllByCondition(1, 10, form);
  };

  function onUpdate(item) {
    setMode("ACTION");
    setItem(item);
}

  const getAllByCondition = (pageNum = page, pageSize = limit, values) => {
    setLoading(true);
    console.log(values);

    const json = {
        limit: pageSize,
        page: pageNum,
        code: values?.code,
        status: values?.status === "ALL" ? null : values?.status,
    };

    request.post(api.GET_LIST_CONFIG_COLOR, json).then((res) => {
        setLoading(false);
        if (res.errorCode === "0") {
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
            <Pagetitle breadcrumbItems={breadcrumbItems} title={"Quản lý menu"}></Pagetitle>
            {mode === "TABLE" ? (
                <div className="row">
                    <div className="col-12 card-box">
                        <fieldset>
                            <legend>
                                <a
                                    onClick={() => {
                                        setIsCollapsed(!isCollapsed);
                                    }}>
                                    Tìm kiếm thông tin
                                    <i aria-hidden="true"
                                       className={(isCollapsed ? "fas fa-minus" : "fas fa-plus") + " ml-1"}></i>
                                </a>
                            </legend>

                            {isCollapsed && (
                                <Form>
                                    <div className="row mb-2">
                                        <div className="col-4">
                                            <InputComponent title={"Mã màu"} name="code" value={code}
                                                            onChange={(val) => setCode(val)}></InputComponent>
                                        </div>

                                        <div className="col-4">
                                            <SelectComponent
                                                notFirstDefault
                                                name={"status"}
                                                title={"Trạng thái"}
                                                list={[
                                                    {value: "ALL", label: "Tất cả"},
                                                    {value: "Y", label: "Hoạt động"},
                                                    {value: "N", label: "Không hoạt động"},
                                                ]}
                                                bindLabel={"label"}
                                                bindValue={"value"}
                                                value={status}
                                                onChange={(val) => {
                                                  console.log(val);
                                                    setStatus(val?.value);
                                                }}></SelectComponent>
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
                                                type="button">
                                                <i className="fas fa-plus mr-1"></i>
                                                <span className="text-button">Tạo mới</span>
                                            </button>
                                        </div>
                                        <div className="col-6 text-right">
                                            <button onClick={() => initForm(true)} className="btn btn-secondary"
                                                    type="button">
                                                <i className="fas fa-undo-alt mr-1"></i>
                                                <span className="text-button">Làm mới</span>
                                            </button>
                                            <button onClick={() => search(searchForm)} className="btn btn-primary ml-1"
                                                    type="button">
                                                <i className="fas fa-search mr-1"></i>
                                                <span className="text-button">Tìm kiếm</span>
                                            </button>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </fieldset>

                        <div className="col-12 border-bottom-dotted pb-0 p-0 mb-2 mt-3">
                            <span className="font-weight-medium theme-color">Danh sách cấu hình màu sắc</span>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-bordered table-sm table-hover m-w-tabble">
                                <thead>
                                <tr className="m-header-table">
                                <th className="text-center align-middle"></th>
                                    <th className="text-center align-middle mw-200">Mã màu</th>
                                    <th className="text-center align-middle mw-200">Khoảng thời gian từ (giờ)</th>
                                    <th className="text-center align-middle mw-200">Khoảng thời gian đến (giờ)</th>
                                    <th className="text-center align-middle mw-100">Trạng thái</th>
                                    <th className="text-center align-middle mw-100">Thao tác</th>
                                </tr>
                                </thead>

                                <tbody>
                                {(!list || list.length <= 0) && (
                                    <tr>
                                        <td className="text-center align-middle" colSpan="4">
                                            Không có dữ liệu
                                        </td>
                                    </tr>
                                )}
                                {list?.map((item, i) => {
                                    return (
                                        <tr key={item?.id}>
                                            <td className='align-middle text-center'>
                                              <div className='w-100' style={{ height:20,backgroundColor: item?.code ? item?.code: '#ffffff'}}>

                                              </div>
                                            </td>
                                            <td className="align-middle">
                                                {item?.code}
                                            </td>
                                            <td className="align-middle">{item?.period}</td>
                                            <td className="align-middle">{item?.periodTo}</td>
                                            <td className="align-middle text-center">{item?.status === "Y" ? "Hoạt động" : "Không hoạt động"}</td>
                                            <td className="align-middle text-center">
													<span hidden={!checkPermission(UPDATE)}
                                                          onClick={() => onUpdate(item)} className="text-info m-cursor">
														<i className="fas fa-pencil-alt"></i>
													</span>
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>

                        {/* <div className="float-right">
                            <Pagination
                                itemClass="page-item"
                                linkClass="page-link"
                                activePage={page}
                                itemsCountPerPage={limit}
                                totalItemsCount={totalRecords}
                                pageRangeDisplayed={5}
                                onChange={(pageNum) => onPageChange(pageNum)}
                            />
                        </div> */}
                    </div>
                </div>
            ) : (
                <ConfigColorManagementAction
                    item={item}
                    passEntry={(res) => {
                        initForm(true);
                        //findAll();
                        setMode("TABLE");
                        setItem(null);
                    }}></ConfigColorManagementAction>
            )}
        </div>
  )
}

export default ConfigColorManagement