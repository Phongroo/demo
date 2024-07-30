import React, { useEffect, useState } from 'react'
import { authUser } from '../../../../helpers/authUtils';
import { Toast, TypeToast } from '../../../../utils/app.util';
import request from '../../../../utils/request';
import api from '../../../../utils/api';
import { Form } from 'reactstrap';
import InputComponent from '../../../../shared/component/input/InputComponent';
import SelectComponent from '../../../../shared/component/select/SelectComponent';
import { HexColorInput, HexColorPicker } from 'react-colorful';

const ConfigColorManagementAction = (props) => {
    const { passEntry, item } = props;


    //form
    const [formValue, setFormValue] = useState();
    const [code, setCode] = useState("#ffffff");
    const [period, setPeriod] = useState(0);
    const [periodTo, setPeriodTo] = useState(0);

    const [status, setStatus] = useState('Y');
    const creator = authUser().id;
    const [loading, setLoading] = useState(false);
    const [color, setColor] = useState("#ffffff");
    const listStatus = [{
        "code": "Y", "name": "Hoạt động"
    },
    {
        "code": "N", "name": "Không hoạt động"
    }]

    useEffect(() => {
        if (item) {
            setCode(item?.code);
            setPeriod(item?.period);
            setStatus(item?.status);
            setPeriodTo(item?.periodTo)
        }
    }, []);

    // initForm
    useEffect(() => {
        const formValue = {
            code,
            period,
            periodTo,
            creator,
            status
        };

        setFormValue(formValue);
    }, [code, period,periodTo]);


    const onSubmit = (form) => {
        if (!code || periodTo <= 0 ||!status) {
            Toast("Vui lòng nhập các trường bắt buộc(*)", TypeToast.WARNING);
            return;
        }
        if (period > periodTo ) {
            Toast("Vui lòng nhập thời gian đến lớn hơn thời gian từ", TypeToast.WARNING);
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
            creator,
            status,
        };
        console.log(json);
        request
            .post(api.CREATE_CONFIG_COLOR, json)
            .then((res) => {
                setLoading(false);
                if (res.errorCode === "OK") {
                    Toast(res.errorDesc, TypeToast.SUCCESS);
                    passEntry();
                } else if (res.errorCode === "1") {
                    Toast(res.errorDesc, TypeToast.ERROR);
                } else {
                    Toast("Tạo mới thất bại", TypeToast.ERROR);
                }
            })
            .catch((err) => setLoading(false));
    }

    function update(form) {
        setLoading(true);
        const json = {
            id: item.id,
            ...form,
            creator,
            status,
        };
        request
            .post(api.UPDATE_CONFIG_COLOR, json)
            .then((res) => {
                setLoading(false);
                if (res.errorCode === "OK") {
                    Toast(res.errorDesc, TypeToast.SUCCESS);
                    passEntry();
                } else if (res.errorCode === "1") {
                    Toast(res.errorDesc, TypeToast.ERROR);
                }else {
                    Toast("Cập nhật thất bại", TypeToast.ERROR);
                }
            })
            .catch((err) => setLoading(false));
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12 card-box">
                    <div class="col-12 border-bottom-dotted p-0 mb-2">
                        <span class="font-weight-medium theme-color">{item ? "Thông tin cập nhật menu" : "Thông tin tạo menu"}</span>
                    </div>
                    <Form>
                        <div className="row">
                            <div className="col-4">
                                <InputComponent required title={"Mã màu"} name="code" value={code} onChange={(val) => {
                                    (!val.includes('#') || val.length > 7) ? setCode('#FFFFFF') : setCode(val)

                                }}></InputComponent>
                                <HexColorPicker color={code} onChange={setCode} />
                            </div>
                            <div className="col-4">
                                <InputComponent
                                    required
                                    title={"Khoảng thời gian từ (giờ)"}
                                    name="period" value={period} type='number'
                                    onChange={(val) => {
                                        val < 0 ? setPeriod(0) : setPeriod(val);
                                    }}>

                                </InputComponent>
                            </div>

                            <div className="col-4">
                                <InputComponent
                                    required
                                    title={"Khoảng thời gian đến (giờ)"}
                                    name="periodTo" value={periodTo} type='number'
                                    onChange={(val) => {
                                        val < 0 ? setPeriodTo(0) : setPeriodTo(val);
                                    }}>

                                </InputComponent>
                            </div>


                            <div className="col-4">
                                <SelectComponent
                                    notFirstDefault
                                    name={"status"}
                                    title={"Trạng thái"}
                                    list={listStatus}
                                    bindLabel={"name"}
                                    bindValue={"code"}
                                    value={status}
                                    onChange={(val) => {

                                        setStatus(val?.value);
                                    }}></SelectComponent>
                            </div>


                        </div>

                        <div className="row">
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
    )
}

export default ConfigColorManagementAction
