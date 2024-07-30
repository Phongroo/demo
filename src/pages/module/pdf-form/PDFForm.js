import WebViewer from '@pdftron/webviewer';
import React, {useEffect, useRef, useState} from 'react';
import {useParams} from "react-router-dom";
import request from "../../../utils/request";
import api from "../../../utils/api";
import {SOCKET_SERVICE} from "../../../utils/proxy";
import Swal from "sweetalert2";
import {Toast, TypeToast} from "../../../utils/app.util";
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {QRCodeCanvas} from "qrcode.react";
import "./PDFStyle.scss"

const isJSON = (str) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
};


const PDFForm = (props) => {
    const viewer = useRef(null);
    let {id} = useParams();

    const [loading, setLoading] = useState(false);

    // props @input
    const {hideButtonSendInfo, item} = props;
    const [formIndex, setFormIndex] = useState(props?.formIndex || {});
    const [isDownFile, setIsDownFile] = useState(props?.isDownFile || true);
    const [hidden, setHidden] = useState(props?.hidden || false);
    const [urlId, setUrlId] = useState(props?.urlId || id);
    const [hasOCR, setHasOCR] = useState(id ? true : props?.hasOCR);
    const [isMonitor, setIsMonitor] = useState(id ? true : props?.isMonitor);
    const [monitorCode, setMonitorCode] = useState(props?.monitorCode);
    const [formFieldList, setFormFieldList] = useState(props?.formFieldList || []);

    //Core
    const [wvInstanceState, setWvInstance] = useState();
    // const [coreControlsEvent, setCoreControlsEvent] = useState();
    const [documentViewerState, setDocumentViewer] = useState();
    const [annotationManagerState, setAnnotationManager] = useState();
    let wvInstance = {};
    let documentViewer = {};
    let annotationManager = {};

    //
    const [listAPI, setListAPI] = useState([]);
    const [formFieldListConfig, setFormFieldListConfig] = useState([]);
    const [fileStore, setFileStore] = useState([]);
    const [jsonInput, setJsonInput] = useState([]);

    const [channel, setChannel] = useState();
    const [innerHeight, setInnerHeight] = useState();
    const [isUpdate, setIsUpdate] = useState(false);
    const [infoByMonitorCode, setInfoByMonitorCode] = useState({});
    const [jsonValueUpdate, setJsonValueUpdate] = useState({});
    const [jsonValue, setJsonValue] = useState({});
    const [fileData, setFileData] = useState();
    const [submitTeller, setSubmitTeller] = useState();
    const [pushDataRemind, setPushDataRemind] = useState();
    const [jsonInputRemind, setJsonInputRemind] = useState();
    const [monitorId, setMonitorId] = useState();
    const [dataFormResp, setDataFormResp] = useState();
    const [dataFormObjKey, setDataFormObjKey] = useState();
    const [dataFormIOObjKeyId, setDataFormIOObjKeyId] = useState();
    const [jsonOptions, setJsonOptions] = useState({});
    const [jsonDependent, setJsonDependent] = useState([]);
    const [jsonExpression, setJsonExpression] = useState({});
    const [monitor, setMonitor] = useState();
    const [qrCode, setQrCode] = useState(false);
    const [firstLoad, setFirstLoad] = useState(true);
    const [qrStr, setQrStr] = useState();

    //
    const urlSocket = SOCKET_SERVICE;
    const connection = new WebSocket(urlSocket);

    const [modal, setModal] = useState(false);
    const toggleModal = () => setModal(!modal);

    useEffect(() => {
        if (!hasOCR) {
            // hasOCR = route.snapshot?.data?.hasOCR;
        }

        if (isMonitor === null) {
            // isMonitor = route.snapshot?.data?.isMonitor;
        }

        if (!monitorCode) {
            // monitorCode = JSON.parse(<string>route.snapshot.queryParamMap.get('monitorCode'));
        }

        setChannel((window.location != window.parent.location) ? document.referrer : document.location.hostname);
        setInnerHeight(window.innerHeight)
        connection.onerror = error => {
            console.warn(`Error from WebSocket: ${error}`);
        };

        parseValue();
        //init data nguoi dung nhap dang dỡ trước đó.
        initRemindData();

        document.getElementById('fpt_ai_livechat_button')?.classList.remove('d-none');
        document.getElementById('fpt_ai_livechat_button_tooltip')?.classList.remove('d-none');
    }, [])

    const initRemindData = () => {
        let frmId = localStorage.getItem('remindFrm');
        let frmData = localStorage.getItem('remindData');
        if (urlId === frmId && frmData && hasOCR) {// so sanh neu là form truoc đó đang nhập
            Swal.fire({
                // tslint:disable-next-line: max-line-length
                title: 'Quý khách có muốn tiếp tục với dữ liệu đã nhập trước đó?',
                html: 'Xác nhận tiếp tục?',
                type: 'question',
                imageHeight: 150,
                imageWidth: 320,
                imageClass: 'img-responsive',
                animation: false,
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Đồng ý',
                cancelButtonText: 'Bỏ qua',
            }).then((result) => {
                if (result.value) {
                    setPushDataRemind(true);
                    setJsonInputRemind(JSON.parse(String(frmData)));
                } else {
                    setPushDataRemind(false);
                    localStorage.removeItem('remindFrm');
                    localStorage.removeItem('remindData');
                }
            });
        }
    }

    const parseValue = () => {
        // Get the query string value from our route
        // console.log('parseValue monitorCode', monitorCode);
        if (monitorCode) {
            setIsUpdate(true)

            request.post(api.FETCH_SIGN_FORM_BY_MONITOR_CODE, {monitorCode}).then(res => {
                if (res.data) {
                    const resp = res?.data;

                    setFileData(resp?.fileData)
                    setSubmitTeller(resp?.submitTeller)
                    setFormFieldList(resp?.formFieldList)
                    setInfoByMonitorCode(resp)

                    const jvu = JSON.parse(JSON.stringify(jsonValueUpdate));
                    console.log('jvu 0', jvu)
                    resp?.formFieldList.map((x: any) => {
                        jvu[x.fieldName] = x?.fieldValue;
                    });
                    console.log('jvu 1', jvu)
                    setJsonValueUpdate(jvu)
                }
            });
        } else {
            const jv = JSON.parse(JSON.stringify(jsonValue));
            console.log('jv 0', jv)
            formFieldList.map((x: any) => {
                jv[x.fieldName] = x.fieldValue;
                // jv[x.fieldName] = formIndex?.data['aaa'];
            });
            console.log('jv 1', jv)
            // localStorage.setItem('JsonValue', JSON.stringify(jv))
            setJsonValue(jv)
        }
    }

    useEffect(() => {
        console.log('jv 2', jsonValue)
        localStorage.setItem('JsonValue', JSON.stringify(jsonValue))
    }, [jsonValue])

    const createMonitor = (docName) => {
        const payload = {
            formId: urlId,
            // formData: '',
            channel: channel
        };
        request.post(api.SIGN_FORM_MONITOR, payload).then(res => {
            if (res && res.data) {
                setMonitorId(res.data?.id);
                setMonitorCode(res.data?.code);
                let noti = {
                    text: monitorCode,
                    subText: docName,
                    icon: 'mdi mdi-comment-account-outline',
                    bgColor: 'primary',
                    redirectTo: '/form-tracking/' + monitorId
                };
                localStorage.setItem('noti', JSON.stringify(noti));
            }
        });
        //tra vè id vua insert xong
        //khi submit xong => xoa monitor
        //Khi tắt tab => xoa mobitor
    }

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
            // localStorage.removeItem('JsonOptions')
            // localStorage.removeItem('JsonValue')
            const {Annotations} = instance.Core;
            annotationManager = instance.Core.annotationManager
            documentViewer = instance.Core.documentViewer
            wvInstance = instance;

            setAnnotationManager(annotationManager)
            setWvInstance(instance)
            setDocumentViewer(documentViewer)

            // custom style
            Annotations.WidgetAnnotation['getCustomStyles'] = widget => {
                if (widget instanceof Annotations.TextWidgetAnnotation) {
                    // can check widget properties
                    return {
                        // 'background-color': 'lightblue',
                        color: '#2e4b8b',
                        fontWeight: 'bold',
                        border: '0px',
                    };

                }

                if (widget instanceof Annotations.SignatureWidgetAnnotation) {
                    // can check widget properties
                    return {
                        // 'background-color': 'white',
                        'opacity': 0,
                        // border: '2px',
                    };
                }

                if (widget instanceof Annotations.RadioButtonWidgetAnnotation) {
                    // can check widget properties
                    return {
                        // 'background-color': 'lightblue',
                        color: '#2e4b8b',
                        fontWeight: 'bold',
                        border: '0px',
                    };

                }
            };

            Annotations.WidgetAnnotation['getContainerCustomStyles'] = widget => {
                if (widget instanceof Annotations.WidgetAnnotation) {
                    return {
                        border: '0px',
                    };
                }
            };

            // you can now call WebViewer APIs here...
            instance.UI.disableElements(['header']);
            instance.UI.disableElements(['toolsHeader']);
            instance.UI.disableElements(['downloadButton']);
            instance.UI.disableElements(['printButton']);
            instance.UI.disableFeatures([instance.UI.Feature.TextSelection]);
            // coreControlsEvent.emit(instance.UI.LayoutMode.Single);
            request.post(api.PAGING_API_REQUEST, {}).then(res => {
                if (res.data) {
                    setListAPI(res.data);
                }

                loadByUseAt(instance, res.data);
            }).catch(e => loadByUseAt(instance))

            documentViewer.addEventListener('documentLoaded', () => {
                documentViewer.getAnnotationsLoadedPromise().then(() => {

                    setValueFields();

                    if (hidden) {
                        downloadFile(null, documentViewer, annotationManager);
                    }
                    if (pushDataRemind) {
                        passValueIntoFile(jsonInputRemind);
                    }
                });
                instance.UI.setZoomLevel(2);
            });

            annotationManager.addEventListener('fieldChanged', (field, value) => {

                onChangeField(field, value, annotationManager);

                const jsonInputTemp = jsonInput
                const index = jsonInputTemp?.findIndex(h => h.fieldName === field.name);
                if (index > -1) {
                    jsonInputTemp.splice(index, 1);
                }
                jsonInputTemp.push({
                    fieldName: field.name,
                    fieldValue: value,
                });

                setJsonInput(jsonInputTemp)

                if (!firstLoad) {
                    sendAnnotationChange(jsonInputTemp, 'text');
                    setDataLocalStore();
                }
            });


            annotationManager?.addEventListener('annotationChanged', async (e: any) => {
                console.log('annotationManager', e)
                // If annotation change is from import, return
                if (e.imported) {
                    return;
                }
                const xfdfString = await annotationManager.exportAnnotationCommand();
                // Parse xfdfString to separate multiple annotation changes to individual annotation change
                const parser = new DOMParser();
                const commandData = parser.parseFromString(xfdfString, 'text/xml');
                const addedAnnots = commandData.getElementsByTagName('add')[0];
                const modifiedAnnots = commandData.getElementsByTagName('modify')[0];
                const deletedAnnots = commandData.getElementsByTagName('delete')[0];

                // List of added annotations
                addedAnnots.childNodes.forEach((child) => {
                    sendAnnotationChange(child, 'add');
                });

                // List of modified annotations
                modifiedAnnots.childNodes.forEach((child) => {
                    sendAnnotationChange(child, 'modify');
                });

                // List of deleted annotations
                deletedAnnots.childNodes.forEach((child) => {
                    sendAnnotationChange(child, 'delete');
                });
            });

            connection.onmessage = async (message) => {
                const annotation = JSON.parse(message.data);
                if (annotation.documentId === monitorCode) {
                    const annotations = await annotationManager.importAnnotationCommand(annotation.xfdfString);
                    await annotationManager.drawAnnotationsFromList(annotations);
                }
            };

            setTimeout(() => {
                // if(innerHeight > 800) {
                instance.UI.setZoomLevel(2);
                // }
            }, 2500);
            setTimeout(() => {
                setFirstLoad(false)
            }, 3000)
        });
    }, []);

    const setDataLocalStore = () => {
        const jsonData = JSON.stringify(jsonInput);
        localStorage.setItem('remindData', jsonData);
        localStorage.setItem('remindFrm', urlId);
    }

    const sendAnnotationChange = (annotation, action) => {
        const serializer = new XMLSerializer();
        if (annotation.nodeType !== annotation.TEXT_NODE && action != 'text') {
            const annotationString = serializer?.serializeToString(annotation);
            connection?.send(JSON.stringify({
                documentId: monitorId,
                annotationId: annotation.getAttribute('name'),
                xfdfString: convertToXfdf(annotationString, action)
            }));
        } else if (action === 'text') {
            connection?.send(JSON.stringify({
                documentId: monitorId,
                xfdfString: annotation
            }));
        }
    }

    const convertToXfdf = (changedAnnotation, action) => {
        let xfdfString = `<?xml version="1.0" encoding="UTF-8" ?><xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve"><fields />`;
        if (action === 'add') {
            xfdfString += `<add>${changedAnnotation}</add><modify /><delete />`;
        } else if (action === 'modify') {
            xfdfString += `<add /><modify>${changedAnnotation}</modify><delete />`;
        } else if (action === 'delete') {
            xfdfString += `<add /><modify /><delete>${changedAnnotation}</delete>`;
        }
        xfdfString += `</xfdf>`;
        return xfdfString;
    }


    const onChangeField = (field, value) => {
        console.log('fieldChanged', field, field?.name, value);
        jsonValue[field?.name] = value;
        onChangeDependent(field, value);

        console.log('jsonExpression', jsonExpression);
        console.log('jsonValue', jsonValue);
        if (jsonExpression !== {}) {
            const exp = jsonExpression[field?.name]?.expression?.replaceAll('${', 'jsonValue[\'')?.replaceAll('}', '\']');
            // console.log('${expression}', exp)
            // console.log('${soTien}', eval(exp))

            try {
                const value = eval(exp);

                // if (value) {
                jsonValue[jsonExpression[field?.name]?.field] = value;
                const fieldManager = annotationManager?.getFieldManager();
                const fieldN = fieldManager.getField(jsonExpression[field?.name]?.field);
                fieldN?.setValue(value || '');
                // }
            } catch (e) {
                if (e instanceof SyntaxError) {
                    console.log(e.message);
                }
            }

        }
    }

    const onChangeDependent = (field, value) => {
        const jsonD = JSON.parse(JSON.stringify(jsonDependent))
        jsonD?.map(jd => {
            if ((jd.field === field?.name) && value) {
                let dependentBody: any = isJSON(jd?.arrFormField?.dependentBody) ? JSON.parse(jd?.arrFormField?.dependentBody) : jd?.arrFormField?.dependentBody;
                dependentBody[jd.fieldMap] = value;
                jd.arrFormField.dependentBody = JSON.stringify(dependentBody);
                jd.api.body = JSON.stringify(dependentBody);

                sendRequest(jd.api, [jd.arrFormField]);
            }
        });

        setJsonDependent(jsonD)
    }

    const passValueIntoFile = (jsonData) => {
        const fieldManager = annotationManager?.getFieldManager();
        if (jsonData) {
            for (let i = 0; i < jsonData?.length; i++) {
                const field = fieldManager.getField(jsonData[i].fieldName);
                field?.setValue(jsonData[i].fieldValue);
            }
        }
    }

    const downloadFile = async (blob = null, docView = documentViewerState, annoM = annotationManagerState) => {
        if (!blob) {
            const doc = docView?.getDocument();
            const xfdfString = await annoM?.exportAnnotations();
            const data = await doc?.getFileData({
                xfdfString,
                flatten: true
            });
            const arr = new Uint8Array(data);
            blob = new Blob([arr], {type: 'application/pdf'});
        }

        if (isDownFile) {
            const a = document.createElement('a');
            a.href = window.URL.createObjectURL(blob);
            a.download = formIndex?.formName + '.pdf';
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();

            if (props?.hasOwnProperty('isEndDown')) {
                props?.isEndDown()
            }
        }

        if (props?.hasOwnProperty('outFileData')) {
            props?.outFileData()
        }

        setLoading(false)
    }

    const loadByUseAt = (instance, listAPITemp = listAPI) => {
        request.post(api.GET_FORM_BY_USE_AT, {id: urlId}).then(res => {
            if (res && res.data?.formData) {
                if (props?.viewTemplateOnly) {
                    instance.UI.loadDocument(res.data?.formData);
                } else {
                    setDataFormResp(res.data);
                    setDataFormObjKey(res.data?.formFieldList?.reduce((object, item) => {
                        object[item.id] = item;
                        object[item.fieldName] = item;
                        return object;
                    }, {}));

                    setDataFormIOObjKeyId(initPanels()?.reduce((object, item) => {
                        object[item.id] = item;
                        return object;
                    }, {}));

                    const dataResp: any = res.data;
                    if (fileData) {
                        dataResp.formData = fileData;
                    }
                    // console.log('expression', dataResp?.formFieldList?.map(x => x?.id + ' : ' + x?.fieldName + ' - ' + x?.expression))

                    setFormFieldListConfig(dataResp?.formFieldList);

                    const jv = JSON.parse(JSON.stringify(jsonValue));
                    console.log('jv 0', jv)
                    dataResp?.formFieldList.map(x => {
                        // hard code
                        // jv[x.fieldName] = x.fieldValue;
                        if(x?.regex) {
                            console.log('regex', x?.regex)
                        }
                        jv[x.fieldName] = formIndex[x?.regex];
                        console.log('jv 1', jv)
                        // localStorage.setItem('JsonValue', JSON.stringify(jv))


                        if (x?.expression) {
                            const regex = /[${?]+([\w+])+}/gi;
                            const found = x?.expression.match(regex);
                            const listFielDependent = found?.map(y => y.replace('${', '').replace('}', ''));

                            const jsonExpressionTemp = jsonExpression
                            listFielDependent?.map(y => {
                                jsonExpressionTemp[y] = {
                                    expression: x?.expression,
                                    field: x.fieldName,
                                    listDept: listFielDependent
                                };
                            });
                            setJsonExpression(jsonExpressionTemp)

                        }
                    });

                    setJsonValue(jv)
                    setMonitor(dataResp?.monitor)
                    setQrCode(dataResp?.qrCode === 'Y')
                    if (dataResp?.monitor && dataResp?.qrCode === 'Y' && !isUpdate) {
                        createMonitor(dataResp?.name);
                    }
                    // Call API Config
                    if (hasOCR) {
                        if (dataResp?.hasOCR) {
                            // alert("Nhập OCR")
                            // const popupOCR = modalService.open(FormAPIConfig, {
                            //     size: 'lg',
                            //     backdrop: 'static',
                            //     centered: true
                            // });
                            // popupOCR.componentInstance.passEntry.subscribe(files => {
                            //     if (files) {
                            //         fileStore = files;
                            //         sendAPIConfig(dataResp, true);
                            //     }
                            //
                            //     sendAPIConfig(dataResp);
                            //     initSmartForm(dataResp, instance);
                            // });
                        } else {
                            sendAPIConfig(dataResp, false, listAPITemp, instance);
                            initSmartForm(dataResp, instance);
                        }
                    } else {
                        instance.UI.loadDocument(dataResp?.formData);
                        initSmartForm(dataResp, instance)
                    }

                }
            } else {
                Toast('Không tìm thấy thông tin biểu mẫu!', TypeToast.ERROR);
            }
        });
    }

    const initSmartForm = (dataResp, instance) => {
        instance.UI.loadDocument(dataResp?.formData);
        console.log('<<<<<<<<<<<<<<initSmartForm<<<<<<<<<<<<<<');
        console.log('dataResp', dataResp);
        console.log('jsonValue', jsonValue);
        console.log('>>>>>>>>>>>>>>initSmartForm>>>>>>>>>>>>>>');

        if (dataResp?.formioConfig && dataResp?.formioConfig?.length > 10) {
            openModalSmartForm();
        }
    }

    const openModalSmartForm = () => {
        // modalSmartForm = modalService.open(smartForm, {
        //     size: 'lg',
        //     backdrop: 'static',
        //     centered: true
        // });
    }

    const sendAPIConfig = (dataResp, ocr = false, listAPITemp = listAPI, instance = wvInstanceState) => {
        const arrConfig = dataResp?.formFieldList?.filter(x => x?.requestApiId);
        const arrApiConfig = Array.from(new Set(arrConfig?.map(x => x?.requestApiId)));

        console.log('arrApiConfig', arrApiConfig);
        console.log('listAPI', listAPITemp);

        for (const x of arrApiConfig) {
            const api = listAPITemp.find(y => y?.id === x);
            const arrFormFieldDependent = arrConfig?.filter(y => y?.requestApiId === x && y.dependentBody);
            const arrFormField = arrConfig?.filter(y => y?.requestApiId === x && !y.dependentBody);

            const jsonDependentTemp = JSON.parse(JSON.stringify(jsonDependent)) || []
            // append dependentBody
            arrFormFieldDependent.forEach(y => {
                const dependentBody = JSON.parse(y.dependentBody);
                for (let prop in dependentBody) {
                    const field = dependentBody[prop];
                    if (dataResp?.formFieldList.find(z => z.fieldName === field)) {
                        jsonDependentTemp?.push({
                            api,
                            arrFormField: y,
                            fieldMap: prop,
                            field
                        });
                    }
                }
            });

            setJsonDependent(jsonDependentTemp)

            if (arrFormField.find(y => y?.requestApiId === x)) {
                if (ocr) {
                    if (api?.type === 'OCR') {
                        sendRequest(api, arrFormField, instance);
                    }
                } else {
                    if (api?.type !== 'OCR') {
                        sendRequest(api, arrFormField, instance);
                    }
                }
            }

            //
        }
    }

    const sendRequest = (apiRes, arrFormField, instance = wvInstanceState) => {
        console.log('sendRequest api', apiRes);
        console.log('sendRequest arrFormField', arrFormField);
        setLoading(true)
        const jsonPayload = {
            url: apiRes?.url,
            method: apiRes?.method,
            type: apiRes?.type,
            name: apiRes?.name,
        };
        switch (apiRes?.method) {
            case 'GET': {
                const headers = constructObject('Headers', apiRes);

                const payload = {
                    ...jsonPayload,
                    header: JSON.stringify(headers)
                };

                request.post(api.MAKE_API_REQUEST, payload).then(
                    res => {
                        const responseData = JSON.parse(JSON.stringify(res.data, undefined, 4));
                        patchValueFromConfig(arrFormField, responseData);

                    }).catch(error => {
                    const responseError = JSON.stringify(error, undefined, 4);
                    handleErrorFromConfig(responseError);
                })

                break;
            }
            case 'POST': {
                switch (apiRes?.type) {
                    case 'IDCHECK': {

                        setTimeout(() => {
                            const responseData = localStorage.getItem('cccdData');
                            console.log('IDCHECK responseData', responseData);
                            patchValueFromConfig(arrFormField, responseData);
                            setLoading(false)
                        }, 1000);
                        break;
                    }
                    case 'REST': {
                        const apiN = apiRes;
                        const headers = constructObject('Headers', apiRes);
                        //
                        // if (api.id === 'd88438be-3450-11ee-a291-cb91c400a073') {
                        //     const bodyN = JSON.parse(apiN.body);
                        //     bodyN.customerCode = localStorage.getItem('userIB') || bodyN.customerCode;
                        //     bodyN.userId = localStorage.getItem('userIB') || bodyN.userId;
                        //
                        //     apiN.body = JSON.stringify(bodyN);
                        // }

                        const body = constructObject('Body', apiN);


                        const payload = {
                            ...jsonPayload,
                            header: JSON.stringify(headers),
                            body: JSON.stringify(body)
                        };

                        request.post(api.MAKE_API_REQUEST, payload).then(
                            res => {
                                const responseData = JSON.stringify(res.data, undefined, 4);
                                // const responseData = JSON.stringify(res, undefined, 4);
                                console.log('responseData', JSON.parse(responseData))
                                patchValueFromConfig(arrFormField, JSON.parse(responseData), instance);
                            }).catch(error => {
                            const responseError = JSON.stringify(error, undefined, 4);
                            handleErrorFromConfig(responseError);
                        });
                        break;
                    }
                    case 'SOAP': {
                        const headers = constructObject('Headers', apiRes);

                        const payload = {
                            url: apiRes?.url,
                            method: apiRes?.method,
                            type: apiRes?.type,
                            name: apiRes?.name,
                            header: JSON.stringify(headers),
                            body: apiRes?.body
                        };

                        request.post(api.MAKE_API_REQUEST, payload).then(
                            res => {
                                const responseData = res.data;
                                patchValueFromConfig(arrFormField, responseData);
                            }).catch(
                            error => {
                                const responseError = JSON.stringify(error, undefined, 4);
                                handleErrorFromConfig(responseError);
                            }
                        );
                        break;
                    }
                    case 'OCR': {
                        fileStore.forEach(x => {
                            const formData = new FormData();
                            formData.append('image', x);

                            // Fake call OCR
                            // patchValueFromConfig(arrFormField, JSON.stringify({
                            //     data: [
                            //         {
                            //             name: 'Nguyễn Trung Tín',
                            //             features: 'NỐT RUỒI C:0CM8 TRÊN TRƯỚC CÁNH MŨI TRÁI::'
                            //         }
                            //     ]
                            // }))

                            //Mở popup lấy cmnd
                            sendFormDataRequest(
                                apiRes?.url,
                                formData,
                                constructObject('Headers', apiRes)
                            ).then(
                                data => {
                                    const responseData = JSON.stringify(data, undefined, 4);
                                    patchValueFromConfig(arrFormField, responseData);

                                }).catch(
                                error => {
                                    const responseError = JSON.stringify(error, undefined, 4);
                                    handleErrorFromConfig(responseError);

                                }
                            );
                        });
                        break;
                    }
                    default:
                        patchValueFromConfig(arrFormField, {});
                        break;
                }
                break
            }
            default:
                patchValueFromConfig(arrFormField, {});
                break;
        }

    }

    const sendFormDataRequest = (url, payload, headers) => {
        console.log('url', url);
        console.log('headers', headers);
        console.log('payload', payload);
        return request.postFormData(url, payload, {headers})
    }

    const parseData = (resp, fields) => {
        let value = resp;
        fields?.map((x: any) => {
            if (value?.hasOwnProperty(x)) {
                value = value[x];
            }
        });
        return value || resp;
    }

    const patchValueFromConfig = (arrFormField, res, instance = wvInstanceState) => {
        let resp = isJSON(res) ? JSON.parse(res) : res;
        let respList = JSON.parse(JSON.stringify(resp));
        if (resp?.hasOwnProperty('data')) {
            respList = resp?.data;
        }
        console.log('patchValueFromConfig', resp, isJSON(res));
        console.log('patchValueFromConfig arrFormField', arrFormField);

        patchValueUpdate();

        const jOptions = JSON.parse(JSON.stringify(jsonOptions))
        const jv = JSON.parse(JSON.stringify(jsonValue));

        arrFormField?.map((x: any) => {

            const apiFieldLabel = x.pathFieldLabel?.replaceAll('\'', '')?.split('.');
            const apiFieldValue = x.pathFieldValue?.replaceAll('\'', '')?.split('.');

            let label = apiFieldLabel ? parseData(resp, apiFieldLabel) : '';
            let value = parseData(resp, apiFieldValue);
            //
            // console.log('jOptions apiFieldLabel', apiFieldLabel);
            // console.log('jOptions apiFieldValue', apiFieldValue);
            console.log('jOptions x.fieldName', x.fieldName);


            if (x?.fieldType === 'ComboBoxFormField') {
                jOptions[x.fieldName] = respList?.map(z => {
                    return {
                        displayValue: parseData(z, apiFieldLabel.slice(1)),
                        value: parseData(z, apiFieldValue.slice(1)).toString()
                    };
                });
            }

            if (value && (typeof value !== 'object')) {
                console.log('patchValueFromConfig x.fieldName 0', x.fieldName, value, jsonValue[x.fieldName]);
                jv[x.fieldName] = value;
                console.log('patchValueFromConfig x.fieldName 1', x.fieldName, value, jsonValue[x.fieldName]);
                // setValueFormIO();
                setValueFields(jOptions, jv, instance)
            }
        });


        localStorage.setItem('JsonOptions', JSON.stringify(jOptions))
        setJsonOptions(jOptions)
        setJsonValue(jv)
        setLoading(false)

        closePopupOCR();
    }

    const handleErrorFromConfig = (respError) => {
        const resp = JSON.parse(respError);
        Toast(resp?.message, TypeToast.ERROR)
        setLoading(false)
        closePopupOCR();
    }

    const closePopupOCR = () => {

    }

    const setValueFields = (jOptions = jsonOptions, jValue = jsonValue, instance = wvInstanceState) => {
        const now = new Date().toLocaleDateString('en-GB');
        patchValueUpdate();
        // iterate over fields
        console.log('>>>>>>>>>>>>>>setValueFields>>>>>>>>>>>>>>>');
        const jv = JSON.parse(localStorage.getItem('JsonValue')) || jValue;
        console.log('jv 3', jv);
        const fieldManagerTemp = annotationManager.getFieldManager();
        fieldManagerTemp?.forEachField(x => {

            console.log('setValueFields fieldManager x', x)
            const field = fieldManagerTemp.getField(x?.SZ);
            console.log('setValueFields field', field)
            console.log('setValueFields field value', field.getValue())
            if (field.getValue() === 'new Date()') {
                jv[x?.SZ] = now;
            }

            if (jv.hasOwnProperty(x?.SZ)) {
                if (x.getFieldType() === 'CheckBoxFormField') {
                    if (x?.SZ.search('isGioiTinhNam') != -1) {
                        field?.setValue(jv[x?.SZ].toUpperCase() === 'NAM' ? 'Yes' : 'No');
                    } else if (x?.SZ.search('isGioiTinhNu') != -1) {
                        field?.setValue(jv[x?.SZ].toUpperCase() !== 'NAM' ? 'Yes' : 'No');
                    } else {
                        field?.setValue(jv[x?.SZ] ? 'Yes' : 'No');
                    }
                } else {
                    console.log('voo ddaay', jv, x?.SZ);
                    field.setValue(jv[x?.SZ]);
                }
            }

            console.log('setValueFields jOptions', jOptions)

            const options = JSON.parse(localStorage.getItem('JsonOptions')) || jOptions;
            console.log('setValueFields jOptions localStorage', options)
            if (options.hasOwnProperty(x?.SZ)) {
                // Set list option in combobox


                if (x.getFieldType() === 'ComboBoxFormField') {
                    x.ue.zh = options[x?.SZ];
                    // if (options[x?.SZ]?.length > 0) {
                    // field.setValue("71da68ca-e11d-11ee-810e-63cb93337a2f")
                    // }
                }

            }
        });
        console.log('<<<<<<<<<<<<<<<<setValueFields<<<<<<<<<<<<<<<<');

    }

    const patchValueUpdate = () => {
        console.log('patchValueUpdate .toString()', Object.keys(jsonValueUpdate).length);

        if (Object.keys(jsonValueUpdate).length > 0 && jsonValueUpdate.constructor === Object) {
            // console.log('patchValueUpdate', jsonValueUpdate)
            setJsonValue(JSON.parse(JSON.stringify(jsonValueUpdate)));
            setJsonValueUpdate({})
        }
    }

    const constructObject = (ctx, api) => {
        let context;
        if (ctx === 'Body') {
            context = deconstructObject(JSON.parse(api?.body), 'Body');
        } else if (ctx === 'Headers') {
            context = deconstructObject(JSON.parse(api?.header), 'Headers');
        }
        let constructedObject = {};
        constructedObject
            = context
            .reduce((object, item) => {
                object[item.key] = item.value;
                return object;
            }, {});
        return constructedObject;
    }

    const deconstructObject = (object, type) => {
        const objectArray: any[] = [];

        switch (type) {
            case 'Body': {
                Object.keys(object).forEach((objKey, index) => {
                    const obj = {key: objKey, value: object[objKey]};
                    objectArray.push(obj);
                });
                break;
            }
            case 'Headers': {
                Object.keys(object).forEach(objKey => {
                    const obj = {key: objKey, value: object[objKey]};
                    objectArray.push(obj);
                });
                break;
            }
        }

        return objectArray;
    }

    const initPanels = () => {
        return dataFormResp?.hasOwnProperty('formioConfig') ? JSON.parse(dataFormResp?.formioConfig) : [];
    }

    const copy = () => {
        const copyText = document.getElementById(monitorCode);

        // Select the text field
        // copyText?.select();
        // copyText?.setSelectionRange(0, 99999); // For mobile devices

        // Copy the text inside the text field
        navigator.clipboard.writeText(monitorCode);
        Toast('Mã hồ sơ copy thành công')
    }

    const saveFormInfo = () => {
        setLoading(true)
        const formFieldConfig = formFieldListConfig.reduce((map, obj: any) => {
            map[obj?.fieldName] = {
                required: obj?.required,
                regex: obj?.regex
            };
            return map;
        }, {});

        const formFieldListTemp: any = [];
        // documentViewer.getAnnotationsLoadedPromise().then(async () => {
        const fieldManagerTemp = annotationManagerState?.getFieldManager();
        fieldManagerTemp.forEachField(x => {
            console.log('setValueFields fieldManagerTemp x', x)
            // console.log('fieldManagerTemp', x, x?.SZ, x.getFieldType(), x.getValue())
            // console.log((document as any).getElementById('webviewer-1').contentWindow.document?.getElementById(x?.SZ)?.click())

            formFieldListTemp.push({
                fieldName: x?.SZ,
                fieldValue: x.getValue(),
                required: formFieldConfig[x?.SZ]?.required,
                regex: formFieldConfig[x?.SZ]?.regex,
            });
        });

        const requiredErrs = formFieldListTemp.filter(x => x.required && !x.fieldValue);
        const regexErrs = formFieldListTemp.filter(x => {
            if (x?.regex) {
                const regex = new RegExp(x?.regex);
                if (x.fieldValue) {
                    return !regex.test(x.fieldValue);
                }
                return x;
            }

        });
        const fieldsErr = [...requiredErrs, ...regexErrs];

        const {Annotations} = wvInstanceState?.Core;

        Annotations.WidgetAnnotation['getContainerCustomStyles'] = widget => {
            if (widget instanceof Annotations.WidgetAnnotation) {
                if (fieldsErr.find(x => widget.fieldName === x.fieldName)) {
                    return {
                        border: '1px solid red',
                    };
                } else {
                    return {
                        border: '0px',
                    };
                }
            }
        };

        onRedarw();

        if (fieldsErr?.length > 0) {
            // const elem = (document as any).getElementById('webviewer-1').contentWindow.document.getElementById(fieldsErr[0].fieldName)
            // elem.scroll({
            //     top: 100,
            //     left: 100,
            //     behavior: "smooth",
            // })
            Toast('Vui lòng nhập đầy đủ và đúng định dạng thông tin cần thiết', TypeToast.WARNING)
            setLoading(false)
        } else {
            // Submit form
            signForm(formFieldListTemp);
        }
        // })
    }

    const onRedarw = () => {
        for (let i = 0; i < documentViewerState?.getPageCount(); i++) {
            // Redraw canvas
            annotationManagerState?.drawAnnotations(
                {
                    pageNumber: i + 1,
                    overrideCanvas: null,
                    majorRedraw: true
                }
            );
        }
    }
    const signForm = async (formFieldLs) => {
        const doc = documentViewerState?.getDocument();
        const xfdfString = await annotationManagerState?.exportAnnotations();
        const data = await doc.getFileData({
            xfdfString,
            flatten: false
        });
        const arr = new Uint8Array(data);
        const blob: any = new Blob([arr], {type: 'application/pdf'});

        const reader = new FileReader();
        reader.readAsDataURL(blob);

        reader.onload = () => {
            const base64data: any = reader.result;

            // const a = document.createElement('a');
            // a.href = window.URL.createObjectURL(blob);
            // a.download = 'test2610.pdf';
            // a.style.display = 'none';
            // document.body.appendChild(a);
            // a.click();

            let payload: any = {
                formId: urlId,
                formFieldList: formFieldLs,
                channel: channel,
                fileData: base64data,
                monitorCode: monitorCode,
                // userId: // Có khi thao tác update thông tin khi bị return
            };

            // downloadFile(blob);

            console.log('payload', payload);
            // return
            if (isUpdate) {
                payload.id = infoByMonitorCode?.id;
                payload.skipProcess = submitTeller;
                payload.status = infoByMonitorCode?.status + 1;

                request.post((payload?.skipProcess ? api.APPROVE_SIGN_FORM : api.RE_SUBMIT_FORM), payload).then(res => {
                    if (res?.errorCode === 'OK') {
                        setQrStr(res.data?.formId);
                        setFileData(res.data?.fileData);
                        setInfoByMonitorCode(res.data);
                        Toast(res?.errorDesc, TypeToast.SUCCESS);
                        setLoading(false)
                        if (!qrCode) {
                            resetForm();
                        } else {
                            if (payload.skipProcess) {
                                if (props?.hasOwnProperty('isEndDown')) {
                                    props?.isEndDown()
                                }
                            } else {
                                openQRCode();
                            }
                        }

                    } else {
                        Toast(res?.errorDesc, TypeToast.ERROR);
                        setLoading(false)
                    }
                    setJsonInputRemind([]);
                    localStorage.removeItem('remindData');
                    localStorage.removeItem('remindFrm');
                }, err => {
                    Toast('Cập nhật thông tin thất bại', TypeToast.ERROR);
                    setLoading(false)
                });
            } else {
                // payload.endProcess = true;
                request.post(api.SIGN_FORM, payload).then(res => {
                    if (res?.errorCode === 'OK') {
                        setQrStr(res.data?.monitorCode);
                        Toast(res?.errorDesc, TypeToast.SUCCESS);
                        setLoading(false)
                        if (!qrCode) {
                            resetForm();
                        } else {
                            openQRCode();
                        }
                    } else {
                        Toast(res?.errorDesc, TypeToast.ERROR);
                        setLoading(false)
                    }
                    setJsonInputRemind([]);
                    localStorage.removeItem('remindData');
                    localStorage.removeItem('remindFrm');
                }, err => {
                    Toast('Cập nhật thông tin thất bại', TypeToast.ERROR);
                    setLoading(false)
                });
            }

        };
    }

    const openQRCode = () => {
        toggleModal();
    }

    const resetForm = () => {
        localStorage.removeItem('JsonOptions')
        console.log('resetForm', wvInstanceState)
        wvInstanceState?.UI.disableElements(['header']);
        wvInstanceState?.UI.disableElements(['toolsHeader']);
        wvInstanceState?.UI.disableElements(['downloadButton']);
        wvInstanceState?.UI.disableElements(['printButton']);
        wvInstanceState?.UI.disableFeatures([wvInstanceState?.UI.Feature.TextSelection]);
        // coreControlsEvent.emit(wvInstance.UI.LayoutMode.Single);
        loadByUseAt(wvInstanceState);
        documentViewerState?.addEventListener('documentLoaded', () => {
            documentViewerState?.getAnnotationsLoadedPromise().then(() => {

                setValueFields();

                if (hidden) {
                    downloadFile(null, documentViewer, annotationManager);
                }
                if (pushDataRemind) {
                    passValueIntoFile(jsonInputRemind);
                }
            });
            wvInstanceState?.UI.setZoomLevel(2);
        });
        annotationManagerState?.addEventListener('fieldChanged', (field, value) => {
            console.log('fieldChanged', field, value);
            onChangeField(field, value);

            const index = jsonInput?.findIndex(h => h.fieldName === field.name);
            if (index > -1) {
                jsonInput.splice(index, 1);
            }
            jsonInput.push({
                fieldName: field.name,
                fieldValue: value,
            });

            if (!firstLoad) {
                sendAnnotationChange(jsonInput, 'text');
                setDataLocalStore();
            }
        });
        annotationManagerState?.addEventListener('annotationChanged', async (e: any) => {
            console.log('annotationChanged', e);
            // If annotation change is from import, return
            if (e.imported) {
                return;
            }
            const xfdfString = await annotationManagerState?.exportAnnotationCommand();
            // Parse xfdfString to separate multiple annotation changes to individual annotation change
            const parser = new DOMParser();
            const commandData = parser.parseFromString(xfdfString, 'text/xml');
            const addedAnnots = commandData.getElementsByTagName('add')[0];
            const modifiedAnnots = commandData.getElementsByTagName('modify')[0];
            const deletedAnnots = commandData.getElementsByTagName('delete')[0];

            // List of added annotations
            addedAnnots.childNodes.forEach((child) => {
                sendAnnotationChange(child, 'add');
            });

            // List of modified annotations
            modifiedAnnots.childNodes.forEach((child) => {
                sendAnnotationChange(child, 'modify');
            });

            // List of deleted annotations
            deletedAnnots.childNodes.forEach((child) => {
                sendAnnotationChange(child, 'delete');
            });
        });

        connection.onmessage = async (message) => {
            const annotation = JSON.parse(message.data);
            const annotations = await annotationManagerState?.importAnnotationCommand(annotation.xfdfString);
            await annotationManagerState?.drawAnnotationsFromList(annotations);
        };
        setTimeout(() => {
            // if(innerHeight > 800) {
            wvInstanceState.UI.setZoomLevel(2);
            // }
        }, 2500);
        setTimeout(() => {
            setFirstLoad(false)
        }, 3000);
    }

    const downloadPdf = () => {
        wvInstanceState.UI.downloadPdf({
            includeAnnotations: true,
            flatten: true
        });
    }

    const printTemplate = () => {
        const canvas = document.getElementById('qrcode');
        const pngUrl = canvas?.toDataURL('image/png').replace('image/png', 'image/octet-stream');
        console.log('pngUrl', pngUrl);
        let downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = qrStr;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    return (
        <div hidden={hidden} class="container-fluid">

            <div className="">
                <div className="webviewer" ref={viewer} style={{height: innerHeight + 'px', display: 'block'}}></div>
            </div>

            <div className="row my-3 bottom-control">
                <div hidden={hideButtonSendInfo} className="vertical-center col-12 text-center pr-4">
                    {monitorCode && (
                        <span onClick={() => copy()} class="mr-2 btn btn-danger m-cursor" id={monitorCode}
                              style={{height: '32px'}}>{'Mã hồ sơ: ' + monitorCode}</span>
                    )}
                    {(infoByMonitorCode?.hasOwnProperty('status') && infoByMonitorCode?.status < 4 || !infoByMonitorCode?.hasOwnProperty('status')) && (
                        <button onClick={() => saveFormInfo()} className="btn btn-primary mr-2">
                            <i class="fas fa-paper-plane"></i> {isUpdate ? 'Cập nhật ' : 'Gửi '} thông tin
                        </button>
                    )}
                    <button onClick={() => downloadPdf()} className="btn btn-success">
                        <i class="fas fa-download"></i> Tải xuống
                    </button>
                </div>

                <div hidden={!hideButtonSendInfo} className="vertical-center col-12 text-center">
                    <button onClick={() => downloadPdf()} className="btn btn-success">
                        <i class="fas fa-download"></i> Tải xuống
                    </button>
                </div>
            </div>


            <div>
                <Modal isOpen={modal} toggle={toggleModal} centered
                       style={{height: window.outerHeight}}>
                    <ModalHeader toggle={toggleModal}>Mã QRCode</ModalHeader>
                    <ModalBody className='p-0'>
                        <div className={'text-center'}>
                            <QRCodeCanvas
                                id='qrcode'
                                value={qrStr || 'Hello'}
                                size={290}
                                level={'M'}
                                includeMargin={true}
                            />
                        </div>
                    </ModalBody>
                    <ModalFooter>

                        <Button color="secondary" onClick={() => {
                            resetForm();
                            toggleModal();
                        }}>
                            Cancel
                        </Button>

                        <Button color="primary" onClick={() => printTemplate()}>
                            Tải QR
                        </Button>

                    </ModalFooter>
                </Modal>
            </div>
        </div>
    );
}

export default PDFForm
