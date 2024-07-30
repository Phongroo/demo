import React, {useEffect, useState} from "react";
import {authUser} from "../../../../helpers/authUtils";
import {Toast, TypeToast} from "../../../../utils/app.util";
import request from "../../../../utils/request";
import api from "../../../../utils/api";
import {Form} from "reactstrap";
import InputComponent from "../../../../shared/component/input/InputComponent";
import SelectComponent from "../../../../shared/component/select/SelectComponent";

const ReceivingInterestAction = (props)=>{
    const { item,passEntry } = props;
    console.log(item);

    const [loading, setLoading] = useState(false);
    const [newitem, setNewitem] = useState();

    // form
    const [code, setCode] = useState();
    const [name, setName] = useState();
    const [nameEn, setNameEn] = useState();
    const [note, setNote] = useState();
    const [path, setPath] = useState();
    const creater = authUser().id;
    const createDate = new Date();
    const editer = authUser().id;
    const editDate = new Date();
    const [formValue, setFormValue] = useState();
    const [status, setStatus] = useState(true);
    const listStatus = [
        {label: 'Hoạt động', value: "Y"},
        { label: "Không hoạt động", value: "N" }]


    useEffect(() => {
        if (item) {
            setCode(item?.code);
            setName(item?.name);
            setNameEn(item?.nameEn);
            setStatus(item?.status);
            setNote(item?.note);
        }
    }, []);

    useEffect(() => {
        const formValue = {
            name,
            code,
            nameEn,
            status,
            note
        };

        setFormValue(formValue);
    }, [name, code, nameEn,status,note]);

    const onSubmit = (form) => {
        if (!code || !name) {
            Toast("Vui lòng nhập các trường bắt buộc(*)", TypeToast.WARNING);
            return;
        }

        if (item) {
            update(form);
        } else {
            create(form);
        }
    };

    function create(form) {
        setLoading(true);
        const json = {
            ...form,
            creater,
            createDate,
        };
        request
            .post(api.CREATE_RECEIVING_INTEREST, json)
            .then((res) => {
                setLoading(false);
                if (res.errorCode === "0") {
                    Toast(res.errorDesc, TypeToast.SUCCESS);
                    passEntry();
                } else if (res.errorCode === "-1") {
                    Toast(res.errorDesc, TypeToast.ERROR);
                } else {
                    Toast("Create failed", TypeToast.ERROR);
                }
            })
            .catch((err) => setLoading(false));
    }

    function update(form) {
        setLoading(true);
        const json = {
            id: item.id,
            ...form,
            editer,
            editDate,
        };

        console.log("json", json);
        request
            .post(api.UPDATE_RECEIVING_INTEREST, json)
            .then((res) => {
                setLoading(false);
                if (res.errorCode === "0") {
                    Toast("update success", TypeToast.SUCCESS);
                    passEntry();
                } else if (res.errorCode === "-1") {
                    Toast(res.errorDesc, TypeToast.ERROR);
                } else {
                    Toast("update failed", TypeToast.ERROR);
                }
            })
            .catch((err) => setLoading(false));
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12 card-box">
                    <div class="col-12 border-bottom-dotted p-0 mb-2">
                        <span class="font-weight-medium theme-color">{item ? "Thông tin cập nhật hình thức nhận lãi" : "Thông tin tạo mới hình thức nhận lãi"}</span>
                    </div>
                    <Form>
                        <div className="row">
                            <div className="col-4">
                                <InputComponent
                                    required
                                    disabled={item} // Adjusted the conditional statement
                                    title={"Mã"}
                                    name="code"
                                    value={code}
                                    onChange={(val) => setCode(val)}></InputComponent>
                            </div>

                            <div className="col-4">
                                <InputComponent required title={"Tên"} name="name" value={name} onChange={(val) => setName(val)}></InputComponent>
                            </div>
                            <div className="col-4">
                                <InputComponent required title={"Tên tiếng anh"} name="nameEn" value={nameEn} onChange={(val) => setNameEn(val)}></InputComponent>
                            </div>
                            <div className="col-4">
                                <SelectComponent
                                    notFirstDefault
                                    required
                                    name={"status"}
                                    title={"Trạng thái"}
                                    list={listStatus}
                                    bindLabel={"label"}
                                    bindValue={"value"}
                                    value={status}
                                    onChange={(val) => {
                                        setStatus(val?.value);
                                    }}></SelectComponent>
                            </div>
                            <div className="col-4">
                                <InputComponent required title={"Ghi chú"} name="note" value={note} onChange={(val) => setNote(val)}></InputComponent>
                            </div>

                            <div className="col-4 form-group pt-4 text-center">
                                {/* <InputComponent type="checkbox" class="custom-control-input" id="customSwitches" name="viewAll" label="Xem tất cả" value={viewAll} /> */}
                            </div>
                        </div>

                        <div className="row pt-4">
                            <div className="col-12 text-center">
                                <button
                                    onClick={() => {
                                        passEntry();
                                    }}
                                    className="btn btn-secondary"
                                    type="button">
                                    <i className="fas fa-undo-alt mr-1"></i>
                                    <span className="text-button">Quay lại</span>
                                </button>
                                <button onClick={() => onSubmit(formValue)} className="btn btn-primary ml-1" type="button">
                                    <i className={(item ? "fa-edit" : "fa-plus") + " fas mr-1"}></i>
                                    <span className="text-button">{item ? "Cập nhật" : "Tạo mới"}</span>
                                </button>
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};
export default ReceivingInterestAction;
