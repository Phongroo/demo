import React, {useEffect, useRef, useState} from "react";
import {Form} from "reactstrap";
import InputComponent from "../../../shared/component/input/InputComponent";
import WebViewer from "@pdftron/webviewer";
import {authUser} from "../../../helpers/authUtils";
import request from "../../../utils/request";
import {Toast, TypeToast} from "../../../utils/app.util";
import api from "../../../utils/api";

const FormManagementAction = (props) => {
    const viewer = useRef(null);
    const [loading, setLoading] = useState(false);

    const {item, backViewMain} = props

    // props @input
    const [urlId, setUrlId] = useState(props?.urlId || item?.id);
    const [hasOCR, setHasOCR] = useState(props?.hasOCR);
    const [isMonitor, setIsMonitor] = useState(props?.isMonitor);
    const [monitorCode, setMonitorCode] = useState(props?.monitorCode);

    //Core
    const [wvInstance, setWvInstance] = useState();
    const [coreControlsEvent, setCoreControlsEvent] = useState();
    const [documentViewer, setDocumentViewer] = useState();
    const [annotationManager, setAnnotationManager] = useState();

    //Form
    const [code, setCode] = useState(item?.code || '');
    const [name, setName] = useState(item?.name || '');
    const [note, setNote] = useState(item?.note || '');
    const [statusBool, setStatusBool] = useState(item?.status === 'Y' ? true : true);
    const [monitorBool, setMonitorBool] = useState(item?.monitor === 'Y' ? true : false);
    const [qrCodeBool, setQrCodeBool] = useState(item?.qrCode === 'Y' ? true : false);
    const [formData, setFormData] = useState();
    const [formDataPath, setFormDataPath] = useState();
    const [useAt, setUseAt] = useState();
    const [processConfigId, setProcessConfigId] = useState();
    const [submitFormId, setSubmitFormId] = useState();
    const [formioConfig, setFormioConfig] = useState(JSON.stringify([]));
    const [infoForm, setInfoForm] = useState({
        code,
        name,
        formData,
        formDataPath,
        note,
        useAt,
        processConfigId,
        statusBool,
        monitorBool,
        qrCodeBool,
        submitFormId,
        formioConfig
    });

    useEffect(() => {
        if (!urlId) {
            // urlId = this.route.snapshot.paramMap.get('id');
        }

        if (!hasOCR) {
            // this.hasOCR = this.route.snapshot?.data?.hasOCR;
        }

        if (isMonitor === null) {
            // this.isMonitor = this.route.snapshot?.data?.isMonitor;
        }

        if (!monitorCode) {
            // this.monitorCode = JSON.parse(<string>this.route.snapshot.queryParamMap.get('monitorCode'));
        }

    }, [])

    useEffect(() => {
        WebViewer(
            {
                fullAPI: true,
                path: '/webviewer/lib',
                licenseKey: 'demo:1691485569102:7c5e5d3c03000000009003ae0539eab860a9b148ae33bd2c420efad231',
                // initialDoc: 'https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf',
                initialDoc: ''
            },
            viewer.current,
        ).then((instance) => {
            const {documentViewer, annotationManager} = instance.Core;
            setWvInstance(instance);
            setDocumentViewer(documentViewer);
            setAnnotationManager(annotationManager);

            if (!item) {
                document.getElementById('file-picker').onchange = e => {
                    const file = (e.target).files[0];
                    if (file) {
                        console.log(file)
                        instance.UI.loadDocument(file);
                    }
                };

                // coreControlsEvent.emit(instance.UI.LayoutMode.Single);

            } else {
                request.post(api.GET_FORM_BY_USE_AT, {id: urlId}).then(res => {
                    if (res && res.data?.formData) {
                        instance.UI.loadDocument(res?.data.formData);
                    }
                }).catch(e => instance.UI.loadDocument(''))
            }

            // you can now call WebViewer APIs here...
        });
    }, []);

    useEffect(() => {
        const infoFormz = {
            code,
            name,
            formData,
            formDataPath,
            note,
            useAt,
            processConfigId,
            statusBool,
            monitorBool,
            qrCodeBool,
            submitFormId,
            formioConfig
        }

        setInfoForm(infoFormz)
    }, [
        code,
        name,
        formData,
        formDataPath,
        note,
        useAt,
        processConfigId,
        statusBool,
        monitorBool,
        qrCodeBool,
        submitFormId,
        formioConfig
    ]);


    const saveFormInfo = async () => {
        // this.isSubmit = true;

        console.log('saveFormInfo 0', documentViewer)
        console.log('saveFormInfo 1', annotationManager)
        const doc = documentViewer?.getDocument();
        const xfdfString = await annotationManager?.exportAnnotations();
        const data = await doc?.getFileData({
            xfdfString
        });
        const arr = new Uint8Array(data);
        const blob = new Blob([arr], {type: 'application/pdf'});
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = () => {
            const base64data = reader.result;
            // console.log(base64data);
            setFormData(base64data);
            // todo call backend

            const formFieldList: any = [];
            documentViewer?.getAnnotationsLoadedPromise().then(() => {
                const fieldManager = annotationManager?.getFieldManager();

                let index = 0;
                fieldManager.forEachField(field => {
                    console.log(field, field?.SZ, field.getFieldType(), field.getValue())
                    formFieldList.push({
                        fieldName: field?.SZ,
                        fieldType: field.getFieldType(),
                        fieldIndex: index,
                        fieldDefaultValue: field.getValue()
                    })

                    index++
                });

                const payload = {
                    ...infoForm,
                    language: 'vi',
                    creater: authUser().id,
                    status: statusBool ? 'Y' : 'N',
                    monitor: monitorBool ? 'Y' : 'N',
                    qrCode: qrCodeBool ? 'Y' : 'N',
                    formFieldList,
                    formData: base64data
                }

                console.log('payload', payload)

                if (item?.id) {
                    updateForm(payload);
                } else {
                    payload.formioConfig = payload?.formioConfig?.toString()
                    request.post(api.CREATE_FORM, payload).then(res => {
                        notify(res);
                    })
                }
            });
        };
    }

    const updateForm = (payload) => {
        if (!payload) {
            payload = {
                ...infoForm,
                status: statusBool ? 'Y' : 'N',
                monitor: monitorBool ? 'Y' : 'N',
                qrCode: qrCodeBool ? 'Y' : 'N',
            }
        }

        payload.code = item?.code
        payload.id = item?.id
        request.post(api.UPDATE_FORM, payload).then(res => {
            if (res && res.data) {
                setUseAt('');
                setProcessConfigId('');
            }
            notify(res);
        })
    }

    const notify = (res: any) => {
        // tslint:disable-next-line:triple-equals
        if (res.errorCode == '0') {
            Toast(res?.errorDesc, TypeToast.SUCCESS)
            backViewMain();
            // this.passEntry.emit(res);
            // this.reset();
        }
        // else if (res.errorCode == '-1') {
        //     this.toastService.error(getTranslateApp(res.errorDesc, this.translateService),
        //         getTranslateApp('COMPLAINT.thong_bao', this.translateService));
        // } else if (res.errorCode == '-2') {
        //     this.f['name'].setErrors({'tontai': true})
        //     this.toastService.error(getTranslateApp(res.errorDesc, this.translateService),
        //         getTranslateApp('COMPLAINT.thong_bao', this.translateService));
        // } else if (res.errorCode == '-3') {
        //     this.f['code'].setErrors({'tontai': true})
        //     this.toastService.error(getTranslateApp(res.errorDesc, this.translateService),
        //         getTranslateApp('COMPLAINT.thong_bao', this.translateService));
        // } else if (res.errorCode == '-4') {
        //     this.f['nameEn'].setErrors({'tontai': true})
        //     this.toastService.error(getTranslateApp(res.errorDesc, this.translateService),
        //         getTranslateApp('COMPLAINT.thong_bao', this.translateService));
        // } else {
        //     this.toastService.error('Create failed', '');
        // }
        setLoading(false)
    }


    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12 card-box">
                    <div class="col-12 border-bottom-dotted p-0 mb-2">
                        <span
                            class="font-weight-medium theme-color">{item ? "Thông tin cập nhật biểu mẫu" : "Thông tin tạo biểu mẫu"}</span>
                    </div>

                    <div class="row pl-2 pb-2">
                        <button onClick={() => saveFormInfo()} class="btn btn-primary">
                            <em class="fas fa-save mr-1"></em>{item?.id ? 'Cập nhật' : 'Lưu'}
                        </button>
                        <button onClick={() => backViewMain()} class="btn btn-secondary ml-1">
                            <em class="fas fa-angle-left mr-1"></em>Quay lại
                        </button>
                    </div>

                    <Form>
                        <div className="row">
                            <div className="col-6">
                                <InputComponent title={"Mã biểu mẫu"} name="code" value={code}
                                                onChange={(val) => setCode(val)}></InputComponent>
                            </div>

                            <div className="col-6">
                                <InputComponent title={"Tên biểu mẫu"} name="name" value={name}
                                                onChange={(val) => setName(val)}></InputComponent>
                            </div>

                            <div className="col-12">
                                <InputComponent title={"Ghi chú"} name="note" value={note}
                                                onChange={(val) => setNote(val)}></InputComponent>
                            </div>

                            <div class="col-12 mt-1">
                                <div class="row">
                                    <div class="col-4">
                                        <div class="form-check">
                                            <input className="form-check-input"
                                                   onChange={(event) => {
                                                       setStatusBool(event?.target.checked)
                                                   }}
                                                   checked={statusBool}
                                                // value={statusBool}
                                                // defaultChecked={false}
                                                   type="checkbox"/>
                                            <label className="form-check-label">
                                                Hoạt động
                                            </label>
                                        </div>
                                    </div>

                                    <div class="col-4">
                                        <div class="form-check">
                                            <input className="form-check-input"
                                                   checked={monitorBool}
                                                   onChange={(event) => {
                                                       setMonitorBool(event?.target.checked)
                                                   }}
                                                // value={monitorBool}
                                                // defaultChecked={false}
                                                   type="checkbox"/>
                                            <label className="form-check-label">
                                                Monitor
                                            </label>
                                        </div>
                                    </div>
                                    <div class="col-4">
                                        <div class="form-check">
                                            <input className="form-check-input"
                                                   checked={qrCodeBool}
                                                   onChange={(event) => {
                                                       setQrCodeBool(event?.target.checked)
                                                   }}
                                                // value={qrCodeBool}
                                                // defaultChecked={false}
                                                   type="checkbox"/>
                                            <label className="form-check-label">
                                                QR Code
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Form>

                    <div class="input-group-append my-2">
                        {/*<label htmlFor="upload">*/}
                        {/*     <span className="btn-upload-file">*/}
                        {/*        <i className="fas fa-cloud-upload-alt mr-1"></i>Chọn tệp tin*/}
                        {/*     </span>*/}
                        {/*    <input*/}
                        {/*        onClick={($event) => $event.target.value = null}*/}
                        {/*        type="file"*/}
                        {/*        style={{display: "none"}}*/}
                        {/*        id="file-picker"*/}
                        {/*    />*/}
                        {/*</label>*/}

                        <label>
                            <span class="btn-upload-file"><i className="fas fa-cloud-upload-alt mr-1"></i>Chọn tệp tin</span>
                            <input onClick={($event) => $event.target.value = null} id="file-picker"
                                   style={{display: 'none'}} type="file"/>
                        </label>
                    </div>


                    <div className="mt-3">
                        <div className="webviewer" ref={viewer} style={{height: "100vh"}}></div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default FormManagementAction;
