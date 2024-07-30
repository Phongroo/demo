import React, {useEffect, useState} from "react";
import Pagetitle from "../../../shared/ui/page-title/Pagetitle";
import FormManagementAction from "./FormManagementAction";
import {
    Button,
    Form,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
} from "reactstrap";
import InputComponent from "../../../shared/component/input/InputComponent";
import SelectComponent from "../../../shared/component/select/SelectComponent";
import {checkPermission} from "../../../utils/app.util";
import {CREATE} from "../../../constants/permissionTypes";
import request from "../../../utils/request";
import api from "../../../utils/api";
import moment from "moment";
import Switch from "react-switch";
import Pagination from "react-js-pagination";
import {Link} from "react-router-dom";
import PDFForm from "./PDFForm";
import FormAPIConfig from "./FormAPIConfig";

const FormManagement = (props) => {
    const breadcrumbItems = [
        {label: "Home page", path: "/NWF/home-page"},
        {label: "FormManagement", path: "/NWF/FormManagement", active: true},
    ];

    const [mode, setMode] = useState("TABLE");
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [code, setCode] = useState();
    const [name, setName] = useState();
    const [status, setStatus] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [item, setItem] = useState();
    const [searchForm, setSearchForm] = useState();
    const [listForm, setListForm] = useState();
    const [loading, setLoading] = useState(false);
    const [totalRecord, setTotalRecord] = useState(0);
    const [checked1, setChecked1] = useState(false);
    const [checked2, setChecked2] = useState(false);
    const [checked3, setChecked3] = useState(false);

    const [modalPDF, setModalPDF] = useState(false);
    const [modalFormAPI, setModalFormAPI] = useState(false);
    const toggleModalPDF = () => setModalPDF(!modalPDF);
    const toggleModalFormAPI = () => setModalFormAPI(!modalFormAPI);

    const handleChange1 = (checked1) => {
        setChecked1(checked1);
    };
    const handleChange2 = (checked2) => {
        setChecked2(checked2);
    };
    const handleChange3 = (checked3) => {
        setChecked3(checked3);
    };

    useEffect(() => {
        const searchForm = {
            code,
            status,
            name,
        };

        setSearchForm(searchForm);
    }, [code, status, name]);

    useEffect(() => {
        getPaging();
    }, []);

    function onAction(item = null) {
        console.log("onAction", item);
        setMode("ACTION");
        setItem(item);
    }

    function openFormAPIConfig(item) {

    }

    const initForm = (isReset = false) => {
        const form = {
            ...searchForm,
        };

        if (isReset) {
            setCode("");
            setStatus("");

            form.code = "";
            form.status = "";
        }

        search(form);
    };

    const search = (form) => {
        setLimit(10);
        setPage(1);
        getPaging(1, 10, form);
    };

    function onPageChange(pageNum) {
        setPage(pageNum);
        getPaging(pageNum, limit);
    }

    const getPaging = (pageNum = page, pageSize = limit) => {
        setLoading(true);

        const json = {
            page: pageNum,
            limit: pageSize,
        };

        request
            .post(api.GET_FORM_MANAGEMENT, json)
            .then((res) => {
                if (res) {
                    setLoading(false);
                    setListForm(res.data);
                    setTotalRecord(res.totalRecord);
                } else {
                    setListForm([]);
                    setTotalRecord(0);
                }
            })
            .catch((err) => setLoading(false));
    };

    const openModal = (item) => {
        setItem(item);
        toggleModalPDF();
    };

    const openModalAPiConfig = (item) => {
        setItem(item);
        toggleModalFormAPI();
    };

    // const viewFormFieldListItem(item: any) {
    //      if (item) {
    //          console.log('viewFormFieldListItem', item)
    //          this.f.formioConfig.setValue(item?.formioConfig ? JSON.parse(item?.formioConfig) : [])
    //          this.submitAPI = item?.submitFormId;
    //
    //          this.apiManagementService.paging({}).subscribe(res => {
    //              if (res.data) {
    //                  this.listAPIFormField = res.data.filter(el => el.endpointType === 'FORM_FIELD');
    //                  this.listAPISubmitData = res.data.filter(el => el.endpointType === 'SUBMIT_FORM');
    //
    //                  // Danh sách API config
    //                  this.formFieldListItem = item?.formFieldList;
    //
    //                  // Mapping thông tin hiện tại
    //                  this.formFieldListItem.map(el => {
    //                      if (el?.requestApiId) {
    //                          const api = this.listAPIFormField.find(el_2 => el_2?.id === el?.requestApiId);
    //                          el.apiFields = api?.apiFields || [];
    //                      }
    //                  })
    //                  this.modalService.open(this.viewFormFieldList, {centered: true, size: 'xl', backdrop: 'static'});
    //              }
    //          });
    //      }
    //  }

    return (
        <div className="container-fluid">
            <Pagetitle
                breadcrumbItems={breadcrumbItems}
                title={"Quản lý biểu mẫu"}
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
                                                title={"Mã biểu mẫu"}
                                                name="code"
                                                value={code}
                                                onChange={(val) => setCode(val)}
                                            ></InputComponent>
                                        </div>
                                        <div className="col-4">
                                            <InputComponent
                                                title={"Tên biểu mẫu"}
                                                name="name"
                                                value={name}
                                                onChange={(val) => setName(val)}
                                            ></InputComponent>
                                        </div>
                                        <div className="col-4">
                                            <SelectComponent
                                                notFirstDefault
                                                name={"status"}
                                                title={"Trạng thái"}
                                                list={[
                                                    {value: "", name: "Tất cả", nameEn: "All"},
                                                    {value: "Y", name: "Hoạt động", nameEn: "Actice"},
                                                    {
                                                        value: "N",
                                                        name: "Không hoạt động",
                                                        nameEn: "Inactive",
                                                    },
                                                ]}
                                                bindLabel={"name"}
                                                bindValue={"value"}
                                                value={status}
                                                onChange={(val) => {
                                                    setStatus(val?.value);
                                                }}
                                            ></SelectComponent>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-6">
                                            <button
                                                disabled={!checkPermission(CREATE)}
                                                onClick={() => {
                                                    onAction();
                                                }}
                                                className="btn btn-primary"
                                                type="button"
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
                Danh sách biểu mẫu
              </span>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-bordered table-sm table-hover m-w-tabble">
                                <thead>
                                <tr className="m-header-table">
                                    <th className="text-center align-middle mw-200">Tên mẫu</th>
                                    <th className="text-center align-middle mw-250">URL</th>
                                    <th className="text-center align-middle mw-150">
                                        Quy trình
                                    </th>
                                    <th className="text-center align-middle mw-50">
                                        Người tạo
                                    </th>
                                    <th className="text-center align-middle mw-50">Ngày tạo</th>
                                    <th className="text-center align-middle mw-50">
                                        Trạng thái
                                    </th>
                                    <th className="text-center align-middle mw-50">Monitor</th>
                                    <th className="text-center align-middle mw-50">QR Code</th>
                                    <th className="text-center align-middle mw-50">Thao tác</th>
                                </tr>
                                </thead>

                                <tbody>
                                {(!listForm || listForm.length <= 0) && (
                                    <tr>
                                        <td className="text-center align-middle" colSpan="10">
                                            Không có dữ liệu
                                        </td>
                                    </tr>
                                )}

                                {listForm?.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td className="align-middle">
                          <span
                              onClick={() => openModal(item)}
                              className="text-primary m-cursor"
                          >
                            {item?.name}
                          </span>
                                            </td>
                                            <td className="align-middle">
                                                <Link
                                                    className={"text-success"}
                                                    to={"/smart-form-public/" + item?.id}
                                                    target="_blank"
                                                >
                                                    {"/smart-form-public/"}
                                                    {item?.id}
                                                </Link>
                                            </td>
                                            <td className="align-middle">
                          <span>
                            <i class="fas fa-cogs fa-lg m-cursor text-danger mr-1"></i>
                          </span>
                                            </td>
                                            <td className="align-middle">
                                                <span>{item?.createrName}</span>
                                            </td>
                                            <td className="align-middle">
                          <span>
                            {item?.createDate
                                ? moment(item?.createDate).format("DD/MM/yyyy")
                                : ""}
                          </span>
                                            </td>
                                            <td className="align-middle text-center">
                                                <Switch
                                                    disabled
                                                    onChange={handleChange1}
                                                    checked={item?.status === "Y"}
                                                    height={20}
                                                    width={40}
                                                />
                                            </td>
                                            <td className="align-middle text-center">
                                                <Switch
                                                    disabled
                                                    onChange={handleChange2}
                                                    checked={item?.monitor === "Y"}
                                                    height={20}
                                                    width={40}
                                                />
                                            </td>
                                            <td className="align-middle text-center">
                                                <Switch
                                                    disabled
                                                    onChange={handleChange3}
                                                    checked={item?.qrCode === "Y"}
                                                    height={20}
                                                    width={40}
                                                />
                                            </td>
                                            <td className="align-middle text-center">
                          <span onClick={() => onAction(item)}>
                            <i class="fas fa-edit fa-lg m-cursor mr-1 text-primary"></i>
                          </span>

                                                <i class="fas fa-cog fa-lg m-cursor text-primary mr-1"
                                                   onClick={() => openModalAPiConfig(item)}></i>
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
                <FormManagementAction
                    item={item}
                    saveFormInfo={() => console.log("saveFormInfo")}
                    backViewMain={() => {
                        initForm(true);
                        setMode("TABLE");
                    }}
                ></FormManagementAction>
            )}

            <div>
                <Modal
                    isOpen={modalPDF}
                    toggle={toggleModalPDF}
                    centered
                    className={"modal-xlx"}
                    style={{height: window.outerHeight * (118 / 100)}}
                >
                    <ModalHeader toggle={toggleModalPDF}>Thông tin chi tiết</ModalHeader>
                    <ModalBody className="p-0">
                        <PDFForm
                            hideButtonSendInfo={true}
                            formIndex={item}
                            urlId={item?.id}
                            hidden={false}
                            formFieldList={item?.formFieldList}
                            viewTemplateOnly
                        ></PDFForm>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={toggleModalPDF}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>

            <div>
                <Modal
                    isOpen={modalFormAPI}
                    toggle={toggleModalFormAPI}
                    size={"xlxx"}
                    centered={true}
                    scrollable={true}
                    //   style={{ height: window.outerHeight * (118 / 100) }}
                >
                    <ModalHeader toggle={toggleModalFormAPI}>
                        Thông tin chi tiết {item?.name}
                    </ModalHeader>
                    <ModalBody className="p-0">
                        <FormAPIConfig item={item} passEntry={() => {
                            initForm(true)
                            toggleModalFormAPI()
                        }}></FormAPIConfig>
                    </ModalBody>
                    {/*<ModalFooter>*/}
                    {/*  <Button color="secondary" onClick={toggleModalFormAPI}>*/}
                    {/*    Cancel*/}
                    {/*  </Button>*/}
                    {/*</ModalFooter>*/}
                </Modal>
            </div>
        </div>
    );
};

export default FormManagement;
