import {Button, Form, Input} from "reactstrap";
import InputComponent from "../../../shared/component/input/InputComponent";
import {useEffect, useState} from "react";
import SelectComponent from "../../../shared/component/select/SelectComponent";
import Select, {components} from "react-select";
import request from "../../../utils/request";
import api from "../../../utils/api";
import {listCardField, listKHDNField} from "./ListField";
import {Toast, TypeToast} from "../../../utils/app.util";

const FormAPIConfig = (props) => {
    // props @input
    const [item, setItem] = useState(props?.item || {});
    const [apiList, setApiList] = useState(() => {
            return props?.item?.id === '26516eea-e1da-11ee-9224-e7b7048a84c7' ?
                listKHDNField?.map(x => {
                    return {
                        value: x,
                        label: x
                    }
                }) :
                listCardField?.map(x => {
                    return {
                        value: x,
                        label: x
                    }
                })
        }
    );
    const [listField, setListField] = useState([]);
    const [selectedApis, setSelectedApis] = useState({});


    const regexList = [
        {
            label: "Email",
            value: "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
        },
        {
            label: "Số điện thoại",
            value: "(84|0[3|5|7|8|9])+([0-9]{8})\\b",
        },
    ];
    useEffect(() => {
        // 'd7dbd2b2-352e-11ee-98fd-cb35cc4414a6'
        console.log('item', item)
        getApiManagement();
        setItem(props?.item);
        setListField(props?.item?.formFieldList);
    }, []);

    function getApiManagement() {
        // request.post(api.API_MANAGEMENT_PAGING, {}).then((res) => {
        //     if (res?.data) {
        //         const arrTemp = res.data;
        //         const apiListTemp = [];
        //         arrTemp.forEach((element) => {
        //             const arrApiFields = JSON.parse(JSON.stringify(element?.apiFields));
        //             const apiFields = [];
        //             arrApiFields.forEach((el) => {
        //                 apiFields.push({
        //                     ...el,
        //                     label: el?.resFieldName,
        //                     value: el?.id,
        //                 });
        //             });
        //             apiListTemp.push({
        //                 label: element?.name,
        //                 value: element?.id,
        //                 apiFields: apiFields,
        //             });
        //         });
        //         setApiList(apiListTemp);
        //     }
        // });
    }

    const changeValue = (item, i, field, value) => {
        const itemTemp = JSON.parse(JSON.stringify(item));
        itemTemp[field] = value || "";
        const listFieldTemp = JSON.parse(JSON.stringify(listField));
        listFieldTemp[i] = itemTemp;

        console.log('changeValue itemTemp', itemTemp)
        console.log('changeValue listFieldTemp', listFieldTemp)
        setListField(listFieldTemp);
        // console.log("selectedApis", selectedApis,;
    }

    return (
        <>
            <div className="container-fluid">
                <div className="card-box mt-2">
                    <div className="row mb-3">
                        <div className="col-12 text-right">
                            <Button color="primary" onClick={() => {
                                console.log('listField', listField)
                                console.log('apiList', apiList)

                                const payload = {
                                    listFieldConfig: listField,
                                    submitFormId: "",
                                    formioConfig: JSON.stringify([])
                                }

                                request.post(api.UPDATE_MULTI_FORM_FIELD_CONFIG, payload).then(res => {
                                    if (res?.errorCode === 'OK') {
                                        Toast(res?.errorDesc, TypeToast.SUCCESS)
                                        props?.passEntry()
                                    } else {
                                        Toast(res?.errorDesc, TypeToast.ERROR)
                                    }

                                }).catch(err => Toast(err, TypeToast.ERROR))
                            }}>
                                Lưu
                            </Button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 border-bottom-dotted pb-0 p-0">
                            <span className="font-weight-medium theme-color">
                              Danh sách các trường
                            </span>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-bordered table-sm table-hover m-w-tabble">
                                <thead>
                                <tr className="m-header-table">
                                    <th className="text-center align-middle mw-100">
                                        Tên trường
                                    </th>
                                    <th className="text-center align-middle mw-100">
                                        Loại trường
                                    </th>
                                    {/*<th className="text-center align-middle mw-50">bắt buộc</th>*/}
                                    {/*<th className="text-center align-middle mw-200">*/}
                                    {/*    Ràng buộc*/}
                                    {/*</th>*/}
                                    <th className="text-center align-middle mw-300">
                                        Cấu hình api
                                    </th>
                                    {/*<th className="text-center align-middle mw-250">*/}
                                    {/*    Thuộc tính API*/}
                                    {/*</th>*/}
                                    {/*<th className="text-center align-middle mw-50">Thao tác</th>*/}
                                </tr>
                                </thead>
                                <tbody>
                                {(!listField || listField?.length <= 0) && (
                                    <tr>
                                        <td className="text-center align-middle" colSpan="7">
                                            Không có dữ liệu
                                        </td>
                                    </tr>
                                )}
                                {listField?.filter(x => {
                                    return x
                                })?.map((itemFormField, i) => {
                                    return (
                                        <tr key={itemFormField?.id}>
                                            <td className="align-middle">
                                                <span>{itemFormField?.fieldName}</span>
                                            </td>
                                            <td className="align-middle">
                                                {itemFormField?.fieldType}
                                            </td>
                                            {/*<td className="align-middle text-center">*/}
                                            {/*    <div className="form-check align-items-center mb-3">*/}
                                            {/*        <input*/}
                                            {/*            type="checkbox"*/}
                                            {/*            className="form-check-input"*/}
                                            {/*            id={itemFormField?.id}*/}
                                            {/*            defaultChecked={itemFormField.required}*/}
                                            {/*            onClick={(val) => {*/}
                                            {/*                itemFormField.required = val?.target?.checked;*/}
                                            {/*            }}*/}
                                            {/*        />*/}
                                            {/*    </div>*/}
                                            {/*</td>*/}
                                            {/*<td className="align-middle">*/}
                                            {/*    <Select*/}
                                            {/*        id={i}*/}
                                            {/*        placeholder="Chọn ràng buộc"*/}
                                            {/*        isClearable={true}*/}
                                            {/*        options={regexList}*/}
                                            {/*        defaultValue={itemFormField?.regex}*/}
                                            {/*        onChange={(val) => {*/}
                                            {/*            const listFieldTemp = JSON.parse(*/}
                                            {/*                JSON.stringify(listField)*/}
                                            {/*            );*/}
                                            {/*            listFieldTemp[i].regex = val?.value || "";*/}
                                            {/*            setListField(listFieldTemp);*/}
                                            {/*        }}*/}
                                            {/*    ></Select>*/}
                                            {/*</td>*/}
                                            <td className="align-middle">
                                                <Select
                                                    id={`regex_${i}`}
                                                    placeholder={itemFormField?.regex || "Chọn trường"}
                                                    isClearable={true}
                                                    options={apiList}
                                                    defaultValue={itemFormField?.regex}
                                                    // defaultValue={apiList.find(x => x?.value === itemFormField?.requestApiId) || ''}
                                                    onChange={(val) => {
                                                        console.log('changeValue val', val)
                                                        changeValue(itemFormField, i, 'regex', val?.value)
                                                        setSelectedApis({...selectedApis, [i]: val});
                                                    }}
                                                ></Select>
                                            </td>
                                            {/*<td className="align-middle">*/}
                                            {/*    <Select*/}
                                            {/*        id={`apiFieldValue_${i}`}*/}
                                            {/*        placeholder="Value"*/}
                                            {/*        isClearable={true}*/}
                                            {/*        options={selectedApis[i] ? selectedApis[i].apiFields : []}*/}
                                            {/*        // defaultValue={item.apiFieldValue || ""}*/}
                                            {/*        defaultValue={item.apiFieldValue || ""}*/}
                                            {/*        onChange={(val) => {*/}
                                            {/*            changeValue(itemFormField, i, 'apiFieldValue', val?.value)*/}
                                            {/*        }}*/}

                                            {/*    ></Select>*/}
                                            {/*    {itemFormField?.fieldType === "ComboBoxFormField" && (*/}
                                            {/*        <Select*/}
                                            {/*            className='mt-2'*/}
                                            {/*            id={`apiFieldLabel_${i}`}*/}
                                            {/*            placeholder="Mapping Label"*/}
                                            {/*            isClearable={true}*/}
                                            {/*            options={selectedApis[i] ? selectedApis[i].apiFields : []}*/}
                                            {/*            defaultValue={item.apiFieldLabel || ""}*/}
                                            {/*            onChange={(val) => {*/}
                                            {/*                changeValue(itemFormField, i, 'apiFieldLabel', val?.id)*/}
                                            {/*            }}*/}
                                            {/*        ></Select>*/}
                                            {/*    )*/}
                                            {/*    }*/}
                                            {/*</td>*/}
                                            {/*<td className="align-middle text-center">*/}
                                            {/*    <i*/}
                                            {/*        className="fas fa-code fa-lg m-cursor"*/}
                                            {/*        hidden={itemFormField?.requestApiId}*/}
                                            {/*    ></i>*/}
                                            {/*</td>*/}
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

export default FormAPIConfig;
